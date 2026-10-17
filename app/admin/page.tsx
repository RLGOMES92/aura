import { revalidatePath } from "next/cache";
import { getStats } from "@/lib/stats";
import { getSpend, setSpend, spendEnabled } from "@/lib/spend";
import { products } from "@/lib/products";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const eur = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

async function save(fd: FormData) {
  "use server";
  const allowed = new Set(products.map((p) => p.name));
  const spend: Record<string, number> = { ...(await getSpend()) };
  for (const [k, v] of fd.entries()) {
    if (!k.startsWith("spend:")) continue;
    const product = k.slice(6);
    const raw = String(v).trim().replace(",", ".");
    const amount = Number(raw);
    if (!allowed.has(product) || raw === "" || !Number.isFinite(amount) || amount < 0 || amount > 1_000_000) {
      throw new Error("Gasto inválido: usa um valor não negativo e um produto válido.");
    }
    spend[product] = amount;
  }
  await setSpend(spend);
  revalidatePath("/admin");
}

export default async function Admin() {
  const [{ rows, missing, orders, truncated }, spend] = await Promise.all([getStats(30), getSpend()]);

  // Include products without sales so their ad spend remains visible.
  const reportRows = [...rows];
  for (const product of products) {
    if (!reportRows.some((row) => row.product === product.name)) {
      reportRows.push({ product: product.name, orders: 0, units: 0, gross: 0, net: 0, printful: 0, fees: 0, costComplete: true });
    }
  }
  const data = reportRows.map((row) => {
    const contrib = row.net - row.printful - row.fees;
    const ads = spend[row.product] ?? 0;
    return { ...row, contrib, ads, profit: contrib - ads,
      roas: ads > 0 ? row.net / ads : null,
      be: contrib > 0 && row.costComplete ? row.net / contrib : null };
  });
  const sum = (k: "gross" | "net" | "contrib" | "ads" | "profit") => data.reduce((a, r) => a + r[k], 0);

  return (
    <main className="px-5 py-8">
      <h1 className="text-3xl font-black tracking-tight">Últimos 30 dias</h1>
      <p className="mt-1 text-sm text-stone">{orders} encomendas pagas. Valores estimados: IVA {Math.round(0.23 * 100)}% e taxas Stripe aproximadas.</p>
      {missing > 0 && <p role="alert" className="mt-2 text-sm text-red-600">{missing} pedidos sem custo confirmado da Printful. As margens e o lucro total ficam indisponíveis até os custos serem reconciliados.</p>}
      {truncated && <p role="alert" className="mt-2 text-sm text-red-600">Relatório limitado a 300 encomendas pagas; os totais podem estar incompletos.</p>}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead><tr className="border-b border-black">
            {["Produto", "Unid.", "Receita", "Margem antes de ads", "Ads", "Lucro", "ROAS", "ROAS mínimo"].map((h) => <th key={h} className="py-2 pr-3 font-semibold">{h}</th>)}
          </tr></thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.product} className="border-b border-black/20">
                <td className="py-2 pr-3 font-semibold">{r.product}</td>
                <td className="pr-3">{r.units}</td>
                <td className="pr-3">{brl(r.gross)}</td>
                <td className="pr-3">{r.costComplete ? brl(r.contrib) : "—"}</td>
                <td className="pr-3">{brl(r.ads)}</td>
                <td className={`pr-3 font-bold ${r.profit < 0 ? "text-red-600" : ""}`}>{r.costComplete ? brl(r.profit) : "—"}</td>
                <td className="pr-3">{r.roas ? r.roas.toFixed(2) : "—"}</td>
                <td className="pr-3">{r.be ? r.be.toFixed(2) : "—"}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className="py-2 pr-3">Total</td><td />
              <td className="pr-3">{brl(sum("gross"))}</td><td className="pr-3">{missing > 0 || truncated ? "—" : brl(sum("contrib"))}</td>
              <td className="pr-3">{brl(sum("ads"))}</td><td className="pr-3">{missing > 0 || truncated ? "—" : brl(sum("profit"))}</td><td /><td />
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">Gasto em anúncios (30 dias)</h2>
      {!spendEnabled ? (
        <p className="mt-2 text-sm text-stone">Define UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN para guardar o gasto.</p>
      ) : (
        <form action={save} className="mt-3 max-w-sm space-y-3">
          {products.map((product) => (
            <label key={product.name} className="flex items-center justify-between gap-3 font-semibold">
              {product.name}
              <input name={`spend:${product.name}`} inputMode="decimal" defaultValue={spend[product.name] ?? 0}
                className="w-28 border border-black bg-paper p-2 text-right" />
            </label>
          ))}
          <button className="w-full bg-black py-3 font-bold text-paper">Guardar gasto</button>
        </form>
      )}
      <p className="mt-6 max-w-md text-sm text-stone">
        ROAS = receita sem IVA ÷ gasto. ROAS mínimo = o ROAS a partir do qual não perdes dinheiro. Podes registar gastos mesmo antes da primeira venda; o ROAS só aparece quando houver receita.
      </p>
    </main>
  );
}

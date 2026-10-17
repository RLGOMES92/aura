"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { eur } from "@/lib/products";
import { ShippingProgress } from "./ShippingProgress";
import { BundleSummary } from "./BundleSummary";
import { bundleDiscount } from "@/lib/bundle";

export type CartItem = { slug: string; priceId: string; name: string; size: string; price: number; qty: number };
type Ctx = { add: (i: Omit<CartItem, "qty">) => void; open: () => void };
const CartCtx = createContext<Ctx>({ add: () => {}, open: () => {} });
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem("cart") ?? "[]");
      if (Array.isArray(saved)) setItems(saved as CartItem[]);
    } catch {
      // Um carrinho corrompido não deve impedir a loja de abrir.
    } finally {
      setHydrated(true);
    }
  }, []);
  useEffect(() => {
    // Não sobrescrever o carrinho persistido com o estado inicial vazio antes da hidratação.
    if (!hydrated) return;
    try { localStorage.setItem("cart", JSON.stringify(items)); } catch {}
  }, [items, hydrated]);

  const add: Ctx["add"] = (i) => {
    setItems((cur) => {
      const f = cur.find((c) => c.priceId === i.priceId);
      return f ? cur.map((c) => (c === f ? { ...c, qty: c.qty + 1 } : c)) : [...cur, { ...i, qty: 1 }];
    });
    setOpen(true);
  };
  const change = (priceId: string, d: number) =>
    setItems((cur) => cur.map((c) => (c.priceId === priceId ? { ...c, qty: c.qty + d } : c)).filter((c) => c.qty > 0));

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = bundleDiscount(items.map((i) => ({ slug: i.slug, qty: i.qty, unit: Math.round(i.price * 100) }))) / 100;
  const net = total - discount;
  const count = items.reduce((s, i) => s + i.qty, 0);

  async function checkout() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map(({ priceId, qty }) => ({ priceId, qty })), marketing }),
      });
      const { url } = await res.json();
      if (!res.ok || !url) throw new Error();
      window.location.href = url;
    } catch {
      setError("Não foi possível iniciar o pagamento. Tenta outra vez.");
      setLoading(false);
    }
  }

  return (
    <CartCtx.Provider value={{ add, open: () => setOpen(true) }}>
      <div className="bg-[#151515] px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-[#d8ff36] md:text-xs">
        AURA VI VII — Estilo sem excesso. Descobre a coleção.
      </div>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/10 bg-[#f4f4f2]/95 px-5 py-4 backdrop-blur md:px-10">
        <Link href="/" className="text-xl font-black tracking-[-0.06em] md:text-2xl">AURA VI VII<span className="text-[#e94f2e]">.</span></Link>
        <nav aria-label="Navegação principal" className="hidden items-center gap-7 text-xs font-extrabold uppercase tracking-[0.12em] md:flex">
          <Link href="/#colecao" className="transition hover:text-[#e94f2e]">Coleção</Link>
          <Link href="/#ideia" className="transition hover:text-[#e94f2e]">A ideia</Link>
          <Link href="/retirada" className="transition hover:text-[#e94f2e]">Informações de compra</Link>
        </nav>
        <button onClick={() => setOpen(true)} className="border-2 border-black bg-[#d8ff36] px-4 py-2 text-xs font-black uppercase tracking-wide transition hover:bg-[#ff633e] md:px-5 md:py-3" aria-label={`Abrir carrinho, ${count} artigos`}>
          Carrinho ({count})
        </button>
      </header>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40" onClick={() => setOpen(false)}>
          <aside className="flex h-full w-full max-w-md flex-col bg-paper p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex justify-between">
              <h2 className="text-xl font-extrabold">Carrinho</h2>
              <button onClick={() => setOpen(false)}>Fechar</button>
            </div>
            <ul className="flex-1 space-y-5 overflow-y-auto">
              {items.length === 0 && <li className="text-stone">O carrinho está vazio. Escolhe uma peça.</li>}
              {items.map((i) => (
                <li key={i.priceId} className="flex justify-between gap-3">
                  <div>
                    <p className="font-semibold">{i.name}</p>
                    <p className="text-sm text-stone">Tamanho {i.size}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button onClick={() => change(i.priceId, -1)} aria-label="Menos">−</button>
                      <span>{i.qty}</span>
                      <button onClick={() => change(i.priceId, 1)} aria-label="Mais">+</button>
                    </div>
                  </div>
                  <p>{eur(i.price * i.qty)}</p>
                </li>
              ))}
            </ul>
            {items.length > 0 && (
              <div className="border-t border-black pt-4">
                <ShippingProgress total={net} />
                <BundleSummary items={items} />
                <div className="mb-3 flex justify-between font-bold"><span>Subtotal</span><span>{eur(net)}</span></div>
                {error && <p role="alert" className="mb-2 text-sm text-red-600">{error}</p>}
                <label className="mb-3 flex gap-2 text-sm">
                  <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
                  Quero receber novidades e ofertas por e-mail. Posso sair quando quiser.
                </label>
                <button onClick={checkout} disabled={loading}
                  className="w-full bg-cobalt py-4 font-bold text-white disabled:opacity-60">
                  {loading ? "A abrir pagamento…" : "Pagar com segurança"}
                </button>
                <p className="mt-2 text-xs text-stone">Cada peça é produzida só depois da tua encomenda.</p>
              </div>
            )}
          </aside>
        </div>
      )}
    </CartCtx.Provider>
  );
}

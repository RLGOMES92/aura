import { FREE_SHIPPING_THRESHOLD as T } from "@/lib/shipping";
import { eur } from "@/lib/products";

export function ShippingProgress({ total }: { total: number }) {
  const pct = Math.min(100, Math.round((total / T) * 100));
  const done = total >= T;
  return (
    <div className="mb-4">
      <p className="mb-2 text-sm font-semibold">
        {done ? "Tens envio grátis." : `Faltam ${eur(T - total)} para envio grátis.`}
      </p>
      <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso para envio grátis"
        className="h-1.5 w-full bg-black/15">
        <div className={`h-full ${done ? "bg-black" : "bg-cobalt"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

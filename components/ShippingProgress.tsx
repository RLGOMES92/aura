import { SHIPPING_FEE } from "@/lib/shipping";
import { brl } from "@/lib/products";

export function ShippingProgress() {
  return (
    <div className="mb-4 border-y border-black/15 py-3">
      <p className="text-sm font-semibold">Frete calculado para o Brasil</p>
      <p className="mt-1 text-sm text-stone">Valor provisório: {brl(SHIPPING_FEE)}. O frete será cobrado junto com o pagamento.</p>
    </div>
  );
}

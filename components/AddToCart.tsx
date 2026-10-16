"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { track } from "./Pixels";
import type { Product, Size } from "@/lib/products";

export function AddToCart({ product }: { product: Product }) {
  const [size, setSize] = useState<Size | null>(null);
  const [warn, setWarn] = useState(false);
  const { add } = useCart();
  return (
    <div>
      <fieldset>
        <legend className="mb-2 font-semibold">Tamanho</legend>
        <div className="flex gap-2">
          {(Object.keys(product.variants) as Size[]).map((s) => (
            <button key={s} onClick={() => { setSize(s); setWarn(false); }} aria-pressed={size === s}
              className={`h-12 w-14 border border-black font-semibold ${size === s ? "bg-black text-paper" : ""}`}>
              {s}
            </button>
          ))}
        </div>
      </fieldset>
      {warn && <p role="alert" className="mt-2 text-sm text-red-600">Escolhe um tamanho para continuar.</p>}
      <button
        onClick={() => {
          if (!size) return setWarn(true);
          track("AddToCart", { name: product.name, value: product.price });
          add({ slug: product.slug, priceId: product.variants[size], name: product.name, size, price: product.price });
        }}
        className="mt-5 w-full bg-cobalt py-4 font-bold text-white">
        Adicionar ao carrinho
      </button>
    </div>
  );
}

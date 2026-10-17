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
        <legend className="mb-3 flex w-full items-center justify-between text-sm font-black uppercase tracking-[0.12em]">
          <span>Escolhe o tamanho</span><span className="text-[10px] font-semibold tracking-normal text-neutral-500">S / M / L / XL</span>
        </legend>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(product.variants) as Size[]).map((s) => (
            <button type="button" key={s} onClick={() => { setSize(s); setWarn(false); }} aria-pressed={size === s}
              className={`h-12 border-2 border-black text-sm font-black transition-colors ${size === s ? "bg-[#d8ff36] text-black" : "bg-transparent hover:bg-white"}`}>
              {s}
            </button>
          ))}
        </div>
      </fieldset>
      {warn && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">Escolhe um tamanho para continuar.</p>}
      <button
        type="button"
        onClick={() => {
          if (!size) return setWarn(true);
          track("AddToCart", { name: product.name, value: product.price });
          add({ slug: product.slug, priceId: product.variants[size], name: product.name, size, price: product.price });
        }}
        className="mt-5 flex w-full items-center justify-between bg-black px-5 py-4 text-left font-black text-white transition hover:bg-[#ff633e] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
        <span>ADICIONAR AO CARRINHO</span><span aria-hidden="true" className="text-xl">↗</span>
      </button>
      <p className="mt-3 text-center text-xs text-neutral-500">Podes rever a tua seleção no carrinho antes de pagar.</p>
    </div>
  );
}

import Image from "next/image";
import type { Product } from "@/lib/products";

export function ProductImage({ product, priority = false }: { product: Product; priority?: boolean }) {
  const src = product.images?.[0];
  const isHoodie = product.slug.includes("hoodie");
  return (
    <div className={`relative aspect-[4/5] w-full overflow-hidden ${isHoodie ? "bg-[#ff633e]" : "bg-[#d8ff36]"}`}>
      {src ? (
        <Image src={src} alt={product.name} fill priority={priority} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      ) : (
        <div className="absolute inset-0 overflow-hidden p-5 text-black md:p-8" aria-label={`Arte gráfica de apresentação para ${product.name}`}>
          <span className="absolute left-5 top-5 z-10 text-[10px] font-black uppercase tracking-[0.22em] md:left-8 md:top-8 md:text-xs">AURA VI VII / STUDIO</span>
          <div aria-hidden="true" className={`absolute -right-10 top-[18%] h-48 w-48 rounded-full border-[18px] border-black/10 md:-right-14 md:h-72 md:w-72 md:border-[26px] ${isHoodie ? "bg-[#d8ff36]" : "bg-[#ff633e]"}`} />
          <div aria-hidden="true" className="absolute left-[12%] top-[20%] h-[48%] w-[65%] -rotate-[12deg] border-[3px] border-black bg-[#f4f4f2] shadow-[12px_12px_0_#111] transition-transform duration-500 group-hover:rotate-[-7deg] md:border-4 md:shadow-[18px_18px_0_#111]">
            <div className="flex h-full flex-col items-center justify-center px-3 text-center">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] md:text-xs">AURA VI VII</span>
              <span className="mt-3 text-[clamp(1.2rem,5vw,3.5rem)] font-black leading-[0.82] tracking-[-0.08em]">{isHoodie ? "STAY\nQUIET." : "LESS\nNOISE."}</span>
              <span className="mt-4 text-[8px] font-bold uppercase tracking-[0.2em] md:text-[10px]">Made to mean more</span>
            </div>
          </div>
          <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between gap-3 md:bottom-8 md:left-8 md:right-8">
            <div className="max-w-[70%]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] md:text-xs">A primeira seleção</p>
              <p className="mt-2 text-3xl font-black leading-[0.85] tracking-[-0.07em] md:text-5xl">{product.name}</p>
            </div>
            <span aria-hidden="true" className="text-4xl font-black md:text-6xl">✳</span>
          </div>
        </div>
      )}
    </div>
  );
}

import Image from "next/image";
import type { Product } from "@/lib/products";

export function ProductImage({ product, priority = false }: { product: Product; priority?: boolean }) {
  const src = product.images?.[0];
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
      {src ? (
        <Image src={src} alt={product.name} fill priority={priority} sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      ) : (
        <span className="absolute bottom-5 left-5 text-4xl font-black text-paper">{product.name}</span>
      )}
    </div>
  );
}

import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { legal } from "@/lib/legal";
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site },
    ...products.map((p) => ({ url: `${site}/produto/${p.slug}` })),
    ...Object.keys(legal).map((s) => ({ url: `${site}/legal/${s}` })),
    { url: `${site}/retirada` },
  ];
}

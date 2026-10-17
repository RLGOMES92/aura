import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { products } from "../lib/products";

const issues: string[] = [];
const warnings: string[] = [];
const publicDir = join(process.cwd(), "public");

console.log("Aura VI VII — verificação manual do catálogo");
console.log(`Produtos configurados: ${products.length}`);

for (const product of products) {
  console.log(`\n• ${product.name} (${product.slug})`);
  if (!product.images?.length) {
    issues.push(`${product.name}: não tem fotografias/mockups reais configurados; a loja usa arte de fallback.`);
  } else {
    for (const image of product.images) {
      if (/^https?:\/\//i.test(image)) {
        console.log(`  imagem remota configurada: ${image}`);
      } else if (image.startsWith("/")) {
        if (!existsSync(join(publicDir, image.replace(/^\/+/, "")))) {
          issues.push(`${product.name}: imagem local não encontrada (${image}).`);
        }
      } else {
        issues.push(`${product.name}: caminho de imagem inválido (${image}).`);
      }
    }
  }

  for (const size of ["S", "M", "L", "XL"] as const) {
    const id = product.variants[size];
    if (!id || id.startsWith("price_REPLACE_") || !id.startsWith("price_")) {
      issues.push(`${product.name} tamanho ${size}: Price ID Stripe ausente ou placeholder.`);
    }
  }
}

const legalFile = join(process.cwd(), "lib", "legal.ts");
if (existsSync(legalFile)) {
  const legal = readFileSync(legalFile, "utf8");
  const placeholders = ["[NOME DA EMPRESA]", "[NIF]", "[MORADA]", "[EMAIL DE SUPORTE]", "[MORADA DE DEVOLUÇÕES]"];
  for (const placeholder of placeholders) {
    if (legal.includes(placeholder)) warnings.push(`Dados legais por preencher: ${placeholder}.`);
  }
}

if (issues.length) {
  console.error("\nBloqueios do catálogo:");
  for (const issue of issues) console.error(` - ${issue}`);
}
if (warnings.length) {
  console.warn("\nAvisos legais:");
  for (const warning of warnings) console.warn(` - ${warning}`);
}
if (!issues.length && !warnings.length) console.log("\nCatálogo sem problemas estáticos detetados. Os IDs Stripe ainda precisam de validação real.");
if (issues.length || warnings.length) process.exitCode = 1;

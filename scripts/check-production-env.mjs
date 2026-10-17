#!/usr/bin/env node

// Preflight manual da configuração de produção. Nunca imprime valores de segredos.
const required = [
  "NEXT_PUBLIC_SITE_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "PRINTFUL_STORE_ID",
  "PRINTFUL_TOKEN",
  "PRINTFUL_WEBHOOK_SECRET",
  "ZOHO_CLIENT_ID",
  "ZOHO_CLIENT_SECRET",
  "ZOHO_REFRESH_TOKEN",
  "WHATSAPP_ACCESS_TOKEN",
  "WHATSAPP_PHONE_NUMBER_ID",
  "WHATSAPP_TEMPLATE_NAME",
  "ADMIN_WHATSAPP_TO",
  "ADMIN_USER",
  "ADMIN_PASS",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

const missing = required.filter((key) => !process.env[key]?.trim());
const warnings = [];
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

if (siteUrl) {
  try {
    const url = new URL(siteUrl);
    if (url.protocol !== "https:") warnings.push("NEXT_PUBLIC_SITE_URL deve usar HTTPS em produção.");
  } catch {
    warnings.push("NEXT_PUBLIC_SITE_URL não é uma URL válida.");
  }
}

if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith("sk_live_")) {
  warnings.push("STRIPE_SECRET_KEY não parece ser uma chave live; confirma antes de receber pagamentos reais.");
}

const adminWhatsApp = process.env.ADMIN_WHATSAPP_TO?.replace(/\\D/g, "");
if (adminWhatsApp && !/^55\\d{10,11}$/.test(adminWhatsApp)) {
  warnings.push("ADMIN_WHATSAPP_TO deve conter o número brasileiro com DDI 55, DDD e número, apenas dígitos.");
}

if (process.env.PRINTFUL_CONFIRM !== "true") {
  warnings.push("PRINTFUL_CONFIRM não está definido como true; pedidos Printful podem não ser confirmados automaticamente. Não atives sem validar variantes, morada, custo e saldo.");
}

console.log("Aura VI VII — preflight de produção");
if (missing.length) {
  console.error("\nFaltam variáveis obrigatórias:");
  for (const key of missing) console.error(" - " + key);
} else {
  console.log("\nTodas as variáveis obrigatórias estão presentes (os valores não foram exibidos).");
}

if (warnings.length) {
  console.warn("\nAvisos:");
  for (const warning of warnings) console.warn(" - " + warning);
}

if (missing.length || warnings.some((warning) => warning.includes("URL válida") || warning.includes("deve usar HTTPS") || warning.includes("número brasileiro"))) {
  process.exitCode = 1;
} else {
  console.log("\nPreflight concluído. Isto não substitui testes reais Stripe/Printful/Zoho.");
}

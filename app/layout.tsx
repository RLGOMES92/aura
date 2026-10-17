import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { Pixels } from "@/components/Pixels";
import { Footer } from "@/components/Footer";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "AURA VI VII — Streetwear e personalização", template: "%s | AURA VI VII" },
  description: "Streetwear com identidade. Escolha a coleção ou consulte a personalização com sua própria arte.",
  openGraph: { type: "website", siteName: "AURA VI VII", locale: "pt_BR" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={archivo.variable}>
      <body><CartProvider>{children}<Pixels /><Footer /></CartProvider></body>
    </html>
  );
}

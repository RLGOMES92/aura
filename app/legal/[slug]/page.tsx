import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { legal } from "@/lib/legal";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => Object.keys(legal).map((slug) => ({ slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = legal[(await params).slug];
  return d ? { title: d.title } : {};
}

export default async function LegalPage({ params }: Props) {
  const d = legal[(await params).slug];
  if (!d) notFound();
  return (
    <main className="max-w-2xl px-5 py-12">
      <h1 className="text-4xl font-black tracking-tight">{d.title}</h1>
      {d.sections.map((s) => (
        <section key={s.h} className="mt-8">
          <h2 className="text-lg font-bold">{s.h}</h2>
          <p className="mt-2 leading-relaxed">{s.p}</p>
        </section>
      ))}
    </main>
  );
}

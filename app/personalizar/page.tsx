"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const inkOptions = [
  { label: "Preto", value: "#111111" },
  { label: "Branco", value: "#ffffff" },
  { label: "Cinza", value: "#808080" },
  { label: "Grafite", value: "#383838" },
  { label: "Azul-marinho", value: "#14213d" },
  { label: "Azul", value: "#1769aa" },
  { label: "Azul-claro", value: "#87ceeb" },
  { label: "Vermelho", value: "#d62828" },
  { label: "Vinho", value: "#722f37" },
  { label: "Verde", value: "#2d6a4f" },
  { label: "Verde-lima", value: "#d8ff36" },
  { label: "Amarelo", value: "#ffd60a" },
  { label: "Laranja", value: "#ff633e" },
  { label: "Rosa", value: "#f4a6c1" },
  { label: "Roxo", value: "#6a4c93" },
  { label: "Bege", value: "#d6c3a5" },
];

export default function PersonalizarPage() {
  const [mode, setMode] = useState<"arte" | "criar">("arte");
  const [product, setProduct] = useState("Camiseta");
  const [size, setSize] = useState("M");
  const [phrase, setPhrase] = useState("SUA IDEIA AQUI");
  const [ink, setInk] = useState("#d8ff36");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!file) { setPreview(""); return; }
    if (!file.type.startsWith("image/")) { setPreview(""); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const brief = `Olá! Quero consultar uma personalização na AURA VI VII.\nNome: ${name || "Não informado"}\nQuero: ${mode === "arte" ? "Enviar minha própria arte" : "Criar uma arte do zero"}\nPeça: ${product}\nTamanho: ${size}\nFrase/ideia: ${phrase || "A combinar"}\nCor principal da arte: ${inkOptions.find((c) => c.value === ink)?.label}\nDetalhes: ${notes || "A combinar"}\nArquivo: ${file?.name || "Não anexado"}\nPodem confirmar viabilidade, valor e prazo?`;

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copie seu briefing para enviar à equipe:", brief);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f2eb] px-5 py-10 text-[#111] md:px-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-xs font-black uppercase tracking-[0.18em] hover:underline">← Voltar à loja</Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <section>
            <p className="mb-4 inline-flex bg-[#ff633e] px-3 py-2 text-xs font-black uppercase tracking-[0.16em]">AURA VI VII / PERSONALIZAÇÃO</p>
            <h1 className="text-5xl font-black leading-[0.88] tracking-[-0.07em] md:text-7xl">NÃO ACHOU<br />DO SEU JEITO?<br /><span className="text-[#ff633e]">CRIE.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-black/70 md:text-lg">Você pode enviar sua própria arte ou começar com uma frase e uma cor. Preencha as ideias abaixo para preparar seu pedido de personalização.</p>
            <div className="mt-8 flex gap-2"><button type="button" onClick={() => setMode("arte")} className={`flex-1 border-2 border-black p-4 text-left text-sm font-black uppercase ${mode === "arte" ? "bg-[#d8ff36]" : "bg-white"}`}>01 / Tenho minha arte</button><button type="button" onClick={() => setMode("criar")} className={`flex-1 border-2 border-black p-4 text-left text-sm font-black uppercase ${mode === "criar" ? "bg-[#d8ff36]" : "bg-white"}`}>02 / Criar do zero</button></div>
            <div className="mt-6 border-2 border-black bg-white p-5"><label className="block text-xs font-black uppercase tracking-wide" htmlFor="artfile">{mode === "arte" ? "Envie sua arte (PNG, JPG, WEBP ou PDF)" : "Imagem de referência (opcional)"}</label><input id="artfile" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-3 block w-full text-sm file:mr-3 file:border-0 file:bg-black file:px-4 file:py-3 file:font-bold file:text-white" />{file && <p className="mt-2 break-all text-xs text-black/60">Arquivo selecionado: {file.name}. Para enviar a imagem final, anexe o arquivo no contato com a equipe.</p>}{preview && <div className="relative mt-4 aspect-video overflow-hidden border border-black/10 bg-[#f5f2eb]"><Image src={preview} alt="Prévia da arte enviada" fill unoptimized className="object-contain p-3" /></div>}</div>
            <p className="mt-5 text-xs leading-relaxed text-black/55">A prévia de frase e cor é apenas uma ideia inicial, não uma simulação exata da estampa. Toda personalização depende de análise e confirmação de preço e prazo.</p>
          </section>
          <section className="border-2 border-black bg-white p-5 md:p-8">
            <div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-black tracking-tight md:text-3xl">Monte seu briefing</h2><span className="bg-black px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white">Passo 1 de 1</span></div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="text-xs font-black uppercase tracking-wide">Seu nome<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Como podemos chamar você?" className="mt-2 block w-full border-2 border-black/15 bg-[#f5f2eb] p-3 text-sm font-medium normal-case outline-none focus:border-black" /></label>
              <label className="text-xs font-black uppercase tracking-wide">Peça<select value={product} onChange={(e) => setProduct(e.target.value)} className="mt-2 block w-full border-2 border-black/15 bg-[#f5f2eb] p-3 text-sm font-medium normal-case outline-none focus:border-black"><option>Camiseta</option><option>Moletom com capuz</option><option>Outra peça (consultar)</option></select></label>
              <label className="text-xs font-black uppercase tracking-wide">Tamanho<select value={size} onChange={(e) => setSize(e.target.value)} className="mt-2 block w-full border-2 border-black/15 bg-[#f5f2eb] p-3 text-sm font-medium normal-case outline-none focus:border-black">{["P", "M", "G", "GG", "Preciso de ajuda"].map((s) => <option key={s}>{s}</option>)}</select></label>
              <label className="text-xs font-black uppercase tracking-wide">Frase ou ideia<input value={phrase} onChange={(e) => setPhrase(e.target.value)} maxLength={60} placeholder="Sua frase, nome ou conceito" className="mt-2 block w-full border-2 border-black/15 bg-[#f5f2eb] p-3 text-sm font-medium normal-case outline-none focus:border-black" /></label>
            </div>
            <div className="mt-6"><p className="text-xs font-black uppercase tracking-wide">Cor principal da arte (paleta tradicional)</p><div className="mt-3 flex flex-wrap gap-3">{inkOptions.map((c) => <button key={c.value} type="button" onClick={() => setInk(c.value)} aria-label={c.label} aria-pressed={ink === c.value} className={`h-10 w-10 rounded-full border-2 ${ink === c.value ? "border-black ring-2 ring-black ring-offset-2" : "border-black/20"}`} title={c.label} style={{ backgroundColor: c.value }} />)}<span className="self-center text-xs text-black/55">{inkOptions.find((c) => c.value === ink)?.label}</span></div></div>
            <label className="mt-6 block text-xs font-black uppercase tracking-wide">Conte mais detalhes<textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Onde quer a estampa? Tem alguma referência? Conte aqui..." className="mt-2 block w-full resize-y border-2 border-black/15 bg-[#f5f2eb] p-3 text-sm font-medium normal-case outline-none focus:border-black" /></label>
            <div className="mt-6 overflow-hidden border-2 border-black bg-[#111] p-5 text-white"><div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.16em]"><span>Prévia de conceito</span><span>AURA STUDIO</span></div><div className="mt-6 flex min-h-48 items-center justify-center bg-[#f5f2eb] p-6"><div className="max-w-full break-words text-center text-3xl font-black uppercase leading-[0.9] tracking-[-0.06em] md:text-5xl" style={{ color: ink }}>{phrase || "SUA IDEIA AQUI"}</div></div><p className="mt-3 text-xs text-white/60">Conceito ilustrativo. A aplicação final será confirmada com você.</p></div>
            <button type="button" onClick={copyBrief} className="mt-6 min-h-14 w-full bg-[#d8ff36] px-5 py-4 text-sm font-black uppercase tracking-wide transition hover:bg-[#ff633e]">{copied ? "Briefing copiado! ✓" : "Copiar briefing para enviar ↗"}</button>
            <p className="mt-3 text-xs leading-relaxed text-black/55">Este formulário prepara o pedido, mas ainda não envia mensagens automaticamente. Copie o briefing e envie pelo canal de atendimento da loja; se escolheu uma arte, anexe o arquivo também.</p>
          </section>
        </div>
      </div>
    </main>
  );
}

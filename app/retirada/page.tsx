"use client";
import { useState } from "react";

type State = "form" | "confirm" | "sending" | "done" | "error";

export default function Retirada() {
  const [state, setState] = useState<State>("form");
  const [f, setF] = useState({ name: "", email: "", order: "" });
  const [at, setAt] = useState("");
  const valid = f.name.trim() && /^\S+@\S+\.\S+$/.test(f.email) && f.order.trim();

  async function send() {
    setState("sending");
    try {
      const res = await fetch("/api/retirada", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f),
      });
      if (!res.ok) throw new Error();
      setAt(new Date().toLocaleString("pt-PT"));
      setState("done");
    } catch { setState("error"); }
  }

  const input = "mt-1 w-full border border-black bg-paper p-3";
  return (
    <main className="max-w-md px-5 py-12">
      <h1 className="text-4xl font-black tracking-tight">Retirar do contrato</h1>
      <p className="mt-3">Tens 14 dias desde a receção da peça. Não precisas de explicar o motivo.</p>

      {(state === "form" || state === "error") && (
        <div className="mt-8 space-y-4">
          {([["name", "Nome"], ["email", "E-mail da encomenda"], ["order", "Número do pedido (no e-mail de confirmação)"]] as const).map(([k, l]) => (
            <label key={k} className="block font-semibold">{l}
              <input className={input} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
            </label>
          ))}
          {state === "error" && <p role="alert" className="text-sm text-red-600">Não foi possível enviar. Tenta outra vez ou escreve-nos por e-mail.</p>}
          <button disabled={!valid} onClick={() => setState("confirm")} className="w-full bg-black py-4 font-bold text-paper disabled:opacity-40">
            Retirar do contrato aqui
          </button>
        </div>
      )}

      {(state === "confirm" || state === "sending") && (
        <div className="mt-8">
          <p className="font-semibold">Confirma os dados:</p>
          <p className="mt-2">{f.name}<br />{f.email}<br />Pedido {f.order}</p>
          <button disabled={state === "sending"} onClick={send} className="mt-6 w-full bg-cobalt py-4 font-bold text-white disabled:opacity-60">
            {state === "sending" ? "A enviar…" : "Confirmar retirada"}
          </button>
          <button onClick={() => setState("form")} className="mt-3 w-full py-3 font-semibold">Corrigir dados</button>
        </div>
      )}

      {state === "done" && (
        <div className="mt-8">
          <p className="text-xl font-bold">Declaração recebida em {at}.</p>
          <p className="mt-2">Vais receber uma confirmação por e-mail com as instruções de devolução.</p>
        </div>
      )}
    </main>
  );
}

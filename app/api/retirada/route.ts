import { NextResponse } from "next/server";
import { zoho } from "@/lib/zoho"; // do pacote shipping-webhook

export async function POST(req: Request) {
  try {
    const { name, email, order } = await req.json();
    if (![name, email, order].every((v) => typeof v === "string" && v.trim()) || !/^\S+@\S+\.\S+$/.test(email))
      return NextResponse.json({ error: "invalid" }, { status: 400 });

    // Contacto: usa o existente (não sobrescreve nome) ou cria
    const found = await zoho("GET", `Contacts/search?email=${encodeURIComponent(email)}`);
    const contactId: string =
      found?.data?.[0]?.id ?? (await zoho("POST", "Contacts", { data: [{ Email: email, Last_Name: name }] })).data[0].details.id;

    const due = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
    await zoho("POST", "Tasks", {
      data: [{
        Subject: `Retirada de contrato - ${order}`,
        Description: `${name} <${email}> | Pedido ${order} | Recebida em ${new Date().toISOString()}`,
        Who_Id: { id: contactId },
        Due_Date: due,
        Priority: "High",
      }],
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[retirada]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

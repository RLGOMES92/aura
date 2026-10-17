"use client";
import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    fbq?: (...a: unknown[]) => void;
    ttq?: { track: (e: string, p?: object, o?: object) => void };
  }
}
const FB = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TT = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

type Ev = "ViewContent" | "AddToCart" | "Purchase";
type Data = { name: string; value: number };

// Cada pixel é tratado separadamente: a falha de um não bloqueia o outro.
function whenReady(kind: "meta" | "tiktok", fn: () => void, tries = 25) {
  const ready = kind === "meta" ? Boolean(window.fbq) : Boolean(window.ttq);
  if (ready) return fn();
  if (tries > 0) setTimeout(() => whenReady(kind, fn, tries - 1), 200);
}

function hasMarketingConsent() {
  return document.cookie.split(";").some((part) => part.trim() === "consent=1");
}

export function track(event: Ev, d: Data, eventId?: string) {
  const p = { content_name: d.name, value: d.value, currency: "EUR" };
  if (FB) whenReady("meta", () => {
    if (!hasMarketingConsent() || !window.fbq) return;
    window.fbq("track", event, p, eventId ? { eventID: eventId } : undefined);
  });
  if (TT) whenReady("tiktok", () => {
    if (!hasMarketingConsent() || !window.ttq) return;
    window.ttq.track(event === "Purchase" ? "CompletePayment" : event, p, eventId ? { event_id: eventId } : undefined);
  });
}

export function PageEvent({ event, data, eventId }: { event: Ev; data: Data; eventId?: string }) {
  useEffect(() => { track(event, data, eventId); }, [event, data.name, data.value, eventId]); // eslint-disable-line
  return null;
}

export function Pixels() {
  const [ok, setOk] = useState(false);
  const [asked, setAsked] = useState(true);
  useEffect(() => {
    setOk(document.cookie.includes("consent=1"));
    setAsked(document.cookie.includes("consent="));
  }, []);
  const decide = (v: boolean) => {
    document.cookie = `consent=${v ? 1 : 0}; path=/; max-age=31536000; samesite=lax`;
    setOk(v); setAsked(true);
  };
  return (
    <>
      {ok && FB && (
        <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${FB}');fbq('track','PageView');`}</Script>
      )}
      {ok && TT && (
        <Script id="tiktok-pixel" strategy="afterInteractive">{`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${TT}');ttq.page()}(window,document,'ttq');`}</Script>
      )}
      {!asked && (
        <div role="dialog" aria-label="Cookies" className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-3 border-t border-black bg-paper p-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm">Usamos cookies de marketing para medir anúncios. Podes recusar sem perder nada na loja.</p>
          <div className="flex gap-2">
            <button onClick={() => decide(false)} className="border border-black px-5 py-3 font-semibold">Recusar</button>
            <button onClick={() => decide(true)} className="bg-black px-5 py-3 font-semibold text-paper">Aceitar</button>
          </div>
        </div>
      )}
    </>
  );
}

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import SearchPanel from "@/components/SearchPanel";
import { cityByIata } from "@/lib/cities";
import { defaultIda, defaultVolta } from "@/lib/search";

const HeroIrisCanvas = lazy(() => import("./HeroIrisCanvas"));

function IrisFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 50% 28%, rgba(245,200,119,0.4) 0%, rgba(240,168,50,0.16) 32%, transparent 62%)",
        filter: "blur(36px)",
      }}
      aria-hidden
    />
  );
}

export default function Hero() {
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const converge = useRef(0);
  const open = useRef(0);
  const [reduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (reduced) return;
    converge.current = 1;
  }, [reduced]);

  const gru = cityByIata("GRU") ?? null;

  return (
    <section className="relative overflow-hidden bg-ink pb-12 pt-6 md:pb-16 md:pt-10">
      <div ref={canvasWrapRef} className="pointer-events-none absolute inset-0 opacity-45">
        {reduced ? (
          <IrisFallback />
        ) : (
          <Suspense fallback={<IrisFallback />}>
            <HeroIrisCanvas converge={converge} open={open} />
          </Suspense>
        )}
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,8,15,0.2) 0%, rgba(6,8,15,0.72) 48%, rgba(6,8,15,1) 100%)",
        }}
      />

      <div className="container-site relative z-10">
        <p className="eyebrow mb-3 text-teal">Passagens · Brasil · +18</p>
        <h1 className="max-w-[18ch] font-display text-[clamp(2.2rem,5.5vw,4rem)] font-medium leading-[0.95] tracking-[-0.02em] text-mist">
          A visão.{" "}
          <em className="text-iris-gradient italic">Agora busca.</em>
        </h1>
        <p className="mt-3 max-w-[32rem] text-[1.02rem] leading-relaxed text-mist-dim">
          Origem, destino, datas. O resto da lenda fica embaixo.
        </p>

        <div id="busca" className="mx-auto mt-8 max-w-[64rem] scroll-mt-28">
          <SearchPanel
            initial={{
              origem: gru,
              ida: defaultIda(),
              volta: defaultVolta(),
            }}
          />
        </div>
      </div>
    </section>
  );
}

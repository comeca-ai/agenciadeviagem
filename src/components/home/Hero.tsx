import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import SearchPanel from "@/components/SearchPanel";

const HeroIrisCanvas = lazy(() => import("./HeroIrisCanvas"));

function IrisFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 18% 20%, rgba(245,200,119,0.28) 0%, rgba(240,168,50,0.12) 28%, transparent 58%)",
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

  return (
    <section className="relative overflow-hidden bg-ink pb-10 pt-8 md:pb-16 md:pt-12">
      <div ref={canvasWrapRef} className="pointer-events-none absolute inset-0 opacity-50">
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
            "linear-gradient(180deg, rgba(6,8,15,0.35) 0%, rgba(6,8,15,0.82) 55%, rgba(6,8,15,1) 100%)",
        }}
      />

      <div className="container-site relative z-10">
        <p className="eyebrow mb-4 text-teal">Passagens · preço em real · reserva no parceiro</p>
        <h1 className="max-w-[22ch] font-display text-[clamp(2.4rem,6vw,4.6rem)] font-medium leading-[0.95] tracking-[-0.02em] text-mist">
          Encontre a passagem.{" "}
          <em className="text-iris-gradient italic">Sem teatro.</em>
        </h1>
        <p className="mt-4 max-w-[36rem] text-[1.05rem] leading-relaxed text-mist-dim">
          Origem, destino, datas. O Olho consulta o parceiro e mostra o preço por pessoa.
          Bagagem e regras só aparecem na reserva — a gente não inventa.
        </p>

        <div id="busca" className="mx-auto mt-8 max-w-[64rem] scroll-mt-28">
          <SearchPanel />
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import IrisMotif from "@/components/IrisMotif";

/** Pontos da rede no mini-mapa (posições relativas no viewBox 0 0 200 200). */
const PONTOS = [
  { iata: "GRU", cx: 76, cy: 128 },
  { iata: "FOR", cx: 92, cy: 112 },
  { iata: "LIS", cx: 104, cy: 76 },
  { iata: "MIA", cx: 56, cy: 96 },
  { iata: "NRT", cx: 156, cy: 84 },
];

function MiniMapa() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="mapa-globo w-full max-w-[26rem]"
      role="img"
      aria-label="Mapa estilizado do globo com pontos da rede Cloudflare: GRU, FOR, LIS, MIA e NRT"
    >
      {/* Globo */}
      <circle cx="100" cy="100" r="88" stroke="#141B2C" strokeWidth="1.5" fill="none" />
      {/* Meridianos (desenhados por scrub) */}
      <ellipse className="mapa-linha" cx="100" cy="100" rx="88" ry="36" stroke="#141B2C" strokeWidth="1" fill="none" />
      <ellipse className="mapa-linha" cx="100" cy="100" rx="36" ry="88" stroke="#141B2C" strokeWidth="1" fill="none" />
      <ellipse className="mapa-linha" cx="100" cy="100" rx="66" ry="88" stroke="#141B2C" strokeWidth="1" fill="none" />
      <ellipse className="mapa-linha" cx="100" cy="100" rx="88" ry="66" stroke="#141B2C" strokeWidth="1" fill="none" />
      <line className="mapa-linha" x1="12" y1="100" x2="188" y2="100" stroke="#141B2C" strokeWidth="1" />
      <line className="mapa-linha" x1="100" y1="12" x2="100" y2="188" stroke="#141B2C" strokeWidth="1" />

      {/* Pings dos pontos da borda */}
      {PONTOS.map((p, i) => (
        <g key={p.iata}>
          <circle
            cx={p.cx}
            cy={p.cy}
            r="6"
            fill="none"
            stroke="#35C4B5"
            strokeWidth="1"
            className="animate-ping"
            style={{
              transformOrigin: `${p.cx}px ${p.cy}px`,
              animationDuration: "2s",
              animationDelay: `${i * 0.4}s`,
            }}
          />
          <circle cx={p.cx} cy={p.cy} r="3" fill="#35C4B5" />
          <text
            x={p.cx}
            y={p.cy - 9}
            textAnchor="middle"
            fill="#98A0B3"
            fontSize="7"
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="0.5"
          >
            {p.iata}
          </text>
        </g>
      ))}
    </svg>
  );
}

/**
 * Seção 5 — "Rápido porque mora na borda": texto à esquerda e mini-mapa
 * do globo com meridianos desenhados por scroll e pings teal.
 */
export default function TecnologiaBorda() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".borda-item",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
      // Meridianos se desenham (stroke-dashoffset, 1.5s)
      gsap.utils.toArray<SVGElement>(".mapa-linha").forEach((linha, i) => {
        try {
          const len = (linha as unknown as SVGGeometryElement).getTotalLength();
          gsap.fromTo(
            linha,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              duration: 1.5,
              delay: i * 0.08,
              ease: "cubic-bezier(0.22, 1, 0.36, 1)",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%",
              },
            },
          );
        } catch {
          /* sem getTotalLength — ignora */
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ink py-[clamp(5rem,12vh,9rem)]"
    >
      {/* Íris decorativa de fundo */}
      <div
        className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2 blur-[90px]"
        aria-hidden="true"
      >
        <IrisMotif size={560} opacity={0.05} />
      </div>

      <div className="container-site relative z-10 grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="borda-item eyebrow mb-4 text-teal">Sob o capô</p>
          <h2 className="borda-item font-display text-[clamp(2.2rem,5vw,4.25rem)] font-medium leading-[1.0] text-mist">
            O Olho mora na{" "}
            <em className="text-iris-gradient italic">borda da rede.</em>
          </h2>
          <p className="borda-item mt-6 max-w-[32rem] text-[1.05rem] leading-[1.65] text-mist-dim">
            O site inteiro roda na Cloudflare — servido de data centers
            espalhados pelo mundo. Na prática: a busca abre rápido em Manaus,
            em Recife ou em Lisboa. O vigia nunca está longe de você.
          </p>
        </div>
        <div className="borda-item flex justify-center md:col-span-5 md:justify-end">
          <MiniMapa />
        </div>
      </div>
    </section>
  );
}

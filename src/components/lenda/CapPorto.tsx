import { useEffect, useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(SplitText);

/**
 * Capítulo 1 — "O Porto" (pin 160vh). Texto revelado por máscara de
 * varredura horizontal; nos últimos 40% do pin, rotas douradas se
 * desenham sobre o mapa — prenúncio do produto.
 */
export default function CapPorto() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const rotas = gsap.utils.toArray<SVGPathElement>(".porto-rota");
      rotas.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        gsap.set(p, { strokeDashoffset: len });
      });

      const split = new SplitText(".porto-texto", { type: "lines" });
      gsap.set(split.lines, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(".porto-marker", { opacity: 0, y: 20 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        })
        .to(".porto-marker", { opacity: 1, y: 0, duration: 0.08 }, 0)
        // varredura linha a linha: 0 → 60% do pin
        .to(
          split.lines,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            stagger: 0.06,
            duration: 0.5,
            ease: "none",
          },
          0.05,
        )
        // rotas se desenham nos últimos 40%
        .to(
          rotas,
          {
            strokeDashoffset: 0,
            stagger: 0.1,
            duration: 0.34,
            ease: "none",
          },
          0.6,
        )
        .to(".porto-mapa", { opacity: 0.45, duration: 0.4, ease: "none" }, 0.6);
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      data-chapter="1"
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
      aria-label="Capítulo 1 — O Porto"
    >
      {/* mapa antigo de fundo */}
      <img
        src="/assets/lenda-mapa.jpg"
        alt=""
        className="porto-mapa absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-ink/60" aria-hidden="true" />

      {/* rotas douradas que se desenham sobre o mapa */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          className="porto-rota"
          d="M 140 620 C 320 480, 520 540, 700 380 S 1020 260, 1100 180"
          fill="none"
          stroke="#F0A832"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <path
          className="porto-rota"
          d="M 90 300 C 300 360, 460 240, 660 300 S 960 480, 1130 430"
          fill="none"
          stroke="#F5C877"
          strokeWidth="1.2"
          opacity="0.65"
        />
        <path
          className="porto-rota"
          d="M 220 700 C 420 660, 560 700, 780 560 S 1010 520, 1090 600"
          fill="none"
          stroke="#E4572E"
          strokeWidth="1"
          opacity="0.55"
        />
      </svg>

      <div className="container-site relative z-10">
        <div className="mx-auto max-w-[40rem] text-center">
          <p className="porto-marker mono-data mb-8 text-[0.75rem] uppercase tracking-[0.28em] text-ember">
            Cap. I — O Porto
          </p>
          <p className="porto-texto font-display text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.5] text-mist">
            Nos portos antigos, antes do radar e do satélite, havia um homem
            no topo do mastro. Enquanto a tripulação dormia, ele contava
            estrelas e correntes. Todo navio tinha um. Todo porto conhecia
            um. Mas de um só os portos falavam diferente: um vigia vindo da
            terra onde o sol nasce primeiro. Chamavam-no, simplesmente,{" "}
            <em className="italic text-gold-soft">o Jampeiro.</em>
          </p>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const PASSOS = [
  {
    n: "01",
    titulo: "Você aponta o horizonte.",
    corpo: "Origem, destino, datas. Dez segundos — o Olho não pede cadastro nem novela.",
  },
  {
    n: "02",
    titulo: "O Olho varre o mundo.",
    corpo: "Varredura em tempo real pelas rotas dos nossos parceiros, direto da borda da rede.",
  },
  {
    n: "03",
    titulo: "Você vê o que ninguém viu.",
    corpo: "Ofertas com preço final e um clique para reservar com o parceiro. Simples assim.",
  },
];

/**
 * Seção 3 — "Como o Olho enxerga": 3 passos conectados por uma linha de rota
 * SVG tracejada teal que se desenha com o scroll (scrub).
 */
export default function Method() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Linha de rota se desenha com o scroll
      const line = sectionRef.current?.querySelector<SVGLineElement>(".method-route");
      if (line) {
        const len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: true,
          },
        });
      }
      // Passos revelam em stagger
      gsap.fromTo(
        ".method-step-num",
        { opacity: 0 },
        {
          opacity: 0.35,
          duration: 0.7,
          stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        },
      );
      gsap.fromTo(
        ".method-step-body",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-ink">
      <div className="container-site py-[clamp(5rem,12vh,9rem)]">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow mb-4 text-teal">O método</p>
          <h2 className="font-display text-[clamp(2.2rem,5vw,4.25rem)] font-medium leading-none text-mist">
            Varre. Compara. <em className="italic text-amber">Revela.</em>
          </h2>
        </div>

        <div className="relative">
          {/* linha de rota conectando os passos */}
          <svg
            viewBox="0 0 1200 8"
            preserveAspectRatio="none"
            className="absolute -top-8 left-0 hidden h-2 w-full md:block"
            aria-hidden="true"
          >
            <line x1="0" y1="4" x2="1200" y2="4" stroke="#35C4B5" strokeOpacity="0.4" strokeWidth="1.5" className="method-route" />
          </svg>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {PASSOS.map((p) => (
              <div key={p.n} className="group relative">
                <span
                  aria-hidden="true"
                  className="method-step-num pointer-events-none absolute -top-10 left-0 font-display text-[7rem] font-medium leading-none text-mist opacity-0 transition-[opacity,transform] duration-500 group-hover:!opacity-60 group-hover:-translate-y-2"
                >
                  {p.n}
                </span>
                <div className="method-step-body relative pt-20">
                  <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.9rem)] font-medium text-mist">
                    {p.titulo}
                  </h3>
                  <p className="mt-3 max-w-[22rem] leading-[1.65] text-mist-dim">{p.corpo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

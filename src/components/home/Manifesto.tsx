import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const ROTAS =
  "SÃO PAULO → LISBOA · RIO → TÓQUIO · RECIFE → MADRI · SALVADOR → PARIS · FORTALEZA → MIAMI · CURITIBA → CUSCO · PORTO ALEGRE → NOVA YORK · FLORIANÓPOLIS → LONDRES · ";

function Marquee({ reverse = false }: { reverse?: boolean }) {
  const content = (
    <>
      {[0, 1].map((n) => (
        <span key={n} className="flex shrink-0 items-center">
          {ROTAS.split("·").map((trecho, i) =>
            trecho.trim() ? (
              <span key={i} className="flex items-center">
                <span className="whitespace-nowrap">{trecho.trim()}</span>
                <img src="/assets/logo.svg" alt="" className="mx-6 h-3 w-3 opacity-60" />
              </span>
            ) : null,
          )}
        </span>
      ))}
    </>
  );
  return (
    <div className="overflow-hidden py-4" aria-hidden="true">
      <div className={`flex w-max ${reverse ? "animate-marquee-right" : "animate-marquee-left"}`}>
        {content}
      </div>
    </div>
  );
}

const FRASE = "Nós não vendemos viagens. Nós enxergamos rotas.".split(" ");
const ENFASE = ["enxergamos", "rotas."];

/**
 * Seção 5 — Manifesto: marquee duplo + statement que acende palavra por
 * palavra com o scroll (efeito "farol varrendo texto").
 */
export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".manifesto-word",
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 10%",
            scrub: true,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-ink">
      <div className="border-y border-white/5 py-2">
        <Marquee />
      </div>
      <div className="container-site py-[clamp(6rem,16vh,11rem)]">
        <p className="mx-auto max-w-[56rem] text-center font-display text-[clamp(2.4rem,5.5vw,4.5rem)] font-medium leading-[1.1] text-mist">
          {FRASE.map((word, i) => (
            <span
              key={i}
              className={`manifesto-word ${ENFASE.includes(word) ? "text-iris-gradient italic" : ""}`}
              style={prefersReducedMotion() ? undefined : { opacity: 0.15 }}
            >
              {word}{" "}
            </span>
          ))}
        </p>
      </div>
      <div className="border-y border-white/5 py-2">
        <Marquee reverse />
      </div>
    </section>
  );
}

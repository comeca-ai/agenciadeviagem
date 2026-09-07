import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import IrisMotif from "@/components/IrisMotif";

const H1 = ["O", "que", "o", "Olho", "já", "encontrou."];

/**
 * Seção 1 — Hero editorial de Destinos: H1 split por palavra em máscaras,
 * sub + linha mono fade-up e íris gigante decorativa girando devagar.
 */
export default function HeroDestinos() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dest-hero-word",
        { yPercent: 90 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          stagger: 0.08,
        },
      );
      gsap.fromTo(
        ".dest-hero-fade",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.15,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          stagger: 0.1,
        },
      );
      gsap.fromTo(
        ".dest-hero-iris",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
      // rotação contínua 30s/volta
      gsap.to(".dest-hero-iris-inner", {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "none",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[70vh] items-end overflow-hidden bg-ink"
    >
      {/* Íris decorativa gigante à direita */}
      <div
        className="dest-hero-iris pointer-events-none absolute right-[-12rem] top-1/2 -translate-y-1/2 opacity-0"
        aria-hidden="true"
      >
        <div className="dest-hero-iris-inner blur-[80px]">
          <IrisMotif size={1000} opacity={0.05} spinning={false} />
        </div>
      </div>

      <div className="container-site relative z-10 pb-[clamp(4rem,10vh,7rem)] pt-[clamp(5rem,12vh,9rem)]">
        <p className="eyebrow mb-6 text-teal">Mapa de descobertas</p>
        <h1 className="max-w-[75%] font-display text-[clamp(2.8rem,7vw,6rem)] font-medium leading-[0.98] tracking-[-0.02em] text-mist md:max-w-none">
          {H1.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span
                className={
                  "dest-hero-word inline-block " +
                  (i >= 4 ? "text-iris-gradient italic" : "")
                }
              >
                {word}
                {i < H1.length - 1 ? " " : ""}
              </span>
            </span>
          ))}
        </h1>
        <p className="dest-hero-fade mt-6 max-w-[32rem] text-[1.125rem] leading-[1.65] text-mist-dim">
          Oito lugares que o vigia marcou no mapa — com o menor preço que ele
          viu nas últimas semanas.
        </p>
        <p className="dest-hero-fade mono-data mt-6 text-[0.8rem] text-teal">
          8 destinos · 4 continentes · atualizado esta semana
        </p>
      </div>
    </section>
  );
}

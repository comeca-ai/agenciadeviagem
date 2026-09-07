import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import IrisMotif from "@/components/IrisMotif";

const H1 = ["100%", "digital.", "0%", "complicado."];
const CHIPS = ["sem cadastro", "preço final exibido", "reserva no parceiro"];

/**
 * Seção 1 — Hero de Como Funciona: H1 por palavra em máscaras, sub fade-up,
 * chips de prova com pop e íris decorativa girando (45s).
 */
export default function HeroComo() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".como-hero-word",
        { yPercent: 90 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          stagger: 0.08,
        },
      );
      gsap.fromTo(
        ".como-hero-sub",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.15,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
      );
      gsap.fromTo(
        ".como-hero-chip",
        { scale: 0.85, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.6)",
          stagger: 0.08,
          delay: 0.35,
        },
      );
      gsap.fromTo(
        ".como-hero-iris",
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
      gsap.to(".como-hero-iris-inner", {
        rotation: 360,
        duration: 45,
        repeat: -1,
        ease: "none",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[60vh] items-center overflow-hidden bg-ink-2"
    >
      {/* Íris decorativa à direita */}
      <div
        className="como-hero-iris pointer-events-none absolute right-[-10rem] top-1/2 -translate-y-1/2 opacity-0"
        aria-hidden="true"
      >
        <div className="como-hero-iris-inner blur-[70px]">
          <IrisMotif size={820} opacity={0.07} spinning={false} />
        </div>
      </div>

      <div className="container-site relative z-10 py-[clamp(5rem,12vh,9rem)]">
        <div className="max-w-[66%] md:max-w-[50rem]">
          <p className="eyebrow mb-6 text-teal">A agência</p>
          <h1 className="font-display text-[clamp(2.6rem,6vw,5rem)] font-medium leading-[0.98] tracking-[-0.02em] text-mist">
            {H1.map((word, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden pb-[0.08em] align-bottom"
              >
                <span
                  className={
                    "como-hero-word inline-block " +
                    (i >= 2 ? "text-iris-gradient italic" : "")
                  }
                >
                  {word}
                  {i < H1.length - 1 ? " " : ""}
                </span>
              </span>
            ))}
          </h1>
          <p className="como-hero-sub mt-6 max-w-[36rem] text-[1.125rem] leading-[1.65] text-mist-dim">
            O Olho de Tandera é uma agência de viagens que cabe no seu bolso:
            um buscador que vasculha o mundo, mostra o preço final e entrega a
            reserva na mão do parceiro. Sem balcão, sem fila, sem letra miúda.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {CHIPS.map((chip) => (
              <span
                key={chip}
                className="como-hero-chip mono-data rounded-full border border-[rgba(237,235,228,0.2)] px-4 py-2 text-[0.8rem] text-mist"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(SplitText);

/**
 * Capítulo 2 — "O Vigia" (pin 180vh). A imagem começa fechada num
 * "olho" (clip-path circle 18%) e abre de dentro para fora; as palavras
 * do conto acendem em sequência. Assinatura visual da página.
 */
export default function CapVigia() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // olho fechado sobre o vigia
      gsap.set(".vigia-img-wrap", {
        clipPath: "circle(18% at 50% 30%)",
      });
      gsap.set(".vigia-marker", { opacity: 0, y: 20 });
      gsap.set(".vigia-glossa", { opacity: 0 });

      const split = new SplitText(".vigia-texto", { type: "words" });
      gsap.set(split.words, { opacity: 0.12 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=180%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        })
        .to(".vigia-marker", { opacity: 1, y: 0, duration: 0.06 }, 0)
        // o olho abre: 0 → 55%
        .to(
          ".vigia-img-wrap",
          {
            clipPath: "circle(120% at 50% 50%)",
            duration: 0.55,
            ease: "none",
          },
          0,
        )
        // palavras acendem em sequência
        .to(
          split.words,
          {
            opacity: 1,
            stagger: 0.012,
            duration: 0.4,
            ease: "none",
          },
          0.1,
        )
        // "Tandera" ganha glow ao acender
        .fromTo(
          ".vigia-nome",
          { textShadow: "0 0 0px rgba(240,168,50,0)" },
          {
            keyframes: [
              { textShadow: "0 0 24px rgba(240,168,50,0.35)", duration: 0.12 },
              { textShadow: "0 0 0px rgba(240,168,50,0)", duration: 0.18 },
            ],
          },
          0.22,
        )
        .to(".vigia-glossa", { opacity: 1, duration: 0.15 }, 0.75);
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      data-chapter="2"
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-ink"
      aria-label="Capítulo 2 — O Vigia"
    >
      <div className="container-site grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-12 lg:gap-14">
        {/* imagem do vigia — clip-path que abre como um olho */}
        <div className="lg:col-span-6">
          <div
            className="vigia-img-wrap relative h-[46vh] overflow-hidden rounded-[1.25rem] lg:h-[70vh]"
            style={
              reduced
                ? undefined
                : { clipPath: "circle(18% at 50% 30%)" }
            }
          >
            <img
              src="/assets/lenda-vigia.jpg"
              alt="Pintura do vigia no cesto da gávea, no topo do mastro"
              className="h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* texto do conto */}
        <div className="lg:col-span-6">
          <p className="vigia-marker mono-data mb-8 text-[0.75rem] uppercase tracking-[0.28em] text-ember">
            Cap. II — O Vigia
          </p>
          <p className="vigia-texto font-display text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.5] text-mist">
            Do Jampeiro nasceu o nome que atravessou os séculos:{" "}
            <strong className="vigia-nome font-semibold text-iris-gradient">
              Tandera
            </strong>
            . Diziam que ele enxergava terra três dias antes do horizonte. Que
            lia o vento como quem lê carta de amor. Que nunca — nunca —
            fechava os olhos.
          </p>
          <p className="vigia-glossa mono-data mt-10 text-[0.8rem] text-mist-dim">
            gávea · subst. fem. · cesto no topo do mastro onde ficava o vigia
          </p>
        </div>
      </div>
    </section>
  );
}

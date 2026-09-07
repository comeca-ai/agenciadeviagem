import { Suspense, lazy, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const NevoaCanvas = lazy(() => import("./NevoaCanvas"));

/**
 * Seção 0 — Capa pinada (150vh). H1 sobe de máscaras no load;
 * no scroll as linhas se separam e esmaecem enquanto a névoa engrossa.
 */
export default function Capa() {
  const rootRef = useRef<HTMLElement>(null);
  const densidade = useRef(0);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const linhas = gsap.utils.toArray<HTMLElement>(".capa-linha-inner");

      // Load: palavras sobem de máscaras (stagger 0.1s), "longe." com blur
      gsap.set(linhas, { yPercent: 115 });
      gsap.set(".capa-longe", { filter: "blur(8px)" });
      gsap.set([".capa-eyebrow", ".capa-cue"], { opacity: 0, y: 16 });
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .to(".capa-eyebrow", { opacity: 1, y: 0, duration: 0.8 }, 0.15)
        .to(
          linhas,
          { yPercent: 0, duration: 1, stagger: 0.1 },
          0.25,
        )
        .to(".capa-longe", { filter: "blur(0px)", duration: 1.2 }, "<0.35")
        .to(".capa-cue", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5");

      // Scroll pinado: linhas se separam e esmaecem; névoa engrossa
      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        })
        .to(".capa-linha-1", { y: -40, opacity: 0.15 }, 0)
        .to(".capa-linha-3", { y: 40, opacity: 0.15 }, 0)
        .to(".capa-linha-2", { opacity: 0.3 }, 0)
        .to([".capa-eyebrow", ".capa-cue"], { opacity: 0 }, 0)
        .to(
          densidade,
          {
            current: 1,
            duration: 1,
            ease: "none",
          },
          0,
        );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      data-chapter="0"
      className="relative flex min-h-[calc(100dvh-4.5rem)] items-center justify-center overflow-hidden bg-ink"
      aria-label="Capa — A Lenda do Vigia"
    >
      {/* fallback estático: gradiente Horizonte sob o canvas */}
      <div className="absolute inset-0 bg-horizon-gradient opacity-60" aria-hidden="true" />
      {!reduced && (
        <Suspense fallback={null}>
          <NevoaCanvas densidade={densidade} />
        </Suspense>
      )}

      <div className="container-site relative z-10 flex flex-col items-center text-center">
        <p className="capa-eyebrow mono-data mb-8 text-[0.75rem] uppercase tracking-[0.28em] text-teal">
          A Lenda do Vigia · Cap. 0
        </p>
        <h1 className="font-display text-[clamp(3rem,8vw,6.5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-mist">
          <span className="capa-linha capa-linha-1 block overflow-hidden pb-1">
            <span className="capa-linha-inner block">Toda história começa</span>
          </span>
          <span className="capa-linha capa-linha-2 block overflow-hidden pb-1">
            <span className="capa-linha-inner block">com alguém olhando</span>
          </span>
          <span className="capa-linha capa-linha-3 block overflow-hidden pb-2">
            <span className="capa-linha-inner capa-longe block italic text-amber">
              longe.
            </span>
          </span>
        </h1>
        <div className="capa-cue mt-14 flex flex-col items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-amber/40">
            <ChevronDown className="h-4 w-4 animate-cue-bounce text-amber" />
          </span>
          <span className="mono-data text-[0.65rem] uppercase tracking-[0.28em] text-mist-dim">
            desça para ouvir
          </span>
        </div>
      </div>
    </section>
  );
}

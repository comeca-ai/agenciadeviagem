import { useEffect, useRef } from "react";
import SearchPanel from "@/components/SearchPanel";
import IrisMotif from "@/components/IrisMotif";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Seção 2 — "Diga ao Olho para onde olhar" (#busca).
 * Painel de busca emergindo da pupila (margin-top negativo) sobre fundo ink-2
 * com íris decorativa gigante que gira lentamente com o scroll.
 */
export default function SearchSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".search-panel",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          scrollTrigger: { trigger: ".search-panel", start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".search-iris",
        { rotate: 0 },
        {
          rotate: 40,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="busca" ref={sectionRef} className="relative overflow-hidden bg-ink-2">
      <IrisMotif
        size={900}
        opacity={0.06}
        className="search-iris pointer-events-none absolute -right-72 top-1/2 -translate-y-1/2 blur-[60px]"
      />
      <div className="container-site relative py-[clamp(5rem,12vh,9rem)]">
        <div className="mx-auto max-w-[64rem]">
          <div className="mb-10">
            <p className="eyebrow mb-4 text-amber">A busca</p>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.25rem)] font-medium leading-none text-mist">
              Diga ao Olho para onde <em className="text-iris-gradient italic">olhar.</em>
            </h2>
          </div>
          <div className="search-panel">
            <SearchPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { goToBusca } from "@/lib/nav";

/**
 * Seção 7 — CTA final: cta-horizonte.jpg full-bleed (55vh), overlay
 * Horizonte, imagem recua (scale 1.12 → 1) com scrub.
 */
export default function CtaFinal() {
  const sectionRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-final-bg",
        { scale: 1.12 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        ".cta-final-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[55vh] overflow-hidden">
      <img
        src="/assets/cta-horizonte.jpg"
        alt="Horizonte incandescente visto de cima das nuvens ao amanhecer"
        className="cta-final-bg absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-horizon-gradient opacity-70" />

      <div className="container-site relative z-10 flex h-full flex-col items-center justify-center text-center">
        <h2 className="cta-final-item font-display text-[clamp(2.2rem,5vw,4.25rem)] font-medium leading-[1.0] text-mist">
          Viu como é <em className="text-iris-gradient italic">simples?</em>
        </h2>
        <div className="cta-final-item mt-10">
          <a
            href="/#busca"
            onClick={(e) => {
              e.preventDefault();
              goToBusca(location.pathname, navigate);
            }}
            className="sweep-hover inline-block rounded-full bg-amber px-8 py-4 font-bold text-ink transition-transform duration-250 hover:scale-[1.04] active:scale-[0.97]"
          >
            Fazer minha primeira busca
          </a>
        </div>
      </div>
    </section>
  );
}

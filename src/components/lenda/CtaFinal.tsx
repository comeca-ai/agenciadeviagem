import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { SplitText } from "gsap/SplitText";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { goToBusca } from "@/lib/nav";

gsap.registerPlugin(SplitText);

/**
 * Seção final — CTA. Imagem do horizonte com scale 1.15→1 (scrub),
 * H2 palavra a palavra e CTAs em stagger.
 */
export default function CtaFinal() {
  const rootRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const split = new SplitText(".cta-final-h2", {
        type: "lines,words",
        linesClass: "overflow-hidden",
      });
      gsap.set(split.words, { yPercent: 110 });
      gsap.set(".cta-final-btn", { opacity: 0, y: 24, scale: 0.96 });

      // imagem assenta: scale 1.15 → 1 (scrub)
      gsap.fromTo(
        ".cta-final-img",
        { scale: 1.15 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      // H2 palavra a palavra (trigger 75%) + CTAs pop
      gsap
        .timeline({
          scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
          defaults: { ease: "power4.out" },
        })
        .to(split.words, { yPercent: 0, duration: 0.8, stagger: 0.06 })
        .to(
          ".cta-final-btn",
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
          "-=0.3",
        );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[60vh] items-center overflow-hidden"
      aria-label="Chamada final"
    >
      <img
        src="/assets/cta-horizonte.jpg"
        alt=""
        className="cta-final-img absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-horizon-gradient opacity-80"
        aria-hidden="true"
      />

      <div className="container-site relative z-10 py-[clamp(5rem,12vh,9rem)] text-center">
        <h2 className="cta-final-h2 mx-auto max-w-[52rem] font-display text-[clamp(2.2rem,5vw,4.25rem)] font-medium leading-[1.05] text-mist">
          A lenda continua a cada{" "}
          <em className="italic text-amber">busca.</em>
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/#busca"
            onClick={(e) => {
              e.preventDefault();
              goToBusca(location.pathname, navigate);
            }}
            className="cta-final-btn sweep-hover rounded-full bg-amber px-8 py-4 font-bold text-ink transition-transform duration-250 hover:scale-[1.04] active:scale-[0.97]"
          >
            Deixe o Olho procurar por você
          </a>
          <Link
            to="/destinos"
            className="cta-final-btn rounded-full border border-mist/20 px-8 py-4 font-bold text-mist transition-colors duration-350 hover:border-amber hover:bg-amber/[0.08]"
          >
            Ver destinos encontrados
          </Link>
        </div>
      </div>
    </section>
  );
}

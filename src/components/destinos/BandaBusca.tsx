import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { goToBusca } from "@/lib/nav";
import { cn } from "@/lib/utils";

const H3 = ["O", "mundo", "é", "grande.", "O", "Olho", "é", "incansável."];

/**
 * Seção 5 — Banda "Não viu seu destino?": H3 acendendo palavra a palavra
 * com scrub + CTA pop para o painel de busca da home.
 */
export default function BandaBusca() {
  const sectionRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".banda-word",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.09,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 25%",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        ".banda-corpo",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        },
      );
      gsap.fromTo(
        ".banda-cta",
        { scale: 0.92, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 55%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-ink-2 py-[clamp(5rem,12vh,9rem)]">
      <div className="container-site flex flex-col items-center text-center">
        <h3 className="max-w-[52rem] font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] text-mist">
          {H3.map((word, i) => (
            <span
              key={i}
              className={cn(
                "banda-word",
                word === "incansável." && "text-iris-gradient italic",
              )}
            >
              {word}{" "}
            </span>
          ))}
        </h3>
        <p className="banda-corpo mt-6 max-w-[36rem] text-[1.05rem] leading-[1.65] text-mist-dim">
          Estes são só os favoritos da semana. Busque qualquer rota — se existe
          passagem, o Olho enxerga.
        </p>
        <div className="banda-cta mt-10">
          <a
            href="/#busca"
            onClick={(e) => {
              e.preventDefault();
              goToBusca(location.pathname, navigate);
            }}
            className="sweep-hover inline-block rounded-full bg-amber px-8 py-4 font-bold text-ink transition-transform duration-250 hover:scale-[1.04] active:scale-[0.97]"
          >
            Fazer uma busca
          </a>
        </div>
      </div>
    </section>
  );
}

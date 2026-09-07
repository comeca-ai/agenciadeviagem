import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { MoveRight } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Seção 6 — Teaser "A Lenda": lenda-farol.jpg full-bleed com parallax,
 * conteúdo à esquerda e CTA ghost.
 */
export default function LendaTeaser() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".lenda-bg",
        { yPercent: -8 },
        {
          yPercent: 8,
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
        ".lenda-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="group/lenda relative min-h-[80vh] overflow-hidden">
      <img
        src="/assets/lenda-farol.jpg"
        alt="Farol solitário em noite escura, feixe âmbar cortando a névoa"
        className="lenda-bg absolute inset-0 h-[116%] w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(6,8,15,0.92) 0%, rgba(6,8,15,0.45) 60%, rgba(6,8,15,0.75) 100%)",
        }}
      />
      {/* brilho do feixe no hover do CTA */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/lenda:opacity-[0.12]"
        style={{
          background: "radial-gradient(circle at 70% 35%, rgba(240,168,50,0.6) 0%, transparent 55%)",
        }}
      />

      <div className="container-site relative z-10 flex min-h-[80vh] items-center">
        <div className="max-w-[34rem] py-24">
          <p className="lenda-reveal eyebrow mb-4 text-amber">A Lenda</p>
          <h2 className="lenda-reveal font-display text-[clamp(2.2rem,5vw,4.25rem)] font-medium leading-[1.02] text-mist">
            Todo porto tinha um vigia. O nosso nunca <em className="text-iris-gradient italic">fechou os olhos.</em>
          </h2>
          <p className="lenda-reveal mt-6 max-w-[30rem] leading-[1.65] text-mist/95">
            Nos velhos relatos de navegação, Tandera era o nome do vigia no topo do mastro — o
            primeiro a ver terra. Séculos depois, o Olho continua aceso. Só que agora ele varre os
            céus.
          </p>
          <Link
            to="/a-lenda"
            className="lenda-reveal group mt-9 inline-flex items-center gap-2 rounded-full border border-[rgba(237,235,228,0.3)] px-7 py-3.5 font-medium text-mist transition-colors duration-250 hover:border-amber hover:bg-[rgba(240,168,50,0.08)]"
          >
            Ler a lenda
            <MoveRight size={18} className="text-teal transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

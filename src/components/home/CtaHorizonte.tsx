import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Seção 7 — CTA Horizonte: cta-horizonte.jpg full-bleed com "recuo do vigia"
 * (scale 1.15 → 1.0 com scrub) e chamada final para a busca.
 */
export default function CtaHorizonte() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".horizonte-bg",
        { scale: 1.15 },
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
        ".horizonte-word",
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
        ".horizonte-cta",
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 35%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const scrollToBusca = () =>
    document.getElementById("busca")?.scrollIntoView({ behavior: "smooth" });

  const frase = "Para onde o Olho deve olhar?".split(" ");

  return (
    <section ref={sectionRef} className="relative h-[70vh] overflow-hidden">
      <img
        src="/assets/cta-horizonte.jpg"
        alt="Horizonte incandescente visto de cima das nuvens ao amanhecer"
        className="horizonte-bg absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-horizon-gradient opacity-70" />

      <div className="container-site relative z-10 flex h-full flex-col items-center justify-center text-center">
        <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-medium leading-none text-mist">
          {frase.map((word, i) => (
            <span
              key={i}
              className={`horizonte-word ${word === "olhar?" ? "text-iris-gradient italic" : ""}`}
            >
              {word}{" "}
            </span>
          ))}
        </h2>
        <div className="horizonte-cta mt-10">
          <button
            type="button"
            onClick={scrollToBusca}
            className="sweep-hover rounded-full bg-amber px-9 py-4 text-lg font-bold text-ink transition-transform duration-250 hover:scale-[1.04] active:scale-[0.97]"
          >
            Buscar voos agora
          </button>
          <p className="mono-data mt-5 text-[0.75rem] tracking-[0.15em] text-mist-dim">
            sem cadastro · sem taxa escondida · sem novela
          </p>
        </div>
      </div>
    </section>
  );
}

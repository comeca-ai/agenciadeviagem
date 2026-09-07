import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { DESTAQUE_NORONHA, formatPreco } from "./data";

/**
 * Seção 3 — Destino em destaque: Fernando de Noronha, full-bleed 90vh com
 * parallax scrub na imagem, conteúdo em stagger e preço com count-up.
 */
export default function DestaqueNoronha() {
  const sectionRef = useRef<HTMLElement>(null);
  const precoRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Parallax da imagem: y -10% → 10%
      gsap.fromTo(
        ".noronha-bg",
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      // Conteúdo em stagger
      gsap.fromTo(
        ".noronha-item",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        },
      );
      // Count-up do preço R$ 900 → R$ 1.284
      const el = precoRef.current;
      if (el) {
        const contador = { valor: DESTAQUE_NORONHA.precoInicial };
        gsap.to(contador, {
          valor: DESTAQUE_NORONHA.preco,
          duration: 1.2,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent = formatPreco(Math.round(contador.valor)).replace(
              /^R\$\s?/,
              "",
            );
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[90vh] items-end overflow-hidden"
      aria-label="Destino em destaque: Fernando de Noronha"
    >
      {/* Fundo com parallax (scale 1.2 para margem de movimento) */}
      <img
        src={DESTAQUE_NORONHA.imagem}
        alt="Fernando de Noronha ao entardecer, com o Morro Dois Irmãos em silhueta"
        className="noronha-bg absolute inset-0 h-full w-full scale-[1.2] object-cover"
        loading="eager"
        decoding="async"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(245,242,234,.9) 0%, transparent 55%)",
        }}
        aria-hidden="true"
      />

      {/* Badge flutuante */}
      <span className="mono-data absolute left-[clamp(1.25rem,4vw,3rem)] top-8 rounded-full bg-amber px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-night md:left-[max(clamp(1.25rem,4vw,3rem),calc((100vw-80rem)/2+clamp(1.25rem,4vw,3rem)))]">
        Destaque do Olho
      </span>

      <div className="container-site relative z-10 pb-[clamp(3.5rem,9vh,6rem)]">
        <div className="max-w-[40rem]">
          <h2 className="noronha-item font-display text-[clamp(2.2rem,4.5vw,3.75rem)] font-medium leading-[1.02] text-mist">
            Fernando de Noronha
          </h2>
          <p className="noronha-item mono-data mt-5 text-[0.85rem] text-teal">
            {DESTAQUE_NORONHA.rota.origem} → {DESTAQUE_NORONHA.rota.destino} ·
            voos a partir de
          </p>
          <p className="noronha-item mono-data mt-1 text-[clamp(2rem,4vw,3rem)] font-bold text-mist">
            <span className="mr-1 text-[0.55em] font-medium text-mist-dim">
              R$
            </span>
            <span ref={precoRef}>
              {formatPreco(DESTAQUE_NORONHA.precoInicial).replace(/^R\$\s?/, "")}
            </span>
          </p>
          <p className="noronha-item mono-data mt-1 text-[0.7rem] text-mist-dim">
            por pessoa · ida e volta · taxas incluídas · sujeito a alteração
          </p>
          <p className="noronha-item mt-6 font-display text-[1.15rem] italic leading-[1.5] text-mist">
            “{DESTAQUE_NORONHA.frase}”
          </p>
          <div className="noronha-item mt-8">
            <Link
              to={DESTAQUE_NORONHA.url}
              className="sweep-hover inline-block rounded-full bg-amber px-7 py-3.5 font-bold text-night transition-transform duration-250 hover:scale-[1.04] active:scale-[0.97]"
            >
              Ver voos para Noronha
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

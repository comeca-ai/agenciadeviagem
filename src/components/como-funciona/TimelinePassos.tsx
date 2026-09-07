import { useEffect, useRef } from "react";
import {
  MousePointerClick,
  ScanSearch,
  Scale,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Passo {
  numero: string;
  icone: LucideIcon;
  titulo: string;
  corpo: string;
}

const PASSOS: Passo[] = [
  {
    numero: "01",
    icone: MousePointerClick,
    titulo: "Você aponta.",
    corpo:
      "Origem, destino, datas e quantos viajam. Nada de cadastro: o Olho não guarda sua vida, guarda sua rota.",
  },
  {
    numero: "02",
    icone: ScanSearch,
    titulo: "O Olho varre.",
    corpo:
      "Em segundos, a busca percorre as ofertas dos nossos parceiros direto da borda da rede — rápido em qualquer lugar do Brasil.",
  },
  {
    numero: "03",
    icone: Scale,
    titulo: "Você compara com clareza.",
    corpo:
      "Preço final por pessoa, taxas incluídas, escalas e horários na cara. O selo Escolha do Olho marca o melhor custo-benefício.",
  },
  {
    numero: "04",
    icone: ExternalLink,
    titulo: "A reserva é com o parceiro.",
    corpo:
      "Um clique e você conclui a compra no site do fornecedor, com as condições e o suporte dele. O Olho enxerga — quem voa é você.",
  },
];

/**
 * Seção 2 — "Do seu desejo ao embarque": linha do tempo vertical com
 * progresso teal preenchido por scrub e 4 passos alternando lados.
 */
export default function TimelinePassos() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Linha de progresso teal: preenche com o scroll
      gsap.fromTo(
        ".tl-progresso",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".tl-trilha",
            start: "top 70%",
            end: "bottom 60%",
            scrub: true,
          },
        },
      );
      // Cada passo revela quando a linha o toca
      gsap.utils.toArray<HTMLElement>(".tl-passo").forEach((passo) => {
        const circulo = passo.querySelector(".tl-circulo");
        const icone = passo.querySelector(".tl-icone");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: passo, start: "top 70%", once: true },
        });
        tl.fromTo(
          circulo,
          { scale: 0 },
          { scale: 1, duration: 0.4, ease: "back.out(1.6)" },
        )
          .to(
            icone,
            {
              color: "#35C4B5",
              duration: 0.3,
            },
            "<0.15",
          )
          .to(
            circulo,
            {
              boxShadow: "0 0 24px rgba(53,196,181,0.35)",
              borderColor: "rgba(53,196,181,0.4)",
              duration: 0.4,
            },
            "<",
          )
          .fromTo(
            passo.querySelector(".tl-titulo"),
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "cubic-bezier(0.22, 1, 0.36, 1)" },
            "-=0.2",
          )
          .fromTo(
            passo.querySelector(".tl-corpo"),
            { opacity: 0 },
            { opacity: 1, duration: 0.5 },
            "-=0.35",
          );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-ink py-[clamp(5rem,12vh,9rem)]">
      <div className="container-site">
        <p className="eyebrow mb-4 text-teal">Passo a passo</p>
        <h2 className="mb-[clamp(3rem,8vh,5rem)] max-w-[44rem] font-display text-[clamp(2.2rem,5vw,4.25rem)] font-medium leading-[1.0] text-mist">
          Do seu desejo ao <em className="text-iris-gradient italic">embarque.</em>
        </h2>

        <div className="tl-trilha relative">
          {/* Trilha base + progresso teal */}
          <div
            className="absolute bottom-0 left-[1.4rem] top-0 w-[2px] -translate-x-1/2 rounded-full bg-ink-3 md:left-1/2"
            aria-hidden="true"
          />
          <div
            className="tl-progresso absolute bottom-0 left-[1.4rem] top-0 w-[2px] -translate-x-1/2 origin-top rounded-full bg-teal"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-16 md:gap-24">
            {PASSOS.map((passo, i) => {
              const esquerda = i % 2 === 0;
              const Icone = passo.icone;
              return (
                <div
                  key={passo.numero}
                  className={cn(
                    "tl-passo relative pl-16 md:w-1/2 md:pl-0",
                    esquerda ? "md:mr-auto md:pr-20" : "md:ml-auto md:pl-20",
                  )}
                >
                  {/* Círculo do ícone sobre a trilha */}
                  <div
                    className={cn(
                      "absolute left-[1.4rem] top-0 -translate-x-1/2",
                      esquerda
                        ? "md:left-auto md:right-0 md:translate-x-1/2"
                        : "md:left-0 md:-translate-x-1/2",
                    )}
                  >
                    <div className="tl-circulo flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(237,235,228,0.07)] bg-ink-3">
                      <Icone size={28} className="tl-icone text-mist-dim" />
                    </div>
                  </div>

                  <span className="mono-data text-[0.9rem] font-medium text-ember">
                    {passo.numero}
                  </span>
                  <h3 className="tl-titulo mt-2 text-[1.25rem] font-bold text-mist">
                    {passo.titulo}
                  </h3>
                  <p className="tl-corpo mt-3 max-w-[26rem] leading-[1.65] text-mist-dim">
                    {passo.corpo}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CAPITULOS = [
  { n: 1, romano: "I", titulo: "O Porto" },
  { n: 2, romano: "II", titulo: "O Vigia" },
  { n: 3, romano: "III", titulo: "O Horizonte" },
  { n: 4, romano: "IV", titulo: "O Farol Apagado" },
  { n: 5, romano: "V", titulo: "O Olho Aceso" },
];

/** Nó de íris miniatura (núcleo + anel). */
function NoIris({ ativo }: { ativo: boolean }) {
  return (
    <span
      className={cn(
        "relative flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-all duration-500",
        ativo
          ? "border-amber shadow-[0_0_16px_rgba(240,168,50,0.55)]"
          : "border-mist-dim/50",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full transition-all duration-500",
          ativo
            ? "bg-[radial-gradient(circle,#F5C877_0%,#F0A832_45%,#E4572E_100%)]"
            : "bg-mist-dim/40",
        )}
      />
    </span>
  );
}

/**
 * Régua de capítulos persistente: 5 nós de íris ligados por linha fina,
 * preenchida com o progresso de scroll da página (scrub). Nó ativo
 * (IntersectionObserver por capítulo) acende âmbar.
 * Desktop: vertical fixa à esquerda. Mobile: 5 pontos fixos no rodapé.
 */
export default function ChapterRail() {
  const [ativo, setAtivo] = useState(0);
  const fillRef = useRef<HTMLDivElement>(null);

  // Nó ativo por capítulo visível
  useEffect(() => {
    const secoes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-chapter]"),
    );
    if (secoes.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setAtivo(Number(entry.target.getAttribute("data-chapter")));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    secoes.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Preenchimento da linha com o progresso global da página
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (fillRef.current) {
            fillRef.current.style.transform = `scaleY(${self.progress})`;
          }
        },
      });
    });
    return () => ctx.revert();
  }, []);

  const pularPara = (n: number) => {
    document
      .querySelector(`[data-chapter="${n}"]`)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop: régua vertical à esquerda */}
      <nav
        aria-label="Capítulos da lenda"
        className="fixed left-[clamp(0.75rem,2.5vw,2rem)] top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      >
        <div className="relative flex flex-col items-center gap-10 py-2">
          {/* linha de fundo + preenchimento */}
          <div className="absolute bottom-4 left-1/2 top-4 w-px -translate-x-1/2 bg-mist-dim/20" />
          <div
            ref={fillRef}
            className="absolute bottom-4 left-1/2 top-4 w-px origin-top -translate-x-1/2 scale-y-0 bg-gradient-to-b from-gold-soft via-amber to-ember"
          />
          {CAPITULOS.map((cap) => (
            <button
              key={cap.n}
              type="button"
              onClick={() => pularPara(cap.n)}
              className="group relative flex items-center"
              aria-label={`Capítulo ${cap.romano} — ${cap.titulo}`}
            >
              <NoIris ativo={ativo === cap.n} />
              <span
                className={cn(
                  "pointer-events-none absolute left-6 whitespace-nowrap text-left transition-all duration-500",
                  ativo === cap.n
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-80",
                )}
              >
                <span className="mono-data block text-[0.65rem] text-ember">
                  CAP. {cap.romano}
                </span>
                <span className="font-display text-sm italic text-mist">
                  {cap.titulo}
                </span>
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile: 5 pontos fixos no rodapé */}
      <nav
        aria-label="Capítulos da lenda"
        className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/10 bg-[rgba(6,8,15,0.72)] px-4 py-2.5 backdrop-blur-[16px] lg:hidden"
      >
        {CAPITULOS.map((cap) => (
          <button
            key={cap.n}
            type="button"
            onClick={() => pularPara(cap.n)}
            aria-label={`Capítulo ${cap.romano} — ${cap.titulo}`}
          >
            <NoIris ativo={ativo === cap.n} />
          </button>
        ))}
      </nav>
    </>
  );
}

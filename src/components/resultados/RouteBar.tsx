import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { cityByIata } from "@/lib/cities";
import type { SearchParams } from "@/lib/search";
import { fmtIntervaloDatas } from "./format";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const DURACAO = 800; // ms até o caractere travar
const STAGGER = 50; // ms por caractere

/** Texto com efeito split-flap: caracteres aleatórios → finais. */
function SplitFlap({ text, startDelay = 0 }: { text: string; startDelay?: number }) {
  const [display, setDisplay] = useState<string[]>(() => text.split(""));

  useEffect(() => {
    const alvo = text.split("");
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const elapsed = t - t0 - startDelay;
      let done = true;
      const prox = alvo.map((final, i) => {
        const inicio = i * STAGGER;
        if (elapsed >= inicio + DURACAO * 0.6) return final;
        done = false;
        if (elapsed < inicio) return final === " " ? " " : "\u00A0";
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });
      setDisplay(prox);
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, startDelay]);

  return (
    <span aria-label={text} className="inline-flex">
      {display.map((c, i) => (
        <span key={i} aria-hidden="true" className="inline-block">
          {c}
        </span>
      ))}
    </span>
  );
}

interface RouteBarProps {
  params: SearchParams;
  isDemo: boolean;
  /** dispara a animação de entrada (após o loading) */
  ativo: boolean;
  onEditar: () => void;
}

/**
 * Seção 1 — barra sticky da rota (top 4.5rem, logo abaixo da navbar):
 * códigos IATA grandes com split-flap, linha de rota SVG, metadados e o
 * botão "Editar busca".
 */
export default function RouteBar({ params, isDemo, ativo, onEditar }: RouteBarProps) {
  const origem = cityByIata(params.origem);
  const destino = cityByIata(params.destino);

  const metadados = [
    fmtIntervaloDatas(params.ida, params.volta),
    `${params.pax} ${params.pax === 1 ? "adulto" : "adultos"}`,
    params.volta ? "ida e volta" : "só ida",
  ];

  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={ativo ? { y: 0 } : { y: "-100%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-[4.5rem] z-30 border-b border-white/5 bg-[rgba(11,16,28,0.85)] backdrop-blur-[16px] relative"
    >
      <div className="container-site flex flex-wrap items-center gap-x-8 gap-y-3 py-4">
        {/* Rota grande */}
        <div className="flex items-center gap-4">
          <span className="mono-data text-[clamp(1.4rem,2.6vw,2rem)] font-bold text-mist">
            {ativo ? <SplitFlap text={params.origem} /> : params.origem}
          </span>
          <svg viewBox="0 0 72 12" className="w-14 shrink-0 sm:w-16" aria-hidden="true">
            <line
              x1="4"
              y1="6"
              x2="68"
              y2="6"
              stroke="#35C4B5"
              strokeOpacity="0.6"
              strokeWidth="1.5"
              className="route-line"
            />
            <circle cx="4" cy="6" r="3" fill="#F0A832" />
            <circle cx="68" cy="6" r="3" fill="#35C4B5" />
          </svg>
          <span className="mono-data text-[clamp(1.4rem,2.6vw,2rem)] font-bold text-mist">
            {ativo ? <SplitFlap text={params.destino} startDelay={150} /> : params.destino}
          </span>
          {isDemo && (
            <span className="mono-data hidden rounded-full border border-[rgba(53,196,181,0.35)] px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] text-teal sm:inline-block">
              demonstração
            </span>
          )}
        </div>

        {/* Nomes + metadados */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.85rem] font-medium text-mist-dim">
            {origem?.city ?? params.origem} → {destino?.city ?? params.destino}
          </p>
          <p className="mono-data mt-0.5 text-[0.85rem] text-mist-dim">
            {metadados.join(" · ")}
          </p>
        </div>

        {/* Editar busca */}
        <button
          type="button"
          onClick={onEditar}
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(237,235,228,0.2)] px-4 py-2 text-[0.85rem] font-medium text-mist transition-colors hover:border-[rgba(240,168,50,0.5)] hover:bg-[rgba(240,168,50,0.08)]"
        >
          <SlidersHorizontal size={14} />
          Editar busca
        </button>
      </div>
      {isDemo && (
        <span className="mono-data absolute right-4 top-1 rounded-full border border-[rgba(53,196,181,0.35)] px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.14em] text-teal sm:hidden">
          demo
        </span>
      )}
    </motion.div>
  );
}

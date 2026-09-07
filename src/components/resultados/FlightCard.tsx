import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { CIA_NOMES, type Oferta } from "@/data/demo-ofertas";
import {
  chegadaEstimada,
  chegadaPlus1,
  fmtDuracao,
  fmtHora,
  fmtNum,
} from "./format";

/** Preço com count-up de 90% → 100% quando entra na viewport. */
function PrecoCountUp({ valor }: { valor: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [v, setV] = useState(Math.round(valor * 0.9));

  useEffect(() => {
    if (!inView) return;
    const inicio = valor * 0.9;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 800);
      setV(Math.round(inicio + (1 - Math.pow(1 - p, 3)) * (valor - inicio)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, valor]);

  return (
    <span ref={ref}>
      <span className="mr-1 text-[0.6em] font-medium text-mist-dim">R$</span>
      {fmtNum(v)}
    </span>
  );
}

function rotuloEscalas(escalas: number | null, via?: string | null): string {
  if (escalas == null) return "—";
  if (escalas === 0) return "direto";
  const n = escalas >= 2 ? "2+ escalas" : "1 escala";
  return via ? `${escalas} · ${via}` : n;
}

interface FlightCardProps {
  oferta: Oferta;
  badge?: "Escolha do Olho" | "Menor preço";
  index: number;
  onReservar: (oferta: Oferta) => void;
}

/**
 * Seção 3.2 — Card de voo: layout horizontal no desktop / vertical no mobile,
 * tilt 3D suave no hover, preço em count-up e disclaimer de compliance no
 * rodapé. "Reservar" abre o modal de saída (nunca navega direto).
 */
export default function FlightCard({ oferta, badge, index, onReservar }: FlightCardProps) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 4); // máx. ±2°
    rx.set(-py * 4);
  };
  const onMouseLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const chegada = oferta.chegada ?? chegadaEstimada(oferta.partida, oferta.duracao_min);
  const maisUm = chegadaPlus1(oferta.partida, chegada);
  const nomeCia = CIA_NOMES[oferta.cia] ?? oferta.cia;

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
      transition={{
        duration: 0.55,
        delay: Math.min(index, 7) * 0.07,
        ease: [0.22, 1, 0.36, 1],
        layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      className={cn(
        "sweep-hover group relative overflow-hidden rounded-[1.25rem]",
        "border border-[rgba(237,235,228,0.07)] bg-ink-3",
        "transition-[border-color,box-shadow] duration-350",
        "hover:border-[rgba(240,168,50,0.35)] hover:shadow-[0_0_80px_rgba(240,168,50,0.12)]",
      )}
    >
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:gap-8">
        {/* Esq: cia + selo */}
        <div className="flex items-center gap-3 lg:w-44 lg:shrink-0 lg:flex-col lg:items-start lg:gap-3">
          <div className="flex items-center gap-3">
            <span className="mono-data flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(237,235,228,0.12)] bg-ink-2 text-[0.8rem] font-bold text-mist">
              {oferta.cia}
            </span>
            <div>
              <p className="text-[0.95rem] font-medium text-mist">{nomeCia}</p>
              <p className="mono-data text-[0.7rem] text-mist-dim">
                {oferta.cia} {oferta.numero_voo}
              </p>
            </div>
          </div>
          {badge && (
            <motion.span
              animate={
                badge === "Escolha do Olho"
                  ? {
                      boxShadow: [
                        "0 0 0px rgba(240,168,50,0)",
                        "0 0 18px rgba(240,168,50,0.45)",
                        "0 0 0px rgba(240,168,50,0)",
                      ],
                    }
                  : undefined
              }
              transition={badge === "Escolha do Olho" ? { duration: 4, repeat: Infinity } : undefined}
              className={cn(
                "mono-data rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.08em]",
                badge === "Menor preço"
                  ? "bg-[rgba(228,87,46,0.14)] text-ember"
                  : "bg-[rgba(240,168,50,0.14)] text-amber",
              )}
            >
              {badge}
            </motion.span>
          )}
        </div>

        {/* Centro: horários + linha de rota */}
        <div className="min-w-0 flex-1">
          <p className="text-[1.3rem] font-bold text-mist">
            {fmtHora(oferta.partida)}
            <span className="mx-2 text-teal">→</span>
            {fmtHora(chegada)}
            {maisUm && <sup className="mono-data ml-0.5 text-[0.6em] text-teal">+1</sup>}
          </p>
          <svg viewBox="0 0 200 12" className="mt-2 w-full max-w-xs" aria-hidden="true">
            <line
              x1="4"
              y1="6"
              x2="196"
              y2="6"
              stroke="#35C4B5"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              className="route-line"
            />
            <circle cx="4" cy="6" r="3" fill="#F0A832" />
            <circle cx="196" cy="6" r="3" fill="#35C4B5" />
          </svg>
          <p className="mono-data mt-2 text-[0.8rem] text-mist-dim">
            {oferta.origem}–{oferta.destino} · {rotuloEscalas(oferta.escalas, oferta.via)} ·{" "}
            {fmtDuracao(oferta.duracao_min)}
          </p>
        </div>

        {/* Dir: preço + reservar */}
        <div className="relative flex items-center justify-between gap-4 lg:w-52 lg:shrink-0 lg:flex-col lg:items-end lg:justify-center lg:gap-3">
          <div
            className="pointer-events-none absolute -inset-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at 60% 60%, rgba(240,168,50,0.14) 0%, transparent 60%)",
            }}
          />
          <div className="relative lg:text-right">
            <p className="mono-data text-[1.6rem] font-bold text-mist">
              <PrecoCountUp valor={oferta.preco} />
            </p>
            <p className="mono-data mt-0.5 text-[0.65rem] text-mist-dim">
              por pessoa · taxas incluídas
            </p>
          </div>
          <button
            type="button"
            onClick={() => onReservar(oferta)}
            className="sweep-hover relative inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber px-5 py-2.5 text-[0.85rem] font-bold text-ink transition-transform duration-250 hover:scale-[1.04] active:scale-[0.97]"
          >
            Reservar
          </button>
        </div>
      </div>

      {/* Rodapé: disclaimer de compliance */}
      <div className="flex items-center gap-1.5 border-t border-[rgba(237,235,228,0.06)] px-5 py-3 sm:px-6">
        <ExternalLink size={12} className="shrink-0 text-mist-dim" />
        <p className="mono-data text-[0.7rem] text-mist-dim">
          Preço sujeito a alteração · reserva concluída no site do parceiro
        </p>
      </div>
    </motion.article>
  );
}

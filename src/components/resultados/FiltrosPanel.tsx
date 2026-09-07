import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtBRL, type FaixaHorario } from "./format";

export type Ordem = "olho" | "preco" | "rapido";

export interface Filtros {
  ordem: Ordem;
  /** 0 = direto · 1 = 1 escala · 2 = 2+ escalas */
  escalas: number[];
  precoMax: number;
  horarios: FaixaHorario[];
}

export const PRECO_MIN = 2800;
export const PRECO_MAX = 3600;

export const FILTROS_INICIAIS: Filtros = {
  ordem: "olho",
  escalas: [0, 1, 2],
  precoMax: PRECO_MAX,
  horarios: [],
};

/** Nº de filtros fora do padrão (para o badge do botão mobile). */
export function contarFiltrosAtivos(f: Filtros): number {
  let n = 0;
  if (f.ordem !== "olho") n++;
  if (f.escalas.length < 3) n++;
  if (f.precoMax < PRECO_MAX) n++;
  if (f.horarios.length > 0) n++;
  return n;
}

const ORDENS: { id: Ordem; label: string; badge?: string }[] = [
  { id: "olho", label: "Escolha do Olho", badge: "padrão" },
  { id: "preco", label: "Menor preço" },
  { id: "rapido", label: "Mais rápido" },
];

const ESCALAS: { id: number; label: string }[] = [
  { id: 0, label: "Direto" },
  { id: 1, label: "1 escala" },
  { id: 2, label: "2+ escalas" },
];

const HORARIOS: { id: FaixaHorario; label: string }[] = [
  { id: "madrugada", label: "Madrugada" },
  { id: "manha", label: "Manhã" },
  { id: "tarde", label: "Tarde" },
  { id: "noite", label: "Noite" },
];

function TituloGrupo({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mono-data mb-3 text-[0.75rem] uppercase tracking-[0.2em] text-mist-dim">
      {children}
    </h3>
  );
}

/** Checkbox custom: quadrado 18px, check âmbar com draw-in. */
function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-[0.9rem] text-mist transition-colors hover:text-amber"
    >
      <span
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-colors",
          checked ? "border-amber bg-[rgba(240,168,50,0.14)]" : "border-[rgba(237,235,228,0.25)]",
        )}
      >
        {checked && (
          <motion.svg viewBox="0 0 12 10" className="h-2.5 w-3" aria-hidden="true">
            <motion.path
              d="M1 5 L4.5 8.5 L11 1"
              fill="none"
              stroke="#F0A832"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2 }}
            />
          </motion.svg>
        )}
      </span>
      {label}
    </button>
  );
}

interface FiltrosPanelProps {
  filtros: Filtros;
  onChange: (f: Filtros) => void;
}

/**
 * Seção 3.1 — Painel de filtros (conteúdo do card; a página decide se fica
 * sticky no desktop ou dentro do bottom-sheet no mobile).
 */
export default function FiltrosPanel({ filtros, onChange }: FiltrosPanelProps) {
  const set = (patch: Partial<Filtros>) => onChange({ ...filtros, ...patch });

  const toggleEscala = (id: number) =>
    set({
      escalas: filtros.escalas.includes(id)
        ? filtros.escalas.filter((e) => e !== id)
        : [...filtros.escalas, id].sort(),
    });

  const toggleHorario = (id: FaixaHorario) =>
    set({
      horarios: filtros.horarios.includes(id)
        ? filtros.horarios.filter((h) => h !== id)
        : [...filtros.horarios, id],
    });

  return (
    <div className="rounded-[1.25rem] border border-[rgba(237,235,228,0.07)] bg-ink-3 p-6">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="flex flex-col gap-7"
      >
        {/* Ordenar por */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <TituloGrupo>Ordenar por</TituloGrupo>
          <div className="flex flex-col gap-2">
            {ORDENS.map((o) => (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={filtros.ordem === o.id}
                onClick={() => set({ ordem: o.id })}
                className={cn(
                  "flex items-center justify-between rounded-full border px-4 py-2 text-left text-[0.85rem] transition-colors",
                  filtros.ordem === o.id
                    ? "border-[rgba(240,168,50,0.5)] bg-[rgba(240,168,50,0.1)] text-mist"
                    : "border-[rgba(237,235,228,0.12)] text-mist-dim hover:text-mist",
                )}
              >
                {o.label}
                {o.badge && (
                  <span className="mono-data rounded-full bg-[rgba(240,168,50,0.18)] px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-amber">
                    {o.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Escalas */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <TituloGrupo>Escalas</TituloGrupo>
          <div className="flex flex-col gap-2.5">
            {ESCALAS.map((e) => (
              <Checkbox
                key={e.id}
                checked={filtros.escalas.includes(e.id)}
                onChange={() => toggleEscala(e.id)}
                label={e.label}
              />
            ))}
          </div>
        </motion.div>

        {/* Preço máximo */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <TituloGrupo>Preço máximo</TituloGrupo>
          <p className="mono-data mb-2 text-[0.9rem] text-amber">{fmtBRL(filtros.precoMax)}</p>
          <input
            type="range"
            min={PRECO_MIN}
            max={PRECO_MAX}
            step={10}
            value={filtros.precoMax}
            onChange={(e) => set({ precoMax: Number(e.target.value) })}
            aria-label="Preço máximo"
            className={cn(
              "h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-2 outline-none",
              "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(240,168,50,0.6)]",
              "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-amber [&::-moz-range-thumb]:shadow-[0_0_12px_rgba(240,168,50,0.6)]",
            )}
          />
          <div className="mono-data mt-1.5 flex justify-between text-[0.65rem] text-mist-dim">
            <span>{fmtBRL(PRECO_MIN)}</span>
            <span>{fmtBRL(PRECO_MAX)}</span>
          </div>
        </motion.div>

        {/* Horário de saída */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <TituloGrupo>Horário de saída</TituloGrupo>
          <div className="flex flex-wrap gap-2">
            {HORARIOS.map((h) => {
              const ativo = filtros.horarios.includes(h.id);
              return (
                <button
                  key={h.id}
                  type="button"
                  aria-pressed={ativo}
                  onClick={() => toggleHorario(h.id)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-[0.8rem] transition-colors",
                    ativo
                      ? "border-[rgba(240,168,50,0.5)] bg-[rgba(240,168,50,0.12)] text-mist"
                      : "border-[rgba(237,235,228,0.12)] text-mist-dim hover:text-mist",
                  )}
                >
                  {h.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Limpar filtros */}
        <motion.button
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          type="button"
          onClick={() => onChange({ ...FILTROS_INICIAIS })}
          className="mono-data inline-flex items-center gap-1.5 self-start text-[0.75rem] text-ember transition-colors hover:text-mist"
        >
          <X size={12} />
          Limpar filtros
        </motion.button>
      </motion.div>
    </div>
  );
}

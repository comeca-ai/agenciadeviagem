import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlaneTakeoff,
  PlaneLanding,
  CalendarDays,
  Users,
  ArrowLeftRight,
  Info,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { searchCities, type City } from "@/lib/cities";
import { buildSearchUrl } from "@/lib/search";

type TripType = "ida-volta" | "so-ida";

interface SearchPanelProps {
  initial?: {
    origem?: City | null;
    destino?: City | null;
    ida?: string;
    volta?: string;
    pax?: number;
  };
  className?: string;
}

/* ------------------------- Autocomplete de cidade ------------------------ */

interface CityFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: City | null;
  onChange: (c: City | null) => void;
  placeholder: string;
  error?: string;
}

function CityField({ id, label, icon, value, onChange, placeholder, error }: CityFieldProps) {
  const [text, setText] = useState(value ? `${value.city} (${value.iata})` : "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const results = useMemo(() => (value ? [] : searchCities(text)), [text, value]);

  const select = (c: City) => {
    onChange(c);
    setText(`${c.city} (${c.iata})`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={cn(
          "mono-data mb-2 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] transition-colors",
          error ? "text-ember" : "text-mist-dim",
        )}
      >
        {icon}
        {label}
      </label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(null);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (!open || results.length === 0) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => (a + 1) % results.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => (a - 1 + results.length) % results.length);
          } else if (e.key === "Enter") {
            e.preventDefault();
            select(results[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        className={cn(
          "mono-data w-full rounded-xl border bg-ink-2/70 px-4 py-3.5 text-[0.95rem] text-mist outline-none transition-colors placeholder:text-mist-dim/50",
          error
            ? "border-[rgba(228,87,46,0.6)]"
            : "border-[rgba(237,235,228,0.09)] focus:border-[rgba(240,168,50,0.35)]",
        )}
      />
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            role="listbox"
            className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-auto rounded-2xl border border-[rgba(237,235,228,0.09)] bg-ink-3 p-1.5 shadow-2xl scroller-thin"
          >
            {results.map((c, i) => (
              <li key={c.iata}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(c)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    i === active && "bg-[rgba(240,168,50,0.1)]",
                  )}
                >
                  <span>
                    <span className="block text-[0.95rem] font-medium text-mist">{c.city}</span>
                    <span className="block text-[0.85rem] text-mist-dim">{c.airport}</span>
                  </span>
                  <span className="mono-data shrink-0 text-[0.85rem] font-medium text-amber">
                    {c.iata}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {error && (
        <motion.p
          initial={{ x: -6, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mono-data mt-1.5 text-[0.7rem] text-ember"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

/* ------------------------------- Painel --------------------------------- */

export default function SearchPanel({ initial, className }: SearchPanelProps) {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<TripType>("ida-volta");
  const [origem, setOrigem] = useState<City | null>(initial?.origem ?? null);
  const [destino, setDestino] = useState<City | null>(initial?.destino ?? null);
  const [ida, setIda] = useState(initial?.ida ?? "");
  const [volta, setVolta] = useState(initial?.volta ?? "");
  const [pax, setPax] = useState(initial?.pax ?? 1);
  const [paxOpen, setPaxOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [swapped, setSwapped] = useState(false);
  const swapFlashRef = useRef<HTMLDivElement>(null);

  const doSwap = () => {
    setSwapped((s) => !s);
    const o = origem;
    setOrigem(destino);
    setDestino(o);
    // micro-flash
    const el = swapFlashRef.current;
    if (el) {
      el.style.opacity = "1";
      setTimeout(() => (el.style.opacity = "0"), 250);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!origem) errs.origem = "Escolha uma cidade de origem.";
    if (!destino) errs.destino = "Escolha um destino.";
    if (origem && destino && origem.iata === destino.iata)
      errs.destino = "Origem e destino precisam ser diferentes.";
    if (!ida) errs.ida = "Escolha a data de ida.";
    if (tripType === "ida-volta" && volta && ida && volta < ida)
      errs.volta = "A volta não pode ser antes da ida.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    // Simula a varredura do Olho por 1.4s antes de navegar
    setTimeout(() => {
      navigate(
        buildSearchUrl({
          origem: origem!.iata,
          destino: destino!.iata,
          ida,
          volta: tripType === "ida-volta" && volta ? volta : undefined,
          pax,
        }),
      );
    }, 1400);
  };

  const bumpPax = (delta: number) => setPax((p) => Math.min(9, Math.max(1, p + delta)));

  return (
    <div
      className={cn(
        "relative rounded-[1.75rem] border border-[rgba(237,235,228,0.09)] bg-[rgba(20,27,44,0.75)] p-[clamp(1.5rem,3vw,2.5rem)] backdrop-blur-[24px]",
        className,
      )}
      style={{ boxShadow: "0 0 120px rgba(240,168,50,0.08)" }}
    >
      <div
        ref={swapFlashRef}
        className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[rgba(240,168,50,0.06)] opacity-0 transition-opacity duration-300"
      />

      <form onSubmit={submit} noValidate>
        {/* Tabs de tipo de viagem */}
        <div className="mb-6 flex gap-2">
          {(
            [
              { id: "ida-volta", label: "Ida e volta" },
              { id: "so-ida", label: "Só ida" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTripType(t.id)}
              className={cn(
                "relative rounded-full px-4 py-2 text-[0.85rem] font-medium transition-colors",
                tripType === t.id ? "text-amber" : "text-mist-dim hover:text-mist",
              )}
            >
              {tripType === t.id && (
                <motion.span
                  layoutId="trip-tab"
                  className="absolute inset-0 rounded-full bg-[rgba(240,168,50,0.14)]"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Grade de campos */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Origem + troca + destino */}
          <div className="relative md:col-span-2">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <CityField
                id="origem"
                label="Origem"
                icon={<PlaneTakeoff size={13} className="text-teal" />}
                value={origem}
                onChange={setOrigem}
                placeholder="De onde o Olho parte?"
                error={errors.origem}
              />
              <CityField
                id="destino"
                label="Destino"
                icon={<PlaneLanding size={13} className="text-teal" />}
                value={destino}
                onChange={setDestino}
                placeholder="Para onde ele deve olhar?"
                error={errors.destino}
              />
            </div>
            <button
              type="button"
              onClick={doSwap}
              aria-label="Trocar origem e destino"
              className="absolute left-1/2 top-[3.2rem] z-10 hidden h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-[rgba(237,235,228,0.12)] bg-ink-2 text-mist transition-colors hover:border-[rgba(240,168,50,0.4)] hover:text-amber md:flex"
            >
              <ArrowLeftRight
                size={15}
                className="transition-transform duration-400"
                style={{
                  transform: swapped ? "rotate(180deg)" : "rotate(0deg)",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            </button>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="ida"
                className={cn(
                  "mono-data mb-2 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em]",
                  errors.ida ? "text-ember" : "text-mist-dim",
                )}
              >
                <CalendarDays size={13} className="text-teal" /> Ida
              </label>
              <input
                id="ida"
                type="date"
                value={ida}
                onChange={(e) => setIda(e.target.value)}
                className={cn(
                  "mono-data w-full rounded-xl border bg-ink-2/70 px-4 py-3.5 text-[0.9rem] text-mist outline-none transition-colors [color-scheme:dark]",
                  errors.ida
                    ? "border-[rgba(228,87,46,0.6)]"
                    : "border-[rgba(237,235,228,0.09)] focus:border-[rgba(240,168,50,0.35)]",
                )}
              />
              {errors.ida && (
                <motion.p
                  initial={{ x: -6, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="mono-data mt-1.5 text-[0.7rem] text-ember"
                >
                  {errors.ida}
                </motion.p>
              )}
            </div>
            <AnimatePresence initial={false}>
              {tripType === "ida-volta" && (
                <motion.div
                  key="volta"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <label
                    htmlFor="volta"
                    className={cn(
                      "mono-data mb-2 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em]",
                      errors.volta ? "text-ember" : "text-mist-dim",
                    )}
                  >
                    <CalendarDays size={13} className="text-teal" /> Volta
                  </label>
                  <input
                    id="volta"
                    type="date"
                    value={volta}
                    min={ida || undefined}
                    onChange={(e) => setVolta(e.target.value)}
                    className={cn(
                      "mono-data w-full rounded-xl border bg-ink-2/70 px-4 py-3.5 text-[0.9rem] text-mist outline-none transition-colors [color-scheme:dark]",
                      errors.volta
                        ? "border-[rgba(228,87,46,0.6)]"
                        : "border-[rgba(237,235,228,0.09)] focus:border-[rgba(240,168,50,0.35)]",
                    )}
                  />
                  {errors.volta && (
                    <motion.p
                      initial={{ x: -6, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="mono-data mt-1.5 text-[0.7rem] text-ember"
                    >
                      {errors.volta}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Passageiros */}
          <div className="relative">
            <span className="mono-data mb-2 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-mist-dim">
              <Users size={13} className="text-teal" /> Passageiros
            </span>
            <button
              type="button"
              onClick={() => setPaxOpen((v) => !v)}
              aria-expanded={paxOpen}
              className="mono-data w-full rounded-xl border border-[rgba(237,235,228,0.09)] bg-ink-2/70 px-4 py-3.5 text-left text-[0.95rem] text-mist transition-colors focus:border-[rgba(240,168,50,0.35)]"
            >
              {pax} {pax === 1 ? "adulto" : "adultos"}
            </button>
            <AnimatePresence>
              {paxOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-[rgba(237,235,228,0.09)] bg-ink-3 p-4 shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[0.9rem] text-mist">Adultos</span>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => bumpPax(-1)}
                        disabled={pax <= 1}
                        aria-label="Menos passageiros"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(237,235,228,0.15)] text-mist transition-colors hover:border-amber hover:text-amber disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>
                      <motion.span
                        key={pax}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="mono-data w-6 text-center text-[1.1rem] font-bold text-amber"
                      >
                        {pax}
                      </motion.span>
                      <button
                        type="button"
                        onClick={() => bumpPax(1)}
                        disabled={pax >= 9}
                        aria-label="Mais passageiros"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(237,235,228,0.15)] text-mist transition-colors hover:border-amber hover:text-amber disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="mono-data mt-3 flex items-center gap-1.5 text-[0.7rem] text-mist-dim">
                    <Info size={11} /> Somente maiores de 18 anos.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Botão principal — "o comando ao Olho" */}
        <button
          type="submit"
          disabled={loading}
          className="sweep-hover mt-7 flex h-[3.75rem] w-full items-center justify-center gap-3 rounded-2xl bg-amber font-display text-[1.2rem] font-semibold text-night transition-[transform,box-shadow] duration-250 hover:scale-[1.01] hover:shadow-[0_0_60px_rgba(240,168,50,0.35)] active:scale-[0.99] disabled:cursor-wait"
        >
          {loading ? (
            <>
              <img src="/assets/logo.svg" alt="" className="h-6 w-6 animate-iris-blink" />
              <span>O Olho está varrendo…</span>
            </>
          ) : (
            <>
              <img src="/assets/logo.svg" alt="" className="h-6 w-6" />
              <span>Vasculhar o mundo</span>
            </>
          )}
        </button>

        <p className="mono-data mt-4 text-center text-[0.75rem] text-mist-dim">
          Preço final por pessoa, taxas incluídas · sujeito a alteração · a reserva acontece no site
          do parceiro.
        </p>
      </form>
    </div>
  );
}

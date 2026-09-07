import { motion } from "framer-motion";
import { X } from "lucide-react";

/** Íris "fechada": anel + pálpebra (desenhada via path, sem asset). */
function IrisFechada() {
  return (
    <svg viewBox="0 0 200 200" className="h-28 w-28" aria-hidden="true">
      <circle cx="100" cy="100" r="80" fill="none" stroke="#F0A832" strokeOpacity="0.4" strokeWidth="1.5" />
      <circle
        cx="100"
        cy="100"
        r="62"
        fill="none"
        stroke="#F0A832"
        strokeOpacity="0.2"
        strokeWidth="1"
        strokeDasharray="4 10"
      />
      {/* pálpebra fechada */}
      <path
        d="M 30 100 Q 100 140 170 100"
        fill="none"
        stroke="#98A0B3"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 55 116 L 50 126 M 100 124 L 100 136 M 145 116 L 150 126"
        fill="none"
        stroke="#98A0B3"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Estado de vazio — quando os filtros zeram os resultados:
 * "O Olho piscou e não viu nada com esses filtros."
 */
export default function EmptyState({ onLimpar }: { onLimpar: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-5 rounded-[1.25rem] border border-[rgba(237,235,228,0.07)] bg-ink-3 px-6 py-14 text-center"
    >
      <IrisFechada />
      <p className="max-w-sm text-[1.05rem] font-medium text-mist">
        O Olho piscou e não viu nada com esses filtros.
      </p>
      <button
        type="button"
        onClick={onLimpar}
        className="inline-flex items-center gap-2 rounded-full border border-[rgba(237,235,228,0.2)] px-5 py-2.5 text-[0.85rem] font-medium text-mist transition-colors hover:border-[rgba(240,168,50,0.5)] hover:bg-[rgba(240,168,50,0.08)]"
      >
        <X size={14} className="text-ember" />
        Limpar filtros
      </button>
    </motion.div>
  );
}

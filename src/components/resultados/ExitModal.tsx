import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { CIA_NOMES, type Oferta } from "@/data/demo-ofertas";
import { fmtBRL } from "./format";

interface ExitModalProps {
  oferta: Oferta;
  onClose: () => void;
}

/**
 * Modal de saída para o parceiro (afiliado). O link real abre em nova aba com
 * target="_blank" rel="noopener sponsored" — o Olho continua aqui.
 */
export default function ExitModal({ oferta, onClose }: ExitModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(6,8,15,0.8)] p-4 backdrop-blur-[8px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Você está saindo do Olho"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[1.25rem] border border-[rgba(237,235,228,0.09)] bg-ink-3 p-7"
      >
        <div className="mb-4 flex items-center gap-3">
          <img src="/assets/logo.svg" alt="" className="h-8 w-8" />
          <h2 className="font-display text-[1.35rem] font-medium text-mist">
            Você está saindo do Olho
          </h2>
        </div>
        <p className="text-[0.95rem] leading-relaxed text-mist-dim">
          A reserva acontece no site do parceiro, com preço final e condições dele.
          O Olho continua aqui se precisar.
        </p>
        <p className="mono-data mt-4 rounded-xl border border-[rgba(237,235,228,0.07)] bg-ink-2 px-4 py-3 text-[0.8rem] text-mist-dim">
          {CIA_NOMES[oferta.cia] ?? oferta.cia} · {oferta.origem} → {oferta.destino} ·{" "}
          <span className="font-bold text-amber">{fmtBRL(oferta.preco)}</span>
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={oferta.link_reserva}
            target="_blank"
            rel="noopener sponsored"
            onClick={onClose}
            className="sweep-hover inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-amber px-5 py-3 text-[0.9rem] font-bold text-ink transition-transform duration-250 hover:scale-[1.03] active:scale-[0.97]"
          >
            Continuar para o parceiro <ExternalLink size={14} />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-[rgba(237,235,228,0.2)] px-5 py-3 text-[0.9rem] font-medium text-mist transition-colors hover:border-[rgba(240,168,50,0.5)] hover:bg-[rgba(240,168,50,0.08)]"
          >
            Voltar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

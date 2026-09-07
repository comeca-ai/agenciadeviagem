import { motion } from "framer-motion";
import { fmtNum } from "./format";

interface InsightBannerProps {
  total: number;
  menorPreco: number;
}

/** Fato da busca atual. Sem percentual inventado. */
export default function InsightBanner({ total, menorPreco }: InsightBannerProps) {
  if (!total || !Number.isFinite(menorPreco)) return null;

  return (
    <motion.div
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="flex items-center gap-4 rounded-r-2xl border-l-[3px] border-teal bg-[rgba(53,196,181,0.07)] px-5 py-4"
    >
      <p className="text-[0.95rem] font-medium leading-relaxed text-mist">
        {total} {total === 1 ? "oferta" : "ofertas"} nesta consulta. A mais barata está em{" "}
        <span className="mono-data font-bold text-gold-soft">R$ {fmtNum(menorPreco)}</span> por
        pessoa, taxas de embarque incluídas. Bagagem a confirmar no parceiro.
      </p>
    </motion.div>
  );
}

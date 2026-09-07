import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ALVO = 1247;
const DURACAO_MS = 1200;

const fmt = new Intl.NumberFormat("pt-BR");

/**
 * Seção 0 — "O Olho está varrendo": overlay full-screen ink com a íris do
 * logo piscando, anel externo girando e contador de rotas (0 → 1.247).
 * A saída (abertura de íris, clip-path circle do centro) fica no `exit` —
 * envolver em <AnimatePresence> no pai.
 */
export default function ScanningOverlay() {
  const [rotas, setRotas] = useState(0);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / DURACAO_MS);
      // ease-out suave, sem bounce
      const eased = 1 - Math.pow(1 - p, 3);
      setRotas(Math.round(eased * ALVO));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      initial={{ clipPath: "circle(150% at 50% 50%)" }}
      exit={{
        clipPath: "circle(0% at 50% 50%)",
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      }}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-8 bg-ink"
      role="status"
      aria-label="O Olho está varrendo rotas"
    >
      {/* Íris piscando dentro de anel giratório */}
      <div className="relative flex h-28 w-28 items-center justify-center">
        <div
          className="animate-iris-spin-fast absolute inset-0 rounded-full border border-[rgba(240,168,50,0.4)] border-t-transparent"
          aria-hidden="true"
        />
        <div
          className="animate-iris-blink"
          style={{ animationIterationCount: 2 }}
        >
          <img src="/assets/logo.svg" alt="" className="h-20 w-20" />
        </div>
      </div>

      <p className="mono-data text-[0.85rem] text-teal">
        varrendo {fmt.format(rotas)} rotas…
      </p>
    </motion.div>
  );
}

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/** Count-up 0 → alvo quando visível (tabular-nums). */
function CountUp({ alvo, duracao = 1 }: { alvo: number; duracao?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / (duracao * 1000));
      setV(Math.round((1 - Math.pow(1 - p, 3)) * alvo));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, alvo, duracao]);

  return (
    <span ref={ref} className="mono-data font-bold">
      {v}%
    </span>
  );
}

/**
 * Seção 2 — Insight do Olho: faixa teal translúcida com borda esquerda
 * (engrossa no hover) e o número "14%" em count-up.
 */
export default function InsightBanner() {
  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-center gap-4 rounded-r-2xl border-l-[3px] border-teal bg-[rgba(53,196,181,0.07)] px-5 py-4 transition-[border-left-width] duration-250 hover:border-l-[6px]"
    >
      {/* íris mini teal */}
      <svg viewBox="0 0 40 40" className="h-7 w-7 shrink-0" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="none" stroke="#35C4B5" strokeOpacity="0.6" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="12" fill="none" stroke="#35C4B5" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 5" />
        <circle cx="20" cy="20" r="7" fill="#35C4B5" fillOpacity="0.9" />
      </svg>
      <p className="text-[0.95rem] font-medium leading-relaxed text-mist">
        O Olho viu: nesta rota, voos de <strong className="text-gold-soft">terça e quarta</strong>{" "}
        saem até <CountUp alvo={14} />{" "}
        <strong className="text-gold-soft">mais baratos</strong>. Flexibilidade de 1 dia pode
        economizar <span className="mono-data font-bold text-gold-soft">R$ 480</span>.
      </p>
    </motion.div>
  );
}

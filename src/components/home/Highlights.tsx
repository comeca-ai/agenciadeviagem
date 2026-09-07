import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import OfferCard, { type Offer } from "@/components/OfferCard";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const OFERTAS: Offer[] = [
  {
    origem: "GRU",
    destino: "LIS",
    badge: "Escolha do Olho",
    detalhe: "Direto · TAP · 12–24 mai",
    preco: "3.412",
    imagem: "/assets/dest-lisboa.jpg",
  },
  {
    origem: "GIG",
    destino: "FEN",
    badge: "Menor preço",
    detalhe: "1 escala · Azul/Gol · 4–11 jun",
    preco: "1.284",
    imagem: "/assets/dest-noronha.jpg",
  },
  {
    origem: "GRU",
    destino: "EZE",
    badge: "Fim de semana",
    detalhe: "Direto · Aerolíneas · sex–dom",
    preco: "968",
  },
  {
    origem: "CWB",
    destino: "CUZ",
    badge: "Raro",
    detalhe: "1 escala · LATAM · set",
    preco: "2.150",
    imagem: "/assets/dest-cusco.jpg",
  },
];

/**
 * Seção 4 — "O que o Olho já encontrou": scroller horizontal arrastável
 * com 4 cards de oferta-destaque e barra de progresso do drag.
 */
export default function Highlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".highlight-card",
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  return (
    <section ref={sectionRef} className="bg-ink-2">
      <div className="container-site py-[clamp(5rem,12vh,9rem)]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4 text-teal">Descobertas recentes</p>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.25rem)] font-medium leading-none text-mist">
              Encontrado pelo Olho
            </h2>
          </div>
          <Link
            to="/destinos"
            className="group inline-flex items-center gap-2 font-medium text-teal transition-colors hover:text-mist"
          >
            Ver todos os destinos
            <MoveRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>

        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="scroller-thin -mx-[clamp(1.25rem,4vw,3rem)] snap-x snap-mandatory overflow-x-auto px-[clamp(1.25rem,4vw,3rem)] pb-4"
        >
          <motion.div
            className="flex w-max gap-6"
            drag="x"
            dragElastic={0.08}
            dragConstraints={scrollerRef}
            style={{ touchAction: "pan-x pan-y" }}
          >
            {OFERTAS.map((o) => (
              <div key={`${o.origem}-${o.destino}`} className="highlight-card w-[21rem] shrink-0 snap-start">
                <OfferCard offer={o} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* barra de progresso do scroller */}
        <div className="mt-6 h-px w-full bg-white/5">
          <div
            className="h-full origin-left bg-teal transition-transform duration-150"
            style={{ transform: `scaleX(${Math.max(0.1, progress)})` }}
          />
        </div>
      </div>
    </section>
  );
}

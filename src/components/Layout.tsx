import { useEffect } from "react";
import { useLocation, useOutlet } from "react-router";
import Lenis from "lenis";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/**
 * Layout global: Navbar fixa (top-0 z-50) + slot de conteúdo com padding-top
 * de 4.5rem (a altura da nav) + Footer + overlays (grão de filme, cursor).
 * Também inicializa o Lenis (smooth scroll) e a transição de página
 * (fallback crossfade 0.3s da "Piscada do Olho").
 */
export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

  // Lenis em todo o site
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  // Ao trocar de rota: volta ao topo (exceto âncoras de hash)
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-[100dvh] bg-ink text-mist">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="pt-[4.5rem]"
        >
          {outlet}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <div className="grain-overlay" aria-hidden="true" />
      <CustomCursor />
    </div>
  );
}

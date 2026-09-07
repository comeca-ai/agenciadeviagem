import { useEffect } from "react";
import { useLocation, useOutlet } from "react-router";
import Lenis from "lenis";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/**
 * Layout global: Navbar + conteúdo + Footer + overlay de grão leve.
 * Cursor customizado removido (pedido UX: sem bolinha no mouse).
 */
export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();

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
    </div>
  );
}

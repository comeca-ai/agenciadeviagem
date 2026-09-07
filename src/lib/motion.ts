import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Easing "varredura" padrão do site. */
export const EASE_VARREDURA = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Easing de entrada enfática. */
export const EASE_ENTRADA = "cubic-bezier(0.16, 1, 0.3, 1)";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

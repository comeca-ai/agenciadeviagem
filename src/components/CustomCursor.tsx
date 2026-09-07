import { useEffect, useRef } from "react";

/**
 * Cursor customizado: anel fino âmbar (24px) + ponto central (4px) que seguem
 * o mouse com lag (lerp 0.15). Sobre elementos clicáveis, o anel escala para
 * 48px com mix-blend difference. Desativado em dispositivos touch.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest(
        "a, button, [role='button'], input, textarea, select, label, [data-cursor]",
      );
      const textField = !!target?.closest("input, textarea, select");
      hovering = interactive;
      ring.style.opacity = textField ? "0" : "1";
      dot.style.opacity = textField ? "0" : "1";
    };

    const loop = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${
        hovering ? 2 : 1
      })`;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    document.documentElement.classList.add("custom-cursor");

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <>
      <style>{`
        @media (hover: hover) {
          .custom-cursor, .custom-cursor * { cursor: none; }
          .custom-cursor input, .custom-cursor textarea, .custom-cursor select { cursor: text; }
        }
      `}</style>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-6 w-6 rounded-full border-[1.5px] border-amber transition-[opacity] duration-200 mix-blend-difference md:block"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-1 w-1 rounded-full bg-amber md:block"
      />
    </>
  );
}

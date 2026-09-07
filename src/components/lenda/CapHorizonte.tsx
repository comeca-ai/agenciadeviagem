import { useEffect, useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(SplitText);

/**
 * Capítulo 3 — "O Horizonte" (seção fluida, respiro). Frase gigante
 * sobe de máscaras; uma linha luminosa âmbar→teal sobe da base como um
 * amanhecer (scrub) e inclina ±2° com o mouse (spring suave).
 */
export default function CapHorizonte() {
  const rootRef = useRef<HTMLElement>(null);
  const linhaRef = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const split = new SplitText(".horizonte-frase", {
        type: "lines,words",
        linesClass: "overflow-hidden",
      });
      gsap.set(split.words, { yPercent: 110 });
      gsap.set(".horizonte-marker", { opacity: 0, y: 20 });
      gsap.set(linhaRef.current, { yPercent: 120 });

      // entrada das palavras (trigger 75%)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
          },
          defaults: { ease: "power4.out" },
        })
        .to(".horizonte-marker", { opacity: 1, y: 0, duration: 0.6 })
        .to(split.words, { yPercent: 0, duration: 0.8, stagger: 0.06 }, 0.1);

      // amanhecer: a linha sobe da base até atrás do texto (scrub contínuo)
      gsap.to(linhaRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, rootRef);

    // tilt ±2° da linha com o mouse (spring suave)
    const linha = linhaRef.current;
    let alvo = 0;
    const quick = linha
      ? gsap.quickTo(linha, "rotation", { duration: 0.7, ease: "power3.out" })
      : null;
    const onMove = (e: MouseEvent) => {
      alvo = (e.clientX / window.innerWidth - 0.5) * 4; // ±2°
      quick?.(alvo);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      data-chapter="3"
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-ink"
      aria-label="Capítulo 3 — O Horizonte"
    >
      {/* horizonte luminoso */}
      <div
        ref={linhaRef}
        className="pointer-events-none absolute left-0 top-full h-[2px] w-full origin-center"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #F0A832 35%, #35C4B5 65%, transparent 100%)",
          boxShadow: "0 0 40px rgba(240,168,50,0.35)",
        }}
        aria-hidden="true"
      />

      <div className="container-site relative z-10">
        <div className="mx-auto max-w-[44rem] text-center">
          <p className="horizonte-marker mono-data mb-10 text-[0.75rem] uppercase tracking-[0.28em] text-ember">
            Cap. III — O Horizonte
          </p>
          <p className="horizonte-frase font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.15] text-mist">
            Horizonte, para os outros, é onde o mundo acaba. Para Tandera, era
            onde o mundo{" "}
            <em className="italic text-amber">começava a ficar interessante.</em>
          </p>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(SplitText);

/**
 * Capítulo 4 — "O Farol Apagado" (pin 160vh). O feixe do farol gira
 * (-25°→25°) e apaga no meio do pin; no terço final um novo ponto âmbar
 * acende no centro — o Olho encontrando um novo mastro.
 */
export default function CapFarol() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const split = new SplitText(".farol-texto", { type: "lines" });
      gsap.set(split.lines, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(".farol-marker", { opacity: 0, y: 20 });
      gsap.set(".farol-feixe", { xPercent: -50, yPercent: -50, rotation: -25, opacity: 0.85 });
      gsap.set(".farol-ponto", { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
      gsap.set(".farol-ponto-glow", { xPercent: -50, yPercent: -50 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        })
        .to(".farol-marker", { opacity: 1, y: 0, duration: 0.08 }, 0)
        // varredura linha a linha (como o Cap. 1)
        .to(
          split.lines,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            stagger: 0.07,
            duration: 0.45,
            ease: "none",
          },
          0.05,
        )
        // o feixe gira lentamente…
        .to(".farol-feixe", { rotation: 25, duration: 0.55, ease: "none" }, 0)
        // …e apaga no meio do pin
        .to(".farol-feixe", { opacity: 0.05, duration: 0.2, ease: "none" }, 0.3)
        // terço final: um novo ponto âmbar acende e expande
        .to(".farol-ponto", { opacity: 1, duration: 0.1 }, 0.66)
        .to(
          ".farol-ponto",
          { scale: 1.3, duration: 0.3, ease: "power1.inOut" },
          0.7,
        )
        .to(
          ".farol-ponto-glow",
          { opacity: 0.9, scale: 1.4, duration: 0.3, ease: "none" },
          0.7,
        );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      data-chapter="4"
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
      aria-label="Capítulo 4 — O Farol Apagado"
    >
      <img
        src="/assets/lenda-farol.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-[rgba(6,8,15,0.72)]"
        aria-hidden="true"
      />

      {/* feixe do farol: cunha âmbar que gira e apaga */}
      {!reduced && (
        <div
          className="farol-feixe pointer-events-none absolute left-1/2 top-1/2 h-[180vmax] w-[180vmax]"
          style={{
            background:
              "conic-gradient(from -7deg at 50% 50%, transparent 0deg, rgba(240,168,50,0.28) 4deg, rgba(245,200,119,0.4) 7deg, rgba(240,168,50,0.28) 10deg, transparent 14deg)",
            mixBlendMode: "screen",
          }}
          aria-hidden="true"
        />
      )}

      {/* novo ponto âmbar — o Olho acordando */}
      <div
        className="farol-ponto pointer-events-none absolute left-1/2 top-1/2 z-10"
        aria-hidden="true"
      >
        <div
          className="farol-ponto-glow absolute left-1/2 top-1/2 h-40 w-40 rounded-full opacity-0"
          style={{
            background:
              "radial-gradient(circle, rgba(240,168,50,0.45) 0%, rgba(240,168,50,0.12) 45%, transparent 70%)",
          }}
        />
        <div
          className="h-5 w-5 rounded-full"
          style={{
            background:
              "radial-gradient(circle, #F5C877 0%, #F0A832 55%, #E4572E 100%)",
            boxShadow: "0 0 32px rgba(240,168,50,0.8)",
          }}
        />
      </div>

      <div className="container-site relative z-20">
        <div className="mx-auto max-w-[40rem] text-center">
          <p className="farol-marker mono-data mb-8 text-[0.75rem] uppercase tracking-[0.28em] text-ember">
            Cap. IV — O Farol Apagado
          </p>
          <p className="farol-texto font-display text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.5] text-mist">
            Veio o motor, veio o radar, veio o satélite. Os faróis apagaram um
            a um, e os vigias desceram do mastro. Menos um. Dizem que o olho
            de Tandera{" "}
            <strong className="font-semibold text-amber">continuou aceso</strong>{" "}
            — procurando um novo mastro.
          </p>
        </div>
      </div>
    </section>
  );
}

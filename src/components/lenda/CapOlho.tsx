import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Capítulo 5 — "O Olho Aceso" (pin 140vh). O ponto âmbar do capítulo
 * anterior cresce até virar a íris do logo (morph por scrub); depois de
 * formada, a pupila "olha" para o cursor. O conto muda de registro:
 * do mito ao presente — o vigia virou engenheiro; o olhar, algoritmo.
 */
export default function CapOlho() {
  const rootRef = useRef<HTMLElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);
  const pupilaRef = useRef<HTMLDivElement>(null);
  const progresso = useRef(0);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.set(".olho-core", { scale: 0.11 });
      gsap.set(".olho-aneis", { opacity: 0, scale: 0.55 });
      gsap.set(".olho-pupila", { opacity: 0 });
      gsap.set(".olho-texto > *", { opacity: 0, y: 36 });
      gsap.set(".olho-card", { opacity: 0, x: 120, rotation: 6 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              progresso.current = self.progress;
            },
          },
        })
        // morph: ponto → íris (0 → 50%)
        .to(".olho-core", { scale: 1, duration: 0.42, ease: "power1.inOut" }, 0)
        .to(
          ".olho-aneis",
          { opacity: 1, scale: 1, duration: 0.28, ease: "power1.out" },
          0.22,
        )
        .to(".olho-pupila", { opacity: 1, duration: 0.1 }, 0.42)
        // texto sobe em stagger (50% → 80%)
        .to(
          ".olho-texto > *",
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.2, ease: "power2.out" },
          0.5,
        )
        // card de oferta entra da direita (80% → 100%)
        .to(
          ".olho-card",
          { opacity: 1, x: 0, rotation: 0, duration: 0.2, ease: "power2.out" },
          0.8,
        );

      // flutuação contínua do card (loop ±8px, 4s) — gsap, sem re-render
      gsap.to(".olho-card-inner", {
        y: -8,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, rootRef);

    // A íris formada "olha" para o cursor (pupila translate máx. 10px, lerp 0.1)
    const alvo = { x: 0, y: 0 };
    const atual = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const iris = irisRef.current;
      if (!iris) return;
      const rect = iris.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const mag = Math.min(10, dist * 0.06);
      alvo.x = (dx / dist) * mag;
      alvo.y = (dy / dist) * mag;
    };
    let raf = 0;
    const loop = () => {
      if (progresso.current > 0.5 && pupilaRef.current) {
        atual.x += (alvo.x - atual.x) * 0.1;
        atual.y += (alvo.y - atual.y) * 0.1;
        pupilaRef.current.style.transform = `translate(${atual.x}px, ${atual.y}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      data-chapter="5"
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-ink"
      aria-label="Capítulo 5 — O Olho Aceso"
    >
      <div className="container-site grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-12">
        {/* íris: morph do ponto âmbar → anéis + núcleo */}
        <div className="flex justify-center lg:col-span-5">
          <div
            ref={irisRef}
            className="relative h-[220px] w-[220px]"
            aria-hidden="true"
          >
            {/* anéis concêntricos */}
            <svg
              className="olho-aneis absolute inset-0 h-full w-full"
              viewBox="0 0 220 220"
              fill="none"
            >
              <circle cx="110" cy="110" r="104" stroke="#EDEBE4" strokeOpacity="0.15" strokeWidth="1" />
              <circle
                cx="110" cy="110" r="86"
                stroke="#F0A832" strokeOpacity="0.3" strokeWidth="1"
                strokeDasharray="4 7"
                className="animate-iris-spin origin-center"
              />
              <circle cx="110" cy="110" r="66" stroke="#EDEBE4" strokeOpacity="0.5" strokeWidth="1" />
            </svg>
            {/* núcleo com gradiente Íris */}
            <div
              className="olho-core absolute h-[110px] w-[110px] rounded-full"
              style={{
                left: "calc(50% - 55px)",
                top: "calc(50% - 55px)",
                background:
                  "radial-gradient(circle, #F5C877 0%, #F0A832 30%, #E4572E 62%, transparent 72%)",
                boxShadow: "0 0 80px rgba(240,168,50,0.25)",
              }}
            />
            {/* pupila que segue o cursor */}
            <div className="absolute left-1/2 top-1/2 flex h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <div
                ref={pupilaRef}
                className="olho-pupila h-9 w-9 rounded-full bg-ink"
                style={{ boxShadow: "inset 0 0 10px rgba(240,168,50,0.35)" }}
              />
            </div>
          </div>
        </div>

        {/* texto: do conto ao presente + prova viva */}
        <div className="olho-texto lg:col-span-4">
          <p className="mono-data mb-6 text-[0.75rem] uppercase tracking-[0.28em] text-teal">
            Cap. V — Hoje
          </p>
          <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.02] text-mist">
            O novo mastro é a <em className="italic text-amber">nuvem.</em>
          </h2>
          <p className="mt-6 max-w-[34rem] leading-[1.65] text-mist-dim">
            Séculos depois, a lenda encontrou um herdeiro: um engenheiro
            aeronáutico, de uma família que adora viajar.{" "}
            <em className="font-display italic text-mist">
              O vigia virou engenheiro; o olhar, algoritmo.
            </em>{" "}
            O Olho de Tandera renasceu como um buscador: varre os céus do
            mundo inteiro em segundos, da borda da rede, e enxerga a passagem
            que ninguém viu. O vigia continua de plantão. Só mudou a altura.
          </p>
        </div>

        {/* prova viva: mini-card de oferta real */}
        <div className="olho-card lg:col-span-3">
          <div className="olho-card-inner overflow-hidden rounded-[1.25rem] border border-mist/10 bg-ink-3">
            <div className="relative h-32">
              <img
                src="/assets/dest-cusco.jpg"
                alt="Cusco, Peru"
                className="h-full w-full object-cover"
              />
              <span className="mono-data absolute left-3 top-3 rounded-full bg-amber px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-night">
                Escolha do Olho
              </span>
            </div>
            <div className="p-5">
              <p className="mono-data text-sm font-bold text-mist">
                GRU <span className="text-teal">→</span> CUZ
              </p>
              <p className="mt-1 text-[0.8rem] text-mist-dim">
                ida e volta · setembro · Cusco, Peru
              </p>
              <p className="mono-data mt-4 text-[1.6rem] font-bold text-mist">
                <span className="mr-1 align-top text-[0.85rem] font-normal text-mist-dim">
                  R$
                </span>
                2.184
              </p>
              <p className="mt-1 text-[0.65rem] text-mist-dim">
                por pessoa · taxas incluídas · sujeito a alteração
              </p>
              <Link
                to="/resultados?origem=GRU&destino=CUZ&ida=2026-09-07&volta=2026-09-15&pax=1"
                className="sweep-hover mt-4 block rounded-full bg-amber py-2.5 text-center text-[0.85rem] font-bold text-night transition-transform duration-250 hover:scale-[1.04] active:scale-[0.97]"
              >
                Ver esta oferta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ChevronDown } from "lucide-react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

const HeroIrisCanvas = lazy(() => import("./HeroIrisCanvas"));

function IrisFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(245,200,119,0.45) 0%, rgba(240,168,50,0.22) 30%, rgba(228,87,46,0.1) 62%, transparent 72%)",
        filter: "blur(40px)",
      }}
      aria-hidden
    />
  );
}

function MaskedWords({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span className="hero-word inline-block will-change-transform">{word}&nbsp;</span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const converge = useRef(0);
  const open = useRef(0);
  const [reduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        canvasWrapRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" },
        0.1,
      );
      gsap.to(converge, { current: 1, duration: 2, ease: "power3.out", delay: 0.1 });
      tl.fromTo(
        ".hero-eyebrow",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        0.5,
      );
      tl.fromTo(
        ".hero-word",
        { yPercent: 110, rotate: 4 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.9,
          stagger: 0.09,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)",
        },
        0.7,
      );
      tl.fromTo(
        ".hero-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        1.3,
      );
      tl.fromTo(
        ".hero-cta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        1.5,
      );
      tl.fromTo(cueRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.8);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=120%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          open.current = self.progress;
        },
      });
      gsap.to(contentRef.current, {
        y: -60,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced]);

  const scrollToBusca = () => {
    if (!reduced) {
      gsap.fromTo(
        canvasWrapRef.current,
        { filter: "brightness(1)" },
        { filter: "brightness(1.15)", duration: 0.2, yoyo: true, repeat: 1 },
      );
    }
    document.getElementById("busca")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[calc(100dvh-4.5rem)] items-center justify-center overflow-hidden bg-ink"
    >
      <div ref={canvasWrapRef} className="absolute inset-0" style={{ opacity: reduced ? 1 : 0 }}>
        {reduced ? (
          <IrisFallback />
        ) : (
          <Suspense fallback={<IrisFallback />}>
            <HeroIrisCanvas converge={converge} open={open} />
          </Suspense>
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 42%, rgba(245,242,234,0.92) 100%)",
        }}
      />

      <div ref={contentRef} className="container-site relative z-10 text-center">
        <p className="hero-eyebrow eyebrow mb-6 text-teal" style={{ opacity: reduced ? 1 : 0 }}>
          Agência 100% digital · Brasil · +18
        </p>
        <h1 className="font-display text-[clamp(3rem,8.5vw,7.5rem)] font-medium leading-[0.95] tracking-[-0.02em] text-mist">
          <MaskedWords text="A visão" />
          <br />
          <em className="text-iris-gradient italic">
            <MaskedWords text="além do alcance." />
          </em>
        </h1>
        <p
          className="hero-sub mx-auto mt-7 max-w-[34rem] text-[clamp(1rem,1.6vw,1.25rem)] leading-[1.65] text-mist-dim"
          style={{ opacity: reduced ? 1 : 0 }}
        >
          O Olho de Tandera varre o mundo em segundos e enxerga a passagem que{" "}
          <em className="font-display italic text-mist">ninguém viu</em>.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={scrollToBusca}
            className="hero-cta sweep-hover rounded-full bg-amber px-7 py-3.5 font-bold text-night transition-transform duration-250 hover:scale-[1.04] active:scale-[0.97]"
            style={{ opacity: reduced ? 1 : 0 }}
          >
            Abrir o Olho
          </button>
          <Link
            to="/a-lenda"
            className="hero-cta rounded-full border border-mist/15 px-7 py-3.5 font-medium text-mist transition-colors duration-250 hover:border-amber hover:bg-[rgba(240,168,50,0.1)]"
            style={{ opacity: reduced ? 1 : 0 }}
          >
            Conheça a lenda
          </Link>
        </div>
      </div>

      <div
        ref={cueRef}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ opacity: reduced ? 1 : 0 }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-mist/15">
          <ChevronDown size={16} className="animate-cue-bounce text-mist" />
        </div>
        <span className="mono-data text-[0.65rem] uppercase tracking-[0.28em] text-mist-dim">
          role para buscar
        </span>
      </div>
    </section>
  );
}

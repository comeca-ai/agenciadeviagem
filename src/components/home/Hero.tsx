import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ChevronDown } from "lucide-react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

const COUNT_RING = 2800;
const COUNT_STARS = 700;
const COUNT = COUNT_RING + COUNT_STARS;

interface IrisFieldProps {
  /** 0 = disperso, 1 = íris formada */
  converge: React.MutableRefObject<number>;
  /** 0..1 progresso de scroll (abertura da íris) */
  open: React.MutableRefObject<number>;
}

interface IrisData {
  iris: Float32Array;
  scatter: Float32Array;
  colors: Float32Array;
  displacement: Float32Array;
  isRing: Uint8Array;
}

/** Geração determinística-única no carregamento do módulo (fora do render). */
function generateIrisData(): IrisData {
  const iris = new Float32Array(COUNT * 3);
  const scatter = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const displacement = new Float32Array(COUNT * 2);
  const isRing = new Uint8Array(COUNT);

  const amber = new THREE.Color("#F0A832");
  const ember = new THREE.Color("#E4572E");
  const gold = new THREE.Color("#F5C877");
  const teal = new THREE.Color("#35C4B5");
  const mist = new THREE.Color("#98A0B3");
  const tmp = new THREE.Color();

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    if (i < COUNT_RING) {
      // Anel da íris: densidade maior perto da borda interna
      const t = Math.pow(Math.random(), 1.6);
      const r = 1.55 + t * 1.15;
      const a = Math.random() * Math.PI * 2;
      iris[i3] = Math.cos(a) * r;
      iris[i3 + 1] = Math.sin(a) * r * 0.92;
      iris[i3 + 2] = (Math.random() - 0.5) * 0.3;
      isRing[i] = 1;
      const mix = Math.random();
      tmp.copy(mix < 0.55 ? amber : mix < 0.85 ? gold : ember);
      tmp.multiplyScalar(0.7 + Math.random() * 0.5);
    } else {
      // Estrelas dispersas
      iris[i3] = (Math.random() - 0.5) * 14;
      iris[i3 + 1] = (Math.random() - 0.5) * 8;
      iris[i3 + 2] = (Math.random() - 0.5) * 2 - 1;
      tmp.copy(Math.random() < 0.6 ? teal : mist).multiplyScalar(0.35 + Math.random() * 0.4);
    }
    // Posição inicial dispersa (convergência da entrada)
    scatter[i3] = (Math.random() - 0.5) * 24;
    scatter[i3 + 1] = (Math.random() - 0.5) * 16;
    scatter[i3 + 2] = (Math.random() - 0.5) * 8 - 3;
    colors[i3] = tmp.r;
    colors[i3 + 1] = tmp.g;
    colors[i3 + 2] = tmp.b;
  }
  return { iris, scatter, colors, displacement, isRing };
}

const IRIS_DATA = generateIrisData();

/**
 * Campo de ~3.500 partículas que se organizam em forma de íris:
 * anel denso âmbar/brasa, núcleo vazio escuro, pontos teal dispersos
 * como estrelas. Respira (pulso senoidal 4%, 6s) e reage ao cursor.
 */
function IrisField({ converge, open }: IrisFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { size, viewport } = useThree();
  const mouse = useRef({ x: 9999, y: 9999 });

  const data = IRIS_DATA;
  const positions = useMemo(() => new Float32Array(data.scatter), [data]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Converte px → mundo (plano z=0)
      const worldPerPixel = viewport.height / size.height;
      mouse.current.x = (e.clientX - size.width / 2) * worldPerPixel;
      mouse.current.y = -(e.clientY - size.height / 2) * worldPerPixel;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [size, viewport]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;
    const t = clock.getElapsedTime();
    const breathe = 1 + 0.04 * Math.sin((t / 6) * Math.PI * 2);
    const p = converge.current;
    const openScale = 1 + 0.6 * open.current;
    const worldPerPixel = viewport.height / size.height;
    const repelRadius = 180 * worldPerPixel;
    const pos = points.geometry.attributes.position.array as Float32Array;
    const { iris, scatter, displacement, isRing } = data;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const i2 = i * 2;
      const ringScale = isRing[i] ? openScale : 1;
      const tx = iris[i3] * ringScale * breathe;
      const ty = iris[i3 + 1] * ringScale * breathe;
      const tz = iris[i3 + 2];

      // convergência scatter → íris
      let x = scatter[i3] + (tx - scatter[i3]) * p;
      let y = scatter[i3 + 1] + (ty - scatter[i3 + 1]) * p;
      const z = scatter[i3 + 2] + (tz - scatter[i3 + 2]) * p;

      // repulsão do cursor com retorno amortecido
      const dx = x + displacement[i2] - mouse.current.x;
      const dy = y + displacement[i2 + 1] - mouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < repelRadius && dist > 0.0001) {
        const f = ((repelRadius - dist) / repelRadius) * 0.6;
        displacement[i2] += (dx / dist) * f * 0.35;
        displacement[i2 + 1] += (dy / dist) * f * 0.35;
      }
      displacement[i2] *= 0.94;
      displacement[i2 + 1] *= 0.94;

      x += displacement[i2];
      y += displacement[i2 + 1];

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
    }
    points.geometry.attributes.position.needsUpdate = true;

    const mat = points.material as THREE.PointsMaterial;
    mat.opacity = 1 - 0.85 * open.current;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Divide texto em palavras mascaradas para reveal (SplitText manual). */
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
      // Entrada
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

      // Scroll: íris abre e o H1 atravessa a pupila
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
    // pulso na íris + scroll suave para #busca
    if (!reduced) {
      gsap.fromTo(
        canvasWrapRef.current,
        { filter: "brightness(1)" },
        { filter: "brightness(1.8)", duration: 0.2, yoyo: true, repeat: 1 },
      );
    }
    document.getElementById("busca")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[calc(100dvh-4.5rem)] items-center justify-center overflow-hidden bg-ink"
    >
      {/* Canvas de partículas / fallback estático */}
      <div ref={canvasWrapRef} className="absolute inset-0" style={{ opacity: reduced ? 1 : 0 }}>
        {reduced ? (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(245,200,119,0.5) 0%, rgba(240,168,50,0.3) 30%, rgba(228,87,46,0.15) 62%, transparent 72%)",
              filter: "blur(40px)",
            }}
          />
        ) : (
          <Canvas
            camera={{ position: [0, 0, 10], fov: 45 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true }}
            style={{ position: "absolute", inset: 0 }}
          >
            <IrisField converge={converge} open={open} />
          </Canvas>
        )}
      </div>

      {/* Vinheta radial */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(6,8,15,0.9) 100%)",
        }}
      />

      {/* Conteúdo */}
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
            className="hero-cta sweep-hover rounded-full bg-amber px-7 py-3.5 font-bold text-ink transition-transform duration-250 hover:scale-[1.04] active:scale-[0.97]"
            style={{ opacity: reduced ? 1 : 0 }}
          >
            Abrir o Olho
          </button>
          <Link
            to="/a-lenda"
            className="hero-cta rounded-full border border-[rgba(237,235,228,0.2)] px-7 py-3.5 font-medium text-mist transition-colors duration-250 hover:border-amber hover:bg-[rgba(240,168,50,0.08)]"
            style={{ opacity: reduced ? 1 : 0 }}
          >
            Conheça a lenda
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        ref={cueRef}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ opacity: reduced ? 1 : 0 }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(237,235,228,0.2)]">
          <ChevronDown size={16} className="animate-cue-bounce text-mist" />
        </div>
        <span className="mono-data text-[0.65rem] uppercase tracking-[0.28em] text-mist-dim">
          role para buscar
        </span>
      </div>
    </section>
  );
}

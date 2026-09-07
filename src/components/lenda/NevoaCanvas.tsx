import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 400;

interface NevoaData {
  base: Float32Array;
  colors: Float32Array;
  speed: Float32Array;
}

function generateNevoa(): NevoaData {
  const base = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const speed = new Float32Array(COUNT);
  const teal = new THREE.Color("#35C4B5");
  const mist = new THREE.Color("#98A0B3");
  const gold = new THREE.Color("#F5C877");
  const tmp = new THREE.Color();
  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    base[i3] = (Math.random() - 0.5) * 16;
    base[i3 + 1] = (Math.random() - 0.5) * 8;
    base[i3 + 2] = (Math.random() - 0.5) * 3 - 1;
    const r = Math.random();
    tmp.copy(r < 0.72 ? teal : r < 0.9 ? mist : gold).multiplyScalar(
      0.25 + Math.random() * 0.45,
    );
    colors[i3] = tmp.r;
    colors[i3 + 1] = tmp.g;
    colors[i3 + 2] = tmp.b;
    speed[i] = 0.05 + Math.random() * 0.16;
  }
  return { base, colors, speed };
}

const NEVOA = generateNevoa();

interface NevoaFieldProps {
  /** 0..1 — engrossa a névoa conforme o scroll da capa */
  densidade: React.MutableRefObject<number>;
  /** pausa o loop quando a capa sai da viewport */
  visivel: React.MutableRefObject<boolean>;
}

/** "Mar à noite": ~400 pontos teal esparsos com drift horizontal lento. */
function NevoaField({ densidade, visivel }: NevoaFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => new Float32Array(NEVOA.base), []);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points || !visivel.current) return;
    const t = clock.getElapsedTime();
    const pos = points.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      // drift horizontal com leve ondulação vertical
      let x = NEVOA.base[i3] + t * NEVOA.speed[i];
      x = ((x + 8) % 16) - 8;
      pos[i3] = x;
      pos[i3 + 1] =
        NEVOA.base[i3 + 1] + Math.sin(t * 0.18 + i * 1.7) * 0.35;
      pos[i3 + 2] = NEVOA.base[i3 + 2];
    }
    points.geometry.attributes.position.needsUpdate = true;
    const mat = points.material as THREE.PointsMaterial;
    // 0.4 → 0.9 conforme o pin da capa avança
    const target = 0.4 + densidade.current * 0.5;
    mat.opacity += (target - mat.opacity) * 0.08;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[NEVOA.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

interface NevoaCanvasProps {
  densidade: React.MutableRefObject<number>;
}

/**
 * Canvas de névoa da capa de A Lenda (único WebGL da página).
 * Fallback (reduced-motion / sem WebGL) fica a cargo do gradiente
 * Horizonte renderizado por baixo, no componente Capa.
 */
export default function NevoaCanvas({ densidade }: NevoaCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const visivel = useRef(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visivel.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
      <Canvas
        style={{ position: "absolute", inset: 0 }}
        camera={{ position: [0, 0, 5], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      >
        <NevoaField densidade={densidade} visivel={visivel} />
      </Canvas>
    </div>
  );
}

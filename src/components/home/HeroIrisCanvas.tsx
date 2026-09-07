import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT_RING = 2800;
const COUNT_STARS = 700;
const COUNT = COUNT_RING + COUNT_STARS;

interface IrisFieldProps {
  converge: React.MutableRefObject<number>;
  open: React.MutableRefObject<number>;
}

interface IrisData {
  iris: Float32Array;
  scatter: Float32Array;
  colors: Float32Array;
  displacement: Float32Array;
  isRing: Uint8Array;
}

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
      iris[i3] = (Math.random() - 0.5) * 14;
      iris[i3 + 1] = (Math.random() - 0.5) * 8;
      iris[i3 + 2] = (Math.random() - 0.5) * 2 - 1;
      tmp.copy(Math.random() < 0.6 ? teal : mist).multiplyScalar(0.35 + Math.random() * 0.4);
    }
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

function IrisField({ converge, open }: IrisFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { size, viewport } = useThree();
  const mouse = useRef({ x: 9999, y: 9999 });
  const data = IRIS_DATA;
  const positions = useMemo(() => new Float32Array(data.scatter), [data]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
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

      let x = scatter[i3] + (tx - scatter[i3]) * p;
      let y = scatter[i3 + 1] + (ty - scatter[i3 + 1]) * p;
      const z = scatter[i3 + 2] + (tz - scatter[i3 + 2]) * p;

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

export interface HeroIrisCanvasProps {
  converge: React.MutableRefObject<number>;
  open: React.MutableRefObject<number>;
}

/** Chunk separado — Three/R3F só baixam quando o Hero monta o canvas. */
export default function HeroIrisCanvas({ converge, open }: HeroIrisCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <IrisField converge={converge} open={open} />
    </Canvas>
  );
}

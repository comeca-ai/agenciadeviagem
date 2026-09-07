import { useEffect, useRef } from "react";
import {
  BadgeCheck,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

interface Selo {
  icone: LucideIcon;
  titulo: string;
  micro: string;
}

const SELOS: Selo[] = [
  {
    icone: BadgeCheck,
    titulo: "Preço final, sempre.",
    micro: "Taxas incluídas, sem susto no checkout.",
  },
  {
    icone: RefreshCw,
    titulo: "Sujeito a alteração, com aviso.",
    micro: "Tarifa muda? A gente avisa antes de você sair da página.",
  },
  {
    icone: ShieldCheck,
    titulo: "Reserva protegida no parceiro.",
    micro: "Pagamento e suporte direto com quem opera.",
  },
  {
    icone: UserCheck,
    titulo: "Maiores de 18 anos.",
    micro: "Nosso atendimento é exclusivo para adultos.",
  },
];

/**
 * Seção 4 — Compromissos do Olho: faixa de 4 selos com stagger e ícones
 * que se revelam ao entrar.
 */
export default function Compromissos() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".selo",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        },
      );
      // Draw-in dos ícones: traçado SVG revelado
      gsap.utils
        .toArray<SVGSVGElement>(".selo-icone svg *")
        .forEach((traco, i) => {
          const el = traco as SVGElement;
          try {
            const len = (el as unknown as SVGGeometryElement).getTotalLength();
            gsap.fromTo(
              el,
              { strokeDasharray: len, strokeDashoffset: len },
              {
                strokeDashoffset: 0,
                duration: 0.5,
                delay: 0.1 * Math.floor(i / 4),
                ease: "cubic-bezier(0.22, 1, 0.36, 1)",
                scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
              },
            );
          } catch {
            /* elemento sem getTotalLength — ignora */
          }
        });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-ink-2 py-[clamp(4rem,10vh,7rem)]">
      <div className="container-site">
        <p className="eyebrow mb-4 text-amber">Compromissos do Olho</p>
        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {SELOS.map((selo) => {
            const Icone = selo.icone;
            return (
              <div key={selo.titulo} className="selo">
                <span className="selo-icone inline-block text-amber">
                  <Icone size={24} />
                </span>
                {selo.titulo.includes("18") && (
                  <span className="mono-data ml-2 inline-block rounded-full border border-[rgba(240,168,50,0.35)] px-2 py-0.5 align-middle text-[0.65rem] font-bold text-amber">
                    +18
                  </span>
                )}
                <h3 className="mt-4 font-bold text-mist">{selo.titulo}</h3>
                <p className="mt-2 text-[0.85rem] leading-[1.6] text-mist-dim">
                  {selo.micro}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

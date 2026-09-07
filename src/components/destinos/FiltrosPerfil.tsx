import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { PERFIS, type Perfil } from "./data";

interface FiltrosPerfilProps {
  ativo: Perfil;
  onChange: (perfil: Perfil) => void;
}

/**
 * Seção 2 — Barra sticky de filtros por perfil (chips horizontais
 * scrolláveis). Chip ativo: fundo âmbar / texto night (contraste no tema claro).
 */
export default function FiltrosPerfil({ ativo, onChange }: FiltrosPerfilProps) {
  const barRef = useRef<HTMLDivElement>(null);

  // Barra desliza de y -20 → 0 ao sair do hero
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        barRef.current,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          scrollTrigger: { trigger: barRef.current, start: "top 90%" },
        },
      );
    }, barRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="sticky top-[4.5rem] z-30 border-b border-mist/10 bg-ink/75 backdrop-blur-[16px]">
      <div ref={barRef} className="container-site">
        <div
          className="scroller-thin flex gap-2.5 overflow-x-auto py-4"
          role="group"
          aria-label="Filtrar destinos por perfil"
        >
          {PERFIS.map((perfil) => {
            const ativoChip = perfil === ativo;
            return (
              <button
                key={perfil}
                type="button"
                onClick={() => onChange(perfil)}
                aria-pressed={ativoChip}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-[0.85rem] font-medium transition-[background-color,border-color,color] duration-250",
                  ativoChip
                    ? "border-amber bg-amber text-night"
                    : "border-mist/20 bg-transparent text-mist-dim hover:border-amber hover:text-mist",
                )}
              >
                {perfil}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

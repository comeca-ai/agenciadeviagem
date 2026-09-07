import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router";
import { MoveRight } from "lucide-react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { DESTINOS, formatPreco, type Destino, type Perfil } from "./data";

/**
 * Ritmo editorial: pares (7/5 ou 5/7) e, a cada 3º card, um full-width
 * (col-span-12) com altura maior que quebra a linha.
 */
function layoutDoCard(index: number): { span: string; aspect: string } {
  const grupo = Math.floor(index / 3);
  const pos = index % 3;
  if (pos === 2) {
    return {
      span: "md:col-span-12",
      aspect: "aspect-[4/5] md:aspect-[16/9]",
    };
  }
  const largo = grupo % 2 === 0 ? pos === 0 : pos === 1;
  return largo
    ? { span: "md:col-span-7", aspect: "aspect-[4/5] md:aspect-[16/10]" }
    : { span: "md:col-span-5", aspect: "aspect-[4/5]" };
}

function DestinoCard({ destino, index }: { destino: Destino; index: number }) {
  const { span, aspect } = layoutDoCard(index);

  return (
    <article className={cn("destino-card", span)}>
      <div className={cn(index % 2 === 1 && "destino-card-par")}>
        <Link
          to={destino.url}
          aria-label={`Ver voos para ${destino.nome}`}
          className="sweep-hover group relative block overflow-hidden rounded-[1.25rem] border border-mist/15 transition-[transform,border-color] duration-350 hover:-translate-y-1.5 hover:border-amber/60"
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          <div className={cn("relative overflow-hidden", aspect)}>
            <img
              src={destino.imagem}
              alt={destino.nome}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-800 group-hover:scale-[1.07]"
              style={{
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
            {/* Overlay inferior gradiente ink */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,15,26,0.86)] via-[rgba(11,15,26,0.28)] to-transparent" />

            {/* Íris mini que "pisca" no hover */}
            <img
              src="/assets/logo.svg"
              alt=""
              aria-hidden="true"
              className="absolute right-4 top-4 h-5 w-5 opacity-50 group-hover:animate-iris-blink"
              style={{ animationDuration: "0.3s", animationIterationCount: 1 }}
            />

            {/* Conteúdo do overlay */}
            <div className="absolute inset-x-0 bottom-0 p-6">
              {/* Tags de perfil */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                {destino.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-night/65 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-ink backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="font-display text-[clamp(1.5rem,2.5vw,2.1rem)] font-medium leading-[1.05] text-mist">
                {destino.nome}
              </h3>
              <p className="mono-data mt-2 text-[0.8rem] text-mist-dim">
                {destino.rota.origem} <span className="text-teal">→</span>{" "}
                {destino.rota.destino}
              </p>
              <p className="mono-data mt-1.5 text-[1.05rem] font-bold text-amber">
                a partir de {formatPreco(destino.preco)}
              </p>
              <p className="mono-data mt-0.5 text-[0.65rem] text-mist-dim">
                por pessoa · ida e volta · taxas incluídas · sujeito a alteração
              </p>

              {/* 2ª linha revelada no hover: frase do Olho + link-seta */}
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <p className="pt-3 font-display text-[0.95rem] italic leading-[1.45] text-mist">
                    “{destino.frase}”
                  </p>
                  <span className="group/seta mt-2 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-teal">
                    Ver voos
                    <MoveRight
                      size={14}
                      className="transition-transform duration-250 group-hover/seta:translate-x-1.5"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
}

/**
 * Seção 4 — Grade masonry editorial dos 7 destinos, filtrável por perfil.
 */
export default function GradeDestinos({
  perfil,
  origem,
}: {
  perfil: Perfil;
  origem: string;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  const filtrados = useMemo(
    () =>
      DESTINOS.filter((d) => {
        const batePerfil = perfil === "Todos" || d.tags.includes(perfil);
        const bateOrigem = origem === "todas" || d.rota.origem === origem;
        return batePerfil && bateOrigem;
      }),
    [origem, perfil],
  );

  // Entrada em batch + parallax dessincronizado dos cards pares.
  // Reexecuta a cada troca de filtro (fade/stagger residual 0.03s).
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(".destino-card", {
        start: "top 85%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 60, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              ease: "cubic-bezier(0.22, 1, 0.36, 1)",
              stagger: 0.09,
              overwrite: true,
            },
          ),
      });
      gsap.utils.toArray<HTMLElement>(".destino-card-par").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, gridRef);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [filtrados]);

  return (
    <section className="bg-ink py-[clamp(3rem,8vh,6rem)]">
      <div ref={gridRef} className="container-site">
        {filtrados.length === 0 ? (
          <p className="py-16 text-center text-mist-dim">
            Nenhuma rota disponível para esse recorte agora. Ajuste o perfil ou
            a origem para ampliar a varredura.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
            {filtrados.map((destino, i) => (
              <DestinoCard key={destino.nome} destino={destino} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

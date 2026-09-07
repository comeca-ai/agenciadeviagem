import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Offer {
  origem: string;
  destino: string;
  badge?: "Escolha do Olho" | "Menor preço" | "Fim de semana" | "Raro";
  detalhe: string;
  preco: string;
  imagem?: string;
  /** URL externa do parceiro para "Reservar" */
  reservaUrl?: string;
}

/**
 * Card de Oferta global (Home, Resultados, Destinos).
 * Fundo ink-3, borda fina, raio 1.25rem; hover: sobe 6px, borda âmbar,
 * sweep de luz e glow atrás do preço.
 */
export default function OfferCard({ offer }: { offer: Offer }) {
  const { origem, destino, badge, detalhe, preco, imagem, reservaUrl = "#" } = offer;

  return (
    <article
      className={cn(
        "sweep-hover group relative flex h-full flex-col overflow-hidden rounded-[1.25rem]",
        "border border-[rgba(237,235,228,0.07)] bg-ink-3",
        "transition-[transform,border-color,box-shadow] duration-350",
        "hover:-translate-y-1.5 hover:border-[rgba(240,168,50,0.35)]",
        "hover:shadow-[0_0_80px_rgba(240,168,50,0.12)]",
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      {/* Foto do destino (opcional) */}
      {imagem && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={imagem}
            alt={`Destino ${destino}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-800 group-hover:scale-105"
            style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-3 via-ink/30 to-transparent" />
        </div>
      )}

      {/* Layout alternativo sem foto: gradiente Íris 10% + íris decorativa */}
      {!imagem && (
        <div
          className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-[rgba(237,235,228,0.07)]"
          style={{
            background:
              "radial-gradient(circle at 50% 60%, rgba(240,168,50,0.1) 0%, rgba(20,27,44,0.4) 70%)",
          }}
        >
          <img src="/assets/logo.svg" alt="" className="h-24 w-24 opacity-70 transition-transform duration-800 group-hover:rotate-180" />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Topo: rota + badge */}
        <div className="flex items-start justify-between gap-3">
          <span className="mono-data text-[0.95rem] font-medium text-mist">
            {origem} <span className="text-teal">→</span> {destino}
          </span>
          {badge && (
            <span
              className={cn(
                "mono-data shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.08em]",
                badge === "Menor preço"
                  ? "bg-[rgba(228,87,46,0.14)] text-ember"
                  : "bg-[rgba(240,168,50,0.14)] text-amber",
              )}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Centro: detalhe + linha de rota */}
        <div className="flex-1">
          <p className="text-[0.9rem] text-mist-dim">{detalhe}</p>
          <svg viewBox="0 0 200 12" className="mt-3 w-full" aria-hidden="true">
            <line
              x1="4"
              y1="6"
              x2="196"
              y2="6"
              stroke="#35C4B5"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              className="route-line"
            />
            <circle cx="4" cy="6" r="3" fill="#F0A832" />
            <circle cx="196" cy="6" r="3" fill="#35C4B5" />
          </svg>
        </div>

        {/* Rodapé: preço + reservar */}
        <div className="relative flex items-end justify-between gap-3">
          <div
            className="pointer-events-none absolute -inset-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at 30% 80%, rgba(240,168,50,0.14) 0%, transparent 60%)",
            }}
          />
          <div>
            <p className="mono-data text-[clamp(1.35rem,2vw,1.6rem)] font-bold text-mist">
              <span className="mr-1 text-[0.65em] font-medium text-mist-dim">R$</span>
              {preco}
            </p>
            <p className="mono-data mt-0.5 text-[0.65rem] text-mist-dim">
              por pessoa · taxas incluídas · sujeito a alteração
            </p>
          </div>
          <a
            href={reservaUrl}
            target="_blank"
            rel="noopener sponsored"
            className="sweep-hover inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber px-4 py-2 text-[0.8rem] font-bold text-night transition-transform duration-250 hover:scale-[1.04] active:scale-[0.97]"
          >
            Reservar <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </article>
  );
}

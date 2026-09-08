import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { CIA_NOMES, type Oferta } from "@/data/demo-ofertas";
import { chegadaEstimada, chegadaPlus1, fmtDuracao, fmtHora, fmtNum } from "./format";

function rotuloEscalas(escalas: number | null, via?: string | null): string {
  if (escalas == null) return "—";
  if (escalas === 0) return "direto";
  const n = escalas >= 2 ? "2+ escalas" : "1 escala";
  return via ? `${n} · ${via}` : n;
}

interface FlightCardProps {
  oferta: Oferta;
  badge?: "Escolha do Olho" | "Menor preço";
  index: number;
  onReservar: (oferta: Oferta) => void;
}

export default function FlightCard({ oferta, badge, onReservar }: FlightCardProps) {
  const chegada = oferta.chegada ?? chegadaEstimada(oferta.partida, oferta.duracao_min);
  const maisUm = chegadaPlus1(oferta.partida, chegada);
  const nomeCia = CIA_NOMES[oferta.cia] ?? oferta.cia;
  const volta = oferta.volta_em;
  return (
    <article className="overflow-hidden rounded-[20px] border border-mist/10 bg-[#FBF9F3]">
      <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex items-center gap-3 lg:w-44 lg:shrink-0">
          <span className="mono-data flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-2 text-[0.8rem] font-bold text-mist">{oferta.cia}</span>
          <div>
            <p className="text-[0.95rem] font-medium text-mist">{nomeCia}</p>
            <p className="mono-data text-[0.7rem] text-mist-dim">{oferta.cia} {oferta.numero_voo}</p>
            {badge && (
              <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold", badge === "Menor preço" ? "bg-[rgba(228,87,46,0.14)] text-ember" : "bg-[rgba(240,168,50,0.16)] text-gold-soft")}>{badge}</span>
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[1.2rem] font-bold text-mist">{fmtHora(oferta.partida)}<span className="mx-2 text-teal">→</span>{fmtHora(chegada)}{maisUm && <sup className="mono-data ml-0.5 text-[0.6em] text-teal">+1</sup>}</p>
          <p className="mono-data mt-1 text-[0.8rem] text-mist-dim">ida · {oferta.origem}–{oferta.destino} · {rotuloEscalas(oferta.escalas, oferta.via)} · {fmtDuracao(oferta.duracao_min)}</p>
          {volta && <p className="mt-2 text-[1.05rem] font-semibold text-mist">volta {fmtHora(volta)}<span className="ml-2 font-normal text-mist-dim"> · {rotuloEscalas(oferta.escalas_volta ?? oferta.escalas)}</span></p>}
        </div>
        <div className="flex items-center justify-between gap-4 lg:w-52 lg:shrink-0 lg:flex-col lg:items-end">
          <div className="lg:text-right">
            <p className="mono-data text-[1.6rem] font-bold text-mist"><span className="mr-1 text-[0.6em] font-medium text-mist-dim">R$</span>{fmtNum(oferta.preco)}</p>
            <p className="mt-0.5 text-[12px] text-mist-dim">por pessoa · taxas incluídas</p>
          </div>
          <button type="button" onClick={() => onReservar(oferta)} className="inline-flex h-12 shrink-0 items-center rounded-full bg-amber px-5 text-[0.9rem] font-bold text-night">Ver oferta</button>
        </div>
      </div>
      <div className="flex items-center gap-1.5 border-t border-mist/[0.08] px-5 py-3">
        <ExternalLink size={12} className="shrink-0 text-mist-dim" />
        <p className="text-[12px] text-[#4B5364]">Preço sujeito a alteração · reserva concluída no site do parceiro</p>
      </div>
    </article>
  );
}

import { cityByIata } from "@/lib/cities";
import type { SearchParams } from "@/lib/search";
import { fmtIntervaloDatas } from "./format";

interface RouteBarProps {
  params: SearchParams;
  isDemo: boolean;
  ativo: boolean;
  onEditar: () => void;
}

export default function RouteBar({ params, isDemo, onEditar }: RouteBarProps) {
  const origem = cityByIata(params.origem);
  const destino = cityByIata(params.destino);

  return (
    <div className="sticky top-16 z-30 border-b border-mist/10 bg-[#FBF9F3]">
      <div className="container-site flex flex-wrap items-center gap-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="mono-data text-[20px] font-bold tracking-wide text-mist">{params.origem}</span>
          <span className="text-[15px] text-teal">→</span>
          <span className="mono-data text-[20px] font-bold tracking-wide text-mist">{params.destino}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[14.5px] font-medium text-mist">
            {origem?.city ?? params.origem} → {destino?.city ?? params.destino}
          </p>
          <p className="mono-data mt-0.5 text-[12px] text-mist-dim">
            {fmtIntervaloDatas(params.ida, params.volta)} · {params.pax}{" "}
            {params.pax === 1 ? "adulto" : "adultos"} · {params.volta ? "ida e volta" : "só ida"}
            {isDemo ? " · demo" : ""}
          </p>
        </div>
        <button type="button" onClick={onEditar} className="ml-auto h-11 rounded-full border border-mist/20 px-4 text-sm font-semibold text-mist">
          Editar busca
        </button>
      </div>
    </div>
  );
}

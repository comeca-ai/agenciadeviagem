import { Link } from "react-router";
import { buildSearchUrl, type SearchParams } from "@/lib/search";

function addDias(iso: string, dias: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

const DOW = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export default function PriceCalendar({ params }: { params: SearchParams }) {
  const dias = Array.from({ length: 7 }, (_, i) => {
    const offset = i - 3;
    const iso = addDias(params.ida, offset);
    const dt = new Date(`${iso}T12:00:00`);
    return {
      iso,
      dow: DOW[dt.getDay()],
      dia: String(dt.getDate()).padStart(2, "0"),
      ativo: offset === 0,
      url: buildSearchUrl({
        ...params,
        ida: iso,
        volta: params.volta ? addDias(params.volta, offset) : undefined,
      }),
    };
  });

  return (
    <div className="rounded-2xl border border-mist/10 bg-[#FBF9F3] p-4">
      <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-mist">Preço por dia de ida</p>
        <p className="mono-data text-[11.5px] text-mist-dim">taxas incluídas · por pessoa</p>
      </div>
      <div className="grid grid-flow-col grid-cols-7 gap-1.5 overflow-x-auto">
        {dias.map((d) => (
          <Link
            key={d.iso}
            to={d.url}
            className={`relative min-h-[76px] rounded-xl border px-1.5 py-2.5 text-center ${
              d.ativo ? "border-gold-soft bg-amber/15" : "border-mist/10 bg-ink"
            }`}
          >
            <p className="mono-data text-[11px] uppercase text-mist-dim">{d.dow}</p>
            <p className="text-sm font-semibold text-mist">{d.dia}</p>
            <p className="mt-1 text-[11px] text-[#4B5364]">{d.ativo ? "escolhida" : "ver"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

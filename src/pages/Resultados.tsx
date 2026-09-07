import { useSearchParams } from "react-router";
import { parseSearchParams } from "@/lib/search";
import { cityByIata } from "@/lib/cities";

/**
 * Página de resultados (placeholder do scaffold — implementação completa
 * conforme resultados.md). Já lê o contrato de busca:
 * /resultados?origem=IATA&destino=IATA&ida=YYYY-MM-DD&volta=YYYY-MM-DD&pax=N
 */
export default function Resultados() {
  const [sp] = useSearchParams();
  const params = parseSearchParams(sp);

  const origem = params ? cityByIata(params.origem) : undefined;
  const destino = params ? cityByIata(params.destino) : undefined;

  return (
    <section className="container-site py-[clamp(5rem,12vh,9rem)]">
      <p className="eyebrow mb-4 text-teal">O Olho viu</p>
      <h1 className="font-display text-[clamp(2.2rem,5vw,4.25rem)] font-medium leading-none text-mist">
        {params ? (
          <>
            <span className="mono-data">{params.origem}</span>{" "}
            <span className="text-teal">→</span>{" "}
            <span className="mono-data">{params.destino}</span>
          </>
        ) : (
          "Resultados"
        )}
      </h1>
      <p className="mono-data mt-6 text-[0.9rem] text-mist-dim">
        {params
          ? `${origem?.city ?? params.origem} → ${destino?.city ?? params.destino} · ida ${
              params.ida
            }${params.volta ? ` · volta ${params.volta}` : " · só ida"} · ${
              params.pax
            } passageiro${params.pax > 1 ? "s" : ""}`
          : "Nenhuma busca informada — use o painel da home para vasculhar o mundo."}
      </p>
    </section>
  );
}

import { useEffect } from "react";
import { Link } from "react-router";

export default function ALenda() {
  useEffect(() => {
    document.title = "A Lenda de Tandera | Olho de Tandera";
  }, []);

  return (
    <section className="container-site py-[clamp(2rem,4vw,3.5rem)] pb-20">
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div>
          <p className="mono-data mb-3 text-[12px] uppercase tracking-[0.22em] text-teal">A Lenda</p>
          <h1 className="mb-4 max-w-[16ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.06] tracking-tight">
            O vigia que não fechava o olho
          </h1>
          <p className="mb-4 max-w-[54ch] text-[16.5px] leading-relaxed text-[#4B5364]">
            Antes do radar, havia um vigia no mastro. Tandera lia o horizonte e avisava o porto
            quando o preço da travessia mudava — vento, carga, tempo. O nome da agência é esse
            ofício: olhar primeiro e mostrar o número sem teatro.
          </p>
          <p className="mb-6 max-w-[54ch] text-[16.5px] leading-relaxed text-[#4B5364]">
            A reserva continua no parceiro. A lenda não vende milha nem inventa economia. Ela
            explica por que o Olho existe.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/#busca" className="inline-flex h-12 items-center rounded-full bg-amber px-6 font-bold text-night">
              Buscar voos
            </Link>
            <Link to="/como-funciona" className="inline-flex h-12 items-center rounded-full border border-mist/20 px-5 font-semibold text-mist">
              Como funciona
            </Link>
          </div>
        </div>
        <figure className="m-0">
          <div className="aspect-[4/3] overflow-hidden rounded-[20px] bg-night">
            <img src="/assets/lenda-farol.jpg" alt="Farol com feixe de luz sobre o mar à noite" className="h-full w-full object-cover" />
          </div>
          <figcaption className="mono-data mt-2.5 text-[11.5px] text-[#6B7285]">
            O farol de Tandera — origem do nome da agência.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

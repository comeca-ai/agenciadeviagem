import SearchPanel from "@/components/SearchPanel";
import { cityByIata } from "@/lib/cities";
import { defaultIda, defaultVolta } from "@/lib/search";

export default function Hero() {
  const gru = cityByIata("GRU") ?? null;

  return (
    <section
      id="busca"
      className="relative flex min-h-[calc(100dvh-4.5rem)] items-center bg-ink"
    >
      <div className="container-site relative z-10 w-full py-10 md:py-14">
        <p className="mb-2 text-sm text-mist-dim">Olho de Tandera</p>
        <h1 className="mb-8 font-display text-[clamp(1.6rem,3.5vw,2.4rem)] font-medium leading-tight text-mist">
          Ache um preço e reserve.
        </h1>
        <SearchPanel
          cta="Buscar passagens"
          instant
          initial={{
            origem: gru,
            ida: defaultIda(),
            volta: defaultVolta(),
          }}
        />
      </div>
    </section>
  );
}

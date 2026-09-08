import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import FiltrosPerfil from "@/components/destinos/FiltrosPerfil";
import { DESTINOS, DESTAQUE_NORONHA, type Perfil } from "@/components/destinos/data";

export default function Destinos() {
  const [perfil, setPerfil] = useState<Perfil>("Todos");

  useEffect(() => {
    document.title = "Destinos | Olho de Tandera";
  }, []);

  const lista = useMemo(
    () => (perfil === "Todos" ? DESTINOS : DESTINOS.filter((d) => d.tags.includes(perfil))),
    [perfil],
  );

  return (
    <>
      <section className="container-site pt-[clamp(2rem,4vw,3.5rem)]">
        <p className="mono-data mb-3 text-[12px] uppercase tracking-[0.22em] text-teal-text">
          Mundo todo · 8 destaques do mês
        </p>
        <h1 className="mb-4 max-w-[16ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.06] tracking-tight">
          Para onde os preços estão baixos agora
        </h1>
        <p className="max-w-[60ch] text-[16.5px] leading-relaxed text-[#4B5364]">
          Oito rotas da vitrine do mês. O preço só aparece depois da busca — na tela de resultados, com taxas e o nome de quem emite o bilhete.
        </p>
      </section>

      <FiltrosPerfil ativo={perfil} onChange={setPerfil} />

      <section className="container-site py-10">
        <article className="grid overflow-hidden rounded-[20px] border border-mist/10 bg-[#FBF9F3] lg:grid-cols-2">
          <div className="aspect-[4/3] lg:aspect-auto">
            <img src={DESTAQUE_NORONHA.imagem} alt="Fernando de Noronha" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="mono-data mb-2 text-[11px] uppercase tracking-[0.18em] text-teal-text">Destaque do mês</p>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-tight">
              Fernando de Noronha
            </h2>
            <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-[#4B5364]">
              REC → FEN. Taxa de preservação ambiental da ilha não entra no preço da passagem — ela é cobrada à parte na entrada.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={DESTAQUE_NORONHA.url} className="inline-flex h-12 items-center rounded-full bg-amber px-5 font-bold text-night">
                Ver voos de 4–11 jun
              </Link>
              <Link to="/conta/alertas" className="inline-flex h-12 items-center rounded-full border border-mist/20 px-5 font-semibold text-mist">
                Avisar se cair
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="container-site pb-20">
        <p className="mb-4 text-sm text-[#4B5364]">
          {lista.length} {lista.length === 1 ? "destino" : "destinos"}
          {perfil !== "Todos" ? ` em ${perfil}` : ""}
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((d) => (
            <article key={d.nome} className="overflow-hidden rounded-[20px] border border-mist/10 bg-[#FBF9F3]">
              <div className="relative aspect-[4/3] bg-ink-2">
                <img src={d.imagem} alt="" className="h-full w-full object-cover" />
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  {d.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-full bg-[rgba(11,15,26,.72)] px-2.5 py-1 text-[11px] font-medium text-[#F7F4EC] backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-[21px] font-semibold tracking-tight text-mist">{d.nome}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#4B5364]">{d.frase}</p>
                <p className="mono-data mt-3 text-[13px] text-mist-dim">
                  {d.rota.origem} → {d.rota.destino}
                </p>
                <Link to={d.url} className="mt-4 inline-flex h-11 items-center rounded-full bg-amber px-4 text-sm font-bold text-night">
                  Ver voos
                </Link>
              </div>
            </article>
          ))}
        </div>
        {lista.length === 0 && (
          <p className="rounded-2xl border border-dashed border-mist/20 px-5 py-10 text-center text-[#4B5364]">
            Nenhum destino neste perfil. Troque o filtro ou busque outra rota.
          </p>
        )}
      </section>
    </>
  );
}

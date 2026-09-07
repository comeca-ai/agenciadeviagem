import { useEffect, useState } from "react";
import HeroDestinos from "@/components/destinos/HeroDestinos";
import FiltrosPerfil from "@/components/destinos/FiltrosPerfil";
import DestaqueNoronha from "@/components/destinos/DestaqueNoronha";
import GradeDestinos from "@/components/destinos/GradeDestinos";
import BandaBusca from "@/components/destinos/BandaBusca";
import {
  HUBS_BR_DISPONIVEIS,
  HUBS_BR_REFERENCIA,
  type Perfil,
} from "@/components/destinos/data";

/**
 * Página Destinos — "O que o Olho encontrou" (/destinos).
 * Hero editorial → filtros por perfil (sticky) → destaque parallax de
 * Noronha → grade masonry editorial → banda "Não viu seu destino?".
 */
export default function Destinos() {
  const [perfil, setPerfil] = useState<Perfil>("Todos");
  const [origem, setOrigem] = useState("todas");
  const hubsSemAmostra = HUBS_BR_REFERENCIA.filter(
    (hub) => !HUBS_BR_DISPONIVEIS.includes(hub),
  );

  useEffect(() => {
    document.title = "Destinos que o Olho encontrou | Olho de Tandera";
  }, []);

  return (
    <>
      <HeroDestinos />
      <FiltrosPerfil
        ativo={perfil}
        onChange={setPerfil}
        origemAtiva={origem}
        origensDisponiveis={HUBS_BR_DISPONIVEIS}
        onOrigemChange={setOrigem}
      />
      <section className="border-b border-mist/10 bg-ink">
        <div className="container-site py-6">
          <p className="text-sm leading-relaxed text-mist-dim">
            Curadoria LATAM para quem sai do Brasil. Nesta semana, há amostras
            de rotas partindo de{" "}
            {HUBS_BR_DISPONIVEIS.map((hub) => (
              <strong key={hub} className="mono-data mr-2 inline-block text-mist">
                {hub}
              </strong>
            ))}
            {hubsSemAmostra.length > 0 && (
              <>
                e os hubs{" "}
                {hubsSemAmostra.map((hub) => (
                  <span key={hub} className="mono-data mr-2 inline-block">
                    {hub}
                  </span>
                ))}
                seguem em monitoramento.
              </>
            )}
          </p>
        </div>
      </section>
      <DestaqueNoronha />
      <GradeDestinos perfil={perfil} origem={origem} />
      <BandaBusca />
    </>
  );
}

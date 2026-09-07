import { useEffect, useState } from "react";
import HeroDestinos from "@/components/destinos/HeroDestinos";
import FiltrosPerfil from "@/components/destinos/FiltrosPerfil";
import DestaqueNoronha from "@/components/destinos/DestaqueNoronha";
import GradeDestinos from "@/components/destinos/GradeDestinos";
import BandaBusca from "@/components/destinos/BandaBusca";
import type { Perfil } from "@/components/destinos/data";

/**
 * Página Destinos — "O que o Olho encontrou" (/destinos).
 * Hero editorial → filtros por perfil (sticky) → destaque parallax de
 * Noronha → grade masonry editorial → banda "Não viu seu destino?".
 */
export default function Destinos() {
  const [perfil, setPerfil] = useState<Perfil>("Todos");

  useEffect(() => {
    document.title = "Destinos que o Olho encontrou | Olho de Tandera";
  }, []);

  return (
    <>
      <HeroDestinos />
      <FiltrosPerfil ativo={perfil} onChange={setPerfil} />
      <DestaqueNoronha />
      <GradeDestinos perfil={perfil} />
      <BandaBusca />
    </>
  );
}

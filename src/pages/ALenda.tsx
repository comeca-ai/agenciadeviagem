import { useEffect } from "react";
import ChapterRail from "@/components/lenda/ChapterRail";
import Capa from "@/components/lenda/Capa";
import CapPorto from "@/components/lenda/CapPorto";
import CapVigia from "@/components/lenda/CapVigia";
import CapHorizonte from "@/components/lenda/CapHorizonte";
import CapFarol from "@/components/lenda/CapFarol";
import CapOlho from "@/components/lenda/CapOlho";
import CtaFinal from "@/components/lenda/CtaFinal";

/**
 * A Lenda — "A história de Tandera" (/a-lenda)
 * Scroll-storytelling em 5 capítulos pinados (~12 telas de scroll),
 * régua de capítulos persistente e a íris que desperta no final.
 */
export default function ALenda() {
  // SEO da página
  useEffect(() => {
    document.title = "A Lenda de Tandera | Olho de Tandera";
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    const anterior = meta?.content;
    meta?.setAttribute(
      "content",
      "Antes do radar e do satélite, havia um vigia no topo do mastro. Ele nunca fechou os olhos.",
    );
    return () => {
      if (meta && anterior) meta.setAttribute("content", anterior);
    };
  }, []);

  return (
    <>
      <ChapterRail />
      <Capa />
      <CapPorto />
      <CapVigia />
      <CapHorizonte />
      <CapFarol />
      <CapOlho />
      <CtaFinal />
    </>
  );
}

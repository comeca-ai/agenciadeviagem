import { useEffect } from "react";
import HeroComo from "@/components/como-funciona/HeroComo";
import TimelinePassos from "@/components/como-funciona/TimelinePassos";
import EspelhoOlho from "@/components/como-funciona/EspelhoOlho";
import Compromissos from "@/components/como-funciona/Compromissos";
import TecnologiaBorda from "@/components/como-funciona/TecnologiaBorda";
import Faq from "@/components/como-funciona/Faq";
import CtaFinal from "@/components/como-funciona/CtaFinal";

/**
 * Página Como Funciona — "100% digital. 0% complicado." (/como-funciona).
 * Hero → 4 passos (linha do tempo) → espelho é/não é → compromissos →
 * tecnologia (Cloudflare) → FAQ → CTA final.
 */
export default function ComoFunciona() {
  useEffect(() => {
    document.title = "Como Funciona | Olho de Tandera";
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    const anterior = meta?.content;
    meta?.setAttribute(
      "content",
      "Buscador de viagens 100% digital: preço final com taxas, reserva no site do parceiro, atendimento para maiores de 18 anos.",
    );
    return () => {
      if (meta && anterior !== undefined) meta.setAttribute("content", anterior);
    };
  }, []);

  return (
    <>
      <HeroComo />
      <TimelinePassos />
      <EspelhoOlho />
      <Compromissos />
      <TecnologiaBorda />
      <Faq />
      <CtaFinal />
    </>
  );
}

import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const E_LISTA = [
  "Um buscador de viagens incansável",
  "Uma agência 100% digital, feita para o Brasil",
  "Transparente: o preço que você vê é o preço final exibido pelo parceiro",
  "Gratuito para você — quem paga a comissão é o parceiro, sem custo extra",
];

const NAO_E_LISTA = [
  "Não vendemos passagens nem emitimos bilhetes",
  "Não cobramos taxa de serviço",
  "Não guardamos seus dados de pagamento (a compra é no site do parceiro)",
  "Não atendemos menores de 18 anos",
];

/**
 * Seção 3 — "O que somos / o que não somos": dois cards grandes espelhados,
 * borda teal à esquerda, borda ember à direita.
 */
export default function EspelhoOlho() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".espelho-esq",
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".espelho-dir",
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".espelho-item",
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.07,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-ink py-[clamp(5rem,12vh,9rem)]">
      <div className="container-site grid gap-6 md:grid-cols-2">
        {/* O Olho é */}
        <div className="espelho-esq rounded-[1.25rem] border border-[rgba(53,196,181,0.3)] bg-ink-3 p-[2.5rem]">
          <h3 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-medium text-mist">
            O Olho <em className="italic text-teal">é</em>
          </h3>
          <ul className="mt-8 flex flex-col gap-5">
            {E_LISTA.map((item) => (
              <li
                key={item}
                className="espelho-item group flex items-start gap-3.5 transition-transform duration-250 hover:translate-x-1.5"
              >
                <Check
                  size={20}
                  className="mt-0.5 shrink-0 text-teal transition-[filter] duration-250 group-hover:drop-shadow-[0_0_8px_rgba(53,196,181,0.7)]"
                />
                <span className="leading-[1.6] text-mist">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* O Olho não é */}
        <div className="espelho-dir rounded-[1.25rem] border border-[rgba(228,87,46,0.3)] bg-ink-3 p-[2.5rem]">
          <h3 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-medium text-mist">
            O Olho <em className="italic text-ember">não é</em>
          </h3>
          <ul className="mt-8 flex flex-col gap-5">
            {NAO_E_LISTA.map((item) => (
              <li
                key={item}
                className="espelho-item group flex items-start gap-3.5 transition-transform duration-250 hover:translate-x-1.5"
              >
                <X
                  size={20}
                  className="mt-0.5 shrink-0 text-ember transition-[filter] duration-250 group-hover:drop-shadow-[0_0_8px_rgba(228,87,46,0.7)]"
                />
                <span className="leading-[1.6] text-mist">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

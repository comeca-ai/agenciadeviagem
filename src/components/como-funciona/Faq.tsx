import { useEffect, useRef } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const PERGUNTAS = [
  {
    q: "A reserva acontece onde?",
    a: "No site do parceiro. O Olho encontra a oferta e te leva até lá com um clique; pagamento, emissão e suporte são com o fornecedor.",
  },
  {
    q: "O preço que eu vejo é o preço final?",
    a: "Sim: exibimos o valor por pessoa com taxas incluídas. Tarifas de viagem mudam rápido, então o preço é sujeito a alteração até a conclusão da reserva — se mudar, você vê antes de decidir.",
  },
  {
    q: "Vocês cobram alguma taxa?",
    a: "Não. O Olho é gratuito: recebemos comissão do parceiro quando você reserva, sem custo extra para você.",
  },
  {
    q: "Por que só maiores de 18 anos?",
    a: "Porque a reserva é um contrato feito por você diretamente com o fornecedor. Nosso atendimento é exclusivo para adultos.",
  },
  {
    q: "Preciso criar conta?",
    a: "Não. O Olho não pede cadastro para vasculhar o mundo.",
  },
  {
    q: "O que é o selo 'Escolha do Olho'?",
    a: "É a oferta com o melhor equilíbrio entre preço, duração e escalas naquela busca — o que o vigia levaria para casa.",
  },
];

/**
 * Seção 6 — FAQ em acordeão (Radix): um item aberto por vez, ícone Plus
 * que gira 45° ao abrir, borda inferior fina, sem card.
 */
export default function Faq() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-word",
        { yPercent: 90 },
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "cubic-bezier(0.16, 1, 0.3, 1)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".faq-item",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "cubic-bezier(0.22, 1, 0.36, 1)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const h2 = ["Perguntas", "que", "o", "Olho", "já", "ouviu."];

  return (
    <section ref={sectionRef} className="bg-ink py-[clamp(5rem,12vh,9rem)]">
      <div className="container-site">
        <div className="mx-auto max-w-[48rem]">
          <h2 className="mb-12 font-display text-[clamp(2.2rem,5vw,4.25rem)] font-medium leading-[1.0] text-mist">
            {h2.map((word, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden pb-[0.08em] align-bottom"
              >
                <span
                  className={
                    "faq-word inline-block " +
                    (i >= 4 ? "text-iris-gradient italic" : "")
                  }
                >
                  {word}
                  {i < h2.length - 1 ? " " : ""}
                </span>
              </span>
            ))}
          </h2>

          <AccordionPrimitive.Root type="single" collapsible>
            {PERGUNTAS.map((item, i) => (
              <AccordionPrimitive.Item
                key={item.q}
                value={`pergunta-${i}`}
                className="faq-item border-b border-[rgba(237,235,228,0.07)]"
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-4 py-6 text-left text-[1.05rem] font-medium text-mist outline-none transition-colors hover:text-amber focus-visible:ring-2 focus-visible:ring-amber/50">
                    {item.q}
                    <Plus
                      size={20}
                      className="shrink-0 text-mist-dim transition-transform duration-350 group-hover:text-amber group-data-[state=open]:rotate-45 group-data-[state=open]:text-amber"
                      style={{
                        transitionTimingFunction:
                          "cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content className="overflow-hidden [animation-duration:0.35s] [animation-timing-function:cubic-bezier(0.22,1,0.36,1)] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <p className="pb-6 pr-10 leading-[1.65] text-mist-dim">
                    {item.a}
                  </p>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            ))}
          </AccordionPrimitive.Root>

          <p className="mono-data mt-10 text-[0.75rem] leading-[1.7] text-mist-dim">
            Preços por pessoa, taxas incluídas, sujeitos a alteração sem aviso
            prévio. A reserva é concluída no site do parceiro. Atendimento
            exclusivo para maiores de 18 anos.
          </p>
        </div>
      </div>
    </section>
  );
}

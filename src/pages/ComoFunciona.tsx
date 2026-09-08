import { useEffect, useState } from "react";
import { Link } from "react-router";
import CompromissosBar from "@/components/CompromissosBar";

const PASSOS = [
  { n: "01", titulo: "Você diz para onde", texto: "Origem, destino e datas. Marque “datas flexíveis” para ver os dias mais baratos ao redor." },
  { n: "02", titulo: "Comparamos os parceiros", texto: "Consultamos 14 companhias e agências, no Brasil e fora, e normalizamos tudo em preço final por pessoa." },
  { n: "03", titulo: "Você compara de verdade", texto: "Ida e volta no mesmo card, bagagem, escalas e o nome do parceiro que vai emitir." },
  { n: "04", titulo: "A reserva é com o parceiro", texto: "Mostramos o total antes do redirecionamento e você conclui a compra no site dele." },
];

const FAQS = [
  { q: "O preço que aparece é o final?", a: "É o preço por pessoa com taxas e impostos incluídos, para o trecho de ida e volta. A tarifa pode mudar até a emissão do bilhete; se mudar, mostramos o novo valor antes de você sair do site." },
  { q: "Onde eu pago e quem emite o bilhete?", a: "No parceiro — companhia aérea ou agência. Formas de pagamento, parcelamento e emissão seguem as regras dele. Você vê o nome do parceiro em cada oferta antes de clicar." },
  { q: "E se meu voo atrasar ou for cancelado?", a: "Quem resolve é a companhia aérea, com apoio do parceiro onde a reserva foi feita. Se você tiver conta, guardamos o link e o localizador para você chegar rápido neles." },
  { q: "Preciso criar conta para buscar?", a: "Não. Conta só é necessária para salvar buscas e receber alertas de preço." },
  { q: "Vocês cobram taxa de serviço?", a: "Não cobramos nada do viajante. Recebemos comissão do parceiro quando a reserva é concluída — e isso não altera o preço que você vê." },
  { q: "Vocês são homologados para vender essas tarifas?", a: "Sim. Somos homologados pelos parceiros internacionais de distribuição aérea com quem operamos — são eles que nos autorizam a exibir e encaminhar essas tarifas. A emissão do bilhete é sempre feita pela companhia ou agência indicada em cada oferta." },
];

export default function ComoFunciona() {
  const [faq, setFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = "Como funciona | Olho de Tandera";
  }, []);

  return (
    <>
      <section className="container-site pt-[clamp(2rem,4vw,3.5rem)]">
        <p className="mono-data mb-3 text-[12px] uppercase tracking-[0.22em] text-teal-text">100% digital</p>
        <h1 className="mb-4 max-w-[16ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.06] tracking-tight">
          Buscamos, você reserva com o parceiro
        </h1>
        <p className="max-w-[60ch] text-[16.5px] leading-relaxed text-[#4B5364]">
          Somos um buscador, não uma emissora de bilhetes. Comparamos as tarifas de companhias e agências, mostramos o preço final e levamos você ao parceiro para concluir.
        </p>
      </section>

      <section className="container-site grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {PASSOS.map((p) => (
          <article key={p.n} className="rounded-2xl border border-mist/10 bg-[#FBF9F3] p-5">
            <p className="mono-data mb-3 text-[13px] font-bold text-gold-soft">{p.n}</p>
            <h2 className="text-[16.5px] font-semibold text-mist">{p.titulo}</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-[#4B5364]">{p.texto}</p>
          </article>
        ))}
      </section>

      <CompromissosBar />

      <section className="container-site max-w-[48rem] pb-12">
        <h2 className="mb-6 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-tight">Perguntas frequentes</h2>
        <div>
          {FAQS.map((item, i) => {
            const open = faq === i;
            return (
              <div key={item.q} className="border-b border-mist/10">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setFaq(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-[16px] font-semibold text-mist"
                >
                  {item.q}
                  <span className="font-display text-[19px] text-gold-soft">{open ? "−" : "+"}</span>
                </button>
                {open && <p className="max-w-[70ch] pb-5 text-[15px] leading-relaxed text-[#4B5364]">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-site pb-20">
        <div className="relative overflow-hidden rounded-[20px]">
          <img src="/assets/cta-horizonte.jpg" alt="" className="h-64 w-full object-cover sm:h-72" />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(11,15,26,.9)] to-[rgba(11,15,26,.55)]" />
          <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-10">
            <h2 className="max-w-[24ch] font-display text-[clamp(1.5rem,3vw,2.25rem)] font-semibold tracking-tight text-[#F7F4EC]">
              Pronto para ver o preço final?
            </h2>
            <Link to="/#busca" className="mt-5 inline-flex h-12 items-center rounded-full bg-amber px-6 font-bold text-night">
              Buscar voos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import SearchPanel from "@/components/SearchPanel";
import { cityByIata } from "@/lib/cities";
import { defaultIda, defaultVolta } from "@/lib/search";
import { DESTINOS, DESTAQUE_NORONHA, formatPreco } from "@/components/destinos/data";

const QUEDAS = [
  { rota: "GRU → POA", cidades: "São Paulo → Porto Alegre", preco: "R$ 489", delta: "−12%", url: "/resultados?origem=GRU&destino=POA&ida=2026-10-15&volta=2026-10-22&pax=1" },
  { rota: "REC → FEN", cidades: "Recife → Noronha", preco: "R$ 1.284", delta: "−9%", url: DESTAQUE_NORONHA.url },
  { rota: "CWB → CUZ", cidades: "Curitiba → Cusco", preco: "R$ 2.150", delta: "−14%", url: "/resultados?origem=CWB&destino=CUZ&ida=2026-09-07&volta=2026-09-15&pax=1" },
  { rota: "GRU → LIS", cidades: "São Paulo → Lisboa", preco: "R$ 2.987", delta: "−6%", url: "/resultados?origem=GRU&destino=LIS&ida=2026-05-12&volta=2026-05-24&pax=1" },
];

const CONFIANCA = [
  { tag: "Preço", titulo: "Taxas já inclusas", texto: "O número na tela é o que você paga por pessoa. Se a tarifa mudar, avisamos antes." },
  { tag: "Reserva", titulo: "Compra no parceiro", texto: "Você conclui no site da companhia ou da agência. Sem intermediário no cartão." },
  { tag: "Acesso", titulo: "Sem cadastro para buscar", texto: "Conta só para alerta de preço e buscas salvas." },
];

const DESTAQUES = [DESTAQUE_NORONHA, ...DESTINOS].slice(0, 8);

export default function Home() {
  const location = useLocation();
  const gru = cityByIata("GRU") ?? null;

  useEffect(() => {
    document.title = "Olho de Tandera — passagens com o preço final na tela";
    if (location.hash === "#busca") {
      const t = setTimeout(() => {
        document.getElementById("busca")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [location.hash]);

  return (
    <>
      <section className="container-site pb-2 pt-[clamp(2.25rem,5vw,4rem)]">
        <p className="mono-data mb-3.5 text-[12px] uppercase tracking-[0.22em] text-teal">Agência 100% digital · 18+</p>
        <h1 className="mb-4 max-w-[16ch] font-display text-[clamp(2.1rem,5.2vw,3.6rem)] font-semibold leading-[1.04] tracking-tight text-mist">
          Passagens com o preço final na tela.
        </h1>
        <p className="max-w-[56ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed text-[#4B5364]">
          Comparamos as tarifas das companhias e das agências parceiras. Você vê quanto vai pagar — com taxas — antes de sair daqui, e conclui a reserva direto com o parceiro.
        </p>
      </section>

      <section id="busca" className="container-site pt-6">
        <div className="rounded-[20px] border border-mist/10 bg-[#FBF9F3] p-[clamp(1rem,2vw,1.4rem)] shadow-[0_14px_40px_-28px_rgba(18,21,31,.35)]">
          <SearchPanel cta="Buscar voos" instant initial={{ origem: gru, ida: defaultIda(), volta: defaultVolta() }} />
          <p className="mt-3 text-[13px] text-mist-dim">sem cadastro para buscar</p>
        </div>
      </section>

      <section className="container-site py-12">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(1.4rem,2.4vw,1.8rem)] font-semibold text-mist">Caiu de preço esta semana</h2>
          <Link to="/conta/alertas" className="whitespace-nowrap text-sm font-semibold text-teal">Criar alerta de preço →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUEDAS.map((q) => (
            <Link key={q.rota} to={q.url} className="rounded-2xl border border-mist/10 bg-[#FBF9F3] p-4 transition-colors hover:border-teal/40">
              <p className="mono-data text-[15px] font-bold tracking-wide text-mist">{q.rota}</p>
              <p className="mt-1 text-sm text-[#4B5364]">{q.cidades}</p>
              <p className="mt-3 font-display text-xl font-semibold text-mist">{q.preco}</p>
              <p className="mono-data mt-1 text-[12px] font-bold text-teal">{q.delta}</p>
              <p className="mt-2 text-[11px] text-mist-dim">ida e volta · por pessoa · taxas incluídas</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-site grid gap-3 pb-4 md:grid-cols-3">
        {CONFIANCA.map((c) => (
          <div key={c.tag} className="rounded-2xl border border-mist/10 bg-[#FBF9F3] p-5">
            <p className="mono-data mb-2 text-[11px] uppercase tracking-[0.18em] text-teal">{c.tag}</p>
            <p className="font-semibold text-mist">{c.titulo}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-[#4B5364]">{c.texto}</p>
          </div>
        ))}
      </section>

      <section className="container-site py-12 pb-20">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(1.4rem,2.4vw,1.8rem)] font-semibold text-mist">Destinos com preço em queda</h2>
          <Link to="/destinos" className="whitespace-nowrap text-sm font-semibold text-teal">Ver os 8 destinos →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DESTAQUES.map((d) => (
            <Link key={d.nome} to={d.url} className="group overflow-hidden rounded-2xl border border-mist/10 bg-[#FBF9F3]">
              <div className="aspect-[4/3] overflow-hidden bg-ink-2">
                <img src={d.imagem} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="p-4">
                <p className="font-semibold text-mist">{d.nome}</p>
                <p className="mt-1 text-sm text-[#4B5364]">{d.rota.origem} → {d.rota.destino}</p>
                <p className="mt-2 text-[12px] text-mist-dim">a partir de</p>
                <p className="font-display text-lg font-semibold text-mist">{formatPreco(d.preco)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

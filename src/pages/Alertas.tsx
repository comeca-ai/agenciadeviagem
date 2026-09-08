import { useEffect, useState } from "react";
import { Link } from "react-router";

type Alerta = { id: string; rota: string; cidades: string; detalhe: string; preco: string; delta?: string; alvo: string; url: string; pausado?: boolean };

const INICIAIS: Alerta[] = [
  { id: "a", rota: "GRU → POA", cidades: "São Paulo → Porto Alegre", detalhe: "out–nov · datas flexíveis · 1 adulto", preco: "489", delta: "−12% em 14 dias", alvo: "R$ 450", url: "/resultados?origem=GRU&destino=POA&ida=2026-10-15&volta=2026-10-22&pax=1" },
  { id: "b", rota: "REC → FEN", cidades: "Recife → Fernando de Noronha", detalhe: "4–11 jun · datas fixas · 2 adultos", preco: "1.284", delta: "+8% em 14 dias", alvo: "R$ 1.100", url: "/resultados?origem=REC&destino=FEN&ida=2026-06-04&volta=2026-06-11&pax=2" },
  { id: "c", rota: "GRU → LIS", cidades: "São Paulo → Lisboa · pausado", detalhe: "mai · datas flexíveis · 1 adulto", preco: "2.987", alvo: "R$ 2.600", url: "/resultados?origem=GRU&destino=LIS&ida=2026-05-12&volta=2026-05-24&pax=1", pausado: true },
];

export default function Alertas() {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [alvo, setAlvo] = useState("");
  const [criado, setCriado] = useState<string | null>(null);
  useEffect(() => { document.title = "Alertas de preço | Olho de Tandera"; }, []);
  const criar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origem || !destino || !alvo) return;
    setCriado(`Alerta criado para ${origem.toUpperCase()} → ${destino.toUpperCase()}. Você recebe um e-mail quando a tarifa ficar abaixo de R$ ${alvo}.`);
  };
  return (
    <section className="container-site max-w-[1040px] py-[clamp(2rem,4vw,3.5rem)] pb-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mono-data mb-2.5 text-[12px] uppercase tracking-[0.22em] text-teal">Sua conta</p>
          <h1 className="font-display text-[clamp(1.75rem,3.6vw,2.5rem)] font-semibold tracking-tight">Alertas de preço</h1>
        </div>
        <p className="mono-data text-[12px] text-mist-dim">verificamos os preços 4× por dia</p>
      </div>
      <div className="mt-6 flex flex-col gap-2.5">
        {INICIAIS.map((a) => (
          <article key={a.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-mist/10 bg-[#FBF9F3] p-[18px]">
            <div className="min-w-0 flex-1 basis-[190px]">
              <p className="mono-data text-[15px] font-bold tracking-wide text-mist">{a.rota}</p>
              <p className="mt-1 text-sm text-[#4B5364]">{a.cidades}</p>
              <p className="mono-data mt-1 text-[11.5px] text-[#6B7285]">{a.detalhe}</p>
            </div>
            <div className="min-w-[140px] text-right">
              <p className="mono-data text-[22px] font-bold text-mist"><span className="mr-0.5 text-[12px] font-medium text-mist-dim">R$</span>{a.preco}</p>
              {a.delta && <p className="mono-data mt-1 text-[11.5px] font-bold text-teal">{a.delta}</p>}
              <p className="mono-data mt-1 text-[11.5px] text-[#6B7285]">alvo: {a.alvo}</p>
            </div>
            {!a.pausado && <Link to={a.url} className="inline-flex h-11 items-center rounded-full bg-amber px-4 text-sm font-bold text-night">Ver voos</Link>}
          </article>
        ))}
      </div>
      <form onSubmit={criar} className="mt-8 rounded-2xl border border-mist/10 bg-[#FBF9F3] p-5">
        <h2 className="mb-1 font-display text-xl font-semibold">Novo alerta</h2>
        <p className="mb-4 text-sm text-[#4B5364]">Avisamos por e-mail quando a tarifa ficar abaixo do seu alvo.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div><label className="mono-data mb-1 block text-[10.5px] uppercase tracking-[0.16em] text-[#6B7285]">Origem</label><input value={origem} onChange={(e) => setOrigem(e.target.value)} placeholder="GRU" className="h-12 w-full rounded-xl border border-mist/20 bg-ink px-3" /></div>
          <div><label className="mono-data mb-1 block text-[10.5px] uppercase tracking-[0.16em] text-[#6B7285]">Destino</label><input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="NRT" className="h-12 w-full rounded-xl border border-mist/20 bg-ink px-3" /></div>
          <div><label className="mono-data mb-1 block text-[10.5px] uppercase tracking-[0.16em] text-[#6B7285]">Preço alvo</label><input value={alvo} onChange={(e) => setAlvo(e.target.value)} placeholder="4500" className="h-12 w-full rounded-xl border border-mist/20 bg-ink px-3" /></div>
        </div>
        <button type="submit" className="mt-4 h-12 rounded-xl bg-amber px-5 font-bold text-night">Criar alerta</button>
        {criado && <p className="mt-3 text-sm text-teal">{criado}</p>}
      </form>
    </section>
  );
}

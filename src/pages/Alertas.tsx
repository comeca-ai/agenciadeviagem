import { useEffect, useState } from "react";
import { Link } from "react-router";

type AlertaApi = {
  id: string;
  origem: string;
  destino: string;
  ida: string;
  volta?: string | null;
  preco_alvo?: number | null;
};

export default function Alertas() {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [ida, setIda] = useState("");
  const [alvo, setAlvo] = useState("");
  const [lista, setLista] = useState<AlertaApi[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [precisaEntrar, setPrecisaEntrar] = useState(false);

  useEffect(() => {
    document.title = "Alertas de preço | Olho de Tandera";
    let vivo = true;
    fetch("/api/alerts")
      .then(async (r) => {
        if (r.status === 401) {
          if (vivo) setPrecisaEntrar(true);
          return;
        }
        const body = (await r.json().catch(() => ({}))) as { alertas?: AlertaApi[]; erro?: string };
        if (!r.ok) throw new Error(body.erro || "Não deu para listar os alertas.");
        if (vivo) setLista(body.alertas ?? []);
      })
      .catch((e: Error) => {
        if (vivo) setErro(e.message);
      });
    return () => {
      vivo = false;
    };
  }, []);

  const criar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setMsg(null);
    const o = origem.toUpperCase();
    const d = destino.toUpperCase();
    if (!/^[A-Z]{3}$/.test(o) || !/^[A-Z]{3}$/.test(d) || !/^\d{4}-\d{2}-\d{2}$/.test(ida)) {
      setErro("Use IATA de 3 letras e data no formato AAAA-MM-DD.");
      return;
    }
    const r = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origem: o, destino: d, ida, preco_alvo: alvo ? Number(alvo) : null }),
    });
    const body = (await r.json().catch(() => ({}))) as { id?: string; erro?: string; detalhe?: string };
    if (r.status === 401) {
      setPrecisaEntrar(true);
      setErro("Entre na conta para criar alerta.");
      return;
    }
    if (!r.ok) {
      setErro(body.detalhe || body.erro || "Não deu para criar o alerta.");
      return;
    }
    setLista((prev) => [{ id: body.id || String(Date.now()), origem: o, destino: d, ida, preco_alvo: alvo ? Number(alvo) : null }, ...prev]);
    setMsg(`Alerta criado para ${o} → ${d}.`);
    setOrigem("");
    setDestino("");
    setIda("");
    setAlvo("");
  };

  return (
    <section className="container-site max-w-[1040px] py-[clamp(2rem,4vw,3.5rem)] pb-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mono-data mb-2.5 text-[12px] uppercase tracking-[0.22em] text-teal-text">Sua conta</p>
          <h1 className="font-display text-[clamp(1.75rem,3.6vw,2.5rem)] font-semibold tracking-tight">Alertas de preço</h1>
        </div>
        <p className="mono-data text-[12px] text-mist-dim">verificamos os preços 4× por dia</p>
      </div>

      {precisaEntrar && (
        <p className="mt-6 rounded-2xl border border-mist/10 bg-[#FBF9F3] px-5 py-4 text-sm text-[#4B5364]">
          Entre para ver e criar alertas. A busca de voos continua sem conta.{" "}
          <Link to="/entrar" className="font-semibold text-teal-text">Entrar →</Link>
        </p>
      )}

      <div className="mt-6 flex flex-col gap-2.5">
        {lista.map((a) => (
          <article key={a.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-mist/10 bg-[#FBF9F3] p-[18px]">
            <div className="min-w-0 flex-1">
              <p className="mono-data text-[15px] font-bold tracking-wide text-mist">{a.origem} → {a.destino}</p>
              <p className="mono-data mt-1 text-[12px] text-mist-dim">ida {a.ida}{a.volta ? ` · volta ${a.volta}` : ""}</p>
              {a.preco_alvo != null && <p className="mono-data mt-1 text-[12px] text-mist-dim">alvo: R$ {a.preco_alvo}</p>}
            </div>
            <Link
              to={`/resultados?origem=${a.origem}&destino=${a.destino}&ida=${a.ida}${a.volta ? `&volta=${a.volta}` : ""}&pax=1`}
              className="inline-flex h-11 items-center rounded-full bg-amber px-4 text-sm font-bold text-night"
            >
              Ver voos
            </Link>
          </article>
        ))}
        {!precisaEntrar && lista.length === 0 && !erro && (
          <p className="rounded-2xl border border-dashed border-mist/20 px-5 py-8 text-sm text-[#4B5364]">
            Nenhum alerta ainda. Crie o primeiro abaixo.
          </p>
        )}
      </div>

      <form onSubmit={criar} className="mt-8 rounded-2xl border border-mist/10 bg-[#FBF9F3] p-5">
        <h2 className="mb-1 font-display text-xl font-semibold">Novo alerta</h2>
        <p className="mb-4 text-sm text-[#4B5364]">Avisamos por e-mail quando a tarifa ficar abaixo do seu alvo.</p>
        <div className="grid gap-3 sm:grid-cols-4">
          <div>
            <label className="mono-data mb-1 block text-[10.5px] uppercase tracking-[0.16em] text-mist-dim">Origem</label>
            <input value={origem} onChange={(e) => setOrigem(e.target.value)} placeholder="GRU" className="h-12 w-full rounded-xl border border-mist/20 bg-ink px-3" />
          </div>
          <div>
            <label className="mono-data mb-1 block text-[10.5px] uppercase tracking-[0.16em] text-mist-dim">Destino</label>
            <input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="NRT" className="h-12 w-full rounded-xl border border-mist/20 bg-ink px-3" />
          </div>
          <div>
            <label className="mono-data mb-1 block text-[10.5px] uppercase tracking-[0.16em] text-mist-dim">Ida</label>
            <input value={ida} onChange={(e) => setIda(e.target.value)} placeholder="2026-10-15" className="h-12 w-full rounded-xl border border-mist/20 bg-ink px-3" />
          </div>
          <div>
            <label className="mono-data mb-1 block text-[10.5px] uppercase tracking-[0.16em] text-mist-dim">Preço alvo</label>
            <input value={alvo} onChange={(e) => setAlvo(e.target.value)} placeholder="4500" className="h-12 w-full rounded-xl border border-mist/20 bg-ink px-3" />
          </div>
        </div>
        <button type="submit" className="mt-4 h-12 rounded-xl bg-amber px-5 font-bold text-night">Criar alerta</button>
        {msg && <p className="mt-3 text-sm text-teal-text">{msg}</p>}
        {erro && <p className="mt-3 text-sm text-ember">{erro}</p>}
      </form>
    </section>
  );
}

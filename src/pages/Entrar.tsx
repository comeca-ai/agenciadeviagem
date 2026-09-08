import { useEffect, useState } from "react";
import { Link } from "react-router";

const BENEFICIOS = [
  { titulo: "Alertas de preço", texto: "Escolha a rota e o preço alvo. Verificamos 4× por dia e avisamos por e-mail." },
  { titulo: "Buscas salvas", texto: "Volte para a mesma rota e datas com um toque, já com o preço atualizado." },
  { titulo: "Histórico de reservas", texto: "Guardamos o link, o localizador e o contato do parceiro de cada compra." },
];

export default function Entrar() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, setPendente] = useState(false);

  useEffect(() => { document.title = "Entrar | Olho de Tandera"; }, []);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    if (!email.includes("@")) { setErro("Informe um e-mail válido."); return; }
    setPendente(true);
    try {
      const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!r.ok) {
        const body = (await r.json().catch(() => ({}))) as { erro?: string };
        throw new Error(body.erro || "Não deu para enviar o link agora.");
      }
      setEnviado(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não deu para enviar o link agora.");
    } finally { setPendente(false); }
  };

  return (
    <section className="container-site max-w-[1040px] py-[clamp(2rem,5vw,4rem)] pb-20">
      <div className="grid items-start gap-8 md:grid-cols-2">
        <form onSubmit={enviar} className="rounded-[20px] border border-mist/10 bg-[#FBF9F3] p-[clamp(1.4rem,3vw,2rem)]">
          <h1 className="mb-2.5 font-display text-[clamp(1.6rem,3vw,2.1rem)] font-semibold tracking-tight">Entrar na sua conta</h1>
          <p className="mb-6 text-[15px] leading-relaxed text-[#4B5364]">Enviamos um link de acesso por e-mail. Sem senha para lembrar.</p>
          <label htmlFor="email" className="mono-data mb-1.5 block text-[10.5px] uppercase tracking-[0.16em] text-[#6B7285]">E-mail</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" className="h-[50px] w-full rounded-xl border border-mist/20 bg-ink px-3.5 text-base outline-none" />
          <button type="submit" disabled={pendente} className="mt-3 h-[52px] w-full rounded-xl bg-amber text-base font-bold text-night disabled:opacity-60">{pendente ? "Enviando…" : "Receber link de acesso"}</button>
          {enviado && <p className="mt-3 text-sm text-teal">Link enviado. Confira a caixa de entrada.</p>}
          {erro && <p className="mt-3 text-sm text-ember">{erro}</p>}
          <p className="mt-5 text-[12.5px] leading-relaxed text-[#6B7285]">Ao entrar você concorda com os termos de uso. Atendimento exclusivo para maiores de 18 anos.</p>
        </form>
        <div>
          <p className="mono-data mb-4 text-[11px] uppercase tracking-[0.18em] text-teal">Buscar não exige conta</p>
          <h2 className="mb-4 max-w-[22ch] font-display text-[clamp(1.4rem,2.4vw,1.75rem)] font-semibold tracking-tight">A conta serve para três coisas</h2>
          <div className="overflow-hidden rounded-2xl border border-mist/10">
            {BENEFICIOS.map((b) => (
              <div key={b.titulo} className="border-t border-mist/10 bg-ink px-5 py-4 first:border-0">
                <p className="mb-1 font-semibold text-mist">{b.titulo}</p>
                <p className="text-sm leading-relaxed text-[#4B5364]">{b.texto}</p>
              </div>
            ))}
          </div>
          <Link to="/#busca" className="mt-4 inline-block text-[14.5px] font-semibold text-teal">Prefiro buscar sem conta →</Link>
        </div>
      </div>
    </section>
  );
}

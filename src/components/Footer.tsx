import { Link, useLocation, useNavigate } from "react-router";
import { goToBusca } from "@/lib/nav";

const NAVEGAR = [
  { label: "Buscar voos", to: "/#busca", hash: true },
  { label: "Destinos", to: "/destinos" },
  { label: "Como funciona", to: "/como-funciona" },
  { label: "Quem é Tandera", to: "/quem-e-tandera" },
];

const DESTINOS = [
  { label: "Fernando de Noronha", to: "/resultados?origem=REC&destino=FEN&ida=2026-06-04&volta=2026-06-11&pax=1" },
  { label: "Lisboa", to: "/resultados?origem=GRU&destino=LIS&ida=2026-05-12&volta=2026-05-24&pax=1" },
  { label: "Tóquio", to: "/resultados?origem=GRU&destino=NRT&ida=2026-09-02&volta=2026-09-18&pax=1" },
  { label: "Cusco", to: "/resultados?origem=CWB&destino=CUZ&ida=2026-09-07&volta=2026-09-15&pax=1" },
];

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <footer className="bg-ink-2">
      <div className="container-site py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3 flex items-center gap-2.5">
              <img src="/assets/logo.svg" alt="" className="h-7 w-7" />
              <span className="font-display text-base font-semibold text-mist">
                Olho <em className="italic text-gold-soft">de Tandera</em>
              </span>
            </div>
            <p className="max-w-[18rem] text-sm leading-relaxed text-[#4B5364]">
              A visão além do alcance. Agência de viagens 100% digital, com voos para o mundo todo.
            </p>
          </div>
          <nav aria-label="Navegar">
            <h3 className="mono-data mb-4 text-[0.7rem] uppercase tracking-[0.2em] text-mist-dim">Navegar</h3>
            <ul className="space-y-2.5">
              {NAVEGAR.map((l) => (
                <li key={l.label}>
                  {l.hash ? (
                    <a href={l.to} onClick={(e) => { e.preventDefault(); goToBusca(location.pathname, navigate); }} className="text-sm text-mist/85 hover:text-teal-text">{l.label}</a>
                  ) : (
                    <Link to={l.to} className="text-sm text-mist/85 hover:text-teal-text">{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Destinos">
            <h3 className="mono-data mb-4 text-[0.7rem] uppercase tracking-[0.2em] text-mist-dim">Destinos</h3>
            <ul className="space-y-2.5">
              {DESTINOS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-mist/85 hover:text-teal-text">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Conta">
            <h3 className="mono-data mb-4 text-[0.7rem] uppercase tracking-[0.2em] text-mist-dim">Conta</h3>
            <ul className="space-y-2.5">
              <li><Link to="/entrar" className="text-sm text-mist/85 hover:text-teal-text">Entrar</Link></li>
              <li><Link to="/conta/alertas" className="text-sm text-mist/85 hover:text-teal-text">Alertas de preço</Link></li>
            </ul>
          </nav>
          <div>
            <h3 className="mono-data mb-4 text-[0.7rem] uppercase tracking-[0.2em] text-mist-dim">Contato</h3>
            <ul className="space-y-2.5 text-sm text-mist/85">
              <li><a href="mailto:ola@olhodetandera.com" className="hover:text-teal-text">ola@olhodetandera.com</a></li>
              <li><a href="https://instagram.com/olhodetandera" target="_blank" rel="noopener noreferrer" className="hover:text-teal-text">@olhodetandera</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 max-w-[70ch] text-[11.5px] leading-relaxed text-[#4B5364]">
          Preços por pessoa, taxas incluídas, sujeitos a alteração sem aviso prévio. A reserva é concluída no site do parceiro. Não cobramos taxa de serviço do viajante. Somos homologados pelos parceiros internacionais de distribuição aérea com quem operamos. Atendimento exclusivo para maiores de 18 anos.
        </p>
        <p className="mt-4 text-[13px] text-mist-dim">© 2026 Olho de Tandera · rodando na borda — Cloudflare</p>
      </div>
    </footer>
  );
}

import { Link, useLocation, useNavigate } from "react-router";
import { goToBusca } from "@/lib/nav";

const NAVEGAR = [
  { label: "Buscar voos", to: "/#busca", hash: true },
  { label: "Destinos", to: "/destinos" },
  { label: "Como funciona", to: "/como-funciona" },
  { label: "A Lenda", to: "/a-lenda" },
];

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <footer className="bg-ink-2">
      <div className="container-site py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3 flex items-center gap-2.5">
              <img src="/assets/logo.svg" alt="" className="h-7 w-7" />
              <span className="font-display text-base font-semibold text-mist">
                Olho <em className="italic text-gold-soft">de Tandera</em>
              </span>
            </div>
            <p className="max-w-[18rem] text-sm leading-relaxed text-[#4B5364]">
              Buscador de passagens 100% digital. A reserva é concluída no site do parceiro.
            </p>
          </div>
          <nav aria-label="Navegar">
            <h3 className="mono-data mb-4 text-[0.7rem] uppercase tracking-[0.2em] text-mist-dim">Navegar</h3>
            <ul className="space-y-2.5">
              {NAVEGAR.map((l) => (
                <li key={l.label}>
                  {l.hash ? (
                    <a href={l.to} onClick={(e) => { e.preventDefault(); goToBusca(location.pathname, navigate); }} className="text-sm text-mist/85 hover:text-teal">{l.label}</a>
                  ) : (
                    <Link to={l.to} className="text-sm text-mist/85 hover:text-teal">{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Conta">
            <h3 className="mono-data mb-4 text-[0.7rem] uppercase tracking-[0.2em] text-mist-dim">Conta</h3>
            <ul className="space-y-2.5">
              <li><Link to="/entrar" className="text-sm text-mist/85 hover:text-teal">Entrar</Link></li>
              <li><Link to="/conta/alertas" className="text-sm text-mist/85 hover:text-teal">Alertas de preço</Link></li>
            </ul>
          </nav>
          <div>
            <h3 className="mono-data mb-4 text-[0.7rem] uppercase tracking-[0.2em] text-mist-dim">Contato</h3>
            <ul className="space-y-2.5 text-sm text-mist/85">
              <li><a href="mailto:ola@olhodetandera.com" className="hover:text-teal">ola@olhodetandera.com</a></li>
              <li><a href="https://instagram.com/olhodetandera" target="_blank" rel="noopener noreferrer" className="hover:text-teal">@olhodetandera</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 max-w-[62ch] text-[13px] leading-relaxed text-[#4B5364]">
          Preços por pessoa, ida e volta, com taxas e impostos. Tarifas mudam sem aviso e são confirmadas no parceiro. Não cobramos taxa de serviço do viajante. Atendimento exclusivo para maiores de 18 anos.
        </p>
        <p className="mt-4 text-[13px] text-mist-dim">© 2026 Olho de Tandera</p>
      </div>
    </footer>
  );
}

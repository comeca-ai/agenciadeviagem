import { Link, useLocation, useNavigate } from "react-router";
import { Instagram, Mail } from "lucide-react";
import { goToBusca } from "@/lib/nav";

const NAVEGAR = [
  { label: "Buscar voos", to: "/#busca", hash: true },
  { label: "Destinos", to: "/destinos" },
  { label: "A Lenda", to: "/a-lenda" },
  { label: "Como Funciona", to: "/como-funciona" },
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
    <footer className="bg-horizon-gradient">
      <div className="container-site py-[clamp(4rem,10vh,7rem)]">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-mist/10 pb-12 md:flex-row md:items-center">
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium italic leading-[1.05] text-mist">
            O horizonte é só o começo.
          </h2>
          <a
            href="/#busca"
            onClick={(e) => {
              e.preventDefault();
              goToBusca(location.pathname, navigate);
            }}
            className="sweep-hover shrink-0 rounded-full bg-amber px-7 py-3.5 font-bold text-night transition-transform duration-250 hover:scale-[1.04] active:scale-[0.97]"
          >
            Abrir o Olho
          </a>
        </div>

        <div className="grid grid-cols-2 gap-10 py-12 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <img src="/assets/logo.svg" alt="" className="h-7 w-7" />
              <span className="font-display text-base font-medium text-mist">
                Olho <em className="italic text-amber">de Tandera</em>
              </span>
            </div>
            <p className="max-w-[16rem] text-sm leading-relaxed text-mist-dim">
              A visão além do alcance. Agência de viagens 100% digital.
            </p>
          </div>

          <nav aria-label="Navegar">
            <h3 className="mono-data mb-4 text-[0.7rem] uppercase tracking-[0.2em] text-mist-dim">
              Navegar
            </h3>
            <ul className="space-y-2.5">
              {NAVEGAR.map((l) => (
                <li key={l.label}>
                  {l.hash ? (
                    <a
                      href={l.to}
                      onClick={(e) => {
                        e.preventDefault();
                        goToBusca(location.pathname, navigate);
                      }}
                      className="text-sm text-mist/85 transition-colors hover:text-amber"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link to={l.to} className="text-sm text-mist/85 transition-colors hover:text-amber">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Destinos">
            <h3 className="mono-data mb-4 text-[0.7rem] uppercase tracking-[0.2em] text-mist-dim">
              Destinos
            </h3>
            <ul className="space-y-2.5">
              {DESTINOS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-mist/85 transition-colors hover:text-amber">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mono-data mb-4 text-[0.7rem] uppercase tracking-[0.2em] text-mist-dim">
              Contato
            </h3>
            <ul className="space-y-2.5 text-sm text-mist/85">
              <li>
                <a
                  href="mailto:ola@olhodetandera.com"
                  className="inline-flex items-center gap-2 transition-colors hover:text-amber"
                >
                  <Mail size={14} className="text-teal" /> ola@olhodetandera.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/olhodetandera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-amber"
                >
                  <Instagram size={14} className="text-teal" /> @olhodetandera
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mono-data space-y-1.5 border-t border-mist/10 pt-8 text-[0.8rem] text-mist-dim">
          <p>Preços por pessoa, taxas incluídas, sujeitos a alteração sem aviso prévio.</p>
          <p>A reserva é concluída no site do parceiro. O Olho de Tandera enxerga — quem voa é você.</p>
          <p>Atendimento exclusivo para maiores de 18 anos.</p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 text-[0.8rem] text-mist-dim md:flex-row md:items-center">
          <p>© 2025 Olho de Tandera · olhodetandera.com</p>
          <p className="mono-data text-[0.7rem] text-teal/80">Rodando na borda — Cloudflare</p>
        </div>
      </div>
    </footer>
  );
}

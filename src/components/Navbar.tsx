import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { goToBusca } from "@/lib/nav";

const PRIMARY = [
  { label: "Buscar", to: "/#busca", hash: true },
  { label: "Destinos", to: "/destinos" },
  { label: "Como funciona", to: "/como-funciona" },
];

const SECONDARY = [
  { label: "Quem é Tandera", to: "/quem-e-tandera" },
  { label: "Alertas", to: "/conta/alertas" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    if (open) setOpen(false);
  }

  const handleBusca = (e: React.MouseEvent) => {
    e.preventDefault();
    goToBusca(location.pathname, navigate);
  };

  const linkClass = (isActive: boolean) =>
    cn(
      "whitespace-nowrap text-[0.9rem] font-medium text-mist/80 transition-colors hover:text-mist",
      isActive && "text-mist",
    );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-mist/10 bg-[rgba(245,242,234,0.92)] backdrop-blur-[14px]">
        <div className="container-site flex min-h-16 flex-wrap items-center gap-3 py-2.5">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Olho de Tandera — início">
            <img src="/assets/logo.svg" alt="" className="h-7 w-7" />
            <span className="whitespace-nowrap font-display text-[1.15rem] font-semibold tracking-tight text-mist">
              Olho <em className="italic text-gold-soft">de Tandera</em>
            </span>
          </Link>

          <nav className="ml-2 hidden items-center gap-6 min-[1000px]:flex" aria-label="Navegação principal">
            {PRIMARY.map((link) =>
              link.hash ? (
                <a key={link.label} href="/#busca" onClick={handleBusca} className={linkClass(false)}>
                  {link.label}
                </a>
              ) : (
                <NavLink key={link.label} to={link.to} className={({ isActive }) => linkClass(isActive)}>
                  {link.label}
                </NavLink>
              ),
            )}
            {SECONDARY.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) => cn(linkClass(isActive), "hidden min-[1180px]:inline")}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/entrar"
              className="hidden h-11 items-center rounded-full px-3 text-[0.9rem] font-semibold text-mist min-[1000px]:inline-flex"
            >
              Entrar
            </Link>
            <a
              href="/#busca"
              onClick={handleBusca}
              className="hidden h-11 items-center rounded-full bg-amber px-[18px] text-[0.9rem] font-bold text-night min-[1000px]:inline-flex"
            >
              Buscar voos
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 min-[1000px]:hidden"
            >
              <span className={cn("h-px w-6 bg-mist transition-all", open && "translate-y-[3.5px] rotate-45")} />
              <span className={cn("h-px w-6 bg-mist transition-all", open && "-translate-y-[3.5px] -rotate-45")} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-ink min-[1000px]:hidden"
          >
            {[...PRIMARY, ...SECONDARY, { label: "Entrar", to: "/entrar" }].map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * i }}
              >
                {"hash" in link && link.hash ? (
                  <a href="/#busca" onClick={handleBusca} className="font-display text-4xl font-medium text-mist">
                    {link.label}
                  </a>
                ) : (
                  <Link to={link.to} className="font-display text-4xl font-medium text-mist">
                    {link.label}
                  </Link>
                )}
              </motion.div>
            ))}
            <a href="/#busca" onClick={handleBusca} className="mt-2 rounded-full bg-amber px-7 py-3 font-bold text-night">
              Buscar voos
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

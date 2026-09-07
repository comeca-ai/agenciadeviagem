import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { goToBusca } from "@/lib/nav";

const LINKS = [
  { label: "Buscar", to: "/#busca", hash: true },
  { label: "Destinos", to: "/destinos" },
  { label: "A Lenda", to: "/a-lenda" },
  { label: "Como Funciona", to: "/como-funciona" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 40,
  );
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleBusca = (e: React.MouseEvent) => {
    e.preventDefault();
    goToBusca(location.pathname, navigate);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 h-[4.5rem] w-full transition-[background-color,backdrop-filter,border-color] duration-350",
          scrolled || open
            ? "border-b border-mist/10 bg-[rgba(245,242,234,0.86)] backdrop-blur-[16px]"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-site flex h-full items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-3" aria-label="Olho de Tandera — início">
            <img
              src="/assets/logo.svg"
              alt=""
              className="h-8 w-8 transition-transform duration-800 group-hover:rotate-180"
              style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
            />
            <span className="font-display text-[1.15rem] font-medium text-mist">
              Olho <em className="italic text-amber">de Tandera</em>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
            {LINKS.map((link) =>
              link.hash ? (
                <a
                  key={link.label}
                  href="/#busca"
                  onClick={handleBusca}
                  className="group relative text-[0.9rem] font-medium text-mist/85 transition-colors hover:text-mist"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-amber transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "group relative text-[0.9rem] font-medium text-mist/85 transition-colors hover:text-mist",
                      isActive && "text-mist",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute -top-2.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-amber" />
                      )}
                      {link.label}
                      <span
                        className={cn(
                          "absolute -bottom-1 left-0 h-px w-full origin-left bg-amber transition-transform duration-300",
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </>
                  )}
                </NavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/#busca"
              onClick={handleBusca}
              className="sweep-hover hidden rounded-full bg-amber px-5 py-2.5 text-[0.9rem] font-bold text-night transition-transform duration-250 hover:scale-[1.04] active:scale-[0.97] md:inline-block"
            >
              Buscar voos
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            >
              <span
                className={cn(
                  "h-px w-6 bg-mist transition-all duration-300",
                  open && "translate-y-[3.5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "h-px w-6 bg-mist transition-all duration-300",
                  open && "-translate-y-[3.5px] -rotate-45",
                )}
              />
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-ink md:hidden"
          >
            <img
              src="/assets/logo.svg"
              alt=""
              className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-[0.12] blur-[120px]"
            />
            {LINKS.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.07 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {link.hash ? (
                  <a
                    href="/#busca"
                    onClick={handleBusca}
                    className="font-display text-[clamp(2.5rem,10vw,4rem)] font-medium text-mist"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.to}
                    className="font-display text-[clamp(2.5rem,10vw,4rem)] font-medium text-mist"
                  >
                    {link.label}
                  </Link>
                )}
              </motion.div>
            ))}
            <motion.a
              href="/#busca"
              onClick={handleBusca}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.07 * LINKS.length, duration: 0.5 }}
              className="mt-4 rounded-full bg-amber px-7 py-3 font-bold text-night"
            >
              Buscar voos
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

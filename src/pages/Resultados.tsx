import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ListFilter } from "lucide-react";
import { buildSearchUrl, parseSearchParams, type SearchParams } from "@/lib/search";
import { goToBusca } from "@/lib/nav";
import {
  demoBuscaResponse,
  type BuscaResponse,
  type Oferta,
} from "@/data/demo-ofertas";
import ScanningOverlay from "@/components/resultados/ScanningOverlay";
import RouteBar from "@/components/resultados/RouteBar";
import InsightBanner from "@/components/resultados/InsightBanner";
import FiltrosPanel, {
  contarFiltrosAtivos,
  FILTROS_INICIAIS,
  type Filtros,
} from "@/components/resultados/FiltrosPanel";
import FlightCard from "@/components/resultados/FlightCard";
import ExitModal from "@/components/resultados/ExitModal";
import EmptyState from "@/components/resultados/EmptyState";
import EditDrawer from "@/components/resultados/EditDrawer";
import { faixaHorario } from "@/components/resultados/format";

/** Rota demo padrão quando a URL não traz parâmetros válidos. */
const ROTA_PADRAO: SearchParams = {
  origem: "GRU",
  destino: "LIS",
  ida: "2026-05-12",
  volta: "2026-05-24",
  pax: 1,
};

function addDias(iso: string, dias: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

export default function Resultados() {
  const [sp] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => parseSearchParams(sp) ?? ROTA_PADRAO, [sp]);
  const paramsKey = sp.toString();

  const [fase, setFase] = useState<"scan" | "done">("scan");
  const [resposta, setResposta] = useState<BuscaResponse | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [saida, setSaida] = useState<Oferta | null>(null);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS);
  const primeiraVarredura = useRef(true);

  // SEO: título dinâmico por rota
  useEffect(() => {
    const anterior = document.title;
    document.title = `${params.origem} → ${params.destino} — O que o Olho viu | Olho de Tandera`;
    return () => {
      document.title = anterior;
    };
  }, [params.origem, params.destino]);

  // Busca real com fallback silencioso para os dados de demonstração
  useEffect(() => {
    let vivo = true;
    setFase("scan");
    setEditOpen(false);
    setSheetOpen(false);

    const minMs = primeiraVarredura.current ? 1600 : 1000;
    primeiraVarredura.current = false;
    const t0 = performance.now();

    const q = new URLSearchParams({
      origem: params.origem,
      destino: params.destino,
      ida: params.ida,
      pax: String(params.pax),
    });
    if (params.volta) q.set("volta", params.volta);

    const demo = () =>
      demoBuscaResponse({
        origem: params.origem,
        destino: params.destino,
        ida: params.ida,
        volta: params.volta ?? null,
        pax: params.pax,
      });

    fetch(`/api/busca?${q.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<BuscaResponse>;
      })
      .then((d) => ({ d, demo: false }))
      .catch(() => ({ d: demo(), demo: true }))
      .then(({ d, demo: ehDemo }) => {
        const espera = Math.max(0, minMs - (performance.now() - t0));
        setTimeout(() => {
          if (!vivo) return;
          setResposta(d);
          setIsDemo(ehDemo);
          setFase("done");
        }, espera);
      });

    return () => {
      vivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  // Aplica filtros + ordenação (FLIP via layout no FlightCard)
  const visiveis = useMemo(() => {
    if (!resposta) return [];
    const list = resposta.ofertas.filter((o) => {
      const esc = o.escalas == null ? 1 : Math.min(o.escalas, 2);
      if (!filtros.escalas.includes(esc)) return false;
      if (o.preco > filtros.precoMax) return false;
      if (filtros.horarios.length > 0 && !filtros.horarios.includes(faixaHorario(o.partida)))
        return false;
      return true;
    });
    if (filtros.ordem === "preco") list.sort((a, b) => a.preco - b.preco);
    else if (filtros.ordem === "rapido")
      list.sort((a, b) => (a.duracao_min ?? Infinity) - (b.duracao_min ?? Infinity));
    return list;
  }, [resposta, filtros]);

  // Selos: 1º da lista é a Escolha do Olho; o mais barato leva "Menor preço"
  // (vale para dados reais e demo — o gerador demo já devolve a escolha em 1º)
  const badgeDe = (o: Oferta): "Escolha do Olho" | "Menor preço" | undefined => {
    if (!resposta || resposta.ofertas.length === 0) return undefined;
    if (resposta.ofertas[0].id === o.id) return "Escolha do Olho";
    const menor = resposta.ofertas.reduce((a, b) => (b.preco < a.preco ? b : a));
    return menor.id === o.id ? "Menor preço" : undefined;
  };

  const ativos = contarFiltrosAtivos(filtros);

  const sugestoes: { label: string; url: string }[] = [
    {
      label: "Tente ±3 dias",
      url: buildSearchUrl({
        ...params,
        ida: addDias(params.ida, -3),
        volta: params.volta ? addDias(params.volta, -3) : undefined,
      }),
    },
    {
      label: "Aeroportos vizinhos (VCP)",
      url: buildSearchUrl({ ...params, origem: "VCP" }),
    },
    {
      label: "Só ida",
      url: buildSearchUrl({ ...params, volta: undefined }),
    },
  ];

  return (
    <>
      <AnimatePresence>{fase === "scan" && <ScanningOverlay />}</AnimatePresence>

      <RouteBar params={params} isDemo={isDemo} ativo={fase === "done"} onEditar={() => setEditOpen(true)} />

      <div className="container-site flex flex-col gap-10 py-[clamp(3rem,8vh,5rem)]">
        <InsightBanner />

        {/* Filtros + lista */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
          {/* Painel desktop (sticky) */}
          <aside className="hidden lg:block">
            <div className="sticky top-[9.5rem]">
              <FiltrosPanel filtros={filtros} onChange={setFiltros} />
            </div>
          </aside>

          {/* Lista */}
          <div className="min-w-0">
            <div className="mono-data mb-5 flex items-center gap-2 text-[0.8rem] text-mist-dim">
              <motion.span
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-1.5 w-1.5 rounded-full bg-teal"
                aria-hidden="true"
              />
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={visiveis.length}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="inline-block"
                >
                  {visiveis.length}
                </motion.span>
              </AnimatePresence>
              <span>
                {visiveis.length === 1 ? "oferta vista" : "ofertas vistas"} pelo Olho · atualizado
                agora
              </span>
            </div>

            {visiveis.length === 0 && fase === "done" ? (
              <EmptyState onLimpar={() => setFiltros({ ...FILTROS_INICIAIS })} />
            ) : (
              <div className="flex flex-col gap-5">
                <AnimatePresence>
                  {visiveis.map((o, i) => (
                    <FlightCard
                      key={o.id}
                      oferta={o}
                      badge={badgeDe(o)}
                      index={i}
                      onReservar={setSaida}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção 4 — banda de re-busca */}
      <section className="bg-ink-2">
        <div className="container-site flex flex-col items-center gap-7 py-[clamp(4rem,10vh,6rem)] text-center">
          <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.9rem)] font-medium text-mist">
            O Olho só precisa de <em className="italic text-amber">outro ângulo.</em>
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {sugestoes.map((s, i) => (
              <motion.button
                key={s.label}
                type="button"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                onClick={() => navigate(s.url)}
                className="rounded-full border border-[rgba(237,235,228,0.2)] px-5 py-2.5 text-[0.85rem] font-medium text-mist transition-colors hover:border-[rgba(240,168,50,0.55)] hover:bg-[rgba(240,168,50,0.08)]"
              >
                {s.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Seção 5 — compliance + CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6 }}
        className="container-site flex flex-col items-center gap-8 py-[clamp(4rem,10vh,6rem)] text-center"
      >
        <p className="mono-data max-w-[44rem] text-[0.8rem] leading-relaxed text-mist-dim">
          Os preços exibidos são finais por pessoa, com taxas incluídas, e{" "}
          <strong className="text-mist">sujeitos a alteração</strong> até a conclusão da reserva.
          A reserva e o pagamento acontecem no site do parceiro. O Olho de Tandera é o vigia — a
          viagem é sua. Atendimento exclusivo para maiores de 18 anos.
        </p>
        <a
          href="/#busca"
          onClick={(e) => {
            e.preventDefault();
            goToBusca(location.pathname, navigate);
          }}
          className="sweep-hover rounded-full bg-amber px-7 py-3.5 font-bold text-night transition-transform duration-250 hover:scale-[1.04] active:scale-[0.97]"
        >
          Nova busca
        </a>
      </motion.section>

      {/* Botão flutuante de filtros (mobile) */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[rgba(240,168,50,0.4)] bg-ink-3 px-5 py-3 text-[0.85rem] font-bold text-mist shadow-[0_0_30px_rgba(6,8,15,0.6)] lg:hidden"
      >
        <ListFilter size={16} className="text-amber" />
        Filtros
        {ativos > 0 && (
          <span className="mono-data flex h-5 w-5 items-center justify-center rounded-full bg-amber text-[0.65rem] font-bold text-night">
            {ativos}
          </span>
        )}
      </button>

      {/* Bottom-sheet de filtros (mobile) */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[rgba(245,242,234,0.7)] backdrop-blur-[8px] lg:hidden"
            onClick={() => setSheetOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto rounded-t-[1.75rem] bg-ink p-4 pb-8 scroller-thin"
            >
              <FiltrosPanel filtros={filtros} onChange={setFiltros} />
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="sweep-hover mt-4 w-full rounded-full bg-amber px-5 py-3 text-[0.9rem] font-bold text-night"
              >
                Ver {visiveis.length} {visiveis.length === 1 ? "oferta" : "ofertas"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer de edição de busca */}
      <AnimatePresence>
        {editOpen && <EditDrawer params={params} onClose={() => setEditOpen(false)} />}
      </AnimatePresence>

      {/* Modal de saída para o parceiro */}
      <AnimatePresence>
        {saida && <ExitModal oferta={saida} onClose={() => setSaida(null)} />}
      </AnimatePresence>
    </>
  );
}

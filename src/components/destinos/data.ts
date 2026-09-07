/** Dados demo da página Destinos — "O que o Olho encontrou". */

export type Perfil =
  | "Todos"
  | "LatAm"
  | "Praia"
  | "Cidade"
  | "Aventura"
  | "Cultura"
  | "Só Brasil"
  | "Internacional";

export const PERFIS: Perfil[] = [
  "Todos",
  "LatAm",
  "Praia",
  "Cidade",
  "Aventura",
  "Cultura",
  "Só Brasil",
  "Internacional",
];

export interface Destino {
  nome: string;
  imagem: string;
  /** Rota de origem mais comum (IATA → IATA) */
  rota: { origem: string; destino: string };
  /** Menor preço visto (BRL, por pessoa, ida e volta) */
  preco: number;
  tags: Exclude<Perfil, "Todos">[];
  frase: string;
  /** Link pré-preenchido para /resultados */
  url: string;
}

const resultadosUrl = (
  origem: string,
  destino: string,
  ida: string,
  volta: string,
) =>
  `/resultados?origem=${origem}&destino=${destino}&ida=${ida}&volta=${volta}&pax=1`;

export const DESTAQUE_NORONHA = {
  nome: "Fernando de Noronha",
  imagem: "/assets/dest-noronha.jpg",
  rota: { origem: "REC", destino: "FEN" },
  preco: 1284,
  precoInicial: 900,
  frase: "O mar mais verde que este vigia já pôs os olhos.",
  url: resultadosUrl("REC", "FEN", "2026-06-04", "2026-06-11"),
};

export const DESTINOS: Destino[] = [
  {
    nome: "Rio de Janeiro",
    imagem: "/assets/dest-rio.jpg",
    rota: { origem: "GRU", destino: "SDU" },
    preco: 312,
    tags: ["LatAm", "Praia", "Só Brasil"],
    frase: "A curva mais famosa do mundo, vista de cima.",
    url: resultadosUrl("GRU", "SDU", "2026-04-10", "2026-04-14"),
  },
  {
    nome: "Lisboa",
    imagem: "/assets/dest-lisboa.jpg",
    rota: { origem: "GRU", destino: "LIS" },
    preco: 2987,
    tags: ["Cidade", "Cultura", "Internacional"],
    frase: "Sete colinas e um elétrico amarelo — o vigia aprovou.",
    url: resultadosUrl("GRU", "LIS", "2026-05-12", "2026-05-24"),
  },
  {
    nome: "Tóquio",
    imagem: "/assets/dest-toquio.jpg",
    rota: { origem: "GRU", destino: "NRT" },
    preco: 5890,
    tags: ["Cidade", "Cultura", "Internacional"],
    frase: "Neon até onde o olho alcança. E além.",
    url: resultadosUrl("GRU", "NRT", "2026-09-02", "2026-09-18"),
  },
  {
    nome: "Patagônia (El Calafate)",
    imagem: "/assets/dest-patagonia.jpg",
    rota: { origem: "GRU", destino: "FTE" },
    preco: 2640,
    tags: ["LatAm", "Aventura", "Internacional"],
    frase: "Gelo que range há 20 mil anos. Ouça de perto.",
    url: resultadosUrl("GRU", "FTE", "2026-11-06", "2026-11-16"),
  },
  {
    nome: "Marrakech",
    imagem: "/assets/dest-marrakech.jpg",
    rota: { origem: "GRU", destino: "RAK" },
    preco: 4120,
    tags: ["Cultura", "Aventura", "Internacional"],
    frase: "A praça acende quando o sol apaga.",
    url: resultadosUrl("GRU", "RAK", "2026-10-01", "2026-10-11"),
  },
  {
    nome: "Nova York",
    imagem: "/assets/dest-novayork.jpg",
    rota: { origem: "GRU", destino: "JFK" },
    preco: 3780,
    tags: ["Cidade", "Internacional"],
    frase: "A cidade que não dorme, vista por quem não pisca.",
    url: resultadosUrl("GRU", "JFK", "2026-08-19", "2026-08-27"),
  },
  {
    nome: "Cusco & Machu Picchu",
    imagem: "/assets/dest-cusco.jpg",
    rota: { origem: "CWB", destino: "CUZ" },
    preco: 2150,
    tags: ["LatAm", "Aventura", "Cultura", "Internacional"],
    frase: "Ruínas acima das nuvens. O vigia viu primeiro.",
    url: resultadosUrl("CWB", "CUZ", "2026-09-07", "2026-09-15"),
  },
];

export const HUBS_BR_REFERENCIA = ["GRU", "GIG", "BSB", "CNF", "REC"] as const;

const origensUnicas = new Set([
  DESTAQUE_NORONHA.rota.origem,
  ...DESTINOS.map((destino) => destino.rota.origem),
]);

/** Hubs brasileiros disponíveis no catálogo atual de Destinos. */
export const HUBS_BR_DISPONIVEIS = HUBS_BR_REFERENCIA.filter((hub) =>
  origensUnicas.has(hub),
);

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formata preço demo: "R$ 1.284". */
export function formatPreco(valor: number): string {
  return brl.format(valor);
}

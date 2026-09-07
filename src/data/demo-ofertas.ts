/**
 * Dados de demonstração da página de Resultados (GRU → LIS, 12–24 mai, 1 adulto).
 *
 * Shape idêntico à resposta de GET /api/busca (functions/api/busca.js):
 *   { fonte, rota, total, ofertas[], aviso }
 * Campos extras opcionais (`chegada`, `via`) existem só nos dados demo para
 * exibição fiel dos horários/escalas; a UI degrada graciosamente quando a API
 * real não os envia (horário de chegada estimado por partida + duração).
 */

export interface Oferta {
  id: string;
  preco: number;
  moeda: string;
  /** Código IATA da companhia (ex.: "TP") */
  cia: string;
  numero_voo: number | string;
  origem: string;
  destino: string;
  /** ISO local de partida (YYYY-MM-DDTHH:mm:ss) */
  partida: string;
  volta_em: string | null;
  escalas: number | null;
  escalas_volta?: number | null;
  duracao_min: number | null;
  duracao_volta_min?: number | null;
  link_reserva: string;
  expira_em: string | null;
  /** demo-only: ISO local de chegada (quando a API não informa) */
  chegada?: string | null;
  /** demo-only: cidade da escala (ex.: "Madri") */
  via?: string | null;
}

export interface BuscaResponse {
  fonte: string;
  rota: {
    origem: string;
    destino: string;
    ida: string;
    volta: string | null;
    pax: number;
  };
  total: number;
  ofertas: Oferta[];
  aviso: string;
}

/** Nomes por extenso das companhias (a API real envia apenas o código IATA). */
export const CIA_NOMES: Record<string, string> = {
  TP: "TAP Air Portugal",
  UX: "Air Europa",
  AD: "Azul",
  IB: "Iberia",
  AZ: "ITA Airways",
  KL: "KLM",
  LA: "LATAM",
  LH: "Lufthansa",
};

export const AVISO_COMPLIANCE =
  "Preço por pessoa, taxas incluídas, sujeito a alteração sem aviso prévio. A reserva é concluída no site do parceiro.";

const expira = (horas: number) => new Date(Date.now() + horas * 3600_000).toISOString();

/** Link de afiliado demo no formato de busca da Aviasales: /search/GRU1205LIS1 */
function linkDemo(origem: string, ida: string, destino: string): string {
  const dd = ida.slice(8, 10);
  const mm = ida.slice(5, 7);
  return `https://www.aviasales.com/search/${origem}${dd}${mm}${destino}1`;
}

const IDA = "2026-05-12";
const VOLTA = "2026-05-24";

export const DEMO_OFERTAS: Oferta[] = [
  {
    id: "demo-1",
    preco: 3412,
    moeda: "BRL",
    cia: "TP",
    numero_voo: 58,
    origem: "GRU",
    destino: "LIS",
    partida: `${IDA}T21:50:00`,
    chegada: "2026-05-13T11:35:00",
    volta_em: `${VOLTA}T14:30:00`,
    escalas: 0,
    duracao_min: 585,
    link_reserva: linkDemo("GRU", IDA, "LIS"),
    expira_em: expira(2),
    via: null,
  },
  {
    id: "demo-2",
    preco: 2987,
    moeda: "BRL",
    cia: "UX",
    numero_voo: 116,
    origem: "GRU",
    destino: "LIS",
    partida: `${IDA}T15:05:00`,
    chegada: "2026-05-13T09:20:00",
    volta_em: `${VOLTA}T11:40:00`,
    escalas: 1,
    duracao_min: 855,
    link_reserva: linkDemo("GRU", IDA, "LIS"),
    expira_em: expira(2),
    via: "Madri",
  },
  {
    id: "demo-3",
    preco: 3198,
    moeda: "BRL",
    cia: "AD",
    numero_voo: 8710,
    origem: "VCP",
    destino: "LIS",
    partida: `${IDA}T19:30:00`,
    chegada: "2026-05-13T11:10:00",
    volta_em: `${VOLTA}T09:15:00`,
    escalas: 0,
    duracao_min: 580,
    link_reserva: linkDemo("VCP", IDA, "LIS"),
    expira_em: expira(3),
    via: null,
  },
  {
    id: "demo-4",
    preco: 3145,
    moeda: "BRL",
    cia: "IB",
    numero_voo: 6826,
    origem: "GRU",
    destino: "LIS",
    partida: `${IDA}T13:40:00`,
    chegada: "2026-05-13T07:05:00",
    volta_em: `${VOLTA}T16:20:00`,
    escalas: 1,
    duracao_min: 805,
    link_reserva: linkDemo("GRU", IDA, "LIS"),
    expira_em: expira(2),
    via: "Madri",
  },
  {
    id: "demo-5",
    preco: 3274,
    moeda: "BRL",
    cia: "AZ",
    numero_voo: 673,
    origem: "GRU",
    destino: "LIS",
    partida: `${IDA}T16:20:00`,
    chegada: "2026-05-13T11:50:00",
    volta_em: `${VOLTA}T13:05:00`,
    escalas: 1,
    duracao_min: 930,
    link_reserva: linkDemo("GRU", IDA, "LIS"),
    expira_em: expira(4),
    via: "Roma",
  },
  {
    id: "demo-6",
    preco: 3356,
    moeda: "BRL",
    cia: "KL",
    numero_voo: 792,
    origem: "GRU",
    destino: "LIS",
    partida: `${IDA}T20:15:00`,
    chegada: "2026-05-13T16:20:00",
    volta_em: `${VOLTA}T10:35:00`,
    escalas: 1,
    duracao_min: 965,
    link_reserva: linkDemo("GRU", IDA, "LIS"),
    expira_em: expira(3),
    via: "Amsterdã",
  },
  {
    id: "demo-7",
    preco: 3589,
    moeda: "BRL",
    cia: "LA",
    numero_voo: 8184,
    origem: "GRU",
    destino: "LIS",
    partida: `${IDA}T23:05:00`,
    chegada: "2026-05-13T15:00:00",
    volta_em: `${VOLTA}T21:45:00`,
    escalas: 0,
    duracao_min: 595,
    link_reserva: linkDemo("GRU", IDA, "LIS"),
    expira_em: expira(1),
    via: null,
  },
  {
    id: "demo-8",
    preco: 3502,
    moeda: "BRL",
    cia: "LH",
    numero_voo: 507,
    origem: "GRU",
    destino: "LIS",
    partida: `${IDA}T18:10:00`,
    chegada: "2026-05-13T14:05:00",
    volta_em: `${VOLTA}T18:25:00`,
    escalas: 1,
    duracao_min: 955,
    link_reserva: linkDemo("GRU", IDA, "LIS"),
    expira_em: expira(2),
    via: "Frankfurt",
  },
];

/** Badges demo por id de oferta (a API real não envia selos). */
export const DEMO_BADGES: Record<string, "Escolha do Olho" | "Menor preço"> = {
  "demo-1": "Escolha do Olho",
  "demo-2": "Menor preço",
};

/** Resposta demo completa, no shape da API. */
export function demoBuscaResponse(
  rota: BuscaResponse["rota"] = {
    origem: "GRU",
    destino: "LIS",
    ida: IDA,
    volta: VOLTA,
    pax: 1,
  },
): BuscaResponse {
  return {
    fonte: "demo",
    rota,
    total: DEMO_OFERTAS.length,
    ofertas: DEMO_OFERTAS,
    aviso: AVISO_COMPLIANCE,
  };
}

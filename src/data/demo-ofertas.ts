/**
 * Dados de demonstração da página de Resultados.
 *
 * As ofertas demo são GERADAS a partir da rota pesquisada (origem, destino,
 * datas, pax) — nunca uma lista fixa. A geração é determinística (seed = rota),
 * então a mesma busca sempre mostra as mesmas ofertas, e rotas diferentes
 * mostram companhias, horários, escalas e preços plausíveis para aquele par.
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
  // Brasil
  G3: "GOL",
  LA: "LATAM",
  AD: "Azul",
  // América do Sul
  AR: "Aerolíneas Argentinas",
  AV: "Avianca",
  CM: "Copa Airlines",
  H2: "Sky Airline",
  JA: "JetSmart",
  // América do Norte
  AA: "American Airlines",
  UA: "United",
  DL: "Delta",
  AC: "Air Canada",
  AM: "Aeroméxico",
  B6: "JetBlue",
  // Europa
  TP: "TAP Air Portugal",
  UX: "Air Europa",
  IB: "Iberia",
  AZ: "ITA Airways",
  KL: "KLM",
  LH: "Lufthansa",
  AF: "Air France",
  BA: "British Airways",
  LX: "Swiss",
  // Longo curso (Oriente Médio / África)
  EK: "Emirates",
  TK: "Turkish Airlines",
  QR: "Qatar Airways",
  ET: "Ethiopian",
};

export const AVISO_COMPLIANCE =
  "Preço por pessoa, taxas incluídas, sujeito a alteração sem aviso prévio. A reserva é concluída no site do parceiro.";

/* -------------------------------------------------------------------------- */
/* Regiões e hubs                                                              */
/* -------------------------------------------------------------------------- */

type Regiao = "BR" | "SA" | "CAR" | "NA" | "EU" | "LH";

const BR = new Set([
  "GRU", "CGH", "VCP", "SDU", "GIG", "POA", "CWB", "FLN", "NVT", "JOI",
  "CNF", "PLU", "BSB", "GYN", "CGR", "VIX", "SSA", "REC", "FOR", "NAT",
  "MCZ", "AJU", "JPA", "BEL", "MAO", "CGB", "IGU", "PVH", "RBR", "BVB",
  "PMW", "THE", "SLZ", "FEN",
]);

const SA = new Set([
  "SCL", "EZE", "AEP", "MVD", "LIM", "BOG", "UIO", "GYE", "ASU", "LPB",
  "VVI", "CUZ", "IQT", "CCS", "GEO", "PBM", "CAY",
]);

const CAR = new Set([
  "CUN", "PUJ", "HAV", "SJU", "PTY", "SJO", "MBJ", "NAS", "AUA", "CUR",
  "SDQ", "POS", "BGI", "SXM", "GCM", "PLS",
]);

const NA = new Set([
  "MIA", "MCO", "JFK", "EWR", "LGA", "LAX", "ATL", "DFW", "ORD", "IAH",
  "SFO", "BOS", "IAD", "CLT", "PHL", "SEA", "DTW", "MSP", "YYZ", "YUL",
  "YVR", "MEX", "GDL", "MTY",
]);

const EU = new Set([
  "LIS", "OPO", "MAD", "BCN", "CDG", "ORY", "FCO", "MXP", "AMS", "FRA",
  "MUC", "LHR", "LGW", "ZRH", "DUB", "VIE", "BRU", "GVA", "ATH", "CPH",
  "OSL", "ARN", "MAD",
]);

function regiao(iata: string): Regiao {
  if (BR.has(iata)) return "BR";
  if (SA.has(iata)) return "SA";
  if (CAR.has(iata)) return "CAR";
  if (NA.has(iata)) return "NA";
  if (EU.has(iata)) return "EU";
  return "LH";
}

/** Nome da cidade do aeroporto para o campo `via` (escala). */
const CIDADE: Record<string, string> = {
  GRU: "São Paulo", CGH: "São Paulo", VCP: "Campinas", GIG: "Rio de Janeiro",
  SDU: "Rio de Janeiro", CNF: "Confins", BSB: "Brasília", REC: "Recife",
  FOR: "Fortaleza", SSA: "Salvador",
  LIS: "Lisboa", MAD: "Madri", CDG: "Paris", AMS: "Amsterdã", FRA: "Frankfurt",
  FCO: "Roma", ZRH: "Zurique", LHR: "Londres", MXP: "Milão", BCN: "Barcelona",
  MIA: "Miami", JFK: "Nova York", EWR: "Nova York", IAH: "Houston",
  ATL: "Atlanta", DFW: "Dallas", MEX: "Cidade do México", YYZ: "Toronto",
  PTY: "Panamá", BOG: "Bogotá", SCL: "Santiago", LIM: "Lima",
  EZE: "Buenos Aires", MVD: "Montevidéu", DXB: "Dubai", IST: "Istambul",
  DOH: "Doha", ADD: "Adis Abeba",
};

/** Origens brasileiras com voos internacionais diretos plausíveis. */
const HUB_INTL_BR = new Set(["GRU", "GIG", "VCP", "REC", "FOR", "SSA", "BSB"]);

/* -------------------------------------------------------------------------- */
/* RNG determinístico por rota (FNV-1a + mulberry32)                           */
/* -------------------------------------------------------------------------- */

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* -------------------------------------------------------------------------- */
/* Perfil da rota: duração, preço e companhias plausíveis                      */
/* -------------------------------------------------------------------------- */

interface PerfilRota {
  /** duração base do voo direto, em minutos */
  durBase: number;
  /** variação aleatória da duração (±) */
  durVar: number;
  /** preço base por pessoa, em BRL */
  precoBase: number;
  /** amplitude de variação do preço */
  precoVar: number;
}

function perfilRota(ro: Regiao, rd: Regiao): PerfilRota {
  const par = [ro, rd].sort().join("-");
  switch (par) {
    case "BR-BR":
      return { durBase: 100, durVar: 35, precoBase: 620, precoVar: 320 };
    case "BR-SA":
    case "SA-SA":
      return { durBase: 260, durVar: 60, precoBase: 1900, precoVar: 800 };
    case "BR-CAR":
    case "CAR-SA":
      return { durBase: 330, durVar: 60, precoBase: 2300, precoVar: 800 };
    case "BR-NA":
    case "NA-SA":
      return { durBase: 540, durVar: 60, precoBase: 3300, precoVar: 1000 };
    case "BR-EU":
    case "EU-SA":
      return { durBase: 600, durVar: 60, precoBase: 3600, precoVar: 1100 };
    case "CAR-NA":
      return { durBase: 210, durVar: 45, precoBase: 1800, precoVar: 600 };
    case "NA-NA":
      return { durBase: 180, durVar: 60, precoBase: 1500, precoVar: 700 };
    case "EU-EU":
      return { durBase: 150, durVar: 40, precoBase: 1100, precoVar: 500 };
    case "EU-NA":
      return { durBase: 480, durVar: 50, precoBase: 3900, precoVar: 1200 };
    default:
      // qualquer par envolvendo longo curso (Ásia, Oriente Médio, África, Oceania)
      return { durBase: 900, durVar: 120, precoBase: 5600, precoVar: 1800 };
  }
}

interface CiaOpcao {
  cia: string;
  /** hub IATA usado como escala quando a oferta tem 1 parada */
  hub: string | null;
  /** se a companhia opera voo direto nesse perfil de rota */
  direto: boolean;
  vooMin: number;
  vooMax: number;
}

function ciasDaRota(ro: Regiao, rd: Regiao): CiaOpcao[] {
  const par = [ro, rd].sort().join("-");
  if (par === "BR-BR") {
    return [
      { cia: "G3", hub: "GRU", direto: true, vooMin: 1200, vooMax: 1999 },
      { cia: "LA", hub: "CNF", direto: true, vooMin: 3000, vooMax: 3999 },
      { cia: "AD", hub: "VCP", direto: true, vooMin: 4000, vooMax: 4999 },
    ];
  }
  if (par === "BR-SA" || par === "SA-SA") {
    return [
      { cia: "LA", hub: "SCL", direto: true, vooMin: 8000, vooMax: 8999 },
      { cia: "G3", hub: null, direto: true, vooMin: 7600, vooMax: 7799 },
      { cia: "AR", hub: "EZE", direto: rd === "SA" && ro === "SA", vooMin: 1300, vooMax: 1399 },
      { cia: "AV", hub: "BOG", direto: false, vooMin: 200, vooMax: 299 },
      { cia: "CM", hub: "PTY", direto: false, vooMin: 700, vooMax: 799 },
    ];
  }
  if (par === "BR-CAR" || par === "CAR-SA" || par === "CAR-NA") {
    return [
      { cia: "CM", hub: "PTY", direto: false, vooMin: 700, vooMax: 799 },
      { cia: "AA", hub: "MIA", direto: false, vooMin: 900, vooMax: 999 },
      { cia: "AV", hub: "BOG", direto: false, vooMin: 200, vooMax: 299 },
      { cia: "LA", hub: "LIM", direto: false, vooMin: 8000, vooMax: 8999 },
    ];
  }
  if (par === "BR-NA" || par === "NA-SA") {
    return [
      { cia: "AA", hub: "MIA", direto: true, vooMin: 900, vooMax: 999 },
      { cia: "UA", hub: "IAH", direto: true, vooMin: 800, vooMax: 899 },
      { cia: "DL", hub: "ATL", direto: true, vooMin: 100, vooMax: 299 },
      { cia: "LA", hub: null, direto: true, vooMin: 8000, vooMax: 8199 },
      { cia: "AC", hub: "YYZ", direto: false, vooMin: 90, vooMax: 99 },
      { cia: "AM", hub: "MEX", direto: false, vooMin: 400, vooMax: 499 },
    ];
  }
  if (par === "BR-EU" || par === "EU-SA") {
    return [
      { cia: "TP", hub: "LIS", direto: true, vooMin: 50, vooMax: 299 },
      { cia: "LA", hub: null, direto: true, vooMin: 8100, vooMax: 8199 },
      { cia: "UX", hub: "MAD", direto: false, vooMin: 100, vooMax: 199 },
      { cia: "IB", hub: "MAD", direto: false, vooMin: 6800, vooMax: 6899 },
      { cia: "AF", hub: "CDG", direto: ro !== "BR", vooMin: 400, vooMax: 499 },
      { cia: "KL", hub: "AMS", direto: ro !== "BR", vooMin: 700, vooMax: 799 },
      { cia: "LH", hub: "FRA", direto: false, vooMin: 500, vooMax: 599 },
      { cia: "AZ", hub: "FCO", direto: false, vooMin: 600, vooMax: 699 },
    ];
  }
  if (par === "EU-NA") {
    return [
      { cia: "BA", hub: "LHR", direto: true, vooMin: 200, vooMax: 299 },
      { cia: "AF", hub: "CDG", direto: true, vooMin: 400, vooMax: 499 },
      { cia: "LH", hub: "FRA", direto: true, vooMin: 500, vooMax: 599 },
      { cia: "TP", hub: "LIS", direto: true, vooMin: 200, vooMax: 299 },
    ];
  }
  if (par === "EU-EU" || par === "NA-NA") {
    return [
      { cia: "TP", hub: "LIS", direto: true, vooMin: 1000, vooMax: 1999 },
      { cia: "IB", hub: "MAD", direto: true, vooMin: 3000, vooMax: 3999 },
      { cia: "KL", hub: "AMS", direto: true, vooMin: 1000, vooMax: 1999 },
    ];
  }
  // longo curso genérico: sempre com escala em hub global
  return [
    { cia: "EK", hub: "DXB", direto: false, vooMin: 260, vooMax: 269 },
    { cia: "TK", hub: "IST", direto: false, vooMin: 15, vooMax: 199 },
    { cia: "QR", hub: "DOH", direto: false, vooMin: 700, vooMax: 799 },
    { cia: "ET", hub: "ADD", direto: false, vooMin: 500, vooMax: 519 },
  ];
}

/* -------------------------------------------------------------------------- */
/* Utilidades de tempo (aritmética em UTC para não depender do fuso do browser) */
/* -------------------------------------------------------------------------- */

function somaMin(isoLocal: string, min: number): string {
  const d = new Date(`${isoLocal}Z`);
  return new Date(d.getTime() + min * 60_000).toISOString().slice(0, 19);
}

const MINUTOS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function horario(rnd: () => number, faixas: [number, number][]): string {
  const [h0, h1] = faixas[Math.floor(rnd() * faixas.length)];
  const h = h0 + Math.floor(rnd() * (h1 - h0 + 1));
  const m = MINUTOS[Math.floor(rnd() * MINUTOS.length)];
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h % 24)}:${p(m)}:00`;
}

const expira = (horas: number) => new Date(Date.now() + horas * 3600_000).toISOString();

/** Link de afiliado demo no formato de busca da Aviasales: /search/GRU1205LIS1 */
function linkDemo(origem: string, ida: string, destino: string): string {
  const dd = ida.slice(8, 10);
  const mm = ida.slice(5, 7);
  return `https://www.aviasales.com/search/${origem}${dd}${mm}${destino}1`;
}

/* -------------------------------------------------------------------------- */
/* Gerador principal                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Gera 6–8 ofertas demo plausíveis e estáveis para a rota informada.
 * A mesma rota sempre produz a mesma lista (seed determinística).
 */
export function gerarOfertasDemo(rota: BuscaResponse["rota"]): Oferta[] {
  const { origem, destino, ida, volta } = rota;
  const rnd = mulberry32(
    hashSeed(`${origem}-${destino}-${ida}-${volta ?? "ow"}-${rota.pax}`),
  );

  const ro = regiao(origem);
  const rd = regiao(destino);
  const perfil = perfilRota(ro, rd);
  const cias = ciasDaRota(ro, rd);

  const internacional = !(ro === "BR" && rd === "BR");
  const origemTemDireto = !internacional || HUB_INTL_BR.has(origem) || ro !== "BR";
  const parKey = [ro, rd].sort().join("-");
  const longoCurso = parKey !== "BR-BR" && !["BR-SA", "SA-SA", "BR-EU", "EU-SA", "BR-NA", "NA-SA", "EU-NA", "EU-EU", "NA-NA"].includes(parKey);

  // quantas ofertas: 6–8, estável por rota
  const total = 6 + Math.floor(rnd() * 3);
  const ciasDireto = cias.filter((c) => c.direto);
  const ofertas: Oferta[] = [];
  const usados = new Set<string>();

  for (let i = 0; i < total; i++) {
    // a 1ª oferta gerada é sempre um direto quando a rota permite
    // (garante uma "Escolha do Olho" coerente, ex.: TAP direto GRU→LIS)
    const forcaDireto =
      i === 0 && !longoCurso && origemTemDireto && ciasDireto.length > 0;
    const pool = forcaDireto ? ciasDireto : cias;

    // escolhe companhia sem repetir número de voo
    let op = pool[Math.floor(rnd() * pool.length)];
    let voo = op.vooMin + Math.floor(rnd() * (op.vooMax - op.vooMin));
    let chave = `${op.cia}${voo}`;
    let tent = 0;
    while (usados.has(chave) && tent++ < 20) {
      op = pool[Math.floor(rnd() * pool.length)];
      voo = op.vooMin + Math.floor(rnd() * (op.vooMax - op.vooMin));
      chave = `${op.cia}${voo}`;
    }
    usados.add(chave);

    // escalas: direto quando o hub da cia É o destino (TAP→LIS, AA→MIA),
    // quando forçado na 1ª oferta, ou conforme o perfil da rota
    let escalas: number;
    if (!origemTemDireto) escalas = longoCurso ? 2 : 1;
    else if (forcaDireto || op.hub === destino) escalas = 0;
    else if (longoCurso) escalas = rnd() < 0.5 ? 1 : 2;
    else if (op.direto && rnd() < (internacional ? 0.45 : 0.6)) escalas = 0;
    else escalas = op.hub ? 1 : 0;

    // duração: base + conexões + jitter
    const jitter = Math.round((rnd() * 2 - 1) * perfil.durVar);
    let dur = perfil.durBase + jitter;
    if (escalas === 1) dur += 110 + Math.floor(rnd() * 130);
    if (escalas === 2) dur += 290 + Math.floor(rnd() * 190);
    dur = Math.max(55, dur);

    // preço: direto um pouco mais caro; 2 escalas, mais barato
    let preco = perfil.precoBase + Math.round((rnd() * 2 - 1) * perfil.precoVar * 0.5);
    if (escalas === 0) preco = Math.round(preco * 1.08);
    if (escalas === 2) preco = Math.round(preco * 0.85);
    preco = Math.max(perfil.precoBase * 0.55, preco);

    // horários: doméstico ao longo do dia; internacional concentrado à tarde/noite
    const faixas: [number, number][] = internacional
      ? [[12, 16], [17, 20], [21, 23]]
      : [[5, 8], [9, 12], [13, 17], [18, 22]];
    const partida = `${ida}T${horario(rnd, faixas)}`;

    // cidade da escala
    let via: string | null = null;
    if (escalas >= 1) {
      if (!origemTemDireto && internacional) via = CIDADE.GRU;
      else if (op.hub && op.hub !== origem && op.hub !== destino) via = CIDADE[op.hub] ?? null;
      if (escalas === 2 && via) via = `${via} + 1`;
    }

    // volta espelha a ida (mesmo padrão de escalas, horário próprio)
    let volta_em: string | null = null;
    let duracao_volta_min: number | undefined;
    if (volta) {
      volta_em = `${volta}T${horario(rnd, faixas)}`;
      duracao_volta_min = Math.max(55, dur + Math.round((rnd() * 2 - 1) * 30));
    }

    ofertas.push({
      id: `demo-${i + 1}`,
      preco,
      moeda: "BRL",
      cia: op.cia,
      numero_voo: voo,
      origem,
      destino,
      partida,
      chegada: somaMin(partida, dur),
      volta_em,
      escalas,
      escalas_volta: volta ? escalas : undefined,
      duracao_min: dur,
      duracao_volta_min,
      link_reserva: linkDemo(origem, ida, destino),
      expira_em: expira(1 + Math.floor(rnd() * 4)),
      via,
    });
  }

  // Ordenação: a "Escolha do Olho" (direto mais barato, ou o menor preço geral)
  // vem primeiro; o restante em ordem de preço. A página de Resultados marca
  // ofertas[0] como "Escolha do Olho" e o menor preço como "Menor preço".
  const menorPreco = Math.min(...ofertas.map((o) => o.preco));
  const diretos = ofertas.filter((o) => o.escalas === 0);
  const escolha =
    diretos.length > 0
      ? diretos.reduce((a, b) => (b.preco < a.preco ? b : a))
      : ofertas.find((o) => o.preco === menorPreco)!;
  const resto = ofertas.filter((o) => o !== escolha).sort((a, b) => a.preco - b.preco);
  return [escolha, ...resto].map((o, i) => ({ ...o, id: `demo-${i + 1}` }));
}

/** Resposta demo completa, no shape da API. */
export function demoBuscaResponse(
  rota: BuscaResponse["rota"] = {
    origem: "GRU",
    destino: "LIS",
    ida: "2026-05-12",
    volta: "2026-05-24",
    pax: 1,
  },
): BuscaResponse {
  const ofertas = gerarOfertasDemo(rota);
  return {
    fonte: "demo",
    rota,
    total: ofertas.length,
    ofertas,
    aviso: AVISO_COMPLIANCE,
  };
}

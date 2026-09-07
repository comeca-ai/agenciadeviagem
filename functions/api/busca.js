/**
 * Olho de Tandera — Pages Function: GET /api/busca
 *
 * Proxy server-side para a Data API do Travelpayouts (Aviasales).
 * Token/marker só em Secrets — nunca no browser.
 * Erros nunca ecoam a URL com token.
 */

const TP_BASE = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates";
const CACHE_TTL_S = 1800;

const AVISO_COMPLIANCE =
  "Preço por pessoa com taxas de embarque. Bagagem e regras da tarifa só no parceiro. Sujeito a alteração. A reserva é concluída no site do parceiro.";

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": status === 200 ? `public, max-age=${CACHE_TTL_S}` : "no-store",
      ...extraHeaders,
    },
  });
}

function isIata(v) {
  return typeof v === "string" && /^[A-Z]{3}$/.test(v);
}

function isDate(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function linkAfiliado(link, marker) {
  const sep = link.includes("?") ? "&" : "?";
  return `https://www.aviasales.com${link}${sep}marker=${marker}`;
}

function safeErr(e) {
  const raw = String((e && e.message) || e || "erro");
  return raw
    .replace(/token=[^&\s]+/gi, "token=REDACTED")
    .replace(/TRAVELPAYOUTS_[A-Z_]+=\S+/gi, "SECRET=REDACTED")
    .slice(0, 180);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const origem = (url.searchParams.get("origem") || "").toUpperCase();
  const destino = (url.searchParams.get("destino") || "").toUpperCase();
  const ida = url.searchParams.get("ida") || "";
  const volta = url.searchParams.get("volta") || "";
  const pax = Math.min(Math.max(parseInt(url.searchParams.get("pax") || "1", 10) || 1, 1), 9);

  if (!isIata(origem) || !isIata(destino) || !isDate(ida)) {
    return json({ erro: "parametros_invalidos", detalhe: "Use origem/destino IATA (3 letras) e ida YYYY-MM-DD." }, 400);
  }
  if (origem === destino) {
    return json({ erro: "mesma_cidade", detalhe: "Origem e destino precisam ser diferentes." }, 400);
  }
  if (volta && !isDate(volta)) {
    return json({ erro: "volta_invalida", detalhe: "Use YYYY-MM-DD para a volta." }, 400);
  }

  const token = env.TRAVELPAYOUTS_TOKEN;
  const marker = env.TRAVELPAYOUTS_MARKER;
  if (!token || !marker) {
    return json({ erro: "sem_credenciais", detalhe: "Configure TRAVELPAYOUTS_TOKEN e TRAVELPAYOUTS_MARKER." }, 503);
  }

  const cacheKey = new Request(
    `https://cache.olhodetandera.internal/api/busca?origem=${origem}&destino=${destino}&ida=${ida}&volta=${volta}&pax=${pax}`
  );
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) {
    return new Response(cached.body, {
      status: 200,
      headers: { ...Object.fromEntries(cached.headers), "x-olho-cache": "hit" },
    });
  }

  const tp = new URL(TP_BASE);
  tp.searchParams.set("origin", origem);
  tp.searchParams.set("destination", destino);
  tp.searchParams.set("departure_at", ida);
  if (volta) tp.searchParams.set("return_at", volta);
  tp.searchParams.set("sorting", "price");
  tp.searchParams.set("limit", "30");
  tp.searchParams.set("currency", "brl");
  tp.searchParams.set("market", "br");
  tp.searchParams.set("token", token);
  if (!volta) tp.searchParams.set("one_way", "true");

  let data;
  try {
    const resp = await fetch(tp.toString(), {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!resp.ok) {
      return json({ erro: "provedor_indisponivel", status_provedor: resp.status }, 502);
    }
    data = await resp.json();
  } catch (e) {
    return json({ erro: "timeout_ou_rede", detalhe: safeErr(e) }, 502);
  }

  const ofertas = (data.data || []).map((item, i) => ({
    id: `${origem}${destino}${ida}-${i}`,
    preco: item.price,
    moeda: "BRL",
    cia: item.airline,
    numero_voo: item.flight_number,
    origem: item.origin || origem,
    destino: item.destination || destino,
    partida: item.departure_at,
    volta_em: item.return_at || null,
    escalas: item.transfers ?? null,
    escalas_volta: item.return_transfers ?? null,
    duracao_min: item.duration_to ?? null,
    duracao_volta_min: item.duration_back ?? null,
    link_reserva: linkAfiliado(item.link || `/search/${origem}${ida.slice(8, 10)}${ida.slice(5, 7)}${destino}1`, marker),
    expira_em: item.expires_at || null,
  }));

  const body = {
    fonte: "travelpayouts",
    rota: { origem, destino, ida, volta: volta || null, pax },
    total: ofertas.length,
    ofertas,
    aviso: AVISO_COMPLIANCE,
  };

  const response = json(body, 200, { "x-olho-cache": "miss" });
  context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

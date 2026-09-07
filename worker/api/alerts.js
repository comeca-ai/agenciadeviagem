import { json, methodNotAllowed, semDB, usuarioAtual, listarAlertasDoUsuario, criarAlertaDoUsuario, apagarAlertaDoUsuario, rateLimit } from "./utils.js";

function isIata(v) { return typeof v === "string" && /^[A-Z]{3}$/.test(v); }

export async function handleAlerts(request, env) {
  if (!env.DB) return semDB();
  const user = await usuarioAtual(request, env.DB);
  if (!user) return json({ erro: "nao_autenticado" }, 401);
  if (request.method === "GET") return json({ alertas: await listarAlertasDoUsuario(env.DB, user.id) });
  if (request.method === "DELETE") {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return json({ erro: "validacao", detalhe: "id obrigatório." }, 400);
    const ok = await apagarAlertaDoUsuario(env.DB, user.id, id);
    return ok ? json({ ok: true }) : json({ erro: "nao_encontrado" }, 404);
  }
  if (request.method !== "POST") return methodNotAllowed();
  const rl = await rateLimit(request, "alerts-create", { limit: 20, windowS: 300 });
  if (!rl.ok) return rl.response;
  let body;
  try { body = await request.json(); } catch { return json({ erro: "json_invalido" }, 400); }
  const origem = String(body.origem || "").toUpperCase();
  const destino = String(body.destino || "").toUpperCase();
  const ida = String(body.ida || "");
  const volta = body.volta ? String(body.volta) : null;
  const preco_alvo = body.preco_alvo != null ? Number(body.preco_alvo) : null;
  if (!isIata(origem) || !isIata(destino) || !/^\d{4}-\d{2}-\d{2}$/.test(ida)) return json({ erro: "validacao", detalhe: "origem/destino IATA e ida YYYY-MM-DD." }, 400);
  const id = await criarAlertaDoUsuario(env.DB, user.id, { origem, destino, ida, volta, preco_alvo });
  return json({ id, ok: true }, 201);
}

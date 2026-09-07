/**
 * POST /api/auth/login
 * Body: { email, senha }
 */
import { json, semDB, verificaSenha, criarSessao, cookieSessao, rateLimit } from "./_utils.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) return semDB();

  const rl = await rateLimit(request, "auth-login", { limit: 10, windowS: 60 });
  if (!rl.ok) return rl.response;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ erro: "json_invalido" }, 400);
  }

  const email = String(body.email || "").trim().toLowerCase();
  const senha = String(body.senha || "");
  if (!email || !senha) return json({ erro: "validacao", detalhe: "Informe e-mail e senha." }, 400);

  const user = await env.DB.prepare(
    "SELECT id, nome, email, senha_hash, senha_salt FROM users WHERE email = ?"
  ).bind(email).first();

  if (!user || !(await verificaSenha(senha, user.senha_salt, user.senha_hash))) {
    return json({ erro: "credenciais_invalidas", detalhe: "E-mail ou senha incorretos." }, 401);
  }

  context.waitUntil(env.DB.prepare("DELETE FROM sessions WHERE expira_em < datetime('now')").run());

  const token = await criarSessao(env.DB, user.id);
  return json(
    { autenticado: true, usuario: { nome: user.nome, email: user.email } },
    200,
    { "set-cookie": cookieSessao(token) }
  );
}

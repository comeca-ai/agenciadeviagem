/**
 * POST /api/auth/register — cria conta (portão +18 da marca)
 * Body: { nome, email, senha, maior18: true }
 */
import { json, semDB, hashSenha, criarSessao, cookieSessao, validaCadastro, rateLimit } from "./_utils.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) return semDB();

  const rl = await rateLimit(request, "auth-register", { limit: 5, windowS: 300 });
  if (!rl.ok) return rl.response;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ erro: "json_invalido" }, 400);
  }

  const nome = String(body.nome || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const senha = String(body.senha || "");
  const erro = validaCadastro({ nome, email, senha, maior18: body.maior18 });
  if (erro) return json({ erro: "validacao", detalhe: erro }, 400);

  const existe = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existe) return json({ erro: "email_em_uso", detalhe: "Esse e-mail já tem conta. Faça login." }, 409);

  const { salt, hash } = await hashSenha(senha);
  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO users (id, email, nome, senha_hash, senha_salt, maior_de_18) VALUES (?, ?, ?, ?, ?, 1)"
  ).bind(id, email, nome, hash, salt).run();

  const token = await criarSessao(env.DB, id);
  return json(
    { autenticado: true, usuario: { nome, email } },
    201,
    { "set-cookie": cookieSessao(token) }
  );
}

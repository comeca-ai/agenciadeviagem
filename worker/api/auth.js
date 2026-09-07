import { json, methodNotAllowed, semDB, verificaSenha, criarSessao, cookieSessao, cookieLimpar, usuarioAtual, encerrarSessaoAtual, hashSenha, validaCadastro, rateLimit } from "./utils.js";

export async function handleAuth(request, env, ctx, pathname) {
  if (!env.DB) return semDB();
  const route = pathname.slice("/api/auth/".length);
  if (route === "login" && request.method === "POST") return login(request, env, ctx);
  if (route === "logout" && request.method === "POST") return logout(request, env);
  if (route === "me" && request.method === "GET") return me(request, env);
  if (route === "register" && request.method === "POST") return register(request, env);
  return methodNotAllowed();
}

async function login(request, env, ctx) {
  const rl = await rateLimit(request, "auth-login", { limit: 10, windowS: 60 });
  if (!rl.ok) return rl.response;
  let body; try { body = await request.json(); } catch { return json({ erro: "json_invalido" }, 400); }
  const email = String(body.email || "").trim().toLowerCase();
  const senha = String(body.senha || "");
  if (!email || !senha) return json({ erro: "validacao", detalhe: "Informe e-mail e senha." }, 400);
  const user = await env.DB.prepare("SELECT id, nome, email, senha_hash, senha_salt FROM users WHERE email = ?").bind(email).first();
  if (!user || !(await verificaSenha(senha, user.senha_salt, user.senha_hash))) return json({ erro: "credenciais_invalidas", detalhe: "E-mail ou senha incorretos." }, 401);
  ctx?.waitUntil(env.DB.prepare("DELETE FROM sessions WHERE expira_em < datetime('now')").run());
  const token = await criarSessao(env.DB, user.id);
  return json({ autenticado: true, usuario: { nome: user.nome, email: user.email } }, 200, { "set-cookie": cookieSessao(token) });
}

async function logout(request, env) {
  await encerrarSessaoAtual(request, env.DB);
  return json({ autenticado: false }, 200, { "set-cookie": cookieLimpar() });
}

async function me(request, env) {
  const user = await usuarioAtual(request, env.DB);
  if (!user) return json({ autenticado: false }, 401);
  return json({ autenticado: true, usuario: { nome: user.nome, email: user.email } });
}

async function register(request, env) {
  const rl = await rateLimit(request, "auth-register", { limit: 5, windowS: 300 });
  if (!rl.ok) return rl.response;
  let body; try { body = await request.json(); } catch { return json({ erro: "json_invalido" }, 400); }
  const nome = String(body.nome || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const senha = String(body.senha || "");
  const erro = validaCadastro({ nome, email, senha, maior18: body.maior18 });
  if (erro) return json({ erro: "validacao", detalhe: erro }, 400);
  const existe = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existe) return json({ erro: "email_em_uso", detalhe: "Esse e-mail já tem conta. Faça login." }, 409);
  const { salt, hash } = await hashSenha(senha);
  const id = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO users (id, email, nome, senha_hash, senha_salt, maior_de_18) VALUES (?, ?, ?, ?, ?, 1)").bind(id, email, nome, hash, salt).run();
  const token = await criarSessao(env.DB, id);
  return json({ autenticado: true, usuario: { nome, email } }, 201, { "set-cookie": cookieSessao(token) });
}

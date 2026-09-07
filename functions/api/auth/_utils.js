/**
 * Olho de Tandera — utilidades de autenticação (Pages Functions + D1)
 * Arquivo com prefixo "_" não vira rota na Cloudflare Pages.
 *
 * Hash: PBKDF2 (Web Crypto nativo do runtime Workers — sem dependências).
 * Sessão: cookie httpOnly "olho_session", 30 dias.
 */

export const SESSION_COOKIE = "olho_session";
export const SESSION_DIAS = 30;
const PBKDF2_ITER = 100000;

export function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

export function semDB() {
  return json({ erro: "auth_indisponivel", detalhe: "Banco D1 não configurado (preview estático?)." }, 503);
}

function toHex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function pbkdf2(senha, saltHex) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(senha), "PBKDF2", false, ["deriveBits"]);
  const salt = Uint8Array.from(saltHex.match(/../g).map((h) => parseInt(h, 16)));
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: PBKDF2_ITER },
    key,
    256
  );
  return toHex(bits);
}

export async function hashSenha(senha) {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  return { salt, hash: await pbkdf2(senha, salt) };
}

export async function verificaSenha(senha, salt, hashEsperado) {
  const hash = await pbkdf2(senha, salt);
  // comparação em tempo constante (simples)
  if (hash.length !== hashEsperado.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ hashEsperado.charCodeAt(i);
  return diff === 0;
}

export function cookieSessao(token, maxAgeS = SESSION_DIAS * 86400) {
  return `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAgeS}`;
}

export function cookieLimpar() {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function tokenDoCookie(request) {
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return m ? m[1] : null;
}

/** Cria sessão no D1 e devolve o token. */
export async function criarSessao(db, userId) {
  const token = crypto.randomUUID() + crypto.randomUUID().replaceAll("-", "");
  const expira = new Date(Date.now() + SESSION_DIAS * 86400000).toISOString();
  await db.prepare("INSERT INTO sessions (token, user_id, expira_em) VALUES (?, ?, ?)").bind(token, userId, expira).run();
  return token;
}

/** Retorna o usuário logado (ou null) a partir do cookie. */
export async function usuarioAtual(request, db) {
  const token = tokenDoCookie(request);
  if (!token) return null;
  const row = await db
    .prepare(
      `SELECT u.id, u.nome, u.email FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expira_em > datetime('now')`
    )
    .bind(token)
    .first();
  return row || null;
}

export function validaCadastro({ nome, email, senha, maior18 }) {
  if (!nome || String(nome).trim().length < 2) return "Informe seu nome.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email))) return "E-mail inválido.";
  if (!senha || String(senha).length < 8) return "A senha precisa de pelo menos 8 caracteres.";
  if (maior18 !== true) return "É preciso ter 18 anos ou mais para criar conta."; // portão da marca
  return null;
}

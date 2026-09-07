/**
 * POST /api/auth/logout — encerra a sessão do cookie atual
 */
import { json, semDB, tokenDoCookie, cookieLimpar } from "./_utils.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) return semDB();

  const token = tokenDoCookie(request);
  if (token) {
    await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  }
  return json({ autenticado: false }, 200, { "set-cookie": cookieLimpar() });
}

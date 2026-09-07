/**
 * POST /api/auth/logout — encerra só a sessão do cookie atual (RLS)
 */
import { json, semDB, encerrarSessaoAtual, cookieLimpar } from "./_utils.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB) return semDB();

  await encerrarSessaoAtual(request, env.DB);
  return json({ autenticado: false }, 200, { "set-cookie": cookieLimpar() });
}

/**
 * GET /api/auth/me — quem sou eu (estado de login do frontend)
 */
import { json, semDB, usuarioAtual } from "./_utils.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!env.DB) return semDB();

  const user = await usuarioAtual(request, env.DB);
  if (!user) return json({ autenticado: false }, 401);
  return json({ autenticado: true, usuario: { nome: user.nome, email: user.email } });
}

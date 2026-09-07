# Mapa de APIs — Olho de Tandera

| Camada | Endpoint / provedor | Uso | Segredos | Risco | Estado |
|---|---|---|---|---|---|
| Pages Function | `GET /api/busca` | Proxy tarifas | `TRAVELPAYOUTS_*` | Quota TP | Cache 30m; erros redigem `token=` |
| Upstream | Travelpayouts `prices_for_dates` | Preço | token query | Log URL | `safeErr` |
| Afiliado | `aviasales.com?marker=` | Comissão | marker | Compliance | — |
| Pages Function | `POST /api/auth/register` | Cadastro | D1 | Abuse | Rate-limit 5/5min IP |
| Pages Function | `POST /api/auth/login` | Sessão | D1 | Brute force | Rate-limit 10/min IP |
| Pages Function | `POST /api/auth/logout` | Cookie | D1 | Baixo | RLS: só cookie atual |
| Pages Function | `GET /api/auth/me` | Quem sou | cookie | Baixo | — |
| Pages Function | `GET/POST/DELETE /api/alerts` | Alertas preço | D1 | IDOR | **RLS**: `user_id` só da sessão |
| Binding | D1 `olhodetandera` | users/sessions/alerts | — | 503 sem binding | — |
| Frontend | `fetch('/api/busca')` | UI | — | Demo fallback | — |
| CI | Wrangler Pages | Deploy | CF + TP | Push main | Gate PR pendente (scope) |

Runtime = Cloudflare only. Sem AWS/Vercel.

# Mapa de APIs — Olho de Tandera

| Camada | Endpoint / provedor | Uso | Segredos | Risco | Melhoria |
|---|---|---|---|---|---|
| Pages Function | `GET /api/busca` | Proxy tarifas | `TRAVELPAYOUTS_TOKEN`, `TRAVELPAYOUTS_MARKER` | Quota/custo TP; timeout 8s | Cache hit-rate → KV |
| Upstream | `https://api.travelpayouts.com/aviasales/v3/prices_for_dates` | Dados de preço | token query | Vazamento se logar URL | Nunca logar query com token |
| Afiliado | `https://www.aviasales.com…?marker=` | Reserva/comissão | marker | Compliance | — |
| Pages Function | `POST /api/auth/register` | Cadastro +18 | D1 `DB` | Abuse sem rate-limit | Rate-limit / Turnstile |
| Pages Function | `POST /api/auth/login` | Sessão | D1 | Brute force | Rate-limit |
| Pages Function | `POST /api/auth/logout` | Encerra cookie | D1 | Baixo | — |
| Pages Function | `GET /api/auth/me` | Estado login | cookie `olho_session` | Baixo | — |
| Binding | D1 `olhodetandera` | users/sessions | — | Sem binding → 503 | Healthcheck CI |
| Frontend | `fetch('/api/busca')` | Resultados | — | Demo se API falha | Telemetria |
| CI | Wrangler Pages deploy | Prod | `CLOUDFLARE_*`, TP secrets | Deploy em todo push main | PR gate lint/build |

Sem Stripe/AWS/Vercel/SDKs de chat. Runtime = Cloudflare only.

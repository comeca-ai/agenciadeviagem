# Deploy — Olho de Tandera (100% Cloudflare)

> olhodetandera.com · Pages (site) + Pages Functions (`/api/busca`) · custo: R$ 0/mês no plano Free

## 1. Pré-requisitos (15 min)

1. **Travelpayouts** — cadastro gratuito em https://www.travelpayouts.com → no painel, pegue seu **API token** e seu **marker** (ID de afiliado). É eles que pagam a comissão por reserva.
2. **Cloudflare** — conta gratuita em https://dash.cloudflare.com.
3. Repositório com este código no GitHub (`comeca-ai/agenciadeviagem`).

## 2. Domínio na Cloudflare

1. No dashboard: **Add site** → `olhodetandera.com` → plano **Free**.
2. A Cloudflare mostra **2 nameservers**. No registrador onde você comprou o domínio, troque os nameservers pelos da Cloudflare. Propagação: até 24–72h (geralmente menos).
3. SSL/TLS: certificado Universal **gratuito e automático** — modo **Full (strict)**.

## 3. Site no ar (Pages)

1. **Workers & Pages → Create → Pages → Connect to Git** → escolha `comeca-ai/agenciadeviagem`.
2. Build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
3. Deploy. A cada `git push` na branch principal, sai deploy automático.
4. Em **Pages → Custom domains**: adicione `olhodetandera.com` e `www.olhodetandera.com` (a Cloudflare cria DNS e SSL sozinha).

## 4. Ligar o buscador de verdade (os Secrets)

Sem segredos, o `/api/busca` responde 503 e o site mostra dados de demonstração. Para dados reais:

1. No projeto Pages: **Settings → Environment variables (Production)** → adicione como **Secrets**:
   - `TRAVELPAYOUTS_TOKEN` = seu token da Travelpayouts
   - `TRAVELPAYOUTS_MARKER` = seu marker de afiliado
2. **Retry deployment** (ou faça um push qualquer) para aplicar.
3. Teste: `https://olhodetandera.com/api/busca?origem=GRU&destino=LIS&ida=2026-11-10&volta=2026-11-17&pax=1`

## 5. Desenvolvimento local (opcional)

```bash
npm install
cp .dev.vars.example .dev.vars   # preencha com token/marker reais
npm run dev                      # frontend (Vite)
# ou, para testar as Functions localmente:
npx wrangler pages dev dist -- npm run build
```

## 6. Autenticação (D1 — o SQLite da Cloudflare)

Endpoints prontos: `POST /api/auth/register` (nome, email, senha ≥ 8, **maior18 obrigatório**), `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`. Sessão via cookie httpOnly de 30 dias. Senhas com PBKDF2 (100 mil iterações, Web Crypto nativo — zero dependências).

Para ativar em produção:

```bash
npx wrangler login
npx wrangler d1 create olhodetandera          # copie o database_id exibido
# cole o database_id no wrangler.toml (seção [[d1_databases]])
npx wrangler d1 migrations apply olhodetandera --remote
```

No projeto Pages: **Settings → Functions → D1 database bindings** → binding `DB` apontando para o banco `olhodetandera`. Retry deployment e pronto: cadastro/login passam a funcionar no ar. Sem o binding, a API responde 503 e o site segue em modo demonstração.

**LGPD/pequeno print:** coletamos só nome + e-mail; senha nunca em texto claro; o usuário pode pedir exclusão da conta (tabela `users` + `sessions` em cascata). O campo `maior_de_18` registra o consentimento do portão etário.

## 7. Limites do plano Free (quando crescer)

- **100 mil requisições/dia** de Functions — estourou, volta a R$ 0 no dia seguinte (ou Workers Paid, ~US$5/mês).
- Cache de 30 min por rota+data reduz drasticamente as chamadas à API externa.
- Tarifas aéreas mudam rápido: o site sempre exibe o aviso "preço sujeito a alteração" — exigência de compliance e da Travelpayouts.

---

*O Olho de Tandera enxerga — quem voa é você.* 👁️

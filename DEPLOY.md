# Deploy — Olho de Tandera (Cloudflare Worker)

O deploy de produção é um único Cloudflare Worker: Vite gera `dist/` e o Worker serve esses assets com SPA fallback; `/api/*` é executado pelo mesmo Worker. O projeto Pages antigo não é atualizado por este fluxo.

## Pré-requisitos

No GitHub Actions, configure `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `TRAVELPAYOUTS_TOKEN` e `TRAVELPAYOUTS_MARKER`. O token precisa editar Workers, D1 e secrets.

O D1 existente continua sendo `olhodetandera`, com binding `DB` e database id `6add3cdc-47c1-4fc2-9cca-64fb664914b5`; não crie outro banco. Migrations são aplicadas pelo workflow.

## Deploy local

```bash
pnpm install
pnpm build
npx wrangler d1 migrations apply olhodetandera --remote
printf '%s' "$TRAVELPAYOUTS_TOKEN" | npx wrangler secret put TRAVELPAYOUTS_TOKEN --name olhodetandera
printf '%s' "$TRAVELPAYOUTS_MARKER" | npx wrangler secret put TRAVELPAYOUTS_MARKER --name olhodetandera
npx wrangler deploy
```

## Cutover do domínio

1. Faça o deploy inicial sem trocar o tráfego e valide `https://olhodetandera.<account>.workers.dev`.
2. No Cloudflare, remova/desassocie `olhodetandera.com` e `www.olhodetandera.com` do projeto Pages antigo.
3. O `wrangler.toml` declara os dois como `custom_domain` do Worker; confirme DNS, certificado e os endpoints `/api/busca`, `/api/auth/me` e `/api/alerts`.
4. Só depois da validação, aposente o Pages. Não há merge ou cutover automático neste PR.

## Segurança e comportamento

- `TRAVELPAYOUTS_TOKEN` e `TRAVELPAYOUTS_MARKER` ficam como secrets do Worker, nunca no bundle.
- `DB` é o mesmo binding usado por login, cadastro e alertas; cookies e rate limits continuam no runtime Workers.
- `functions/` é a implementação antiga de Pages mantida apenas como referência durante a transição; o código executado está em `worker/`.
- A antiga opção `--branch=master` só fazia sentido para Pages e foi removida do caminho Worker.

## CI

O workflow canônico é `.github/workflows/deploy.yml`. Se o token que atualiza este repositório não tiver escopo de workflow, copie `docs/deploy-worker.yml.snippet` para `.github/workflows/deploy.yml` manualmente antes de habilitar o deploy.

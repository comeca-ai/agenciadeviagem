# Olho de Tandera

Busca de passagens. Mostra o preço que o parceiro devolve. Reserva fecha lá, não aqui.  
**Live:** [olhodetandera.com](https://olhodetandera.com) · **Repo:** `comeca-ai/agenciadeviagem`

Stack: Vite + React 19 + Tailwind · **Cloudflare Pages** + Pages Functions · **D1** · Travelpayouts.

Sem `TRAVELPAYOUTS_TOKEN` / `TRAVELPAYOUTS_MARKER` no Cloudflare, `/api/busca` responde 503. A UI não inventa preço — mostra o erro.

## Local

```bash
pnpm install
cp .dev.vars.example .dev.vars   # token/marker Travelpayouts
pnpm dev                         # :3000
```

Functions locais: `npx wrangler pages dev dist -- pnpm build`

## Scripts

| Comando | O quê |
|---|---|
| `pnpm dev` | Vite |
| `pnpm lint` | ESLint |
| `pnpm build` | `tsc -b` + Vite → `dist/` |
| `pnpm preview` | preview local |

## Cloudflare

Detalhes em [`DEPLOY.md`](./DEPLOY.md). Resumo:

- Build: `pnpm build` → `dist/`
- Project Pages: `olhodetandera`
- Functions: `/api/busca`, `/api/auth/*` (Workers na borda)
- D1 binding: `DB` → `olhodetandera`
- Secrets: `TRAVELPAYOUTS_TOKEN` , `TRAVELPAYOUTS_MARKER`

CI (`.github/workflows/deploy.yml`): push em `main`/`master` → build → migrations → secrets → `wrangler pages deploy --branch=master`.

## v2

Passagem Cloudflare (lazy routes/Hero canvas, chunks, `_headers`/`_redirects`): [`docs/v2-AUDIT.md`](./docs/v2-AUDIT.md).

# Olho de Tandera v2 — audit Cloudflare Pages

Branch: `v2` · Repo: `comeca-ai/agenciadeviagem`  
Live (`main` / olhodetandera.com) **não muda** até merge explícito.

## Stack

- Vite SPA + React 19 + Tailwind 3
- Cloudflare Pages + Pages Functions (`/api/busca`, `/api/auth/*`)
- D1 (`olhodetandera`) + Travelpayouts secrets
- CI deploy: push `main`/`master` → build → D1 → secrets → Pages `--branch=master`

## Wins (passagem 1 + 2)

| Win | Por quê |
|---|---|
| Lazy nas rotas | Three/Nevoa fora do first paint de resultados/destinos |
| **Hero lazy Canvas** (`HeroIrisCanvas`) | HTML do Hero pinta antes do chunk Three |
| `manualChunks` three/motion/framer | Cache CDN separado |
| Sem `inspectAttr` em prod | Bundle limpo |
| `base: "/"` | Domínio custom Pages |
| `_headers` / `_redirects` | Cache assets + SPA |
| `compatibility_date` 2026-09-07 | Runtime Functions |
| README de produto + `pages:deploy` | DX |

## Bloqueio

`.github/workflows/ci.yml` (lint+build em PR) — API 404 sem scope `workflow`. Colar manualmente.

## Não mudou

Busca/auth, Travelpayouts, D1, alias `--branch=master` no deploy.

## Review

```bash
pnpm install --frozen-lockfile && pnpm lint && pnpm build
```

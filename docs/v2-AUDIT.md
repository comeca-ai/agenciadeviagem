# Olho de Tandera v2 — audit Cloudflare Pages

Branch: `v2` · Repo: `comeca-ai/agenciadeviagem`  
Live (`main` / olhodetandera.com) **não muda** até merge explícito.

## Stack

- Vite SPA + React 19 + Tailwind 3
- Cloudflare Pages + Pages Functions (`/api/busca`, `/api/auth/*`)
- D1 (`olhodetandera`) + Travelpayouts secrets
- CI: push `main`/`master` → build → D1 migrations → secrets → `wrangler pages deploy --branch=master`

## Achados

1. **Three.js / R3F / gsap / framer** no grafo — Hero e A Lenda puxam WebGL. Sem code-split, first paint das outras rotas paga o 3D.
2. **`inspectAttr` no bundle de prod** — plugin de inspeção local no Vite.
3. **`base: './'`** — pior para domínio custom no Pages; `/` é o path certo.
4. **Sem `_headers` / `_redirects`** — assets sem cache longo; SPA sem fallback 200.
5. **CI só deploy** — sem gate lint/typecheck em PR (workflow scope pode bloquear edição via API).
6. **`--branch=master` no deploy** — de propósito (alias de produção no Pages); git default é `main`. Não mexer sem alinhar o dashboard.

## Wins nesta passagem

| Win | Por quê |
|---|---|
| `React.lazy` nas rotas | Three/Nevoa fora do first paint de resultados/destinos/etc. |
| `manualChunks` three/motion/framer | Cache CDN separado; menos JS inicial compartilhado |
| Sem `inspectAttr` em production | Bundle menor, sem tooling de dev |
| `base: "/"` | URLs corretas em olhodetandera.com |
| `public/_headers` | Cache immutable em `/assets/*` + headers de segurança |
| `public/_redirects` | Client routes SPA no Pages |
| `compatibility_date` 2026-09-07 | Runtime Functions mais novo |

## Follow-up (próxima passagem)

- Lazy do Canvas do Hero (above-the-fold ainda puxa three na home)
- Gate CI em PR: `pnpm lint` + `pnpm build` sem deploy
- README de produto (hoje ainda é template Vite)

## Review

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm build
```

Codespace: https://github.com/codespaces/new?hide_repo_select=true&ref=v2&repo=1360109556

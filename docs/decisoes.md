# Decisões

- 2026-09-07: form sobe para o hero. Íris fica atrás, sem pin de scroll, sem “role para buscar”, sem CTA da lenda no primeiro viewport.
- Lenda e manifesto continuam abaixo. Não é redesign da marca.
- 2026-09-08: visual do handoff nas páginas públicas + Entrar + Alertas.
- 2026-09-08: tira demonstração da tela. Home não mostra preço de queda inventado. Resultados não mostram selo demo nem insight de 14%/R$ 480. `_redirects` esvaziado — o Worker já trata SPA.
- 2026-09-08: redesign completo do handoff v2. Home, Destinos, Como funciona, Quem é Tandera, Entrar, Alertas, Resultados (calendário no lugar do insight, skeleton no lugar do overlay). Funções iguais: busca `/api/busca`, login `/api/auth/login`, alertas `/api/alerts`. Sem preço inventado na vitrine. Rota nova `/quem-e-tandera` (a antiga `/a-lenda` aponta para a mesma página).

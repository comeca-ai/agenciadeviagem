import { handleBusca } from "./api/busca.js";
import { handleAlerts } from "./api/alerts.js";
import { handleAuth } from "./api/auth.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/busca") return handleBusca(request, env, ctx);
    if (url.pathname === "/api/alerts") return handleAlerts(request, env, ctx);
    if (url.pathname.startsWith("/api/auth/")) return handleAuth(request, env, ctx, url.pathname);

    return env.ASSETS.fetch(request);
  },
};

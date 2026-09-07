-- Olho de Tandera — D1 (SQLite Cloudflare): autenticação
-- Aplicar: npx wrangler d1 migrations apply olhodetandera --remote

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  nome        TEXT NOT NULL,
  senha_hash  TEXT NOT NULL,
  senha_salt  TEXT NOT NULL,
  maior_de_18 INTEGER NOT NULL DEFAULT 0,  -- portão +18 da marca
  criado_em   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  criado_em  TEXT NOT NULL DEFAULT (datetime('now')),
  expira_em  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- Base da v2 ("o Olho vigia"): alertas de preço por usuário
CREATE TABLE IF NOT EXISTS price_alerts (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  origem     TEXT NOT NULL,
  destino    TEXT NOT NULL,
  ida        TEXT NOT NULL,
  volta      TEXT,
  preco_alvo INTEGER,             -- em centavos de BRL; NULL = qualquer queda
  ativo      INTEGER NOT NULL DEFAULT 1,
  criado_em  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_alerts_user ON price_alerts(user_id);

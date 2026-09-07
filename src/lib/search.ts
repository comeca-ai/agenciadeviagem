import { z } from "zod";

/**
 * Contrato de busca do Olho de Tandera.
 *
 * URL de resultados:
 *   /resultados?origem=IATA&destino=IATA&ida=YYYY-MM-DD&volta=YYYY-MM-DD&pax=N
 *
 * - origem/destino: código IATA (3 letras maiúsculas)
 * - ida: data ISO (YYYY-MM-DD), obrigatória
 * - volta: data ISO (YYYY-MM-DD), omitida em viagens de "só ida"
 * - pax: número de passageiros (1–9), default 1
 */

export interface SearchParams {
  origem: string;
  destino: string;
  ida: string;
  volta?: string;
  pax: number;
}

const iata = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, "Use o código IATA do aeroporto (ex.: GRU).");

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (use aaaa-mm-dd).");

export const searchParamsSchema = z
  .object({
    origem: iata,
    destino: iata,
    ida: isoDate,
    volta: isoDate.optional(),
    pax: z.coerce.number().int().min(1).max(9).default(1),
  })
  .refine((v) => v.origem !== v.destino, {
    message: "Origem e destino precisam ser diferentes.",
    path: ["destino"],
  })
  .refine((v) => !v.volta || v.volta >= v.ida, {
    message: "A volta não pode ser antes da ida.",
    path: ["volta"],
  });

/** Monta a URL de resultados a partir dos parâmetros validados. */
export function buildSearchUrl(params: SearchParams): string {
  const q = new URLSearchParams();
  q.set("origem", params.origem.toUpperCase());
  q.set("destino", params.destino.toUpperCase());
  q.set("ida", params.ida);
  if (params.volta) q.set("volta", params.volta);
  q.set("pax", String(params.pax ?? 1));
  return `/resultados?${q.toString()}`;
}

/**
 * Lê e valida os parâmetros de busca de uma query string.
 * Retorna `null` quando ausentes/inválidos (a página de resultados
 * usa então a rota demo padrão).
 */
export function parseSearchParams(search: string | URLSearchParams): SearchParams | null {
  const sp = typeof search === "string" ? new URLSearchParams(search) : search;
  const raw = {
    origem: sp.get("origem") ?? undefined,
    destino: sp.get("destino") ?? undefined,
    ida: sp.get("ida") ?? undefined,
    volta: sp.get("volta") ?? undefined,
    pax: sp.get("pax") ?? undefined,
  };
  if (!raw.origem || !raw.destino || !raw.ida) return null;
  const parsed = searchParamsSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

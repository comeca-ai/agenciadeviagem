import { z } from "zod";

/**
 * Contrato de busca do Olho de Tandera.
 *
 * URL de resultados:
 *   /resultados?origem=IATA&destino=IATA&ida=YYYY-MM-DD&volta=YYYY-MM-DD&pax=N
 */

export interface SearchParams {
  origem: string;
  destino: string;
  ida: string;
  volta?: string;
  pax: number;
}

function isoOffset(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

/** Ida padrão: daqui a 21 dias. Volta: +7. */
export function defaultIda(): string {
  return isoOffset(21);
}

export function defaultVolta(): string {
  return isoOffset(28);
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

export function buildSearchUrl(params: SearchParams): string {
  const q = new URLSearchParams();
  q.set("origem", params.origem.toUpperCase());
  q.set("destino", params.destino.toUpperCase());
  q.set("ida", params.ida);
  if (params.volta) q.set("volta", params.volta);
  q.set("pax", String(params.pax ?? 1));
  return `/resultados?${q.toString()}`;
}

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

/** Formatadores pt-BR compartilhados pelos componentes de Resultados. */

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

/** "R$ 3.412" */
export function fmtBRL(v: number): string {
  return brl.format(v);
}

/** "3.412" (sem o cifrão, para compor com "R$" em tamanho menor) */
export function fmtNum(v: number): string {
  return num.format(Math.round(v));
}

/** "21:50" a partir de ISO local (YYYY-MM-DDTHH:mm...) */
export function fmtHora(iso: string | null | undefined): string {
  if (!iso) return "--:--";
  const m = iso.match(/T(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : "--:--";
}

/** true quando a chegada cai no dia seguinte à partida */
export function chegadaPlus1(partida: string, chegada: string | null | undefined): boolean {
  if (!chegada) return false;
  return chegada.slice(0, 10) > partida.slice(0, 10);
}

/** Estima a chegada somando a duração à partida (fallback da API real). */
export function chegadaEstimada(partida: string, duracaoMin: number | null): string | null {
  if (duracaoMin == null) return null;
  const d = new Date(partida);
  if (Number.isNaN(d.getTime())) return null;
  const fim = new Date(d.getTime() + duracaoMin * 60_000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${fim.getFullYear()}-${p(fim.getMonth() + 1)}-${p(fim.getDate())}T${p(fim.getHours())}:${p(fim.getMinutes())}:00`;
}

/** "9h45" a partir de minutos */
export function fmtDuracao(min: number | null): string {
  if (min == null) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}

/** "12–24 mai" a partir de datas ISO */
export function fmtIntervaloDatas(ida: string, volta?: string | null): string {
  const fmt = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" });
  const d1 = new Date(`${ida}T12:00:00`);
  const a = fmt.format(d1).replace(".", "");
  if (!volta) return a;
  const d2 = new Date(`${volta}T12:00:00`);
  const b = fmt.format(d2).replace(".", "");
  // evita "12 de mai–24 de mai": tira o "de " que o pt-BR inclui
  const limpa = (s: string) => s.replace(/ de /g, " ");
  return `${limpa(a)}–${limpa(b)}`;
}

/** Hora de saída → faixa do filtro "Horário de saída" */
export type FaixaHorario = "madrugada" | "manha" | "tarde" | "noite";

export function faixaHorario(partida: string): FaixaHorario {
  const h = parseInt(partida.slice(11, 13) || "12", 10);
  if (h < 6) return "madrugada";
  if (h < 12) return "manha";
  if (h < 18) return "tarde";
  return "noite";
}

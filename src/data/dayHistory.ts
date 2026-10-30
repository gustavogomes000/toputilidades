import type { Store } from './stores';

/**
 * Histórico de dias para o Monitoramento.
 * offset 0 = HOJE (27/10/2026) -> dia EM ABERTO (dados ao vivo do AppContext).
 * offset >= 1 = dias anteriores -> sempre FECHADOS (gerados de forma determinística
 * a partir das lojas, só para a demonstração).
 */
export const TODAY_BASE = new Date(2026, 9, 27); // 27/10/2026 (Terça-feira)
export const HISTORY_DAYS = 7; // hoje + 6 dias anteriores

const pad = (n: number) => String(n).padStart(2, '0');

export interface DayInfo {
  offset: number;
  isToday: boolean;
  short: string; // 27/10
  full: string; // 27/10/2026
  weekday: string; // Terça-feira
  weekdayShort: string; // Ter
  label: string; // Terça-feira, 27/10/2026
}

const WEEKDAYS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export function getDayInfo(offset: number): DayInfo {
  const d = new Date(TODAY_BASE.getFullYear(), TODAY_BASE.getMonth(), TODAY_BASE.getDate() - offset);
  const weekday = WEEKDAYS[d.getDay()];
  const short = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
  const full = `${short}/${d.getFullYear()}`;
  return {
    offset,
    isToday: offset === 0,
    short,
    full,
    weekday,
    weekdayShort: weekday.slice(0, 3),
    label: `${weekday}, ${full}`,
  };
}

const rand = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const round2 = (v: number) => Math.round(v * 100) / 100;

/** Devolve as 26 lojas na "foto" do dia escolhido. */
export function storesForDay(liveStores: Store[], offset: number): Store[] {
  if (offset === 0) return liveStores;

  return liveStores.map((s) => {
    const factor = 0.82 + rand(s.id * 13 + offset * 7) * 0.3;
    const r = rand(s.id * 97 + offset * 31);

    let status: Store['status'] = 'fechado_ok';
    if ((s.id + offset) % 13 === 0) status = 'divergencia';
    else if (r > 0.86) status = 'fechado_compensado';

    const minutes = 20 + Math.floor(rand(s.id * 5 + offset) * 40);
    const actualClosingTime = `19:${pad(minutes)}`;

    return {
      ...s,
      status,
      actualClosingTime,
      sintegraTotal: Math.round((s.sintegraTotal * factor) / 10) * 10,
      cashPhysical: round2(s.cashPhysical * factor),
      cardTotal: round2(s.cardTotal * factor),
      pixTotal: round2(s.pixTotal * factor),
      safeCurrentBalance: Math.round((s.safeCurrentBalance * (0.7 + rand(s.id + offset) * 0.5)) / 10) * 10,
      divergenceAmount: status === 'divergencia' ? 120 : status === 'fechado_compensado' ? 35 : undefined,
      divergenceReason:
        status === 'divergencia'
          ? 'Falta de R$ 120,00 no caixa físico - auditoria acionada'
          : status === 'fechado_compensado'
          ? 'Troca na forma de pagamento (PIX x Cartão) compensada'
          : undefined,
    };
  });
}

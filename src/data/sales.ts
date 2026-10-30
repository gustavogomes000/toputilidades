export type PayMethod = 'dinheiro' | 'cartao' | 'pix' | 'outros';

export interface SintegraSale {
  id: string;
  coupon: number;
  time: string; // HH:MM:SS
  operator: string;
  method: PayMethod;
  methodDetail: string;
  items: number;
  value: number;
  flag?: 'troca_pagamento';
  note?: string;
}

// Totais do dia (Loja Nº 7 Campinas — 27/10/2026), em centavos.
// Dinheiro + Cartão + PIX + Outros = R$ 24.157,00 (total Sintegra)
export const SALES_TOTALS_CENTS: Record<PayMethod, number> = {
  dinheiro: 410550, // R$ 4.105,50
  cartao: 1198750, // R$ 11.987,50
  pix: 684600, // R$ 6.846,00
  outros: 121800, // R$ 1.218,00 (vale-presente / crediário)
};

const OPERATORS = ['Ana Paula', 'Marcos', 'Juliana', 'Rafael'];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// Divide um total (centavos) em `count` valores arredondados a R$ 0,50 que somam exatamente o total.
function splitTotal(totalCents: number, count: number, rnd: () => number): number[] {
  const minCents = 800;
  const weights = Array.from({ length: count }, () => 0.25 + rnd() * 1.9);
  const wsum = weights.reduce((a, b) => a + b, 0);
  const spendable = totalCents - minCents * count;
  const parts = weights.map((w) => {
    const raw = minCents + (spendable * w) / wsum;
    return Math.round(raw / 50) * 50;
  });
  const diff = totalCents - parts.reduce((a, b) => a + b, 0);
  const maxIdx = parts.indexOf(Math.max(...parts));
  parts[maxIdx] += diff;
  return parts;
}

function pick<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}

function toTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

export function generateLoja7Sales(): SintegraSale[] {
  const rnd = seeded(2710);

  type Draft = Omit<SintegraSale, 'id' | 'coupon' | 'time'> & { seconds: number };
  const drafts: Draft[] = [];

  const randomSeconds = () => 8 * 3600 + Math.floor(rnd() * (11.7 * 3600)); // 08:00 até ~19:42

  const push = (method: PayMethod, detail: string, valueCents: number) => {
    drafts.push({
      seconds: randomSeconds(),
      operator: pick(OPERATORS, rnd),
      method,
      methodDetail: detail,
      items: 1 + Math.floor(rnd() * 6),
      value: valueCents / 100,
    });
  };

  splitTotal(SALES_TOTALS_CENTS.dinheiro, 38, rnd).forEach((v) => push('dinheiro', 'Dinheiro', v));

  splitTotal(SALES_TOTALS_CENTS.cartao, 52, rnd).forEach((v) =>
    push('cartao', pick(['Crédito à vista', 'Crédito 2x', 'Crédito 3x', 'Débito', 'Débito'], rnd), v)
  );

  // PIX: 33 vendas + a venda especial de R$ 35,00 (troca de forma de pagamento)
  const SPECIAL_CENTS = 3500;
  splitTotal(SALES_TOTALS_CENTS.pix - SPECIAL_CENTS, 33, rnd).forEach((v) => push('pix', 'PIX QR Code', v));

  splitTotal(SALES_TOTALS_CENTS.outros, 5, rnd).forEach((v) =>
    push('outros', pick(['Vale-presente', 'Crediário'], rnd), v)
  );

  drafts.push({
    seconds: 15 * 3600 + 22 * 60 + 45, // 15:22:45
    operator: 'Ana Paula',
    method: 'pix',
    methodDetail: 'PIX (lançado no PDV)',
    items: 1,
    value: SPECIAL_CENTS / 100,
    flag: 'troca_pagamento',
    note: 'Operador lançou PIX no sistema, mas o cliente passou no cartão de crédito na maquininha Stone.',
  });

  drafts.sort((a, b) => a.seconds - b.seconds);

  // Numera os cupons em ordem cronológica de forma que a venda especial seja o cupom #8812
  const specialIdx = drafts.findIndex((d) => d.flag === 'troca_pagamento');
  const firstCoupon = 8812 - specialIdx;

  return drafts.map((d, i) => ({
    id: `sale-${i + 1}`,
    coupon: firstCoupon + i,
    time: toTime(d.seconds),
    operator: d.operator,
    method: d.method,
    methodDetail: d.methodDetail,
    items: d.items,
    value: d.value,
    flag: d.flag,
    note: d.note,
  }));
}

export const PAY_METHOD_LABEL: Record<PayMethod, string> = {
  dinheiro: '💵 Dinheiro',
  cartao: '💳 Cartão',
  pix: '📲 PIX',
  outros: '🎁 Outros',
};

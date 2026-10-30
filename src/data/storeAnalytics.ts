import { TOP_STORES_DETAILED, Store } from './stores';

export interface DayRevenue {
  date: string;
  dayOfWeek: string;
  revenue: number;
  transactions: number;
  ticketMedio: number;
  cash: number;
  card: number;
  pix: number;
}

export interface StoreOccurrence {
  id: string;
  date: string;
  type: 'divergencia' | 'compensacao' | 'atraso' | 'suporte_pos' | 'auditoria';
  title: string;
  description: string;
  amount?: number;
  status: 'resolvido' | 'em_apuracao' | 'justificado' | 'auditoria_agendada';
  author: string;
  resolutionNote?: string;
}

export interface StoreDeepAnalytics {
  storeId: number;
  storeCode: string;
  weeklyRevenue: DayRevenue[];
  occurrences: StoreOccurrence[];
  averageClosingTime: string;
  complianceScore: number; // 0 - 100
  posHealth: {
    total: number;
    online: number;
    lastBattery: number;
  };
}

// Gera dados analíticos dos últimos 7 dias para qualquer loja selecionada
export function getStoreDeepAnalytics(store: Store): StoreDeepAnalytics {
  const baseTotal = store.sintegraTotal || 24000;
  
  const days = [
    { date: '21/10/2026', dayOfWeek: 'Quarta', mult: 0.88 },
    { date: '22/10/2026', dayOfWeek: 'Quinta', mult: 0.94 },
    { date: '23/10/2026', dayOfWeek: 'Sexta', mult: 1.15 },
    { date: '24/10/2026', dayOfWeek: 'Sábado', mult: 1.32 },
    { date: '25/10/2026', dayOfWeek: 'Domingo', mult: 1.08 },
    { date: '26/10/2026', dayOfWeek: 'Segunda', mult: 0.82 },
    { date: '27/10/2026', dayOfWeek: 'Terça (Hoje)', mult: 1.0 },
  ];

  const weeklyRevenue: DayRevenue[] = days.map((d) => {
    const rev = Math.round(baseTotal * d.mult);
    const trans = Math.round(rev / 68);
    const card = Math.round(rev * 0.52);
    const pix = Math.round(rev * 0.31);
    const cash = rev - card - pix;
    return {
      date: d.date,
      dayOfWeek: d.dayOfWeek,
      revenue: rev,
      transactions: trans,
      ticketMedio: Math.round((rev / trans) * 100) / 100,
      cash,
      card,
      pix,
    };
  });

  // Ocorrências dinâmicas por loja
  const occurrences: StoreOccurrence[] = [];

  if (store.code === 'LJ07') {
    occurrences.push({
      id: 'occ-1',
      date: '27/10/2026 15:22',
      type: 'compensacao',
      title: 'Troca de Modalidade no Caixa (R$ 35,00)',
      description: 'Cliente solicitou passar no cartão após operador registrar PIX no PDV. Diferença compensada no fechamento com filipeta comprovada.',
      amount: 35.0,
      status: 'justificado',
      author: 'Carlos Eduardo (Gerente)',
      resolutionNote: 'Auditado e validado pelo supervisor Marcos Vinícius.',
    });
    occurrences.push({
      id: 'occ-2',
      date: '25/10/2026 18:40',
      type: 'suporte_pos',
      title: 'Terminal POS Cielo instável (troca de bobina)',
      description: 'Lentidão pontual na conexão 4G da maquininha Cielo Caixa 02. Reestabelecido após reinício.',
      status: 'resolvido',
      author: 'Carlos Eduardo (Gerente)',
    });
    occurrences.push({
      id: 'occ-3',
      date: '20/10/2026 20:05',
      type: 'auditoria',
      title: 'Auditoria Mensal Ordinária de Cofre',
      description: 'Conferência física sem divergências. Cofre com R$ 6.800,00 conferido nota a nota.',
      status: 'resolvido',
      author: 'Marcos Vinícius (Supervisor)',
    });
  } else if (store.code === 'LJ12') {
    occurrences.push({
      id: 'occ-12-1',
      date: '27/10/2026 19:40',
      type: 'divergencia',
      title: 'Diferença de Caixa Físico (R$ 120,00)',
      description: 'Valor informado no fechamento inferior ao apurado pelo Sintegra. Gerente afirma erro de digitação de sangria.',
      amount: 120.0,
      status: 'em_apuracao',
      author: 'Sistema de Conciliação Automática',
      resolutionNote: 'Auditoria presencial agendada com supervisor.',
    });
    occurrences.push({
      id: 'occ-12-2',
      date: '24/10/2026 20:45',
      type: 'atraso',
      title: 'Fechamento com 45 minutos de atraso',
      description: 'Loja com pico de clientes no final do expediente de sábado.',
      status: 'justificado',
      author: 'Fernanda Rocha (Gerente)',
    });
  } else {
    occurrences.push({
      id: `occ-${store.id}-1`,
      date: '27/10/2026 19:30',
      type: 'compensacao',
      title: 'Fechamento Regular Sem Quebras',
      description: 'Todas as transações do Sintegra bateram perfeitamente com as maquininhas e numerário da gaveta.',
      status: 'resolvido',
      author: `${store.manager} (Gerente)`,
    });
    occurrences.push({
      id: `occ-${store.id}-2`,
      date: '18/10/2026 14:00',
      type: 'auditoria',
      title: 'Check-in de Conformidade Presencial',
      description: 'Auditoria física de gaveta e comprovantes com aprovação 100%.',
      status: 'resolvido',
      author: store.supervisor,
    });
  }

  const complianceScore =
    store.status === 'fechado_ok' ? 98 : store.status === 'fechado_compensado' ? 92 : store.status === 'divergencia' ? 74 : 88;

  return {
    storeId: store.id,
    storeCode: store.code,
    weeklyRevenue,
    occurrences,
    averageClosingTime: store.actualClosingTime || '19:35',
    complianceScore,
    posHealth: {
      total: store.posCount || 2,
      online: store.posCount || 2,
      lastBattery: 94,
    },
  };
}

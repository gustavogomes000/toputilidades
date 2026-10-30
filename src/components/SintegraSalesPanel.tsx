import { useMemo, useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, ChevronDown, ListChecks } from 'lucide-react';
import { generateLoja7Sales, PAY_METHOD_LABEL } from '../data/sales';
import type { PayMethod } from '../data/sales';

interface SintegraSalesPanelProps {
  expected: { dinheiro: number; cartao: number; pix: number; total: number };
  syncedAt?: string | null;
}

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const PAGE = 25;

export const SintegraSalesPanel = ({ expected, syncedAt }: SintegraSalesPanelProps) => {
  const allSales = useMemo(() => generateLoja7Sales(), []);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'todas' | PayMethod>('todas');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE);

  const sums = useMemo(() => {
    const base: Record<PayMethod, { count: number; total: number }> = {
      dinheiro: { count: 0, total: 0 },
      cartao: { count: 0, total: 0 },
      pix: { count: 0, total: 0 },
      outros: { count: 0, total: 0 },
    };
    allSales.forEach((s) => {
      base[s.method].count += 1;
      base[s.method].total += s.value;
    });
    return base;
  }, [allSales]);

  const grandTotal = allSales.reduce((acc, s) => acc + s.value, 0);
  const reconciled = Math.abs(grandTotal - expected.total) < 0.01;
  const methodOk = (m: 'dinheiro' | 'cartao' | 'pix') => Math.abs(sums[m].total - expected[m]) < 0.01;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allSales.filter((s) => {
      if (filter !== 'todas' && s.method !== filter) return false;
      if (!q) return true;
      return (
        String(s.coupon).includes(q) ||
        s.operator.toLowerCase().includes(q) ||
        s.methodDetail.toLowerCase().includes(q) ||
        s.value.toFixed(2).replace('.', ',').includes(q) ||
        s.time.includes(q)
      );
    });
  }, [allSales, filter, query]);

  const shown = filtered.slice(0, visible);

  const filters: { key: 'todas' | PayMethod; label: string; count: number; total: number }[] = [
    { key: 'todas', label: 'Todas', count: allSales.length, total: grandTotal },
    { key: 'dinheiro', label: PAY_METHOD_LABEL.dinheiro, ...sums.dinheiro },
    { key: 'cartao', label: PAY_METHOD_LABEL.cartao, ...sums.cartao },
    { key: 'pix', label: PAY_METHOD_LABEL.pix, ...sums.pix },
    { key: 'outros', label: PAY_METHOD_LABEL.outros, ...sums.outros },
  ];

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full min-h-[48px] px-4 py-3 flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100 transition text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#0B1560]">
          <ListChecks className="w-4 h-4 text-brand-red" />
          Ver todas as vendas do sistema ({allSales.length} vendas • {brl(grandTotal)})
        </span>
        <span className="flex items-center gap-2">
          {reconciled ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3" /> Soma confere
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              <AlertTriangle className="w-3 h-3" /> Soma não confere
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="p-3 sm:p-4 space-y-3 animate-in fade-in duration-200">
          {/* Conferência das somas */}
          <div
            className={`p-3 rounded-xl border text-xs leading-relaxed ${
              reconciled ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              {reconciled ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
              Soma das {allSales.length} vendas: {brl(grandTotal)} {reconciled ? '=' : '≠'} Total Sintegra: {brl(expected.total)}
            </div>
            <div className="mt-1 text-[11px] opacity-90">
              Dinheiro {brl(sums.dinheiro.total)} {methodOk('dinheiro') ? '✓' : '✗'} • Cartão {brl(sums.cartao.total)}{' '}
              {methodOk('cartao') ? '✓' : '✗'} • PIX {brl(sums.pix.total)} {methodOk('pix') ? '✓' : '✗'} • Outros (vale-presente/crediário){' '}
              {brl(sums.outros.total)}
            </div>
            {syncedAt && <div className="mt-1 text-[11px] opacity-80">Última sincronização com o Sintegra: {syncedAt}</div>}
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  setFilter(f.key);
                  setVisible(PAGE);
                }}
                className={`shrink-0 min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  filter === f.key
                    ? 'bg-[#0B1560] text-white border-[#0B1560] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.label} <span className="opacity-80">({f.count})</span>
                <span className="block text-[10px] font-semibold opacity-80">{brl(f.total)}</span>
              </button>
            ))}
          </div>

          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE);
              }}
              placeholder="Buscar por cupom, operador, horário ou valor..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B1560]"
            />
          </div>

          {/* Tabela (desktop) */}
          <div className="hidden md:block border border-slate-200 rounded-xl overflow-hidden">
            <div className="max-h-[420px] overflow-auto">
              <table className="w-full text-xs text-left">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="p-2.5">Horário</th>
                    <th className="p-2.5">Cupom</th>
                    <th className="p-2.5">Operador(a)</th>
                    <th className="p-2.5">Itens</th>
                    <th className="p-2.5">Forma de pagamento</th>
                    <th className="p-2.5 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shown.map((s) => (
                    <tr
                      key={s.id}
                      className={s.flag ? 'bg-amber-100/80 border-y-2 border-amber-300' : 'hover:bg-slate-50'}
                    >
                      <td className="p-2.5 font-mono text-slate-600">{s.time}</td>
                      <td className="p-2.5 font-mono font-bold text-slate-800">#{s.coupon}</td>
                      <td className="p-2.5 text-slate-700">{s.operator}</td>
                      <td className="p-2.5 text-slate-500">{s.items}</td>
                      <td className="p-2.5">
                        <span className="font-semibold text-slate-800">{s.methodDetail}</span>
                        {s.flag && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-500 text-white font-extrabold text-[10px]">
                            ⚠️ Troca de pagamento
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-900">{brl(s.value)}</td>
                    </tr>
                  ))}
                  {shown.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">
                        Nenhuma venda encontrada para este filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards (mobile) */}
          <div className="md:hidden space-y-2 max-h-[460px] overflow-y-auto">
            {shown.map((s) => (
              <div
                key={s.id}
                className={`p-3 rounded-xl border ${s.flag ? 'bg-amber-100/80 border-amber-300' : 'bg-white border-slate-200'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-slate-800 text-sm">#{s.coupon}</span>
                  <span className="font-extrabold text-slate-900 text-sm">{brl(s.value)}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-600">
                  <span className="font-mono">{s.time}</span>
                  <span>{s.operator}</span>
                  <span>{s.items} {s.items === 1 ? 'item' : 'itens'}</span>
                </div>
                <div className="mt-1 text-xs font-semibold text-slate-800">{s.methodDetail}</div>
                {s.flag && (
                  <div className="mt-1.5 text-[11px] font-bold text-amber-900">⚠️ Troca de pagamento: {s.note}</div>
                )}
              </div>
            ))}
            {shown.length === 0 && <div className="p-6 text-center text-xs text-slate-500">Nenhuma venda encontrada.</div>}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Mostrando {shown.length} de {filtered.length} vendas
            </span>
            {filtered.length > shown.length && (
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#0B1560] hover:bg-brand-blue-hover text-white text-xs font-bold"
              >
                Ver mais {Math.min(PAGE, filtered.length - shown.length)} vendas
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Crown, 
  Medal, 
  TrendingUp, 
  DollarSign, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  ChevronRight, 
  Sparkles, 
  Store as StoreIcon, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Download,
  Flame,
  Star,
  CreditCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Store } from '../data/stores';
import { PhotoViewerModal } from '../components/PhotoViewerModal';
import { MOCK_IMAGES } from '../utils/mockImages';

type RankingCriterion = 'faturamento' | 'cartao' | 'pix' | 'pontualidade' | 'ticket';

export const StoresRankingPage: React.FC = () => {
  const { stores } = useApp();

  const [criterion, setCriterion] = useState<RankingCriterion>('faturamento');
  const [selectedRegion, setSelectedRegion] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const fmtBRL = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  // Lista ordenada de lojas de acordo com o critério
  const rankedStores = useMemo(() => {
    return stores
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.number.includes(searchQuery) ||
          s.manager.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRegion = selectedRegion === 'todas' || s.region === selectedRegion;
        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        if (criterion === 'faturamento') return b.sintegraTotal - a.sintegraTotal;
        if (criterion === 'cartao') return b.cardTotal - a.cardTotal;
        if (criterion === 'pix') return b.pixTotal - a.pixTotal;
        if (criterion === 'pontualidade') {
          const timeA = a.actualClosingTime || a.closingTimeLimit;
          const timeB = b.actualClosingTime || b.closingTimeLimit;
          return timeA.localeCompare(timeB);
        }
        if (criterion === 'ticket') {
          const ticketA = Math.round((a.sintegraTotal / 380) * 100) / 100;
          const ticketB = Math.round((b.sintegraTotal / 380) * 100) / 100;
          return ticketB - ticketA;
        }
        return b.sintegraTotal - a.sintegraTotal;
      });
  }, [stores, criterion, selectedRegion, searchQuery]);

  // Top 3 do pódio
  const top1 = rankedStores[0] || stores[0];
  const top2 = rankedStores[1] || stores[1];
  const top3 = rankedStores[2] || stores[2];

  const totalRevenue = stores.reduce((acc, s) => acc + s.sintegraTotal, 0);
  const avgRevenue = Math.round(totalRevenue / stores.length);
  const maxRevenue = top1?.sintegraTotal || 36700;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* 1. CABEÇALHO DO RANKING COM MEDALHAS */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/30 text-brand-blue text-xs font-black mb-1">
              <Trophy className="w-4 h-4 text-brand-yellow-warm" />
              Ranking Oficial da Rede • 26 Lojas TOP Utilidades
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-brand-blue tracking-tight">
              Ranking de Desempenho & Faturamento
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Acompanhe quais lojas estão liderando em vendas, eficiência e pontualidade de fechamento
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">Meta Diária da Rede:</span>
              <span className="text-lg sm:text-xl font-black text-emerald-700">
                106.2% Superada 🚀
              </span>
            </div>
          </div>
        </div>

        {/* PÓDIO OLÍMPICO DAS TOP 3 (100% RESPONSIVO PARA CELULAR & PC) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 items-end">
          
          {/* 🥈 2º LUGAR */}
          <div className="order-2 md:order-1 bg-gradient-to-t from-slate-100 to-white rounded-3xl p-5 border-2 border-slate-200 shadow-md flex flex-col items-center text-center space-y-2 relative">
            <span className="w-9 h-9 rounded-2xl bg-slate-200 text-slate-800 font-black text-sm flex items-center justify-center shadow-xs">
              2º
            </span>
            <div className="w-14 h-14 rounded-2xl bg-slate-300/60 border-2 border-slate-300 flex items-center justify-center text-slate-700 font-black text-base shadow-inner">
              {top2.number}
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vice-Líder em Vendas</span>
              <h3 className="text-sm sm:text-base font-black text-brand-blue">{top2.name}</h3>
              <p className="text-xs text-slate-500">{top2.city} • {top2.manager}</p>
            </div>
            <div className="w-full pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Total Sintegra:</span>
              <span className="text-brand-blue font-black text-sm sm:text-base">{fmtBRL(top2.sintegraTotal)}</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedStore(top2)}
              className="w-full mt-1 py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Detalhes</span>
            </button>
          </div>

          {/* 🥇 1º LUGAR (CAMPEÃ COM DESTAQUE DOURADO) */}
          <div className="order-1 md:order-2 bg-gradient-to-t from-amber-50 via-white to-amber-100/60 rounded-3xl p-6 border-2 border-brand-yellow shadow-xl flex flex-col items-center text-center space-y-3 relative scale-[1.02]">
            <div className="absolute -top-4 px-4 py-1 rounded-full bg-gradient-to-r from-brand-yellow to-amber-400 text-brand-blue text-xs font-black shadow-lg flex items-center gap-1.5 border border-amber-300">
              <Crown className="w-4 h-4 text-brand-blue" />
              <span>1º LUGAR • CAMPEÃ DA REDE</span>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-brand-yellow text-brand-blue font-black text-xl flex items-center justify-center shadow-lg border-2 border-amber-400 mt-2">
              {top1.number}
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-brand-red animate-bounce" />
                Maior Faturamento do Dia
              </span>
              <h3 className="text-base sm:text-xl font-black text-brand-blue mt-0.5">{top1.name}</h3>
              <p className="text-xs text-slate-600 font-semibold">{top1.city} • Gerente: <strong>{top1.manager}</strong></p>
            </div>
            <div className="w-full pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">Faturamento Oficial:</span>
              <span className="text-xl sm:text-2xl font-black text-brand-blue">{fmtBRL(top1.sintegraTotal)}</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedStore(top1)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-red to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs sm:text-sm font-black transition shadow-md flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-brand-yellow" />
              <span>Raio-X da Campeã</span>
            </button>
          </div>

          {/* 🥉 3º LUGAR */}
          <div className="order-3 bg-gradient-to-t from-orange-50 to-white rounded-3xl p-5 border-2 border-amber-200 shadow-md flex flex-col items-center text-center space-y-2 relative">
            <span className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 font-black text-sm flex items-center justify-center shadow-xs">
              3º
            </span>
            <div className="w-14 h-14 rounded-2xl bg-amber-200/60 border-2 border-amber-300 flex items-center justify-center text-amber-900 font-black text-base shadow-inner">
              {top3.number}
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">3º Colocada</span>
              <h3 className="text-sm sm:text-base font-black text-brand-blue">{top3.name}</h3>
              <p className="text-xs text-slate-500">{top3.city} • {top3.manager}</p>
            </div>
            <div className="w-full pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Total Sintegra:</span>
              <span className="text-brand-blue font-black text-sm sm:text-base">{fmtBRL(top3.sintegraTotal)}</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedStore(top3)}
              className="w-full mt-1 py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Detalhes</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. BARRA DE FILTROS E ORDENAÇÃO DO RANKING */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-brand-blue" />
            Ordenar Ranking Por:
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            {rankedStores.length} Lojas Classificadas
          </span>
        </div>

        {/* Pílulas de Critérios com Scroll Suave no Celular */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setCriterion('faturamento')}
            className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 ${
              criterion === 'faturamento'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>💰 Maior Faturamento (R$)</span>
          </button>

          <button
            type="button"
            onClick={() => setCriterion('cartao')}
            className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 ${
              criterion === 'cartao'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>💳 Líder em Cartões</span>
          </button>

          <button
            type="button"
            onClick={() => setCriterion('pix')}
            className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 ${
              criterion === 'pix'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>📲 Campeã em PIX</span>
          </button>

          <button
            type="button"
            onClick={() => setCriterion('pontualidade')}
            className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 ${
              criterion === 'pontualidade'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>⏰ Fechamento Mais Rápido</span>
          </button>
        </div>

        {/* Barra de Busca e Região */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar loja pelo nome, número ou gerente..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <option value="todas">Todas as Regiões (26 Lojas)</option>
            <option value="Metropolitana">Região Metropolitana</option>
            <option value="Campinas e Região">Campinas e Região</option>
            <option value="Vale do Paraíba">Vale do Paraíba</option>
            <option value="Litoral">Litoral</option>
            <option value="Interior">Interior</option>
          </select>
        </div>
      </div>

      {/* 3. LISTA COMPLETA CLASSIFICADA DO 1º AO 26º */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-black text-brand-blue flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-red" />
            Classificação Geral da Rede (1º ao 26º)
          </h2>
          <span className="text-xs text-slate-500 font-bold">
            Posição Consolidada 27/10/2026
          </span>
        </div>

        {/* Grid de Linhas do Ranking com Barras Visuais */}
        <div className="space-y-2.5">
          {rankedStores.map((store, index) => {
            const position = index + 1;
            const isLoja7 = store.code === 'LJ07';
            const percentOfLeader = Math.round((store.sintegraTotal / maxRevenue) * 100);

            return (
              <div
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isLoja7
                    ? 'border-brand-blue bg-blue-50/50 ring-2 ring-brand-blue/20'
                    : position <= 3
                    ? 'border-amber-200 bg-amber-50/20 hover:bg-amber-50/40'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Lado Esquerdo: Posição + Dados da Loja */}
                <div className="flex items-center gap-3 min-w-[280px]">
                  <span className={`w-8 h-8 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center shrink-0 ${
                    position === 1
                      ? 'bg-brand-yellow text-brand-blue shadow-md'
                      : position === 2
                      ? 'bg-slate-300 text-slate-800'
                      : position === 3
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {position}º
                  </span>

                  <div className="w-10 h-10 rounded-xl bg-brand-blue text-white font-black text-xs flex items-center justify-center shrink-0">
                    {store.number}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm text-brand-blue">{store.name}</span>
                      {isLoja7 && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-brand-yellow text-brand-blue">
                          ⭐ Sua Loja
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {store.city} • Gerente: <strong>{store.manager}</strong>
                    </div>
                  </div>
                </div>

                {/* Centro: Barra de Eficiência e Mix de Meios */}
                <div className="flex-1 space-y-1 sm:px-4">
                  <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                    <span>Desempenho relativo</span>
                    <span className="font-bold text-slate-800">{percentOfLeader}% da líder</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        position <= 3
                          ? 'bg-gradient-to-r from-brand-yellow via-amber-400 to-brand-red'
                          : 'bg-gradient-to-r from-brand-blue to-sky-500'
                      }`}
                      style={{ width: `${percentOfLeader}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>💳 Cartão: {fmtBRL(store.cardTotal)}</span>
                    <span>📲 PIX: {fmtBRL(store.pixTotal)}</span>
                    <span>💵 Dinheiro: {fmtBRL(store.cashPhysical)}</span>
                  </div>
                </div>

                {/* Lado Direito: Faturamento em Destaque & Status */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <div className="text-base sm:text-lg font-black text-brand-blue">
                      {fmtBRL(store.sintegraTotal)}
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block ${
                      store.status === 'fechado_ok'
                        ? 'bg-emerald-100 text-emerald-800'
                        : store.status === 'fechado_compensado'
                        ? 'bg-amber-100 text-amber-900'
                        : store.status === 'divergencia'
                        ? 'bg-red-100 text-brand-red'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {store.status === 'fechado_ok' && `🟢 Fechado ${store.actualClosingTime || '19:30'}`}
                      {store.status === 'fechado_compensado' && '🟡 Compensado'}
                      {store.status === 'divergencia' && '🔴 Falta R$ 120'}
                      {store.status === 'aberto' && `⏳ Aberto`}
                    </span>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 hidden sm:block" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. MODAL DETALHADO DO RAIO-X DA LOJA CLICADA NO RANKING */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
            
            <div className="h-1.5 w-full flex">
              <div className="w-1/3 bg-brand-red" />
              <div className="w-1/3 bg-brand-yellow" />
              <div className="w-1/3 bg-brand-blue" />
            </div>

            <div className="p-5 sm:p-7 space-y-5 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-black text-sm">
                    {selectedStore.number}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-brand-blue">{selectedStore.name}</h3>
                    <p className="text-xs text-slate-500">{selectedStore.city} • Gerente: <strong>{selectedStore.manager}</strong></p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStore(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              {/* Faturamento Discriminado */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Espelho dos Valores de Caixa da Filial</span>
                  <span className="text-brand-blue font-black text-sm">{fmtBRL(selectedStore.sintegraTotal)}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400">💳 Cartões POS:</span>
                    <div className="font-black text-slate-800 text-sm mt-0.5">{fmtBRL(selectedStore.cardTotal)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400">📲 PIX no POS:</span>
                    <div className="font-black text-emerald-700 text-sm mt-0.5">{fmtBRL(selectedStore.pixTotal)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400">💵 Dinheiro Físico:</span>
                    <div className="font-black text-amber-800 text-sm mt-0.5">{fmtBRL(selectedStore.cashPhysical)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">Saldo Atual no Cofre da Loja:</span>
                  <strong className="text-amber-900 font-black">{fmtBRL(selectedStore.safeCurrentBalance)}</strong>
                </div>
              </div>

              {selectedStore.divergenceReason && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <strong>⚠️ Observação de Fechamento:</strong> {selectedStore.divergenceReason}
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedStore(null)}
                className="w-full py-3 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-md transition"
              >
                Fechar Detalhes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

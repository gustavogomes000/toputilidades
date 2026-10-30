import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Store as StoreIcon, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Calendar, 
  ArrowUpDown, 
  Eye, 
  Layers, 
  Clock, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Sparkles,
  ChevronRight,
  Plus,
  X,
  FileSpreadsheet,
  Download,
  Play,
  RotateCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Store } from '../data/stores';
import { getStoreDeepAnalytics, StoreDeepAnalytics, DayRevenue, StoreOccurrence } from '../data/storeAnalytics';
import { ExecutivePresentationModal } from '../components/ExecutivePresentationModal';

type TimePeriod = 'hoje' | 'ontem' | '7dias' | 'este_mes' | 'mes_anterior' | 'ano_2026' | 'ano_2025' | 'custom';

export const StoreComparisonPage: React.FC = () => {
  const { stores } = useApp();

  // Abas principais
  const [activeTab, setActiveTab] = useState<'comparativo' | 'detalhes' | 'tabela'>('comparativo');

  // Filtro Temporal Global (Diário, Mensal, Anual, Customizado)
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('hoje');
  const [customStartDate, setCustomStartDate] = useState('2026-10-01');
  const [customEndDate, setCustomEndDate] = useState('2026-10-27');

  // Modal da Apresentação Executiva em Slides
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  // Lojas selecionadas para o comparativo lado a lado (IDs das lojas)
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([1, 4, 7]);

  // Loja selecionada para visão profunda (Raio-X de Faturamento por Dia e Ocorrências)
  const [selectedStoreId, setSelectedStoreId] = useState<number>(7); // Loja 7 Campinas por padrão
  const singleStore = stores.find((s) => s.id === selectedStoreId) || stores[0];
  const deepAnalytics = useMemo(() => getStoreDeepAnalytics(singleStore), [singleStore]);

  // Loja de Comparação Direta Dia a Dia (Benchmark)
  const [benchmarkStoreId, setBenchmarkStoreId] = useState<number>(1); // Loja 01 Matriz Centro por padrão
  const benchmarkStore = stores.find((s) => s.id === benchmarkStoreId) || stores[0];
  const benchmarkAnalytics = useMemo(() => getStoreDeepAnalytics(benchmarkStore), [benchmarkStore]);

  // Busca rápida de filial
  const [searchStoreDetail, setSearchStoreDetail] = useState('');

  // Multiplicador do período para simulação realista de dias, meses e anos
  const periodMultiplier = useMemo(() => {
    switch (timePeriod) {
      case 'hoje': return 1.0;
      case 'ontem': return 0.96;
      case '7dias': return 6.8;
      case 'este_mes': return 26.4;
      case 'mes_anterior': return 30.0;
      case 'ano_2026': return 298.0;
      case 'ano_2025': return 365.0;
      case 'custom': return 14.5;
      default: return 1.0;
    }
  }, [timePeriod]);

  const periodLabel = useMemo(() => {
    switch (timePeriod) {
      case 'hoje': return 'Hoje (27/10/2026) - Ao Vivo';
      case 'ontem': return 'Ontem (26/10/2026) - Fechado';
      case '7dias': return 'Últimos 7 Dias (21/10 a 27/10/2026)';
      case 'este_mes': return 'Mês Atual (Outubro / 2026)';
      case 'mes_anterior': return 'Mês Anterior (Setembro / 2026)';
      case 'ano_2026': return 'Ano 2026 (Acumulado)';
      case 'ano_2025': return 'Ano Consolidado 2025';
      case 'custom': return `Período Personalizado (${customStartDate} a ${customEndDate})`;
      default: return 'Hoje (27/10/2026)';
    }
  }, [timePeriod, customStartDate, customEndDate]);

  // Filtros da Tabela Discriminada Geral
  const [searchFilter, setSearchFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('todas');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'faturamento' | 'cofre' | 'divergencia' | 'numero'>('faturamento');

  // Lojas do comparativo
  const comparedStores = useMemo(() => {
    return selectedForCompare
      .map((id) => stores.find((s) => s.id === id))
      .filter((s): s is Store => Boolean(s));
  }, [selectedForCompare, stores]);

  const toggleStoreForCompare = (storeId: number) => {
    if (selectedForCompare.includes(storeId)) {
      if (selectedForCompare.length <= 1) return; // manter ao menos 1
      setSelectedForCompare(selectedForCompare.filter((id) => id !== storeId));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('Você pode comparar até 4 lojas simultaneamente para melhor visualização no celular e desktop.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, storeId]);
    }
  };

  // Lojas filtradas para a tabela completa
  const tableStores = useMemo(() => {
    return stores
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          s.city.toLowerCase().includes(searchFilter.toLowerCase()) ||
          s.number.includes(searchFilter) ||
          s.manager.toLowerCase().includes(searchFilter.toLowerCase());

        const matchesRegion = regionFilter === 'todas' || s.region === regionFilter;
        const matchesStatus = statusFilter === 'todos' || s.status === statusFilter;
        return matchesSearch && matchesRegion && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'faturamento') return b.sintegraTotal - a.sintegraTotal;
        if (sortBy === 'cofre') return b.safeCurrentBalance - a.safeCurrentBalance;
        if (sortBy === 'divergencia') return (b.divergenceAmount || 0) - (a.divergenceAmount || 0);
        return parseInt(a.number, 10) - parseInt(b.number, 10);
      });
  }, [stores, searchFilter, regionFilter, statusFilter, sortBy]);

  // Cálculos de KPIs gerais da rede no período
  const totalNetworkRevenue = Math.round(stores.reduce((acc, s) => acc + s.sintegraTotal, 0) * periodMultiplier);
  const totalNetworkSafe = stores.reduce((acc, s) => acc + s.safeCurrentBalance, 0);
  const maxRevenueStore = stores.reduce((prev, curr) => (curr.sintegraTotal > prev.sintegraTotal ? curr : prev), stores[0]);
  const avgStoreRevenue = Math.round(totalNetworkRevenue / stores.length);
  const storesWithDivergence = stores.filter((s) => s.status === 'divergencia').length;

  const fmtBRL = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* 1. TOPO EXECUTIVO COM BOTÃO DE APRESENTAÇÃO & KPIS DA REDE */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/30 text-brand-blue text-xs font-black mb-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-yellow-warm" />
              BI Corporativo & Auditoria Analítica • 26 Filiais
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-brand-blue tracking-tight">
              Acompanhamento Diário/Mensal & Comparativo de Lojas
            </h1>
            <p className="text-xs text-slate-500">
              Filtre por dias, meses ou anos e visualize o caixa do período com apresentação de diretoria
            </p>
          </div>

          {/* Botão de Destaque: GERAR APRESENTAÇÃO EXECUTIVA (SLIDES) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPresentationOpen(true)}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-gradient-to-r from-brand-red via-red-600 to-brand-blue hover:from-red-600 hover:to-brand-blue-hover text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>🎬 GERAR APRESENTAÇÃO EXECUTIVA (SLIDES)</span>
            </button>
          </div>
        </div>

        {/* BARRA DE FILTROS TEMPORAIS (DIAS, MESES, ANOS, CUSTOMIZADO) */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-red" />
              Filtrar Período de Análise:
            </span>
            <span className="text-brand-blue font-bold text-[11px] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {periodLabel}
            </span>
          </div>

          {/* Pílulas de Seleção de Tempo com rolagem horizontal suave no celular */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTimePeriod('hoje')}
              className={`px-3 py-2 rounded-xl shrink-0 transition flex items-center gap-1 ${
                timePeriod === 'hoje'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>🟡 Hoje (27/10)</span>
            </button>

            <button
              type="button"
              onClick={() => setTimePeriod('ontem')}
              className={`px-3 py-2 rounded-xl shrink-0 transition flex items-center gap-1 ${
                timePeriod === 'ontem'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Ontem (26/10)</span>
            </button>

            <button
              type="button"
              onClick={() => setTimePeriod('7dias')}
              className={`px-3 py-2 rounded-xl shrink-0 transition flex items-center gap-1 ${
                timePeriod === '7dias'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Últimos 7 Dias</span>
            </button>

            <button
              type="button"
              onClick={() => setTimePeriod('este_mes')}
              className={`px-3 py-2 rounded-xl shrink-0 transition flex items-center gap-1 ${
                timePeriod === 'este_mes'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Outubro / 2026</span>
            </button>

            <button
              type="button"
              onClick={() => setTimePeriod('mes_anterior')}
              className={`px-3 py-2 rounded-xl shrink-0 transition flex items-center gap-1 ${
                timePeriod === 'mes_anterior'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Setembro / 2026</span>
            </button>

            <button
              type="button"
              onClick={() => setTimePeriod('ano_2026')}
              className={`px-3 py-2 rounded-xl shrink-0 transition flex items-center gap-1 ${
                timePeriod === 'ano_2026'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Ano 2026</span>
            </button>

            <button
              type="button"
              onClick={() => setTimePeriod('ano_2025')}
              className={`px-3 py-2 rounded-xl shrink-0 transition flex items-center gap-1 ${
                timePeriod === 'ano_2025'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Ano 2025</span>
            </button>

            <button
              type="button"
              onClick={() => setTimePeriod('custom')}
              className={`px-3 py-2 rounded-xl shrink-0 transition flex items-center gap-1 ${
                timePeriod === 'custom'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Personalizado</span>
            </button>
          </div>

          {/* Painel de Datas Customizadas (se selecionado) */}
          {timePeriod === 'custom' && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-3 text-xs animate-in fade-in">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-600">De:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-bold focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-600">Até:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-bold focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">
                Período de {customStartDate} até {customEndDate} calculado automaticamente.
              </span>
            </div>
          )}
        </div>

        {/* 4 Cards de Destaque Executivo do Período */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Faturamento no Período</span>
              <DollarSign className="w-4 h-4 text-brand-blue" />
            </div>
            <div className="text-base sm:text-xl font-black text-brand-blue mt-1">
              {fmtBRL(totalNetworkRevenue)}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              Média: {fmtBRL(avgStoreRevenue)} / filial
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Custódia em Cofres</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-base sm:text-xl font-black text-amber-900 mt-1">
              {fmtBRL(totalNetworkSafe)}
            </div>
            <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
              Conferido nas 26 lojas
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Regularidade de Caixa</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-base sm:text-xl font-black text-emerald-700 mt-1">
              96.2% Homologado
            </div>
            <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
              25 de 26 lojas conciliadas
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Lojas em Apuração</span>
              <AlertTriangle className="w-4 h-4 text-brand-red" />
            </div>
            <div className="text-base sm:text-xl font-black text-brand-red mt-1">
              {storesWithDivergence} Loja (LJ12)
            </div>
            <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
              Auditor em deslocamento
            </div>
          </div>
        </div>

        {/* Alternador das 3 Visões Rápidas */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('comparativo')}
            className={`py-2 px-2 sm:px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'comparativo'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">⚖️ Comparativo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('detalhes')}
            className={`py-2 px-2 sm:px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'detalhes'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">🔍 Raio-X & Dia a Dia</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tabela')}
            className={`py-2 px-2 sm:px-3 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'tabela'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">📋 Tabela (26 Lojas)</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ABA 1: COMPARATIVO LADO A LADO ENTRE AS LOJAS             */}
      {/* ========================================================= */}
      {activeTab === 'comparativo' && (
        <div className="space-y-6">
          
          {/* Seletor de Lojas para o Comparativo */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-card space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-brand-blue flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand-red" />
                  Selecione até 4 Lojas para Comparar no Período ({periodLabel})
                </h3>
                <p className="text-xs text-slate-500">
                  Toque para adicionar ou remover lojas do grid de comparação
                </p>
              </div>

              {/* Atalhos Rápidos */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-slate-400 font-bold text-[11px]">Atalhos:</span>
                <button
                  type="button"
                  onClick={() => setSelectedForCompare([1, 4, 7])}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition"
                >
                  Matriz vs Leste vs Campinas
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedForCompare([4, 15, 1, 26])}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition"
                >
                  Top 4 Faturamento
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedForCompare([7, 12])}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-[11px] transition"
                >
                  Compensada (LJ07) vs Quebra (LJ12)
                </button>
              </div>
            </div>

            {/* Chips de todas as 26 lojas com toggle */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {stores.map((s) => {
                const isSelected = selectedForCompare.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleStoreForCompare(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-blue text-white shadow-sm ring-2 ring-brand-blue/30'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{s.number}</span>
                    <span className="max-w-[120px] truncate">{s.name.replace(/Loja\s+(Nº\s+)?\d+\s+-\s+/, '')}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-yellow" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Lado a Lado das Lojas Selecionadas */}
          <div className={`grid grid-cols-1 md:grid-cols-2 ${comparedStores.length >= 3 ? 'lg:grid-cols-3' : ''} ${comparedStores.length === 4 ? 'xl:grid-cols-4' : ''} gap-4`}>
            {comparedStores.map((store) => {
              const isLoja7 = store.code === 'LJ07';
              const scaledRev = Math.round(store.sintegraTotal * periodMultiplier);
              const cardTotal = Math.round(store.cardTotal * periodMultiplier);
              const pixTotal = Math.round(store.pixTotal * periodMultiplier);
              const cashTotal = Math.round(store.cashPhysical * periodMultiplier);

              const cardPercent = Math.round((cardTotal / scaledRev) * 100);
              const pixPercent = Math.round((pixTotal / scaledRev) * 100);
              const cashPercent = 100 - cardPercent - pixPercent;

              return (
                <div
                  key={store.id}
                  className={`bg-white rounded-3xl p-4 sm:p-5 border shadow-card flex flex-col justify-between space-y-4 transition ${
                    isLoja7
                      ? 'border-brand-blue ring-2 ring-brand-blue/20 bg-blue-50/15'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Header do Card da Loja */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-brand-blue text-white text-[10px] font-black">
                            {store.code}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            store.status === 'fechado_ok'
                              ? 'bg-emerald-100 text-emerald-800'
                              : store.status === 'fechado_compensado'
                              ? 'bg-amber-100 text-amber-900'
                              : store.status === 'divergencia'
                              ? 'bg-red-100 text-brand-red'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {store.status === 'fechado_ok' && '🟢 Fechado OK'}
                            {store.status === 'fechado_compensado' && '🟡 Compensado'}
                            {store.status === 'divergencia' && '🔴 Divergência'}
                            {store.status === 'aberto' && '⏳ Em Aberto'}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-brand-blue mt-1.5">{store.name}</h4>
                        <div className="text-[11px] text-slate-500">
                          {store.city} • Gerente: <strong>{store.manager}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleStoreForCompare(store.id)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                        title="Remover do comparativo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Faturamento em Destaque no Período */}
                    <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Faturamento ({periodLabel})
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-brand-blue mt-0.5">
                        {fmtBRL(scaledRev)}
                      </div>
                      {/* Barra de Faturamento relativo ao topo da rede */}
                      <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-yellow to-brand-red rounded-full"
                          style={{ width: `${Math.min(100, Math.round((store.sintegraTotal / maxRevenueStore.sintegraTotal) * 100))}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-1 flex justify-between">
                        <span>Eficiência no período</span>
                        <span>{Math.round((store.sintegraTotal / maxRevenueStore.sintegraTotal) * 100)}% da líder</span>
                      </div>
                    </div>

                    {/* Repartição de Pagamento */}
                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-bold text-slate-700">Mix de Meios de Pagamento</div>
                      
                      {/* Barra Segmentada */}
                      <div className="w-full h-3 rounded-full overflow-hidden flex">
                        <div style={{ width: `${cardPercent}%` }} className="bg-brand-blue" title={`Cartão: ${cardPercent}%`} />
                        <div style={{ width: `${pixPercent}%` }} className="bg-emerald-500" title={`PIX: ${pixPercent}%`} />
                        <div style={{ width: `${cashPercent}%` }} className="bg-amber-400" title={`Dinheiro: ${cashPercent}%`} />
                      </div>

                      <div className="grid grid-cols-3 gap-1 text-[11px] pt-1">
                        <div>
                          <div className="text-slate-400 text-[10px]">💳 Cartão ({cardPercent}%)</div>
                          <div className="font-bold text-slate-800">{fmtBRL(cardTotal)}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-[10px]">📲 PIX ({pixPercent}%)</div>
                          <div className="font-bold text-slate-800">{fmtBRL(pixTotal)}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-[10px]">💵 Espécie ({cashPercent}%)</div>
                          <div className="font-bold text-slate-800">{fmtBRL(cashTotal)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Métricas Operacionais */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Saldo Atual do Cofre:</span>
                        <strong className="text-amber-900 font-extrabold">{fmtBRL(store.safeCurrentBalance)}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Limite Homologado:</span>
                        <span className="text-slate-700 font-bold">{fmtBRL(store.safeLimit)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Terminais POS:</span>
                        <span className="text-slate-800 font-bold">{store.posCount} Maquininhas</span>
                      </div>
                    </div>

                    {/* Ocorrência / Divergência */}
                    {store.divergenceReason && (
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                        <strong>⚠️ Ocorrência:</strong> {store.divergenceReason}
                      </div>
                    )}
                  </div>

                  {/* Botão de Ver Raio-X Detalhado desta loja */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStoreId(store.id);
                      setActiveTab('detalhes');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Raio-X & Faturamento por Dia</span>
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* ABA 2: RAIO-X & FATURAMENTO POR DIA DA LOJA SELECIONADA   */}
      {/* ========================================================= */}
      {activeTab === 'detalhes' && (
        <div className="space-y-6">
          
          {/* Seletor da Loja em Análise */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-black text-base shadow-md shrink-0">
                {singleStore.number}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-brand-blue">{singleStore.name}</h3>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    singleStore.status === 'fechado_ok'
                      ? 'bg-emerald-100 text-emerald-800'
                      : singleStore.status === 'fechado_compensado'
                      ? 'bg-amber-100 text-amber-900'
                      : singleStore.status === 'divergencia'
                      ? 'bg-red-100 text-brand-red'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {singleStore.status === 'fechado_ok' && '🟢 Fechado OK'}
                    {singleStore.status === 'fechado_compensado' && '🟡 Compensado'}
                    {singleStore.status === 'divergencia' && '🔴 Divergência'}
                    {singleStore.status === 'aberto' && '⏳ Em Aberto'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {singleStore.city} • Gerente: <strong>{singleStore.manager}</strong> ({singleStore.managerPhone}) • Supervisor: {singleStore.supervisor}
                </div>
              </div>
            </div>

            {/* Busca & Dropdown de Troca de Loja */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar filial..."
                  value={searchStoreDetail}
                  onChange={(e) => setSearchStoreDetail(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue w-full sm:w-40"
                />
              </div>

              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(parseInt(e.target.value, 10))}
                className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                {stores
                  .filter((s) =>
                    !searchStoreDetail ||
                    s.name.toLowerCase().includes(searchStoreDetail.toLowerCase()) ||
                    s.city.toLowerCase().includes(searchStoreDetail.toLowerCase()) ||
                    s.number.includes(searchStoreDetail)
                  )
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.number} - {s.name} ({s.city})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* FATURAMENTO DETALHADO POR DIA (ÚLTIMOS 7 DIAS) */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-brand-blue flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-red" />
                  Evolução do Faturamento por Dia da Filial
                </h3>
                <p className="text-xs text-slate-500">
                  Desempenho diário discriminado com ticket médio, transações e divisão de recebimento
                </p>
              </div>

              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
                Total 7 Dias: {fmtBRL(deepAnalytics.weeklyRevenue.reduce((acc, d) => acc + d.revenue, 0))}
              </div>
            </div>

            {/* Gráfico de Barras do Faturamento por Dia */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-4 pb-2 items-end min-h-[160px]">
              {deepAnalytics.weeklyRevenue.map((d, i) => {
                const maxWeek = Math.max(...deepAnalytics.weeklyRevenue.map((x) => x.revenue));
                const heightPercent = Math.round((d.revenue / maxWeek) * 100);
                const isToday = i === deepAnalytics.weeklyRevenue.length - 1;

                return (
                  <div key={d.date} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[9px] sm:text-[10px] font-black text-slate-700 group-hover:text-brand-blue truncate">
                      R$ {Math.round(d.revenue / 1000)}k
                    </span>
                    <div className="w-full bg-slate-100 rounded-xl h-24 sm:h-28 relative flex items-end overflow-hidden p-0.5">
                      <div
                        className={`w-full rounded-lg transition-all duration-500 ${
                          isToday
                            ? 'bg-gradient-to-t from-brand-red to-brand-yellow shadow-md'
                            : 'bg-gradient-to-t from-brand-blue to-sky-500'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-extrabold ${isToday ? 'text-brand-red' : 'text-slate-500'}`}>
                      {d.dayOfWeek.split(' ')[0]}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-slate-400">{d.date.slice(0, 5)}</span>
                  </div>
                );
              })}
            </div>

            {/* Tabela Dia a Dia com Dados Discriminados (com scroll horizontal mobile) */}
            <div className="border border-slate-200 rounded-2xl overflow-x-auto no-scrollbar text-xs">
              <table className="w-full text-left min-w-[640px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="p-3">Data</th>
                    <th className="p-3">Dia</th>
                    <th className="p-3">Faturamento Total</th>
                    <th className="p-3">Transações</th>
                    <th className="p-3">Ticket Médio</th>
                    <th className="p-3">💳 Cartão</th>
                    <th className="p-3">📲 PIX</th>
                    <th className="p-3">💵 Dinheiro</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deepAnalytics.weeklyRevenue.map((d, idx) => {
                    const isToday = idx === deepAnalytics.weeklyRevenue.length - 1;
                    return (
                      <tr key={d.date} className={isToday ? 'bg-amber-50/50 font-bold' : 'hover:bg-slate-50'}>
                        <td className="p-3 font-mono text-slate-700">{d.date}</td>
                        <td className="p-3 font-bold text-slate-800">{d.dayOfWeek}</td>
                        <td className="p-3 font-black text-brand-blue">{fmtBRL(d.revenue)}</td>
                        <td className="p-3 text-slate-600">{d.transactions} cupons</td>
                        <td className="p-3 text-slate-700">{fmtBRL(d.ticketMedio)}</td>
                        <td className="p-3 text-brand-blue font-bold">{fmtBRL(d.card)}</td>
                        <td className="p-3 text-emerald-700 font-bold">{fmtBRL(d.pix)}</td>
                        <td className="p-3 text-amber-800 font-bold">{fmtBRL(d.cash)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            isToday ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isToday ? '🟡 Em Aberto' : '✅ Fechado'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* COMPARATIVO DIRETO DIA A DIA: LOJA A vs LOJA B */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-50 text-brand-red text-xs font-black mb-1">
                  ⚔️ Confronto Direto • Loja vs Loja
                </div>
                <h3 className="text-base sm:text-lg font-black text-brand-blue flex items-center gap-2">
                  Comparativo de Faturamento Dia a Dia ({singleStore.code} vs {benchmarkStore.code})
                </h3>
                <p className="text-xs text-slate-500">
                  Compare o desempenho de cada dia da semana entre {singleStore.name} e outra loja de referência da rede
                </p>
              </div>

              {/* Seletor de Loja de Benchmark */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 shrink-0">Comparar com:</span>
                <select
                  value={benchmarkStoreId}
                  onChange={(e) => setBenchmarkStoreId(parseInt(e.target.value, 10))}
                  className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  {stores
                    .filter((s) => s.id !== singleStore.id)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.number} - {s.name} ({s.city})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Cabeçalho de Comparação das Duas Lojas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center font-black text-sm">
                    {singleStore.number}
                  </div>
                  <div>
                    <div className="text-xs font-black text-brand-blue">{singleStore.name}</div>
                    <div className="text-[11px] text-slate-500">{singleStore.city} • Gerente: {singleStore.manager}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total 7 Dias</div>
                  <div className="text-sm font-black text-brand-blue">
                    {fmtBRL(deepAnalytics.weeklyRevenue.reduce((acc, d) => acc + d.revenue, 0))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-sm">
                    {benchmarkStore.number}
                  </div>
                  <div>
                    <div className="text-xs font-black text-amber-900">{benchmarkStore.name}</div>
                    <div className="text-[11px] text-slate-500">{benchmarkStore.city} • Gerente: {benchmarkStore.manager}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total 7 Dias</div>
                  <div className="text-sm font-black text-amber-900">
                    {fmtBRL(benchmarkAnalytics.weeklyRevenue.reduce((acc, d) => acc + d.revenue, 0))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela Comparativa Dia a Dia */}
            <div className="border border-slate-200 rounded-2xl overflow-x-auto no-scrollbar text-xs">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="p-3">Data & Dia</th>
                    <th className="p-3 bg-blue-50/50 text-brand-blue">{singleStore.number} - {singleStore.name}</th>
                    <th className="p-3 bg-amber-50/50 text-amber-900">{benchmarkStore.number} - {benchmarkStore.name}</th>
                    <th className="p-3">Diferença (R$)</th>
                    <th className="p-3">Variação (%)</th>
                    <th className="p-3 text-center">Vencedor do Dia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deepAnalytics.weeklyRevenue.map((d, idx) => {
                    const benchDay = benchmarkAnalytics.weeklyRevenue[idx] || benchmarkAnalytics.weeklyRevenue[0];
                    const diff = d.revenue - benchDay.revenue;
                    const percentDiff = benchDay.revenue > 0 ? ((diff / benchDay.revenue) * 100).toFixed(1) : '0';
                    const storeAWins = diff >= 0;

                    return (
                      <tr key={d.date} className="hover:bg-slate-50 transition">
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{d.dayOfWeek}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{d.date}</div>
                        </td>
                        <td className="p-3 bg-blue-50/20">
                          <div className="font-black text-brand-blue">{fmtBRL(d.revenue)}</div>
                          <div className="text-[10px] text-slate-500">{d.transactions} cupons • TM: {fmtBRL(d.ticketMedio)}</div>
                        </td>
                        <td className="p-3 bg-amber-50/20">
                          <div className="font-black text-amber-900">{fmtBRL(benchDay.revenue)}</div>
                          <div className="text-[10px] text-slate-500">{benchDay.transactions} cupons • TM: {fmtBRL(benchDay.ticketMedio)}</div>
                        </td>
                        <td className="p-3 font-mono font-bold">
                          <span className={diff >= 0 ? 'text-emerald-700' : 'text-brand-red'}>
                            {diff >= 0 ? '+' : ''}{fmtBRL(diff)}
                          </span>
                        </td>
                        <td className="p-3 font-bold">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            diff >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-brand-red'
                          }`}>
                            {diff >= 0 ? `+${percentDiff}%` : `${percentDiff}%`}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {storeAWins ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-brand-blue font-extrabold text-[11px]">
                              🏆 {singleStore.code}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px]">
                              🏆 {benchmarkStore.code}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* HISTÓRICO DE OCORRÊNCIAS & AUDITORIAS DA FILIAL */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-brand-blue flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Registro Oficial de Ocorrências & Apurações da Loja
              </h3>
              <span className="text-xs text-slate-500 font-bold">
                {deepAnalytics.occurrences.length} Registros
              </span>
            </div>

            <div className="space-y-3">
              {deepAnalytics.occurrences.map((occ) => (
                <div
                  key={occ.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2 hover:bg-slate-50 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        occ.type === 'divergencia'
                          ? 'bg-red-100 text-brand-red border border-red-200'
                          : occ.type === 'compensacao'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : occ.type === 'auditoria'
                          ? 'bg-blue-100 text-brand-blue border border-blue-200'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {occ.type.toUpperCase()}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">{occ.title}</h4>
                      {occ.amount && (
                        <span className="text-xs font-black text-brand-red bg-white px-2 py-0.5 rounded border border-red-200">
                          {fmtBRL(occ.amount)}
                        </span>
                      )}
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      occ.status === 'resolvido'
                        ? 'bg-emerald-100 text-emerald-800'
                        : occ.status === 'justificado'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-red-100 text-brand-red animate-pulse'
                    }`}>
                      {occ.status === 'resolvido' && '✅ Resolvido'}
                      {occ.status === 'justificado' && '🟡 Justificado / Compensado'}
                      {occ.status === 'em_apuracao' && '🔴 Em Apuração'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {occ.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-1">
                    <span>Registrado por: <strong className="text-slate-600">{occ.author}</strong> em {occ.date}</span>
                    {occ.resolutionNote && (
                      <span className="text-emerald-700 font-semibold">{occ.resolutionNote}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* ABA 3: TABELA DISCRIMINADA DE TODA A REDE (26 LOJAS)      */}
      {/* ========================================================= */}
      {activeTab === 'tabela' && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-brand-blue flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-blue" />
                Quadro Discriminado de Fechamento das 26 Lojas
              </h3>
              <p className="text-xs text-slate-500">
                Visualize os valores exatos de Sintegra, maquininhas, gaveta e cofre de cada unidade no período ({periodLabel})
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert('Relatório CSV de fechamento consolidado exportado com sucesso!')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Planilha (CSV)</span>
            </button>
          </div>

          {/* Barra de Filtros e Busca Responsiva */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar por loja, cidade ou gerente..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="todas">Todas as Regiões (26)</option>
              <option value="Metropolitana">Metropolitana</option>
              <option value="Campinas e Região">Campinas e Região</option>
              <option value="Vale do Paraíba">Vale do Paraíba</option>
              <option value="Litoral">Litoral</option>
              <option value="Interior">Interior</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="todos">Todos os Status</option>
              <option value="fechado_ok">🟢 Fechado OK</option>
              <option value="fechado_compensado">🟡 Compensado</option>
              <option value="divergencia">🔴 Com Alerta / Divergência</option>
              <option value="aberto">⏳ Em Aberto</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="faturamento">Ordenar: Maior Faturamento</option>
              <option value="cofre">Ordenar: Maior Saldo em Cofre</option>
              <option value="divergencia">Ordenar: Maiores Divergências</option>
              <option value="numero">Ordenar: Número da Loja</option>
            </select>
          </div>

          {/* Tabela Completa Discriminada com scroll horizontal no mobile */}
          <div className="border border-slate-200 rounded-2xl overflow-x-auto no-scrollbar text-xs">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-3">Loja</th>
                  <th className="p-3">Faturamento ({periodLabel.split(' ')[0]})</th>
                  <th className="p-3">💳 Cartão POS</th>
                  <th className="p-3">📲 PIX POS</th>
                  <th className="p-3">💵 Dinheiro Gaveta</th>
                  <th className="p-3">🏦 Saldo Cofre</th>
                  <th className="p-3">Status / Fechamento</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableStores.map((s) => {
                  const isLoja7 = s.code === 'LJ07';
                  const scaledRev = Math.round(s.sintegraTotal * periodMultiplier);
                  const scaledCard = Math.round(s.cardTotal * periodMultiplier);
                  const scaledPix = Math.round(s.pixTotal * periodMultiplier);
                  const scaledCash = Math.round(s.cashPhysical * periodMultiplier);

                  return (
                    <tr key={s.id} className={isLoja7 ? 'bg-blue-50/60 font-semibold' : 'hover:bg-slate-50'}>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-brand-blue text-white text-[10px] font-black flex items-center justify-center shrink-0">
                            {s.number}
                          </span>
                          <div>
                            <div className="font-black text-brand-blue">{s.name}</div>
                            <div className="text-[11px] text-slate-400">{s.city} • {s.manager}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-black text-brand-blue">
                        {fmtBRL(scaledRev)}
                      </td>
                      <td className="p-3 text-slate-700 font-bold">
                        {fmtBRL(scaledCard)}
                      </td>
                      <td className="p-3 text-emerald-700 font-bold">
                        {fmtBRL(scaledPix)}
                      </td>
                      <td className="p-3 text-amber-800 font-bold">
                        {fmtBRL(scaledCash)}
                      </td>
                      <td className="p-3 text-amber-900 font-black">
                        {fmtBRL(s.safeCurrentBalance)}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          s.status === 'fechado_ok'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'fechado_compensado'
                            ? 'bg-amber-100 text-amber-900'
                            : s.status === 'divergencia'
                            ? 'bg-red-100 text-brand-red'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {s.status === 'fechado_ok' && `🟢 OK ${s.actualClosingTime || '19:30'}`}
                          {s.status === 'fechado_compensado' && `🟡 Compensado`}
                          {s.status === 'divergencia' && `🔴 Falta R$ 120`}
                          {s.status === 'aberto' && `⏳ Até ${s.closingTimeLimit}`}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStoreId(s.id);
                            setActiveTab('detalhes');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white text-[11px] font-bold transition inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Raio-X</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* MODAL DE APRESENTAÇÃO EXECUTIVA (SLIDES) */}
      <ExecutivePresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        periodLabel={periodLabel}
        stores={stores}
        totalRevenue={totalNetworkRevenue}
        totalSafe={totalNetworkSafe}
      />

    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Store as StoreIcon, 
  Eye, 
  FileText, 
  MessageCircle, 
  BarChart3, 
  PieChart, 
  Layers, 
  Sparkles,
  ChevronRight,
  X,
  Share2,
  CalendarDays,
  ChevronLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Store } from '../data/stores';
import { PhotoViewerModal } from '../components/PhotoViewerModal';
import { MOCK_IMAGES } from '../utils/mockImages';
import { NetworkMap } from '../components/NetworkMap';
import { getDayInfo, storesForDay, HISTORY_DAYS } from '../data/dayHistory';

export const LiveMonitoringPage: React.FC = () => {
  const { stores: liveStores, updateStore } = useApp();

  // Dia exibido: 0 = hoje (em aberto) | 1..6 = dias anteriores (fechados)
  const [dayOffset, setDayOffset] = useState(0);
  const day = getDayInfo(dayOffset);
  const stores = useMemo(() => storesForDay(liveStores, dayOffset), [liveStores, dayOffset]);

  // Mobile Views switcher
  const [mobileView, setMobileView] = useState<'mapa' | 'lista' | 'analytics'>('mapa');

  // Filter state
  const [filterStatus, setFilterStatus] = useState<'todos' | 'fechado_ok' | 'fechado_compensado' | 'divergencia' | 'aberto'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Store for Raio-X modal
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [hoveredStore, setHoveredStore] = useState<Store | null>(null);

  // Photo viewer modal inside Raio-X
  const [photoViewer, setPhotoViewer] = useState<{ url: string; title: string } | null>(null);

  // Approved store toast
  const [approvedToast, setApprovedToast] = useState<string | null>(null);

  // Filtered stores
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesSearch =
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.number.includes(searchQuery) ||
        store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.manager.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === 'todos' || store.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [stores, searchQuery, filterStatus]);

  // Totals calculations
  const totalRevenue = stores.reduce((acc, s) => acc + s.sintegraTotal, 0);
  const totalSafeCash = stores.reduce((acc, s) => acc + s.safeCurrentBalance, 0);
  const closedCount = stores.filter((s) => s.status !== 'aberto').length;
  const progressPercent = Math.round((closedCount / stores.length) * 100);

  // Counts by status
  const countOk = stores.filter((s) => s.status === 'fechado_ok').length;
  const countCompensado = stores.filter((s) => s.status === 'fechado_compensado').length;
  const countDivergencia = stores.filter((s) => s.status === 'divergencia').length;
  const countAberto = stores.filter((s) => s.status === 'aberto').length;

  const changeDay = (n: number) => {
    setDayOffset(n);
    setHoveredStore(null);
    setSelectedStore(null);
  };

  const fmtBRL = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const kpiRevenue = day.isToday ? 'R$ 584.320,00' : fmtBRL(totalRevenue);
  const kpiSafe = day.isToday ? 'R$ 142.890,00' : fmtBRL(totalSafeCash);
  const kpiDeposits = day.isToday ? 'R$ 310.500,00' : fmtBRL(Math.round((totalRevenue * 0.53) / 10) * 10);

  const handleApproveClosing = (store: Store) => {
    updateStore(store.id, { status: 'fechado_ok' });
    setApprovedToast(`Fechamento da ${store.name} aprovado e arquivado com sucesso!`);
    setTimeout(() => setApprovedToast(null), 3500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* Toast de Aprovação */}
      {approvedToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95">
          <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{approvedToast}</span>
          </div>
        </div>
      )}

      {/* 1. CABEÇALHO EXECUTIVO & PLACAR EM TEMPO REAL (KPIS NO TOPO) */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-5">
        
        {/* SELETOR DE DATA: hoje (em aberto) + dias anteriores (fechados) */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-brand-blue font-extrabold text-sm sm:text-base">
              <CalendarDays className="w-5 h-5 text-brand-red" />
              {day.label}
            </div>
            {day.isToday ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-amber-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-amber-600" />
                </span>
                DIA EM ABERTO • atualizando ao vivo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                DIA FECHADO • conferido e arquivado
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeDay(Math.min(dayOffset + 1, HISTORY_DAYS - 1))}
              disabled={dayOffset >= HISTORY_DAYS - 1}
              aria-label="Dia anterior"
              className="shrink-0 w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-blue hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex-1 flex gap-1.5 overflow-x-auto no-scrollbar">
              {Array.from({ length: HISTORY_DAYS }, (_, i) => getDayInfo(HISTORY_DAYS - 1 - i)).map((d) => (
                <button
                  key={d.offset}
                  type="button"
                  onClick={() => changeDay(d.offset)}
                  className={`shrink-0 min-w-[84px] px-3 py-1.5 rounded-xl border text-center transition ${
                    dayOffset === d.offset
                      ? 'bg-brand-blue border-brand-blue text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-brand-blue/40'
                  }`}
                >
                  <div className="text-xs font-black">
                    {d.isToday ? 'Hoje' : d.weekdayShort} {d.short}
                  </div>
                  <div className={`text-[10px] font-bold ${dayOffset === d.offset ? 'text-white/80' : 'text-slate-500'}`}>
                    {d.isToday ? '🟡 Em aberto' : '✅ Fechado'}
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => changeDay(Math.max(dayOffset - 1, 0))}
              disabled={dayOffset <= 0}
              aria-label="Próximo dia"
              className="shrink-0 w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-blue hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              🟢 Disparo WhatsApp Ativo • Rede 26 Lojas
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-brand-blue tracking-tight">
              Monitoramento Ao Vivo & Fechamento da Rede
            </h1>
            <p className="text-xs text-slate-500">
              {day.isToday ? 'Posição consolidada em tempo real' : 'Fechamento consolidado'} • {day.label}
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 font-semibold">Progresso do Dia:</div>
            <div className="text-2xl sm:text-3xl font-black text-brand-blue">
              {closedCount} de {stores.length} Lojas Fechadas ({progressPercent}%)
            </div>
          </div>
        </div>

        {/* Barra de Progresso Animada com Cores da Marca */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-brand-yellow via-emerald-500 to-brand-blue rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 4 Cards de Resumo da Rede (27/10/2026) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Faturamento Total (Sintegra)</span>
              <DollarSign className="w-4 h-4 text-brand-blue" />
            </div>
            <div className="text-xl font-black text-brand-blue mt-1">
              {kpiRevenue}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              Soma auditada das 26 filiais
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Em Espécie nos Cofres</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-black text-amber-900 mt-1">
              {kpiSafe}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Aguardando malote/depósito bancário
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Status Conciliação</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xs font-bold text-slate-800 mt-1.5 space-y-0.5">
              <div>🟢 <strong>{countOk}</strong> Sem Divergências</div>
              <div>🟡 <strong>{countCompensado}</strong> Compensadas (Cartão/PIX)</div>
              <div>🔴 <strong>{countDivergencia}</strong> Com Alerta • ⚪ <strong>{countAberto}</strong> Abertas</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Últimos Depósitos Validados</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-700 mt-1">
              {kpiDeposits}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              Comprovantes verificados hoje
            </div>
          </div>

        </div>

        {/* Alternador de Abas no Celular (< 1024px) */}
        <div className="lg:hidden grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setMobileView('mapa')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mobileView === 'mapa'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Visão Mapa</span>
          </button>

          <button
            onClick={() => setMobileView('lista')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mobileView === 'lista'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Lista 26 Lojas</span>
          </button>

          <button
            onClick={() => setMobileView('analytics')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mobileView === 'analytics'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Gráficos</span>
          </button>
        </div>

      </div>

      {/* 2. MAPA INTERATIVO AO VIVO + LISTA DAS 26 LOJAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LADO ESQUERDO: MAPA INTERATIVO DAS 26 UNIDADES */}
        <div className={`lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between ${
          mobileView !== 'mapa' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-red" />
                <h2 className="text-base font-extrabold text-brand-blue">
                  Mapa da Rede • 26 Lojas
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Passe o mouse ou toque nos pins para detalhes
              </span>
            </div>

            <NetworkMap
              stores={stores}
              activeId={hoveredStore?.id ?? null}
              isLive={day.isToday}
              dayLabel={`${day.short} • ${day.weekday}`}
              onHover={(s) => setHoveredStore(s)}
              onSelect={(s) => setHoveredStore(s)}
            />

            {/* Resultado rápido da loja escolhida no mapa */}
            {hoveredStore ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-md animate-in fade-in duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-brand-blue">{hoveredStore.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        hoveredStore.status === 'fechado_ok'
                          ? 'bg-emerald-100 text-emerald-800'
                          : hoveredStore.status === 'fechado_compensado'
                          ? 'bg-amber-100 text-amber-900'
                          : hoveredStore.status === 'divergencia'
                          ? 'bg-red-100 text-brand-red'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {hoveredStore.status === 'fechado_ok' && '🟢 Fechado OK'}
                        {hoveredStore.status === 'fechado_compensado' && '🟡 Compensado'}
                        {hoveredStore.status === 'divergencia' && '🔴 Com Divergência'}
                        {hoveredStore.status === 'aberto' && '⚪ Aberto'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Gerente: <strong>{hoveredStore.manager}</strong> • {hoveredStore.city}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHoveredStore(null)}
                    className="text-slate-400 hover:text-slate-600 p-0.5"
                    aria-label="Fechar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">Total Sintegra</span>
                    <div className="font-bold text-slate-900">
                      R$ {hoveredStore.sintegraTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Cofre Acumulado</span>
                    <div className="font-bold text-amber-800">
                      R$ {hoveredStore.safeCurrentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">{hoveredStore.status === 'aberto' ? 'Limite' : 'Fechou às'}</span>
                    <div className="font-bold text-slate-900">
                      {hoveredStore.status === 'aberto' ? hoveredStore.closingTimeLimit : hoveredStore.actualClosingTime || '19:30'}
                    </div>
                  </div>
                </div>

                {hoveredStore.divergenceReason && (
                  <div className="mt-2 text-[10px] p-1.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                    {hoveredStore.divergenceReason}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedStore(hoveredStore)}
                  className="w-full mt-3 py-2.5 px-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{day.isToday ? 'Abrir Resultado Ao Vivo da Loja' : 'Abrir Resultado do Fechamento'}</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-slate-500 font-medium">
                👆 Toque (ou passe o mouse) em uma loja do mapa para ver o resultado dela
              </div>
            )}

            {/* Legenda do Mapa */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 mt-4 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Fechada sem divergências ({countOk})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400" /> Compensada (Cartão/PIX) ({countCompensado})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-brand-red animate-pulse" /> Com Divergência/Atraso ({countDivergencia})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-400" /> Aberta ({countAberto})
              </span>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: LISTA INTELIGENTE DAS 26 LOJAS (COM FILTROS RÁPIDOS) */}
        <div className={`lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between space-y-4 ${
          mobileView !== 'lista' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div>
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-brand-blue flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-blue" />
                Painel das 26 Lojas
              </h2>
              <span className="text-xs text-slate-500 font-bold">
                {filteredStores.length} Unidades
              </span>
            </div>

            {/* Barra de Busca */}
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por loja, cidade ou gerente..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            {/* Pílulas de Filtro */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 text-[11px] font-bold">
              <button
                onClick={() => setFilterStatus('todos')}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition ${
                  filterStatus === 'todos'
                    ? 'bg-brand-blue text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas (26)
              </button>
              <button
                onClick={() => setFilterStatus('fechado_ok')}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition ${
                  filterStatus === 'fechado_ok'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                🟢 OK ({countOk})
              </button>
              <button
                onClick={() => setFilterStatus('fechado_compensado')}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition ${
                  filterStatus === 'fechado_compensado'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                🟡 Compensadas ({countCompensado})
              </button>
              <button
                onClick={() => setFilterStatus('divergencia')}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition ${
                  filterStatus === 'divergencia'
                    ? 'bg-brand-red text-white'
                    : 'bg-red-50 text-brand-red hover:bg-red-100'
                }`}
              >
                🔴 Alerta ({countDivergencia})
              </button>
              <button
                onClick={() => setFilterStatus('aberto')}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition ${
                  filterStatus === 'aberto'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ⏳ Abertas ({countAberto})
              </button>
            </div>

            {/* Lista com Scroll Suave */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 mt-2">
              {filteredStores.map((store) => {
                const isLoja7 = store.code === 'LJ07';
                return (
                  <div
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                      isLoja7
                        ? 'border-brand-blue bg-blue-50/50 ring-2 ring-brand-blue/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-brand-blue">
                            {store.name}
                          </span>
                          {isLoja7 && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-brand-yellow text-brand-blue">
                              ⭐ Destaque
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {store.city} • Gerente: {store.manager}
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                        store.status === 'fechado_ok'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : store.status === 'fechado_compensado'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : store.status === 'divergencia'
                          ? 'bg-red-50 text-brand-red border border-red-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {store.status === 'fechado_ok' && `🟢 Fechado ${store.actualClosingTime || '19:30'}`}
                        {store.status === 'fechado_compensado' && `🟡 Compensado ${store.actualClosingTime || '19:45'}`}
                        {store.status === 'divergencia' && `🔴 Falta R$ 120`}
                        {store.status === 'aberto' && `⏳ Até ${store.closingTimeLimit}`}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px]">Total Sintegra:</span>{' '}
                        <strong className="text-slate-900">R$ {store.sintegraTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">Cofre:</span>{' '}
                        <strong className="text-amber-800">R$ {store.safeCurrentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>

                    {isLoja7 && (
                      <div className="mt-2 flex items-center justify-between text-[10px] text-emerald-700 bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-200">
                        <span className="flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Selfie do Gerente + Assinatura OK
                        </span>
                        <span className="font-bold">✅ Enviado no WhatsApp</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      {/* 3. SEÇÃO DE GRÁFICOS E DASHBOARD ANALÍTICO (DIRETORIA) */}
      <div className={`bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-6 ${
        mobileView === 'analytics' ? 'block' : 'hidden lg:block'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-blue" />
            <h2 className="text-base font-extrabold text-brand-blue">
              Dashboard Analítico & Indicadores de Caixa da Rede
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Consolidado Diário {day.full}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Gráfico 1: Top Lojas em Faturamento */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Top 5 Lojas em Faturamento no Dia (R$)
            </h3>
            <div className="space-y-2 pt-1 text-xs font-semibold">
              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Loja 04 - Mega Store Leste</span>
                  <span className="font-bold text-brand-blue">R$ 36.700</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Loja 15 - Campinas Dom Pedro</span>
                  <span className="font-bold text-brand-blue">R$ 33.400</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue rounded-full" style={{ width: '91%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Loja 01 - Matriz Centro</span>
                  <span className="font-bold text-brand-blue">R$ 31.200</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Loja 26 - Outlet Premium</span>
                  <span className="font-bold text-brand-blue">R$ 29.800</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue rounded-full" style={{ width: '81%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Loja 07 - Campinas (Em Foco)</span>
                  <span className="font-bold text-brand-red">R$ 24.157</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-red rounded-full" style={{ width: '66%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico 2: Divisão de Meios de Pagamento */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Divisão de Meios de Pagamento (Rede)
            </h3>
            
            <div className="flex items-center justify-center py-2">
              {/* Donut Chart SVG */}
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {/* Cartão 52% */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0B1560" strokeWidth="3.8" strokeDasharray="52 48" strokeDashoffset="0" />
                  {/* PIX 31% */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="3.8" strokeDasharray="31 69" strokeDashoffset="-52" />
                  {/* Dinheiro 17% */}
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3.8" strokeDasharray="17 83" strokeDashoffset="-83" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold text-slate-500">Total</span>
                  <span className="text-sm font-black text-brand-blue">100%</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" /> 💳 Cartão de Crédito/Débito
                </span>
                <strong className="text-slate-900">52% (R$ 303.846)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 📲 PIX Imediato no POS
                </span>
                <strong className="text-slate-900">31% (R$ 181.139)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 💵 Dinheiro em Espécie
                </span>
                <strong className="text-slate-900">17% (R$ 99.335)</strong>
              </div>
            </div>
          </div>

          {/* Gráfico 3: Indicador de Saúde de Caixa (Ranking de Divergências) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Conformidade de Fechamento (Mês)
            </h3>
            
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
              <div className="flex items-center justify-between font-bold text-emerald-800">
                <span>Lojas com Histórico 100% Limpo:</span>
                <span>21 / 26</span>
              </div>
              <p className="text-[11px] text-emerald-600 mt-1">
                Sem quebras no caixa físico nos últimos 30 dias.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span>Compensação Aceita (Troca PIX/Cartão):</span>
                <span>4 Lojas</span>
              </div>
              <p className="text-[11px] text-amber-700 mt-1">
                Vendas registradas corretamente, com saldo líquido R$ 0,00.
              </p>
            </div>

            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs">
              <div className="flex items-center justify-between font-bold text-brand-red">
                <span>Sob Investigação de Quebra:</span>
                <span>1 Loja (LJ12 Jacareí)</span>
              </div>
              <p className="text-[11px] text-red-600 mt-1">
                Auditor regional acionado para conferência presencial.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. MODAL / DRAWER "RAIO-X DETALHADO DA LOJA" (CONFERÊNCIA DO FINANCEIRO) */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
            
            {/* Barra Decorativa Superior */}
            <div className="h-1.5 w-full flex">
              <div className="w-1/3 bg-brand-red" />
              <div className="w-1/3 bg-brand-yellow" />
              <div className="w-1/3 bg-brand-blue" />
            </div>

            <div className="p-5 sm:p-7 space-y-6 max-h-[85vh] overflow-y-auto">
              
              {/* Topo do Raio-X */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-blue text-white">
                      {selectedStore.code}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-brand-blue">
                      {day.isToday ? 'Resultado Ao Vivo da Loja' : 'Resultado do Fechamento'}: {selectedStore.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {day.isToday ? (
                      <span className="inline-flex items-center gap-1 mr-1.5 px-1.5 py-0.5 rounded bg-red-50 text-brand-red border border-red-200 text-[10px] font-extrabold">● AO VIVO • EM ABERTO</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 mr-1.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">✅ FECHADO</span>
                    )}
                    Data: {day.full} • Gerente: <strong>{selectedStore.manager}</strong> ({selectedStore.managerPhone}) • Supervisor: {selectedStore.supervisor}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedStore(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 1. Espelho Oficial do Fechamento */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Espelho Oficial dos Valores (Sintegra vs. Lançado)</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Sintegra: R$ {selectedStore.sintegraTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="font-bold text-slate-800">💵 Dinheiro & Gaveta</div>
                    <div className="text-slate-600 mt-1">Sintegra: R$ 4.105,50</div>
                    <div className="text-slate-600">Retiradas: R$ 354,00</div>
                    <div className="font-bold text-emerald-700 mt-1">Contado: R$ {selectedStore.cashPhysical.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Sem divergências)</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="font-bold text-slate-800">💳 Cartões TEF/POS</div>
                    <div className="text-slate-600 mt-1">Sintegra: R$ 11.987,50</div>
                    <div className="text-slate-600">Maquininhas POS: R$ {selectedStore.cardTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div className="font-bold text-amber-700 mt-1">Diferença: + R$ 35,00 (Passou)</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="font-bold text-slate-800">📲 PIX nas Maquininhas</div>
                    <div className="text-slate-600 mt-1">Sintegra: R$ 6.846,00</div>
                    <div className="text-slate-600">Maquininhas POS: R$ {selectedStore.pixTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div className="font-bold text-amber-700 mt-1">Diferença: - R$ 35,00 (Compensado)</div>
                  </div>
                </div>

              </div>

              {/* 2. Galeria de Evidências Fotográficas (Clicáveis para Zoom) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Galeria de Evidências Fotográficas (Clique para Ampliar)
                  </h4>
                  <span className="text-[11px] text-slate-400">6 Anexos Obrigatórios</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  
                  <div
                    onClick={() => setPhotoViewer({ url: MOCK_IMAGES.receiptSnack, title: 'Recibo Despesa Lanche (R$ 54,00)' })}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-xs hover:shadow-md transition"
                  >
                    <img src={MOCK_IMAGES.receiptSnack} alt="Lanche" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-black/70 text-[10px] text-white text-center font-bold">
                      Recibo Lanche (R$ 54)
                    </div>
                  </div>

                  <div
                    onClick={() => setPhotoViewer({ url: MOCK_IMAGES.receiptNewspaper, title: 'Recibo Despesa Jornal (R$ 300,00)' })}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-xs hover:shadow-md transition"
                  >
                    <img src={MOCK_IMAGES.receiptNewspaper} alt="Jornal" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-black/70 text-[10px] text-white text-center font-bold">
                      Recibo Jornal (R$ 300)
                    </div>
                  </div>

                  <div
                    onClick={() => setPhotoViewer({ url: MOCK_IMAGES.drawerCashPhoto, title: 'Gaveta de Dinheiro Físico (R$ 3.751,50)' })}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-xs hover:shadow-md transition"
                  >
                    <img src={MOCK_IMAGES.drawerCashPhoto} alt="Gaveta" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-black/70 text-[10px] text-white text-center font-bold">
                      Dinheiro Físico
                    </div>
                  </div>

                  <div
                    onClick={() => setPhotoViewer({ url: MOCK_IMAGES.posSlipStone, title: 'Filipeta POS Stone Caixa 01' })}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-xs hover:shadow-md transition"
                  >
                    <img src={MOCK_IMAGES.posSlipStone} alt="Stone" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-black/70 text-[10px] text-white text-center font-bold">
                      Filipeta Stone
                    </div>
                  </div>

                  <div
                    onClick={() => setPhotoViewer({ url: MOCK_IMAGES.posSlipCielo, title: 'Filipeta POS Cielo Caixa 02' })}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-xs hover:shadow-md transition"
                  >
                    <img src={MOCK_IMAGES.posSlipCielo} alt="Cielo" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-black/70 text-[10px] text-white text-center font-bold">
                      Filipeta Cielo
                    </div>
                  </div>

                  <div
                    onClick={() => setPhotoViewer({ url: MOCK_IMAGES.managerSelfie, title: 'Selfie Biométrica do Gerente com Timestamp' })}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-xs hover:shadow-md transition"
                  >
                    <img src={MOCK_IMAGES.managerSelfie} alt="Selfie" className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-emerald-800/90 text-[10px] text-white text-center font-bold">
                      Selfie Gerente
                    </div>
                  </div>

                </div>
              </div>

              {/* 3. Tabela Venda a Venda (Auditoria Sintegra vs. Maquininha) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Auditoria Venda a Venda (Amostra de Transações Auditadas)
                  </h4>
                  <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
                    1 Divergência Identificada e Justificada
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="p-2.5">Horário</th>
                        <th className="p-2.5">Cupom / NSU</th>
                        <th className="p-2.5">Valor</th>
                        <th className="p-2.5">No Sintegra (PDV)</th>
                        <th className="p-2.5">Na Maquininha (POS)</th>
                        <th className="p-2.5">Status Auditoria</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 text-slate-500">14:10:22</td>
                        <td className="p-2.5 font-mono text-slate-700">#8810 / 99182</td>
                        <td className="p-2.5 font-bold text-slate-800">R$ 180,00</td>
                        <td className="p-2.5">Cartão Crédito (Stone)</td>
                        <td className="p-2.5">Cartão Crédito (Stone)</td>
                        <td className="p-2.5 text-emerald-600 font-bold">✅ Bateu</td>
                      </tr>
                      {/* VENDA ESPECÍFICA DESTACADA EM AMARELO: R$ 35,00 às 15:22 */}
                      <tr className="bg-amber-100/70 border-y-2 border-amber-300">
                        <td className="p-2.5 font-bold text-amber-900">15:22:45</td>
                        <td className="p-2.5 font-mono font-bold text-amber-900">#8812 / 00412</td>
                        <td className="p-2.5 font-extrabold text-amber-900">R$ 35,00</td>
                        <td className="p-2.5 font-bold text-amber-900">📲 Lançado PIX no PDV</td>
                        <td className="p-2.5 font-bold text-amber-900">💳 Passado no Cartão Stone</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-extrabold text-[10px]">
                            ⚠️ Troca Justificada
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-500">16:40:11</td>
                        <td className="p-2.5 font-mono text-slate-700">#8815 / 11204</td>
                        <td className="p-2.5 font-bold text-slate-800">R$ 450,00</td>
                        <td className="p-2.5">PIX QR Code (Cielo)</td>
                        <td className="p-2.5">PIX QR Code (Cielo)</td>
                        <td className="p-2.5 text-emerald-600 font-bold">✅ Bateu</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-500">18:05:30</td>
                        <td className="p-2.5 font-mono text-slate-700">#8820 / 33419</td>
                        <td className="p-2.5 font-bold text-slate-800">R$ 95,50</td>
                        <td className="p-2.5">Dinheiro</td>
                        <td className="p-2.5">Dinheiro (Gaveta)</td>
                        <td className="p-2.5 text-emerald-600 font-bold">✅ Bateu</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Botões de Ação do Financeiro */}
              {day.isToday ? (
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleApproveClosing(selectedStore);
                    setSelectedStore(null);
                  }}
                  className="flex-1 w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✅ Aprovar e Arquivar Fechamento</span>
                </button>

                <a
                  href={`https://api.whatsapp.com/send?phone=5519987650007&text=Ol%C3%A1%20Gerente%20${selectedStore.manager},%20referente%20ao%20fechamento%20da%20${selectedStore.name}%20(${day.short}),%20o%20financeiro%20solicita%20esclarecimento.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 w-full py-3.5 px-4 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4 text-amber-700" />
                  <span>⚠️ Solicitar Correção ao Gerente no WhatsApp</span>
                </a>
              </div>
              ) : (
                <div className="pt-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  ✅ Dia fechado — fechamento já conferido e arquivado.
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Modal Zoom Foto */}
      {photoViewer && (
        <PhotoViewerModal
          isOpen={true}
          onClose={() => setPhotoViewer(null)}
          title={photoViewer.title}
          photoUrl={photoViewer.url}
        />
      )}

    </div>
  );
};

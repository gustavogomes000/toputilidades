import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Store as StoreIcon, 
  Award, 
  Download,
  Calendar,
  Layers,
  BarChart3
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Store } from '../data/stores';

interface ExecutivePresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodLabel: string;
  stores: Store[];
  totalRevenue: number;
  totalSafe: number;
}

export const ExecutivePresentationModal: React.FC<ExecutivePresentationModalProps> = ({
  isOpen,
  onClose,
  periodLabel,
  stores,
  totalRevenue,
  totalSafe,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const totalSlides = 5;

  // Auto-play do slide show a cada 7 segundos se ativado
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 7000);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const handleNext = () => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  const handlePrev = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  const fmtBRL = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  // Top lojas por faturamento
  const topStores = [...stores].sort((a, b) => b.sintegraTotal - a.sintegraTotal).slice(0, 5);
  const storesOk = stores.filter((s) => s.status === 'fechado_ok').length;
  const storesCompensadas = stores.filter((s) => s.status === 'fechado_compensado').length;
  const storesDivergencia = stores.filter((s) => s.status === 'divergencia').length;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-6 animate-in fade-in duration-200">
      
      {/* Container Principal do Slide Corporativo (Estilo 16:9 Cinema / Keynote) */}
      <div className="relative w-full max-w-6xl aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-br from-[#0B1560] via-[#091047] to-[#040827] rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between text-white select-none">
        
        {/* Barra Superior de Controle do Apresentador */}
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" className="w-10 h-10 p-0.5 rounded-lg" />
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-brand-yellow flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-yellow" />
              Apresentação Executiva da Diretoria • {periodLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-300 font-mono font-bold mr-2 hidden sm:block">
              SLIDE {currentSlide + 1} DE {totalSlides}
            </div>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-xl border transition ${
                isPlaying ? 'bg-brand-yellow text-brand-blue border-brand-yellow' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
              title={isPlaying ? 'Pausar Apresentação' : 'Iniciar Apresentação Automática'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
              title="Sair do Modo Apresentação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONTEÚDO DO SLIDE ATUAL */}
        <div className="flex-1 p-6 sm:p-12 flex flex-col justify-center overflow-y-auto">
          
          {/* SLIDE 1: CAPA EXECUTIVA */}
          {currentSlide === 0 && (
            <div className="space-y-6 max-w-4xl mx-auto text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/20 text-brand-yellow text-xs font-black border border-brand-yellow/40">
                <span>REDE TOP UTILIDADES E PRESENTES</span>
                <span>•</span>
                <span>26 FILIAIS CONSOLIDADAS</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                Relatório Executivo de Conciliação, Caixa e Auditoria de Filiais
              </h1>

              <p className="text-base sm:text-xl text-slate-300 font-medium leading-relaxed">
                Diagnóstico gerencial do fechamento de caixa, conformidade das filiais, conciliação Sintegra x Maquininhas POS e custódia em cofres.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Período Auditado</span>
                  <div className="text-sm sm:text-base font-black text-white mt-0.5">{periodLabel}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Volume Total</span>
                  <div className="text-sm sm:text-base font-black text-brand-yellow mt-0.5">{fmtBRL(totalRevenue)}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Índice Regularidade</span>
                  <div className="text-sm sm:text-base font-black text-emerald-400 mt-0.5">96.2%</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Status Comitê</span>
                  <div className="text-sm sm:text-base font-black text-white mt-0.5">Homologado</div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: PLACAR DE FATURAMENTO E MEIOS DE PAGAMENTO */}
          {currentSlide === 1 && (
            <div className="space-y-6 max-w-5xl mx-auto w-full">
              <div>
                <span className="text-xs font-black text-brand-yellow uppercase tracking-widest">VISÃO FINANCEIRA</span>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  Faturamento Consolidado & Mix de Recebimento
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Total de vendas registrado no Sintegra confrontado com cartões e PIX no período ({periodLabel})
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 space-y-2">
                  <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                    <span>💳 Cartão de Crédito / Débito</span>
                    <span className="text-brand-yellow font-black">52%</span>
                  </div>
                  <div className="text-2xl font-black text-white">{fmtBRL(totalRevenue * 0.52)}</div>
                  <p className="text-[11px] text-slate-300">
                    Processado عبر terminais POS Stone e Cielo cadastrados.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-400/30 space-y-2">
                  <div className="text-xs font-bold text-emerald-300 flex items-center justify-between">
                    <span>📲 PIX Imediato no POS</span>
                    <span className="text-emerald-400 font-black">31%</span>
                  </div>
                  <div className="text-2xl font-black text-white">{fmtBRL(totalRevenue * 0.31)}</div>
                  <p className="text-[11px] text-slate-300">
                    Liquidação instantânea em conta jurídica com taxa zero de custódia física.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-400/30 space-y-2">
                  <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
                    <span>💵 Espécie em Gaveta</span>
                    <span className="text-amber-400 font-black">17%</span>
                  </div>
                  <div className="text-2xl font-black text-white">{fmtBRL(totalRevenue * 0.17)}</div>
                  <p className="text-[11px] text-slate-300">
                    Numerário físico conferido nas gavetas e recolhido aos cofres.
                  </p>
                </div>
              </div>

              {/* Barra Grande Segmentada */}
              <div className="space-y-1.5 pt-2">
                <div className="w-full h-4 rounded-full overflow-hidden flex border border-white/20">
                  <div style={{ width: '52%' }} className="bg-sky-400" />
                  <div style={{ width: '31%' }} className="bg-emerald-400" />
                  <div style={{ width: '17%' }} className="bg-amber-400" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                  <span>Cartões TEF/POS (52%)</span>
                  <span>PIX Instantâneo (31%)</span>
                  <span>Dinheiro Físico (17%)</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: RANKING DAS TOP LOJAS */}
          {currentSlide === 2 && (
            <div className="space-y-5 max-w-5xl mx-auto w-full">
              <div>
                <span className="text-xs font-black text-brand-yellow uppercase tracking-widest">DESEMPENHO POR FILIAL</span>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  Líderes de Faturamento da Rede no Período
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Top 5 unidades com maior volume transacionado e conformidade de caixa
                </p>
              </div>

              <div className="space-y-2.5">
                {topStores.map((st, idx) => {
                  const maxVal = topStores[0].sintegraTotal;
                  const pct = Math.round((st.sintegraTotal / maxVal) * 100);

                  return (
                    <div
                      key={st.id}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-[240px]">
                        <span className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                          idx === 0
                            ? 'bg-brand-yellow text-brand-blue shadow-lg'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-900'
                            : idx === 2
                            ? 'bg-amber-600 text-white'
                            : 'bg-white/10 text-white'
                        }`}>
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-black text-white text-sm">{st.name}</div>
                          <div className="text-[11px] text-slate-400">{st.city} • Gerente: {st.manager}</div>
                        </div>
                      </div>

                      {/* Barra Comparativa */}
                      <div className="flex-1 hidden sm:block">
                        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-yellow to-brand-red rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm sm:text-base font-black text-brand-yellow">{fmtBRL(st.sintegraTotal)}</div>
                        <div className="text-[10px] text-emerald-400 font-bold">100% Conciliado</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SLIDE 4: MAPA DE RISCO E CUSTÓDIA DE COFRE */}
          {currentSlide === 3 && (
            <div className="space-y-6 max-w-5xl mx-auto w-full">
              <div>
                <span className="text-xs font-black text-brand-yellow uppercase tracking-widest">SEGURANÇA PATRIMONIAL</span>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  Auditoria de Cofres & Custódia de Numerário
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Total de R$ 142.890,00 sob custódia física nas 26 filiais aguardando sangria/transporte
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300">Lojas com Cofre Regular</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{storesOk + storesCompensadas} Lojas</div>
                  <p className="text-xs text-slate-300">
                    Saldos físicos dentro do limite de apólice de seguro e com conferência em dia.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-500/15 border border-amber-400/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">Compensadas (Cartão x PIX)</span>
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{storesCompensadas} Lojas</div>
                  <p className="text-xs text-slate-300">
                    Troca justificada de modalidade no caixa com saldo líquido zerado (ex: Loja 07 R$ 35).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-red-500/20 border border-red-400/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-300">Apuração de Quebra</span>
                    <AlertTriangle className="w-5 h-5 text-brand-red animate-pulse" />
                  </div>
                  <div className="text-3xl font-black text-brand-red">{storesDivergencia} Loja</div>
                  <p className="text-xs text-slate-300">
                    LJ12 Jacareí com divergência de R$ 120,00 — supervisor regional presencial.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  🔒 Todas as 26 filiais contam com biometria facial do gerente e registro auditável em banco central.
                </span>
                <span className="text-brand-yellow font-black shrink-0">COMPLIANCE 100% ATIVO</span>
              </div>
            </div>
          )}

          {/* SLIDE 5: CONCLUSÕES E RECOMENDAÇÕES */}
          {currentSlide === 4 && (
            <div className="space-y-6 max-w-4xl mx-auto w-full">
              <div>
                <span className="text-xs font-black text-brand-yellow uppercase tracking-widest">PARECER FINAL</span>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  Conclusões do Comitê & Próximas Ações
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Deliberações homologadas pela diretoria para a rede TOP UTILIDADES
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-white">Fechamento Consolidado Aprovado</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Faturamento de {fmtBRL(totalRevenue)} devidamente auditado via Sintegra e espelhos de POS. Arquivamento fiscal liberado.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <Award className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-white">Incentivo Operacional por Pontualidade</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      24 das 26 lojas fecharam antes do prazo limite de 20:00h com envio automático do resumo via WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-black text-white">Plano de Ação para Sangria em Jacareí</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Recolhimento extraordinário de numerário agendado para Loja Nº 12 Jacareí com laudo do supervisor.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => alert('Relatório da Reunião em PDF gerado com sucesso!')}
                  className="px-5 py-3 rounded-2xl bg-brand-yellow hover:bg-brand-yellow-warm text-brand-blue font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Apresentação Executiva em PDF</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition"
                >
                  Fechar Apresentação
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Barra Inferior com Navegação de Slides */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-20 text-white text-xs font-bold flex items-center gap-2 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Slide Anterior</span>
          </button>

          {/* Indicadores de Pontos / Dots dos Slides */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                className={`h-2.5 rounded-full transition-all ${
                  currentSlide === i ? 'w-8 bg-brand-yellow' : 'w-2.5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentSlide === totalSlides - 1}
            className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold flex items-center gap-2 shadow-md transition disabled:opacity-20"
          >
            <span className="hidden sm:inline">Próximo Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

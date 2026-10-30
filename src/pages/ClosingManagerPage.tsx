import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  QrCode, 
  Plus, 
  Trash2, 
  Camera, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Clock, 
  Lock, 
  ArrowRight, 
  FileText, 
  Vault, 
  Eye, 
  Sparkles,
  MessageCircle,
  Copy,
  Check,
  Plug,
  Pencil
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CameraCapture } from '../components/CameraCapture';
import { SignatureCanvas } from '../components/SignatureCanvas';
import { SelfieModal } from '../components/SelfieModal';
import { PhotoViewerModal } from '../components/PhotoViewerModal';
import { MOCK_IMAGES } from '../utils/mockImages';
import { SintegraSalesPanel } from '../components/SintegraSalesPanel';

export const ClosingManagerPage: React.FC = () => {
  const { 
    fechamento, 
    addRetirada, 
    removeRetirada, 
    setCashPhysicalCount, 
    setCashDrawerPhoto, 
    addPosMachine, 
    updatePosMachine, 
    setJustificationReason, 
    setJustificationObs, 
    setManagerSelfie, 
    setManagerSignature, 
    finalizeFechamento, 
    addBankDeposit,
    syncSintegra, 
    isSintegraSyncing,
    setIntegrationMode,
    setSystemValues
  } = useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'dia' | 'cofre'>('dia');

  // Modal New Expense/Retirada
  const [isRetiradaModalOpen, setIsRetiradaModalOpen] = useState(false);
  const [retiradaDesc, setRetiradaDesc] = useState('');
  const [retiradaVal, setRetiradaVal] = useState('');
  const [retiradaPhoto, setRetiradaPhoto] = useState<string | null>(null);

  // Modal New POS Machine
  const [isPosModalOpen, setIsPosModalOpen] = useState(false);
  const [posBrand, setPosBrand] = useState<'Stone' | 'Cielo' | 'Rede' | 'PagBank' | 'Getnet'>('Stone');
  const [posName, setPosName] = useState('');
  const [posCredit, setPosCredit] = useState('');
  const [posPix, setPosPix] = useState('');
  const [posPhoto, setPosPhoto] = useState<string | null>(null);

  // Modal Final Validation (Selfie + Signature + WhatsApp)
  const [isFinalModalOpen, setIsFinalModalOpen] = useState(false);
  const [isSelfieCameraOpen, setIsSelfieCameraOpen] = useState(false);
  const [closingSuccessAlert, setClosingSuccessAlert] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Photo Viewer Modal
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; meta?: any } | null>(null);

  // Aba 2: Novo Depósito Bancário Form
  const [depositAmount, setDepositAmount] = useState('7153.00');
  const [depositBank, setDepositBank] = useState('Banco do Brasil');
  const [depositObs, setDepositObs] = useState('Depósito referente ao saldo acumulado dos dias 26/10 e 27/10.');
  const [depositPhoto, setDepositPhoto] = useState<string | null>(null);
  const [depositSuccessMsg, setDepositSuccessMsg] = useState(false);

  // Última sincronização com o Sintegra
  const [lastSync, setLastSync] = useState<string | null>(null);

  // Calculations for Bloco A (Cash)
  const totalRetiradas = fechamento.retiradas.reduce((acc, r) => acc + r.amount, 0);
  const expectedCash = fechamento.sintegraCash - totalRetiradas;
  const cashDifference = fechamento.cashPhysicalCount - expectedCash;

  // Calculations for Bloco B (Cards & PIX)
  const totalPosCard = fechamento.posMachines.reduce((acc, m) => acc + (m.creditTotal || 0), 0);
  const totalPosPix = fechamento.posMachines.reduce((acc, m) => acc + (m.pixTotal || 0), 0);
  const cardDifference = totalPosCard - fechamento.sintegraCard;
  const pixDifference = totalPosPix - fechamento.sintegraPix;
  const cardPixOk = Math.abs(cardDifference) < 0.01 && Math.abs(pixDifference) < 0.01;
  // Compensação: uma diferença anula a outra (ex.: +35 no cartão e -35 no PIX)
  const isCompensated = !cardPixOk && Math.abs(cardDifference + pixDifference) < 0.01;
  const cashOk = Math.abs(cashDifference) < 0.01;
  const allOk = cashOk && (cardPixOk || isCompensated);

  // Modo: Sintegra (integrado) ou manual (loja sem integração, valores digitados)
  const isManual = fechamento.integrationMode === 'manual';
  const systemTotal = isManual
    ? fechamento.sintegraCash + fechamento.sintegraCard + fechamento.sintegraPix
    : fechamento.sintegraTotal;
  const systemLabel = isManual ? 'Sistema' : 'Sintegra';
  const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const diffText = (v: number) =>
    Math.abs(v) < 0.01 ? '✅ Sem diferença' : `Diferença: ${v > 0 ? '+' : '-'} R$ ${fmt(Math.abs(v))} (${v > 0 ? 'Passou' : 'Faltou'})`;
  const diffBadge = (v: number) =>
    Math.abs(v) < 0.01
      ? 'text-emerald-700 bg-emerald-50'
      : isCompensated
      ? 'text-amber-700 bg-amber-50'
      : 'text-brand-red bg-red-50';

  const handleSyncSintegra = async () => {
    await syncSintegra();
    setLastSync(new Date().toLocaleTimeString('pt-BR'));
  };

  // Total in Safe
  const totalInSafe = fechamento.safePreviousDay + fechamento.safeToday;

  const handleSaveRetirada = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retiradaDesc || !retiradaVal || !retiradaPhoto) return;
    addRetirada(retiradaDesc, parseFloat(retiradaVal), retiradaPhoto);
    setRetiradaDesc('');
    setRetiradaVal('');
    setRetiradaPhoto(null);
    setIsRetiradaModalOpen(false);
  };

  const handleSavePosMachine = (e: React.FormEvent) => {
    e.preventDefault();
    const newPos = {
      id: `pos-${Date.now()}`,
      brand: posBrand,
      serial: `POS-${Math.floor(1000 + Math.random() * 9000)}`,
      name: posName || `Caixa - ${posBrand}`,
      requiresReceiptPhoto: true,
      creditTotal: parseFloat(posCredit) || 0,
      pixTotal: parseFloat(posPix) || 0,
      photoVerified: !!posPhoto,
      photoUrl: posPhoto || undefined,
    };
    addPosMachine(newPos);
    setPosName('');
    setPosCredit('');
    setPosPix('');
    setPosPhoto(null);
    setIsPosModalOpen(false);
  };

  const handleConfirmFinalClosing = () => {
    finalizeFechamento();
    setIsFinalModalOpen(false);
    setClosingSuccessAlert(true);
    setTimeout(() => setClosingSuccessAlert(false), 5000);
  };

  const handleSaveDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositPhoto || !depositAmount) return;
    addBankDeposit({
      date: '27/10/2026',
      amount: parseFloat(depositAmount),
      bank: depositBank,
      receiptUrl: depositPhoto,
      daysIncluded: ['26/10', '27/10'],
      status: 'pendente',
      registeredBy: `${fechamento.managerName} (Gerente)`,
    });
    setDepositPhoto(null);
    setDepositSuccessMsg(true);
    setTimeout(() => setDepositSuccessMsg(false), 4000);
  };

  // WhatsApp Message Text Formatter
  const whatsAppReportText = `*TOP UTILIDADES E PRESENTES - FECHAMENTO DE CAIXA*
🏪 *${fechamento.storeName}*
📅 Data: ${fechamento.date}
👤 Gerente: ${fechamento.managerName}
⏰ Horário: ${fechamento.closedAt || '19:45'}
━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL APURADO (${isManual ? 'SISTEMA - DIGITADO' : 'SINTEGRA'}): R$ ${fmt(systemTotal)}*

💵 *DINHEIRO & RETIRADAS:*
• Sistema ${isManual ? '(digitado)' : 'Sintegra'}: R$ ${fechamento.sintegraCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• Retiradas/Despesas: R$ ${totalRetiradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${fechamento.retiradas.map(r => `${r.description}: R$ ${r.amount.toFixed(2)}`).join(' | ')})
• Em Caixa Físico: R$ ${fechamento.cashPhysicalCount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• Status Dinheiro: ${Math.abs(cashDifference) < 0.01 ? '✅ Sem divergências' : `⚠️ Dif: R$ ${cashDifference.toFixed(2)}`}

💳 *CARTÕES & PIX:*
• Cartão Sistema: R$ ${fechamento.sintegraCard.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | POS: R$ ${totalPosCard.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${cardDifference >= 0 ? `+R$ ${cardDifference.toFixed(2)}` : `-R$ ${Math.abs(cardDifference).toFixed(2)}`})
• PIX Sistema: R$ ${fechamento.sintegraPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | POS: R$ ${totalPosPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${pixDifference >= 0 ? `+R$ ${pixDifference.toFixed(2)}` : `-R$ ${Math.abs(pixDifference).toFixed(2)}`})
• Compensação: ${isCompensated ? `💡 Compensação Cartão/PIX OK (diferença de R$ ${fmt(Math.abs(cardDifference))} se anula — Saldo Líquido: R$ 0,00)` : cardPixOk ? '✅ Sem divergências' : '⚠️ Divergência'}
• Motivo: ${fechamento.justificationReason}

🏦 *SALDO ACUMULADO COFRE:*
• 26/10: R$ ${fechamento.safePreviousDay.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• 27/10: R$ ${fechamento.safeToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• Total em Cofre: R$ ${totalInSafe.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• Último Depósito: ${fechamento.lastBankDeposit.date} - R$ ${fechamento.lastBankDeposit.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${fechamento.lastBankDeposit.bank})

✅ *Biometria Facial do Gerente: HOMOLOGADA*
✍️ *Assinatura Digital: VALIDADA NA TELA*
🛡️ *Protocolo de Segurança: SINT-TOP-007-271026*`;

  const copyWhatsAppReport = () => {
    navigator.clipboard.writeText(whatsAppReportText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* ALERTA DE SUCESSO DE FECHAMENTO */}
      {closingSuccessAlert && (
        <div className="rounded-2xl bg-emerald-600 text-white p-4 shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <div className="font-bold text-sm sm:text-base">Fechamento do Caixa Concluído com Sucesso!</div>
              <div className="text-xs text-emerald-100">O espelho oficial e fotos foram arquivados e enviados para o WhatsApp da Diretoria.</div>
            </div>
          </div>
          <button
            onClick={() => setClosingSuccessAlert(false)}
            className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold"
          >
            Fechar
          </button>
        </div>
      )}

      {/* 1. CABEÇALHO SUPERIOR + SELETOR DE ABAS */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-card">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-yellow p-1.5 border border-brand-yellow-warm/40 shrink-0 shadow-sm flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-[#0B1560] tracking-tight">
                  {fechamento.storeName}
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {fechamento.storeCode}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-red" />
                  {fechamento.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  Gerente: {fechamento.managerName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <Clock className="w-3.5 h-3.5" />
                  {fechamento.isClosed ? `Fechado às ${fechamento.closedAt}` : 'Em Fechamento'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isManual && (
            <button
              onClick={handleSyncSintegra}
              disabled={isSintegraSyncing}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition disabled:opacity-50"
              title="Sincronizar com ERP Sintegra"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSintegraSyncing ? 'animate-spin text-brand-blue' : ''}`} />
              <span>{isSintegraSyncing ? 'Sincronizando...' : '🔄 Sincronizar Sintegra'}</span>
            </button>
            )}
          </div>
        </div>

        {/* Seletor de modo: com integração Sintegra ou lançamento manual */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100">
          <button
            type="button"
            onClick={() => setIntegrationMode('sintegra')}
            className={`min-h-[48px] px-3 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              !isManual ? 'bg-white text-[#0B1560] shadow-sm' : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <Plug className="w-4 h-4 text-brand-blue" />
            Com integração Sintegra
          </button>
          <button
            type="button"
            onClick={() => setIntegrationMode('manual')}
            className={`min-h-[48px] px-3 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              isManual ? 'bg-white text-[#0B1560] shadow-sm' : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <Pencil className="w-4 h-4 text-amber-600" />
            Sem integração (digitar valores)
          </button>
        </div>

        {!isManual ? (
        <>
        {/* Card Destaque API Sintegra */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-brand-blue-light/80 via-white to-amber-50/60 border border-blue-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-blue" />
              Total Apurado na API Sintegra (Retaguarda Oficial):
            </div>
            <div className="text-2xl sm:text-4xl font-black text-brand-blue mt-1 tracking-tight">
              R$ {fechamento.sintegraTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">
              Sincronizado automaticamente com os PDVs da filial
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 shadow-xs hover:border-emerald-300 transition">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span>💵 Dinheiro Sintegra</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                R$ {fechamento.sintegraCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 shadow-xs hover:border-blue-300 transition">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span>💳 Cartão Sintegra</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-brand-blue mt-1">
                R$ {fechamento.sintegraCard.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 shadow-xs hover:border-emerald-300 transition">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span>📲 PIX Sintegra</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-emerald-700 mt-1">
                R$ {fechamento.sintegraPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Todas as vendas do sistema (Sintegra) */}
        <SintegraSalesPanel
          expected={{
            dinheiro: fechamento.sintegraCash,
            cartao: fechamento.sintegraCard,
            pix: fechamento.sintegraPix,
            total: fechamento.sintegraTotal,
          }}
          syncedAt={lastSync}
        />
        </>
        ) : (
        /* Lançamento manual: loja sem integração */
        <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/60 space-y-3">
          <div className="flex items-start gap-2">
            <Pencil className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                Loja sem integração — lançamento manual
              </div>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Digite os valores do relatório de fechamento do sistema da loja. Depois informe o dinheiro contado no caixa e o total de cada maquininha: a tela confere tudo e monta a mensagem do WhatsApp.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'sys-cash', label: '💵 Dinheiro (sistema)', value: fechamento.sintegraCash, set: (n: number) => setSystemValues({ cash: n }) },
              { id: 'sys-card', label: '💳 Cartão (sistema)', value: fechamento.sintegraCard, set: (n: number) => setSystemValues({ card: n }) },
              { id: 'sys-pix', label: '📲 PIX (sistema)', value: fechamento.sintegraPix, set: (n: number) => setSystemValues({ pix: n }) },
            ].map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {f.label}
                </label>
                <input
                  id={f.id}
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={f.value}
                  onChange={(e) => f.set(parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                  className="w-full min-h-[48px] px-3.5 py-3 rounded-xl border-2 border-slate-300 focus:border-brand-blue bg-white font-mono font-bold text-base text-slate-900"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="text-xs font-bold text-slate-700">
              Total do sistema:{' '}
              <span className="text-lg font-black text-brand-blue">R$ {fmt(systemTotal)}</span>
            </div>
            <button
              type="button"
              onClick={() => setSystemValues({ cash: 0, card: 0, pix: 0 })}
              className="min-h-[40px] px-3 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 transition"
            >
              Zerar campos
            </button>
          </div>
        </div>
        )}

        {/* Navegação em 2 Abas Grandes e Claras */}
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            type="button"
            onClick={() => setActiveTab('dia')}
            className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'dia'
                ? 'bg-[#0B1560] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-brand-yellow" />
            <span>Aba 1: Fechamento do Dia (27/10)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cofre')}
            className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'cofre'
                ? 'bg-[#0B1560] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Vault className="w-4 h-4 text-brand-yellow" />
            <span>Aba 2: Cofre & Depósitos</span>
            <span className="hidden sm:inline-block text-[11px] bg-brand-yellow text-brand-blue px-2 py-0.5 rounded-full font-extrabold">
              R$ {totalInSafe.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </button>
        </div>

      </div>

      {/* 2. CONTEÚDO DA ABA 1: FECHAMENTO DO DIA */}
      {activeTab === 'dia' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* BLOCO A: 💵 Dinheiro & Retiradas */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#0B1560]">
                      BLOCO A: Dinheiro & Retiradas
                    </h2>
                    <p className="text-xs text-slate-500">
                      {systemLabel}: R$ {fmt(fechamento.sintegraCash)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsRetiradaModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Nova Retirada</span>
                </button>
              </div>

              {/* Subseção: Retiradas / Saídas do Dia */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Retiradas / Despesas do Dia (Sangrias):
                  </span>
                  <span className="text-xs font-bold text-brand-red">
                    Total: R$ {totalRetiradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="space-y-2">
                  {fechamento.retiradas.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-100/80 transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.photoUrl}
                          alt={item.description}
                          onClick={() => setSelectedPhoto({ url: item.photoUrl, title: `Comprovante - ${item.description}`, meta: { amount: `R$ ${item.amount.toFixed(2)}`, date: item.time, status: 'Anexo Homologado' } })}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-300 cursor-pointer shadow-xs hover:opacity-80 transition"
                          title="Clique para ver comprovante"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} - {item.description}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400">{item.time}</span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                              📷 Foto Anexada
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedPhoto({ url: item.photoUrl, title: `Comprovante - ${item.description}` })}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white"
                          title="Ver recibo ampliado"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRetirada(item.id)}
                          className="p-1.5 text-slate-400 hover:text-brand-red rounded-lg hover:bg-red-50"
                          title="Remover retirada"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subseção: Conferência Física da Gaveta */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    Esperado em Caixa:
                  </span>
                  <span className="font-bold text-brand-blue">
                    R$ {expectedCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({systemLabel} R$ {fmt(fechamento.sintegraCash)} - Retiradas R$ {fmt(totalRetiradas)})
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Valor Físico Contado em Caixa (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={fechamento.cashPhysicalCount}
                    onChange={(e) => setCashPhysicalCount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-300 focus:border-brand-blue font-mono font-bold text-lg text-slate-900 bg-white"
                  />
                </div>

                {/* Botão Obrigatório Foto do Caixa */}
                <CameraCapture
                  label="Foto Obrigatória da Gaveta / Dinheiro Físico"
                  photoUrl={fechamento.cashDrawerPhoto}
                  onPhotoCapture={setCashDrawerPhoto}
                  mockType="drawer"
                  buttonText="Tirar Foto do Dinheiro/Caixa"
                  requiredBadge={true}
                />

                {/* Badge de Status Dinâmico */}
                <div className="pt-1">
                  {Math.abs(cashDifference) < 0.01 ? (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>✅ Diferença: Sem divergências (Bateu 100% com o caixa)</span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-brand-red text-xs font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-brand-red shrink-0" />
                      <span>
                        ⚠️ Diferença no Dinheiro:{' '}
                        {cashDifference > 0 ? `+ R$ ${cashDifference.toFixed(2)} (Sobra)` : `- R$ ${Math.abs(cashDifference).toFixed(2)} (Falta / Quebra)`}
                      </span>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* BLOCO B: 💳 Cartão & 📲 PIX (Múltiplas Maquininhas POS por Marca) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-brand-blue font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-[#0B1560]">
                      BLOCO B: Cartão & PIX (Maquininhas POS)
                    </h2>
                    <p className="text-xs text-slate-500">
                      {systemLabel}: Cartão R$ {fmt(fechamento.sintegraCard)} | PIX R$ {fmt(fechamento.sintegraPix)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPosModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Adicionar Maquininha</span>
                </button>
              </div>

              {/* Lista de Maquininhas POS Lançadas */}
              <div className="space-y-2.5">
                {fechamento.posMachines.map((pos) => (
                  <div
                    key={pos.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-brand-blue">
                          {pos.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                          {pos.serial}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        💳 Cartão: <strong>R$ {(pos.creditTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> • 📲 PIX: <strong>R$ {(pos.pixTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        📷 Filipeta OK
                      </span>
                      {pos.photoUrl && (
                        <button
                          type="button"
                          onClick={() => setSelectedPhoto({ url: pos.photoUrl!, title: `Filipeta ${pos.name}` })}
                          className="p-1 text-slate-400 hover:text-slate-700"
                          title="Ver filipeta"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Painel Comparativo Automático (Cartão & PIX) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Confronto: {systemLabel} vs. Maquininhas Físicas
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-slate-500 font-medium">💳 Cartão de Crédito/Débito:</div>
                    <div className="text-slate-800 mt-0.5">{systemLabel}: R$ {fmt(fechamento.sintegraCard)} vs POS: R$ {fmt(totalPosCard)}</div>
                    <div className={`mt-1 font-bold px-2 py-0.5 rounded inline-block ${diffBadge(cardDifference)}`}>
                      {diffText(cardDifference)}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-slate-500 font-medium">📲 PIX nas Maquininhas:</div>
                    <div className="text-slate-800 mt-0.5">{systemLabel}: R$ {fmt(fechamento.sintegraPix)} vs POS: R$ {fmt(totalPosPix)}</div>
                    <div className={`mt-1 font-bold px-2 py-0.5 rounded inline-block ${diffBadge(pixDifference)}`}>
                      {diffText(pixDifference)}
                    </div>
                  </div>
                </div>

                {/* Alerta Inteligente de Compensação */}
                {isCompensated && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>💡 Compensação Detectada:</strong> A diferença de R$ {fmt(Math.abs(cardDifference))} entre Cartão ({cardDifference > 0 ? '+' : '-'}{fmt(Math.abs(cardDifference))}) e PIX ({pixDifference > 0 ? '+' : '-'}{fmt(Math.abs(pixDifference))}) se anula perfeitamente. Saldo Líquido: <strong>R$ 0,00</strong>.
                    </div>
                  </div>
                )}

                {/* Alerta de divergência sem compensação */}
                {!cardPixOk && !isCompensated && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-brand-red text-xs leading-relaxed flex items-start gap-2 font-semibold">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      Divergência entre {systemLabel} e maquininhas: Cartão {cardDifference > 0 ? '+' : '-'} R$ {fmt(Math.abs(cardDifference))} / PIX {pixDifference > 0 ? '+' : '-'} R$ {fmt(Math.abs(pixDifference))}. Informe a justificativa abaixo.
                    </div>
                  </div>
                )}

                {/* Campo Obrigatório de Justificativa */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Justificativa da Compensação (Obrigatória)
                  </label>
                  <select
                    value={fechamento.justificationReason}
                    onChange={(e) => setJustificationReason(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="Troca na forma de pagamento">Troca na forma de pagamento (PIX no sistema vs Cartão na maquininha)</option>
                    <option value="Cancelamento e reemissão">Cancelamento e reemissão de comprovante</option>
                    <option value="Erro de digitação operador">Erro de digitação do operador no PDV</option>
                  </select>
                  <input
                    type="text"
                    value={fechamento.justificationObs}
                    onChange={(e) => setJustificationObs(e.target.value)}
                    placeholder="Observações complementares para a auditoria..."
                    className="w-full mt-2 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                  />
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* Prévia da mensagem (modo manual) */}
      {activeTab === 'dia' && isManual && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-emerald-200 shadow-card space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-emerald-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Mensagem que será enviada no WhatsApp
            </h3>
            <button
              type="button"
              onClick={copyWhatsAppReport}
              className="min-h-[40px] inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300 hover:bg-emerald-100 transition"
            >
              {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copiado!' : 'Copiar texto'}</span>
            </button>
          </div>
          <div className="p-3 bg-[#EFEAE2] rounded-xl border border-[#DDD6CD] font-mono text-xs text-slate-800 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
            {whatsAppReportText}
          </div>
        </div>
      )}

      {/* BLOCO C: 📊 RESUMO DAS DIFERENÇAS & BARRA FIXA DE FECHAMENTO */}
      {activeTab === 'dia' && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Resumo Geral de Conformidade do Caixa:
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold">
              <span className={`px-2.5 py-1 rounded-lg border ${cashOk ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-brand-red bg-red-50 border-red-200'}`}>
                💵 Dinheiro: {cashOk ? 'Sem divergências' : `${cashDifference > 0 ? 'Sobra' : 'Falta'} de R$ ${fmt(Math.abs(cashDifference))}`}
              </span>
              <span className={`px-2.5 py-1 rounded-lg border ${cardPixOk ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : isCompensated ? 'text-amber-800 bg-amber-50 border-amber-200' : 'text-brand-red bg-red-50 border-red-200'}`}>
                💳 Cartão/PIX: {cardPixOk ? 'Sem divergências' : isCompensated ? `Compensado R$ ${fmt(Math.abs(cardDifference))}` : `Divergência (Cartão ${cardDifference > 0 ? '+' : '-'}${fmt(Math.abs(cardDifference))} / PIX ${pixDifference > 0 ? '+' : '-'}${fmt(Math.abs(pixDifference))})`}
              </span>
              <span className={`px-2.5 py-1 rounded-lg border ${allOk ? 'text-brand-blue bg-blue-50 border-blue-200' : 'text-brand-red bg-red-50 border-red-200'}`}>
                📊 Total Apurado: R$ {fmt(systemTotal)} {allOk ? 'OK' : '— com divergência'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFinalModalOpen(true)}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl bg-brand-red hover:bg-brand-red-hover active:scale-[0.99] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-btn hover:shadow-btn-hover transition-all duration-200"
            >
              <Lock className="w-5 h-5" />
              <span>Finalizar Caixa, Tirar Selfie e Assinar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* 4. CONTEÚDO DA ABA 2: COFRE & DEPÓSITOS */}
      {activeTab === 'cofre' && (
        <div className="space-y-6">
          
          {/* Top Cards do Cofre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  💰 Saldo Total Acumulado no Cofre:
                </div>
                <div className="text-2xl sm:text-3xl font-black text-brand-blue mt-1">
                  R$ {totalInSafe.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Soma de 26/10 (R$ 3.401,50) + 27/10 (R$ {fechamento.safeToday.toFixed(2)})
                </div>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Vault className="w-8 h-8" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  🏦 Último Depósito Realizado:
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
                  26/10 - R$ {fechamento.lastBankDeposit.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {fechamento.lastBankDeposit.bank} (Autenticado)
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto({ url: fechamento.lastBankDeposit.receiptUrl, title: 'Comprovante do Último Depósito Bancário' })}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl transition"
                title="Ver comprovante bancário"
              >
                <Eye className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Dias em Aberto no Cofre (Aguardando Depósito) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Dias em Aberto no Cofre (Aguardando Malote / Depósito):
              </h3>
              <span className="text-xs font-bold text-brand-blue">
                2 Dias Selecionados para Depósito
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-blue" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">26/10/2026 - Segunda-feira</div>
                    <div className="text-xs text-slate-500">Saldo em cofre conferido</div>
                  </div>
                </div>
                <span className="font-bold text-sm text-slate-800">R$ 3.401,50</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-blue" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">27/10/2026 - Terça-feira (Hoje)</div>
                    <div className="text-xs text-slate-500">Fechamento do dia</div>
                  </div>
                </div>
                <span className="font-bold text-sm text-slate-800">R$ {fechamento.safeToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Formulário: Registrar Novo Depósito Bancário */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building2 className="w-5 h-5 text-brand-blue" />
              <h3 className="text-base font-extrabold text-[#0B1560]">
                Registrar Novo Depósito Bancário
              </h3>
            </div>

            {depositSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Depósito registrado com sucesso! Comprovante enviado para o setor financeiro.
              </div>
            )}

            <form onSubmit={handleSaveDeposit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Valor Depositado (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold text-sm text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Banco de Destino
                  </label>
                  <select
                    value={depositBank}
                    onChange={(e) => setDepositBank(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-medium text-sm text-slate-800 bg-white"
                  >
                    <option value="Banco do Brasil">Banco do Brasil (Ag: 1823-4 | CC: 29841-0)</option>
                    <option value="Itaú Unibanco">Itaú Unibanco (Ag: 0941 | CC: 88412-2)</option>
                    <option value="Bradesco">Bradesco (Ag: 2210 | CC: 44100-8)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Observações do Depósito / Número do Envelope / Malote
                </label>
                <input
                  type="text"
                  value={depositObs}
                  onChange={(e) => setDepositObs(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              {/* Upload / Foto Obrigatória do Comprovante */}
              <CameraCapture
                label="Comprovante de Depósito Bancário (Obrigatório)"
                photoUrl={depositPhoto}
                onPhotoCapture={setDepositPhoto}
                mockType="deposit"
                buttonText="Tirar Foto do Comprovante de Depósito"
                requiredBadge={true}
              />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!depositPhoto}
                  className="w-full py-3.5 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-sm disabled:opacity-50 transition shadow-md"
                >
                  Confirmar e Registrar Depósito Bancário
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* MODAL 1: LANÇAR NOVA RETIRADA / DESPESA COM TRAVA OBRIGATÓRIA DE FOTO */}
      {isRetiradaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 border border-slate-200">
            <h3 className="text-base font-extrabold text-[#0B1560] mb-1">
              Lançar Nova Retirada / Despesa de Caixa
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Trava obrigatória: tire a foto do comprovante para habilitar a gravação.
            </p>

            <form onSubmit={handleSaveRetirada} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Descrição / Motivo
                </label>
                <input
                  type="text"
                  value={retiradaDesc}
                  onChange={(e) => setRetiradaDesc(e.target.value)}
                  placeholder="Ex: Água mineral para funcionários"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Valor da Despesa (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={retiradaVal}
                  onChange={(e) => setRetiradaVal(e.target.value)}
                  placeholder="0,00"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-sm"
                />
              </div>

              {/* Trava Obrigatória de Foto */}
              <CameraCapture
                label="Foto do Recibo / Comprovante (Obrigatória)"
                photoUrl={retiradaPhoto}
                onPhotoCapture={setRetiradaPhoto}
                mockType="snack"
                buttonText="Tirar Foto do Recibo"
                requiredBadge={true}
              />

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRetiradaModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!retiradaPhoto || !retiradaDesc || !retiradaVal}
                  className="flex-[2] py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold disabled:opacity-50 transition shadow-btn"
                >
                  Salvar Retirada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADICIONAR NOVA MAQUININHA POS */}
      {isPosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 border border-slate-200">
            <h3 className="text-base font-extrabold text-[#0B1560] mb-1">
              Adicionar Maquininha POS
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Cadastre o terminal e informe os totais de Cartão e PIX da filipeta.
            </p>

            <form onSubmit={handleSavePosMachine} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Adquirente
                  </label>
                  <select
                    value={posBrand}
                    onChange={(e) => setPosBrand(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                  >
                    <option value="Stone">Stone</option>
                    <option value="Cielo">Cielo</option>
                    <option value="Rede">Rede</option>
                    <option value="PagBank">PagBank</option>
                    <option value="Getnet">Getnet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Apelido do Terminal
                  </label>
                  <input
                    type="text"
                    value={posName}
                    onChange={(e) => setPosName(e.target.value)}
                    placeholder="Ex: Caixa 03 - Balcão"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Total Cartão (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={posCredit}
                    onChange={(e) => setPosCredit(e.target.value)}
                    placeholder="0,00"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Total PIX (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={posPix}
                    onChange={(e) => setPosPix(e.target.value)}
                    placeholder="0,00"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs"
                  />
                </div>
              </div>

              <CameraCapture
                label="Foto Obrigatória da Filipeta Impressa"
                photoUrl={posPhoto}
                onPhotoCapture={setPosPhoto}
                mockType="stone"
                buttonText="Tirar Foto da Filipeta"
                requiredBadge={true}
              />

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPosModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!posPhoto}
                  className="flex-[2] py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold disabled:opacity-50 transition shadow-md"
                >
                  Salvar Maquininha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VALIDAÇÃO FINAL (SELFIE + ASSINATURA + WHATSAPP PREVIEW) */}
      {isFinalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
            
            {/* Barra Decorativa */}
            <div className="h-1.5 w-full flex">
              <div className="w-1/3 bg-brand-red" />
              <div className="w-1/3 bg-brand-yellow" />
              <div className="w-1/3 bg-brand-blue" />
            </div>

            <div className="p-5 sm:p-7 space-y-6 max-h-[85vh] overflow-y-auto">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#0B1560]">
                    Validação Biométrica e Fechamento de Caixa
                  </h3>
                  <p className="text-xs text-slate-500">
                    {fechamento.storeName} • 27/10/2026 19:45
                  </p>
                </div>
                <button
                  onClick={() => setIsFinalModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
                >
                  Fechar
                </button>
              </div>

              {/* PASSO 1: SELFIE DO GERENTE */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">1</span>
                    Foto do Rosto (Selfie do Gerente Carlos Eduardo)
                  </span>
                  {fechamento.managerSelfie && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Biometria OK
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {fechamento.managerSelfie ? (
                    <div className="flex items-center gap-3 w-full">
                      <img
                        src={fechamento.managerSelfie}
                        alt="Selfie Gerente"
                        className="w-16 h-16 object-cover rounded-xl border-2 border-emerald-500 shadow-sm"
                      />
                      <div className="flex-1 text-xs">
                        <div className="font-bold text-slate-800">Selfie Capturada com Sucesso</div>
                        <div className="text-[11px] text-slate-500">Timestamp: 27/10/2026 19:45:00 • Loja 7</div>
                        <button
                          type="button"
                          onClick={() => setIsSelfieCameraOpen(true)}
                          className="text-[11px] text-brand-blue font-bold hover:underline mt-1"
                        >
                          Tirar outra foto
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsSelfieCameraOpen(true)}
                      className="w-full py-3 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <Camera className="w-4 h-4 text-brand-yellow" />
                      <span>📸 Abrir Câmera e Capturar Selfie</span>
                    </button>
                  )}
                </div>
              </div>

              {/* PASSO 2: ASSINATURA DIGITAL NA TELA (TOUCH / MOUSE CANVAS) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">2</span>
                  Assinatura Digital do Gerente na Tela
                </span>

                <SignatureCanvas
                  onSignatureChange={setManagerSignature}
                  initialSignature={fechamento.managerSignature}
                  label="Desenhe com o dedo ou mouse:"
                />
              </div>

              {/* PASSO 3: PRÉVIA DO RELATÓRIO OFICIAL DO WHATSAPP */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                    Prévia do Relatório Formatado para WhatsApp
                  </span>

                  <button
                    type="button"
                    onClick={copyWhatsAppReport}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white px-2 py-1 rounded-lg border border-emerald-300 hover:bg-emerald-50 transition"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? 'Copiado!' : 'Copiar Texto'}</span>
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200 font-mono text-xs text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed shadow-inner">
                  {whatsAppReportText}
                </div>
              </div>

              {/* BOTÃO FINALIZAR E DISPARAR NO WHATSAPP */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConfirmFinalClosing}
                  disabled={!fechamento.managerSelfie || !fechamento.managerSignature}
                  className="w-full min-h-[52px] py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>✅ Confirmar Fechamento e Disparar no WhatsApp</span>
                </button>
                {(!fechamento.managerSelfie || !fechamento.managerSignature) && (
                  <p className="text-[11px] text-center text-slate-500 mt-2 font-medium">
                    * Capture a selfie e assine na tela acima para habilitar o fechamento oficial.
                  </p>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL SELFIE CAMERA SIMULATOR */}
      <SelfieModal
        isOpen={isSelfieCameraOpen}
        onClose={() => setIsSelfieCameraOpen(false)}
        onSelfieCaptured={setManagerSelfie}
        storeName={fechamento.storeName}
        managerName={fechamento.managerName}
      />

      {/* MODAL ZOOM DE FOTOS DE EVIDÊNCIA */}
      {selectedPhoto && (
        <PhotoViewerModal
          isOpen={true}
          onClose={() => setSelectedPhoto(null)}
          title={selectedPhoto.title}
          photoUrl={selectedPhoto.url}
          metadata={selectedPhoto.meta}
        />
      )}

    </div>
  );
};

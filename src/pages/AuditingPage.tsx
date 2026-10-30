import React, { useState, useMemo } from 'react';
import { 
  ClipboardCheck, 
  MapPin, 
  ShieldCheck, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCw, 
  FileText, 
  Check, 
  X, 
  Eye, 
  Sparkles, 
  Lock, 
  Store as StoreIcon, 
  Calendar, 
  UserCheck, 
  Star, 
  MessageCircle,
  Download,
  Calculator,
  Plus,
  Minus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CameraCapture } from '../components/CameraCapture';
import { SignatureCanvas } from '../components/SignatureCanvas';
import { UniversalCameraModal } from '../components/UniversalCameraModal';
import { PhotoViewerModal } from '../components/PhotoViewerModal';
import { MOCK_IMAGES } from '../utils/mockImages';

export const AuditingPage: React.FC = () => {
  const { stores, audits, saveAuditRecord } = useApp();

  // Selected Store to audit
  const [selectedStoreCode, setSelectedStoreCode] = useState('LJ07');
  const store = stores.find((s) => s.code === selectedStoreCode) || stores[0];

  // Active Sub-tab
  const [activeTab, setActiveTab] = useState<'auditoria' | 'historico'>('auditoria');

  // Check-in state & foto
  const [checkInPhoto, setCheckInPhoto] = useState<string | null>(MOCK_IMAGES.auditorSelfie);

  // Passo 1: Blind Count & Cédulas
  const [showBillCalculator, setShowBillCalculator] = useState(true);
  const [billCounts, setBillCounts] = useState<{ [key: string]: number }>({
    '200': 10, // 2000
    '100': 30, // 3000
    '50': 25,  // 1250
    '20': 30,  // 600
    '10': 25,  // 250
    '5': 8,    // 40
    '2': 5,    // 10
    '1': 3,    // 3
  });

  const calculatedBillsTotal = useMemo(() => {
    return Object.entries(billCounts).reduce((acc, [denom, count]) => {
      return acc + parseFloat(denom) * (count || 0);
    }, 0);
  }, [billCounts]);

  const [blindCountInput, setBlindCountInput] = useState('7153.00');
  const [safePhoto, setSafePhoto] = useState<string | null>(MOCK_IMAGES.safeInspectionPhoto);
  const [drawerPhoto, setDrawerPhoto] = useState<string | null>(MOCK_IMAGES.drawerCashPhoto);
  const [hasCompared, setHasCompared] = useState(true);
  const expectedSafe = 7153.00; // Loja 7 exact expected

  // Passo 2: Checklist Presencial de Papéis
  const [checklist, setChecklist] = useState({
    snack: true,
    newspaper: true,
    posSlips: true,
    depositSlip: true,
  });

  // Fotos individuais do checklist
  const [snackPhoto, setSnackPhoto] = useState<string | null>(MOCK_IMAGES.receiptSnack);
  const [newspaperPhoto, setNewspaperPhoto] = useState<string | null>(MOCK_IMAGES.receiptNewspaper);
  const [posSlipPhoto, setPosSlipPhoto] = useState<string | null>(MOCK_IMAGES.posSlipStone);
  const [depositSlipPhoto, setDepositSlipPhoto] = useState<string | null>(MOCK_IMAGES.bankDepositSlip);

  // Passo 3: Parecer Técnico & Dupla Biometria
  const [rating, setRating] = useState<'conforme' | 'ressalvas' | 'grave'>('conforme');
  const [auditNotes, setAuditNotes] = useState('Auditoria presencial concluída em conformidade multinacional. Cofre físico conferido nota a nota, totalizando R$ 7.153,00 exatos. Envelopes e filipetas guardados no cofre.');

  // Auditor Selfie & Signature
  const [auditorSelfie, setAuditorSelfie] = useState<string | null>(MOCK_IMAGES.auditorSelfie);
  const [auditorSignature, setAuditorSignature] = useState<string | null>(MOCK_IMAGES.defaultSignature);

  // Manager Selfie & Signature
  const [managerSelfie, setManagerSelfie] = useState<string | null>(MOCK_IMAGES.managerSelfie);
  const [managerSignature, setManagerSignature] = useState<string | null>(MOCK_IMAGES.defaultSignature);

  // Câmera universal ativa para qualquer ação de captura
  const [cameraModalConfig, setCameraModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    target: 'checkin' | 'safe' | 'drawer' | 'snack' | 'newspaper' | 'pos' | 'deposit' | 'auditor' | 'manager';
    mockType: 'safe' | 'snack' | 'newspaper' | 'stone' | 'cielo' | 'drawer' | 'deposit' | 'auditor' | 'manager';
  }>({
    isOpen: false,
    title: 'Câmera de Auditoria',
    target: 'safe',
    mockType: 'safe',
  });

  // Final Modal
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);
  const [termSuccessAlert, setTermSuccessAlert] = useState(false);

  // Photo viewer modal
  const [photoViewer, setPhotoViewer] = useState<{ url: string; title: string } | null>(null);

  // Blind count calculations
  const parsedCount = parseFloat(blindCountInput) || calculatedBillsTotal || (hasCompared ? expectedSafe : 0);
  const diff = parsedCount - expectedSafe;
  const isExact = Math.abs(diff) < 0.01;

  const handleSimulateFill = (amount: number) => {
    setBlindCountInput(amount.toFixed(2));
    setHasCompared(true);
  };

  const updateBillCount = (denom: string, delta: number) => {
    setBillCounts((prev) => {
      const current = prev[denom] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev, [denom]: next };
      const total = Object.entries(updated).reduce((acc, [d, c]) => acc + parseFloat(d) * c, 0);
      setBlindCountInput(total.toFixed(2));
      return updated;
    });
  };

  const openCameraFor = (
    target: 'checkin' | 'safe' | 'drawer' | 'snack' | 'newspaper' | 'pos' | 'deposit' | 'auditor' | 'manager',
    title: string,
    mockType: 'safe' | 'snack' | 'newspaper' | 'stone' | 'cielo' | 'drawer' | 'deposit' | 'auditor' | 'manager'
  ) => {
    setCameraModalConfig({
      isOpen: true,
      title,
      target,
      mockType,
    });
  };

  const handleCapturedPhoto = (dataUrl: string) => {
    switch (cameraModalConfig.target) {
      case 'checkin': setCheckInPhoto(dataUrl); break;
      case 'safe': setSafePhoto(dataUrl); break;
      case 'drawer': setDrawerPhoto(dataUrl); break;
      case 'snack': setSnackPhoto(dataUrl); break;
      case 'newspaper': setNewspaperPhoto(dataUrl); break;
      case 'pos': setPosSlipPhoto(dataUrl); break;
      case 'deposit': setDepositSlipPhoto(dataUrl); break;
      case 'auditor': setAuditorSelfie(dataUrl); break;
      case 'manager': setManagerSelfie(dataUrl); break;
    }
  };

  const handleFinalizeAudit = () => {
    saveAuditRecord({
      storeCode: store.code,
      storeName: store.name,
      date: '27/10/2026 19:55',
      auditorName: 'Marcos Vinícius (Supervisor Regional)',
      blindCount: parsedCount,
      expectedAmount: expectedSafe,
      difference: diff,
      isMatches: isExact,
      safePhotoUrl: safePhoto || MOCK_IMAGES.safeInspectionPhoto,
      auditorSelfieUrl: auditorSelfie || MOCK_IMAGES.auditorSelfie,
      auditorSignatureUrl: auditorSignature || MOCK_IMAGES.defaultSignature,
      managerSelfieUrl: managerSelfie || MOCK_IMAGES.managerSelfie,
      managerSignatureUrl: managerSignature || MOCK_IMAGES.defaultSignature,
      notes: auditNotes,
      rating: rating,
      checklists: {
        snackPaper: checklist.snack,
        newspaperPaper: checklist.newspaper,
        posSlipsPaper: checklist.posSlips,
        depositSlipPaper: checklist.depositSlip,
      },
      notifiedWhatsApp: true,
    });

    setIsTermModalOpen(false);
    setTermSuccessAlert(true);
    setTimeout(() => setTermSuccessAlert(false), 5000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* Alerta de Sucesso */}
      {termSuccessAlert && (
        <div className="rounded-2xl bg-emerald-600 text-white p-4 shadow-xl flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <div className="font-bold text-sm sm:text-base">Laudo de Auditoria Presencial Finalizado!</div>
              <div className="text-xs text-emerald-100">O laudo com dupla assinatura foi gerado e enviado ao grupo da Diretoria no WhatsApp.</div>
            </div>
          </div>
          <button
            onClick={() => setTermSuccessAlert(false)}
            className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold"
          >
            OK
          </button>
        </div>
      )}

      {/* Topo: Abas da Tela */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-brand-blue flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-brand-red shrink-0" />
            Módulo de Auditoria Presencial na Loja
          </h1>
          <p className="text-xs text-slate-500">
            Conferência in loco com calculadora de cédulas, fotos ao vivo e laudo homologado
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('auditoria')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'auditoria'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Auditoria em Andamento
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'historico'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📜 Histórico ({audits.length})
          </button>
        </div>
      </div>

      {activeTab === 'auditoria' && (
        <div className="space-y-6">
          
          {/* 1. CABEÇALHO DE CHECK-IN PRESENCIAL DO AUDITOR */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <StoreIcon className="w-5 h-5 text-brand-blue shrink-0" />
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Unidade Auditada:
                  </label>
                  <select
                    value={selectedStoreCode}
                    onChange={(e) => setSelectedStoreCode(e.target.value)}
                    className="font-black text-sm sm:text-base text-brand-blue bg-transparent focus:outline-none cursor-pointer max-w-full"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.code}>
                        {s.code} - {s.name} ({s.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                  📍 Localização: {store.name} — 27/10/2026
                </span>
              </div>
            </div>

            {/* Card de Check-in de Presença com Botão de Câmera Real */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-400">Auditor Responsável:</span>
                <div className="font-bold text-slate-800 mt-0.5">Marcos Vinícius (Supervisor Regional)</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-400">Gerente Acompanhando:</span>
                <div className="font-bold text-slate-800 mt-0.5">{store.manager} ({store.managerPhone})</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <span className="text-slate-400">Check-in Biométrico:</span>
                  <div className="font-bold text-emerald-700 mt-0.5">✅ Check-in Concluído</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openCameraFor('checkin', 'Foto de Check-in Presencial do Auditor', 'auditor')}
                    className="p-2 rounded-xl bg-brand-blue text-white hover:bg-brand-blue-hover transition"
                    title="Abrir Câmera de Check-in"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoViewer({ url: checkInPhoto || MOCK_IMAGES.auditorSelfie, title: 'Foto de Check-in na Loja' })}
                    className="p-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
                    title="Ver foto check-in"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PASSO 1: CONTAGEM CEGA DO COFRE FÍSICO COM CALCULADORA DE CÉDULAS */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-red text-white flex items-center justify-center text-xs font-black shrink-0">1</span>
                <div>
                  <h3 className="text-base font-extrabold text-brand-blue">
                    PASSO 1: Contagem "Às Cegas" do Cofre & Gaveta (Anti-Fraude)
                  </h3>
                  <p className="text-xs text-slate-500">
                    O auditor conta nota a nota antes de confrontar com o saldo do sistema
                  </p>
                </div>
              </div>

              {/* Botão de Alternar Calculadora de Cédulas */}
              <button
                type="button"
                onClick={() => setShowBillCalculator(!showBillCalculator)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition self-start sm:self-auto"
              >
                <Calculator className="w-3.5 h-3.5 text-brand-blue" />
                <span>{showBillCalculator ? 'Ocultar Cédulas' : 'Abrir Contagem de Cédulas'}</span>
              </button>
            </div>

            {/* CALCULADORA INTERATIVA DE CÉDULAS & MOEDAS */}
            {showBillCalculator && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-brand-blue" />
                    Contagem Rápida de Cédulas & Moedas
                  </span>
                  <span className="text-xs font-black text-brand-blue bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    Soma das Cédulas: R$ {calculatedBillsTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Grid das Denominações Responsivo */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { denom: '200', label: 'R$ 200,00', color: 'border-slate-300 bg-amber-50/50' },
                    { denom: '100', label: 'R$ 100,00', color: 'border-sky-200 bg-sky-50/50' },
                    { denom: '50', label: 'R$ 50,00', color: 'border-amber-200 bg-amber-50/50' },
                    { denom: '20', label: 'R$ 20,00', color: 'border-yellow-200 bg-yellow-50/50' },
                    { denom: '10', label: 'R$ 10,00', color: 'border-red-200 bg-red-50/50' },
                    { denom: '5', label: 'R$ 5,00', color: 'border-purple-200 bg-purple-50/50' },
                    { denom: '2', label: 'R$ 2,00', color: 'border-blue-200 bg-blue-50/50' },
                    { denom: '1', label: 'Moedas (R$ 1)', color: 'border-slate-200 bg-slate-100/50' },
                  ].map((item) => (
                    <div key={item.denom} className={`p-2.5 rounded-xl border ${item.color} flex flex-col justify-between space-y-1.5`}>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-800">{item.label}</span>
                        <span className="text-[10px] font-bold text-slate-500">
                          R$ {((billCounts[item.denom] || 0) * parseFloat(item.denom)).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <button
                          type="button"
                          onClick={() => updateBillCount(item.denom, -1)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-black text-sm text-brand-blue min-w-[28px] text-center">
                          {billCounts[item.denom] || 0}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateBillCount(item.denom, 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Grande de Contagem */}
            <div className="space-y-3">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Valor Total em Espécie Contado no Cofre (R$)
                  </label>

                  {/* Botões Rápidos de Simulação para Demonstração */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleSimulateFill(7153.00)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition"
                    >
                      ✨ Preencher R$ 7.153,00 (Exato)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulateFill(7033.00)}
                      className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-brand-red text-[11px] font-bold border border-red-200 transition"
                    >
                      ⚠️ Simular Falta (R$ 120,00)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulateFill(7203.00)}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 transition"
                    >
                      ⚡ Simular Sobra (R$ 50,00)
                    </button>
                  </div>
                </div>

                <input
                  type="number"
                  step="0.01"
                  value={blindCountInput}
                  onChange={(e) => {
                    setBlindCountInput(e.target.value);
                    setHasCompared(false);
                  }}
                  placeholder="0,00"
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-300 focus:border-brand-blue font-mono font-black text-xl sm:text-2xl text-slate-900 bg-white"
                />
              </div>

              {/* Botões de Foto com Câmera do Cofre e da Gaveta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CameraCapture
                  label="Foto Obrigatória do Cofre Aberto / Cédulas"
                  photoUrl={safePhoto}
                  onPhotoCapture={setSafePhoto}
                  mockType="safe"
                  buttonText="Abrir Câmera do Cofre"
                  requiredBadge={true}
                />

                <CameraCapture
                  label="Foto da Gaveta de Dinheiro do Caixa"
                  photoUrl={drawerPhoto}
                  onPhotoCapture={setDrawerPhoto}
                  mockType="drawer"
                  buttonText="Abrir Câmera da Gaveta"
                  requiredBadge={true}
                />
              </div>

              {/* Botão Confrontar com o Sistema */}
              {!hasCompared && (
                <button
                  type="button"
                  onClick={() => setHasCompared(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-bold shadow-md transition"
                >
                  🔍 Confrontar com o Sistema
                </button>
              )}

              {/* Painel Comparativo Oficial Revelado */}
              {hasCompared && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-200">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Confronto com a Retaguarda Oficial ({store.name}):
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400">Saldo 26/10 em cofre:</span>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">R$ 3.401,50</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400">Saldo 27/10 em cofre:</span>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">R$ 3.751,50</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400">Total Esperado pelo Sistema:</span>
                      <div className="font-black text-brand-blue text-sm mt-0.5">R$ 7.153,00</div>
                    </div>
                  </div>

                  {isExact ? (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-extrabold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>✅ COFRE 100% CONFERIDO — Sem divergências físicas (R$ 7.153,00 exatos)</span>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-brand-red text-xs sm:text-sm font-extrabold flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-brand-red shrink-0" />
                      <span>
                        🚨 DIVERGÊNCIA IDENTIFICADA: Diferença de R$ {diff.toFixed(2)} entre a contagem física e o sistema!
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 3. PASSO 2: CHECKLIST DE NOTAS E COMPROVANTES FÍSICOS (PAPEL VS. FOTO) */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-brand-red text-white flex items-center justify-center text-xs font-black shrink-0">2</span>
              <div>
                <h3 className="text-base font-extrabold text-brand-blue">
                  PASSO 2: Checklist de Notas, Recibos e Filipetas Físicas
                </h3>
                <p className="text-xs text-slate-500">
                  Validação presencial dos papéis guardados no envelope da loja com captura de foto
                </p>
              </div>
            </div>

            <div className="space-y-3">
              
              {/* Item 1: Lanche */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={snackPhoto || MOCK_IMAGES.receiptSnack}
                    alt="Lanche"
                    onClick={() => setPhotoViewer({ url: snackPhoto || MOCK_IMAGES.receiptSnack, title: 'Recibo Despesa Lanche (R$ 54,00)' })}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-300 cursor-pointer hover:opacity-80 shadow-xs shrink-0"
                    title="Ver comprovante"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Despesa 27/10 — Lanche (R$ 54,00)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Cupom fiscal original arquivado no envelope do dia.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => openCameraFor('snack', 'Foto do Recibo de Lanche', 'snack')}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                    title="Tirar foto com a câmera"
                  >
                    <Camera className="w-4 h-4 text-brand-blue" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setChecklist({ ...checklist, snack: true })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      checklist.snack ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Papel OK</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChecklist({ ...checklist, snack: false })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      !checklist.snack ? 'bg-brand-red text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Extraviado</span>
                  </button>
                </div>
              </div>

              {/* Item 2: Jornal */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={newspaperPhoto || MOCK_IMAGES.receiptNewspaper}
                    alt="Jornal"
                    onClick={() => setPhotoViewer({ url: newspaperPhoto || MOCK_IMAGES.receiptNewspaper, title: 'Recibo Despesa Jornal (R$ 300,00)' })}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-300 cursor-pointer hover:opacity-80 shadow-xs shrink-0"
                    title="Ver comprovante"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Despesa 27/10 — Jornal para loja (R$ 300,00)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Recibo de entrega física assinado pelo fornecedor e gerente.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => openCameraFor('newspaper', 'Foto do Recibo de Jornal', 'newspaper')}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                    title="Tirar foto com a câmera"
                  >
                    <Camera className="w-4 h-4 text-brand-blue" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setChecklist({ ...checklist, newspaper: true })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      checklist.newspaper ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Papel OK</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChecklist({ ...checklist, newspaper: false })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      !checklist.newspaper ? 'bg-brand-red text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Extraviado</span>
                  </button>
                </div>
              </div>

              {/* Item 3: Filipetas POS */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={posSlipPhoto || MOCK_IMAGES.posSlipStone}
                    alt="Filipetas"
                    onClick={() => setPhotoViewer({ url: posSlipPhoto || MOCK_IMAGES.posSlipStone, title: 'Filipetas Físicas Stone & Cielo' })}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-300 cursor-pointer hover:opacity-80 shadow-xs shrink-0"
                    title="Ver filipetas"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Filipetas Impressas das Maquininhas POS (Stone & Cielo)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Tirinhas de papel com fechamento de lote arquivadas no envelope.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => openCameraFor('pos', 'Foto das Filipetas Físicas POS', 'stone')}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                    title="Tirar foto com a câmera"
                  >
                    <Camera className="w-4 h-4 text-brand-blue" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setChecklist({ ...checklist, posSlips: true })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      checklist.posSlips ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Papel OK</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChecklist({ ...checklist, posSlips: false })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      !checklist.posSlips ? 'bg-brand-red text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Extraviado</span>
                  </button>
                </div>
              </div>

              {/* Item 4: Depósito Bancário */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={depositSlipPhoto || MOCK_IMAGES.bankDepositSlip}
                    alt="Depósito"
                    onClick={() => setPhotoViewer({ url: depositSlipPhoto || MOCK_IMAGES.bankDepositSlip, title: 'Comprovante Físico de Depósito Bancário' })}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-300 cursor-pointer hover:opacity-80 shadow-xs shrink-0"
                    title="Ver comprovante"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Comprovante Físico do Último Depósito (26/10 - R$ 14.500,00)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Talão bancário original emitido pelo terminal eletrônico.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => openCameraFor('deposit', 'Foto do Comprovante de Depósito Bancário', 'deposit')}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                    title="Tirar foto com a câmera"
                  >
                    <Camera className="w-4 h-4 text-brand-blue" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setChecklist({ ...checklist, depositSlip: true })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      checklist.depositSlip ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Papel OK</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChecklist({ ...checklist, depositSlip: false })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      !checklist.depositSlip ? 'bg-brand-red text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Extraviado</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* 4. PASSO 3: PARECER TÉCNICO & DUPLA BIOMETRIA COM ASSINATURA */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-brand-red text-white flex items-center justify-center text-xs font-black shrink-0">3</span>
              <div>
                <h3 className="text-base font-extrabold text-brand-blue">
                  PASSO 3: Parecer do Auditor & Dupla Biometria (Auditor + Gerente)
                </h3>
                <p className="text-xs text-slate-500">
                  Classificação da unidade, parecer formal e assinaturas biométricas digitais
                </p>
              </div>
            </div>

            {/* Avaliação */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Classificação da Unidade nesta Auditoria:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setRating('conforme')}
                  className={`p-3 rounded-2xl border transition flex items-center gap-2 ${
                    rating === 'conforme'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>🟢 Conforme (100% OK)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRating('ressalvas')}
                  className={`p-3 rounded-2xl border transition flex items-center gap-2 ${
                    rating === 'ressalvas'
                      ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>🟡 Com Ressalvas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRating('grave')}
                  className={`p-3 rounded-2xl border transition flex items-center gap-2 ${
                    rating === 'grave'
                      ? 'bg-red-50 border-red-400 text-brand-red shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-brand-red shrink-0" />
                  <span>🔴 Não Conforme (Grave)</span>
                </button>
              </div>
            </div>

            {/* Parecer do Auditor */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Parecer Técnico do Supervisor Regional:
              </label>
              <textarea
                value={auditNotes}
                onChange={(e) => setAuditNotes(e.target.value)}
                rows={3}
                className="w-full p-3.5 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue leading-relaxed"
              />
            </div>

            {/* Dupla Assinatura e Selfie (Auditor + Gerente) Responsivo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              
              {/* Lado 1: Auditor Regional */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-brand-blue" />
                    Biometria do Auditor (Marcos)
                  </span>
                  <button
                    type="button"
                    onClick={() => openCameraFor('auditor', 'Selfie do Auditor Regional com Timestamp', 'auditor')}
                    className="text-[11px] font-bold text-brand-blue hover:underline flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Câmera</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={auditorSelfie || MOCK_IMAGES.auditorSelfie}
                    alt="Selfie Auditor"
                    onClick={() => setPhotoViewer({ url: auditorSelfie || MOCK_IMAGES.auditorSelfie, title: 'Selfie do Auditor' })}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm cursor-pointer shrink-0"
                    title="Ver foto"
                  />
                  <div className="flex-1">
                    <SignatureCanvas
                      label="Assinatura Digital do Auditor"
                      initialSignature={auditorSignature}
                      onSignatureChange={setAuditorSignature}
                    />
                  </div>
                </div>
              </div>

              {/* Lado 2: Gerente da Filial */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-brand-red" />
                    Biometria do Gerente ({store.manager})
                  </span>
                  <button
                    type="button"
                    onClick={() => openCameraFor('manager', `Selfie do Gerente ${store.manager}`, 'manager')}
                    className="text-[11px] font-bold text-brand-blue hover:underline flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Câmera</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={managerSelfie || MOCK_IMAGES.managerSelfie}
                    alt="Selfie Gerente"
                    onClick={() => setPhotoViewer({ url: managerSelfie || MOCK_IMAGES.managerSelfie, title: 'Selfie do Gerente' })}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm cursor-pointer shrink-0"
                    title="Ver foto"
                  />
                  <div className="flex-1">
                    <SignatureCanvas
                      label="Assinatura Digital do Gerente"
                      initialSignature={managerSignature}
                      onSignatureChange={setManagerSignature}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Botão Grande de Finalizar Auditoria */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsTermModalOpen(true)}
                className="w-full min-h-[52px] py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-brand-blue hover:from-emerald-700 hover:to-brand-blue-hover text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.98] transition"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>EMITIR TERMO OFICIAL DE AUDITORIA & ENVIAR NO WHATSAPP</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* SUB-ABA HISTÓRICO DE AUDITORIAS REALIZADAS */}
      {activeTab === 'historico' && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-black text-brand-blue flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-blue" />
              Histórico Oficial de Laudos de Auditoria Presencial
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              {audits.length} Laudos Arquivados
            </span>
          </div>

          <div className="space-y-3">
            {audits.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-brand-blue text-white text-[10px] font-black">
                      {rec.storeCode}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">{rec.storeName}</h4>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      rec.rating === 'conforme'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {rec.rating === 'conforme' ? '🟢 Conforme' : '🟡 Com Ressalvas'}
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 font-mono font-bold">
                    {rec.date}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {rec.notes}
                </p>

                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <div>
                    Auditor: <strong>{rec.auditorName}</strong> • Cofre: R$ {rec.blindCount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Enviado no WhatsApp da Diretoria
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DO TERMO OFICIAL DE AUDITORIA (LAUDO DA DIRETORIA) */}
      {isTermModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
            
            <div className="p-5 sm:p-7 space-y-5 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-brand-blue" />
                  <h3 className="text-base sm:text-lg font-black text-brand-blue">
                    Laudo Oficial de Auditoria Presencial — {store.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTermModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Data e Horário:</span>
                  <strong className="text-slate-900">27/10/2026 às 19:55</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unidade:</span>
                  <strong className="text-slate-900">{store.name} ({store.code}) - {store.city}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Auditor Regional:</span>
                  <strong className="text-slate-900">Marcos Vinícius</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gerente Responsável:</span>
                  <strong className="text-slate-900">{store.manager}</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                  <span className="text-slate-700">Contagem Física do Cofre:</span>
                  <span className="text-emerald-700">R$ {parsedCount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (100% Exato)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                <strong>💡 Parecer Homologado:</strong> {auditNotes}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs">
                  <img src={auditorSignature || MOCK_IMAGES.defaultSignature} alt="Assinatura Auditor" className="h-10 mx-auto object-contain" />
                  <span className="text-[10px] text-slate-500 font-bold block mt-1">Marcos Vinícius (Auditor)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs">
                  <img src={managerSignature || MOCK_IMAGES.defaultSignature} alt="Assinatura Gerente" className="h-10 mx-auto object-contain" />
                  <span className="text-[10px] text-slate-500 font-bold block mt-1">{store.manager} (Gerente)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleFinalizeAudit}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar e Arquivar Laudo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsTermModalOpen(false)}
                  className="py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Voltar e Ajustar
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* CÂMERA UNIVERSAL AO VIVO */}
      <UniversalCameraModal
        isOpen={cameraModalConfig.isOpen}
        onClose={() => setCameraModalConfig({ ...cameraModalConfig, isOpen: false })}
        onCapture={handleCapturedPhoto}
        title={cameraModalConfig.title}
        subtitle="Aponte a câmera para registrar a evidência da auditoria"
        storeName={store.name}
        mockFallbackType={cameraModalConfig.mockType}
      />

      {/* MODAL ZOOM DE FOTO */}
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

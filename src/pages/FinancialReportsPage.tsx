import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  MessageCircle, 
  Copy, 
  Check, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Filter, 
  Calendar, 
  Store as StoreIcon, 
  Share2, 
  ShieldCheck, 
  AlertTriangle,
  ZoomIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PhotoViewerModal } from '../components/PhotoViewerModal';
import { MOCK_IMAGES } from '../utils/mockImages';

export const FinancialReportsPage: React.FC = () => {
  const { fechamento, stores } = useApp();

  // Filters
  const [selectedDate, setSelectedDate] = useState('2026-10-27');
  const [selectedStore, setSelectedStore] = useState('LJ07');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'aprovados' | 'pendentes' | 'compensados'>('todos');

  // Copy status
  const [copied, setCopied] = useState(false);
  const [whatsAppDispatched, setWhatsAppDispatched] = useState(false);

  // Attachment approvals state
  const [attachmentsStatus, setAttachmentsStatus] = useState<Record<string, 'validado' | 'solicitar_novo'>>({
    lanche: 'validado',
    jornal: 'validado',
    gaveta: 'validado',
    stone: 'validado',
    cielo: 'validado',
    deposito: 'validado',
    selfie: 'validado',
  });

  // Photo viewer modal
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; meta?: any } | null>(null);

  // Exact WhatsApp formatted text requested
  const officialReportText = `*TOP UTILIDADES E PRESENTES - ESPELHO OFICIAL DE FECHAMENTO*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *DATA:* 27/10/2026 Terça-feira
🏪 *LOJA:* Loja Nº 7 Campinas (#SINT-TOP-007)
👤 *GERENTE:* Carlos Eduardo | ⏰ Fechamento: 19:45
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *VALOR TOTAL SINTEGRA:* R$ 24.157,00

💵 *DINHEIRO & GAVETA:*
• Sistema Sintegra: R$ 4.105,50
• Em Caixa Físico Contado: R$ 3.751,50
• Retiradas do Dia: R$ 354,00
  └ Lanche: R$ 54,00 (Comprovante Anexado)
  └ Jornal para loja: R$ 300,00 (Comprovante Anexado)
• Status: ✅ Sem divergências

💳 *CARTÃO DE CRÉDITO/DÉBITO:*
• Sistema Sintegra: R$ 11.987,50
• Maquininhas POS: R$ 12.022,50
• Diferença: +R$ 35,00 (Passou)
• Motivo: Troca na forma de pagamento (Sintegra PIX vs POS Cartão)

📲 *PIX NO POS:*
• Sistema Sintegra: R$ 6.846,00
• Maquininhas POS: R$ 6.811,00
• Diferença: -R$ 35,00 (Faltou)
• Motivo: Troca na forma de pagamento (Compensado c/ Cartão)
• Saldo Líquido Compensado: R$ 0,00 (Perfeito)

🏦 *ACUMULADO EM COFRE:*
• 26/10/2026: R$ 3.401,50
• 27/10/2026: R$ 3.751,50
• Total em Cofre Aguardando Malote: R$ 7.153,00
• Último Depósito Realizado: 26/10 - R$ 14.500,00 (Banco do Brasil)

🛡️ *VALIDAÇÕES DIGITAIS:*
• Biometria Facial do Gerente: HOMOLOGADA (IP 177.18.24.11)
• Assinatura na Tela: REGISTRADA
• Conferência Financeiro Matriz: APROVADO`;

  const handleCopy = () => {
    navigator.clipboard.writeText(officialReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDispatchWhatsApp = () => {
    setWhatsAppDispatched(true);
    setTimeout(() => setWhatsAppDispatched(false), 3500);
  };

  const toggleAttachment = (key: string, status: 'validado' | 'solicitar_novo') => {
    setAttachmentsStatus((prev) => ({ ...prev, [key]: status }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* Alerta de Disparo */}
      {whatsAppDispatched && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95">
          <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>Relatório oficial reenviado com sucesso para o Grupo de Fechamento da Diretoria!</span>
          </div>
        </div>
      )}

      {/* Topo com Título e Filtros */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-brand-blue flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-brand-red" />
              Central de Conciliação, Comprovantes & WhatsApp
            </h1>
            <p className="text-xs text-slate-500">
              Setor Financeiro / Backoffice • Auditoria de fechamentos enviados pelas 26 lojas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Auditoria Financeira Ativa
            </span>
          </div>
        </div>

        {/* Barra de Filtros Responsiva */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Data do Fechamento:
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Filial / Loja:
            </label>
            <div className="relative">
              <StoreIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.code}>
                    {s.code} - {s.name} ({s.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Status da Conciliação:
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                <option value="todos">Todos os Fechamentos</option>
                <option value="aprovados">Aprovados 100% OK</option>
                <option value="compensados">Com Compensação Cartão/PIX</option>
                <option value="pendentes">Pendentes de Validação</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LADO ESQUERDO: CARD PRINCIPAL — ESPELHO OFICIAL ESTILO WHATSAPP */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#0B1560]">
                    Espelho Oficial de Fechamento (WhatsApp)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Disparo automático registrado às 19:45
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                🟢 Entregue e Lido
              </span>
            </div>

            {/* Balão Visual Estilo WhatsApp */}
            <div className="p-4 rounded-2xl bg-[#EFEAE2] border border-[#DDD6CD] shadow-inner font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
              {officialReportText}
            </div>

          </div>

          {/* Botões Interativos */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleDispatchWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Reenviar WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Download do Termo de Fechamento em PDF iniciado!')}
              className="py-2.5 px-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Termo PDF</span>
            </button>
          </div>
        </div>

        {/* LADO DIREITO: GALERIA DE AUDITORIA DE ANEXOS (VISUALIZADOR COM ZOOM E BOTÕES DO FINANCEIRO) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-extrabold text-[#0B1560]">
                  Galeria de Auditoria de Anexos
                </h2>
                <p className="text-xs text-slate-500">
                  Validação visual de cada comprovante pelo analista financeiro
                </p>
              </div>

              <span className="text-xs font-bold text-slate-500">
                7 Comprovantes
              </span>
            </div>

            {/* Grid dos Anexos com Botões de Ação */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              
              {/* Anexo 1: Recibo Lanche */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={MOCK_IMAGES.receiptSnack}
                    alt="Lanche"
                    onClick={() => setSelectedPhoto({ url: MOCK_IMAGES.receiptSnack, title: 'Recibo Despesa Lanche (R$ 54,00)', meta: { amount: 'R$ 54,00', date: '27/10/2026 15:40', author: 'Carlos Eduardo' } })}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-300 cursor-pointer shadow-xs hover:opacity-80"
                    title="Ampliar foto"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Recibo Lanche (R$ 54,00)</div>
                    <div className="text-[11px] text-slate-500">Despesa operacional de caixa</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleAttachment('lanche', 'validado')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      attachmentsStatus.lanche === 'validado'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> Validar
                  </button>
                  <button
                    onClick={() => toggleAttachment('lanche', 'solicitar_novo')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      attachmentsStatus.lanche === 'solicitar_novo'
                        ? 'bg-brand-red text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Recusar
                  </button>
                </div>
              </div>

              {/* Anexo 2: Recibo Jornal */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={MOCK_IMAGES.receiptNewspaper}
                    alt="Jornal"
                    onClick={() => setSelectedPhoto({ url: MOCK_IMAGES.receiptNewspaper, title: 'Recibo Despesa Jornal (R$ 300,00)', meta: { amount: 'R$ 300,00', date: '27/10/2026 11:15', author: 'Carlos Eduardo' } })}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-300 cursor-pointer shadow-xs hover:opacity-80"
                    title="Ampliar foto"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Recibo Jornal (R$ 300,00)</div>
                    <div className="text-[11px] text-slate-500">Embalagem de louças frágeis</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleAttachment('jornal', 'validado')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      attachmentsStatus.jornal === 'validado'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> Validar
                  </button>
                  <button
                    onClick={() => toggleAttachment('jornal', 'solicitar_novo')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      attachmentsStatus.jornal === 'solicitar_novo'
                        ? 'bg-brand-red text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Recusar
                  </button>
                </div>
              </div>

              {/* Anexo 3: Dinheiro na Gaveta */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={MOCK_IMAGES.drawerCashPhoto}
                    alt="Gaveta"
                    onClick={() => setSelectedPhoto({ url: MOCK_IMAGES.drawerCashPhoto, title: 'Foto da Gaveta Físico (R$ 3.751,50)', meta: { amount: 'R$ 3.751,50', date: '27/10/2026 19:44', author: 'Carlos Eduardo' } })}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-300 cursor-pointer shadow-xs hover:opacity-80"
                    title="Ampliar foto"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Gaveta Dinheiro (R$ 3.751,50)</div>
                    <div className="text-[11px] text-slate-500">Contagem de notas e moedas</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleAttachment('gaveta', 'validado')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      attachmentsStatus.gaveta === 'validado'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> Validar
                  </button>
                  <button
                    onClick={() => toggleAttachment('gaveta', 'solicitar_novo')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      attachmentsStatus.gaveta === 'solicitar_novo'
                        ? 'bg-brand-red text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Recusar
                  </button>
                </div>
              </div>

              {/* Anexo 4: Filipeta Stone */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={MOCK_IMAGES.posSlipStone}
                    alt="Stone"
                    onClick={() => setSelectedPhoto({ url: MOCK_IMAGES.posSlipStone, title: 'Filipeta POS Stone Caixa 01', meta: { amount: 'R$ 11.500,00', date: '27/10/2026 19:42', author: 'Carlos Eduardo' } })}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-300 cursor-pointer shadow-xs hover:opacity-80"
                    title="Ampliar foto"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Filipeta POS Stone (R$ 11.500)</div>
                    <div className="text-[11px] text-slate-500">Cartão: R$ 7.500 | PIX: R$ 4.000</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleAttachment('stone', 'validado')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      attachmentsStatus.stone === 'validado'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> Validar
                  </button>
                  <button
                    onClick={() => toggleAttachment('stone', 'solicitar_novo')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      attachmentsStatus.stone === 'solicitar_novo'
                        ? 'bg-brand-red text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Recusar
                  </button>
                </div>
              </div>

              {/* Anexo 5: Filipeta Cielo */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={MOCK_IMAGES.posSlipCielo}
                    alt="Cielo"
                    onClick={() => setSelectedPhoto({ url: MOCK_IMAGES.posSlipCielo, title: 'Filipeta POS Cielo Caixa 02', meta: { amount: 'R$ 7.333,50', date: '27/10/2026 19:43', author: 'Carlos Eduardo' } })}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-300 cursor-pointer shadow-xs hover:opacity-80"
                    title="Ampliar foto"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Filipeta POS Cielo (R$ 7.333,50)</div>
                    <div className="text-[11px] text-slate-500">Cartão: R$ 4.522,50 | PIX: R$ 2.811</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleAttachment('cielo', 'validado')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      attachmentsStatus.cielo === 'validado'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> Validar
                  </button>
                  <button
                    onClick={() => toggleAttachment('cielo', 'solicitar_novo')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      attachmentsStatus.cielo === 'solicitar_novo'
                        ? 'bg-brand-red text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Recusar
                  </button>
                </div>
              </div>

              {/* Anexo 6: Depósito Bancário */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={MOCK_IMAGES.bankDepositSlip}
                    alt="Depósito"
                    onClick={() => setSelectedPhoto({ url: MOCK_IMAGES.bankDepositSlip, title: 'Comprovante Depósito Banco do Brasil (R$ 14.500)', meta: { amount: 'R$ 14.500,00', date: '26/10/2026', author: 'Carlos Eduardo' } })}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-300 cursor-pointer shadow-xs hover:opacity-80"
                    title="Ampliar foto"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Depósito Bancário (R$ 14.500)</div>
                    <div className="text-[11px] text-slate-500">Banco do Brasil • Autenticado</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleAttachment('deposito', 'validado')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      attachmentsStatus.deposito === 'validado'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> Validar
                  </button>
                  <button
                    onClick={() => toggleAttachment('deposito', 'solicitar_novo')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      attachmentsStatus.deposito === 'solicitar_novo'
                        ? 'bg-brand-red text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Recusar
                  </button>
                </div>
              </div>

              {/* Anexo 7: Selfie & Assinatura */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={MOCK_IMAGES.managerSelfie}
                    alt="Selfie"
                    onClick={() => setSelectedPhoto({ url: MOCK_IMAGES.managerSelfie, title: 'Selfie Biométrica do Gerente', meta: { date: '27/10/2026 19:45', author: 'Carlos Eduardo (Gerente)', status: 'Reconhecimento Facial OK' } })}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-300 cursor-pointer shadow-xs hover:opacity-80"
                    title="Ampliar foto"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Selfie & Assinatura na Tela</div>
                    <div className="text-[11px] text-slate-500">Carimbo de Auditoria: 19:45</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleAttachment('selfie', 'validado')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      attachmentsStatus.selfie === 'validado'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> Validar
                  </button>
                  <button
                    onClick={() => toggleAttachment('selfie', 'solicitar_novo')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      attachmentsStatus.selfie === 'solicitar_novo'
                        ? 'bg-brand-red text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Recusar
                  </button>
                </div>
              </div>

            </div>

          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
            <span>Todos os comprovantes foram analisados pelo Financeiro.</span>
            <span>Status: Aprovado</span>
          </div>

        </div>

      </div>

      {/* Modal Zoom de Foto */}
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

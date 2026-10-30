import { useState } from 'react';
import { X, Headset, Clock, PhoneCall, ShieldCheck, CheckCircle2, MessageCircle, AlertTriangle } from 'lucide-react';
import { TOP_STORES, Store } from '../data/stores';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNotification?: (msg: string) => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  onSuccessNotification,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<'caixa' | 'auditoria' | 'acesso'>('caixa');
  const [storeCode, setStoreCode] = useState('LJ01');
  const [managerName, setManagerName] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'alta'>('alta');
  const [ticketCreated, setTicketCreated] = useState(false);
  const [ticketProtocol, setTicketProtocol] = useState('');

  if (!isOpen) return null;

  const handleGenerateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const randomProtocol = `TOP-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketProtocol(randomProtocol);
    setTicketCreated(true);
    if (onSuccessNotification) {
      onSuccessNotification(`Chamado aberto com sucesso! Protocolo: ${randomProtocol}`);
    }
  };

  const resetModal = () => {
    setTicketCreated(false);
    setTicketProtocol('');
    setManagerName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-blue/60 backdrop-blur-sm transition-all duration-300">
      <div 
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-100 transition-all transform animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Barra Decorativa Superior com as Cores da Marca */}
        <div className="h-1.5 w-full flex sticky top-0 z-10">
          <div className="w-2/5 bg-brand-red" />
          <div className="w-1/5 bg-brand-yellow" />
          <div className="w-2/5 bg-brand-blue" />
        </div>

        {/* Botão de Fechar */}
        <button
          onClick={resetModal}
          type="button"
          aria-label="Fechar modal de suporte"
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {!ticketCreated ? (
            <>
              {/* Topo do Modal */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-blue text-brand-yellow shrink-0 shadow-md">
                  <Headset className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Central de Atendimento 26 Lojas Online
                  </div>
                  <h3 className="text-xl font-bold text-brand-blue">
                    Suporte Operacional & Fechamento
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Atendimento exclusivo para Gerentes de Loja e Equipe Financeira
                  </p>
                </div>
              </div>

              {/* Informações de Plantão e Horários */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-brand-blue font-semibold text-xs mb-1">
                    <Clock className="w-4 h-4 text-brand-red" />
                    Horário de Plantão de Caixa
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Seg a Sáb:</strong> 07:00 às 22:30<br />
                    <strong>Dom e Feriados:</strong> 08:00 às 20:30
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-brand-blue font-semibold text-xs mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Plantão TI e Conciliação
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Auditoria em tempo real de divergências de sangria, PIX e cartões TEF.
                  </p>
                </div>
              </div>

              {/* Opções de Atendimento Rápido */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Qual é o tipo de ocorrência?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTopic('caixa')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedTopic === 'caixa'
                        ? 'border-brand-red bg-brand-red-light/70 text-brand-red shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold">Dúvida no Caixa</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Sobra/Falta/Sangria</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTopic('auditoria')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedTopic === 'auditoria'
                        ? 'border-brand-blue bg-brand-blue-light text-brand-blue shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold">Conciliação PIX/Cartão</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Divergência TEF</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTopic('acesso')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedTopic === 'acesso'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold">Acesso / Sistema</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Bloqueio / Erros</div>
                  </button>
                </div>
              </div>

              {/* Formulário de Abertura de Chamado */}
              <form onSubmit={handleGenerateTicket} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Loja Solicitante
                    </label>
                    <select
                      value={storeCode}
                      onChange={(e) => setStoreCode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    >
                      {TOP_STORES.map((s: Store) => (
                        <option key={s.id} value={s.code}>
                          {s.code} - {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Nome do Responsável
                    </label>
                    <input
                      type="text"
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                      placeholder="Ex: Carlos (Gerente)"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Nível de Urgência
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        checked={urgency === 'alta'}
                        onChange={() => setUrgency('alta')}
                        className="text-brand-red focus:ring-brand-red"
                      />
                      <span className="ml-2 flex items-center gap-1 text-brand-red font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" /> Alta (Caixa Travado / Fechamento Agora)
                      </span>
                    </label>
                    <label className="inline-flex items-center text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        checked={urgency === 'normal'}
                        onChange={() => setUrgency('normal')}
                        className="text-brand-blue focus:ring-brand-blue"
                      />
                      <span className="ml-2 text-slate-600">Dúvida Rotineira</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Abrir Chamado Imediato no WhatsApp
                  </button>

                  <a
                    href="tel:08008889900"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Ligação para o ramal Matriz: (11) 3456-7800 (Plantão 26 Lojas)');
                    }}
                    className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-brand-blue" />
                    0800 Matriz
                  </a>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold text-brand-blue mb-1">
                Chamado Aberto com Prioridade!
              </h3>
              <p className="text-sm text-slate-600 mb-5">
                O plantão de TI/Auditoria da TOP Utilidades já recebeu o alerta da unidade <strong>{storeCode}</strong>.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto mb-6 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Protocolo:</span>
                  <span className="font-mono font-bold text-brand-blue text-sm">{ticketProtocol}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Unidade:</span>
                  <span className="font-semibold text-slate-700">{storeCode} - {TOP_STORES.find((s: Store) => s.code === storeCode)?.city}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Solicitante:</span>
                  <span className="font-semibold text-slate-700">{managerName || 'Gerente de Loja'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Em atendimento pelo Analista
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=5511999999999&text=Ol%C3%A1%20Suporte%20TOP%20Utilidades,%20chamado%20aberto%20com%20o%20protocolo%20${ticketProtocol}%20pela%20${storeCode}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  Ir para Conversa no WhatsApp
                </a>

                <button
                  type="button"
                  onClick={resetModal}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition"
                >
                  Fechar Janela
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

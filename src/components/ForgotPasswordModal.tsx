import { useState } from 'react';
import { X, KeyRound, Store as StoreIcon, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import { TOP_STORES, Store } from '../data/stores';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNotification?: (msg: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccessNotification,
}) => {
  const [email, setEmail] = useState('');
  const [selectedStore, setSelectedStore] = useState('LJ01');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      alert('Por favor, informe um e-mail válido.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccessNotification) {
        onSuccessNotification('Solicitação de redefinição enviada com sucesso ao WhatsApp corporativo!');
      }
    }, 1200);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setEmail('');
    setSelectedStore('LJ01');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-blue/60 backdrop-blur-sm transition-all duration-300">
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 transition-all transform animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Barra Decorativa Superior com as Cores da Marca */}
        <div className="h-1.5 w-full flex">
          <div className="w-2/5 bg-brand-red" />
          <div className="w-1/5 bg-brand-yellow" />
          <div className="w-2/5 bg-brand-blue" />
        </div>

        {/* Botão de Fechar */}
        <button
          onClick={handleResetAndClose}
          type="button"
          aria-label="Fechar modal"
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {!isSuccess ? (
            <>
              {/* Cabeçalho */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-red-light text-brand-red">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-blue">
                    Esqueceu sua senha?
                  </h3>
                  <p className="text-sm text-slate-500">
                    Recuperação de acesso das 26 lojas da rede
                  </p>
                </div>
              </div>

              {/* Informação */}
              <div className="mb-6 rounded-xl bg-amber-50/80 p-3.5 border border-amber-200/80 text-amber-900 text-xs sm:text-sm leading-relaxed flex items-start gap-2.5">
                <MessageSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Por diretriz de segurança de caixa da <strong>TOP Utilidades</strong>, um token provisório será enviado diretamente ao <strong>WhatsApp Corporativo da Matriz</strong> vinculado ao gerente da loja selecionada.
                </span>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Selecione a Loja
                  </label>
                  <div className="relative">
                    <StoreIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={selectedStore}
                      onChange={(e) => setSelectedStore(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                    >
                      {TOP_STORES.map((store: Store) => (
                        <option key={store.id} value={store.code}>
                          {store.name} ({store.city} - {store.state})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    E-mail do Responsável
                  </label>
                  <input
                    type="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@toputilidades.com.br"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white font-semibold text-sm shadow-btn hover:shadow-btn-hover transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Validando cadastro da loja...
                      </>
                    ) : (
                      <>
                        <span>Solicitar Redefinição via WhatsApp</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-brand-blue mb-2">
                Solicitação Encaminhada!
              </h3>
              <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">
                As instruções para redefinição segura de senha foram enviadas ao WhatsApp do gerente cadastrado da unidade <strong>{selectedStore}</strong>.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 mb-6 text-left">
                • Validade do token temporário: <strong>15 minutos</strong><br />
                • Caso não receba, contate o plantão de TI no botão de Suporte Técnico.
              </div>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-blue text-white font-medium text-sm hover:bg-brand-blue-hover transition"
              >
                Voltar para o Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

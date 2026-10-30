import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Headset, 
  Shield, 
  Check, 
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';
import { SupportModal } from '../components/SupportModal';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentProfile } = useApp();

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Modals state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Logo variant toggle (for presentation flexibility)
  const [logoVariant, setLogoVariant] = useState<'image' | 'vector'>('image');

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Protótipo: não exige campos preenchidos, o botão entra direto.
    // O perfil/tela inicial é escolhido pelo e-mail digitado (padrão: Gerente).
    const mail = identifier.trim().toLowerCase();
    let route = '/fechamento';
    let profile: 'gerente' | 'auditor' | 'financeiro' | 'diretoria' | 'admin' = 'gerente';
    if (mail.includes('auditoria')) {
      profile = 'auditor';
      route = '/auditoria';
    } else if (mail.includes('financeiro')) {
      profile = 'financeiro';
      route = '/relatorios';
    } else if (mail.includes('diretoria')) {
      profile = 'diretoria';
      route = '/monitoramento';
    } else if (mail.includes('admin')) {
      profile = 'admin';
      route = '/admin';
    }

    setIsLoading(true);

    // Simulated login process
    setTimeout(() => {
      setIsLoading(false);
      showToast('success', 'Acesso autorizado! Bem-vindo(a) ao sistema.');
      setCurrentProfile(profile);

      setTimeout(() => {
        navigate(route);
      }, 600);
    }, 900);
  };

  // Quick fill for client demo
  const quickFillUser = (type: 'gerente' | 'auditor') => {
    if (type === 'gerente') {
      setIdentifier('gerente.loja01@toputilidades.com.br');
      setPassword('TopLoja@2026');
      showToast('info', 'Credenciais de Gerente Loja 01 preenchidas.');
    } else {
      setIdentifier('auditoria.financeiro@toputilidades.com.br');
      setPassword('AuditoriaTop#26');
      showToast('info', 'Credenciais de Auditoria Matriz preenchidas.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#F8FAFC]">
      {/* Detalhes Sutis de Iluminação & Gradiente Corporativo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Glow Amarelo Top no Canto Superior Esquerdo */}
        <div 
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FFF200]/15 blur-3xl animate-pulse-slow"
          style={{ willChange: 'transform, opacity' }}
        />
        {/* Glow Azul Marinho no Canto Inferior Direito */}
        <div 
          className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-[#0B1560]/10 blur-3xl animate-pulse-slow"
          style={{ willChange: 'transform, opacity', animationDelay: '2s' }}
        />
        {/* Suave reflexo central */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full bg-gradient-to-tr from-[#FFF200]/5 via-white/40 to-[#0B1560]/5 blur-2xl"
        />
      </div>

      {/* Barra de Notificação Flutuante / Toast */}
      {feedbackMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div 
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-medium border ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : feedbackMessage.type === 'error'
                ? 'bg-red-50 text-brand-red border-red-200'
                : 'bg-brand-blue-light text-brand-blue border-blue-200'
            }`}
          >
            {feedbackMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {feedbackMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-brand-red shrink-0" />}
            {feedbackMessage.type === 'info' && <Sparkles className="w-5 h-5 text-brand-blue shrink-0" />}
            <span>{feedbackMessage.text}</span>
          </div>
        </div>
      )}

      {/* Cabeçalho Minimalista com Badge da Rede */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-red animate-ping" />
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Rede de Varejo • 26 Lojas Ativas
          </span>
        </div>

        {/* Alternador de visualização da logo para demonstração */}
        <div className="hidden sm:flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl text-xs text-slate-600 shadow-sm">
          <span className="text-[11px] font-medium text-slate-400 px-2">Logo:</span>
          <button
            type="button"
            onClick={() => setLogoVariant('image')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              logoVariant === 'image'
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Oficial HD
          </button>
          <button
            type="button"
            onClick={() => setLogoVariant('vector')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              logoVariant === 'vector'
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vetor SVG
          </button>
        </div>
      </header>

      {/* Conteúdo Central: Card de Login */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-100 overflow-hidden">
          
          {/* Barra Decorativa Superior Fina: #EE2B33, #FFF200 e #0B1560 */}
          <div className="h-1.5 w-full flex">
            <div className="w-1/3 bg-[#EE2B33]" title="Vermelho Presente" />
            <div className="w-1/3 bg-[#FFF200]" title="Amarelo Top" />
            <div className="w-1/3 bg-[#0B1560]" title="Azul Marinho Institucional" />
          </div>

          <div className="p-7 sm:p-9">
            
            {/* Logo Oficial Centralizada no Topo */}
            <div className="flex flex-col items-center text-center mb-7">
              <BrandLogo 
                size="md" 
                variant={logoVariant} 
                className="mb-4 shadow-md shadow-amber-300/20"
              />
              
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1560] tracking-tight mb-1.5">
                Portal de Gestão e Fechamento de Caixa
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Acesso exclusivo para Gerentes, Auditoria e Financeiro
              </p>
            </div>

            {/* Formulário de Login */}
            <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
              
              {/* Campo Login ou CPF */}
              <div>
                <label 
                  htmlFor="user-identifier"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  E-mail
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0B1560] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="user-identifier"
                    type="email"
                    inputMode="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Digite seu e-mail"
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-2.5 text-base sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 font-medium transition focus:outline-none focus:ring-2 focus:ring-[#0B1560] focus:border-transparent focus:bg-white"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label 
                  htmlFor="user-password"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Senha de Acesso
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0B1560] transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="user-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-2.5 text-base sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 font-medium transition focus:outline-none focus:ring-2 focus:ring-[#0B1560] focus:border-transparent focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Linha de Apoio: Lembrar Acesso & Esqueci Minha Senha */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0B1560] focus:ring-[#0B1560] accent-[#0B1560]"
                  />
                  <span className="text-xs text-slate-600 font-medium">
                    Lembrar meu acesso
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs font-semibold text-[#EE2B33] hover:text-[#D11F27] hover:underline focus:outline-none transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>

              {/* Botão Principal: Entrar no Sistema */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#EE2B33] hover:bg-[#D11F27] active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-btn hover:shadow-btn-hover transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Autenticando na Rede...</span>
                    </div>
                  ) : (
                    <>
                      <span>Entrar no Sistema</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Atalhos Rápidos para Demonstração ao Cliente */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Acesso Rápido para Apresentação:
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => quickFillUser('gerente')}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg text-xs font-medium text-slate-700 transition"
                >
                  <Building2 className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Gerente Loja 01</span>
                </button>
                <button
                  type="button"
                  onClick={() => quickFillUser('auditor')}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg text-xs font-medium text-slate-700 transition"
                >
                  <Shield className="w-3.5 h-3.5 text-brand-red" />
                  <span>Auditoria Geral</span>
                </button>
              </div>
            </div>

            {/* Linha Divisória Sutil & Botão de Suporte ao Usuário Trabalhado */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSupportModalOpen(true)}
                className="w-full group p-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 flex items-center justify-between transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-slate-200 text-[#0B1560] group-hover:text-brand-red transition-colors shadow-xs">
                    <Headset className="w-5 h-5" />
                    {/* Badge Verde Online */}
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-[#0B1560] transition-colors">
                      Precisa de ajuda com o caixa?
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Falar com o Suporte Técnico das Lojas
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Online
                </div>
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Rodapé Corporativo Sofisticado */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-200/50">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-600">TOP UTILIDADES E PRESENTES</span>
          <span>•</span>
          <span>Rede de 26 Lojas</span>
          <span>•</span>
          <span>Versão 2.4 (Produção)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-500">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            Conexão Segura SSL 256-bit
          </span>
          <span>Auditoria Matriz Homologada</span>
        </div>
      </footer>

      {/* Modais Interativos */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onSuccessNotification={(msg) => showToast('success', msg)}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        onSuccessNotification={(msg) => showToast('success', msg)}
      />
    </div>
  );
};

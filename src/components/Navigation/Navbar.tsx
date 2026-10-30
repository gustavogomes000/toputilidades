import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Smartphone, 
  MapPin, 
  ClipboardCheck, 
  FileSpreadsheet, 
  Settings, 
  Store as StoreIcon, 
  RotateCcw, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  BarChart3,
  Trophy
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { useApp } from '../../context/AppContext';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProfile, setCurrentProfile, resetAllDemoData, fechamento } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetAlert, setResetAlert] = useState(false);

  const handleProfileSwitch = (
    profile: 'gerente' | 'auditor' | 'financeiro' | 'diretoria' | 'admin',
    route: string
  ) => {
    setCurrentProfile(profile);
    navigate(route);
  };

  const handleReset = () => {
    resetAllDemoData();
    setResetAlert(true);
    setTimeout(() => setResetAlert(false), 3000);
  };

  const navItems = [
    {
      to: '/fechamento',
      label: 'Fechamento de Caixa',
      shortLabel: 'Fechamento',
      icon: Smartphone,
      badge: fechamento.isClosed ? 'Fechado' : 'Aberto',
      badgeColor: fechamento.isClosed ? 'bg-emerald-500' : 'bg-amber-500',
      profile: 'gerente' as const,
    },
    {
      to: '/monitoramento',
      label: 'Monitoramento 26 Lojas',
      shortLabel: 'Mapa & Lojas',
      icon: MapPin,
      badge: 'Ao Vivo',
      badgeColor: 'bg-emerald-500',
      profile: 'diretoria' as const,
    },
    {
      to: '/comparativo',
      label: 'Comparativo & Apresentação',
      shortLabel: 'Comparativo',
      icon: BarChart3,
      badge: 'Slides',
      badgeColor: 'bg-brand-red',
      profile: 'diretoria' as const,
    },
    {
      to: '/ranking',
      label: 'Ranking da Rede (1º ao 26º)',
      shortLabel: 'Ranking',
      icon: Trophy,
      badge: 'Pódio',
      badgeColor: 'bg-brand-yellow-warm',
      profile: 'diretoria' as const,
    },
    {
      to: '/auditoria',
      label: 'Auditoria Presencial',
      shortLabel: 'Auditoria',
      icon: ClipboardCheck,
      badge: 'Cofre',
      badgeColor: 'bg-brand-blue',
      profile: 'auditor' as const,
    },
    {
      to: '/relatorios',
      label: 'Central Financeiro & WhatsApp',
      shortLabel: 'Relatórios',
      icon: FileSpreadsheet,
      badge: 'Validação',
      badgeColor: 'bg-purple-600',
      profile: 'financeiro' as const,
    },
    {
      to: '/lojas',
      label: 'Gestão das 26 Lojas',
      shortLabel: 'Lojas',
      icon: StoreIcon,
      badge: '26',
      badgeColor: 'bg-brand-yellow-warm',
      profile: 'admin' as const,
    },
    {
      to: '/admin',
      label: 'Usuários & Integrações',
      shortLabel: 'Configurações',
      icon: Settings,
      profile: 'admin' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      
      {/* 1. SIDEBAR LATERAL DESKTOP (>= 1024px) - ANCHORED AT TOP-0, ZERO WHITE GAP */}
      <aside className="hidden lg:flex w-64 bg-[#0B1560] text-slate-200 flex-col justify-between shrink-0 border-r border-slate-800 shadow-xl fixed inset-y-0 left-0 z-40 overflow-y-auto">
        
        <div className="p-5 flex flex-col gap-6">
          
          {/* Logo da Empresa & Identificação */}
          <div className="flex items-center gap-3 pt-2">
            <BrandLogo size="sm" withShadow={false} className="w-11 h-11 p-1 rounded-xl shrink-0" />
            <div>
              <div className="font-extrabold text-sm text-white tracking-tight leading-tight">
                TOP UTILIDADES
              </div>
              <div className="text-[11px] font-semibold text-brand-yellow uppercase tracking-wider">
                26 Lojas Ativas
              </div>
            </div>
          </div>

          {/* Card Usuário Logado */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-yellow text-brand-blue font-extrabold text-xs flex items-center justify-center shadow-xs">
                CE
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-snug">Carlos Eduardo</div>
                <div className="text-[10px] text-blue-200">Gerente • Loja 07</div>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Online" />
          </div>

          {/* Menu de Navegação Vertical */}
          <nav className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Módulos do Sistema
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition group ${
                    isActive
                      ? 'bg-[#EE2B33] text-white shadow-md'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-200 group-hover:text-white'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${item.badgeColor || 'bg-white/20'} text-white`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <div className="text-[11px] text-slate-400 px-2 flex justify-between">
            <span>Sintegra API:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Sincronizado
            </span>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair do Sistema</span>
          </button>
        </div>

      </aside>

      {/* 2. COLUNA PRINCIPAL DA DIREITA (HEADER SUPERIOR STICKY + CONTEÚDO) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* BARRA SUPERIOR DE SIMULAÇÃO ("MODO APRESENTAÇÃO TOP UTILIDADES") */}
        <header className="sticky top-0 z-30 bg-[#0B1560] text-white border-b-2 border-brand-yellow/80 shadow-md">
          {/* Barra decorativa com 3 cores da marca */}
          <div className="h-1 w-full flex">
            <div className="w-1/3 bg-[#EE2B33]" />
            <div className="w-1/3 bg-[#FFF200]" />
            <div className="w-1/3 bg-[#0B1560]" />
          </div>

          <div className="w-full px-3 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            
            <div className="flex items-center gap-2 shrink-0">
              {/* Logo visível no celular */}
              <div className="lg:hidden flex items-center gap-1.5">
                <BrandLogo size="sm" withShadow={false} className="w-7 h-7 p-0.5 rounded-md" />
                <span className="font-extrabold text-xs text-white">TOP</span>
              </div>

              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-brand-yellow flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
                <span className="hidden sm:inline">Demo Interativa:</span>
                <span className="sm:hidden">Demo:</span>
              </span>
            </div>

            {/* Botões Rápidos de Troca de Perfil */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => handleProfileSwitch('gerente', '/fechamento')}
                className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 ${
                  location.pathname === '/fechamento'
                    ? 'bg-[#EE2B33] text-white shadow-sm'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                <span>📱</span>
                <span className="hidden md:inline">Visão Gerente</span>
                <span>(Loja 7)</span>
              </button>

              <button
                onClick={() => handleProfileSwitch('auditor', '/auditoria')}
                className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 ${
                  location.pathname === '/auditoria'
                    ? 'bg-[#EE2B33] text-white shadow-sm'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                <span>🕵️</span>
                <span className="hidden md:inline">Visão Auditor</span>
                <span>(Cofre)</span>
              </button>

              <button
                onClick={() => handleProfileSwitch('financeiro', '/relatorios')}
                className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 ${
                  location.pathname === '/relatorios'
                    ? 'bg-[#EE2B33] text-white shadow-sm'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                <span>💼</span>
                <span className="hidden md:inline">Visão Financeiro</span>
                <span>(WhatsApp)</span>
              </button>

              <button
                onClick={() => handleProfileSwitch('diretoria', '/monitoramento')}
                className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 ${
                  location.pathname === '/monitoramento'
                    ? 'bg-[#EE2B33] text-white shadow-sm'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                <span>🗺️</span>
                <span className="hidden md:inline">Diretoria</span>
                <span>(26 Lojas)</span>
              </button>

              <button
                onClick={() => handleProfileSwitch('admin', '/lojas')}
                className={`hidden sm:flex px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition items-center gap-1.5 ${
                  location.pathname === '/lojas' || location.pathname === '/admin'
                    ? 'bg-[#EE2B33] text-white shadow-sm'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                <span>🏪</span>
                <span>Lojas & Admin</span>
              </button>
            </div>

            {/* Reset Demo Data Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-brand-yellow text-[11px] font-bold border border-brand-yellow/30 transition"
                title="Resetar dados para o estado inicial da demonstração"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden lg:inline">Resetar Demo</span>
              </button>
            </div>

          </div>
        </header>

        {/* Alerta de Reset Flutuante */}
        {resetAlert && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95">
            <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Dados da demonstração resetados para o estado original!
            </div>
          </div>
        )}

        {/* 3. CONTEÚDO PRINCIPAL (COM AJUSTE DE ESPAÇAMENTO RESPONSIVO) */}
        <main className="flex-1 pb-24 lg:pb-8">
          {children}
        </main>

      </div>

      {/* 4. BARRA DE NAVEGAÇÃO INFERIOR FIXA NO CELULAR (< 1024px) ESTILO APP NATIVO */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-2 py-1.5 flex items-center justify-around">
        <NavLink
          to="/fechamento"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-h-[48px] px-2 py-1 rounded-xl text-[10px] font-bold transition ${
              isActive ? 'text-[#EE2B33]' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <Smartphone className="w-5 h-5 mb-0.5" />
          <span>Fechamento</span>
        </NavLink>

        <NavLink
          to="/monitoramento"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-h-[48px] px-2 py-1 rounded-xl text-[10px] font-bold transition ${
              isActive ? 'text-[#EE2B33]' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span>Mapa 26</span>
        </NavLink>

        <NavLink
          to="/comparativo"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-h-[48px] px-2 py-1 rounded-xl text-[10px] font-bold transition ${
              isActive ? 'text-[#EE2B33]' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span>Comparativo</span>
        </NavLink>

        <NavLink
          to="/auditoria"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-h-[48px] px-2 py-1 rounded-xl text-[10px] font-bold transition ${
              isActive ? 'text-[#EE2B33]' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <ClipboardCheck className="w-5 h-5 mb-0.5" />
          <span>Auditoria</span>
        </NavLink>

        <NavLink
          to="/relatorios"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-h-[48px] px-2 py-1 rounded-xl text-[10px] font-bold transition ${
              isActive ? 'text-[#EE2B33]' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <FileSpreadsheet className="w-5 h-5 mb-0.5" />
          <span>WhatsApp</span>
        </NavLink>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center min-h-[48px] px-2 py-1 rounded-xl text-[10px] font-bold text-slate-500 hover:text-slate-900"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Mais</span>
        </button>
      </nav>

      {/* Drawer Móvel de Menu Extra */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-72 bg-white h-full shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <BrandLogo size="sm" withShadow={false} className="w-9 h-9 p-0.5 rounded-lg" />
                  <span className="font-extrabold text-xs text-brand-blue">TOP UTILIDADES</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-brand-blue" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </NavLink>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleReset();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Resetar Dados da Demo
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-brand-red text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair do Sistema
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

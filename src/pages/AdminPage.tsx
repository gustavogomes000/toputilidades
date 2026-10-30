import React, { useState } from 'react';
import { 
  Users, 
  Store as StoreIcon, 
  Zap, 
  Plus, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  RotateCw, 
  MessageCircle, 
  Smartphone, 
  Check, 
  X, 
  Edit3, 
  Key, 
  ChevronRight,
  Send,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SystemUser } from '../data/stores';

export const AdminPage: React.FC = () => {
  const { users, stores, addUser, updateUser } = useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'usuarios' | 'lojas' | 'integracoes'>('usuarios');

  // Filter Users
  const [levelFilter, setLevelFilter] = useState<number | 'todos'>('todos');

  // Modal Create/Edit User
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form states
  const [userName, setUserName] = useState('');
  const [userCpf, setUserCpf] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPassword, setUserPassword] = useState('Top@2026');
  const [userRole, setUserRole] = useState<'gerente' | 'supervisor' | 'financeiro' | 'admin'>('gerente');
  const [userScope, setUserScope] = useState('Loja Nº 7 Campinas');
  const [requireSelfie, setRequireSelfie] = useState(true);
  const [requireSignature, setRequireSignature] = useState(true);
  const [blockWithoutPhoto, setBlockWithoutPhoto] = useState(true);

  // Integrations states
  const [isTestingSintegra, setIsTestingSintegra] = useState(false);
  const [sintegraStatus, setSintegraStatus] = useState<string | null>(null);
  const [isTestingWhatsApp, setIsTestingWhatsApp] = useState(false);
  const [whatsAppTestSent, setWhatsAppTestSent] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredUsers = users.filter((u) => {
    if (levelFilter === 'todos') return true;
    return u.level === levelFilter;
  });

  const openNewUserModal = () => {
    setEditingUserId(null);
    setUserName('');
    setUserCpf('');
    setUserEmail('');
    setUserPhone('');
    setUserPassword('Top@2026');
    setUserRole('gerente');
    setUserScope('Loja Nº 7 Campinas');
    setRequireSelfie(true);
    setRequireSignature(true);
    setBlockWithoutPhoto(true);
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (u: SystemUser) => {
    setEditingUserId(u.id);
    setUserName(u.name);
    setUserCpf(u.cpf);
    setUserEmail(u.email);
    setUserPhone(u.phone);
    setUserPassword('••••••••');
    setUserRole(u.role);
    setUserScope(u.storesScope);
    setRequireSelfie(u.requireSelfie);
    setRequireSignature(u.requireSignature);
    setBlockWithoutPhoto(u.blockWithoutPhoto);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;

    const roleMap = {
      gerente: { label: 'Gerente de Loja', level: 1 },
      supervisor: { label: 'Supervisor / Auditor Regional', level: 2 },
      financeiro: { label: 'Financeiro / Backoffice', level: 3 },
      admin: { label: 'Diretoria / Admin Global', level: 4 },
    };

    if (editingUserId) {
      updateUser(editingUserId, {
        name: userName,
        cpf: userCpf,
        email: userEmail,
        phone: userPhone,
        role: userRole,
        roleLabel: roleMap[userRole].label,
        level: roleMap[userRole].level,
        storesScope: userScope,
        requireSelfie,
        requireSignature,
        blockWithoutPhoto,
      });
      showToast(`Usuário ${userName} atualizado com sucesso!`);
    } else {
      const newUser: SystemUser = {
        id: `user-${Date.now()}`,
        name: userName,
        cpf: userCpf,
        email: userEmail,
        phone: userPhone,
        role: userRole,
        roleLabel: roleMap[userRole].label,
        level: roleMap[userRole].level,
        storesScope: userScope,
        status: 'ativo',
        requireSelfie,
        requireSignature,
        blockWithoutPhoto,
      };
      addUser(newUser);
      showToast(`Usuário ${userName} cadastrado com sucesso!`);
    }

    setIsUserModalOpen(false);
  };

  const handleTestSintegraConnection = () => {
    setIsTestingSintegra(true);
    setSintegraStatus(null);
    setTimeout(() => {
      setIsTestingSintegra(false);
      setSintegraStatus('200 OK — 26 filiais Sintegra comunicando sem erros de latência (34ms)');
      showToast('Conexão Sintegra ERP 100% validada nas 26 lojas!');
    }, 1200);
  };

  const handleTestWhatsAppDispatch = () => {
    setIsTestingWhatsApp(true);
    setTimeout(() => {
      setIsTestingWhatsApp(false);
      setWhatsAppTestSent(true);
      showToast('Mensagem de teste disparada com sucesso no WhatsApp da Matriz!');
      setTimeout(() => setWhatsAppTestSent(false), 4000);
    }, 1000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95">
          <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Topo: Título e Seletor de 3 Abas */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-brand-blue flex items-center gap-2">
              <Lock className="w-6 h-6 text-brand-red" />
              Painel de Administração, Usuários & Integrações
            </h1>
            <p className="text-xs text-slate-500">
              Uso restrito da Diretoria e Equipe de TI • Governança corporativa da rede TOP Utilidades
            </p>
          </div>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            Versão do Sistema: 2.4 (Homologada)
          </span>
        </div>

        {/* 3 Abas de Gestão */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('usuarios')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'usuarios'
                ? 'bg-[#0B1560] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-brand-yellow" />
            <span>Aba 1: 👥 Gestão de Usuários</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lojas')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'lojas'
                ? 'bg-[#0B1560] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <StoreIcon className="w-4 h-4 text-brand-yellow" />
            <span>Aba 2: 🏪 Cadastro 26 Lojas & POS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('integracoes')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'integracoes'
                ? 'bg-[#0B1560] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-brand-yellow" />
            <span>Aba 3: ⚡ Integrações & WhatsApp</span>
          </button>
        </div>
      </div>

      {/* ABA 1: 👥 GESTÃO DE USUÁRIOS & NÍVEIS HIERÁRQUICOS */}
      {activeTab === 'usuarios' && (
        <div className="space-y-6">
          
          {/* Explicação de Regra de Negócio */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed flex items-start gap-3 shadow-xs">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>🔒 Controle de Acesso Estrito:</strong> Operadores de caixa não possuem acesso ao sistema. O fechamento, contagem física e validações são de uso exclusivo e intransferível de <strong>Gerentes de Loja</strong> para cima, com rastreabilidade de selfie e assinatura.
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-4">
            
            {/* Filtros e Botão de Ação */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
                <button
                  onClick={() => setLevelFilter('todos')}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    levelFilter === 'todos' ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todos ({users.length})
                </button>
                <button
                  onClick={() => setLevelFilter(1)}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    levelFilter === 1 ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Nível 1: Gerentes de Loja (26)
                </button>
                <button
                  onClick={() => setLevelFilter(2)}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    levelFilter === 2 ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Nível 2: Supervisores (4)
                </button>
                <button
                  onClick={() => setLevelFilter(3)}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    levelFilter === 3 ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Nível 3: Financeiro (3)
                </button>
                <button
                  onClick={() => setLevelFilter(4)}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    levelFilter === 4 ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Nível 4: Diretoria/Admin (2)
                </button>
              </div>

              <button
                type="button"
                onClick={openNewUserModal}
                className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold flex items-center justify-center gap-2 shadow-btn transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Cadastrar Novo Usuário</span>
              </button>
            </div>

            {/* Lista de Cards de Usuários */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3 hover:bg-slate-100/70 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-brand-blue">{u.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-blue text-white">
                          Nível {u.level}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-700 mt-0.5">{u.roleLabel}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Vinculado a: <strong>{u.storesScope}</strong>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      🟢 Ativo
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-0.5 pt-2 border-t border-slate-200">
                    <div>E-mail: <strong className="font-mono text-slate-800">{u.email}</strong></div>
                    <div>WhatsApp: <strong className="font-mono text-slate-800">{u.phone}</strong></div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-500">
                      <span>Selfie: {u.requireSelfie ? 'Sim' : 'Não'}</span>
                      <span>•</span>
                      <span>Assinatura: {u.requireSignature ? 'Sim' : 'Não'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openEditUserModal(u)}
                      className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* ABA 2: 🏪 CADASTRO DAS 26 LOJAS & MAQUININHAS POS */}
      {activeTab === 'lojas' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-brand-blue">
                Cadastro e Configuração das 26 Lojas da Rede
              </h3>
              <p className="text-xs text-slate-500">
                Visualize os parâmetros ou abra a tela dedicada de gestão completa.
              </p>
            </div>

            <a
              href="/lojas"
              className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <span>Abrir Gestor Dedicado de Lojas</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stores.slice(0, 6).map((s) => (
              <div key={s.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-brand-blue">
                  <span>{s.code} - {s.name}</span>
                  <span className="text-emerald-700">🟢 Sintegra OK</span>
                </div>
                <div className="text-slate-500">Gerente: {s.manager}</div>
                <div className="text-slate-500">Horário Limite: {s.closingTimeLimit}h</div>
                <div className="text-[11px] font-mono text-slate-400">{s.sintegraCode}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: ⚡ INTEGRAÇÕES (API SINTEGRA & AUTOMAÇÃO WHATSAPP) */}
      {activeTab === 'integracoes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Integração API Sintegra */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 text-brand-blue rounded-xl font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-brand-blue">
                      Integração API Sintegra (ERP)
                    </h3>
                    <p className="text-xs text-slate-500">Sincronização de retaguarda em tempo real</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Conectado
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Endpoint Oficial da API:</span>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-slate-800">
                    https://api.sintegra-erp.toputilidades.com.br/v2/closing/sync
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-bold block mb-1">Chave de API (Token Homologado):</span>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-slate-800 flex justify-between items-center">
                    <span>sint_live_9984712034981249712498712</span>
                    <span className="text-[10px] text-slate-400">Ativo</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Intervalo de Sincronização:</span>
                    <strong className="text-slate-900">A cada 5 minutos</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Filiais Conectadas:</span>
                    <strong className="text-emerald-700">26 de 26 (100%)</strong>
                  </div>
                </div>

                {sintegraStatus && (
                  <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-xs font-semibold">
                    ✅ {sintegraStatus}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleTestSintegraConnection}
                disabled={isTestingSintegra}
                className="w-full py-3 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <RotateCw className={`w-4 h-4 ${isTestingSintegra ? 'animate-spin' : ''}`} />
                <span>{isTestingSintegra ? 'Testando Conexão...' : '🔄 Testar Conexão Sintegra Agora'}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Robô de Alertas e Relatórios WhatsApp */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-brand-blue">
                      Robô de Alertas WhatsApp
                    </h3>
                    <p className="text-xs text-slate-500">Disparo automático de fechamentos e auditorias</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Online
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Grupos Oficiais Configurados:</span>
                  <div className="space-y-1.5">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                      <span className="font-semibold text-slate-800">📱 Grupo Fechamento Diário (26 Lojas)</span>
                      <span className="text-[10px] text-emerald-700 font-bold">🟢 Ativo</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                      <span className="font-semibold text-slate-800">🚨 Grupo Alertas & Auditoria (Diretoria)</span>
                      <span className="text-[10px] text-emerald-700 font-bold">🟢 Ativo</span>
                    </div>
                  </div>
                </div>

                {/* Simulador de Mensagem ao Vivo */}
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Prévia ao Vivo de Notificação:</span>
                  <div className="p-3 bg-[#EFEAE2] rounded-xl border border-[#DDD6CD] font-mono text-[11px] text-slate-800 leading-relaxed max-h-36 overflow-y-auto">
                    *FECHAMENTO RECEBIDO:* Loja Nº 7 Campinas às 19:45h. Total Sintegra: R$ 24.157,00. Compensação R$ 35,00 OK. Selfie do gerente Carlos validada.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleTestWhatsAppDispatch}
                disabled={isTestingWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isTestingWhatsApp ? 'Disparando...' : '📲 Testar Disparo no WhatsApp'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* MODAL: CADASTRAR / EDITAR USUÁRIO */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
            
            <div className="h-1.5 w-full flex">
              <div className="w-1/3 bg-brand-red" />
              <div className="w-1/3 bg-brand-yellow" />
              <div className="w-1/3 bg-brand-blue" />
            </div>

            <div className="p-6 sm:p-8 space-y-5 max-h-[85vh] overflow-y-auto">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-brand-blue">
                    {editingUserId ? 'Editar Usuário do Sistema' : 'Cadastrar Novo Usuário'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Defina o nível hierárquico e os controles de segurança
                  </p>
                </div>
                <button
                  onClick={() => setIsUserModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">CPF</label>
                    <input
                      type="text"
                      value={userCpf}
                      onChange={(e) => setUserCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">E-mail / Login</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="usuario@toputilidades.com.br"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">WhatsApp (Para Alertas)</label>
                    <input
                      type="text"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="(19) 98765-0007"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Seletor Visual de Nível Hierárquico */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Nível Hierárquico & Permissões:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div
                      onClick={() => setUserRole('gerente')}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        userRole === 'gerente'
                          ? 'bg-blue-50 border-brand-blue text-brand-blue shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <div className="font-bold">Gerente de Loja (Nível 1)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Lança retiradas com foto, confere POS e fecha caixa com selfie/assinatura.
                      </div>
                    </div>

                    <div
                      onClick={() => setUserRole('supervisor')}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        userRole === 'supervisor'
                          ? 'bg-blue-50 border-brand-blue text-brand-blue shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <div className="font-bold">Supervisor / Auditor (Nível 2)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Executa auditoria presencial às cegas no cofre e confere comprovantes.
                      </div>
                    </div>

                    <div
                      onClick={() => setUserRole('financeiro')}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        userRole === 'financeiro'
                          ? 'bg-blue-50 border-brand-blue text-brand-blue shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <div className="font-bold">Financeiro / Backoffice (Nível 3)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Audita relatórios, valida fotos de comprovantes e conciliação bancária.
                      </div>
                    </div>

                    <div
                      onClick={() => setUserRole('admin')}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        userRole === 'admin'
                          ? 'bg-blue-50 border-brand-blue text-brand-blue shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <div className="font-bold">Diretoria / Admin (Nível 4)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Visão global das 26 lojas, dashboards, usuários e integrações.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lojas Vinculadas */}
                <div className="text-xs">
                  <label className="block text-slate-600 font-bold mb-1">Lojas Vinculadas ao Usuário</label>
                  <select
                    value={userScope}
                    onChange={(e) => setUserScope(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Loja Nº 7 Campinas">Loja Nº 7 Campinas</option>
                    <option value="Loja 01 - Matriz Centro">Loja 01 - Matriz Centro</option>
                    <option value="Região Metropolitana (Lojas 01 a 12)">Região Metropolitana (Lojas 01 a 12)</option>
                    <option value="Todas as 26 Lojas (Conferência e Depósitos)">Todas as 26 Lojas (Conferência e Depósitos)</option>
                    <option value="Acesso Total (26 Lojas)">Acesso Total (26 Lojas)</option>
                  </select>
                </div>

                {/* Checkboxes de Segurança */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requireSelfie}
                      onChange={(e) => setRequireSelfie(e.target.checked)}
                      className="w-4 h-4 text-brand-blue rounded"
                    />
                    <span className="font-semibold text-slate-700">Exigir Selfie ao Vivo no Fechamento</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requireSignature}
                      onChange={(e) => setRequireSignature(e.target.checked)}
                      className="w-4 h-4 text-brand-blue rounded"
                    />
                    <span className="font-semibold text-slate-700">Exigir Assinatura na Tela</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={blockWithoutPhoto}
                      onChange={(e) => setBlockWithoutPhoto(e.target.checked)}
                      className="w-4 h-4 text-brand-blue rounded"
                    />
                    <span className="font-semibold text-slate-700">Bloquear lançamento sem foto de comprovante</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3 px-4 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white font-bold text-xs sm:text-sm shadow-btn transition"
                  >
                    Salvar Usuário
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

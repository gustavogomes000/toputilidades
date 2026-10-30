import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store as StoreIcon, 
  Plus, 
  Search, 
  MapPin, 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  CheckCircle2, 
  RotateCw,
  Building2,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Store, PosMachine } from '../data/stores';

export const StoresManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { stores, addStore, updateStore } = useApp();

  // Search and filter
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('todas');

  // Modal create/edit store
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<number | null>(null);

  // Form states
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [region, setRegion] = useState<'Metropolitana' | 'Campinas e Região' | 'Vale do Paraíba' | 'Litoral' | 'Interior'>('Metropolitana');
  const [address, setAddress] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [sintegraCode, setSintegraCode] = useState('');
  const [manager, setManager] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [supervisor, setSupervisor] = useState('Marcos Vinícius');
  const [closingTimeLimit, setClosingTimeLimit] = useState('20:00');
  const [whatsappAlert, setWhatsappAlert] = useState(true);
  const [safeLimit, setSafeLimit] = useState('15000');
  const [bankAccount, setBankAccount] = useState('Banco do Brasil - Ag 1823-4 / CC 29841-0');

  // POS dynamic list in modal
  const [posList, setPosList] = useState<PosMachine[]>([
    { id: 'pos-1', brand: 'Stone', serial: 'STN-8921', name: 'Caixa 01 - Stone', requiresReceiptPhoto: true },
    { id: 'pos-2', brand: 'Cielo', serial: 'CLO-4412', name: 'Caixa 02 - Cielo', requiresReceiptPhoto: true },
  ]);

  // Test sync simulated state
  const [isTestingSync, setIsTestingSync] = useState(false);
  const [syncTested, setSyncTested] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.number.includes(search) ||
        s.city.toLowerCase().includes(search.toLowerCase()) ||
        s.manager.toLowerCase().includes(search.toLowerCase());

      const matchesRegion = selectedRegion === 'todas' || s.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [stores, search, selectedRegion]);

  const openNewStoreModal = () => {
    setEditingStoreId(null);
    setNumber(`LJ${stores.length + 1 < 10 ? '0' : ''}${stores.length + 1}`);
    setName('');
    setCity('');
    setState('SP');
    setRegion('Metropolitana');
    setAddress('');
    setCnpj('12.345.678/0027-00');
    setSintegraCode(`#SINT-TOP-0${stores.length + 1}`);
    setManager('');
    setManagerPhone('');
    setSupervisor('Marcos Vinícius');
    setClosingTimeLimit('20:00');
    setWhatsappAlert(true);
    setSafeLimit('15000');
    setPosList([
      { id: 'pos-1', brand: 'Stone', serial: 'STN-101', name: 'Caixa 01', requiresReceiptPhoto: true },
    ]);
    setSyncTested(false);
    setIsModalOpen(true);
  };

  const openEditStoreModal = (s: Store) => {
    setEditingStoreId(s.id);
    setNumber(s.number);
    setName(s.name);
    setCity(s.city);
    setState(s.state);
    setRegion(s.region);
    setAddress(s.address);
    setCnpj(s.cnpj);
    setSintegraCode(s.sintegraCode);
    setManager(s.manager);
    setManagerPhone(s.managerPhone);
    setSupervisor(s.supervisor);
    setClosingTimeLimit(s.closingTimeLimit);
    setWhatsappAlert(true);
    setSafeLimit(s.safeLimit.toString());
    setPosList(s.posMachines && s.posMachines.length > 0 ? s.posMachines : [
      { id: 'pos-1', brand: 'Stone', serial: 'STN-101', name: 'Caixa 01', requiresReceiptPhoto: true },
    ]);
    setSyncTested(true);
    setIsModalOpen(true);
  };

  const handleTestSintegra = () => {
    setIsTestingSync(true);
    setTimeout(() => {
      setIsTestingSync(false);
      setSyncTested(true);
      showToast('Comunicação com a API Sintegra da filial validada com sucesso!');
    }, 900);
  };

  const handleAddPos = () => {
    const newPos: PosMachine = {
      id: `pos-${Date.now()}`,
      brand: 'Stone',
      serial: `POS-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `Caixa 0${posList.length + 1}`,
      requiresReceiptPhoto: true,
    };
    setPosList([...posList, newPos]);
  };

  const handleRemovePos = (id: string) => {
    setPosList(posList.filter((p) => p.id !== id));
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city || !manager) return;

    if (editingStoreId) {
      updateStore(editingStoreId, {
        number,
        name,
        city,
        state,
        region,
        address,
        cnpj,
        sintegraCode,
        manager,
        managerPhone,
        supervisor,
        closingTimeLimit,
        safeLimit: parseFloat(safeLimit) || 15000,
        posMachines: posList,
        posCount: posList.length,
      });
      showToast(`Configurações da ${name} salvas com sucesso!`);
    } else {
      const newId = stores.length + 1;
      const newStore: Store = {
        id: newId,
        code: `LJ${number.padStart(2, '0')}`,
        number,
        name,
        city,
        state,
        region,
        address,
        cnpj,
        sintegraCode,
        manager,
        managerPhone,
        supervisor,
        status: 'aberto',
        closingTimeLimit,
        safeLimit: parseFloat(safeLimit) || 15000,
        safeCurrentBalance: 0,
        sintegraTotal: 0,
        cashPhysical: 0,
        cardTotal: 0,
        pixTotal: 0,
        posCount: posList.length,
        posMachines: posList,
        coordinates: { x: 50, y: 50, lat: -23.55, lng: -46.63 },
      };
      addStore(newStore);
      showToast(`Nova loja "${name}" cadastrada com sucesso!`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      
      {/* Toast Notificação */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95">
          <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. TOPO COM KPIS DA REDE E FILTROS */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-card space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-brand-blue flex items-center gap-2">
              <StoreIcon className="w-6 h-6 text-brand-red" />
              Gestão e Cadastro das 26 Lojas da Rede
            </h1>
            <p className="text-xs text-slate-500">
              Parametrização de filiais, códigos Sintegra, gerência, limites de cofre e terminais POS
            </p>
          </div>

          <button
            type="button"
            onClick={openNewStoreModal}
            className="px-4 py-3 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-btn hover:shadow-btn-hover transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Cadastrar Nova Loja</span>
          </button>
        </div>

        {/* 4 Cards Rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-slate-500 font-bold uppercase tracking-wider">Total de Unidades:</div>
            <div className="text-2xl font-black text-brand-blue mt-1">
              26 Lojas Ativas
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% da rede em operação</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-slate-500 font-bold uppercase tracking-wider">Integradas ao Sintegra:</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              26 / 26 (100%)
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Sincronização ERP a cada 5 min</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-slate-500 font-bold uppercase tracking-wider">Terminais POS Cadastrados:</div>
            <div className="text-2xl font-black text-brand-blue mt-1">
              68 Maquininhas
            </div>
            <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Stone, Cielo, Rede, PagBank</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-slate-500 font-bold uppercase tracking-wider">Horário Padrão Fechamento:</div>
            <div className="text-xl font-black text-slate-800 mt-1.5">
              19:30h às 20:30h
            </div>
            <div className="text-[11px] text-amber-600 font-semibold mt-0.5">Disparo de alerta após limite</div>
          </div>

        </div>

        {/* Barra de Busca e Filtro de Região */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, número, cidade ou gerente..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="todas">Todas as Regiões</option>
              <option value="Metropolitana">Região Metropolitana</option>
              <option value="Campinas e Região">Campinas e Região</option>
              <option value="Vale do Paraíba">Vale do Paraíba</option>
              <option value="Litoral">Litoral</option>
              <option value="Interior">Interior Paulista</option>
            </select>
          </div>
        </div>

      </div>

      {/* 2. GRID / LISTA DE CARDS DAS LOJAS CADASTRADAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStores.map((s) => {
          const isLoja7 = s.code === 'LJ07';
          return (
            <div
              key={s.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 shadow-card hover:shadow-card-hover ${
                isLoja7 ? 'ring-2 ring-brand-blue border-brand-blue' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                
                {/* Cabeçalho do Card */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-brand-blue text-white">
                        Loja Nº {s.number}
                      </span>
                      <h3 className="text-base font-extrabold text-[#0B1560] leading-tight">
                        {s.name}
                      </h3>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {s.city} - {s.state} ({s.region})
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Sintegra Ativo
                  </span>
                </div>

                {/* Informações Rápidas */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gerente:</span>
                    <strong className="text-slate-800">{s.manager}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Supervisor:</span>
                    <strong className="text-slate-700">{s.supervisor}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Código Sintegra:</span>
                    <span className="font-mono font-bold text-brand-blue">{s.sintegraCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">CNPJ:</span>
                    <span className="font-mono text-slate-600">{s.cnpj}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Horário Limite:</span>
                    <span className="text-amber-800 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Até {s.closingTimeLimit}h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Teto de Cofre:</span>
                    <strong className="text-slate-900">R$ {s.safeLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  </div>
                </div>

                {/* Maquininhas Vinculadas */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Maquininhas Vinculadas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.posMachines && s.posMachines.length > 0 ? (
                      s.posMachines.map((pos) => (
                        <span key={pos.id} className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-brand-blue border border-blue-200">
                          {pos.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        2 Maquininhas (Padrão)
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Botões do Card */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => openEditStoreModal(s)}
                  className="py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Editar</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/monitoramento')}
                  className="py-2 px-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>Ver no Mapa</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* 3. MODAL / DRAWER COMPLETO: "+ CADASTRAR / EDITAR LOJA" (4 SEÇÕES CLARAS) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
            
            {/* Barra Decorativa */}
            <div className="h-1.5 w-full flex">
              <div className="w-1/3 bg-brand-red" />
              <div className="w-1/3 bg-brand-yellow" />
              <div className="w-1/3 bg-brand-blue" />
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-brand-blue">
                    {editingStoreId ? 'Editar Parâmetros da Filial' : 'Cadastrar Nova Loja na Rede'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Preencha os dados em 4 etapas para homologar a unidade
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveStore} className="space-y-6">
                
                {/* SEÇÃO 1: DADOS BÁSICOS & LOCALIZAÇÃO */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-200 text-xs font-bold text-brand-blue uppercase">
                    <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">1</span>
                    Dados Básicos & Localização (Mapa / Check-in)
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Número da Loja</label>
                      <input
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Ex: 07"
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-600 font-bold mb-1">Nome da Unidade</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Loja Nº 7 Campinas"
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Cidade</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Campinas"
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Região</label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                      >
                        <option value="Metropolitana">Metropolitana</option>
                        <option value="Campinas e Região">Campinas e Região</option>
                        <option value="Vale do Paraíba">Vale do Paraíba</option>
                        <option value="Litoral">Litoral</option>
                        <option value="Interior">Interior</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">CNPJ</label>
                      <input
                        type="text"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        placeholder="00.000.000/0000-00"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-xs">Endereço Completo</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Av. Iguatemi, 777 - Shopping Campinas, Loja 104"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* SEÇÃO 2: VÍNCULO DE LIDERANÇA & HORÁRIOS */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-200 text-xs font-bold text-brand-blue uppercase">
                    <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">2</span>
                    Vínculo de Liderança & Horários de Fechamento
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Gerente Responsável</label>
                      <input
                        type="text"
                        value={manager}
                        onChange={(e) => setManager(e.target.value)}
                        placeholder="Carlos Eduardo"
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-1">WhatsApp do Gerente</label>
                      <input
                        type="text"
                        value={managerPhone}
                        onChange={(e) => setManagerPhone(e.target.value)}
                        placeholder="(19) 98765-0007"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Supervisor / Auditor Regional</label>
                      <select
                        value={supervisor}
                        onChange={(e) => setSupervisor(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                      >
                        <option value="Marcos Vinícius">Marcos Vinícius (Supervisor Regional)</option>
                        <option value="Fernando Dias">Fernando Dias (Supervisor Litoral/Vale)</option>
                        <option value="Cláudio Rocha">Cláudio Rocha (Supervisor Interior)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Horário Limite Fechamento</label>
                      <input
                        type="time"
                        value={closingTimeLimit}
                        onChange={(e) => setClosingTimeLimit(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={whatsappAlert}
                      onChange={(e) => setWhatsappAlert(e.target.checked)}
                      className="w-4 h-4 text-brand-red rounded"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      Disparar cobrança automática no WhatsApp do gerente e supervisor se atrasar
                    </span>
                  </label>
                </div>

                {/* SEÇÃO 3: CONFIGURAÇÃO SINTEGRA & COFRE */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-200 text-xs font-bold text-brand-blue uppercase">
                    <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">3</span>
                    Configuração de Integração Sintegra & Cofre
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Código da Filial na API Sintegra</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={sintegraCode}
                          onChange={(e) => setSintegraCode(e.target.value)}
                          placeholder="#SINT-TOP-007"
                          className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold"
                        />
                        <button
                          type="button"
                          onClick={handleTestSintegra}
                          disabled={isTestingSync}
                          className="px-3 py-2 bg-brand-blue text-white font-bold rounded-xl text-[11px] flex items-center gap-1"
                        >
                          <RotateCw className={`w-3.5 h-3.5 ${isTestingSync ? 'animate-spin' : ''}`} />
                          <span>{syncTested ? 'Conectado' : 'Testar'}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Limite Máximo de Dinheiro no Cofre (R$)</label>
                      <input
                        type="number"
                        value={safeLimit}
                        onChange={(e) => setSafeLimit(e.target.value)}
                        placeholder="15000"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1 text-xs">Conta Bancária Padrão para Depósitos</label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* SEÇÃO 4: MAQUININHAS POS FÍSICAS DA LOJA */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-blue uppercase">
                      <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px]">4</span>
                      Maquininhas POS Físicas da Loja
                    </div>

                    <button
                      type="button"
                      onClick={handleAddPos}
                      className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar POS
                    </button>
                  </div>

                  <div className="space-y-2">
                    {posList.map((pos, idx) => (
                      <div key={pos.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 font-bold text-brand-blue">
                          <CreditCard className="w-4 h-4 text-brand-red" />
                          <span>{pos.name} ({pos.brand})</span>
                          <span className="text-[10px] text-slate-400 font-mono">[{pos.serial}]</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Exigir Foto da Filipeta: Sim
                          </span>
                          {posList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePos(pos.id)}
                              className="text-slate-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botões Finais */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3 px-4 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white font-bold text-xs sm:text-sm shadow-btn transition"
                  >
                    💾 Salvar Cadastro da Loja
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

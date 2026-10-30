import React, { createContext, useContext, useState, useEffect } from 'react';
import { Store, PosMachine, SystemUser, TOP_STORES_DETAILED, TOP_SYSTEM_USERS } from '../data/stores';
import { MOCK_IMAGES } from '../utils/mockImages';

export interface RetiradaItem {
  id: string;
  description: string;
  amount: number;
  photoUrl: string;
  time: string;
  status: 'validado' | 'pendente' | 'rejeitado';
}

export interface BankDepositItem {
  id: string;
  date: string;
  amount: number;
  bank: string;
  agency?: string;
  account?: string;
  receiptUrl: string;
  daysIncluded: string[];
  status: 'conciliado' | 'pendente';
  registeredBy: string;
}

export interface AuditRecord {
  id: string;
  storeCode: string;
  storeName: string;
  date: string;
  auditorName: string;
  blindCount: number;
  expectedAmount: number;
  difference: number;
  isMatches: boolean;
  safePhotoUrl: string;
  auditorSelfieUrl: string;
  auditorSignatureUrl: string;
  managerSelfieUrl: string;
  managerSignatureUrl: string;
  notes: string;
  rating: 'conforme' | 'ressalvas' | 'grave';
  checklists: {
    snackPaper: boolean;
    newspaperPaper: boolean;
    posSlipsPaper: boolean;
    depositSlipPaper: boolean;
  };
  notifiedWhatsApp: boolean;
}

interface FechamentoState {
  integrationMode: 'sintegra' | 'manual';
  date: string;
  storeCode: string;
  storeName: string;
  managerName: string;
  sintegraTotal: number;
  sintegraCash: number;
  sintegraCard: number;
  sintegraPix: number;
  retiradas: RetiradaItem[];
  cashPhysicalCount: number;
  cashDrawerPhoto: string | null;
  posMachines: (PosMachine & { photoUrl?: string })[];
  justificationReason: string;
  justificationObs: string;
  isClosed: boolean;
  closedAt?: string;
  managerSelfie: string | null;
  managerSignature: string | null;
  safePreviousDay: number; // 26/10: R$ 3.401,50
  safeToday: number; // 27/10: R$ 3.751,50
  lastBankDeposit: {
    date: string;
    amount: number;
    bank: string;
    receiptUrl: string;
  };
  depositsList: BankDepositItem[];
}

interface AppContextType {
  fechamento: FechamentoState;
  stores: Store[];
  users: SystemUser[];
  audits: AuditRecord[];
  currentProfile: 'gerente' | 'auditor' | 'financeiro' | 'diretoria' | 'admin';
  setCurrentProfile: (p: 'gerente' | 'auditor' | 'financeiro' | 'diretoria' | 'admin') => void;
  isSintegraSyncing: boolean;
  syncSintegra: () => Promise<void>;
  addRetirada: (description: string, amount: number, photoUrl: string) => void;
  removeRetirada: (id: string) => void;
  updateRetiradaStatus: (id: string, status: 'validado' | 'pendente' | 'rejeitado') => void;
  setCashPhysicalCount: (val: number) => void;
  setIntegrationMode: (mode: 'sintegra' | 'manual') => void;
  setSystemValues: (values: { cash?: number; card?: number; pix?: number }) => void;
  setCashDrawerPhoto: (url: string | null) => void;
  addPosMachine: (machine: PosMachine & { photoUrl?: string }) => void;
  updatePosMachine: (id: string, updates: Partial<PosMachine & { photoUrl?: string }>) => void;
  setJustificationReason: (val: string) => void;
  setJustificationObs: (val: string) => void;
  setManagerSelfie: (url: string | null) => void;
  setManagerSignature: (url: string | null) => void;
  finalizeFechamento: () => void;
  addBankDeposit: (deposit: Omit<BankDepositItem, 'id'>) => void;
  addStore: (newStore: Store) => void;
  updateStore: (id: number, updates: Partial<Store>) => void;
  addUser: (newUser: SystemUser) => void;
  updateUser: (id: string, updates: Partial<SystemUser>) => void;
  saveAuditRecord: (record: Omit<AuditRecord, 'id'>) => void;
  resetAllDemoData: () => void;
}

const LOCAL_STORAGE_KEY = 'top_utilidades_state_v1';

const getInitialFechamentoState = (): FechamentoState => ({
  integrationMode: 'sintegra',
  date: '27/10/2026 - Terça-feira',
  storeCode: 'LJ07',
  storeName: 'Loja Nº 7 Campinas',
  managerName: 'Carlos Eduardo',
  sintegraTotal: 24157.00,
  sintegraCash: 4105.50,
  sintegraCard: 11987.50,
  sintegraPix: 6846.00,
  retiradas: [
    {
      id: 'ret-1',
      description: 'Lanche',
      amount: 54.00,
      photoUrl: MOCK_IMAGES.receiptSnack,
      time: '15:40',
      status: 'validado',
    },
    {
      id: 'ret-2',
      description: 'Jornal para loja',
      amount: 300.00,
      photoUrl: MOCK_IMAGES.receiptNewspaper,
      time: '11:15',
      status: 'validado',
    },
  ],
  cashPhysicalCount: 3751.50,
  cashDrawerPhoto: MOCK_IMAGES.drawerCashPhoto,
  posMachines: [
    {
      id: 'pos-1',
      brand: 'Stone',
      serial: 'STN-8921',
      name: 'Caixa 01 - Stone',
      requiresReceiptPhoto: true,
      creditTotal: 7500.00,
      pixTotal: 4000.00,
      photoVerified: true,
      photoUrl: MOCK_IMAGES.posSlipStone,
    },
    {
      id: 'pos-2',
      brand: 'Cielo',
      serial: 'CLO-4412',
      name: 'Caixa 02 - Cielo',
      requiresReceiptPhoto: true,
      creditTotal: 4522.50,
      pixTotal: 2811.00,
      photoVerified: true,
      photoUrl: MOCK_IMAGES.posSlipCielo,
    },
  ],
  justificationReason: 'Troca na forma de pagamento',
  justificationObs: 'Operador registrou PIX no Sintegra às 15:22 (Venda #8812), porém o cliente utilizou cartão de crédito na maquininha POS Stone.',
  isClosed: true,
  closedAt: '19:45',
  managerSelfie: MOCK_IMAGES.managerSelfie,
  managerSignature: MOCK_IMAGES.defaultSignature,
  safePreviousDay: 3401.50,
  safeToday: 3751.50,
  lastBankDeposit: {
    date: '26/10/2026',
    amount: 14500.00,
    bank: 'Banco do Brasil',
    receiptUrl: MOCK_IMAGES.bankDepositSlip,
  },
  depositsList: [
    {
      id: 'dep-1',
      date: '26/10/2026',
      amount: 14500.00,
      bank: 'Banco do Brasil',
      agency: '1823-4',
      account: '29841-0',
      receiptUrl: MOCK_IMAGES.bankDepositSlip,
      daysIncluded: ['24/10', '25/10'],
      status: 'conciliado',
      registeredBy: 'Carlos Eduardo (Gerente)',
    },
  ],
});

const getInitialAudits = (): AuditRecord[] => [
  {
    id: 'aud-1',
    storeCode: 'LJ07',
    storeName: 'Loja Nº 7 Campinas',
    date: '27/10/2026 19:55',
    auditorName: 'Marcos Vinícius (Supervisor Regional)',
    blindCount: 7153.00,
    expectedAmount: 7153.00,
    difference: 0,
    isMatches: true,
    safePhotoUrl: MOCK_IMAGES.safeInspectionPhoto,
    auditorSelfieUrl: MOCK_IMAGES.auditorSelfie,
    auditorSignatureUrl: MOCK_IMAGES.defaultSignature,
    managerSelfieUrl: MOCK_IMAGES.managerSelfie,
    managerSignatureUrl: MOCK_IMAGES.defaultSignature,
    notes: 'Auditoria presencial concluída. Dinheiro em cofre contado e conferido integralmente. Recibos físicos de despesas arquivados no envelope.',
    rating: 'conforme',
    checklists: {
      snackPaper: true,
      newspaperPaper: true,
      posSlipsPaper: true,
      depositSlipPaper: true,
    },
    notifiedWhatsApp: true,
  },
  {
    id: 'aud-2',
    storeCode: 'LJ01',
    storeName: 'Loja 01 - Matriz Centro',
    date: '25/10/2026 16:30',
    auditorName: 'Marcos Vinícius (Supervisor Regional)',
    blindCount: 8400.00,
    expectedAmount: 8400.00,
    difference: 0,
    isMatches: true,
    safePhotoUrl: MOCK_IMAGES.safeInspectionPhoto,
    auditorSelfieUrl: MOCK_IMAGES.auditorSelfie,
    auditorSignatureUrl: MOCK_IMAGES.defaultSignature,
    managerSelfieUrl: MOCK_IMAGES.managerSelfie,
    managerSignatureUrl: MOCK_IMAGES.defaultSignature,
    notes: 'Cofre e gaveta 100% regulares.',
    rating: 'conforme',
    checklists: {
      snackPaper: true,
      newspaperPaper: true,
      posSlipsPaper: true,
      depositSlipPaper: true,
    },
    notifiedWhatsApp: true,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fechamento, setFechamento] = useState<FechamentoState>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_fechamento`);
    return saved ? { ...getInitialFechamentoState(), ...JSON.parse(saved) } : getInitialFechamentoState();
  });

  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_stores`);
    return saved ? JSON.parse(saved) : TOP_STORES_DETAILED;
  });

  const [users, setUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : TOP_SYSTEM_USERS;
  });

  const [audits, setAudits] = useState<AuditRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_audits`);
    return saved ? JSON.parse(saved) : getInitialAudits();
  });

  const [currentProfile, setCurrentProfile] = useState<'gerente' | 'auditor' | 'financeiro' | 'diretoria' | 'admin'>('gerente');
  const [isSintegraSyncing, setIsSintegraSyncing] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_fechamento`, JSON.stringify(fechamento));
  }, [fechamento]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_stores`, JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_audits`, JSON.stringify(audits));
  }, [audits]);

  // Synchronize Loja 7 in stores array when fechamento changes
  useEffect(() => {
    setStores((prevStores) =>
      prevStores.map((store) => {
        if (store.code === 'LJ07') {
          return {
            ...store,
            status: fechamento.isClosed ? 'fechado_compensado' : 'aberto',
            actualClosingTime: fechamento.closedAt || '19:45',
            cashPhysical: fechamento.cashPhysicalCount,
            safeCurrentBalance: fechamento.safePreviousDay + fechamento.cashPhysicalCount,
            whatsappNotified: fechamento.isClosed,
          };
        }
        return store;
      })
    );
  }, [fechamento.isClosed, fechamento.cashPhysicalCount, fechamento.closedAt, fechamento.safePreviousDay]);

  const syncSintegra = async () => {
    setIsSintegraSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    setIsSintegraSyncing(false);
  };

  const addRetirada = (description: string, amount: number, photoUrl: string) => {
    const newItem: RetiradaItem = {
      id: `ret-${Date.now()}`,
      description,
      amount,
      photoUrl,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'validado',
    };

    setFechamento((prev) => {
      const nextRetiradas = [...prev.retiradas, newItem];
      const totalRetiradas = nextRetiradas.reduce((acc, curr) => acc + curr.amount, 0);
      const newExpectedCash = prev.sintegraCash - totalRetiradas;
      return {
        ...prev,
        retiradas: nextRetiradas,
        cashPhysicalCount: newExpectedCash,
        safeToday: newExpectedCash,
      };
    });
  };

  const removeRetirada = (id: string) => {
    setFechamento((prev) => {
      const nextRetiradas = prev.retiradas.filter((r) => r.id !== id);
      const totalRetiradas = nextRetiradas.reduce((acc, curr) => acc + curr.amount, 0);
      const newExpectedCash = prev.sintegraCash - totalRetiradas;
      return {
        ...prev,
        retiradas: nextRetiradas,
        cashPhysicalCount: newExpectedCash,
        safeToday: newExpectedCash,
      };
    });
  };

  const updateRetiradaStatus = (id: string, status: 'validado' | 'pendente' | 'rejeitado') => {
    setFechamento((prev) => ({
      ...prev,
      retiradas: prev.retiradas.map((r) => (r.id === id ? { ...r, status } : r)),
    }));
  };

  const setCashPhysicalCount = (val: number) => {
    setFechamento((prev) => ({
      ...prev,
      cashPhysicalCount: val,
      safeToday: val,
    }));
  };

  const setIntegrationMode = (mode: 'sintegra' | 'manual') => {
    setFechamento((prev) => ({ ...prev, integrationMode: mode }));
  };

  const setSystemValues = (values: { cash?: number; card?: number; pix?: number }) => {
    setFechamento((prev) => ({
      ...prev,
      sintegraCash: values.cash ?? prev.sintegraCash,
      sintegraCard: values.card ?? prev.sintegraCard,
      sintegraPix: values.pix ?? prev.sintegraPix,
    }));
  };

  const setCashDrawerPhoto = (url: string | null) => {
    setFechamento((prev) => ({ ...prev, cashDrawerPhoto: url }));
  };

  const addPosMachine = (machine: PosMachine & { photoUrl?: string }) => {
    setFechamento((prev) => ({
      ...prev,
      posMachines: [...prev.posMachines, machine],
    }));
  };

  const updatePosMachine = (id: string, updates: Partial<PosMachine & { photoUrl?: string }>) => {
    setFechamento((prev) => ({
      ...prev,
      posMachines: prev.posMachines.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  };

  const setJustificationReason = (val: string) => {
    setFechamento((prev) => ({ ...prev, justificationReason: val }));
  };

  const setJustificationObs = (val: string) => {
    setFechamento((prev) => ({ ...prev, justificationObs: val }));
  };

  const setManagerSelfie = (url: string | null) => {
    setFechamento((prev) => ({ ...prev, managerSelfie: url }));
  };

  const setManagerSignature = (url: string | null) => {
    setFechamento((prev) => ({ ...prev, managerSignature: url }));
  };

  const finalizeFechamento = () => {
    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setFechamento((prev) => ({
      ...prev,
      isClosed: true,
      closedAt: timeNow || '19:45',
    }));
  };

  const addBankDeposit = (deposit: Omit<BankDepositItem, 'id'>) => {
    const newDep: BankDepositItem = {
      ...deposit,
      id: `dep-${Date.now()}`,
    };
    setFechamento((prev) => ({
      ...prev,
      depositsList: [newDep, ...prev.depositsList],
      lastBankDeposit: {
        date: newDep.date,
        amount: newDep.amount,
        bank: newDep.bank,
        receiptUrl: newDep.receiptUrl,
      },
    }));
  };

  const addStore = (newStore: Store) => {
    setStores((prev) => [newStore, ...prev]);
  };

  const updateStore = (id: number, updates: Partial<Store>) => {
    setStores((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const addUser = (newUser: SystemUser) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const updateUser = (id: string, updates: Partial<SystemUser>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const saveAuditRecord = (record: Omit<AuditRecord, 'id'>) => {
    const newRecord: AuditRecord = {
      ...record,
      id: `aud-${Date.now()}`,
    };
    setAudits((prev) => [newRecord, ...prev]);
  };

  const resetAllDemoData = () => {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_fechamento`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_stores`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_users`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_audits`);
    setFechamento(getInitialFechamentoState());
    setStores(TOP_STORES_DETAILED);
    setUsers(TOP_SYSTEM_USERS);
    setAudits(getInitialAudits());
    setCurrentProfile('gerente');
  };

  return (
    <AppContext.Provider
      value={{
        fechamento,
        stores,
        users,
        audits,
        currentProfile,
        setCurrentProfile,
        isSintegraSyncing,
        syncSintegra,
        addRetirada,
        removeRetirada,
        updateRetiradaStatus,
        setCashPhysicalCount,
        setIntegrationMode,
        setSystemValues,
        setCashDrawerPhoto,
        addPosMachine,
        updatePosMachine,
        setJustificationReason,
        setJustificationObs,
        setManagerSelfie,
        setManagerSignature,
        finalizeFechamento,
        addBankDeposit,
        addStore,
        updateStore,
        addUser,
        updateUser,
        saveAuditRecord,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

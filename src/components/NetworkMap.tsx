import React from 'react';
import { Store as StoreIcon } from 'lucide-react';
import type { Store } from '../data/stores';

/**
 * Posições de exibição (em %) das 26 lojas no mapa da rede.
 * Foram espalhadas à mão para que nenhum pin fique em cima do outro.
 */
const MAP_POSITIONS: Record<string, { x: number; y: number }> = {
  '20': { x: 11, y: 11 }, '21': { x: 30, y: 8 }, '19': { x: 49, y: 12 }, '18': { x: 68, y: 8 }, '09': { x: 87, y: 12 },
  '22': { x: 20, y: 29 }, '15': { x: 38, y: 27 }, '14': { x: 56, y: 30 }, '05': { x: 74, y: 27 }, '11': { x: 91, y: 31 },
  '16': { x: 8, y: 47 }, '17': { x: 24, y: 49 }, '07': { x: 40, y: 46 }, '02': { x: 57, y: 48 }, '10': { x: 73, y: 46 }, '12': { x: 89, y: 50 },
  '23': { x: 15, y: 66 }, '24': { x: 33, y: 67 }, '01': { x: 52, y: 65 }, '04': { x: 70, y: 66 }, '08': { x: 87, y: 69 },
  '25': { x: 10, y: 85 }, '26': { x: 28, y: 86 }, '03': { x: 46, y: 84 }, '06': { x: 64, y: 86 }, '13': { x: 82, y: 86 },
};

const STATUS_STYLE: Record<Store['status'], { grad: string; glow: string; ping?: string; label: string }> = {
  fechado_ok: {
    grad: 'from-emerald-400 to-emerald-600',
    glow: 'shadow-[0_0_18px_rgba(16,185,129,0.65)]',
    label: 'Fechado OK',
  },
  fechado_compensado: {
    grad: 'from-amber-300 to-amber-500',
    glow: 'shadow-[0_0_18px_rgba(245,158,11,0.65)]',
    label: 'Compensado',
  },
  divergencia: {
    grad: 'from-red-400 to-brand-red',
    glow: 'shadow-[0_0_20px_rgba(238,43,51,0.8)]',
    ping: 'bg-red-400',
    label: 'Com divergência',
  },
  aberto: {
    grad: 'from-slate-300 to-slate-500',
    glow: 'shadow-[0_0_14px_rgba(148,163,184,0.55)]',
    ping: 'bg-slate-300',
    label: 'Aberto',
  },
};

interface NetworkMapProps {
  stores: Store[];
  activeId?: number | null;
  isLive: boolean;
  dayLabel: string;
  onHover: (store: Store) => void;
  onSelect: (store: Store) => void;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({ stores, activeId, isLive, dayLabel, onHover, onSelect }) => {
  const hub = MAP_POSITIONS['01'];

  return (
    <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700/60 shadow-inner bg-[#070d3a] select-none">
      {/* Fundo: degradê + brilhos nas cores da marca */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1560] via-[#0a1048] to-[#050a2e]" />
      <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-brand-yellow/10 blur-3xl" />
      <div className="absolute -bottom-28 -right-16 w-96 h-96 rounded-full bg-brand-red/15 blur-3xl" />
      <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-sky-400/10 blur-3xl" />

      {/* Malha + rede de conexões com a Matriz */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="map-dots" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.18" fill="#94A3B8" opacity="0.35" />
          </pattern>
          <linearGradient id="map-land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#FFF200" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#map-dots)" />
        <path
          d="M 6 22 Q 18 6 40 5 T 78 4 Q 96 8 96 28 T 94 62 Q 98 82 80 94 T 40 96 Q 14 96 8 76 T 6 22 Z"
          fill="url(#map-land)"
          stroke="#7DD3FC"
          strokeOpacity="0.35"
          strokeWidth="0.35"
          strokeDasharray="1.4 1"
          vectorEffect="non-scaling-stroke"
        />
        {stores
          .filter((s) => s.number !== '01' && MAP_POSITIONS[s.number])
          .map((s) => {
            const p = MAP_POSITIONS[s.number];
            const hot = activeId === s.id;
            return (
              <line
                key={s.id}
                x1={hub.x}
                y1={hub.y}
                x2={p.x}
                y2={p.y}
                stroke={hot ? '#FFF200' : '#93C5FD'}
                strokeOpacity={hot ? 0.9 : 0.14}
                strokeWidth={hot ? 1.4 : 0.8}
                strokeDasharray="2 3"
                vectorEffect="non-scaling-stroke"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="3s" repeatCount="indefinite" />
              </line>
            );
          })}
      </svg>

      {/* Selo superior: dia + estado */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white text-[11px] font-bold">
        {isLive ? (
          <>
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-red-400 opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-red-500" />
            </span>
            AO VIVO • {dayLabel}
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            DIA FECHADO • {dayLabel}
          </>
        )}
      </div>
      <div className="absolute top-3 right-3 z-30 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-yellow text-brand-blue text-[11px] font-black shadow-lg">
        <StoreIcon className="w-3.5 h-3.5" />
        {stores.length} LOJAS
      </div>

      {/* Pins das lojas */}
      {stores.map((store) => {
        const pos = MAP_POSITIONS[store.number] ?? { x: store.coordinates.x, y: store.coordinates.y };
        const st = STATUS_STYLE[store.status];
        const isActive = activeId === store.id;
        const isLoja7 = store.code === 'LJ07';

        return (
          <button
            key={store.id}
            type="button"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none ${isActive ? 'z-40' : 'z-20 hover:z-40'}`}
            onClick={() => onSelect(store)}
            onMouseEnter={() => onHover(store)}
            onFocus={() => onHover(store)}
            aria-label={`${store.name} - ${st.label}`}
          >
            <span className="relative flex flex-col items-center">
              {st.ping && (
                <span className={`absolute top-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl opacity-60 animate-ping ${st.ping}`} />
              )}

              {/* Corpo do pin: ícone de loja */}
              <span
                className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${st.grad} ${st.glow} border border-white/70 transition-transform duration-200 group-hover:scale-125 ${
                  isActive ? 'scale-125 ring-2 ring-white' : ''
                } ${isLoja7 ? 'ring-[3px] ring-brand-yellow' : ''}`}
              >
                <StoreIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow" strokeWidth={2.2} />
                {/* toldo da lojinha */}
                <span className="absolute -top-[3px] left-1 right-1 h-1.5 rounded-t-md bg-[repeating-linear-gradient(90deg,#fff_0_4px,rgba(255,255,255,0.35)_4px_8px)]" />
              </span>

              {/* Número da loja */}
              <span className="-mt-1.5 relative z-10 px-1.5 rounded-full bg-white text-brand-blue text-[9px] sm:text-[10px] font-black leading-4 shadow-md border border-slate-200">
                {store.number}
              </span>

              {/* Tooltip com o nome */}
              <span className="pointer-events-none absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-lg bg-white text-brand-blue text-[10px] font-bold shadow-xl opacity-0 group-hover:opacity-100 transition">
                {store.name}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
};

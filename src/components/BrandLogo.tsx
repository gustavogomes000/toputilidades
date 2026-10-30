import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'image' | 'vector';
  className?: string;
  withShadow?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'lg',
  variant = 'image',
  className = '',
  withShadow = true,
}) => {
  const sizeMap = {
    sm: { container: 'w-16 h-16', image: 'w-16 h-16', text: 'text-xs' },
    md: { container: 'w-24 h-24', image: 'w-24 h-24', text: 'text-sm' },
    lg: { container: 'w-32 h-32', image: 'w-32 h-32', text: 'text-base' },
    xl: { container: 'w-40 h-40', image: 'w-40 h-40', text: 'text-lg' },
  };

  const selectedSize = sizeMap[size];

  if (variant === 'vector') {
    return (
      <div
        className={`relative flex flex-col items-center justify-center rounded-2xl bg-brand-yellow p-3 border-2 border-brand-yellow-warm/30 ${
          withShadow ? 'shadow-lg shadow-yellow-400/20' : ''
        } ${selectedSize.container} ${className}`}
      >
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fundo Amarelo Top */}
          <rect width="240" height="240" rx="28" fill="#FFF200" />

          {/* Laço de Presente Vermelho */}
          <g stroke="#EE2B33" strokeWidth="6" fill="none" strokeLinecap="round">
            {/* Laço Esquerdo */}
            <path
              d="M 120 85 C 90 40, 50 45, 65 65 C 80 80, 110 85, 120 88"
              fill="#EE2B33"
            />
            {/* Laço Direito */}
            <path
              d="M 120 85 C 150 40, 190 45, 175 65 C 160 80, 130 85, 120 88"
              fill="#EE2B33"
            />
            {/* Fita Central */}
            <path d="M 105 88 Q 120 96 135 88" stroke="#EE2B33" strokeWidth="4" />
          </g>

          {/* Caixa Vermelha de Presente */}
          <rect x="25" y="88" width="190" height="85" rx="6" fill="#EE2B33" />
          {/* Aba da Tampa */}
          <rect x="20" y="88" width="200" height="14" rx="4" fill="#EE2B33" />

          {/* Texto "TOP" Vazado em Branco */}
          <g fill="#FFFFFF">
            {/* Letra T */}
            <path d="M 38 106 H 76 V 118 H 63 V 158 H 47 V 118 H 38 Z" />

            {/* Letra O Estilizada com Vórtice / Círculo */}
            <circle cx="118" cy="132" r="26" />
            <circle cx="118" cy="132" r="13" fill="#EE2B33" />
            <path
              d="M 108 114 Q 126 128 112 148"
              stroke="#FFFFFF"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Letra P */}
            <path d="M 158 106 H 188 C 198 106 205 112 205 122 C 205 132 198 138 188 138 H 172 V 158 H 158 Z M 172 117 V 127 H 186 C 190 127 193 125 193 122 C 193 119 190 117 186 117 Z" />
          </g>

          {/* Texto Subtítulo "UTILIDADES E PRESENTES" em Azul Marinho */}
          <text
            x="120"
            y="198"
            textAnchor="middle"
            fill="#0B1560"
            fontFamily="Arial Black, Impact, sans-serif"
            fontWeight="900"
            fontSize="14.5"
            letterSpacing="1.2"
          >
            UTILIDADES E PRESENTES
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-brand-yellow p-1.5 transition-transform duration-300 hover:scale-[1.02] border-2 border-brand-yellow-warm/40 ${
        withShadow ? 'shadow-lg shadow-yellow-500/20' : ''
      } ${selectedSize.container} ${className}`}
    >
      <img
        src="/logo.png"
        alt="Logo Oficial TOP Utilidades e Presentes"
        className="h-full w-full object-contain rounded-xl select-none"
        loading="eager"
      />
    </div>
  );
};

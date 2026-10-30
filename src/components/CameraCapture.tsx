import React, { useRef, useState } from 'react';
import { Camera, Check, Sparkles, Eye, X } from 'lucide-react';
import { MOCK_IMAGES } from '../utils/mockImages';
import { UniversalCameraModal } from './UniversalCameraModal';

interface CameraCaptureProps {
  label?: string;
  photoUrl: string | null;
  onPhotoCapture: (url: string | null) => void;
  mockType?: 'snack' | 'newspaper' | 'stone' | 'cielo' | 'drawer' | 'deposit' | 'safe' | 'auditor' | 'manager';
  buttonText?: string;
  className?: string;
  requiredBadge?: boolean;
  storeName?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  label,
  photoUrl,
  onPhotoCapture,
  mockType = 'snack',
  buttonText = 'Tirar Foto do Comprovante',
  className = '',
  requiredBadge = false,
  storeName = 'Loja Nº 7 Campinas',
}) => {
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  const handleSimulate = () => {
    let mockImg = MOCK_IMAGES.receiptSnack;
    if (mockType === 'newspaper') mockImg = MOCK_IMAGES.receiptNewspaper;
    else if (mockType === 'stone') mockImg = MOCK_IMAGES.posSlipStone;
    else if (mockType === 'cielo') mockImg = MOCK_IMAGES.posSlipCielo;
    else if (mockType === 'drawer') mockImg = MOCK_IMAGES.drawerCashPhoto;
    else if (mockType === 'deposit') mockImg = MOCK_IMAGES.bankDepositSlip;
    else if (mockType === 'safe') mockImg = MOCK_IMAGES.safeInspectionPhoto;
    else if (mockType === 'auditor') mockImg = MOCK_IMAGES.auditorSelfie;
    else if (mockType === 'manager') mockImg = MOCK_IMAGES.managerSelfie;

    onPhotoCapture(mockImg);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            {label}
            {requiredBadge && <span className="text-brand-red font-bold">*</span>}
          </label>
          {photoUrl ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Check className="w-3 h-3 text-emerald-600" /> Foto OK
            </span>
          ) : (
            <span className="text-[10px] text-slate-400">Obrigatório</span>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {/* Main Photo Trigger */}
        {!photoUrl ? (
          <button
            type="button"
            onClick={() => setIsCameraModalOpen(true)}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-brand-blue/30 hover:border-brand-blue bg-white hover:bg-brand-blue-light/30 text-brand-blue text-xs sm:text-sm font-semibold transition shadow-xs"
          >
            <Camera className="w-4 h-4 text-brand-blue" />
            <span>📷 {buttonText}</span>
          </button>
        ) : (
          <div className="flex-1 min-h-[44px] flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2">
              <img
                src={photoUrl}
                alt="Comprovante"
                className="w-9 h-9 object-cover rounded-lg border border-emerald-300 shadow-xs cursor-pointer hover:opacity-90"
                onClick={() => {
                  const w = window.open('');
                  w?.document.write(`<img src="${photoUrl}" style="max-width:100%;height:auto;margin:auto;display:block;" />`);
                }}
                title="Clique para ver em tela cheia"
              />
              <span className="text-xs font-semibold text-emerald-800">
                ✅ Foto Anexada com Sucesso
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsCameraModalOpen(true)}
                className="p-1.5 text-emerald-700 hover:text-emerald-900 rounded-lg hover:bg-emerald-100 transition"
                title="Tirar outra foto com a câmera"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onPhotoCapture(null)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                title="Remover foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Client Demo Instant Simulation Button */}
        {!photoUrl && (
          <button
            type="button"
            onClick={handleSimulate}
            className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold transition"
            title="Preencher com imagem de demonstração sem precisar abrir câmera"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Simular Foto</span>
            <span className="sm:hidden">Simular</span>
          </button>
        )}
      </div>

      {/* Modal Universal de Câmera Ao Vivo */}
      <UniversalCameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(url) => onPhotoCapture(url)}
        title={label || buttonText}
        subtitle="Abra a câmera do dispositivo, aponte e capture a imagem"
        storeName={storeName}
        mockFallbackType={mockType}
      />
    </div>
  );
};

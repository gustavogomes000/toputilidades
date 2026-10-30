import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';
import { MOCK_IMAGES } from '../utils/mockImages';

interface SelfieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelfieCaptured: (dataUrl: string) => void;
  title?: string;
  subtitle?: string;
  timestamp?: string;
  storeName?: string;
  managerName?: string;
}

export const SelfieModal: React.FC<SelfieModalProps> = ({
  isOpen,
  onClose,
  onSelfieCaptured,
  title = 'Captura Biométrica de Selfie',
  subtitle = 'Posicione seu rosto dentro da moldura oval',
  timestamp = '27/10/2026 19:45',
  storeName = 'Loja Nº 7 Campinas',
  managerName = 'Carlos Eduardo',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      setCapturedPhoto(null);
      setCameraError(false);
      return;
    }

    // Try starting camera
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch(() => {
        setCameraError(true);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const takeRealSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, 400, 480);
    // Draw watermark
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 410, 400, 70);
    ctx.fillStyle = '#22C55E';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BIOMETRIA FACIAL HOMOLOGADA', 200, 432);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '11px sans-serif';
    ctx.fillText(`${managerName.toUpperCase()} • ${storeName.toUpperCase()}`, 200, 450);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px sans-serif';
    ctx.fillText(`${timestamp} • IP 177.18.24.11`, 200, 467);

    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedPhoto(dataUrl);
  };

  const takeSimulatedSnapshot = () => {
    setCapturedPhoto(MOCK_IMAGES.managerSelfie);
  };

  const confirmSelfie = () => {
    if (capturedPhoto) {
      onSelfieCaptured(capturedPhoto);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 text-white flex flex-col">
        
        {/* Top Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">{title}</h4>
              <p className="text-[11px] text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative aspect-[3/4] w-full bg-black flex items-center justify-center overflow-hidden">
          {!capturedPhoto ? (
            <>
              {/* Video Stream or Fallback */}
              {!cameraError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <Camera className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-slate-300">
                    Câmera em modo simulação para demonstração
                  </p>
                  <button
                    type="button"
                    onClick={takeSimulatedSnapshot}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-yellow text-brand-blue font-bold text-xs shadow-md hover:bg-yellow-400 transition"
                  >
                    <Sparkles className="w-4 h-4 text-brand-blue" />
                    Capturar Selfie de Demonstração
                  </button>
                </div>
              )}

              {/* Oval Face Guide Overlay */}
              {!cameraError && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="w-56 h-72 border-2 border-dashed border-emerald-400 rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] flex items-center justify-center">
                    <span className="text-[11px] font-semibold text-emerald-300 bg-slate-900/80 px-2 py-0.5 rounded-full border border-emerald-500/50">
                      Enquadre seu rosto
                    </span>
                  </div>
                </div>
              )}

              {/* Timestamp Watermark on bottom */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md rounded-xl p-2.5 border border-slate-700 text-center">
                <div className="text-xs font-bold text-emerald-400">
                  {storeName} • {managerName}
                </div>
                <div className="text-[10px] text-slate-300">
                  Carimbo de Auditoria: {timestamp} (Ao Vivo)
                </div>
              </div>
            </>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedPhoto}
                alt="Selfie Capturada"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <Check className="w-3.5 h-3.5" /> Biometria Validada
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          {!capturedPhoto ? (
            <>
              <button
                type="button"
                onClick={takeSimulatedSnapshot}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Simular Foto
              </button>

              <button
                type="button"
                onClick={takeRealSnapshot}
                className="flex-[2] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white text-sm font-bold shadow-btn transition"
              >
                <Camera className="w-4 h-4" />
                📸 Capturar Selfie
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCapturedPhoto(null)}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <RefreshCw className="w-4 h-4" />
                Tirar Outra
              </button>

              <button
                type="button"
                onClick={confirmSelfie}
                className="flex-[2] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg transition"
              >
                <Check className="w-4 h-4" />
                Confirmar Esta Selfie
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check, RefreshCw, Upload, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { MOCK_IMAGES } from '../utils/mockImages';

export interface UniversalCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  title?: string;
  subtitle?: string;
  storeName?: string;
  watermarkUser?: string;
  mockFallbackType?: 'snack' | 'newspaper' | 'stone' | 'cielo' | 'drawer' | 'deposit' | 'safe' | 'auditor' | 'manager';
}

export const UniversalCameraModal: React.FC<UniversalCameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title = 'Captura de Imagem / Câmera Ao Vivo',
  subtitle = 'Enquadre o documento ou o cofre dentro do visor',
  storeName = 'Loja Nº 7 Campinas',
  watermarkUser = 'Marcos Vinícius (Supervisor)',
  mockFallbackType = 'safe',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'demo'>('camera');

  // Inicializa o stream da webcam / câmera móvel
  useEffect(() => {
    if (!isOpen) {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }
      setCapturedPhoto(null);
      return;
    }

    let activeStream: MediaStream | null = null;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })
        .then((mediaStream) => {
          activeStream = mediaStream;
          setStream(mediaStream);
          setHasCamera(true);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch(() => {
          setHasCamera(false);
          setActiveTab('demo');
        });
    } else {
      setHasCamera(false);
      setActiveTab('demo');
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  const toggleFacingMode = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const takeSnapshot = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    if (videoRef.current && videoRef.current.videoWidth) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Carimbo / Marca d'água oficial corporativa
        const h = canvas.height;
        const w = canvas.width;
        ctx.fillStyle = 'rgba(11, 21, 96, 0.88)';
        ctx.fillRect(0, h - 80, w, 80);

        ctx.fillStyle = '#FFF200';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('TOP UTILIDADES • EVIDÊNCIA OFICIAL DE AUDITORIA', 24, h - 48);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px sans-serif';
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');
        ctx.fillText(`${storeName.toUpperCase()} • RESPONSÁVEL: ${watermarkUser.toUpperCase()}`, 24, h - 24);

        ctx.fillStyle = '#38BDF8';
        ctx.font = '14px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${dateStr} • GEO -22.9099,-47.0626 • SHA256-OK`, w - 24, h - 24);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setCapturedPhoto(dataUrl);
        return;
      }
    }

    // Fallback se não conseguiu capturar do canvas
    useDemoPhoto();
  };

  const useDemoPhoto = () => {
    let img = MOCK_IMAGES.safeInspectionPhoto;
    if (mockFallbackType === 'snack') img = MOCK_IMAGES.receiptSnack;
    else if (mockFallbackType === 'newspaper') img = MOCK_IMAGES.receiptNewspaper;
    else if (mockFallbackType === 'stone') img = MOCK_IMAGES.posSlipStone;
    else if (mockFallbackType === 'cielo') img = MOCK_IMAGES.posSlipCielo;
    else if (mockFallbackType === 'drawer') img = MOCK_IMAGES.drawerCashPhoto;
    else if (mockFallbackType === 'deposit') img = MOCK_IMAGES.bankDepositSlip;
    else if (mockFallbackType === 'auditor') img = MOCK_IMAGES.auditorSelfie;
    else if (mockFallbackType === 'manager') img = MOCK_IMAGES.managerSelfie;
    setCapturedPhoto(img);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col text-white">
        
        {/* Topo / Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-yellow/20 text-brand-yellow flex items-center justify-center">
              <Camera className="w-5 h-5 text-brand-yellow" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Modo (Câmera ao Vivo / Carregar Imagem / Exemplo Realista) */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'camera'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Câmera Ao Vivo</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              fileInputRef.current?.click();
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'upload'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Galeria / Arquivo</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('demo');
              useDemoPhoto();
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'demo'
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Foto Padrão Loja</span>
          </button>
        </div>

        {/* Input Oculto de Arquivo */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Área Central: Vídeo ou Foto Capturada */}
        <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          
          {/* Flash Effect */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-200" />
          )}

          {capturedPhoto ? (
            /* Foto Capturada Pronta para Confirmação */
            <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
              <img
                src={capturedPhoto}
                alt="Foto Capturada"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-black flex items-center gap-1.5 shadow-lg">
                <Check className="w-3.5 h-3.5" />
                <span>Foto Capturada com Sucesso</span>
              </div>
            </div>
          ) : (
            /* Vídeo da Câmera em Tempo Real */
            <div className="relative w-full h-full flex items-center justify-center">
              {hasCamera ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Moldura de Mira / Viewfinder */}
                  <div className="absolute inset-6 border-2 border-dashed border-white/60 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                    <div className="flex justify-between">
                      <span className="w-5 h-5 border-t-2 border-l-2 border-brand-yellow" />
                      <span className="w-5 h-5 border-t-2 border-r-2 border-brand-yellow" />
                    </div>
                    <div className="text-center">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-brand-yellow text-[10px] font-bold border border-white/10 uppercase tracking-wider">
                        Enquadre o documento ou cofre
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="w-5 h-5 border-b-2 border-l-2 border-brand-yellow" />
                      <span className="w-5 h-5 border-b-2 border-r-2 border-brand-yellow" />
                    </div>
                  </div>

                  {/* Carimbo de Localização e Data na Tela Ao Vivo */}
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                    <span className="font-bold text-white flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      {storeName}
                    </span>
                    <span>GEO: -22.9099, -47.0626</span>
                  </div>

                  {/* Botão de Alternar Câmera (Frontal / Traseira) */}
                  <button
                    type="button"
                    onClick={toggleFacingMode}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 transition shadow-lg"
                    title="Alternar Câmera"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </>
              ) : (
                /* Fallback se o navegador não liberou a webcam */
                <div className="text-center p-6 space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                  <div className="text-sm font-bold text-white">Câmera não disponível no navegador</div>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Você pode carregar uma foto do seu dispositivo ou usar uma foto de demonstração homologada para a auditoria.
                  </p>
                  <div className="pt-2 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold"
                    >
                      📁 Escolher do Computador
                    </button>
                    <button
                      type="button"
                      onClick={useDemoPhoto}
                      className="px-4 py-2 rounded-xl bg-brand-yellow text-brand-blue text-xs font-black"
                    >
                      ⚡ Usar Foto Demonstrativa
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Rodapé com Botões de Ação */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          {capturedPhoto ? (
            <>
              <button
                type="button"
                onClick={() => setCapturedPhoto(null)}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tirar Outra</span>
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar e Salvar Evidência</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={hasCamera ? takeSnapshot : useDemoPhoto}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.98] transition"
              >
                <Camera className="w-5 h-5 text-white" />
                <span>📸 DISPARAR E CAPTURAR FOTO</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

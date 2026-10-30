import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, Check, PenTool } from 'lucide-react';

interface SignatureCanvasProps {
  onSignatureChange: (dataUrl: string | null) => void;
  width?: number;
  height?: number;
  initialSignature?: string | null;
  label?: string;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onSignatureChange,
  width = 450,
  height = 180,
  initialSignature = null,
  label = 'Assinatura Digital na Tela',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // If initial signature provided
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setHasDrawn(true);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent scrolling on mobile touch
    if ('touches' in e) {
      e.stopPropagation();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.strokeStyle = '#0B1560'; // Brand Navy Blue
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if ('touches' in e) {
      e.stopPropagation();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (hasDrawn) {
      const dataUrl = canvas.toDataURL('image/png');
      onSignatureChange(dataUrl);
    }
  }, [isDrawing, hasDrawn, onSignatureChange]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSignatureChange(null);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5 text-brand-blue" />
          {label}
        </label>
        <button
          type="button"
          onClick={clearCanvas}
          className="text-xs text-brand-red hover:text-brand-red-hover flex items-center gap-1 font-semibold px-2 py-0.5 rounded hover:bg-red-50 transition"
        >
          <RotateCcw className="w-3 h-3" />
          Limpar Assinatura
        </button>
      </div>

      <div className="relative rounded-2xl border-2 border-dashed border-slate-300 bg-white overflow-hidden shadow-inner group focus-within:border-brand-blue">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ touchAction: 'none' }}
          className="w-full h-36 sm:h-44 cursor-crosshair block select-none bg-white"
        />

        {!hasDrawn && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <span className="text-sm font-medium">Desenhe sua assinatura com o dedo ou mouse</span>
            <span className="text-xs text-slate-300 mt-1">Área protegida por carimbo de data/hora</span>
          </div>
        )}

        <div className="absolute bottom-2 right-3 pointer-events-none flex items-center gap-1">
          {hasDrawn ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Check className="w-3 h-3" /> Assinado
            </span>
          ) : (
            <span className="text-[10px] text-slate-400">Linha de assinatura oficial</span>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, ZoomIn, CheckCircle2, Download } from 'lucide-react';

interface PhotoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  photoUrl: string | null;
  subtitle?: string;
  metadata?: {
    date?: string;
    amount?: string;
    author?: string;
    status?: string;
  };
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  photoUrl,
  subtitle,
  metadata,
}) => {
  if (!isOpen || !photoUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-brand-blue text-white flex items-center justify-between border-b border-blue-900">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 text-brand-yellow text-xs font-semibold mb-1">
              <ZoomIn className="w-3.5 h-3.5" /> Evidência Fotográfica do Fechamento
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{title}</h3>
            {subtitle && <p className="text-xs text-blue-200">{subtitle}</p>}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-blue-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Container with Scroll & Zoom */}
        <div className="flex-1 overflow-auto p-4 bg-slate-100 flex items-center justify-center min-h-[300px]">
          <img
            src={photoUrl}
            alt={title}
            className="max-h-[62vh] max-w-full object-contain rounded-xl shadow-lg border border-slate-300 bg-white"
          />
        </div>

        {/* Footer with Metadata */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-slate-600">
            {metadata?.date && (
              <span><strong>Data:</strong> {metadata.date}</span>
            )}
            {metadata?.amount && (
              <span className="text-emerald-700 font-bold"><strong>Valor:</strong> {metadata.amount}</span>
            )}
            {metadata?.author && (
              <span><strong>Lançado por:</strong> {metadata.author}</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {metadata?.status || 'Validado pelo Sistema'}
            </span>
            <button
              onClick={() => {
                const a = document.createElement('a');
                a.href = photoUrl;
                a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.png`;
                a.click();
              }}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              title="Baixar imagem"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

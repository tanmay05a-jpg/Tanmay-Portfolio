import React from 'react';
import { X, Download, Camera, Check, ExternalLink } from 'lucide-react';
import { PORTFOLIO_PHOTOS } from '../data/photoAssets';
import { PhotoDisplay } from './PhotoDisplay';
import { usePortfolio } from '../context/PortfolioContext';

interface PhotoLightboxModalProps {
  photoKey: 'executive' | 'onset' | 'chair' | null;
  onClose: () => void;
  onOpenManager: () => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  photoKey,
  onClose,
  onOpenManager,
}) => {
  const { profile } = usePortfolio();

  if (!photoKey) return null;

  const currentMeta = PORTFOLIO_PHOTOS.find((p) => p.id === photoKey) || PORTFOLIO_PHOTOS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full bg-slate-900/80 text-white p-2 hover:bg-slate-900 transition-colors shadow-lg"
          aria-label="Close lightbox"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Large Photo Frame */}
        <div className="md:w-3/5 bg-slate-950 flex items-center justify-center p-6 relative">
          <div className="w-full max-w-[380px] rounded-xl overflow-hidden shadow-2xl">
            <PhotoDisplay
              photoKey={photoKey}
              aspectRatio="4/5"
              showControls={false}
              showBadge={true}
              className="w-full shadow-2xl"
            />
          </div>
        </div>

        {/* Right Side: Editorial Context & Technical Metadata */}
        <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-white overflow-y-auto">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
              <Camera className="h-3.5 w-3.5" />
              <span>{currentMeta.tag}</span>
            </div>

            <h3 className="mt-3 text-2xl font-bold text-slate-900 tracking-tight">
              {currentMeta.title}
            </h3>

            <p className="mt-1 text-xs font-semibold text-slate-600 font-mono">
              Tanmay Agrawal · {currentMeta.role}
            </p>

            <div className="mt-2 text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded inline-block">
              Filename: {currentMeta.fileName}
            </div>

            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              {currentMeta.description}
            </p>

            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Key Credentials &amp; Focus
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {currentMeta.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenManager();
              }}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors text-center"
            >
              Upload / Replace This Photo
            </button>

            <button
              onClick={onClose}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-center"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

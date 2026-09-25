import React, { useState } from 'react';
import { Camera, Upload, Maximize2, Check, RefreshCw } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { getPhotoSvg, PORTFOLIO_PHOTOS } from '../data/photoAssets';

interface PhotoDisplayProps {
  photoKey: 'executive' | 'onset' | 'chair';
  aspectRatio?: '4/5' | '1/1' | '16/9' | '3/4' | 'auto';
  className?: string;
  showBadge?: boolean;
  showControls?: boolean;
  enableUpload?: boolean;
  onOpenLightbox?: (photoKey: 'executive' | 'onset' | 'chair') => void;
}

export const PhotoDisplay: React.FC<PhotoDisplayProps> = ({
  photoKey,
  aspectRatio = '4/5',
  className = '',
  showBadge = true,
  showControls = true,
  enableUpload = true,
  onOpenLightbox,
}) => {
  const { profile, updateProfile, showToast, isEditMode } = usePortfolio();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Find metadata for this photo
  const photoMeta = PORTFOLIO_PHOTOS.find((p) => p.id === photoKey) || PORTFOLIO_PHOTOS[0];

  // Determine active photo source
  let activeSrc = '';
  if (photoKey === 'executive') {
    activeSrc = profile.avatarUrl || '';
  } else if (photoKey === 'onset') {
    activeSrc = profile.onsetPhotoUrl || '';
  } else if (photoKey === 'chair') {
    activeSrc = profile.chairPhotoUrl || '';
  }

  // Handle local file selection (e.g. IMG_5592.PNG)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (.png, .jpg, .jpeg, .webp)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (photoKey === 'executive') {
        updateProfile({ avatarUrl: result });
      } else if (photoKey === 'onset') {
        updateProfile({ onsetPhotoUrl: result });
      } else if (photoKey === 'chair') {
        updateProfile({ chairPhotoUrl: result });
      }
      setImgError(false);
      showToast(`Photo updated: ${file.name} saved successfully!`);
    };
    reader.readAsDataURL(file);
  };

  // Reset to default illustration
  const handleResetToDefault = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoKey === 'executive') {
      updateProfile({ avatarUrl: '' });
    } else if (photoKey === 'onset') {
      updateProfile({ onsetPhotoUrl: '' });
    } else if (photoKey === 'chair') {
      updateProfile({ chairPhotoUrl: '' });
    }
    setImgError(false);
    showToast('Reset to default studio illustration');
  };

  const aspectClass =
    aspectRatio === '4/5'
      ? 'aspect-[4/5]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '16/9'
      ? 'aspect-video'
      : aspectRatio === '3/4'
      ? 'aspect-[3/4]'
      : '';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm transition-all duration-300 ${aspectClass} ${className}`}
    >
      {/* 1. Actual Photo Image (if present & not errored) */}
      {activeSrc && !imgError ? (
        <img
          src={activeSrc}
          alt={`Tanmay Agrawal - ${photoMeta.title}`}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        /* 2. Pristine SVG Graphic Representation fallback */
        <div
          className="h-full w-full transition-transform duration-500 group-hover:scale-105 flex items-center justify-center select-none"
          dangerouslySetInnerHTML={{ __html: getPhotoSvg(photoKey) }}
        />
      )}

      {/* Subtle vignette gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        {showBadge && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm border border-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{photoMeta.tag}</span>
          </span>
        )}

        <span className="inline-flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono text-slate-700 shadow-sm border border-slate-200">
          {photoMeta.fileName}
        </span>
      </div>

      {/* Bottom info on hover */}
      <div className="absolute bottom-3 left-3 right-3 text-white transition-all duration-300 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 pointer-events-none">
        <p className="text-xs font-bold leading-tight drop-shadow-sm">{photoMeta.title}</p>
        <p className="text-[10px] text-slate-200 drop-shadow-sm mt-0.5 line-clamp-1">
          {photoMeta.subtitle}
        </p>
      </div>

      {/* Hover action controls */}
      {showControls && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 transition-all duration-200 z-20 ${
            isHovered || isEditMode ? 'opacity-100 bg-slate-950/40 backdrop-blur-[2px]' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            {enableUpload && (
              <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-lg hover:bg-slate-50 transition-colors pointer-events-auto">
                <Upload className="h-3.5 w-3.5 text-blue-600" />
                <span>Upload {photoMeta.fileName}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {onOpenLightbox && (
              <button
                type="button"
                onClick={() => onOpenLightbox(photoKey)}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-slate-900/90 text-white border border-white/20 px-2.5 py-2 text-xs font-semibold shadow-lg hover:bg-slate-900 transition-colors pointer-events-auto"
                title="View full resolution"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Zoom</span>
              </button>
            )}

            {activeSrc && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-slate-800/90 text-slate-200 border border-white/20 px-2.5 py-2 text-xs font-semibold shadow-lg hover:bg-slate-700 transition-colors pointer-events-auto"
                title="Reset to default artwork"
              >
                <RefreshCw className="h-3 w-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-200 text-center font-medium max-w-[220px] drop-shadow-sm hidden sm:block">
            Supports direct PNG, JPEG, or drag-and-drop
          </p>
        </div>
      )}
    </div>
  );
};

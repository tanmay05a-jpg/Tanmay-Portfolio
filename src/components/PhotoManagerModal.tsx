import React, { useState } from 'react';
import { X, Upload, Check, RefreshCw, Sparkles, User, Film, Camera, Image as ImageIcon } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PORTFOLIO_PHOTOS } from '../data/photoAssets';
import { PhotoDisplay } from './PhotoDisplay';

interface PhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'executive' | 'onset' | 'chair';
}

export const PhotoManagerModal: React.FC<PhotoManagerModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'executive',
}) => {
  const { profile, updateProfile, showToast } = usePortfolio();
  const [selectedPhotoKey, setSelectedPhotoKey] = useState<'executive' | 'onset' | 'chair'>(initialTab);
  const [urlInput, setUrlInput] = useState('');

  if (!isOpen) return null;

  const currentMeta = PORTFOLIO_PHOTOS.find((p) => p.id === selectedPhotoKey) || PORTFOLIO_PHOTOS[0];

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    if (selectedPhotoKey === 'executive') {
      updateProfile({ avatarUrl: urlInput.trim() });
    } else if (selectedPhotoKey === 'onset') {
      updateProfile({ onsetPhotoUrl: urlInput.trim() });
    } else if (selectedPhotoKey === 'chair') {
      updateProfile({ chairPhotoUrl: urlInput.trim() });
    }
    setUrlInput('');
    showToast(`Updated ${currentMeta.title} URL`);
  };

  const handleSetAsHero = () => {
    updateProfile({ activeHeroPhoto: selectedPhotoKey });
    showToast(`${currentMeta.title} set as primary Hero photo`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Manage Portfolio Photos</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your photos (IMG_5592.PNG, On-Set Viewfinder, Director Chair) or use curated artwork.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Photo Selection Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-3 gap-2 overflow-x-auto">
          {PORTFOLIO_PHOTOS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPhotoKey(p.id)}
              className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                selectedPhotoKey === p.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.id === 'executive' && <User className="h-4 w-4" />}
              {p.id === 'onset' && <Film className="h-4 w-4" />}
              {p.id === 'chair' && <Camera className="h-4 w-4" />}
              <span>{p.title}</span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                {p.fileName}
              </span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50">
          {/* Left Column: Live Preview */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[280px]">
              <PhotoDisplay
                photoKey={selectedPhotoKey}
                aspectRatio="4/5"
                className="w-full shadow-md"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center w-full">
              <button
                type="button"
                onClick={handleSetAsHero}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                  profile.activeHeroPhoto === selectedPhotoKey
                    ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {profile.activeHeroPhoto === selectedPhotoKey ? (
                  <span className="inline-flex items-center gap-1">
                    <Check className="h-3 w-3 text-blue-600" />
                    Featured on Hero
                  </span>
                ) : (
                  'Set as Hero Profile Photo'
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Upload & Metadata Details */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="inline-block rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 uppercase tracking-wide">
                {currentMeta.tag}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{currentMeta.title}</h3>
              <p className="text-xs font-medium text-slate-600">{currentMeta.role}</p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{currentMeta.description}</p>
            </div>

            {/* Upload File Box */}
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2">
                <Upload className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-slate-800">
                Upload your file ({currentMeta.fileName})
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Select your photo from your computer. Saves directly in your browser.
              </p>

              <label className="mt-3 inline-flex items-center gap-1.5 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
                <Upload className="h-3.5 w-3.5" />
                <span>Choose {currentMeta.fileName}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const res = reader.result as string;
                      if (selectedPhotoKey === 'executive') updateProfile({ avatarUrl: res });
                      if (selectedPhotoKey === 'onset') updateProfile({ onsetPhotoUrl: res });
                      if (selectedPhotoKey === 'chair') updateProfile({ chairPhotoUrl: res });
                      showToast(`${file.name} uploaded successfully!`);
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Paste URL Option */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Or paste image web link / CDN URL:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/tanmay.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Save URL
                </button>
              </div>
            </div>

            {/* Key highlights / production context */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                Photo Context &amp; Production Details
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {currentMeta.highlights.map((hl, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Current Active Photo on Hero: <strong className="text-slate-800 capitalize">{profile.activeHeroPhoto || 'executive'}</strong>
          </span>

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

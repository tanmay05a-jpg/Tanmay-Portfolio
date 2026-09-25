import React, { useState, useRef } from 'react';
import { Target, Layers, Cpu, Shield, Globe2, ArrowRight, Edit3, Camera, Upload, Trash2, Maximize2, X, Link as LinkIcon, Phone, Mail, Calendar, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface AboutSectionProps {
  onOpenBooking: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenBooking }) => {
  const { profile, updateProfile, showToast, isEditMode, setIsEditingText, setTextEditTab, isAdminAuthenticated } = usePortfolio();
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process image file to base64 Data URL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (.png, .jpg, .jpeg, .webp)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image is larger than 10MB. Please select an image under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      updateProfile({ avatarUrl: result });
      showToast('Photo uploaded and updated successfully!');
    };
    reader.onerror = () => {
      showToast('Error reading image file. Please try another file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // reset input so same file can be re-selected if desired
    if (e.target) e.target.value = '';
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInputValue.trim()) return;
    updateProfile({ avatarUrl: urlInputValue.trim() });
    showToast('Photo URL saved successfully!');
    setShowUrlInput(false);
    setUrlInputValue('');
  };

  const handleRemovePhoto = () => {
    updateProfile({ avatarUrl: '' });
    showToast('Photo removed.');
  };

  return (
    <section id="about" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-10 border-b border-slate-200 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <span>Background &amp; Philosophy</span>
              <span aria-hidden="true">·</span>
              <span>18-Year Enterprise Track Record</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mt-2">
              Meet Tanmay Agrawal
            </h2>
          </div>

          {isAdminAuthenticated && (
            <div className="mt-4 sm:mt-0 flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                <Camera className="h-3.5 w-3.5 text-blue-600" />
                <span>{profile.avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {isEditMode && (
                <button
                  onClick={() => {
                    setTextEditTab('about');
                    setIsEditingText(true);
                  }}
                  className="inline-flex items-center gap-1 rounded bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Bio</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Clean Dedicated Photo Frame & Uploader */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 shadow-sm">
              {profile.avatarUrl ? (
                /* 1. Uploaded Photo State */
                <div className="relative group rounded-xl overflow-hidden shadow-md bg-slate-900 border border-slate-200 aspect-[4/5]">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm border border-white/10">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Profile Photo</span>
                    </span>
                  </div>

                  {/* Hover Action Overlay */}
                  <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-4 z-20">
                    {isAdminAuthenticated && (
                      <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-slate-900 hover:bg-slate-100 transition-colors shadow-md">
                        <Upload className="h-3.5 w-3.5 text-blue-600" />
                        <span>Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsZoomOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 text-white border border-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-slate-700 transition-colors shadow-md"
                        title="View photo full size"
                      >
                        <Maximize2 className="h-3 w-3" />
                        <span>Zoom</span>
                      </button>

                      {isAdminAuthenticated && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-900/80 text-rose-200 border border-rose-500/30 px-3 py-1.5 text-xs font-semibold hover:bg-rose-900 transition-colors shadow-md"
                          title="Remove uploaded photo"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : isAdminAuthenticated ? (
                /* 2. Upload Dropzone State when no photo attached (Admin only) */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`rounded-xl border-2 border-dashed transition-all p-6 sm:p-8 flex flex-col items-center justify-center text-center aspect-[4/5] bg-white ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-400/20'
                      : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-4 shadow-xs">
                    <Camera className="h-8 w-8" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    Upload Your Photo
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-[240px] leading-relaxed">
                    Attach your high-resolution portrait or headshot to personalize this section.
                  </p>

                  <div className="mt-5 flex flex-col gap-2 w-full max-w-[220px]">
                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-sm">
                      <Upload className="h-4 w-4" />
                      <span>Select Photo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-blue-600 py-1 transition-colors"
                    >
                      <LinkIcon className="h-3 w-3" />
                      <span>{showUrlInput ? 'Cancel URL' : 'Or paste image link'}</span>
                    </button>
                  </div>

                  {showUrlInput && (
                    <div className="mt-3 w-full max-w-[240px] flex items-center gap-1.5 animate-fadeIn">
                      <input
                        type="url"
                        value={urlInputValue}
                        onChange={(e) => setUrlInputValue(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyUrl}
                        className="rounded-lg bg-slate-900 text-white px-2.5 py-1.5 text-xs font-bold hover:bg-slate-800 shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-slate-200/70 text-[10px] text-slate-400 font-mono">
                    PNG · JPG · JPEG · WEBP (Max 10MB)
                  </div>
                </div>
              ) : (
                /* 2. Sleek Executive Presentation Frame for Visitors */
                <div className="rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col items-center justify-center text-center aspect-[4/5] bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-md">
                  <div className="h-20 w-20 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4 text-2xl font-black">
                    TA
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {profile.name}
                  </h3>
                  <div className="mt-1 text-xs text-blue-400 font-mono">
                    {profile.role}
                  </div>
                  <div className="mt-3 text-xs text-slate-400 max-w-[220px] leading-relaxed">
                    18 Years of Enterprise Leadership &amp; Commercial Direction
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Available for Consultations</span>
                  </div>
                </div>
              )}

              {/* Clean Caption & Contact Info */}
              <div className="mt-4 pt-3 border-t border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{profile.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      AI Product Consultant &amp; Enterprise Leader
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold shrink-0">
                    18 Yrs Experience
                  </span>
                </div>

                {/* Direct quick contact links */}
                <div className="pt-2 flex flex-col gap-1.5 text-xs border-t border-slate-100">
                  <a
                    href={`tel:${profile.mobile.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>Call / WhatsApp: <strong className="font-semibold">{profile.mobile}</strong></span>
                  </a>
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </a>
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors font-semibold"
                    >
                      <svg className="h-3.5 w-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 0 0-1.66 1.65 1.65 1.65 0 0 0 1.66 1.65 1.65 1.65 0 0 0 1.66-1.65c0-.91-.74-1.65-1.66-1.65Z" />
                      </svg>
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  {profile.location && (
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center gap-1.5">
                      <span>📍</span>
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Heading, Background Story, & 4 Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
              Enterprise Product Discipline, Built for Lean Teams
            </h3>

            {/* Exact prompt quote highlighted on clean white background */}
            <div className="border-l-3 border-slate-900 pl-4 py-1.5 bg-slate-50/50 rounded-r-lg">
              <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
                "{profile.aboutBio}"
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              In enterprise healthcare and high-consequence platform environments, software cannot afford hallucinations, fragile integrations, or vanity metrics. I bring that exact rigorous standard to every small business and startup engagement.
            </p>

            {/* 4 Strategic Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-2.5">
                  <Target className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">01. Objective First</h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  We clarify the underlying business bottleneck — lead flow, conversion rate, or manual hours — before touching any AI tool.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-2.5">
                  <Cpu className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">02. Pragmatic Stack</h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  No complex overkill architectures. We combine battle-tested no-code platforms with frontier LLM APIs for rapid, stable deployment.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-2.5">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">03. Systems You Own</h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Zero vendor captivity. You receive all prompt rubrics, workflow nodes, source assets, and video SOPs for autonomous operation.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-2.5">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">04. Risk &amp; Security</h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Enterprise-grade data handling principles ensure your proprietary customer documents and IP are never leaked or exposed to public training sets.
                </p>
              </div>
            </div>

            {/* Global collaboration card on white */}
            <div className="rounded-xl border border-slate-200 bg-white p-4.5 flex items-start gap-4 shadow-sm">
              <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Globe2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Seamless Collaboration Across Global Time Zones</h4>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Real-time calls during flexible international business windows, combined with concise asynchronous execution updates so projects move daily without scheduling friction.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span>Flexible Overlap Windows</span>
                  <span aria-hidden="true">·</span>
                  <span>Daily Asynchronous Updates</span>
                  <span aria-hidden="true">·</span>
                  <span>Direct Founder Slack/WhatsApp Access</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap group shadow-sm"
              >
                <span>{profile.primaryCTA || 'Book a free consultation'}</span>
                <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href={profile.calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                <span>Sync via Google Calendar</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full Resolution Photo */}
      {isZoomOpen && profile.avatarUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-2xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute -top-12 right-0 rounded-full bg-white/20 hover:bg-white/30 text-white p-2 transition-colors"
              aria-label="Close photo preview"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 max-h-[80vh] bg-black">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="max-h-[80vh] w-auto object-contain"
              />
            </div>
            <div className="mt-3 text-center text-white text-xs font-medium">
              <span>{profile.name} · Headshot</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


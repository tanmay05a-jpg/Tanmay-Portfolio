import React, { useState } from 'react';
import { X, Check, FileText, User, DollarSign, Mail, Download, Upload, Copy, RefreshCw } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const TextEditorModal: React.FC = () => {
  const {
    isEditingText,
    setIsEditingText,
    textEditTab,
    setTextEditTab,
    profile,
    updateProfile,
    services,
    updateService,
    pricing,
    updatePricingItem,
    resetToDefaults,
    exportToJson,
    importFromJson,
    showToast,
  } = usePortfolio();

  const [localProfile, setLocalProfile] = useState({ ...profile });
  const [localServices, setLocalServices] = useState([...services]);
  const [localPricing, setLocalPricing] = useState([...pricing]);
  const [jsonInput, setJsonInput] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isEditingText) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(localProfile);
    setIsEditingText(false);
  };

  const handleSaveServices = (e: React.FormEvent) => {
    e.preventDefault();
    localServices.forEach((s) => updateService(s));
    localPricing.forEach((p, idx) => updatePricingItem(idx, p));
    setIsEditingText(false);
  };

  const handleCopyJson = () => {
    const fullState = { profile, services, pricing };
    navigator.clipboard.writeText(JSON.stringify(fullState, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportJson = () => {
    if (!jsonInput.trim()) return;
    const res = importFromJson(jsonInput);
    if (res.success) {
      setIsEditingText(false);
    } else {
      alert(`Import error: ${res.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Edit Portfolio Content &amp; Copy
            </h2>
            <p className="text-xs text-slate-500">
              Update your headline, about bio, services, pricing, or manage backups.
            </p>
          </div>
          <button
            onClick={() => setIsEditingText(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 px-6 overflow-x-auto gap-1">
          <button
            type="button"
            onClick={() => setTextEditTab('hero')}
            className={`inline-flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              textEditTab === 'hero'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Hero &amp; Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setTextEditTab('about')}
            className={`inline-flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              textEditTab === 'about'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>About &amp; Bio</span>
          </button>

          <button
            type="button"
            onClick={() => setTextEditTab('services')}
            className={`inline-flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              textEditTab === 'services'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Services &amp; Offerings</span>
          </button>

          <button
            type="button"
            onClick={() => setTextEditTab('contact')}
            className={`inline-flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              textEditTab === 'contact'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Contact &amp; CTA</span>
          </button>

          <button
            type="button"
            onClick={() => setTextEditTab('json')}
            className={`inline-flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
              textEditTab === 'json'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Backup &amp; Export</span>
          </button>
        </div>

        {/* Tab 1: Hero & Profile */}
        {textEditTab === 'hero' && (
          <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={localProfile.name}
                  onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Professional Title / Role
                </label>
                <input
                  type="text"
                  value={localProfile.role}
                  onChange={(e) => setLocalProfile({ ...localProfile, role: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Main Hero Headline *
              </label>
              <textarea
                rows={2}
                value={localProfile.headline}
                onChange={(e) => setLocalProfile({ ...localProfile, headline: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-bold leading-snug"
              />
              <p className="text-[11px] text-slate-500 mt-1">Default: "I help businesses turn AI into results."</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Subheadline *
              </label>
              <textarea
                rows={3}
                value={localProfile.subheadline}
                onChange={(e) => setLocalProfile({ ...localProfile, subheadline: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-500 mt-1">18 years of enterprise product management applied to content, websites, ad campaigns, and automation.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Target Markets
                </label>
                <input
                  type="text"
                  value={localProfile.markets}
                  onChange={(e) => setLocalProfile({ ...localProfile, markets: e.target.value })}
                  placeholder="United States & United Kingdom"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Years of Enterprise Experience
                </label>
                <input
                  type="number"
                  value={localProfile.experienceYears}
                  onChange={(e) => setLocalProfile({ ...localProfile, experienceYears: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditingText(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: About Me & Bio */}
        {textEditTab === 'about' && (
          <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                About Me Bio (Exact consultation story) *
              </label>
              <textarea
                rows={8}
                value={localProfile.aboutBio}
                onChange={(e) => setLocalProfile({ ...localProfile, aboutBio: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Reflects your 18-year track record at the intersection of AI, healthcare, and enterprise platforms, bringing product discipline to freelance work.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditingText(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                <span>Save Bio Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Services & Offerings */}
        {textEditTab === 'services' && (
          <form onSubmit={handleSaveServices} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Edit 5 Core Offerings &amp; Timelines
              </div>

              {localServices.map((svc, idx) => (
                <div key={svc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">
                      {svc.number}. {svc.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">ID: {svc.id}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Turnaround Timeline
                      </label>
                      <input
                        type="text"
                        value={svc.timeline}
                        onChange={(e) => {
                          const updated = [...localServices];
                          updated[idx] = { ...updated[idx], timeline: e.target.value };
                          setLocalServices(updated);
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Target Audience / Ideal For
                      </label>
                      <input
                        type="text"
                        value={svc.idealFor}
                        onChange={(e) => {
                          const updated = [...localServices];
                          updated[idx] = { ...updated[idx], idealFor: e.target.value };
                          setLocalServices(updated);
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      value={svc.shortDesc}
                      onChange={(e) => {
                        const updated = [...localServices];
                        updated[idx] = { ...updated[idx], shortDesc: e.target.value };
                        setLocalServices(updated);
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditingText(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                <span>Save Services &amp; Offerings</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Contact & CTA */}
        {textEditTab === 'contact' && (
          <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Direct Contact Email *
                </label>
                <input
                  type="email"
                  value={localProfile.email}
                  onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Consultation invites and contact inquiries sync here.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="text"
                  value={localProfile.mobile || '+91-9963557573'}
                  onChange={(e) => setLocalProfile({ ...localProfile, mobile: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Displayed with direct click-to-call and WhatsApp chat links.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={localProfile.linkedinUrl || ''}
                  onChange={(e) => setLocalProfile({ ...localProfile, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/tanmayagrawal"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Adds a verified LinkedIn button to your header, contact section, and footer.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Location / Base
                </label>
                <input
                  type="text"
                  value={localProfile.location || ''}
                  onChange={(e) => setLocalProfile({ ...localProfile, location: e.target.value })}
                  placeholder="e.g. Bangalore, India (Remote / Global Clients)"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Displayed alongside your global timezone support.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Google Calendar Direct Booking URL
              </label>
              <input
                type="url"
                value={localProfile.calendarUrl || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, calendarUrl: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Primary Call-To-Action Button Label
              </label>
              <input
                type="text"
                value={localProfile.primaryCTA}
                onChange={(e) => setLocalProfile({ ...localProfile, primaryCTA: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Standardized across Hero, Services, Pricing, and Footer. Default: "Book a free consultation".
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditingText(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                <span>Save Contact Details</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 5: JSON Import & Export */}
        {textEditTab === 'json' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
              <div className="font-bold text-slate-900 text-xs">
                Export &amp; Backup Your Work
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Download a JSON backup of your current portfolio, including all custom projects, edited copy, and pricing.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={exportToJson}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Backup JSON File</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="font-bold text-slate-900 text-xs">
                Import Portfolio JSON
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Paste JSON data below to restore or transfer your portfolio content.
              </p>
              <textarea
                rows={6}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='Paste {"profile": {...}, "projects": [...]} here...'
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 font-mono focus:border-blue-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleImportJson}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Import &amp; Apply JSON</span>
              </button>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-2">
              <div className="font-bold text-amber-900 text-xs">
                Reset to Original Defaults
              </div>
              <p className="text-amber-800 text-xs">
                Revert all customizations back to the initial sample projects and default enterprise brief text.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all portfolio content back to the default sample engagements? This cannot be undone unless you have a backup.')) {
                    resetToDefaults();
                    setIsEditingText(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset to Sample Defaults</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

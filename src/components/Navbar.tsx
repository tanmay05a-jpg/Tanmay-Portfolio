import React, { useState } from 'react';
import { Menu, X, Edit3, Phone, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile, isEditMode, setIsEditMode } = usePortfolio();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark with photo avatar */}
        <div className="flex items-center gap-3">
          <a
            href="#about"
            className="relative h-9 w-9 rounded-full overflow-hidden border border-slate-300 shadow-sm shrink-0 bg-slate-100 hover:ring-2 hover:ring-blue-500 transition-all"
            title="View Tanmay's profile & photos"
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-slate-900 text-white font-bold text-xs">
                TA
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
          </a>

          <a
            href="#"
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 transition-colors hover:text-slate-700"
          >
            {profile.name}
          </a>
          <a
            href={`tel:${profile.mobile.replace(/[^0-9+]/g, '')}`}
            className="hidden lg:inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-900 border-l border-slate-200 pl-3"
            title="Call Tanmay directly"
          >
            <Phone className="h-3 w-3 text-emerald-600" />
            <span>{profile.mobile}</span>
          </a>
          {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 border-l border-slate-200 pl-3 font-medium"
              title="Tanmay Agrawal on LinkedIn"
            >
              <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 0 0-1.66 1.65 1.65 1.65 0 0 0 1.66 1.65 1.66 1.65 0 0 0 1.66-1.65c0-.91-.74-1.65-1.66-1.65Z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          )}
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <a href="#services" className="transition-colors hover:text-slate-950">
            Services
          </a>
          <a href="#portfolio" className="transition-colors hover:text-slate-950">
            Portfolio &amp; Videos
          </a>
          <a href="#about" className="transition-colors hover:text-slate-950">
            About
          </a>
          <a href="#faq" className="transition-colors hover:text-slate-950">
            FAQ
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsEditMode((prev) => !prev)}
            className={`hidden sm:inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              isEditMode
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
            title="Toggle Live Portfolio Edit Mode"
          >
            <Edit3 className="h-3 w-3" />
            <span>{isEditMode ? 'Editing Mode' : 'Edit Portfolio'}</span>
          </button>

          <button
            onClick={() => onOpenBooking()}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 whitespace-nowrap shadow-sm"
          >
            {profile.primaryCTA || 'Book a free consultation'}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 md:hidden focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col space-y-3">
            <a
              href={`tel:${profile.mobile.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 text-xs font-semibold text-slate-900 border border-slate-200"
            >
              <Phone className="h-3.5 w-3.5 text-emerald-600" />
              <span>Call / WhatsApp: {profile.mobile}</span>
            </a>

            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 text-xs font-semibold text-blue-700 border border-blue-200"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 0 0-1.66 1.65 1.65 1.65 0 0 0 1.66 1.65 1.65 1.65 0 0 0 1.66-1.65c0-.91-.74-1.65-1.66-1.65Z" />
                </svg>
                <span>Connect on LinkedIn</span>
              </a>
            )}

            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-700 hover:text-slate-950"
            >
              Services
            </a>
            <a
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-700 hover:text-slate-950"
            >
              Portfolio &amp; Commercial Videos
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-700 hover:text-slate-950"
            >
              About
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-700 hover:text-slate-950"
            >
              FAQ
            </a>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditMode((prev) => !prev);
                  setMobileMenuOpen(false);
                }}
                className={`w-full rounded-lg px-4 py-2 text-center text-xs font-semibold border ${
                  isEditMode
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                {isEditMode ? 'Exit Edit Mode' : '✎ Enable Edit Mode'}
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-center text-xs font-semibold text-white hover:bg-slate-800"
              >
                {profile.primaryCTA || 'Book a free consultation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

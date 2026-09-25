import React from 'react';
import { ArrowRight, Mail, Phone, Calendar, MessageSquare } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface FooterProps {
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  const { profile } = usePortfolio();

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200">
      {/* Footer CTA Banner on crisp light container */}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Ready to turn AI &amp; Commercials into results?
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
              Book a no-obligation 30-minute discovery call to evaluate your opportunities, prioritize high-ROI initiatives, and plan commercial execution.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-blue-600" />
                <span>{profile.mobile}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-emerald-600" />
                <span>{profile.email}</span>
              </span>
            </div>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-500 whitespace-nowrap group"
            >
              <span>{profile.primaryCTA || 'Book a free consultation'}</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href={profile.calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
              <span>Google Calendar</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Credentials */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-6 space-y-3">
            <div className="text-base font-bold text-slate-900 tracking-tight">
              {profile.name}
            </div>
            <p className="text-xs text-slate-600 max-w-md leading-relaxed font-normal">
              Independent AI Freelancer, Product Consultant &amp; Commercial Director. {profile.experienceYears} years of enterprise product management experience applied to commercial videos, websites, ad campaigns, and automated workflows for {profile.markets} businesses.
            </p>
            {profile.location && (
              <p className="text-[11px] text-slate-500 font-medium">
                📍 {profile.location}
              </p>
            )}
            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <a
                href={`tel:${profile.mobile.replace(/[^0-9+]/g, '')}`}
                className="hover:text-slate-900 transition-colors font-mono flex items-center gap-1.5"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                <span>{profile.mobile}</span>
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="hover:text-slate-900 transition-colors font-medium flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{profile.email}</span>
              </a>
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors font-medium flex items-center gap-1.5 text-blue-700"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 0 0-1.66 1.65 1.65 1.65 0 0 0 1.66 1.65 1.65 1.65 0 0 0 1.66-1.65c0-.91-.74-1.65-1.66-1.65Z" />
                  </svg>
                  <span>LinkedIn Profile</span>
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Core Offerings
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <a href="#services" className="hover:text-slate-900 transition-colors">
                  Commercial Video &amp; Ad Creative
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-slate-900 transition-colors">
                  AI Product Strategy Consulting
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-slate-900 transition-colors">
                  AI Workflow / Automation Builder
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-slate-900 transition-colors">
                  Content Generation
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-slate-900 transition-colors">
                  Website Creation (5-Day Launch)
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Navigation &amp; Proof
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <a href="#portfolio" className="hover:text-slate-900 transition-colors">
                  5 Commercial Video Campaigns
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-slate-900 transition-colors">
                  About &amp; 18-Year Background
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-slate-900 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-slate-900 transition-colors">
                  Direct Contact &amp; WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & unboxed regional metadata */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Direct: {profile.mobile}</span>
            <span aria-hidden="true">·</span>
            <span>Markets: {profile.markets}</span>
            <span aria-hidden="true">·</span>
            <span>Enterprise Discipline × Film Direction</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

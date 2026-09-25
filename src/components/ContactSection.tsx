import React, { useState } from 'react';
import { Mail, Check, Copy, Calendar, Clock, Globe2, Send, CheckCircle2, Phone, MessageSquare } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface ContactSectionProps {
  onOpenBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenBooking }) => {
  const { profile } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: 'Commercial Video & Ad Creative',
    timeline: 'Within 2 weeks',
    message: '',
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(profile.mobile);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Contact & Booking Callout */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <span>Direct Consultation &amp; Execution</span>
              <span aria-hidden="true">·</span>
              <span>{profile.markets}</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
              Let's Turn Your Vision &amp; Commercials Into Measurable Results
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Whether you need high-retention commercial video ads, an enterprise AI strategy roadmap, a production workflow build, or an end-to-end 5-day website launch, I provide direct senior execution with zero junior-staff delegation.
            </p>

            {/* Direct Calendar Booking Trigger Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Direct Google Calendar Booking</h3>
                  <p className="text-xs text-slate-500">Syncs directly to {profile.email}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3 text-xs text-slate-600">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <span>30 minutes · Strategic roadmap discovery</span>
              </div>

              <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
                <Globe2 className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Optimized for EST, PST, and GMT business hours</span>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={onOpenBooking}
                  className="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-500 whitespace-nowrap"
                >
                  {profile.primaryCTA || 'Book a free consultation'}
                </button>
                <a
                  href={profile.calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                >
                  Open in Google Calendar
                </a>
              </div>
            </div>

            {/* Direct Phone & WhatsApp Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Direct Phone &amp; WhatsApp</div>
                  <a
                    href={`tel:${profile.mobile.replace(/[^0-9+]/g, '')}`}
                    className="text-xs font-semibold text-slate-900 hover:text-emerald-700 truncate block font-mono"
                  >
                    {profile.mobile}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`https://wa.me/${profile.mobile.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-50 transition-colors"
                  title="Chat on WhatsApp"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={handleCopyPhone}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Copy phone number"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Email Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Direct Inbox</div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-xs font-semibold text-slate-900 hover:text-blue-600 truncate block"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 shrink-0 transition-colors"
                aria-label="Copy email address"
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct LinkedIn Card (when available) */}
            {profile.linkedinUrl && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 0 0-1.66 1.65 1.65 1.65 0 0 0 1.66 1.65 1.66 1.65 0 0 0 1.66-1.65c0-.91-.74-1.65-1.66-1.65Z" />
                    </svg>
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] text-blue-700 uppercase tracking-wider font-semibold">LinkedIn Profile</div>
                    <span className="text-xs font-semibold text-slate-900 truncate block">
                      Connect on LinkedIn
                    </span>
                  </div>
                </div>

                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 shrink-0 transition-colors shadow-xs"
                >
                  <span>View Profile</span>
                </a>
              </div>
            )}
          </div>

          {/* Right Column: In-page Consultation Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Send a Project Brief or Video Concept
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  I personally review every inquiry and respond within 24 hours.
                </p>
              </div>

              {formSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Inquiry Received</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name}. I have received your notes regarding {formData.serviceInterest} and will reach out to <span className="font-semibold text-slate-900">{formData.email}</span> within 24 business hours.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                    >
                      Send another message
                    </button>
                    <a
                      href={profile.calendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      Add Direct to Google Calendar
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Company or Website
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="company.com"
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000 or +44..."
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Service Interest
                    </label>
                    <select
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                    >
                      <option>Commercial Video &amp; Ad Creative</option>
                      <option>AI Product Strategy Consulting</option>
                      <option>AI Workflow / Automation Builder</option>
                      <option>Content Generation Engine</option>
                      <option>Website Creation (5 Days)</option>
                      <option>Full Suite / Multiple Offerings</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Project Timeline
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Immediately', 'Within 2 weeks', 'Exploring for Q3/Q4'].map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setFormData({ ...formData, timeline: t })}
                          className={`py-2 px-3 text-[11px] rounded-lg border text-center transition-all ${
                            formData.timeline === t
                              ? 'border-slate-900 bg-slate-900 text-white font-medium'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Brief Description of Business Goal, Video Concept or Bottleneck
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share a sentence or two about what you're trying to solve (e.g. video commercial for ad campaigns, customer support triage, or rapid web launch)..."
                      className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap shadow-sm"
                    >
                      <Send className="mr-2 h-3.5 w-3.5" />
                      <span>Submit Project Inquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

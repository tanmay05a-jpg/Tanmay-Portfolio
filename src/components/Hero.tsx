import React, { useState } from 'react';
import {
  ArrowRight,
  Clock,
  Edit3,
  Phone,
  Mail,
  Layers,
  CheckCircle2,
  Sparkles,
  Calendar,
  Compass,
  Cpu,
  FileText,
  Globe,
  Megaphone,
  Briefcase,
  Check,
  Tag,
  ShieldCheck,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ContainerScroll } from './ui/container-scroll-animation';
import { ServiceItem } from '../data/portfolioData';

interface HeroProps {
  onOpenBooking: (serviceId?: string) => void;
}

const OFFERING_EXTRAS: Record<
  string,
  {
    category: string;
    outcome: string;
    badge: string;
    guarantee: string;
  }
> = {
  'ai-strategy': {
    category: 'Executive Strategy & Roadmaps',
    outcome: 'Eliminate wasted AI SaaS spend; walk away with a validated 90-day technical roadmap & vendor ROI scoring.',
    badge: 'Fixed 2-Hour Sprint',
    guarantee: 'Senior Ex-Enterprise Health Tech AI Product Manager direct evaluation. 0% AI hype.',
  },
  'ai-automation': {
    category: 'Enterprise Workflow Systems',
    outcome: 'Reclaim 15–20 hours weekly per team member with human-in-the-loop exception handling and zero data leaks.',
    badge: 'Production Build',
    guarantee: 'Live production delivery in Make / Zapier / Webhooks with complete Loom SOP documentation.',
  },
  'content-generation': {
    category: 'Inbound Authority & Thought Leadership',
    outcome: 'Establish consistent C-suite industry presence on LinkedIn & organic Google search without agency bloat.',
    badge: 'Monthly Sprint',
    guarantee: 'Authentic founder voice calibration with bespoke prompt systems your team permanently owns.',
  },
  'website-creation': {
    category: 'High-Converting Web Architecture',
    outcome: 'Launch a lightning-fast, high-trust 5-page digital headquarters synced to your calendar in exactly 5 days.',
    badge: '5-Day Complete Launch',
    guarantee: 'Mobile-responsive, SEO-grounded, zero ongoing developer dependency or technical debt.',
  },
  'ad-creative': {
    category: 'Performance Ads & Commercial Direction',
    outcome: 'Achieve 3.8x above-benchmark watch retention with behavioral psychology hooks & cinematic storyboards.',
    badge: 'Concept & Copy Sprint',
    guarantee: 'Angle-diverse copy testing matrices & cinematic storyboards engineered for immediate trust.',
  },
};

const getOfferingIcon = (id: string) => {
  switch (id) {
    case 'ai-strategy':
      return <Compass className="h-4 w-4 text-blue-600" />;
    case 'ai-automation':
      return <Cpu className="h-4 w-4 text-emerald-600" />;
    case 'content-generation':
      return <FileText className="h-4 w-4 text-purple-600" />;
    case 'website-creation':
      return <Globe className="h-4 w-4 text-amber-600" />;
    case 'ad-creative':
      return <Megaphone className="h-4 w-4 text-rose-600" />;
    default:
      return <Briefcase className="h-4 w-4 text-blue-600" />;
  }
};

const renderFormattedHeadline = (text: string) => {
  // Strip any legacy 'US & UK' from the text
  const cleaned = text.replace(/US\s*&\s*UK\s*/gi, '').trim();

  // Pattern matching "I help businesses turn AI into results" or variants
  const match = cleaned.match(/^(I\s+help\s+businesses)\s+(turn\s+AI\s+into\s+results\.?)$/i);
  if (match) {
    let punchline = match[2];
    if (!punchline.endsWith('.')) punchline += '.';
    return (
      <span className="block">
        <span className="block text-slate-900 font-black tracking-tight">
          I help businesses
        </span>
        <span className="inline-block mt-1 sm:mt-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent font-black tracking-tight">
          {punchline}
        </span>
      </span>
    );
  }

  // If text contains "turn AI into results" anywhere
  if (/turn\s+AI\s+into\s+results/i.test(cleaned)) {
    const parts = cleaned.split(/(turn\s+AI\s+into\s+results\.?)/i);
    return (
      <span className="block">
        {parts.map((part, i) =>
          /turn\s+AI\s+into\s+results/i.test(part) ? (
            <span
              key={i}
              className="inline-block bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent font-black"
            >
              {part}
            </span>
          ) : (
            <span key={i} className="text-slate-900 font-black">{part}</span>
          )
        )}
      </span>
    );
  }

  return <span>{cleaned}</span>;
};

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const { profile, updateProfile, isEditMode, setIsEditingText, setTextEditTab, services, showToast } =
    usePortfolio();

  const [selectedServiceIdx, setSelectedServiceIdx] = useState(0);
  const [cardTab, setCardTab] = useState<'offerings' | 'matrix' | 'sla'>('offerings');

  const selectedService: ServiceItem = services[selectedServiceIdx] || services[0];
  const selectedExtra = OFFERING_EXTRAS[selectedService?.id] || {
    category: 'Enterprise AI Offering',
    outcome: 'Direct execution delivering measurable business KPIs and documented standard operating procedures.',
    badge: 'Sprint Delivery',
    guarantee: '18 years enterprise product management discipline applied directly to your project.',
  };

  return (
    <section className="relative overflow-hidden bg-white text-slate-900 border-b border-slate-200">
      {/* Architectural subtle grid pattern on white */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        {/* Top Headline & Executive Profile Presentation */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Headlines & Action */}
          <div className="lg:col-span-7 xl:col-span-7">
            {/* Clean unboxed kicker */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <span>{profile.role.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span>COMMERCIAL FILM DIRECTOR</span>
              <span aria-hidden="true">·</span>
              <span>18 YEARS ENTERPRISE PM</span>

              {isEditMode && (
                <button
                  onClick={() => {
                    setTextEditTab('hero');
                    setIsEditingText(true);
                  }}
                  className="ml-2 inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-100"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Edit Hero Text</span>
                </button>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight text-slate-900 leading-[1.14]">
              {renderFormattedHeadline(profile.headline)}
            </h1>

            <p className="mt-6 text-lg text-slate-600 sm:text-xl leading-relaxed max-w-2xl font-normal">
              {profile.subheadline}
            </p>

            {/* Direct contact & phone strip */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-medium text-slate-700">
              <a
                href={`tel:${profile.mobile.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-blue-600" />
                <span>
                  Call / WhatsApp: <strong className="font-semibold">{profile.mobile}</strong>
                </span>
              </a>

              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-emerald-600" />
                <span>{profile.email}</span>
              </a>

              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 transition-colors font-semibold"
                  title="Connect with Tanmay Agrawal on LinkedIn"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 0 0-1.66 1.65 1.65 1.65 0 0 0 1.66 1.65 1.65 1.65 0 0 0 1.66-1.65c0-.91-.74-1.65-1.66-1.65Z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              )}

              {profile.location && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs border border-slate-200">
                  <span>📍</span>
                  <span>{profile.location}</span>
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <button
                onClick={() => onOpenBooking()}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 whitespace-nowrap group"
              >
                <span>{profile.primaryCTA || 'Book a free consultation'}</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap shadow-sm"
              >
                View 5 Service Offerings
              </a>

              <a
                href="#portfolio"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap shadow-sm"
              >
                Case Studies &amp; Works
              </a>
            </div>
          </div>

          {/* Right Column: Executive Engagement Overview Card (Clean Text & Metrics, Zero Photos) */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50/90 to-white p-6 sm:p-7 shadow-sm relative overflow-hidden backdrop-blur-sm">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Executive Engagement Highlights</h3>
                    <p className="text-[11px] text-slate-500">Disciplined Execution · Principal Consultant</p>
                  </div>
                </div>
                <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                  Direct Partner
                </span>
              </div>

              {/* Key Quantitative Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] text-slate-500 font-medium">Enterprise Track Record</div>
                  <div className="mt-1 text-lg font-extrabold text-slate-900 font-mono">18+ Years</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Healthcare &amp; Regulated AI</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] text-slate-500 font-medium">Sprint Turnaround</div>
                  <div className="mt-1 text-lg font-extrabold text-slate-900 font-mono">3–5 Days</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Rapid Working Prototypes</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] text-slate-500 font-medium">Execution Sprints</div>
                  <div className="mt-1 text-base font-bold text-slate-900 font-mono">5 Offerings</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Strategy to Production</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] text-slate-500 font-medium">Client Ownership</div>
                  <div className="mt-1 text-base font-bold text-slate-900">100% IP &amp; SOPs</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Zero Retainer Lock-in</div>
                </div>
              </div>

              {/* Core Execution Highlights */}
              <div className="space-y-3 text-xs text-slate-600 mb-6">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800">Commercial Video Ads:</strong> High-concept screenplays, soundstage direction, and high-conversion assets.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800">AI Automation &amp; Workflows:</strong> Autonomous agent tooling, operational pipelines, and LLM systems.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800">High-Converting Websites:</strong> Full-stack, responsive sites built and deployed in 5-day sprints.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-800">Direct Senior Delivery:</strong> Hands-on technical leadership with zero agency delegation.
                  </span>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Accepting selective engagements</span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenBooking()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Schedule 30-Min Call</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3D ContainerScroll Animation Component from Aceternity UI */}
        <div className="mt-8">
          <ContainerScroll
            titleComponent={
              <div className="space-y-3 pb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>Executive Offerings &amp; Service Deliverables</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
                  Commercial Video Direction Meets <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900 bg-clip-text text-transparent">
                    18 Years of Enterprise Execution
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal">
                  Explore complete offering details, turnaround timelines, sprint deliverables, and execution frameworks built for founders and product teams.
                </p>
              </div>
            }
          >
            {/* Interior of the 3D Perspective Card - Text Only Offering Details */}
            <div className="h-full w-full flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 shadow-inner">
              {/* Card Window Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-amber-400 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400 inline-block" />
                  <span className="ml-2 font-mono text-[11px] text-slate-500 hidden sm:inline">
                    tanmay-agrawal.portfolio // core_service_offerings_matrix
                  </span>
                </div>

                {/* Card Interior Tab Switcher - Strictly Text-First Offering Views */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setCardTab('offerings')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
                      cardTab === 'offerings'
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="h-3 w-3" />
                    <span>5 Core Offerings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCardTab('matrix')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
                      cardTab === 'matrix'
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Briefcase className="h-3 w-3" />
                    <span>Comparison Matrix</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCardTab('sla')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors hidden sm:inline-flex ${
                      cardTab === 'sla'
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    <span>Enterprise SLA</span>
                  </button>
                </div>
              </div>

              {/* View 1: Interactive 5 Core Offerings Deep Dive (Text Only) */}
              {cardTab === 'offerings' && (
                <div className="flex-1 p-3 sm:p-5 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5 bg-slate-50/50">
                  {/* Left Column: Offering Selector List */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                            Select Offering to Inspect
                          </span>
                          <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-[10px] font-mono font-bold">
                            5 Sprints
                          </span>
                        </div>
                        {isEditMode && (
                          <button
                            onClick={() => {
                              setTextEditTab('services');
                              setIsEditingText(true);
                            }}
                            className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {services.map((service, idx) => {
                          const isSelected = selectedServiceIdx === idx;
                          const extra = OFFERING_EXTRAS[service.id];
                          return (
                            <div
                              key={service.id}
                              onClick={() => setSelectedServiceIdx(idx)}
                              className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer text-left ${
                                isSelected
                                  ? 'border-blue-600 bg-white shadow-sm ring-1 ring-blue-500'
                                  : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span
                                    className={`h-6 w-6 rounded-md flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                                      isSelected
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {service.number}
                                  </span>
                                  <div className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                                    {getOfferingIcon(service.id)}
                                  </div>
                                  <h3
                                    className={`text-xs font-bold truncate ${
                                      isSelected ? 'text-blue-900' : 'text-slate-900'
                                    }`}
                                  >
                                    {service.title}
                                  </h3>
                                </div>
                                <span className="font-mono text-[10px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0">
                                  {extra?.badge || 'Fixed Scope'}
                                </span>
                              </div>

                              <p className="mt-1 text-[11px] text-slate-600 line-clamp-1 leading-normal pl-8.5">
                                {service.shortDesc}
                              </p>

                              <div className="mt-1.5 flex items-center justify-between text-[10px] pl-8.5">
                                <span className="inline-flex items-center gap-1 font-mono text-slate-500">
                                  <Clock className="h-3 w-3 text-slate-400" />
                                  <span>{service.timeline}</span>
                                  <span className="text-slate-300">·</span>
                                  <span className="font-semibold text-slate-700">{service.startingPrice}</span>
                                </span>
                                {isSelected ? (
                                  <span className="font-mono font-bold text-blue-600 uppercase tracking-wider text-[9px] flex items-center gap-1">
                                    <span>Inspecting</span>
                                    <ChevronRight className="h-3 w-3" />
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-mono text-[9px] hover:text-blue-600 flex items-center gap-0.5">
                                    <span>View</span>
                                    <ChevronRight className="h-2.5 w-2.5" />
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <button
                        onClick={() => onOpenBooking(selectedService.id)}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-sm flex items-center justify-center gap-2 group"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Book Strategy Call for {selectedService.title}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: In-Depth Text Offering Specification */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm overflow-y-auto">
                    <div className="space-y-4">
                      {/* Top Meta Strip */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wider">
                            {selectedExtra.category}
                          </span>
                          <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-mono text-slate-700">
                            Sprint {selectedService.number}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <strong>{selectedService.timeline}</strong>
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {selectedExtra.badge}
                          </span>
                        </div>
                      </div>

                      {/* Main Offering Heading & Overview */}
                      <div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                          <span>{selectedService.title}</span>
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          {selectedService.shortDesc}
                        </p>
                      </div>

                      {/* Measurable Enterprise Outcome Box */}
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-[11px] uppercase tracking-wider font-mono mb-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Guaranteed Business Outcome</span>
                        </div>
                        <p className="text-emerald-950 font-medium leading-relaxed">
                          {selectedExtra.outcome}
                        </p>
                      </div>

                      {/* Comprehensive Deliverables Checklist */}
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-2 flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-blue-600" />
                          <span>Direct Included Deliverables</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                          {selectedService.deliverables.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100"
                            >
                              <Check className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                              <span className="text-[11px] leading-snug">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ideal Client Profile & Execution Guarantee */}
                      <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
                        <div className="text-[11px] text-slate-600">
                          <strong className="text-slate-900 font-semibold">Ideal For: </strong>
                          <span>{selectedService.idealFor}</span>
                        </div>

                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>
                            <strong>Enterprise Guarantee: </strong>
                            {selectedExtra.guarantee}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer for this Offering */}
                    <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-500 font-mono">
                        Delivery Mode: <span className="font-semibold text-slate-700">Sprint Delivery · Full SOP Handoff</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => onOpenBooking(selectedService.id)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm"
                        >
                          <span>Inquire About {selectedService.title.split(' ')[0]}</span>
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Full Offerings Comparison Matrix */}
              {cardTab === 'matrix' && (
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Tanmay Agrawal — Complete Service Offerings Matrix
                      </h3>
                      <p className="text-xs text-slate-500">
                        Five battle-tested execution sprints. Fixed deliverables, documented timelines, and direct founder access.
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenBooking()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Book Free Consultation</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((srv, idx) => {
                      const extra = OFFERING_EXTRAS[srv.id];
                      return (
                        <div
                          key={srv.id}
                          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between hover:border-blue-400 transition-colors"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                Sprint {srv.number}
                              </span>
                              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                {srv.timeline}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 leading-snug">
                              {srv.title}
                            </h4>

                            <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {srv.shortDesc}
                            </p>

                            <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2.5">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                                Included Deliverables:
                              </div>
                              {srv.deliverables.slice(0, 3).map((d, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                                  <Check className="h-3 w-3 text-emerald-600 mt-0.5 shrink-0" />
                                  <span className="line-clamp-1">{d}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-500 font-mono">
                              ⏳ {srv.timeline}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedServiceIdx(idx);
                                setCardTab('offerings');
                              }}
                              className="font-semibold text-blue-600 hover:text-blue-800 text-[11px] inline-flex items-center gap-0.5"
                            >
                              <span>View Specs</span>
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View 3: 18-Year Enterprise SLA & Execution Standards */}
              {cardTab === 'sla' && (
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        18-Year Enterprise Delivery Methodology
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        How 18 years in mission-critical healthcare AI platforms is applied directly to founder execution:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs mb-3 font-mono">
                          01
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">Strategic Alignment &amp; ROI</h4>
                        <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                          We dissect the business bottleneck first. No speculative AI solutions; every feature must map directly to saved hours or generated revenue.
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs mb-3 font-mono">
                          02
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">Zero-Hallucination Engineering</h4>
                        <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                          Built with rigorous validation frameworks and human-in-the-loop safeguards. Your customer data remains private and GDPR/HIPAA-compliant.
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs mb-3 font-mono">
                          03
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">100% Client IP &amp; SOP Handoff</h4>
                        <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                          No agency retainers or proprietary locks. Every project includes comprehensive Loom walkthroughs, runbooks, and full code ownership.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Global Remote Availability</div>
                        <div className="text-[11px] text-slate-500">
                          Direct live collaboration with flexible scheduling across international business hours.
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenBooking()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 whitespace-nowrap shadow-sm"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Schedule 30-Min Strategy Call</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ContainerScroll>
        </div>
      </div>
    </section>
  );
};

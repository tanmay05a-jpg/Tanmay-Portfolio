import React from 'react';
import { ArrowRight, Check, Compass, Cpu, FileText, Globe, Megaphone, Edit3 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ServiceItem } from '../data/portfolioData';

interface ServicesSectionProps {
  onOpenBooking: (serviceId?: string) => void;
}

const getServiceIcon = (id: string) => {
  switch (id) {
    case 'ai-strategy':
      return <Compass className="h-5 w-5 text-slate-800" />;
    case 'ai-automation':
      return <Cpu className="h-5 w-5 text-slate-800" />;
    case 'content-generation':
      return <FileText className="h-5 w-5 text-slate-800" />;
    case 'website-creation':
      return <Globe className="h-5 w-5 text-slate-800" />;
    case 'ad-creative':
      return <Megaphone className="h-5 w-5 text-slate-800" />;
    default:
      return <Compass className="h-5 w-5 text-slate-800" />;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenBooking }) => {
  const { services, profile, isEditMode, setIsEditingText, setTextEditTab } = usePortfolio();

  return (
    <section id="services" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <span>Capabilities &amp; Solutions</span>
              <span aria-hidden="true">·</span>
              <span>Execution First</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
              Five Focused AI Offerings for High-Growth Founders
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed font-normal">
              Every engagement delivers working systems, documented processes, and measurable business outcomes. No theoretical slide decks, no ongoing agency dependency.
            </p>
          </div>

          {isEditMode && (
            <button
              onClick={() => {
                setTextEditTab('services');
                setIsEditingText(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 self-start md:self-auto"
            >
              <Edit3 className="h-3.5 w-3.5 text-blue-600" />
              <span>Edit Services</span>
            </button>
          )}
        </div>

        {/* 5 Offerings Grid in strict order */}
        <div className="mt-14 space-y-6">
          {services.map((service: ServiceItem) => (
            <div
              key={service.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 transition-shadow hover:shadow-md"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Column 1: Number, Title, Overview */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold font-mono text-slate-400">
                      {service.number}
                    </span>
                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      {getServiceIcon(service.id)}
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      Turnaround: {service.timeline}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-slate-900">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  <div className="pt-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Ideal for: </span>
                    {service.idealFor}
                  </div>
                </div>

                {/* Column 2: Specific Deliverables */}
                <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-8">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    What You Receive
                  </div>
                  <ul className="space-y-2.5">
                    {service.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                        <Check className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: Engagement Format & Primary CTA */}
                <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-8 flex flex-col justify-between h-full">
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                      Engagement Format
                    </div>
                    <div className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                      Fixed Sprint Scope
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Direct founder execution · Full SOP handoff
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => onOpenBooking(service.id)}
                      className="w-full inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap group shadow-sm"
                    >
                      <span>{profile.primaryCTA || 'Book a free consultation'}</span>
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                    <p className="mt-2 text-center text-[11px] text-slate-400">
                      Scope confirmed on 30-min discovery call
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Repetition of Primary CTA banner on light background */}
        <div className="mt-12 rounded-2xl bg-slate-50 border border-slate-200 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="max-w-xl">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Not sure which AI initiative will yield the highest return?
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
              In a free 30-minute consultation, we map your current operational pain points against the 5 offerings to give you an objective recommendation.
            </p>
          </div>
          <button
            onClick={() => onOpenBooking()}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3.5 text-xs font-bold text-white transition-colors hover:bg-slate-800 whitespace-nowrap shadow-sm shrink-0"
          >
            {profile.primaryCTA || 'Book a free consultation'}
          </button>
        </div>
      </div>
    </section>
  );
};

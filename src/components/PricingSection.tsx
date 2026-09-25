import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRight, Calculator, Check, Info, Edit3 } from 'lucide-react';

interface PricingSectionProps {
  onOpenBooking: (prefillNote?: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenBooking }) => {
  const { pricing, profile, isEditMode, setIsEditingText, setTextEditTab } = usePortfolio();

  // Interactive Project Scope Estimator state
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'AI Strategy Consulting',
  ]);
  const [timelineUrgency, setTimelineUrgency] = useState<'standard' | 'express'>('standard');

  const estimatorItems = [
    { id: 'AI Strategy Consulting', label: 'AI Strategy Consulting (Roadmap & Architecture)', basePrice: 250, type: 'one-time' },
    { id: 'AI Workflow Automation', label: 'AI Workflow Automation (Single Flow + SOP)', basePrice: 500, type: 'one-time' },
    { id: 'Content Generation', label: 'Content Generation Engine (Monthly Batch)', basePrice: 400, type: 'monthly' },
    { id: 'Website Creation', label: 'Website Creation (5-Page Launch in 5 Days)', basePrice: 600, type: 'one-time' },
    { id: 'Ad Campaigns', label: 'Ad Campaigns (10-Variant Test Sprint)', basePrice: 350, type: 'one-time' },
  ];

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const calculateEstimate = () => {
    let oneTimeTotal = 0;
    let monthlyTotal = 0;

    selectedServices.forEach((id) => {
      const item = estimatorItems.find((i) => i.id === id);
      if (item) {
        if (item.type === 'one-time') {
          oneTimeTotal += item.basePrice;
        } else {
          monthlyTotal += item.basePrice;
        }
      }
    });

    if (timelineUrgency === 'express') {
      oneTimeTotal = Math.round(oneTimeTotal * 1.25);
    }

    return { oneTimeTotal, monthlyTotal };
  };

  const { oneTimeTotal, monthlyTotal } = calculateEstimate();

  const handleBookWithScope = () => {
    const scopeSummary = `Selected Services: ${selectedServices.join(', ')} | Urgency: ${timelineUrgency} | Est: One-time ~$${oneTimeTotal}${monthlyTotal > 0 ? `, Monthly ~$${monthlyTotal}` : ''}`;
    onOpenBooking(scopeSummary);
  };

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <span>Transparent Investment</span>
              <span aria-hidden="true">·</span>
              <span>No Hidden Retainers</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
              Clear, Predictable Pricing for Founders
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed font-normal">
              No vague quotes or ballooning invoices. Each offering has a clear baseline scope and transparent deliverables.
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
              <span>Edit Pricing Table</span>
            </button>
          )}
        </div>

        {/* Pricing Snapshot Table / Grid on white */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            {pricing.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 p-6 sm:px-8 items-center gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="md:col-span-5">
                  <div className="text-base font-bold text-slate-900">
                    {item.service}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {item.highlight}
                  </div>
                </div>

                <div className="md:col-span-3">
                  <span className="text-xs text-slate-400 font-mono block">Engagement Model</span>
                  <span className="text-xs font-medium text-slate-700">{item.model}</span>
                </div>

                <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-6">
                  <div>
                    <span className="text-xs text-slate-400 font-mono block md:text-right">Starting At</span>
                    <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                      {item.price}
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenBooking(`Interested in: ${item.service} (${item.price})`)}
                    className="rounded-lg bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-900 transition-colors whitespace-nowrap"
                  >
                    Discuss scope
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50/80 p-6 sm:px-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Info className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Final pricing depends on scope — book a free call for a custom quote.</span>
            </div>
            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm"
            >
              {profile.primaryCTA || 'Book a free consultation'}
            </button>
          </div>
        </div>

        {/* Interactive Scope & Pricing Estimator for Founders */}
        <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-700 uppercase">
            <Calculator className="h-4 w-4" />
            <span>Interactive Project Scope Estimator</span>
          </div>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Build a Custom Project Package
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Select the services you need to estimate your initial engagement budget before our discovery call.
          </p>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Checklist */}
            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                1. Select Services Needed
              </div>
              {estimatorItems.map((item) => {
                const isSelected = selectedServices.includes(item.id);
                return (
                  <label
                    key={item.id}
                    onClick={() => toggleService(item.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-900 ml-2">
                      ${item.basePrice}
                      {item.type === 'monthly' ? '/mo' : ''}
                    </span>
                  </label>
                );
              })}

              {/* Delivery timeline toggle */}
              <div className="pt-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  2. Delivery Urgency
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTimelineUrgency('standard')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-medium border text-center transition-all ${
                      timelineUrgency === 'standard'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Standard Cadence (5–10 days)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimelineUrgency('express')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-medium border text-center transition-all ${
                      timelineUrgency === 'express'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Express Sprint (48–72 hours)
                  </button>
                </div>
              </div>
            </div>

            {/* Scope Summary Box on crisp light background */}
            <div className="lg:col-span-5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 p-6 sm:p-8 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Estimated Scope Summary
              </div>

              <div className="mt-6 space-y-4">
                <div className="border-b border-slate-200 pb-4">
                  <div className="text-xs text-slate-500">One-Time Project Investment</div>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
                    ~${oneTimeTotal}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Covers architecture, implementation, test sprints, and full SOP handoff.
                  </div>
                </div>

                {monthlyTotal > 0 && (
                  <div className="border-b border-slate-200 pb-4">
                    <div className="text-xs text-slate-500">Recurring Monthly Retainer (Optional)</div>
                    <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
                      ~${monthlyTotal}/mo
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Covers continuous content generation or ongoing workflow optimization.
                    </div>
                  </div>
                )}

                <div className="text-xs text-slate-700 space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Includes 30-min discovery &amp; post-delivery QA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Zero lock-in: You own 100% of code, prompts &amp; IP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Direct founder execution by {profile.name}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleBookWithScope}
                    className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-xs font-bold text-white transition-all hover:bg-blue-500 whitespace-nowrap group shadow-sm"
                  >
                    <span>Book a free consultation with this scope</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                  <p className="mt-2 text-center text-[11px] text-slate-500">
                    No payment required to book. Scope finalized together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

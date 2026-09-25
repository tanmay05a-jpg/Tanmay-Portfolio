import React, { useState } from 'react';
import { FAQS } from '../data/portfolioData';
import { ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Frequently Asked Questions</span>
            <span aria-hidden="true">·</span>
            <span>Collaboration &amp; Process</span>
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
            Everything You Need to Know Before Reaching Out
          </h2>
          <p className="mt-3 text-sm text-slate-600 font-normal">
            Straightforward answers on working models, time zones, deliverable ownership, and timelines.
          </p>
        </div>

        <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-6">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between text-left focus:outline-none group"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180 bg-slate-100 text-slate-900' : 'bg-white'
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>
                {isOpen && (
                  <div className="mt-3 text-sm text-slate-600 leading-relaxed max-w-3xl pr-8">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

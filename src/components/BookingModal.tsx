import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, Globe2, CheckCircle2, ArrowRight, Video, Phone, Mail } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillNote?: string;
  prefillServiceId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  prefillNote,
  prefillServiceId,
}) => {
  const { profile } = usePortfolio();

  const [selectedTimezone, setSelectedTimezone] = useState<'EST' | 'PST' | 'GMT'>('EST');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [step, setStep] = useState<'time' | 'details' | 'confirmed'>('time');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  });

  // Calculate upcoming 5 weekdays starting tomorrow
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let count = 0;
    let dayOffset = 1;

    while (count < 5) {
      const d = new Date(today);
      d.setDate(today.getDate() + dayOffset);
      const dayOfWeek = d.getDay();
      // Only Monday (1) to Friday (5)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dateStr = d.toISOString().split('T')[0];
        const displayStr = d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        dates.push({ dateStr, displayStr });
        count++;
      }
      dayOffset++;
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0].dateStr);
    }
    if (prefillNote) {
      setFormData((prev) => ({ ...prev, notes: prefillNote }));
    }
  }, [isOpen, prefillNote]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Time slots adapted by timezone
  const getTimeSlots = () => {
    switch (selectedTimezone) {
      case 'EST':
        return ['09:30 AM EST', '11:00 AM EST', '01:30 PM EST', '03:00 PM EST', '04:30 PM EST'];
      case 'PST':
        return ['08:00 AM PST', '09:30 AM PST', '11:00 AM PST', '01:00 PM PST', '02:30 PM PST'];
      case 'GMT':
        return ['02:00 PM GMT', '03:30 PM GMT', '05:00 PM GMT', '06:30 PM GMT'];
    }
  };

  const handleContinueToDetails = () => {
    if (!selectedTime) return;
    setStep('details');
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setStep('confirmed');
  };

  const resetAndClose = () => {
    setStep('time');
    setSelectedTime('');
    onClose();
  };

  const directGoogleCalendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=AI+Strategy+Consultation+with+Tanmay+Agrawal&details=30-minute+consultation+with+${encodeURIComponent(formData.name || 'Client')}+regarding+${encodeURIComponent(formData.notes || 'AI Roadmap & Video')}&add=${encodeURIComponent(profile.email)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900">
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-700 focus:outline-none"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            <Video className="h-3.5 w-3.5" />
            <span>30-Minute Free Strategy Discovery</span>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            Book a Free Consultation with {profile.name}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Discuss your AI roadmap, video commercials, or digital launch. Syncs directly to {profile.email}.
          </p>
        </div>

        {/* Step 1: Select Date, Timezone & Slot */}
        {step === 'time' && (
          <div className="mt-6 space-y-6">
            {/* Timezone Switcher */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Globe2 className="h-3.5 w-3.5 text-slate-400" />
                  Your Timezone
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Global Timezone Sync</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'EST', label: 'Eastern (EST)' },
                  { id: 'PST', label: 'Pacific (PST)' },
                  { id: 'GMT', label: 'London (GMT)' },
                ].map((tz) => (
                  <button
                    key={tz.id}
                    type="button"
                    onClick={() => {
                      setSelectedTimezone(tz.id as any);
                      setSelectedTime('');
                    }}
                    className={`py-2 px-3 text-xs rounded-lg border font-medium transition-all ${
                      selectedTimezone === tz.id
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                Select a Business Day
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {availableDates.map((item) => (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`p-2.5 text-center rounded-xl border text-xs transition-all ${
                      selectedDate === item.dateStr
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium text-[11px]">{item.displayStr.split(',')[0]}</div>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">
                      {item.displayStr.split(',')[1]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slot Selection */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Available 30-Min Windows
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {getTimeSlots().map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 px-3 text-xs rounded-lg border text-center transition-all ${
                      selectedTime === slot
                        ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {selectedTime ? `Selected: ${selectedTime}` : 'Select a time window to proceed'}
              </span>
              <button
                type="button"
                disabled={!selectedTime}
                onClick={handleContinueToDetails}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contact Details */}
        {step === 'details' && (
          <form onSubmit={handleConfirmBooking} className="mt-6 space-y-4">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
                <span>
                  {selectedDate} at {selectedTime}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep('time')}
                className="text-blue-600 hover:underline font-semibold"
              >
                Change
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
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
                  placeholder="sarah@startup.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name or Website
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="company.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                What would you like to focus on? (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Briefly describe your priority (e.g. commercial video ad, automating support triage, 5-day website launch, or content engine)..."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep('time')}
                className="text-xs font-medium text-slate-500 hover:text-slate-900"
              >
                Back to times
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm"
              >
                Confirm Free Consultation
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmed */}
        {step === 'confirmed' && (
          <div className="mt-6 py-6 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Consultation Scheduled!
            </h3>

            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              We look forward to speaking with you, <span className="font-semibold text-slate-900">{formData.name}</span>. A calendar invitation has been assigned to <span className="font-semibold text-slate-900">{profile.email}</span>.
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 max-w-sm mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="font-semibold text-slate-800">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time:</span>
                <span className="font-semibold text-slate-800">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Host:</span>
                <span className="font-semibold text-slate-800">{profile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Host Email:</span>
                <span className="font-semibold text-emerald-700">{profile.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Direct Phone:</span>
                <span className="font-semibold text-slate-800 font-mono">{profile.mobile}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={directGoogleCalendarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 whitespace-nowrap shadow-sm"
              >
                Add to Google Calendar
              </a>

              <button
                onClick={resetAndClose}
                className="w-full sm:w-auto rounded-lg border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

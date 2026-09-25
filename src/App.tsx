import React, { useState } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { AboutSection } from './components/AboutSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { ProjectEditorModal } from './components/ProjectEditorModal';
import { TextEditorModal } from './components/TextEditorModal';
import { EditToolbar } from './components/EditToolbar';

function PortfolioApp() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPrefillNote, setBookingPrefillNote] = useState<string | undefined>(undefined);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);

  const handleOpenBooking = (prefillOrService?: string) => {
    if (prefillOrService) {
      if (prefillOrService.startsWith('Selected') || prefillOrService.startsWith('Interested')) {
        setBookingPrefillNote(prefillOrService);
      } else {
        setBookingServiceId(prefillOrService);
      }
    } else {
      setBookingPrefillNote(undefined);
      setBookingServiceId(undefined);
    }
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-slate-900 selection:text-white">
      {/* Top Navigation */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main className="flex-1 bg-white">
        {/* Hero Section on Pure White */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* 5 Core Offerings */}
        <ServicesSection onOpenBooking={(serviceId) => handleOpenBooking(serviceId)} />

        {/* Portfolio & Case Studies (Editable & Add Works) */}
        <PortfolioSection onOpenBooking={(serviceId) => handleOpenBooking(serviceId)} />

        {/* About Tanmay Agrawal & 18-Year Background */}
        <AboutSection onOpenBooking={() => handleOpenBooking()} />

        {/* FAQ Section */}
        <FAQSection />

        {/* Direct Contact & Inquiry Form */}
        <ContactSection onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* Footer on Pure White */}
      <Footer onOpenBooking={() => handleOpenBooking()} />

      {/* Interactive Consultation Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        prefillNote={bookingPrefillNote}
        prefillServiceId={bookingServiceId}
      />

      {/* Project Add / Edit Modal */}
      <ProjectEditorModal />

      {/* Copy / Text & Bio Editor Modal */}
      <TextEditorModal />

      {/* Floating Portfolio Manager & Live Edit Toolbar */}
      <EditToolbar />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}

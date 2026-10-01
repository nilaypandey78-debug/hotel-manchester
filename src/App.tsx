import React, { useState } from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { WelcomeSplash } from './components/WelcomeSplash';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BranchesPanel } from './components/BranchesPanel';
import { RoomsGrid } from './components/RoomsGrid';
import { ExperienceSection } from './components/ExperienceSection';
import { BookingModal } from './components/BookingModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { BottomPromoBanner } from './components/BottomPromoBanner';
import { WhatsAppConcierge } from './components/WhatsAppConcierge';
import { Footer } from './components/Footer';
import { Room, Booking } from './types';

const MainAppContent: React.FC = () => {
  const { rooms, setSelectedBranchId, messages } = useHotel();
  const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'admin'>('home');
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [justConfirmedBookingCode, setJustConfirmedBookingCode] = useState<string | undefined>(undefined);

  // Calculate unread guest messages for admin badge
  const unreadGuestMessages = messages.filter((m) => m.sender === 'guest' && !m.read).length;

  const handleNavigateToSection = (id: string) => {
    setActiveView('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleHeroSearch = (
    branchId: string,
    dates: { checkIn: string; checkOut: string },
    guests: number
  ) => {
    setSelectedBranchId(branchId);
    handleNavigateToSection('suites');
  };

  const handleSelectBranchRooms = (branchId: string) => {
    setSelectedBranchId(branchId);
    handleNavigateToSection('suites');
  };

  const handleBookingConfirmed = (booking: Booking) => {
    setJustConfirmedBookingCode(booking.bookingCode);
    setActiveView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#ede8df] flex flex-col justify-between selection:bg-[#c5a880]/30 selection:text-[#f7f3ec]">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenDashboard={() => setActiveView('dashboard')}
        onOpenAdmin={() => setActiveView('admin')}
        onNavigateToSection={handleNavigateToSection}
        activeView={activeView}
        unreadAdminMessagesCount={unreadGuestMessages}
      />

      {/* Main Content Router */}
      <main className="flex-1 pb-16">
        {activeView === 'home' && (
          <>
            <HeroSection
              onSearch={handleHeroSearch}
              onExploreClick={() => handleNavigateToSection('suites')}
            />

            <BranchesPanel onSelectBranchRooms={handleSelectBranchRooms} />

            <RoomsGrid onSelectRoom={(room) => setSelectedRoomForBooking(room)} />

            <ExperienceSection />

            <Footer
              onNavigateToSection={handleNavigateToSection}
              onOpenAdmin={() => setActiveView('admin')}
              onOpenDashboard={() => setActiveView('dashboard')}
            />
          </>
        )}

        {activeView === 'dashboard' && (
          <CustomerDashboard
            onBackToHome={() => setActiveView('home')}
            selectedBookingCode={justConfirmedBookingCode}
          />
        )}

        {activeView === 'admin' && (
          <AdminPanel onBackToHome={() => setActiveView('home')} />
        )}
      </main>

      {/* Booking Modal with Dynamic UPI QR Code */}
      {selectedRoomForBooking && (
        <BookingModal
          room={selectedRoomForBooking}
          onClose={() => setSelectedRoomForBooking(null)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {/* Promotional Bottom Banner with Social Links */}
      <BottomPromoBanner />

      {/* Floating Luxury WhatsApp Concierge */}
      <WhatsAppConcierge />
    </div>
  );
};

export default function App() {
  const [welcomingCompleted, setWelcomingCompleted] = useState(false);

  return (
    <HotelProvider>
      {!welcomingCompleted && (
        <WelcomeSplash onEnter={() => setWelcomingCompleted(true)} />
      )}
      <MainAppContent />
    </HotelProvider>
  );
}

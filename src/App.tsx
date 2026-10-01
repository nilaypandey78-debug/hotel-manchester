import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  const { setSelectedBranchId, messages } = useHotel();
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

      {/* Main Content Router with Smooth View Transitions */}
      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>
          )}

          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <CustomerDashboard
                onBackToHome={() => setActiveView('home')}
                selectedBookingCode={justConfirmedBookingCode}
              />
            </motion.div>
          )}

          {activeView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <AdminPanel onBackToHome={() => setActiveView('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Booking Modal with Dynamic UPI QR Code & Animations */}
      <AnimatePresence>
        {selectedRoomForBooking && (
          <BookingModal
            room={selectedRoomForBooking}
            onClose={() => setSelectedRoomForBooking(null)}
            onBookingConfirmed={handleBookingConfirmed}
          />
        )}
      </AnimatePresence>

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

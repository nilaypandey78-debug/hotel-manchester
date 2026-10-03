import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { WelcomeSplash } from './components/WelcomeSplash';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BranchesPanel } from './components/BranchesPanel';
import { BranchPageModal } from './components/BranchPageModal';
import { RoomsGrid } from './components/RoomsGrid';
import { ExperienceSection } from './components/ExperienceSection';
import { BookingModal } from './components/BookingModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { BottomPromoBanner } from './components/BottomPromoBanner';
import { WhatsAppConcierge } from './components/WhatsAppConcierge';
import { Footer } from './components/Footer';
import { Room, Booking, Branch } from './types';

const MainAppContent: React.FC = () => {
  const { setSelectedBranchId, messages } = useHotel();
  const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'admin'>('home');
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [selectedBranchForModal, setSelectedBranchForModal] = useState<Branch | null>(null);
  const [justConfirmedBookingCode, setJustConfirmedBookingCode] = useState<string | undefined>(undefined);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowScrollTop(latest > 380);
    });
  }, [scrollY]);

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
    <div className="min-h-screen bg-[#FAF8F5] text-[#292524] flex flex-col justify-between selection:bg-[#946E3A]/25 selection:text-[#1C1917]">
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

              <BranchesPanel
                onSelectBranchRooms={handleSelectBranchRooms}
                onOpenBranchPage={(branch) => setSelectedBranchForModal(branch)}
              />

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

      {/* Sanctuary Branch Dedicated Page Modal */}
      <AnimatePresence>
        {selectedBranchForModal && (
          <BranchPageModal
            branch={selectedBranchForModal}
            onClose={() => setSelectedBranchForModal(null)}
            onSelectRoom={(room) => {
              setSelectedBranchForModal(null);
              setSelectedRoomForBooking(room);
            }}
          />
        )}
      </AnimatePresence>

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

      {/* Floating Smooth Scroll-to-Top Indicator Button */}
      <AnimatePresence>
        {showScrollTop && activeView === 'home' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 16 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll smoothly back to top"
            className="fixed bottom-14 left-5 z-40 flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-[#D8D0C5] hover:border-[#946E3A] text-[#1C1917] hover:text-[#946E3A] shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all cursor-pointer group"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#946E3A] group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-[11px] uppercase tracking-widest font-semibold">Top</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [welcomingCompleted, setWelcomingCompleted] = useState(false);

  return (
    <HotelProvider>
      {/* Welcoming Splash Screen with Cinematic Exit Dissolve */}
      <AnimatePresence>
        {!welcomingCompleted && (
          <WelcomeSplash onEnter={() => setWelcomingCompleted(true)} />
        )}
      </AnimatePresence>

      {/* Main Sanctuary Website with Smooth Blooming Entry Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.982, filter: 'blur(8px)', y: 18 }}
        animate={
          welcomingCompleted
            ? { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }
            : { opacity: 0, scale: 0.982, filter: 'blur(8px)', y: 18 }
        }
        transition={{
          duration: 1.35,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.15,
        }}
        className="w-full min-h-screen"
      >
        <MainAppContent />
      </motion.div>
    </HotelProvider>
  );
}

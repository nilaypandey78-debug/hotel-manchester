import React, { useState, useEffect } from 'react';
import { AudioController } from './AudioController';
import { UserCheck, Shield } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';

interface NavbarProps {
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  onNavigateToSection: (id: string) => void;
  activeView: 'home' | 'dashboard' | 'admin';
  unreadAdminMessagesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDashboard,
  onOpenAdmin,
  onNavigateToSection,
  activeView,
  unreadAdminMessagesCount = 0,
}) => {
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 25);
    });
  }, [scrollY]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-xl bg-[#FAF8F5]/95 border-b border-[#E0D7CA] shadow-[0_8px_30px_rgba(28,25,23,0.06)]'
          : 'backdrop-blur-md bg-[#FAF8F5]/85 border-b border-[#E8E2D8]'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
        isScrolled ? 'h-16' : 'h-20'
      }`}>
        {/* Brand wordmark */}
        <button
          onClick={() => onNavigateToSection('hero')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-serif-luxury text-2xl sm:text-3xl font-light tracking-wide text-[#1C1917] group-hover:text-[#946E3A] transition-colors duration-300">
            Hotel Manchester
          </span>
        </button>

        {/* Clean text navigation links with animated hover indicator */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-[0.2em] font-medium text-[#57534E]">
          <button
            onClick={() => onNavigateToSection('suites')}
            className="hover:text-[#1C1917] transition-colors cursor-pointer py-1 relative group"
          >
            <span>Suites &amp; Villas</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#946E3A] transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => onNavigateToSection('branches')}
            className="hover:text-[#1C1917] transition-colors cursor-pointer py-1 relative group"
          >
            <span>Sanctuaries</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#946E3A] transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => onNavigateToSection('experiences')}
            className="hover:text-[#1C1917] transition-colors cursor-pointer py-1 relative group"
          >
            <span>Dining &amp; Spa</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#946E3A] transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => onNavigateToSection('booking-inquiry')}
            className="hover:text-[#1C1917] transition-colors cursor-pointer py-1 relative group"
          >
            <span>Reservations</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#946E3A] transition-all duration-300 group-hover:w-full" />
          </button>
        </nav>

        {/* Actions + Audio Controller */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <AudioController />

          {/* Customer Dashboard Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenDashboard}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap shadow-sm ${
              activeView === 'dashboard'
                ? 'bg-[#946E3A] text-white border-[#946E3A] font-semibold'
                : 'border-[#D8D0C5] bg-white text-[#292524] hover:border-[#946E3A] hover:text-[#946E3A]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-current" />
            <span>My Bookings</span>
          </motion.button>

          {/* Admin Panel Access */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenAdmin}
            title="Resort Administration & Concierge Desk"
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs tracking-wider transition-all duration-300 cursor-pointer shadow-sm ${
              activeView === 'admin'
                ? 'bg-[#1C1917] text-[#FAF8F5] border-[#1C1917] font-semibold'
                : 'border-[#D8D0C5] bg-white text-[#57534E] hover:text-[#1C1917] hover:border-[#946E3A]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-current" />
            <span className="hidden sm:inline">Admin Desk</span>
            {unreadAdminMessagesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#946E3A] animate-pulse" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Dynamic Gold Scroll Progress Indicator Bar */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%' }}
        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#946E3A] via-[#C5A869] to-[#946E3A] shadow-[0_0_12px_rgba(148,110,58,0.55)] pointer-events-none"
      />
    </motion.header>
  );
};

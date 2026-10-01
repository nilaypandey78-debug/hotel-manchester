import React from 'react';
import { AudioController } from './AudioController';
import { UserCheck, Shield } from 'lucide-react';
import { motion } from 'motion/react';

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
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0b0c0e]/90 border-b border-[#212328]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigateToSection('hero')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-serif-luxury text-2xl sm:text-3xl font-light tracking-wide text-[#f7f3ec] group-hover:text-[#c5a880] transition-colors duration-300">
            Hotel Manchester
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links with animated hover indicator */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-[0.2em] font-medium text-[#a8a39a]">
          <button
            onClick={() => onNavigateToSection('suites')}
            className="hover:text-[#f7f3ec] transition-colors cursor-pointer py-1 relative group"
          >
            <span>Suites &amp; Villas</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#c5a880] transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => onNavigateToSection('branches')}
            className="hover:text-[#f7f3ec] transition-colors cursor-pointer py-1 relative group"
          >
            <span>Branches</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#c5a880] transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => onNavigateToSection('experiences')}
            className="hover:text-[#f7f3ec] transition-colors cursor-pointer py-1 relative group"
          >
            <span>Sanctuary Dining</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#c5a880] transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => onNavigateToSection('booking-inquiry')}
            className="hover:text-[#f7f3ec] transition-colors cursor-pointer py-1 relative group"
          >
            <span>Reservations</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#c5a880] transition-all duration-300 group-hover:w-full" />
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions + Audio Controller */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <AudioController />

          {/* Customer Dashboard Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenDashboard}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
              activeView === 'dashboard'
                ? 'bg-[#c5a880] text-[#0c0d0e] border-[#c5a880] font-semibold shadow-md'
                : 'border-[#2d3037] bg-[#141519] text-[#e0ded8] hover:border-[#c5a880]/60 hover:text-[#f7f3ec]'
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
            className={`relative flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-full border text-xs tracking-wider transition-all duration-300 cursor-pointer ${
              activeView === 'admin'
                ? 'bg-[#c5a880] text-[#0c0d0e] border-[#c5a880] font-semibold shadow-md'
                : 'border-[#26282e] bg-[#0f1013] text-[#736e65] hover:text-[#ded8ce] hover:border-[#383b44]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-current" />
            <span className="hidden lg:inline text-[11px] font-normal uppercase tracking-widest">
              Admin
            </span>
            {unreadAdminMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-[10px] text-white rounded-full flex items-center justify-center font-bold">
                {unreadAdminMessagesCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

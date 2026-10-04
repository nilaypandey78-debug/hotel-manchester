import React, { useState } from 'react';
import { Calendar, Users, MapPin, ArrowDown, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { ASSET_IMAGES, resolveHotelImage } from '../utils/imageAssets';
import { FESTIVAL_THEMES } from '../utils/festivalThemes';

interface HeroSectionProps {
  onSearch: (branchId: string, dates: { checkIn: string; checkOut: string }, guests: number) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onExploreClick }) => {
  const { activeBranches, selectedBranchId, setSelectedBranchId, hotelContent } = useHotel();
  const activeThemeConfig = FESTIVAL_THEMES[hotelContent.activeFestivalTheme || 'default'];

  // Scroll parallax for cinematic background glide and content reveal
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 220]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.25]);
  const heroTranslateY = useTransform(scrollY, [0, 600], [0, 80]);

  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(nextWeek);
  const [guests, setGuests] = useState(2);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedBranchId, { checkIn, checkOut }, guests);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: 'easeOut' as const },
    },
  };

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#FAF8F5]">
      {/* Background Photography with Light Luxury Champagne Scrim & Scroll Parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0.85 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          src={resolveHotelImage(hotelContent.heroImage || ASSET_IMAGES.hero)}
          alt="Hotel Manchester Luxury Sanctuary"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Measured scrim creating an airy, luminous light luxury backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/65 to-black/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(250,248,245,0.4)_100%)]" />
      </motion.div>

      {/* Target Focus Element: Upper Hero Content Area with Rich Motion Orchestration & Scroll-Fading */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroTranslateY }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 flex-1 flex flex-col justify-center items-start w-full"
      >
        {/* Ambient floating golden aura glow */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.2, 0.35, 0.2],
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-12 left-10 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(197,168,128,0.3)_0%,transparent_70%)] pointer-events-none blur-2xl"
        />

        {/* Indian Festival Greeting Badge (When an Indian festival theme is activated by Admin) */}
        {activeThemeConfig && hotelContent.activeFestivalTheme && hotelContent.activeFestivalTheme !== 'default' && (
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-amber-300 shadow-[0_4px_16px_rgba(217,119,6,0.15)] text-xs font-semibold text-[#1C1917] mb-4"
          >
            <span className="text-base">{activeThemeConfig.emoji}</span>
            <span className="text-[#946E3A] font-serif-luxury font-medium text-sm">
              {activeThemeConfig.hindiName}
            </span>
            <span className="text-[#C4B9AA]">·</span>
            <span className="text-[11px] uppercase tracking-wider text-[#57534E]">
              {hotelContent.festivalGreetingTitle || activeThemeConfig.defaultGreetingTitle}
            </span>
          </motion.div>
        )}

        {/* Clean unboxed metadata with subtle typographic separators */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2.5 text-xs text-[#946E3A] tracking-[0.25em] uppercase font-semibold mb-5">
          <span className="flex items-center gap-1.5">
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-[#946E3A]"
            />
            Private Sanctuaries
          </span>
          <span aria-hidden="true" className="text-[#C4B9AA]">·</span>
          <span>Bespoke Hospitality</span>
          <span aria-hidden="true" className="text-[#C4B9AA]">·</span>
          <span>Across India</span>
        </motion.div>

        {/* Animated Headline with luxury emphasis in rich deep charcoal */}
        <motion.h1
          initial={{ opacity: 0, y: 45, filter: 'blur(12px)', letterSpacing: '0.06em' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', letterSpacing: '0.02em' }}
          transition={{ duration: 1.3, delay: 0.2, ease: 'easeOut' }}
          className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-light text-[#1C1917] max-w-3xl tracking-wide leading-[1.1] mb-6 relative cursor-default overflow-visible"
        >
          {/* Subtle golden shimmer sweep */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 0.45, 0] }}
            transition={{ duration: 1.8, delay: 0.6, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#946E3A]/20 to-transparent pointer-events-none skew-x-12 z-20"
          />

          <motion.span
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
            className="inline-block"
          >
            Sanctuaries
          </motion.span>{' '}
          <motion.span
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
            className="inline-block"
          >
            of
          </motion.span>{' '}
          <span className="relative inline-block my-1">
            <motion.span
              initial={{ opacity: 0, scale: 0.88, y: 20, filter: 'blur(8px)' }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                filter: 'blur(0px)',
              }}
              transition={{
                opacity: { duration: 1, delay: 0.65, ease: 'easeOut' },
                scale: { duration: 1, delay: 0.65, ease: 'easeOut' },
                y: { duration: 1, delay: 0.65, ease: 'easeOut' },
                filter: { duration: 0.8, delay: 0.65 },
              }}
              className="italic text-[#946E3A] font-normal px-1.5"
            >
              unhurried
            </motion.span>
            {/* Animated Golden Underline drawing in */}
            <motion.span
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 1.0, ease: 'easeOut' }}
              className="absolute -bottom-1 left-1.5 right-1.5 h-[2px] bg-gradient-to-r from-transparent via-[#946E3A] to-transparent origin-center pointer-events-none"
            />
          </span>{' '}
          <motion.span
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.8, ease: 'easeOut' }}
            className="inline-block"
          >
            quiet
          </motion.span>{' '}
          <motion.span
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.95, ease: 'easeOut' }}
            className="inline-block"
          >
            grandeur.
          </motion.span>
        </motion.h1>

        {/* Subtitle description */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-[#44403C] max-w-2xl font-light leading-relaxed mb-10"
        >
          {hotelContent.heroSubtitle}
        </motion.p>

        {/* Real-time Booking & Availability Search Capsule in Light Luxury Porcelain */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSearchSubmit}
          whileHover={{
            boxShadow: '0 20px 45px -10px rgba(148, 110, 58, 0.15)',
            borderColor: 'rgba(148, 110, 58, 0.4)',
            y: -2,
            transition: { duration: 0.25 },
          }}
          className="w-full max-w-4xl p-2 sm:p-3 rounded-2xl sm:rounded-full bg-white/95 backdrop-blur-xl border border-[#E8E2D8] shadow-[0_15px_40px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row items-center gap-2 transition-all duration-300 relative z-10"
        >
          {/* Sanctuary / Branch Selector */}
          <div className="w-full sm:flex-1 flex items-center gap-3 px-4 py-3 sm:py-2 border-b sm:border-b-0 sm:border-r border-[#EAE4DA] group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <MapPin className="w-4 h-4 text-[#946E3A] shrink-0" />
            </motion.div>
            <div className="flex flex-col flex-1 text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#78716C] font-semibold group-hover:text-[#946E3A] transition-colors">
                Sanctuary Branch
              </span>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-[#1C1917] font-medium focus:outline-none cursor-pointer truncate"
              >
                <option value="all" className="bg-white text-[#1C1917]">
                  All Luxury Branches (Nationwide)
                </option>
                {activeBranches.map((b) => (
                  <option key={b.id} value={b.id} className="bg-white text-[#1C1917]">
                    {b.city} — {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Check-In / Check-Out Dates */}
          <div className="w-full sm:flex-1 flex items-center gap-3 px-4 py-3 sm:py-2 border-b sm:border-b-0 sm:border-r border-[#EAE4DA] group">
            <motion.div
              whileHover={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Calendar className="w-4 h-4 text-[#946E3A] shrink-0" />
            </motion.div>
            <div className="flex flex-col flex-1 text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#78716C] font-semibold group-hover:text-[#946E3A] transition-colors">
                Check In &amp; Out
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#1C1917]">
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent text-xs text-[#1C1917] focus:outline-none cursor-pointer w-24 hover:text-[#946E3A] transition-colors font-medium"
                />
                <span className="text-[#A8A29E]">—</span>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-xs text-[#1C1917] focus:outline-none cursor-pointer w-24 hover:text-[#946E3A] transition-colors font-medium"
                />
              </div>
            </div>
          </div>

          {/* Guests Count */}
          <div className="w-full sm:w-36 flex items-center gap-3 px-4 py-3 sm:py-2 group">
            <motion.div
              whileHover={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Users className="w-4 h-4 text-[#946E3A] shrink-0" />
            </motion.div>
            <div className="flex flex-col flex-1 text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#78716C] font-semibold group-hover:text-[#946E3A] transition-colors">
                Guests
              </span>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="bg-transparent text-xs text-[#1C1917] font-medium focus:outline-none cursor-pointer"
              >
                <option value={1} className="bg-white text-[#1C1917]">1 Guest</option>
                <option value={2} className="bg-white text-[#1C1917]">2 Guests</option>
                <option value={3} className="bg-white text-[#1C1917]">3 Guests</option>
                <option value={4} className="bg-white text-[#1C1917]">4+ Guests</option>
              </select>
            </div>
          </div>

          {/* Search Button with tactile spring physics */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl sm:rounded-full bg-[#1C1917] hover:bg-[#946E3A] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md cursor-pointer shrink-0"
          >
            Check Availability
          </motion.button>
        </motion.form>
      </motion.div>

      {/* Subtle Scroll Down Indicator */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 w-full flex justify-between items-center text-xs text-[#78716C]">
        <button
          onClick={onExploreClick}
          className="flex items-center gap-2 hover:text-[#1C1917] transition-colors cursor-pointer group"
        >
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#946E3A]" />
          </motion.span>
          <span className="tracking-widest uppercase text-[11px] font-medium">Explore Royal Sanctuaries</span>
        </button>

        <div className="hidden sm:flex items-center gap-3 text-[11px] uppercase tracking-widest text-[#78716C]">
          <span>Gilded Heritage</span>
          <span aria-hidden="true" className="text-[#C4B9AA]">·</span>
          <span>432Hz Soundscapes</span>
          <span aria-hidden="true" className="text-[#C4B9AA]">·</span>
          <span>Instant UPI Bookings</span>
        </div>
      </div>
    </section>
  );
};

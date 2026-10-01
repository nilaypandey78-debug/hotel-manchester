import React from 'react';
import { Calendar, Users, MapPin, ArrowDown, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { ASSET_IMAGES } from '../utils/imageAssets';

interface HeroSectionProps {
  onSearch: (branchId: string, dates: { checkIn: string; checkOut: string }, guests: number) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onExploreClick }) => {
  const { branches, hotelContent, selectedBranchId, setSelectedBranchId } = useHotel();

  // Default to today + 3 days
  const today = new Date().toISOString().split('T')[0];
  const defaultNext = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = React.useState(today);
  const [checkOut, setCheckOut] = React.useState(defaultNext);
  const [guestsCount, setGuestsCount] = React.useState(2);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedBranchId, { checkIn, checkOut }, guestsCount);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
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
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden">
      {/* Background Photography with Measured Scrim and Smooth Ambient Motion */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          src={ASSET_IMAGES.hero}
          alt="Hotel Manchester Luxury Sanctuary"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Measured scrim according to frontend-design skill (4.5:1 contrast guarantee) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-[#0b0c0e]/60 to-[#0b0c0e]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,12,14,0.7)_100%)]" />
      </div>

      {/* Target Focus Element: Upper Hero Content Area with Rich Motion Orchestration */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 flex-1 flex flex-col justify-center items-start w-full"
      >
        {/* Ambient floating golden aura glow in the upper background */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.25, 0.45, 0.25],
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-12 left-10 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(197,168,128,0.22)_0%,transparent_70%)] pointer-events-none blur-2xl"
        />

        {/* Clean unboxed metadata with subtle typographic separators & animated pulse badge */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2.5 text-xs text-[#c5a880] tracking-[0.25em] uppercase font-medium mb-5">
          <span className="flex items-center gap-1.5">
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-[#c5a880]"
            />
            Private Sanctuaries
          </span>
          <span aria-hidden="true" className="text-[#6d6659]">·</span>
          <span>Bespoke Hospitality</span>
          <span aria-hidden="true" className="text-[#6d6659]">·</span>
          <span>Across India</span>
        </motion.div>

        {/* Animated Headline with luxury emphasis */}
        <motion.h1
          initial={{ opacity: 0, y: 45, filter: 'blur(12px)', letterSpacing: '0.06em' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', letterSpacing: '0.02em' }}
          transition={{ duration: 1.3, delay: 0.2, ease: 'easeOut' }}
          className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-light text-[#f7f3ec] max-w-3xl tracking-wide leading-[1.1] mb-6 relative cursor-default overflow-visible"
        >
          {/* Subtle golden shimmer sweep that glides across upon entering */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 0.45, 0] }}
            transition={{ duration: 1.8, delay: 0.6, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#c5a880]/30 to-transparent pointer-events-none skew-x-12 z-20"
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
                color: ['#e5cb9f', '#f7ecd5', '#dfc193', '#e5cb9f'],
                textShadow: [
                  '0 0 25px rgba(197,168,128,0.25)',
                  '0 0 45px rgba(229,203,159,0.5)',
                  '0 0 25px rgba(197,168,128,0.25)',
                ],
              }}
              transition={{
                opacity: { duration: 1, delay: 0.65, ease: 'easeOut' },
                scale: { duration: 1, delay: 0.65, ease: 'easeOut' },
                y: { duration: 1, delay: 0.65, ease: 'easeOut' },
                filter: { duration: 0.8, delay: 0.65 },
                color: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                textShadow: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="italic text-[#e5cb9f] font-normal px-1.5"
            >
              unhurried
            </motion.span>
            {/* Animated Golden Underline drawing in */}
            <motion.span
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 1.0, ease: 'easeOut' }}
              className="absolute -bottom-1 left-1.5 right-1.5 h-[2px] bg-gradient-to-r from-transparent via-[#c5a880] to-transparent origin-center pointer-events-none"
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
          className="text-base sm:text-lg text-[#ccc6ba] max-w-2xl font-light leading-relaxed mb-10"
        >
          {hotelContent.heroSubtitle}
        </motion.p>

        {/* Real-time Booking & Availability Search Capsule with Golden Ambient Hover Glow */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSearchSubmit}
          whileHover={{
            boxShadow: '0 20px 45px -10px rgba(197, 168, 128, 0.22)',
            borderColor: 'rgba(197, 168, 128, 0.55)',
            y: -2,
            transition: { duration: 0.25 },
          }}
          className="w-full max-w-4xl p-2 sm:p-3 rounded-2xl sm:rounded-full bg-[#111317]/90 backdrop-blur-xl border border-[#2d3038] shadow-2xl flex flex-col sm:flex-row items-center gap-2 transition-all duration-300 relative z-10"
        >
          {/* Sanctuary / Branch Selector */}
          <div className="w-full sm:flex-1 flex items-center gap-3 px-4 py-3 sm:py-2 border-b sm:border-b-0 sm:border-r border-[#26282f] group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <MapPin className="w-4 h-4 text-[#c5a880] shrink-0" />
            </motion.div>
            <div className="flex flex-col flex-1 text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#827d74] font-medium group-hover:text-[#c5a880] transition-colors">
                Sanctuary Branch
              </span>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-[#f7f3ec] font-medium focus:outline-none cursor-pointer truncate"
              >
                <option value="all" className="bg-[#15171c] text-[#f7f3ec]">
                  All Luxury Branches (Nationwide)
                </option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[#15171c] text-[#f7f3ec]">
                    {b.city} — {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Check-In / Check-Out Dates */}
          <div className="w-full sm:flex-1 flex items-center gap-3 px-4 py-3 sm:py-2 border-b sm:border-b-0 sm:border-r border-[#26282f] group">
            <motion.div
              whileHover={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Calendar className="w-4 h-4 text-[#c5a880] shrink-0" />
            </motion.div>
            <div className="flex flex-col flex-1 text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#827d74] font-medium group-hover:text-[#c5a880] transition-colors">
                Check In &amp; Out
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#f7f3ec]">
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent text-xs text-[#f7f3ec] focus:outline-none cursor-pointer w-24 hover:text-[#c5a880] transition-colors"
                />
                <span className="text-[#68635c]">—</span>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-xs text-[#f7f3ec] focus:outline-none cursor-pointer w-24 hover:text-[#c5a880] transition-colors"
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
              <Users className="w-4 h-4 text-[#c5a880] shrink-0" />
            </motion.div>
            <div className="flex flex-col flex-1 text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#827d74] font-medium group-hover:text-[#c5a880] transition-colors">
                Guests
              </span>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="bg-transparent text-xs sm:text-sm text-[#f7f3ec] font-medium focus:outline-none cursor-pointer"
              >
                <option value={1} className="bg-[#15171c] text-[#f7f3ec]">1 Guest</option>
                <option value={2} className="bg-[#15171c] text-[#f7f3ec]">2 Guests</option>
                <option value={3} className="bg-[#15171c] text-[#f7f3ec]">3 Guests</option>
                <option value={4} className="bg-[#15171c] text-[#f7f3ec]">4+ Guests</option>
              </select>
            </div>
          </div>

          {/* Primary CTA with Shimmer & Spring */}
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(197,168,128,0.45)' }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#c5a880] via-[#dfc7a2] to-[#c5a880] text-[#0b0c0e] text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg cursor-pointer whitespace-nowrap"
          >
            Check Availability
          </motion.button>
        </motion.form>
      </motion.div>

      {/* Down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10 pb-6 flex justify-center"
      >
        <button
          onClick={onExploreClick}
          aria-label="Scroll to luxury accommodations"
          className="flex flex-col items-center gap-1 text-[11px] uppercase tracking-widest text-[#827d74] hover:text-[#c5a880] transition-colors cursor-pointer group"
        >
          <span>Explore Sanctuaries</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#c5a880] group-hover:translate-y-0.5 transition-transform" />
        </button>
      </motion.div>
    </section>
  );
};

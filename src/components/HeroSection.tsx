import React from 'react';
import { Calendar, Users, MapPin, ArrowDown, Sparkles } from 'lucide-react';
import { useHotel } from '../context/HotelContext';

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

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden">
      {/* Background Photography with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_luxury_resort_1790862163016.jpg"
          alt="Hotel Manchester Luxury Sanctuary"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transform animate-[pulse_10s_ease-in-out_infinite]"
        />
        {/* Measured scrim according to frontend-design skill (4.5:1 contrast guarantee) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-[#0b0c0e]/60 to-[#0b0c0e]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,12,14,0.7)_100%)]" />
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 flex-1 flex flex-col justify-center items-start">
        {/* Clean unboxed metadata with subtle typographic separators */}
        <div className="flex items-center gap-2.5 text-xs text-[#c5a880] tracking-[0.25em] uppercase font-medium mb-4">
          <span>Private Sanctuaries</span>
          <span aria-hidden="true">·</span>
          <span>Bespoke Hospitality</span>
          <span aria-hidden="true">·</span>
          <span>Across India</span>
        </div>

        <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-light text-[#f7f3ec] max-w-3xl tracking-wide leading-[1.1] mb-6">
          Sanctuaries of <span className="italic text-[#e5cb9f]">unhurried</span> quiet grandeur.
        </h1>

        <p className="text-base sm:text-lg text-[#ccc6ba] max-w-2xl font-light leading-relaxed mb-10">
          {hotelContent.heroSubtitle}
        </p>

        {/* Real-time Booking & Availability Search Capsule */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-4xl p-2 sm:p-3 rounded-2xl sm:rounded-full bg-[#111317]/90 backdrop-blur-xl border border-[#2d3038] shadow-2xl flex flex-col sm:flex-row items-center gap-2"
        >
          {/* Sanctuary / Branch Selector */}
          <div className="w-full sm:flex-1 flex items-center gap-3 px-4 py-3 sm:py-2 border-b sm:border-b-0 sm:border-r border-[#26282f]">
            <MapPin className="w-4 h-4 text-[#c5a880] shrink-0" />
            <div className="flex flex-col flex-1 text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#827d74] font-medium">
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
          <div className="w-full sm:flex-1 flex items-center gap-3 px-4 py-3 sm:py-2 border-b sm:border-b-0 sm:border-r border-[#26282f]">
            <Calendar className="w-4 h-4 text-[#c5a880] shrink-0" />
            <div className="flex flex-col flex-1 text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#827d74] font-medium">
                Check In &amp; Out
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#f7f3ec]">
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent text-xs text-[#f7f3ec] focus:outline-none cursor-pointer w-24"
                />
                <span className="text-[#68635c]">—</span>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-xs text-[#f7f3ec] focus:outline-none cursor-pointer w-24"
                />
              </div>
            </div>
          </div>

          {/* Guests Count */}
          <div className="w-full sm:w-36 flex items-center gap-3 px-4 py-3 sm:py-2">
            <Users className="w-4 h-4 text-[#c5a880] shrink-0" />
            <div className="flex flex-col flex-1 text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#827d74] font-medium">
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

          {/* Primary CTA */}
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#c5a880] hover:bg-[#d8be96] text-[#0b0c0e] text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg cursor-pointer whitespace-nowrap"
          >
            Check Availability
          </button>
        </form>
      </div>

      {/* Down indicator */}
      <div className="relative z-10 pb-6 flex justify-center">
        <button
          onClick={onExploreClick}
          aria-label="Scroll to luxury accommodations"
          className="flex flex-col items-center gap-1 text-[11px] uppercase tracking-widest text-[#827d74] hover:text-[#c5a880] transition-colors"
        >
          <span>Explore Sanctuaries</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#c5a880]" />
        </button>
      </div>
    </section>
  );
};

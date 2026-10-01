import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Room } from '../types';
import { Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RoomsGridProps {
  onSelectRoom: (room: Room) => void;
}

export const RoomsGrid: React.FC<RoomsGridProps> = ({ onSelectRoom }) => {
  const { rooms, branches, selectedBranchId, setSelectedBranchId } = useHotel();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredRooms = rooms.filter((room) => {
    const branchMatch = selectedBranchId === 'all' || room.branchId === selectedBranchId;
    const categoryMatch = selectedCategory === 'all' || room.category === selectedCategory;
    return branchMatch && categoryMatch;
  });

  const categories = [
    { id: 'all', label: 'All Residences' },
    { id: 'Presidential Penthouse', label: 'Presidential Penthouses' },
    { id: 'Royal Suite', label: 'Royal Suites' },
    { id: 'Garden Villa', label: 'Garden Villas' },
    { id: 'Lakeview Sanctuary', label: 'Sanctuary Villas' },
  ];

  return (
    <section id="suites" className="py-24 bg-[#0b0c0e] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium mb-3">
              <span>Bespoke Accommodations</span>
              <span aria-hidden="true">·</span>
              <span>Available for Reservation</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-light text-[#f7f3ec] leading-tight">
              Suites, Villas &amp; Penthouses
            </h2>
          </div>

          {/* Interactive Branch Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedBranchId('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                selectedBranchId === 'all'
                  ? 'bg-[#c5a880] text-[#0b0c0e]'
                  : 'bg-[#15171c] text-[#a8a39a] hover:text-[#f7f3ec] border border-[#26282e]'
              }`}
            >
              All Locations
            </motion.button>
            {branches.map((b) => (
              <motion.button
                key={b.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedBranchId(b.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  selectedBranchId === b.id
                    ? 'bg-[#c5a880] text-[#0b0c0e]'
                    : 'bg-[#15171c] text-[#a8a39a] hover:text-[#f7f3ec] border border-[#26282e]'
                }`}
              >
                {b.city}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#f7f3ec] text-[#0b0c0e] shadow-sm'
                  : 'text-[#8c877e] hover:text-[#f7f3ec]'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Rooms Grid with AnimatePresence & layout transitions */}
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredRooms.map((room, idx) => {
              const branch = branches.find((b) => b.id === room.branchId);

              return (
                <motion.div
                  layout
                  key={room.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="group rounded-2xl bg-[#121418] border border-[#22252c] hover:border-[#3d424e] transition-colors duration-300 overflow-hidden flex flex-col justify-between shadow-xl"
                >
                  {/* Visual Asset Container with Fallback */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#181a20]">
                    <img
                      src={room.image}
                      alt={room.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121418] via-transparent to-transparent" />

                    {/* Branch Label */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#090a0d]/80 backdrop-blur-md border border-[#272930] text-xs text-[#ede8df]">
                      {branch?.city || 'Sanctuary'}
                    </div>

                    {/* Real-time Availability status */}
                    <div className="absolute top-4 right-4">
                      {room.available ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-600/40 text-[11px] text-emerald-300 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Available Now
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 backdrop-blur-md border border-rose-600/40 text-[11px] text-rose-300 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          Sold Out / Reserved
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Information Block */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Clean unboxed metadata with typographic separators */}
                      <div className="flex items-center gap-2 text-xs text-[#8c877e] mb-2 font-mono">
                        <span>{room.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{room.sizeSqFt} sq.ft</span>
                        <span aria-hidden="true">·</span>
                        <span>{room.view}</span>
                      </div>

                      <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#f7f3ec] group-hover:text-[#c5a880] transition-colors mb-3">
                        {room.name}
                      </h3>

                      <p className="text-sm text-[#a8a39a] font-light leading-relaxed mb-6">
                        {room.description}
                      </p>

                      {/* Features checklist */}
                      <div className="space-y-2 mb-6 pt-4 border-t border-[#1e2026]">
                        {room.features.slice(0, 3).map((feat, i) => (
                          <div key={i} className="flex items-center gap-2.5 text-xs text-[#cbc5b8]">
                            <Check className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Reservation Action */}
                    <div className="pt-6 border-t border-[#1e2026] flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-[#78736a] font-medium">
                          Nightly Tariff
                        </div>
                        <div className="flex items-baseline gap-1 text-[#f7f3ec]">
                          <span className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#c5a880] tabular-nums">
                            ₹{room.pricePerNight.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-[#78736a]">/ night + taxes</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={room.available ? { scale: 1.04 } : {}}
                        whileTap={room.available ? { scale: 0.96 } : {}}
                        onClick={() => onSelectRoom(room)}
                        disabled={!room.available}
                        className={`px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-colors duration-200 flex items-center gap-2 cursor-pointer ${
                          room.available
                            ? 'bg-[#c5a880] hover:bg-[#d8be96] text-[#0b0c0e] shadow-lg shadow-[#c5a880]/10 hover:shadow-[#c5a880]/20'
                            : 'bg-[#1e2026] text-[#55524c] cursor-not-allowed border border-[#2a2c33]'
                        }`}
                      >
                        <span>{room.available ? 'Reserve Suite' : 'Unavailable'}</span>
                        {room.available && <ArrowRight className="w-3.5 h-3.5" />}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

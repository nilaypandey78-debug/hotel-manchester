import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Room } from '../types';
import { Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { resolveHotelImage, ASSET_IMAGES } from '../utils/imageAssets';

interface RoomsGridProps {
  onSelectRoom: (room: Room) => void;
}

export const RoomsGrid: React.FC<RoomsGridProps> = ({ onSelectRoom }) => {
  const { rooms, activeBranches, selectedBranchId, setSelectedBranchId } = useHotel();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter rooms so only suites from non-archived branches are presented
  const activeBranchIds = new Set(activeBranches.map((b) => b.id));

  const filteredRooms = rooms.filter((room) => {
    // If room belongs to an archived branch, hide it from public listing
    if (!activeBranchIds.has(room.branchId)) return false;

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
    <section id="suites" className="py-24 bg-[#FAF8F5] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 36, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#946E3A] font-semibold mb-3">
              <span>Bespoke Accommodations</span>
              <span aria-hidden="true">·</span>
              <span>Available for Reservation</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-light text-[#1C1917] leading-tight">
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
                  ? 'bg-[#946E3A] text-white shadow-sm'
                  : 'bg-white text-[#57534E] hover:text-[#1C1917] border border-[#EAE4DA]'
              }`}
            >
              All Locations
            </motion.button>
            {activeBranches.map((b) => (
              <motion.button
                key={b.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedBranchId(b.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  selectedBranchId === b.id
                    ? 'bg-[#946E3A] text-white shadow-sm'
                    : 'bg-white text-[#57534E] hover:text-[#1C1917] border border-[#EAE4DA]'
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
                  ? 'bg-[#1C1917] text-white shadow-sm'
                  : 'bg-white/80 border border-[#EAE4DA] text-[#57534E] hover:text-[#1C1917]'
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
              const branch = activeBranches.find((b) => b.id === room.branchId);

              return (
                <motion.div
                  layout
                  key={room.id}
                  initial={{ opacity: 0, y: 45, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-50px' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.65, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="group rounded-3xl bg-white border border-[#EAE4DA] hover:border-[#946E3A] transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(148,110,58,0.1)]"
                >
                  {/* Visual Asset Container with Fallback */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE4DA]">
                    <img
                      src={resolveHotelImage(room.image)}
                      alt={room.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = ASSET_IMAGES.hero;
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Branch Label */}
                    <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E2D8] text-xs font-medium text-[#1C1917] shadow-sm">
                      {branch?.city || 'Sanctuary'}
                    </div>

                    {/* Real-time Availability status */}
                    <div className="absolute top-4 right-4">
                      {room.available ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/95 backdrop-blur-md border border-emerald-300 text-[11px] text-emerald-800 font-semibold shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Available Now
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50/95 backdrop-blur-md border border-rose-300 text-[11px] text-rose-800 font-semibold shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Sold Out / Reserved
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Information Block */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Clean unboxed metadata with typographic separators */}
                      <div className="flex items-center gap-2 text-xs text-[#78716C] mb-2 font-mono">
                        <span>{room.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{room.sizeSqFt} sq.ft</span>
                        <span aria-hidden="true">·</span>
                        <span>{room.view}</span>
                      </div>

                      <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#1C1917] group-hover:text-[#946E3A] transition-colors mb-3">
                        {room.name}
                      </h3>

                      <p className="text-sm text-[#57534E] font-light leading-relaxed mb-6">
                        {room.description}
                      </p>

                      {/* Features checklist */}
                      <div className="space-y-2 mb-6 pt-4 border-t border-[#F2ECE3]">
                        {room.features.slice(0, 3).map((feat, i) => (
                          <div key={i} className="flex items-center gap-2.5 text-xs text-[#44403C]">
                            <Check className="w-3.5 h-3.5 text-[#946E3A] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Reservation Action */}
                    <div className="pt-6 border-t border-[#F2ECE3] flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-[#78716C] font-semibold">
                          Nightly Tariff
                        </div>
                        <div className="flex items-baseline gap-1 text-[#1C1917]">
                          <span className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#946E3A] tabular-nums">
                            ₹{room.pricePerNight.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-[#78716C]">/ night + taxes</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={room.available ? { scale: 1.04 } : {}}
                        whileTap={room.available ? { scale: 0.96 } : {}}
                        onClick={() => onSelectRoom(room)}
                        disabled={!room.available}
                        className={`px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm ${
                          room.available
                            ? 'bg-[#1C1917] hover:bg-[#946E3A] text-white'
                            : 'bg-[#EAE4DA] text-[#A8A29E] cursor-not-allowed border border-[#DFD7CB]'
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
      </motion.div>
    </section>
  );
};

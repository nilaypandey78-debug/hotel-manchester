import React from 'react';
import { MapPin, Phone, Sparkles, ChevronRight, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { useHotel } from '../context/HotelContext';
import { Branch } from '../types';
import { resolveHotelImage, ASSET_IMAGES } from '../utils/imageAssets';

interface BranchesPanelProps {
  onSelectBranchRooms: (branchId: string) => void;
  onOpenBranchPage: (branch: Branch) => void;
}

export const BranchesPanel: React.FC<BranchesPanelProps> = ({
  onSelectBranchRooms,
  onOpenBranchPage,
}) => {
  const { activeBranches, selectedBranchId, setSelectedBranchId } = useHotel();

  return (
    <section id="branches" className="py-24 bg-[#FAF8F5] border-t border-[#EAE4DA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Light Luxury Elegance */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#946E3A] font-semibold mb-3">
              <span>Nationwide Sanctuaries</span>
              <span aria-hidden="true">·</span>
              <span>{activeBranches.length} Iconic Estates</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1917] leading-tight">
              Retreats across India's most extraordinary terrains.
            </h2>
          </div>
          <p className="text-sm text-[#57534E] max-w-md font-light leading-relaxed">
            Each Hotel Manchester sanctuary is an architectural devotion to its landscape—from royal lakeside Mewari courtyards to Himalayan cedar ridges.
          </p>
        </motion.div>

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeBranches.map((branch: Branch, idx: number) => {
            const isSelected = selectedBranchId === branch.id;
            return (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 45, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.75, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
                className={`group relative rounded-2xl overflow-hidden bg-white border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#946E3A] shadow-[0_12px_35px_rgba(148,110,58,0.15)] ring-1 ring-[#946E3A]'
                    : 'border-[#EAE4DA] hover:border-[#946E3A] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]'
                }`}
              >
                {/* Branch Image with Hover Zoom */}
                <div
                  onClick={() => onOpenBranchPage(branch)}
                  className="relative aspect-[16/10] overflow-hidden bg-[#EAE4DA] cursor-pointer"
                  title={`View ${branch.name} sanctuary page`}
                >
                  <img
                    src={resolveHotelImage(branch.image)}
                    alt={branch.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = ASSET_IMAGES.palace;
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Location badge on top */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E2D8] text-[11px] text-[#1C1917] font-medium shadow-sm">
                    <MapPin className="w-3 h-3 text-[#946E3A]" />
                    <span>{branch.city}, {branch.state}</span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E2D8] text-[11px] text-[#946E3A] shadow-sm font-semibold">
                    <span className="tabular-nums">{branch.rating.toFixed(2)}</span>
                    <span>★</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-[#78716C] font-medium mb-1">
                      Sanctuary 0{idx + 1}
                    </div>
                    <button
                      onClick={() => onOpenBranchPage(branch)}
                      className="text-left w-full cursor-pointer focus:outline-none"
                    >
                      <h3 className="font-serif-luxury text-2xl font-light text-[#1C1917] group-hover:text-[#946E3A] transition-colors mb-2 leading-snug">
                        {branch.name}
                      </h3>
                    </button>
                    <p className="text-xs text-[#57534E] leading-relaxed mb-5">
                      {branch.tagline}
                    </p>

                    {/* Signature Experiences */}
                    <div className="pt-3 border-t border-[#F2ECE3] mb-5">
                      <div className="text-[10px] uppercase tracking-widest text-[#946E3A] font-semibold mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Signature Experiences
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#44403C]">
                        {branch.signatureExperiences.slice(0, 3).map((exp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#946E3A] shrink-0">·</span>
                            <span className="leading-snug">{exp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Dual Action: Explore Sanctuary Page & View Suites */}
                  <div className="pt-4 border-t border-[#F2ECE3] flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenBranchPage(branch)}
                      className="inline-flex items-center gap-1 text-xs text-[#946E3A] hover:text-[#6B4C20] font-medium transition-colors cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Sanctuary Page</span>
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setSelectedBranchId(branch.id);
                        onSelectBranchRooms(branch.id);
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-[#D8D0C5] hover:border-[#946E3A] hover:bg-[#FAF8F5] text-xs font-medium text-[#1C1917] transition-all cursor-pointer"
                    >
                      <span>View Suites</span>
                      <ChevronRight className="w-3 h-3 text-[#946E3A]" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

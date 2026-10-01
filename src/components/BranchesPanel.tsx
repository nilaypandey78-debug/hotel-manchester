import React from 'react';
import { MapPin, Phone, Mail, Sparkles, Compass, ChevronRight } from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { Branch } from '../types';

interface BranchesPanelProps {
  onSelectBranchRooms: (branchId: string) => void;
}

export const BranchesPanel: React.FC<BranchesPanelProps> = ({ onSelectBranchRooms }) => {
  const { branches, selectedBranchId, setSelectedBranchId } = useHotel();

  return (
    <section id="branches" className="py-24 bg-[#090a0c] border-t border-[#1c1e24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            {/* Clean unboxed metadata kicker */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#c5a880] font-medium mb-3">
              <span>Nationwide Sanctuaries</span>
              <span aria-hidden="true">·</span>
              <span>5 Iconic Destinies</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#f7f3ec] leading-tight">
              Retreats across India's most extraordinary terrains.
            </h2>
          </div>
          <p className="text-sm text-[#9b958b] max-w-md font-light leading-relaxed">
            Each Hotel Manchester sanctuary is an architectural devotion to its landscape—from royal lakeside Mewari courtyards to Himalayan cedar ridges.
          </p>
        </div>

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch: Branch, idx: number) => {
            const isSelected = selectedBranchId === branch.id;
            return (
              <div
                key={branch.id}
                className={`group relative rounded-2xl overflow-hidden bg-[#111317] border transition-all duration-500 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#c5a880] shadow-[0_0_30px_rgba(197,168,128,0.15)] ring-1 ring-[#c5a880]'
                    : 'border-[#22252c] hover:border-[#383d47]'
                }`}
              >
                {/* Branch Image with Hover Zoom */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#181a20]">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-[#111317]/30 to-transparent" />
                  
                  {/* Location badge on top */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b0c0e]/80 backdrop-blur-md border border-[#2d3038] text-[11px] text-[#e0ded8]">
                    <MapPin className="w-3 h-3 text-[#c5a880]" />
                    <span>{branch.city}, {branch.state}</span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0b0c0e]/80 backdrop-blur-md border border-[#2d3038] text-[11px] text-[#c5a880]">
                    <span className="font-semibold tabular-nums">{branch.rating.toFixed(2)}</span>
                    <span className="text-[#736e65]">★</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-[#827d74] font-medium mb-1">
                      Sanctuary 0{idx + 1}
                    </div>
                    <h3 className="font-serif-luxury text-2xl font-normal text-[#f7f3ec] group-hover:text-[#c5a880] transition-colors mb-2">
                      {branch.name}
                    </h3>
                    <p className="text-xs text-[#a8a39a] leading-relaxed mb-4">
                      {branch.tagline}
                    </p>

                    {/* Signature Experiences */}
                    <div className="pt-3 border-t border-[#1c1f26] mb-5">
                      <div className="text-[10px] uppercase tracking-widest text-[#c5a880] font-medium mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Signature Experiences
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#b8b3a8]">
                        {branch.signatureExperiences.map((exp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#c5a880] shrink-0">·</span>
                            <span className="leading-snug">{exp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Contact & Branch Filter Action */}
                  <div className="pt-4 border-t border-[#1c1f26] flex items-center justify-between gap-2">
                    <div className="text-[11px] text-[#78736a] flex flex-col">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#c5a880]" />
                        {branch.phone}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedBranchId(branch.id);
                        onSelectBranchRooms(branch.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#c5a880]/40 hover:border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0b0c0e] text-xs uppercase tracking-wider text-[#e0ded8] transition-all duration-300 font-medium cursor-pointer"
                    >
                      <span>View Suites</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

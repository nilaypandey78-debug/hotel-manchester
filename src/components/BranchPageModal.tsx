import React from 'react';
import { motion } from 'motion/react';
import { X, MapPin, Phone, Mail, Sparkles, Compass, EyeOff, RotateCcw, ArrowRight, Check } from 'lucide-react';
import { Branch, Room } from '../types';
import { useHotel } from '../context/HotelContext';
import { resolveHotelImage, ASSET_IMAGES } from '../utils/imageAssets';

interface BranchPageModalProps {
  branch: Branch;
  onClose: () => void;
  onSelectRoom: (room: Room) => void;
  isAdmin?: boolean;
}

export const BranchPageModal: React.FC<BranchPageModalProps> = ({
  branch,
  onClose,
  onSelectRoom,
  isAdmin = false,
}) => {
  const { rooms, removeBranch, restoreBranch, hotelContent } = useHotel();

  // Find all suites belonging to this sanctuary
  const branchRooms = rooms.filter((r) => r.branchId === branch.id);

  const handleToggleArchive = () => {
    if (branch.archived) {
      restoreBranch(branch.id);
    } else {
      removeBranch(branch.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-3 sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#E2DBD0] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.2)] overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Branch Page"
          className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#292524] shadow-md border border-[#E8E2D8] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Banner Header */}
        <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-[#EAE4DA] shrink-0">
          <img
            src={resolveHotelImage(branch.image)}
            alt={branch.name}
            onError={(e) => {
              e.currentTarget.src = ASSET_IMAGES.palace;
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/40 to-black/30" />

          {/* Location & Rating Overlays */}
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E8E2D8] text-xs font-medium text-[#1C1917] flex items-center gap-1.5 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#946E3A]" />
              <span>{branch.city}, {branch.state}</span>
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E8E2D8] text-xs font-semibold text-[#946E3A] shadow-sm">
              ★ {branch.rating.toFixed(2)}
            </span>
          </div>

          {/* Archived indicator if removed (Admin only) */}
          {isAdmin && branch.archived && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-medium flex items-center gap-1.5 shadow-sm">
              <EyeOff className="w-3.5 h-3.5 text-amber-700" />
              <span>Removed from Public View (Archived)</span>
            </div>
          )}
        </div>

        {/* Scrollable Sanctuary Details */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1">
          {/* Header Title & Tagline */}
          <div className="border-b border-[#EAE4DA] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#946E3A] font-semibold mb-1">
                Sanctuary &amp; Private Estate · {branch.country}
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1917] font-light">
                {branch.name}
              </h2>
              <p className="text-sm sm:text-base text-[#57534E] font-light mt-1.5 max-w-2xl leading-relaxed">
                {branch.tagline}
              </p>
            </div>

            {/* Admin-Only Remove / Restore Quick Toggle */}
            {isAdmin && (
              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={handleToggleArchive}
                  className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    branch.archived
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                  }`}
                  title={branch.archived ? 'Restore branch page to public website' : 'Remove branch page from public website'}
                >
                  {branch.archived ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Branch Page</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Remove Branch Page</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Quick Estate Details Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#EAE4DA] shadow-sm">
              <span className="text-[11px] uppercase tracking-wider text-[#78716C] block mb-1">
                Sanctuary Microclimate
              </span>
              <span className="text-sm font-medium text-[#1C1917]">
                {branch.climateNote || 'Serene breezes & pleasant evenings'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EAE4DA] shadow-sm">
              <span className="text-[11px] uppercase tracking-wider text-[#78716C] block mb-1">
                Estate Concierge
              </span>
              <span className="text-sm font-medium text-[#1C1917] block truncate">
                {branch.phone || hotelContent.contactNumber}
              </span>
              <span className="text-xs text-[#78716C] block truncate">
                {branch.email || hotelContent.conciergeEmail}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EAE4DA] shadow-sm">
              <span className="text-[11px] uppercase tracking-wider text-[#78716C] block mb-1">
                Physical Address
              </span>
              <span className="text-xs text-[#44403C] line-clamp-2">
                {branch.address}
              </span>
            </div>
          </div>

          {/* Signature Curated Experiences */}
          <div className="p-6 rounded-3xl bg-[#F4EFE7] border border-[#E3DBD0]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#946E3A] font-semibold mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Signature Estate Experiences</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {branch.signatureExperiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-[#E8E2D8] text-xs text-[#292524] shadow-sm flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#946E3A] mt-1 shrink-0" />
                  <span className="leading-relaxed">{exp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Available Suites & Residences at this Sanctuary */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif-luxury text-2xl text-[#1C1917] font-light">
                  Suites &amp; Villas at this Estate
                </h3>
                <p className="text-xs text-[#78716C]">
                  {branchRooms.length} private sanctuaries available for reservation
                </p>
              </div>
            </div>

            {branchRooms.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-[#EAE4DA] text-center text-xs text-[#78716C]">
                No suites currently listed for this branch. You can add or assign rooms from the Admin Console.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {branchRooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-4 rounded-2xl bg-white border border-[#EAE4DA] hover:border-[#946E3A] transition-all shadow-sm flex flex-col justify-between"
                  >
                    <div className="flex gap-3 mb-3">
                      <img
                        src={resolveHotelImage(room.image)}
                        alt={room.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#946E3A] font-medium block">
                          {room.category}
                        </span>
                        <h4 className="font-serif-luxury text-lg text-[#1C1917] leading-snug">
                          {room.name}
                        </h4>
                        <span className="text-xs font-mono font-medium text-[#946E3A]">
                          ₹{room.pricePerNight.toLocaleString('en-IN')} / night
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                      <span className="text-[11px] text-[#78716C]">
                        {room.sizeSqFt} sq.ft · Up to {room.capacityAdults} Adults
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectRoom(room);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1C1917] hover:bg-[#946E3A] text-white text-xs font-medium transition-colors cursor-pointer"
                      >
                        <span>Reserve</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-white border-t border-[#EAE4DA] flex items-center justify-between shrink-0">
          <div className="text-xs text-[#78716C]">
            <span>Hotel Manchester Sanctuary · Refined Aristocratic Hospitality</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#EAE4DA] hover:bg-[#DFD7CB] text-[#1C1917] text-xs font-medium transition-colors cursor-pointer"
          >
            Close Sanctuary Page
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

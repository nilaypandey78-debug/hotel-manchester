import React, { useState } from 'react';
import { Tag, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useHotel } from '../context/HotelContext';

export const BottomPromoBanner: React.FC = () => {
  const { promotions, hotelContent } = useHotel();
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activePromos = promotions.filter((p) => p.active);
  const currentPromo = activePromos[0];

  if (!currentPromo) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <aside
      aria-label="Promotional Offers and Social Media"
      className="fixed bottom-0 inset-x-0 z-30 pointer-events-none"
    >
      <div className="pointer-events-auto">
        <AnimatePresence mode="wait">
          {isMinimized ? (
            <motion.div
              key="minimized"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="flex justify-end max-w-7xl mx-auto px-4 pb-2"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsMinimized(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg bg-[#14161c] border-t border-x border-[#2d313c] text-[11px] text-[#c5a880] shadow-lg cursor-pointer"
              >
                <Tag className="w-3 h-3" />
                <span>Exclusive Sanctuary Offers</span>
                <ChevronUp className="w-3 h-3" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#111317]/95 backdrop-blur-md border-t border-[#262832] py-2.5 px-4 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]"
            >
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                {/* Offer Details */}
                <div className="flex items-center gap-3 overflow-hidden text-center md:text-left">
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#201d18] border border-[#c5a880]/40 text-[10px] text-[#c5a880] uppercase tracking-wider font-semibold shrink-0">
                    Special Privilege
                  </span>
                  <p className="text-[#f7f3ec] text-xs font-light truncate">
                    <span className="font-medium text-[#c5a880]">{currentPromo.title}:</span>{' '}
                    {currentPromo.description}
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopyCode(currentPromo.code)}
                    className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1c1f28] hover:bg-[#252936] text-[11px] font-mono text-[#e5cb9f] border border-[#2d3240] transition-colors shrink-0 cursor-pointer"
                  >
                    <span>{currentPromo.code}</span>
                    {copiedCode === currentPromo.code ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </motion.button>
                </div>

                {/* Social Links & Minimize Toggle */}
                <div className="flex items-center gap-5 shrink-0">
                  <div className="flex items-center gap-4 text-[#a8a39a]">
                    <a
                      href={hotelContent.socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#c5a880] transition-colors text-[11px] uppercase tracking-wider"
                    >
                      Instagram
                    </a>
                    <span className="text-[#343844] text-[10px]">·</span>
                    <a
                      href={hotelContent.socialLinks.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#c5a880] transition-colors text-[11px] uppercase tracking-wider"
                    >
                      YouTube
                    </a>
                    <span className="text-[#343844] text-[10px]">·</span>
                    <a
                      href={hotelContent.socialLinks.pinterest}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#c5a880] transition-colors text-[11px] uppercase tracking-wider"
                    >
                      Pinterest
                    </a>
                    <span className="text-[#343844] text-[10px]">·</span>
                    <a
                      href={hotelContent.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#c5a880] transition-colors text-[11px] uppercase tracking-wider"
                    >
                      LinkedIn
                    </a>
                  </div>

                  <button
                    onClick={() => setIsMinimized(true)}
                    title="Minimize promotional banner"
                    className="text-[#6d6860] hover:text-[#ede8df] p-1 cursor-pointer"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

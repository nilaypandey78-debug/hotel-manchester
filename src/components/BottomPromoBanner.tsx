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
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-t-xl bg-white border-t border-x border-[#EAE4DA] text-[11px] text-[#946E3A] font-semibold shadow-md cursor-pointer"
              >
                <Tag className="w-3 h-3" />
                <span>Sanctuary Privileges</span>
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
              className="bg-white/95 backdrop-blur-md border-t border-[#EAE4DA] py-2.5 px-4 shadow-[0_-10px_25px_rgba(0,0,0,0.06)]"
            >
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                {/* Offer Details */}
                <div className="flex items-center gap-3 overflow-hidden text-center md:text-left">
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF5EC] border border-[#E8DCC8] text-[10px] text-[#946E3A] uppercase tracking-wider font-semibold shrink-0">
                    Special Privilege
                  </span>
                  <p className="text-[#292524] text-xs font-light truncate">
                    <span className="font-semibold text-[#1C1917]">{currentPromo.title}:</span>{' '}
                    {currentPromo.description}
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopyCode(currentPromo.code)}
                    className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[11px] font-mono text-[#946E3A] font-semibold border border-[#EAE4DA] transition-colors shrink-0 cursor-pointer"
                  >
                    <span>{currentPromo.code}</span>
                    {copiedCode === currentPromo.code ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </motion.button>
                </div>

                {/* Social Links & Minimize Toggle */}
                <div className="flex items-center gap-5 shrink-0">
                  <div className="flex items-center gap-4 text-[#78716C]">
                    <a
                      href={hotelContent.socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#946E3A] transition-colors text-[11px] uppercase tracking-wider"
                    >
                      Instagram
                    </a>
                    <span className="text-[#D6CEC3] text-[10px]">·</span>
                    <a
                      href={hotelContent.socialLinks.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#946E3A] transition-colors text-[11px] uppercase tracking-wider"
                    >
                      YouTube
                    </a>
                    <span className="text-[#D6CEC3] text-[10px]">·</span>
                    <a
                      href={hotelContent.socialLinks.pinterest}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#946E3A] transition-colors text-[11px] uppercase tracking-wider"
                    >
                      Pinterest
                    </a>
                    <span className="text-[#D6CEC3] text-[10px]">·</span>
                    <a
                      href={hotelContent.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#946E3A] transition-colors text-[11px] uppercase tracking-wider"
                    >
                      LinkedIn
                    </a>
                  </div>

                  <button
                    onClick={() => setIsMinimized(true)}
                    title="Minimize promotional banner"
                    className="text-[#A8A29E] hover:text-[#1C1917] p-1 cursor-pointer"
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

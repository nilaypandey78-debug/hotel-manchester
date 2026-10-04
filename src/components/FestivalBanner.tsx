import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { FESTIVAL_THEMES } from '../utils/festivalThemes';

interface FestivalBannerProps {
  onExploreFestiveSuites?: () => void;
}

export const FestivalBanner: React.FC<FestivalBannerProps> = ({ onExploreFestiveSuites }) => {
  const { hotelContent } = useHotel();
  const [dismissed, setDismissed] = useState(false);

  const activeTheme = hotelContent.activeFestivalTheme || 'default';
  const themeConfig = FESTIVAL_THEMES[activeTheme];

  if (!hotelContent.showFestivalBanner || activeTheme === 'default' || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full bg-gradient-to-r ${themeConfig.bannerGradient} text-white text-xs relative z-50 overflow-hidden shadow-md`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 truncate">
            <span className="text-base select-none">{themeConfig.emoji}</span>
            <span className="font-serif-luxury font-medium tracking-wide text-[#FAF8F5] text-sm hidden sm:inline">
              {themeConfig.hindiName}:
            </span>
            <span className="text-white/95 font-medium truncate">
              {hotelContent.festivalGreetingTitle || themeConfig.defaultBannerText}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onExploreFestiveSuites && (
              <button
                onClick={onExploreFestiveSuites}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold text-[11px] uppercase tracking-wider backdrop-blur-sm transition-colors cursor-pointer"
              >
                <span>Reserve Festive Offer</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss festive announcement banner"
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

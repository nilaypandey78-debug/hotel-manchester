import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { soundscape } from '../utils/audioSoundscape';

interface WelcomeSplashProps {
  onEnter: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onEnter }) => {
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3200; // 3.2 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
      const prog = Math.min(100, (elapsed / duration) * 100);

      setSecondsLeft(remaining);
      setProgress(prog);

      if (elapsed >= duration) {
        clearInterval(interval);
        soundscape.start();
        onEnter();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onEnter]);

  const handleManualEnter = () => {
    soundscape.start();
    onEnter();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.05,
        filter: 'blur(12px)',
        pointerEvents: 'none',
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F5] text-[#1C1917] px-6 select-none overflow-hidden"
    >
        {/* Atmospheric luxury background: Multi-layered breathing warm gold & champagne radial glow */}
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(197,168,128,0.35)_0%,rgba(250,248,245,0.7)_50%,rgba(250,248,245,0.98)_100%)] pointer-events-none"
        />

        {/* Ambient floating champagne dust particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${15 + i * 14}%`,
                y: `${80 + (i % 3) * 10}%`,
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                y: `${10 + (i % 2) * 20}%`,
                opacity: [0, 0.7, 0],
                scale: [0.8, 1.4, 0.8],
              }}
              transition={{
                duration: 5 + i * 1.2,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'easeInOut',
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#B0894F] shadow-[0_0_8px_#D6CEC3]"
            />
          ))}
        </div>

        {/* Royal stationery architectural border framing */}
        <div className="absolute inset-8 sm:inset-12 border border-[#946E3A]/25 rounded-3xl pointer-events-none flex flex-col justify-between p-4 sm:p-6">
          <div className="flex justify-between items-start text-[#946E3A]/60 text-[10px] font-mono tracking-widest uppercase">
            <span>⌜ Sanctuary Gate</span>
            <span>Est. 1928 ⌝</span>
          </div>
          <div className="flex justify-between items-end text-[#946E3A]/60 text-[10px] font-mono tracking-widest uppercase">
            <span>⌞ Hotel Manchester</span>
            <span>India ⌟</span>
          </div>
        </div>

        {/* Center Sanctuary Emblem & Welcoming Content */}
        <div className="relative z-10 max-w-xl text-center flex flex-col items-center">
          {/* Animated Concentric Royal Monogram Crest */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-8"
          >
            {/* Rotating delicate golden hairline ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-3.5 rounded-full border border-dashed border-[#946E3A]/40"
            />

            {/* Glowing outer soft ring */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#946E3A]/25 to-transparent blur-sm" />

            {/* Central Monogram medallion */}
            <div className="w-20 h-20 rounded-full border border-[#946E3A]/60 flex items-center justify-center bg-white shadow-[0_10px_35px_rgba(148,110,58,0.18)]">
              <span className="font-serif-luxury text-3xl font-light text-[#946E3A] tracking-[0.2em] pl-1 select-none">
                HM
              </span>
            </div>
          </motion.div>

          {/* Luxury Typographic Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-[#946E3A] font-semibold mb-3.5"
          >
            <span className="w-6 h-[1px] bg-gradient-to-r from-transparent to-[#946E3A]/60" />
            <span>Private Sanctuaries &amp; Estates</span>
            <span className="w-6 h-[1px] bg-gradient-to-l from-transparent to-[#946E3A]/60" />
          </motion.div>

          {/* Majestic Brand Title */}
          <motion.h1
            initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-light text-[#1C1917] tracking-wide mb-5 leading-tight"
          >
            Hotel Manchester
          </motion.h1>

          {/* Poetic Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            className="text-sm sm:text-base text-[#57534E] max-w-md font-light leading-relaxed mb-10 px-2"
          >
            Where timeless silence, handcrafted comfort, and architectural quiet grandeur converge.
          </motion.p>

          {/* Interactive Welcoming Module */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            {/* Luminous Golden Hairline Progress Track */}
            <div className="w-64 sm:w-72 h-[3px] bg-[#EAE4DA] rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-[#B0894F] to-[#946E3A] rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                {/* Glowing leading head spark */}
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FAF8F5] shadow-[0_0_8px_#946E3A]" />
              </motion.div>
            </div>

            {/* Live Audio Frequency Indicator */}
            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#EAE4DA] text-[11px] text-[#57534E] font-medium shadow-sm mt-1">
              <div className="flex items-end gap-0.5 h-3 w-3 shrink-0 text-[#946E3A]">
                <motion.span
                  animate={{ height: ['20%', '80%', '40%', '100%'] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-0.5 bg-[#946E3A] rounded-full"
                />
                <motion.span
                  animate={{ height: ['60%', '20%', '90%', '50%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-0.5 bg-[#946E3A] rounded-full"
                />
                <motion.span
                  animate={{ height: ['30%', '100%', '30%', '70%'] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-0.5 bg-[#946E3A] rounded-full"
                />
              </div>
              <span>
                Preparing Sanctuary in <span className="font-mono text-[#946E3A] font-semibold">{secondsLeft}s</span> · Lakeside Palace Santoor (432Hz)
              </span>
            </div>

            {/* Refined Manual Fast-Forward Action Button */}
            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow: '0 0 30px rgba(148, 110, 58, 0.25)',
              }}
              whileTap={{ scale: 0.96 }}
              onClick={handleManualEnter}
              className="mt-3 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#1C1917] hover:bg-[#946E3A] text-xs uppercase tracking-[0.2em] font-semibold text-white transition-colors duration-200 cursor-pointer shadow-lg"
            >
              <span>Enter Sanctuary Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
  );
};

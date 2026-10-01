import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, ArrowRight, Compass } from 'lucide-react';
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.03,
          filter: 'blur(8px)',
          transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
        }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050608] text-[#f7f3ec] px-6 select-none overflow-hidden"
      >
        {/* Atmospheric luxury background: Multi-layered breathing gold radial glow */}
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.2, 0.38, 0.2],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(197,168,128,0.2)_0%,rgba(14,16,20,0.85)_50%,rgba(5,6,8,0.98)_100%)] pointer-events-none"
        />

        {/* Ambient floating dust particles / starlight embers */}
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
                opacity: [0, 0.6, 0],
                scale: [0.8, 1.4, 0.8],
              }}
              transition={{
                duration: 5 + i * 1.2,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'easeInOut',
              }}
              className="absolute w-1 h-1 rounded-full bg-[#e5cb9f] shadow-[0_0_8px_#c5a880]"
            />
          ))}
        </div>

        {/* Royal stationery architectural border framing */}
        <div className="absolute inset-8 sm:inset-12 border border-[#c5a880]/15 rounded-3xl pointer-events-none flex flex-col justify-between p-4 sm:p-6">
          <div className="flex justify-between items-start text-[#c5a880]/40 text-[10px] font-mono tracking-widest uppercase">
            <span>⌜ Sanctuary Gate</span>
            <span>Est. 1928 ⌝</span>
          </div>
          <div className="flex justify-between items-end text-[#c5a880]/40 text-[10px] font-mono tracking-widest uppercase">
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
              className="absolute -inset-3.5 rounded-full border border-dashed border-[#c5a880]/30"
            />

            {/* Glowing outer soft ring */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#c5a880]/20 to-transparent blur-sm" />

            {/* Central Monogram medallion */}
            <div className="w-20 h-20 rounded-full border border-[#c5a880]/60 flex items-center justify-center bg-[#0d0f14]/90 backdrop-blur-md shadow-[0_0_35px_rgba(197,168,128,0.2)]">
              <span className="font-serif-luxury text-3xl font-light text-[#f3e6cf] tracking-[0.2em] pl-1 select-none">
                HM
              </span>
            </div>
          </motion.div>

          {/* Luxury Typographic Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-[#c5a880] font-medium mb-3.5"
          >
            <span className="w-6 h-[1px] bg-gradient-to-r from-transparent to-[#c5a880]/60" />
            <span>Private Sanctuaries &amp; Estates</span>
            <span className="w-6 h-[1px] bg-gradient-to-l from-transparent to-[#c5a880]/60" />
          </motion.div>

          {/* Majestic Brand Title */}
          <motion.h1
            initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-light text-[#fdfaf5] tracking-wide mb-5 leading-tight"
          >
            Hotel Manchester
          </motion.h1>

          {/* Poetic Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55 }}
            className="text-sm sm:text-base text-[#b8b2a5] max-w-md font-light leading-relaxed mb-10 px-2"
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
            <div className="w-64 sm:w-72 h-[2.5px] bg-[#1a1d24] rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-[#9e7d50] via-[#dfc7a2] to-[#f4ecd8] rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                {/* Glowing leading head spark */}
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#fff5e0] shadow-[0_0_10px_#e5cb9f]" />
              </motion.div>
            </div>

            {/* Live Audio Frequency Indicator */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#111319]/80 border border-[#262934] text-[11px] text-[#a8a296] font-light mt-1">
              <div className="flex items-end gap-0.5 h-3 w-3 shrink-0 text-[#c5a880]">
                <motion.span
                  animate={{ height: ['20%', '80%', '40%', '100%'] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-0.5 bg-[#c5a880] rounded-full"
                />
                <motion.span
                  animate={{ height: ['60%', '20%', '90%', '50%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-0.5 bg-[#c5a880] rounded-full"
                />
                <motion.span
                  animate={{ height: ['30%', '100%', '30%', '70%'] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-0.5 bg-[#c5a880] rounded-full"
                />
              </div>
              <span>
                Preparing Sanctuary in <span className="font-mono text-[#e5cb9f] font-medium">{secondsLeft}s</span> · Lakeside Palace Santoor (432Hz)
              </span>
            </div>

            {/* Refined Manual Fast-Forward Action Button */}
            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow: '0 0 30px rgba(197, 168, 128, 0.35)',
                borderColor: 'rgba(197, 168, 128, 0.8)',
              }}
              whileTap={{ scale: 0.96 }}
              onClick={handleManualEnter}
              className="mt-3 inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#c5a880]/40 bg-[#12151c]/90 hover:bg-[#1a1e28] text-xs uppercase tracking-[0.2em] font-medium text-[#fbf7f0] transition-colors duration-200 cursor-pointer shadow-lg"
            >
              <span>Enter Sanctuary Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c5a880] group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

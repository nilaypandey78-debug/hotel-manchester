import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, ArrowRight } from 'lucide-react';
import { soundscape } from '../utils/audioSoundscape';

interface WelcomeSplashProps {
  onEnter: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onEnter }) => {
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3000; // 3 seconds

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
    }, 50);

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
        exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070809] text-[#f7f3ec] px-6 select-none overflow-hidden"
      >
        {/* Ambient background glow & luxury texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(197,168,128,0.12)_0%,rgba(7,8,9,0.95)_75%)] pointer-events-none" />

        {/* Subtle architectural lines */}
        <div className="absolute inset-x-0 top-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#c5a880]/20 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#c5a880]/20 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-xl text-center flex flex-col items-center">
          {/* Refined crest emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-16 rounded-full border border-[#c5a880]/40 flex items-center justify-center mb-8 bg-[#121417]/80 backdrop-blur-sm"
          >
            <span className="font-serif-luxury text-2xl font-light text-[#c5a880] tracking-widest">
              HM
            </span>
          </motion.div>

          {/* Subtitle kicker */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs uppercase tracking-[0.35em] text-[#c5a880] font-medium mb-3"
          >
            Private Sanctuaries &amp; Estates
          </motion.p>

          {/* Brand Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl font-light text-[#f7f3ec] tracking-wide mb-6 leading-tight"
          >
            Hotel Manchester
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="text-sm sm:text-base text-[#a8a39a] max-w-md font-light leading-relaxed mb-10"
          >
            Where timeless silence, handcrafted comfort, and architectural serenity converge.
          </motion.p>

          {/* 3-Second Circular / Linear Progress & Audio Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col items-center gap-4 w-full"
          >
            {/* Progress bar */}
            <div className="w-56 h-[2px] bg-[#1e2024] rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#a7885b] to-[#e5cb9f] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-[#8c877e] font-light">
              <Volume2 className="w-3.5 h-3.5 text-[#c5a880] animate-pulse" />
              <span>Welcoming in {secondsLeft}s · Lakeside Palace Serenade (432Hz)</span>
            </div>

            {/* Fast-forward action button */}
            <button
              onClick={handleManualEnter}
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#c5a880]/30 hover:border-[#c5a880] bg-[#14161a]/60 hover:bg-[#1f2228] text-xs uppercase tracking-widest text-[#f0e8dc] transition-all duration-300"
            >
              <span>Enter Sanctuary Now</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c5a880]" />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

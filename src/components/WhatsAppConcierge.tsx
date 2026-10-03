import React, { useState } from 'react';
import { MessageCircle, X, Send, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useHotel } from '../context/HotelContext';

export const WhatsAppConcierge: React.FC = () => {
  const { hotelContent } = useHotel();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickPrompts = [
    'Inquire regarding Presidential Penthouse availability & private rates',
    'Arrange private airport luxury transfer or helicopter charter',
    'Inquire about romantic anniversary dinner on private jetty',
    'Follow up on our recent UPI payment verification',
  ];

  const handleLaunchWhatsApp = (text: string) => {
    const cleanNumber = hotelContent.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
      `Greetings Hotel Manchester Concierge. ${text}`
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-14 right-5 z-40">
      {/* Floating Action Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsOpen(true)}
            aria-label="Contact Hotel Manchester Concierge on WhatsApp"
            className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-[#1caa59] hover:bg-[#18994f] text-white shadow-[0_10px_25px_rgba(28,170,89,0.35)] transition-colors cursor-pointer"
          >
            {/* Subtle radar pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#1caa59] animate-ping opacity-25" />
            
            <MessageCircle className="w-6 h-6 fill-current relative z-10" />

            {/* Tooltip on hover */}
            <span className="absolute right-full mr-3 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E2D8] text-xs text-[#1C1917] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl flex items-center gap-1.5">
              <span>WhatsApp Concierge:</span>
              <span className="font-mono text-[#1caa59] font-medium">{hotelContent.whatsappNumber}</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Interactive Concierge Drawer Popover in Luxury Light Aesthetic */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-80 sm:w-96 rounded-3xl bg-white border border-[#E2DBD0] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-[#FAF8F5] border-b border-[#EAE4DA] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1caa59] flex items-center justify-center text-white shadow-md">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1C1917]">
                    Sanctuary Concierge
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Online · {hotelContent.whatsappNumber}</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE4DA] transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Body Content */}
            <div className="p-4 space-y-3 bg-[#FAF8F5]/60 max-h-[380px] overflow-y-auto">
              <div className="p-3.5 rounded-2xl bg-white border border-[#EAE4DA] text-xs text-[#44403C] leading-relaxed shadow-sm">
                Welcome to Hotel Manchester. How may our Chief Concierge attend to your sanctuary stay today?
              </div>

              <div className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold pt-1">
                Immediate Inquiries
              </div>

              <div className="space-y-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLaunchWhatsApp(prompt)}
                    className="w-full text-left p-3 rounded-xl bg-white hover:bg-[#F5EEDB] border border-[#EAE4DA] hover:border-[#946E3A] text-xs text-[#44403C] hover:text-[#1C1917] transition-all flex items-center justify-between group cursor-pointer shadow-sm"
                  >
                    <span className="truncate pr-2">{prompt}</span>
                    <ExternalLink className="w-3 h-3 text-[#946E3A] shrink-0 opacity-70 group-hover:opacity-100" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Direct Custom Message Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customMsg.trim()) handleLaunchWhatsApp(customMsg);
              }}
              className="p-3 bg-white border-t border-[#EAE4DA] flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type your inquiry..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-full bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#946E3A]"
              />
              <motion.button
                whileTap={{ scale: 0.92 }}
                type="submit"
                disabled={!customMsg.trim()}
                className={`p-2 rounded-full transition-all duration-200 ${
                  customMsg.trim()
                    ? 'bg-[#1caa59] text-white hover:bg-[#18994f] cursor-pointer'
                    : 'bg-[#EAE4DA] text-[#A8A29E] cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

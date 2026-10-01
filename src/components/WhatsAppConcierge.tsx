import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, ExternalLink, Clock } from 'lucide-react';
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
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Contact Hotel Manchester Concierge on WhatsApp"
          className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-[#1caa59] hover:bg-[#18994f] text-white shadow-[0_10px_25px_rgba(28,170,89,0.35)] transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          {/* Subtle radar pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#1caa59] animate-ping opacity-25" />
          
          <MessageCircle className="w-6 h-6 fill-current relative z-10" />

          {/* Tooltip on hover */}
          <span className="absolute right-full mr-3 px-3 py-1 rounded-full bg-[#101217] border border-[#262932] text-xs text-[#f7f3ec] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            Resort Concierge WhatsApp
          </span>
        </button>
      )}

      {/* Interactive Concierge Drawer Popover */}
      {isOpen && (
        <div className="relative w-80 sm:w-96 rounded-3xl bg-[#101218] border border-[#272a34] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#141720] to-[#1a1f2c] border-b border-[#242733] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1caa59] flex items-center justify-center text-white shadow-md">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#f7f3ec]">
                  Sanctuary Concierge
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online · Direct Assistance</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-[#827d74] hover:text-[#f7f3ec] hover:bg-[#20232c] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3 bg-[#0d0e13]/60 max-h-[380px] overflow-y-auto">
            <div className="p-3 rounded-2xl bg-[#171922] border border-[#262a36] text-xs text-[#d6d0c4] leading-relaxed">
              Welcome to Hotel Manchester. How may our Chief Concierge attend to your stay today?
            </div>

            <div className="text-[10px] uppercase tracking-wider text-[#827d74] font-medium pt-1">
              Immediate Inquiries
            </div>

            <div className="space-y-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLaunchWhatsApp(prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#14161f] hover:bg-[#1c202d] border border-[#222530] text-xs text-[#a8a39a] hover:text-[#f7f3ec] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate pr-2">{prompt}</span>
                  <ExternalLink className="w-3 h-3 text-[#c5a880] shrink-0 opacity-60 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          {/* Direct Custom Message Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customMsg.trim()) handleLaunchWhatsApp(customMsg);
            }}
            className="p-3 bg-[#13151c] border-t border-[#232632] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your inquiry..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-full bg-[#1b1e27] border border-[#2c303c] text-xs text-[#f7f3ec] placeholder:text-[#6a655c] focus:outline-none focus:border-[#c5a880]"
            />
            <button
              type="submit"
              disabled={!customMsg.trim()}
              className={`p-2 rounded-full transition-all duration-200 ${
                customMsg.trim()
                  ? 'bg-[#1caa59] text-white hover:bg-[#18994f] cursor-pointer'
                  : 'bg-[#22252e] text-[#55524c] cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

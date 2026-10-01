import React from 'react';
import { useHotel } from '../context/HotelContext';
import { MapPin, Phone, Mail, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigateToSection: (id: string) => void;
  onOpenAdmin: () => void;
  onOpenDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToSection,
  onOpenAdmin,
  onOpenDashboard,
}) => {
  const { hotelContent, branches } = useHotel();

  return (
    <footer className="bg-[#060708] border-t border-[#1a1c22] text-[#8c877e] pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#181a20]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif-luxury text-2xl font-light text-[#f7f3ec] tracking-wide block">
              Hotel Manchester
            </span>
            <p className="text-xs text-[#9c968b] max-w-sm font-light leading-relaxed">
              {hotelContent.welcomingHeadline}. Private sanctuaries across Udaipur, Goa, Shimla, Kerala, and Mumbai.
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-[#a8a39a]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{hotelContent.contactNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{hotelContent.conciergeEmail}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-widest text-[#f7f3ec] font-medium">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateToSection('suites')}
                  className="hover:text-[#c5a880] transition-colors cursor-pointer"
                >
                  Suites &amp; Villas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('branches')}
                  className="hover:text-[#c5a880] transition-colors cursor-pointer"
                >
                  Nationwide Branches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('experiences')}
                  className="hover:text-[#c5a880] transition-colors cursor-pointer"
                >
                  Dining &amp; Ayurveda
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDashboard}
                  className="hover:text-[#c5a880] transition-colors cursor-pointer"
                >
                  Reservation Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Sanctuary Branches */}
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-widest text-[#f7f3ec] font-medium">
              Sanctuaries
            </div>
            <ul className="space-y-2 text-xs">
              {branches.map((b) => (
                <li key={b.id}>
                  <button
                    onClick={() => onNavigateToSection('branches')}
                    className="hover:text-[#c5a880] transition-colors cursor-pointer text-left"
                  >
                    {b.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Guest Services & Admin */}
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-widest text-[#f7f3ec] font-medium">
              Concierge Desk
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-[#a8a39a]">Instant UPI QR Gateway</span>
              </li>
              <li>
                <span className="text-[#a8a39a]">Direct WhatsApp Service</span>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-[#c5a880] hover:underline cursor-pointer"
                >
                  Admin &amp; Concierge Console
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#635f58] gap-4">
          <div>
            © {new Date().getFullYear()} Hotel Manchester Luxury Resorts Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Sanctuary Stay</span>
            <span aria-hidden="true">·</span>
            <span>VPA: {hotelContent.upiVpa}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

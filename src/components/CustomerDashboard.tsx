import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Download,
  AlertTriangle,
  CheckCircle2,
  Hourglass,
  ArrowLeft,
  XCircle,
  Sparkles,
  Phone
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { Booking } from '../types';

interface CustomerDashboardProps {
  onBackToHome: () => void;
  selectedBookingCode?: string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onBackToHome,
  selectedBookingCode,
}) => {
  const { bookings, messages, sendMessage, cancelBooking, hotelContent } = useHotel();

  const [activeBookingId, setActiveBookingId] = useState<string>(() => {
    if (selectedBookingCode) {
      const match = bookings.find((b) => b.bookingCode === selectedBookingCode);
      if (match) return match.id;
    }
    return bookings[0]?.id || '';
  });

  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState(selectedBookingCode || '');

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bookingCode.toLowerCase().includes(q) ||
      b.guestDetails.fullName.toLowerCase().includes(q) ||
      b.guestDetails.email.toLowerCase().includes(q)
    );
  });

  const activeBooking = bookings.find((b) => b.id === activeBookingId) || filteredBookings[0];

  // Messages thread for this booking
  const activeMessages = messages.filter((m) => m.bookingId === activeBooking?.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeBooking) return;

    sendMessage(
      activeBooking.id,
      activeBooking.guestDetails.fullName,
      activeBooking.guestDetails.email,
      'guest',
      chatInput.trim()
    );
    setChatInput('');
  };

  const getStatusBadge = (status: Booking['paymentStatus']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-semibold shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified &amp; Reserved
          </span>
        );
      case 'checked_in':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-300 text-xs text-blue-800 font-semibold shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            Checked In
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-300 text-xs text-neutral-600 font-medium">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      case 'pending_upi':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-xs text-amber-800 font-semibold shadow-sm">
            <Hourglass className="w-3.5 h-3.5 animate-spin" />
            Awaiting Verification
          </span>
        );
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-[#FAF8F5]">
      {/* Back button and page title */}
      <div className="flex items-center justify-between border-b border-[#EAE4DA] pb-6">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer group font-semibold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#946E3A]" />
          <span>Return to Hotel Manchester</span>
        </button>

        <div className="text-right">
          <span className="text-[10px] uppercase tracking-widest text-[#946E3A] block font-semibold">
            Guest Portal
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl text-[#1C1917] font-light">
            Sanctuary Reservations
          </h1>
        </div>
      </div>

      {/* Main Body */}
      <div className="space-y-6">
        {/* Search / Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#EAE4DA] shadow-sm">
          <div className="text-xs text-[#57534E]">
            Search by your <span className="font-mono text-[#946E3A] font-semibold">HM-XXXX</span> booking reference or guest email.
          </div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search code or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#946E3A]"
            />
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#EAE4DA] max-w-lg mx-auto p-8 shadow-sm">
            <Calendar className="w-12 h-12 text-[#A8A29E] mx-auto mb-4" />
            <h3 className="font-serif-luxury text-xl text-[#1C1917] mb-2">No Reservations Found</h3>
            <p className="text-xs text-[#78716C] mb-6">
              You haven't reserved a sanctuary yet or the booking code doesn't match our records.
            </p>
            <button
              onClick={onBackToHome}
              className="px-6 py-2.5 rounded-full bg-[#1C1917] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#946E3A] transition-colors cursor-pointer"
            >
              Explore Accommodations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Booking Selector List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="text-[11px] uppercase tracking-widest text-[#78716C] font-semibold px-1">
                Your Sanctuary Stays ({filteredBookings.length})
              </div>

              {filteredBookings.map((b) => {
                const isSelected = activeBooking?.id === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setActiveBookingId(b.id)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm ${
                      isSelected
                        ? 'bg-white border-[#946E3A] shadow-md ring-1 ring-[#946E3A]'
                        : 'bg-white border-[#EAE4DA] hover:border-[#D8D0C5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-semibold text-[#946E3A]">
                        {b.bookingCode}
                      </span>
                      {getStatusBadge(b.paymentStatus)}
                    </div>

                    <h4 className="font-serif-luxury text-lg text-[#1C1917] font-medium truncate">
                      {b.roomName}
                    </h4>

                    <div className="text-xs text-[#78716C] mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#946E3A] shrink-0" />
                      <span className="truncate">{b.branchName}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#F2ECE3] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#78716C]">{b.checkInDate}</span>
                      <span className="text-[#1C1917] font-semibold">
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Detailed View & Live Concierge Chat */}
            {activeBooking && (
              <div className="lg:col-span-8 space-y-6">
                {/* Active Booking Hero Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE4DA] shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F0EAE1] gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#78716C] font-semibold">
                        <span>Sanctuary Voucher</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[#946E3A]">{activeBooking.bookingCode}</span>
                      </div>
                      <h2 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#1C1917] mt-1">
                        {activeBooking.roomName}
                      </h2>
                      <p className="text-xs text-[#78716C] mt-0.5">{activeBooking.branchName}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(activeBooking.paymentStatus)}
                      <button
                        onClick={() => window.print()}
                        title="Print sanctuary confirmation voucher"
                        className="p-2.5 rounded-full border border-[#D8D0C5] hover:border-[#946E3A] text-[#946E3A] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-b border-[#F0EAE1] text-xs">
                    <div>
                      <span className="text-[#78716C] block text-[10px] uppercase tracking-wider font-semibold mb-1">
                        Dates of Stay
                      </span>
                      <span className="text-[#1C1917] font-semibold">
                        {activeBooking.checkInDate} — {activeBooking.checkOutDate}
                      </span>
                      <span className="text-[#78716C] block text-[11px] mt-0.5">
                        ({activeBooking.nights} Nights)
                      </span>
                    </div>

                    <div>
                      <span className="text-[#78716C] block text-[10px] uppercase tracking-wider font-semibold mb-1">
                        Reserved For
                      </span>
                      <span className="text-[#1C1917] font-semibold">
                        {activeBooking.guestDetails.fullName}
                      </span>
                      <span className="text-[#78716C] block text-[11px] mt-0.5">
                        {activeBooking.guests.adults} Adults, {activeBooking.guests.children} Children
                      </span>
                    </div>

                    <div>
                      <span className="text-[#78716C] block text-[10px] uppercase tracking-wider font-semibold mb-1">
                        UPI Transaction UTR
                      </span>
                      <span className="text-[#946E3A] font-mono font-semibold">
                        {activeBooking.guestDetails.upiUtr || 'Awaiting Verification'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#78716C] block text-[10px] uppercase tracking-wider font-semibold mb-1">
                        Total Tariff
                      </span>
                      <span className="font-serif-luxury text-xl font-bold text-[#946E3A]">
                        ₹{activeBooking.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Curated Inclusions */}
                  <div className="py-6 border-b border-[#F0EAE1] space-y-3">
                    <span className="text-[10px] uppercase tracking-widest text-[#78716C] font-semibold block">
                      Confirmed Itinerary Inclusions
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeBooking.addOns.map((add, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#EAE4DA] text-xs text-[#44403C] font-medium"
                        >
                          ✦ {add}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cancellation Action */}
                  {activeBooking.paymentStatus !== 'cancelled' && (
                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-xs text-[#78716C]">
                        Need modifications? Message our concierge below or cancel directly.
                      </span>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you wish to cancel this sanctuary reservation?')) {
                            cancelBooking(activeBooking.id);
                          }
                        }}
                        className="text-xs text-rose-700 hover:text-rose-900 hover:underline cursor-pointer font-medium"
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  )}
                </div>

                {/* 24/7 Live Concierge Chat Thread for this Reservation */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE4DA] shadow-md flex flex-col h-[520px]">
                  {/* Chat Header */}
                  <div className="pb-4 border-b border-[#F0EAE1] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FAF5EC] border border-[#E8DCC8] flex items-center justify-center text-[#946E3A]">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif-luxury text-lg text-[#1C1917] font-medium">
                          Chief Concierge Desk
                        </h3>
                        <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Direct Assistant Online</span>
                        </p>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${hotelContent.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-semibold hover:bg-emerald-100 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp Concierge</span>
                    </a>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {activeMessages.length === 0 ? (
                      <div className="text-center py-12 text-xs text-[#78716C]">
                        Your dedicated concierge has been assigned. Send any requests for early arrival, champagne, or private dining.
                      </div>
                    ) : (
                      activeMessages.map((msg) => {
                        const isGuest = msg.sender === 'guest';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isGuest ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[10px] text-[#A8A29E] mb-1 px-1">
                              {isGuest ? 'You' : 'Sanctuary Concierge'} ·{' '}
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <div
                              className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                                isGuest
                                  ? 'bg-[#1C1917] text-[#FAF8F5] rounded-br-none'
                                  : 'bg-[#FAF8F5] border border-[#EAE4DA] text-[#1C1917] rounded-bl-none'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input Form */}
                  <form
                    onSubmit={handleSendMessage}
                    className="pt-4 border-t border-[#F0EAE1] flex items-center gap-3"
                  >
                    <input
                      type="text"
                      placeholder="Message your Chief Concierge regarding this stay..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-full bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#946E3A]"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className={`p-2.5 rounded-full transition-all duration-200 cursor-pointer shadow-sm ${
                        chatInput.trim()
                          ? 'bg-[#1C1917] text-white hover:bg-[#946E3A]'
                          : 'bg-[#EAE4DA] text-[#A8A29E] cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

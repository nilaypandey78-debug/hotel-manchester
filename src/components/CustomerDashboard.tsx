import React, { useState } from 'react';
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

  const bookingMessages = activeBooking
    ? messages.filter((m) => m.bookingId === activeBooking.id)
    : [];

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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[11px] text-emerald-300 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Verified &amp; Guaranteed
          </span>
        );
      case 'pending_upi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-[11px] text-amber-300 font-medium">
            <Hourglass className="w-3.5 h-3.5 text-amber-400" />
            Awaiting Concierge Verification
          </span>
        );
      case 'checked_in':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/40 text-[11px] text-blue-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Checked In · Enjoy Your Sanctuary
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-500/40 text-[11px] text-rose-300 font-medium">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-[#ede8df] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#1c1f27]">
          <div>
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#a8a39a] hover:text-[#c5a880] transition-colors mb-3 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Sanctuaries</span>
            </button>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#f7f3ec]">
              Guest Sanctuary Portal
            </h1>
            <p className="text-xs text-[#8c877e] mt-1 font-light">
              Manage your retreat reservations, cross-reference UPI receipts, and talk directly to your personal resort concierge.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search code or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full bg-[#13151b] border border-[#272b35] text-xs text-[#f7f3ec] placeholder:text-[#6a655c] focus:outline-none focus:border-[#c5a880]"
            />
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-[#101217] rounded-3xl border border-[#20232c] max-w-lg mx-auto p-8">
            <Calendar className="w-12 h-12 text-[#68635a] mx-auto mb-4" />
            <h3 className="font-serif-luxury text-xl text-[#f7f3ec] mb-2">No Reservations Found</h3>
            <p className="text-xs text-[#8a857b] mb-6">
              You haven't reserved a sanctuary yet or the booking code doesn't match our records.
            </p>
            <button
              onClick={onBackToHome}
              className="px-6 py-2.5 rounded-full bg-[#c5a880] text-[#090a0d] text-xs uppercase tracking-widest font-semibold cursor-pointer"
            >
              Explore Accommodations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Booking Selector List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="text-[11px] uppercase tracking-widest text-[#827d74] font-medium px-1">
                Your Sanctuary Stays ({filteredBookings.length})
              </div>

              {filteredBookings.map((b) => {
                const isSelected = activeBooking?.id === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setActiveBookingId(b.id)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-[#151821] border-[#c5a880] shadow-xl'
                        : 'bg-[#101218] border-[#20232b] hover:border-[#303440]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-semibold text-[#c5a880]">
                        {b.bookingCode}
                      </span>
                      {getStatusBadge(b.paymentStatus)}
                    </div>

                    <h4 className="font-serif-luxury text-lg text-[#f7f3ec] font-normal truncate">
                      {b.roomName}
                    </h4>

                    <div className="text-xs text-[#8c877e] mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                      <span className="truncate">{b.branchName}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#1c1f27] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#a8a39a]">{b.checkInDate}</span>
                      <span className="text-[#f7f3ec] font-semibold">
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
                <div className="p-6 sm:p-8 rounded-3xl bg-[#111319] border border-[#21242e] shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#212530] gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#827d74] font-medium">
                        <span>Sanctuary Voucher</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[#c5a880]">{activeBooking.bookingCode}</span>
                      </div>
                      <h2 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#f7f3ec] mt-1">
                        {activeBooking.roomName}
                      </h2>
                      <p className="text-xs text-[#9c968b] mt-0.5">{activeBooking.branchName}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(activeBooking.paymentStatus)}
                      <button
                        onClick={() => window.print()}
                        title="Print sanctuary confirmation voucher"
                        className="p-2.5 rounded-full border border-[#2d313d] hover:border-[#c5a880] text-[#c5a880] hover:bg-[#1a1c24] transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-b border-[#212530] text-xs">
                    <div>
                      <span className="text-[#827d74] block text-[10px] uppercase tracking-wider mb-1">
                        Dates of Stay
                      </span>
                      <span className="text-[#f7f3ec] font-medium">
                        {activeBooking.checkInDate} — {activeBooking.checkOutDate}
                      </span>
                      <span className="text-[#827d74] block text-[11px] mt-0.5">
                        ({activeBooking.nights} Nights)
                      </span>
                    </div>

                    <div>
                      <span className="text-[#827d74] block text-[10px] uppercase tracking-wider mb-1">
                        Reserved For
                      </span>
                      <span className="text-[#f7f3ec] font-medium">
                        {activeBooking.guestDetails.fullName}
                      </span>
                      <span className="text-[#827d74] block text-[11px] mt-0.5">
                        {activeBooking.guests.adults} Adults, {activeBooking.guests.children} Children
                      </span>
                    </div>

                    <div>
                      <span className="text-[#827d74] block text-[10px] uppercase tracking-wider mb-1">
                        UPI Transaction UTR
                      </span>
                      <span className="text-[#c5a880] font-mono font-medium">
                        {activeBooking.guestDetails.upiUtr || 'Pending Submission'}
                      </span>
                      <span className="text-[#827d74] block text-[11px] mt-0.5">
                        VPA: {hotelContent.upiVpa}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#827d74] block text-[10px] uppercase tracking-wider mb-1">
                        Tariff Paid
                      </span>
                      <span className="font-serif-luxury text-xl text-[#f7f3ec] font-normal">
                        ₹{activeBooking.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Tailored Add-Ons & Preferences */}
                  <div className="py-4 border-b border-[#212530] flex flex-wrap gap-4 text-xs">
                    {activeBooking.addOns.length > 0 && (
                      <div className="flex-1">
                        <span className="text-[#827d74] block text-[10px] uppercase tracking-wider mb-1.5">
                          Selected Bespoke Add-ons
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {activeBooking.addOns.map((add, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-md bg-[#181a22] text-[#d4cebe] border border-[#2b2f3a]"
                            >
                              {add}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeBooking.guestDetails.pillowPreference && (
                      <div>
                        <span className="text-[#827d74] block text-[10px] uppercase tracking-wider mb-1.5">
                          Pillow Request
                        </span>
                        <span className="text-[#ede8df]">
                          {activeBooking.guestDetails.pillowPreference}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Cancellation Action */}
                  {activeBooking.paymentStatus !== 'cancelled' && (
                    <div className="pt-4 flex items-center justify-between text-xs">
                      <span className="text-[#7a756c]">
                        Need to adjust dates or cancel your sanctuary stay?
                      </span>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you wish to cancel this sanctuary reservation?')) {
                            cancelBooking(activeBooking.id);
                          }
                        }}
                        className="text-rose-400/80 hover:text-rose-300 underline cursor-pointer"
                      >
                        Request Reservation Cancellation
                      </button>
                    </div>
                  )}
                </div>

                {/* Built-in Two-Way Messaging with Resort Concierge */}
                <div className="rounded-3xl bg-[#111319] border border-[#21242e] shadow-2xl overflow-hidden flex flex-col h-[460px]">
                  {/* Chat Header */}
                  <div className="px-6 py-4 bg-[#141720] border-b border-[#212530] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1e222d] border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880]">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[#f7f3ec]">
                          Resort Concierge Desk
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Active 24/7 Dedicated Support</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-[#827d74]">
                      Ref: <span className="font-mono text-[#c5a880]">{activeBooking.bookingCode}</span>
                    </div>
                  </div>

                  {/* Messages Stream */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#0e1015]/60">
                    {bookingMessages.length === 0 ? (
                      <div className="text-center py-12 text-xs text-[#736e65]">
                        No prior messages. Inquire about private dining, airport transfers, or custom arrangements.
                      </div>
                    ) : (
                      bookingMessages.map((msg) => {
                        const isGuest = msg.sender === 'guest';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isGuest ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[10px] text-[#736e65] mb-1 px-1">
                              {isGuest ? 'You (Guest)' : 'Resort Concierge'} ·{' '}
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <div
                              className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                                isGuest
                                  ? 'bg-[#c5a880] text-[#090a0d] rounded-tr-none font-medium'
                                  : 'bg-[#181b24] text-[#ece7dc] border border-[#292d3a] rounded-tl-none'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Chat Input Bar */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-3 bg-[#13151c] border-t border-[#212530] flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Message the Hotel Manchester concierge team..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-full bg-[#1b1e27] border border-[#2b2f3c] text-xs text-[#f7f3ec] placeholder:text-[#6e695f] focus:outline-none focus:border-[#c5a880]"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className={`p-2.5 rounded-full transition-all duration-200 ${
                        chatInput.trim()
                          ? 'bg-[#c5a880] text-[#090a0d] cursor-pointer hover:bg-[#d8be96]'
                          : 'bg-[#22252e] text-[#55524c] cursor-not-allowed'
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

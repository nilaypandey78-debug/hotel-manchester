import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Layers,
  CalendarCheck,
  MessageSquare,
  DollarSign,
  Tag,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Save,
  Send,
  Sparkles,
  Phone,
  RefreshCw,
  Edit2
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { Room, Booking, PromotionalOffer } from '../types';

interface AdminPanelProps {
  onBackToHome: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToHome }) => {
  const {
    rooms,
    updateRoom,
    toggleRoomAvailability,
    bookings,
    updateBookingStatus,
    messages,
    sendMessage,
    promotions,
    updatePromotion,
    hotelContent,
    updateHotelContent,
    resetAllData,
  } = useHotel();

  const [activeTab, setActiveTab] = useState<'bookings' | 'rooms' | 'messages' | 'content'>('bookings');
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomEditForm, setRoomEditForm] = useState<Room | null>(null);

  // Active chat thread for messaging
  const [selectedChatBookingId, setSelectedChatBookingId] = useState<string>(() => bookings[0]?.id || '');
  const [adminReplyText, setAdminReplyText] = useState('');

  // Content form
  const [contentForm, setContentForm] = useState(hotelContent);
  const [savedNotice, setSavedNotice] = useState(false);

  // Filter bookings
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending_upi' | 'verified' | 'checked_in' | 'cancelled'>('all');

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.paymentStatus === bookingFilter;
  });

  const handleStartEditRoom = (room: Room) => {
    setEditingRoomId(room.id);
    setRoomEditForm({ ...room });
  };

  const handleSaveRoom = () => {
    if (!roomEditForm) return;
    updateRoom(roomEditForm);
    setEditingRoomId(null);
    setRoomEditForm(null);
    triggerSaved();
  };

  const handleSendAdminMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedChatBookingId) return;

    const b = bookings.find((item) => item.id === selectedChatBookingId);
    if (!b) return;

    sendMessage(
      b.id,
      b.guestDetails.fullName,
      b.guestDetails.email,
      'concierge',
      adminReplyText.trim()
    );
    setAdminReplyText('');
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateHotelContent(contentForm);
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // Group messages by booking
  const chatThreads = bookings.map((b) => {
    const threadMsgs = messages.filter((m) => m.bookingId === b.id);
    const lastMsg = threadMsgs[threadMsgs.length - 1];
    return {
      booking: b,
      messages: threadMsgs,
      lastMessage: lastMsg,
    };
  });

  const activeThread = chatThreads.find((t) => t.booking.id === selectedChatBookingId) || chatThreads[0];

  return (
    <div className="min-h-screen bg-[#070809] text-[#ede8df] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Admin Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#1c1f26]">
          <div>
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#a8a39a] hover:text-[#c5a880] transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Resort</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="font-serif-luxury text-3xl font-light text-[#f7f3ec]">
                Manchester Admin &amp; Concierge Console
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1b1915] border border-[#c5a880]/40 text-[10px] text-[#c5a880] font-mono uppercase tracking-widest">
                Real-Time Sync
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-[#12141a] rounded-xl border border-[#21242e] overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-[#c5a880] text-[#090a0d] shadow-sm font-semibold'
                  : 'text-[#9c968b] hover:text-[#ede8df]'
              }`}
            >
              Reservations ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'rooms'
                  ? 'bg-[#c5a880] text-[#090a0d] shadow-sm font-semibold'
                  : 'text-[#9c968b] hover:text-[#ede8df]'
              }`}
            >
              Rooms &amp; Pricing ({rooms.length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-[#c5a880] text-[#090a0d] shadow-sm font-semibold'
                  : 'text-[#9c968b] hover:text-[#ede8df]'
              }`}
            >
              Guest Messaging
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-[#c5a880] text-[#090a0d] shadow-sm font-semibold'
                  : 'text-[#9c968b] hover:text-[#ede8df]'
              }`}
            >
              Content &amp; Promos
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between">
            <span>✓ Changes committed to Hotel Manchester database in real-time.</span>
          </div>
        )}

        {/* Tab Contents with AnimatePresence */}
        <AnimatePresence mode="wait">
          {/* TAB 1: Bookings Management */}
          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Filter controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f1116] border border-[#1e2129]">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#827d74] mr-2">Filter by Status:</span>
                  {(['all', 'pending_upi', 'verified', 'checked_in', 'cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setBookingFilter(st)}
                      className={`px-3 py-1.5 rounded-full capitalize cursor-pointer transition-colors ${
                        bookingFilter === st
                          ? 'bg-[#292c37] text-[#f7f3ec] border border-[#c5a880]'
                          : 'bg-[#15171d] text-[#8e8a80] hover:text-[#ede8df]'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-[#827d74] font-mono">
                  Showing {filteredBookings.length} of {bookings.length} reservations
                </div>
              </div>

              {/* Bookings Table / Cards */}
              <div className="space-y-4">
                {filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-6 rounded-2xl bg-[#101217] border border-[#20232b] hover:border-[#313542] transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#1c1f26] gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-semibold text-[#c5a880]">
                            {b.bookingCode}
                          </span>
                          <span className="text-xs text-[#736e65]">·</span>
                          <span className="text-xs text-[#a8a39a]">
                            Booked on {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-serif-luxury text-xl text-[#f7f3ec]">
                          {b.roomName}
                        </h3>
                        <p className="text-xs text-[#8a857b]">{b.branchName}</p>
                      </div>

                      {/* Status & Quick Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-right mr-2">
                          <span className="text-[10px] uppercase tracking-wider text-[#827d74] block">
                            Tariff
                          </span>
                          <span className="font-serif-luxury text-lg text-[#f7f3ec] font-medium">
                            ₹{b.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {b.paymentStatus === 'pending_upi' && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              updateBookingStatus(b.id, 'verified');
                              triggerSaved();
                            }}
                            className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer shadow-md flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verify UPI &amp; Guarantee</span>
                          </motion.button>
                        )}

                        {b.paymentStatus === 'verified' && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              updateBookingStatus(b.id, 'checked_in');
                              triggerSaved();
                            }}
                            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium cursor-pointer shadow-md flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Check In Guest</span>
                          </motion.button>
                        )}

                        {b.paymentStatus !== 'cancelled' && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              if (confirm(`Cancel reservation ${b.bookingCode}?`)) {
                                updateBookingStatus(b.id, 'cancelled');
                                triggerSaved();
                              }
                            }}
                            className="px-3 py-2 rounded-full border border-rose-800/60 hover:bg-rose-950/40 text-rose-300 text-xs cursor-pointer"
                          >
                            Cancel
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#827d74] block">
                          Guest Contact
                        </span>
                        <span className="text-[#ede8df] font-medium block">{b.guestDetails.fullName}</span>
                        <span className="text-[#8c877e] block truncate">{b.guestDetails.email}</span>
                        <span className="text-[#8c877e] block">{b.guestDetails.phone}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#827d74] block">
                          Dates &amp; Party
                        </span>
                        <span className="text-[#ede8df] font-mono block">
                          {b.checkInDate} → {b.checkOutDate}
                        </span>
                        <span className="text-[#8c877e] block">
                          {b.nights} Nights · {b.guests.adults}A, {b.guests.children}C
                        </span>
                        <span className="text-[#8c877e] block">Arrival: {b.guestDetails.arrivalTime || '14:00'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#827d74] block">
                          UPI Verification UTR
                        </span>
                        <span className="text-[#c5a880] font-mono font-medium block">
                          {b.guestDetails.upiUtr || 'No UTR submitted'}
                        </span>
                        <span className="text-[11px] text-[#827d74] block">VPA: {hotelContent.upiVpa}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#827d74] block">
                          Add-ons &amp; Notes
                        </span>
                        <span className="text-[#ede8df] block truncate">
                          {b.addOns.length > 0 ? b.addOns.join(', ') : 'None'}
                        </span>
                        {b.guestDetails.specialRequests && (
                          <span className="text-[#c5a880] text-[11px] block italic line-clamp-2 mt-0.5">
                            "{b.guestDetails.specialRequests}"
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 2: Real-Time Room & Pricing Management */}
          {activeTab === 'rooms' && (
            <motion.div
              key="rooms"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="p-4 rounded-2xl bg-[#0f1116] border border-[#1e2129] flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury text-xl text-[#f7f3ec]">
                    Real-Time Accommodations &amp; Pricing Editor
                  </h3>
                  <p className="text-xs text-[#8c877e]">
                    Update nightly rates, toggle instant room availability, or edit descriptions. Changes reflect immediately across all guests.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rooms.map((room) => {
                  const isEditing = editingRoomId === room.id;
                  return (
                    <div
                      key={room.id}
                      className="p-6 rounded-2xl bg-[#101217] border border-[#20232b] flex flex-col justify-between"
                    >
                      {isEditing && roomEditForm ? (
                        /* Edit Mode Form */
                        <div className="space-y-4">
                          <div>
                            <label className="text-[11px] uppercase tracking-wider text-[#827d74] block mb-1">
                              Suite Name
                            </label>
                            <input
                              type="text"
                              value={roomEditForm.name}
                              onChange={(e) =>
                                setRoomEditForm({ ...roomEditForm, name: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-[#161820] border border-[#2d313d] text-xs text-[#f7f3ec]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] uppercase tracking-wider text-[#c5a880] block mb-1">
                                Nightly Tariff (₹ INR) *
                              </label>
                              <input
                                type="number"
                                value={roomEditForm.pricePerNight}
                                onChange={(e) =>
                                  setRoomEditForm({
                                    ...roomEditForm,
                                    pricePerNight: Number(e.target.value),
                                  })
                                }
                                className="w-full px-3 py-2 rounded-xl bg-[#161820] border border-[#c5a880] text-xs text-[#f7f3ec] font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] uppercase tracking-wider text-[#827d74] block mb-1">
                                Area (Sq.Ft)
                              </label>
                              <input
                                type="number"
                                value={roomEditForm.sizeSqFt}
                                onChange={(e) =>
                                  setRoomEditForm({
                                    ...roomEditForm,
                                    sizeSqFt: Number(e.target.value),
                                  })
                                }
                                className="w-full px-3 py-2 rounded-xl bg-[#161820] border border-[#2d313d] text-xs text-[#f7f3ec]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] uppercase tracking-wider text-[#827d74] block mb-1">
                              Description
                            </label>
                            <textarea
                              rows={3}
                              value={roomEditForm.description}
                              onChange={(e) =>
                                setRoomEditForm({
                                  ...roomEditForm,
                                  description: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-[#161820] border border-[#2d313d] text-xs text-[#f7f3ec]"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingRoomId(null);
                                setRoomEditForm(null);
                              }}
                              className="px-4 py-2 rounded-full border border-[#2a2d36] text-xs text-[#8c877e]"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveRoom}
                              className="px-5 py-2 rounded-full bg-[#c5a880] text-[#090a0d] text-xs font-semibold cursor-pointer"
                            >
                              Save Suite Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Display Mode */
                        <>
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] uppercase tracking-widest text-[#827d74] font-mono">
                                {room.category}
                              </span>

                              {/* Instant Availability Toggle */}
                              <button
                                onClick={() => {
                                  toggleRoomAvailability(room.id);
                                  triggerSaved();
                                }}
                                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                  room.available
                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                                    : 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
                                }`}
                              >
                                {room.available ? '✓ Available (Live)' : '✕ Sold Out / Blocked'}
                              </button>
                            </div>

                            <h4 className="font-serif-luxury text-xl text-[#f7f3ec] mb-1">
                              {room.name}
                            </h4>
                            <p className="text-xs text-[#9c968b] line-clamp-2 mb-4">
                              {room.description}
                            </p>

                            <div className="flex items-baseline gap-1 text-[#c5a880] font-mono mb-4">
                              <span className="text-xl font-bold">
                                ₹{room.pricePerNight.toLocaleString('en-IN')}
                              </span>
                              <span className="text-xs text-[#827d74]">/ night</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-[#1c1f26] flex items-center justify-between">
                            <span className="text-xs text-[#827d74]">
                              {room.sizeSqFt} sq.ft · {room.capacityAdults} Adults
                            </span>
                            <button
                              onClick={() => handleStartEditRoom(room)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#2a2d36] hover:border-[#c5a880] text-xs text-[#c5a880] transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit Tariff &amp; Info</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: Guest Messaging System */}
          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]"
            >
              {/* Thread list */}
              <div className="lg:col-span-5 rounded-2xl bg-[#101217] border border-[#20232b] overflow-hidden flex flex-col">
                <div className="p-4 bg-[#14161d] border-b border-[#20232b]">
                  <h3 className="font-serif-luxury text-lg text-[#f7f3ec]">
                    Guest Inquiries &amp; Concierge Threads
                  </h3>
                  <span className="text-xs text-[#827d74]">
                    {chatThreads.length} active stay conversations
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-[#1a1c24]">
                  {chatThreads.map((thread) => {
                    const isSelected = activeThread?.booking.id === thread.booking.id;
                    return (
                      <button
                        key={thread.booking.id}
                        onClick={() => setSelectedChatBookingId(thread.booking.id)}
                        className={`w-full text-left p-4 transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#181a22]' : 'hover:bg-[#13151b]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-[#ede8df]">
                            {thread.booking.guestDetails.fullName}
                          </span>
                          <span className="font-mono text-[10px] text-[#c5a880]">
                            {thread.booking.bookingCode}
                          </span>
                        </div>
                        <p className="text-xs text-[#8c877e] truncate">
                          {thread.lastMessage ? thread.lastMessage.text : 'No messages yet'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conversation Window */}
              {activeThread && (
                <div className="lg:col-span-7 rounded-2xl bg-[#101217] border border-[#20232b] overflow-hidden flex flex-col">
                  <div className="p-4 bg-[#14161d] border-b border-[#20232b] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-[#f7f3ec]">
                        {activeThread.booking.guestDetails.fullName}
                      </h4>
                      <span className="text-xs text-[#827d74]">
                        {activeThread.booking.roomName} ({activeThread.booking.bookingCode})
                      </span>
                    </div>
                    <span className="text-xs text-[#c5a880] font-mono">
                      {activeThread.booking.guestDetails.phone}
                    </span>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0d0e13]/60">
                    {activeThread.messages.map((m) => {
                      const isGuest = m.sender === 'guest';
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isGuest ? 'items-start' : 'items-end'}`}
                        >
                          <span className="text-[10px] text-[#736e65] mb-1 px-1">
                            {isGuest ? `${m.guestName} (Guest)` : 'You (Resort Concierge)'}
                          </span>
                          <div
                            className={`max-w-md p-3 rounded-2xl text-xs ${
                              isGuest
                                ? 'bg-[#1c1f29] text-[#ece7dc] border border-[#292d3a] rounded-tl-none'
                                : 'bg-[#c5a880] text-[#090a0d] rounded-tr-none font-medium'
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <form
                    onSubmit={handleSendAdminMessage}
                    className="p-3 bg-[#13151b] border-t border-[#20232b] flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Reply as Hotel Manchester Concierge..."
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-full bg-[#1b1e27] border border-[#2b2f3c] text-xs text-[#f7f3ec] focus:outline-none focus:border-[#c5a880]"
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-5 py-2.5 rounded-full bg-[#c5a880] hover:bg-[#d8be96] text-[#090a0d] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Reply</span>
                      <Send className="w-3.5 h-3.5" />
                    </motion.button>
                  </form>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: Content & Promotions Editor */}
          {activeTab === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 max-w-4xl"
            >
              {/* Promotions Manager */}
              <div className="p-6 rounded-2xl bg-[#101217] border border-[#20232b] space-y-4">
                <h3 className="font-serif-luxury text-xl text-[#f7f3ec]">
                  Promotional Offers &amp; Bottom Banner Manager
                </h3>
                <p className="text-xs text-[#8c877e]">
                  These offers power the bottom promotional ticker and the booking discount code verification.
                </p>

                <div className="space-y-4 pt-2">
                  {promotions.map((promo) => (
                    <div
                      key={promo.id}
                      className="p-4 rounded-xl bg-[#15171d] border border-[#232630] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#c5a880]">
                            {promo.code}
                          </span>
                          <span className="text-xs text-[#8c877e]">
                            ({promo.discountPercent}% Off)
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-[#f7f3ec] mt-1">{promo.title}</h4>
                        <p className="text-xs text-[#9b958a] mt-0.5">{promo.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            updatePromotion({ ...promo, active: !promo.active });
                            triggerSaved();
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer ${
                            promo.active
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {promo.active ? 'Active on Banner' : 'Inactive'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotel General Information & UPI VPA */}
              <form
                onSubmit={handleSaveContent}
                className="p-6 rounded-2xl bg-[#101217] border border-[#20232b] space-y-4"
              >
                <h3 className="font-serif-luxury text-xl text-[#f7f3ec]">
                  General Sanctuary Settings &amp; UPI Gateway
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#827d74] mb-1">
                      UPI VPA Address *
                    </label>
                    <input
                      type="text"
                      value={contentForm.upiVpa}
                      onChange={(e) => setContentForm({ ...contentForm, upiVpa: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#161820] border border-[#2d313d] text-xs font-mono text-[#f7f3ec]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#827d74] mb-1">
                      UPI Merchant Payee Name *
                    </label>
                    <input
                      type="text"
                      value={contentForm.upiPayeeName}
                      onChange={(e) => setContentForm({ ...contentForm, upiPayeeName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#161820] border border-[#2d313d] text-xs text-[#f7f3ec]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#827d74] mb-1">
                      Concierge Phone
                    </label>
                    <input
                      type="text"
                      value={contentForm.contactNumber}
                      onChange={(e) => setContentForm({ ...contentForm, contactNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#161820] border border-[#2d313d] text-xs text-[#f7f3ec]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#827d74] mb-1">
                      Concierge WhatsApp
                    </label>
                    <input
                      type="text"
                      value={contentForm.whatsappNumber}
                      onChange={(e) => setContentForm({ ...contentForm, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#161820] border border-[#2d313d] text-xs text-[#f7f3ec]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#827d74] mb-1">
                      Hero Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={contentForm.heroSubtitle}
                      onChange={(e) => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#161820] border border-[#2d313d] text-xs text-[#f7f3ec]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#1e2129]">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset all demo bookings and revert to original catalog?')) {
                        resetAllData();
                        window.location.reload();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset All to Defaults</span>
                  </button>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#c5a880] text-[#090a0d] text-xs font-semibold cursor-pointer shadow-md"
                  >
                    Save Global Settings
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Check,
  Calendar,
  Users,
  Copy,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  AlertCircle,
  QrCode as QrIcon,
  Smartphone,
  CheckCircle2,
  Wallet,
  ExternalLink,
  Coins
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { Room, Booking } from '../types';
import { resolveHotelImage, ASSET_IMAGES } from '../utils/imageAssets';

interface BookingModalProps {
  room: Room;
  onClose: () => void;
  onBookingConfirmed: (booking: Booking) => void;
}

const LUXURY_ADD_ONS = [
  { id: 'butler', name: 'Dedicated Royal Butler (24/7 Service)', price: 12000 },
  { id: 'champagne', name: 'Vintage Laurent-Perrier Champagne & Caviar on Arrival', price: 18500 },
  { id: 'spa', name: 'Signature 90-min Couples Ayurvedic Marma Spa Therapy', price: 15000 },
  { id: 'limousine', name: 'Private Chauffeured Airport Limousine Transfer', price: 9500 },
];

export const BookingModal: React.FC<BookingModalProps> = ({ room, onClose, onBookingConfirmed }) => {
  const { branches, hotelContent, createBooking, promotions } = useHotel();
  const branch = branches.find((b) => b.id === room.branchId);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const today = new Date().toISOString().split('T')[0];
  const defaultCheckOut = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');

  // Guest Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [arrivalTime, setArrivalTime] = useState('14:00');
  const [pillowPref, setPillowPref] = useState('Hypoallergenic Goose Down');
  const [specialRequests, setSpecialRequests] = useState('');

  // Amount QR Payment System State
  const [paymentMode, setPaymentMode] = useState<'advance_25' | 'full' | 'advance_50' | 'custom'>('advance_25');
  const [customDepositAmount, setCustomDepositAmount] = useState<number>(0);
  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string>('');
  const [upiUtr, setUpiUtr] = useState('');
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes
  const [tempCode] = useState(() => `HM-${Math.floor(1000 + Math.random() * 9000)}`);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Calculations
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.max(1, end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const baseRoomTotal = room.pricePerNight * nights;
  const addOnsTotal = selectedAddOns.reduce((acc, currId) => {
    const item = LUXURY_ADD_ONS.find((a) => a.id === currId);
    return acc + (item ? item.price : 0);
  }, 0);

  const subtotal = baseRoomTotal + addOnsTotal;
  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const taxAmount = Math.round((subtotal - discountAmount) * 0.12); // 12% luxury hospitality tax
  const totalAmount = subtotal - discountAmount + taxAmount;

  // Dynamic Amount QR Calculation
  const payableAmount = useMemo(() => {
    if (paymentMode === 'full') return totalAmount;
    if (paymentMode === 'advance_25') return Math.max(100, Math.round(totalAmount * 0.25));
    if (paymentMode === 'advance_50') return Math.max(100, Math.round(totalAmount * 0.50));
    if (paymentMode === 'custom') {
      return Math.min(totalAmount, Math.max(500, customDepositAmount || Math.round(totalAmount * 0.25)));
    }
    return totalAmount;
  }, [paymentMode, totalAmount, customDepositAmount]);

  const remainingBalance = Math.max(0, totalAmount - payableAmount);

  // Generate UPI QR Code dynamically whenever payable amount changes
  useEffect(() => {
    const upiUri = `upi://pay?pa=${hotelContent.upiVpa}&pn=${encodeURIComponent(
      hotelContent.upiPayeeName
    )}&am=${payableAmount}&cu=INR&tn=${encodeURIComponent(`Sanctuary Reservation ${tempCode}`)}`;

    QRCode.toDataURL(upiUri, {
      width: 280,
      margin: 2,
      color: {
        dark: '#1C1917',
        light: '#FAF8F5',
      },
    })
      .then((url) => setUpiQrDataUrl(url))
      .catch((err) => console.error('QR code generation failed', err));
  }, [payableAmount, hotelContent, tempCode]);

  // Payment Countdown Timer
  useEffect(() => {
    if (step !== 3) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const handleApplyPromo = () => {
    const match = promotions.find(
      (p) => p.active && p.code.toLowerCase() === promoCode.trim().toLowerCase()
    );
    if (match) {
      setAppliedDiscount(match.discountPercent);
      setPromoMessage(`✓ Applied "${match.title}" (${match.discountPercent}% off)`);
    } else {
      setAppliedDiscount(0);
      setPromoMessage('Invalid or expired promotional invitation code.');
    }
  };

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(hotelContent.upiVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleFinalSubmit = () => {
    const newBooking = createBooking({
      roomId: room.id,
      roomName: room.name,
      branchId: room.branchId,
      branchName: branch ? `${branch.name}, ${branch.city}` : 'Hotel Manchester Sanctuary',
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights,
      guests: { adults, children },
      guestDetails: {
        fullName,
        email,
        phone,
        specialRequests,
        upiUtr: upiUtr.trim() || 'Pending verification',
        arrivalTime,
        pillowPreference: pillowPref,
      },
      totalAmount,
      paidAmount: payableAmount,
      paymentType: paymentMode === 'full' ? 'full' : 'advance_deposit',
      paymentStatus: upiUtr.trim().length >= 8 ? 'verified' : 'pending_upi',
      addOns: selectedAddOns.map((id) => LUXURY_ADD_ONS.find((a) => a.id === id)?.name || id),
    });

    setConfirmedBooking(newBooking);
    setStep(4);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl my-6 bg-[#FAF8F5] border border-[#E2DBD0] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#EAE4DA] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#946E3A] font-semibold">
              <span>Hotel Manchester</span>
              <span aria-hidden="true">·</span>
              <span>Sanctuary Reservation</span>
            </div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-light text-[#1C1917]">
              {step === 4 ? 'Reservation Confirmed' : `Reserving: ${room.name}`}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#F3EFEA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper (Except confirmation) */}
        {step < 4 && (
          <div className="px-6 sm:px-8 py-3 bg-[#F5F0E8] border-b border-[#EAE4DA] flex items-center justify-between text-xs">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar font-medium">
              <span className={step >= 1 ? 'text-[#946E3A] font-semibold' : 'text-[#78716C]'}>
                1. Itinerary &amp; Add-ons
              </span>
              <span className="text-[#C4B9AA]">/</span>
              <span className={step >= 2 ? 'text-[#946E3A] font-semibold' : 'text-[#78716C]'}>
                2. Guest Details
              </span>
              <span className="text-[#C4B9AA]">/</span>
              <span className={step >= 3 ? 'text-[#946E3A] font-semibold' : 'text-[#78716C]'}>
                3. UPI QR Payment
              </span>
            </div>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Itinerary & Add-ons */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Room summary banner */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white border border-[#EAE4DA] shadow-sm">
                <img
                  src={resolveHotelImage(room.image)}
                  alt={room.name}
                  onError={(e) => {
                    e.currentTarget.src = ASSET_IMAGES.hero;
                  }}
                  className="w-full sm:w-36 h-24 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h4 className="font-serif-luxury text-lg text-[#1C1917] font-medium">{room.name}</h4>
                  <p className="text-xs text-[#78716C]">{branch?.name} ({branch?.city})</p>
                  <p className="text-xs text-[#946E3A] mt-2 font-mono font-semibold">
                    ₹{room.pricePerNight.toLocaleString('en-IN')} / night
                  </p>
                </div>
              </div>

              {/* Dates & Guests Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716C] mb-1.5 font-semibold">
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D8D0C5] text-sm text-[#1C1917] focus:outline-none focus:border-[#946E3A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716C] mb-1.5 font-semibold">
                    Check-Out Date ({nights} {nights === 1 ? 'Night' : 'Nights'})
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D8D0C5] text-sm text-[#1C1917] focus:outline-none focus:border-[#946E3A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716C] mb-1.5 font-semibold">
                    Adult Guests
                  </label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D8D0C5] text-sm text-[#1C1917] focus:outline-none focus:border-[#946E3A]"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n} className="bg-white">
                        {n} Adult{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716C] mb-1.5 font-semibold">
                    Children
                  </label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D8D0C5] text-sm text-[#1C1917] focus:outline-none focus:border-[#946E3A]"
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n} className="bg-white">
                        {n} Child{n !== 1 ? 'ren' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bespoke Luxury Add-ons */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#946E3A] mb-3 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Tailored Sanctuary Add-ons
                </label>
                <div className="space-y-2.5">
                  {LUXURY_ADD_ONS.map((addOn) => {
                    const isChecked = selectedAddOns.includes(addOn.id);
                    return (
                      <label
                        key={addOn.id}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                          isChecked
                            ? 'bg-white border-[#946E3A] shadow-sm'
                            : 'bg-white/80 border-[#EAE4DA] hover:border-[#D8D0C5]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSelectedAddOns((prev) =>
                                isChecked ? prev.filter((id) => id !== addOn.id) : [...prev, addOn.id]
                              );
                            }}
                            className="w-4 h-4 accent-[#c5a880] rounded"
                          />
                          <span className="text-xs text-[#ede8df] font-light">{addOn.name}</span>
                        </div>
                        <span className="text-xs font-mono text-[#c5a880]">
                          +₹{addOn.price.toLocaleString('en-IN')}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Promotional Voucher Input */}
              <div className="pt-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#8a857b] mb-1.5 font-medium">
                  Promotional Invitation Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. MANCHESTER20"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-[#14161c] border border-[#272a33] text-xs uppercase tracking-wider text-[#f7f3ec] focus:outline-none focus:border-[#c5a880]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-5 py-2 rounded-xl bg-[#22252e] hover:bg-[#2c303c] text-xs font-medium text-[#f7f3ec] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-xs mt-1.5 ${appliedDiscount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {promoMessage}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Guest Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716C] mb-1 font-semibold">
                    Primary Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharani / Dr. / Mr. Alexander Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D8D0C5] text-sm text-[#1C1917] focus:outline-none focus:border-[#946E3A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716C] mb-1 font-semibold">
                    Email Address (For Voucher &amp; Concierge) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="guest@resort.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D8D0C5] text-sm text-[#1C1917] focus:outline-none focus:border-[#946E3A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716C] mb-1 font-semibold">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D8D0C5] text-sm text-[#1C1917] focus:outline-none focus:border-[#946E3A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716C] mb-1 font-semibold">
                    Estimated Arrival Time
                  </label>
                  <select
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D8D0C5] text-sm text-[#1C1917] focus:outline-none focus:border-[#946E3A]"
                  >
                    <option value="12:00" className="bg-white">12:00 PM (Early Check-In Request)</option>
                    <option value="14:00" className="bg-white">02:00 PM (Standard Check-In)</option>
                    <option value="16:00" className="bg-white">04:00 PM</option>
                    <option value="18:00" className="bg-white">06:00 PM</option>
                    <option value="20:00" className="bg-white">08:00 PM or Later</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716C] mb-1 font-semibold">
                    Pillow &amp; Linen Preference
                  </label>
                  <select
                    value={pillowPref}
                    onChange={(e) => setPillowPref(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D8D0C5] text-sm text-[#1C1917] focus:outline-none focus:border-[#946E3A]"
                  >
                    <option value="Hypoallergenic Goose Down" className="bg-white">Hypoallergenic Goose Down</option>
                    <option value="Organic Mulberry Silk" className="bg-white">Organic Mulberry Silk</option>
                    <option value="Contour Memory Foam" className="bg-white">Contour Memory Foam</option>
                    <option value="Buckwheat Ergonomic" className="bg-white">Buckwheat Ergonomic</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-[#78716C] mb-1 font-semibold">
                    Special Inquiries, Dietary Preferences, or Occasions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Honeymoon, dietary allergies, quiet floor preference..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D8D0C5] text-sm text-[#1C1917] focus:outline-none focus:border-[#946E3A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: UPI Payment with Dynamic Amount QR Code System */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="max-w-xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF5EC] border border-[#E8DCC8] text-xs text-[#946E3A] font-semibold mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Awaiting Instant Payment Verification · {formatTimer(timerSeconds)}</span>
                </div>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#1C1917] mb-1 font-medium">
                  Dynamic UPI Amount QR System
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Choose your payable amount below. The QR code dynamically encodes your chosen deposit. Scan directly with any UPI App.
                </p>
              </div>

              {/* Amount Selection Options (Amount QR System) */}
              <div className="max-w-xl mx-auto text-left">
                <label className="block text-[11px] uppercase tracking-wider text-[#78716C] mb-2 font-semibold">
                  Select Payable Deposit Amount
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* 25% Advance Token Guarantee */}
                  <button
                    type="button"
                    onClick={() => setPaymentMode('advance_25')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      paymentMode === 'advance_25'
                        ? 'bg-[#FAF5EC] border-[#946E3A] shadow-sm ring-1 ring-[#946E3A]'
                        : 'bg-white border-[#EAE4DA] hover:border-[#946E3A]/60'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#946E3A] text-white font-bold inline-block mb-1">
                      Token
                    </span>
                    <span className="text-xs font-semibold text-[#1C1917] block">25% Advance</span>
                    <span className="font-serif-luxury text-base sm:text-lg font-bold text-[#946E3A] block mt-1">
                      ₹{Math.max(100, Math.round(totalAmount * 0.25)).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#78716C] block mt-0.5">
                      Bal ₹{(totalAmount - Math.round(totalAmount * 0.25)).toLocaleString('en-IN')} at check-in
                    </span>
                  </button>

                  {/* 50% Mid-Deposit */}
                  <button
                    type="button"
                    onClick={() => setPaymentMode('advance_50')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMode === 'advance_50'
                        ? 'bg-[#FAF5EC] border-[#946E3A] shadow-sm ring-1 ring-[#946E3A]'
                        : 'bg-white border-[#EAE4DA] hover:border-[#946E3A]/60'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#78716C] text-white font-bold inline-block mb-1">
                      Deposit
                    </span>
                    <span className="text-xs font-semibold text-[#1C1917] block">50% Deposit</span>
                    <span className="font-serif-luxury text-base sm:text-lg font-bold text-[#946E3A] block mt-1">
                      ₹{Math.max(100, Math.round(totalAmount * 0.50)).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#78716C] block mt-0.5">
                      Bal ₹{(totalAmount - Math.round(totalAmount * 0.50)).toLocaleString('en-IN')} at check-in
                    </span>
                  </button>

                  {/* 100% Full Pre-Payment */}
                  <button
                    type="button"
                    onClick={() => setPaymentMode('full')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMode === 'full'
                        ? 'bg-[#FAF5EC] border-[#946E3A] shadow-sm ring-1 ring-[#946E3A]'
                        : 'bg-white border-[#EAE4DA] hover:border-[#946E3A]/60'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-700 text-white font-bold inline-block mb-1">
                      Full
                    </span>
                    <span className="text-xs font-semibold text-[#1C1917] block">100% Full</span>
                    <span className="font-serif-luxury text-base sm:text-lg font-bold text-[#946E3A] block mt-1">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-700 block mt-0.5 font-medium">
                      Zero due upon arrival
                    </span>
                  </button>

                  {/* Custom Deposit Amount */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('custom');
                      if (!customDepositAmount) {
                        setCustomDepositAmount(Math.round(totalAmount * 0.35));
                      }
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      paymentMode === 'custom'
                        ? 'bg-[#FAF5EC] border-[#946E3A] shadow-sm ring-1 ring-[#946E3A]'
                        : 'bg-white border-[#EAE4DA] hover:border-[#946E3A]/60'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#1C1917] text-white font-bold inline-block mb-1">
                      Custom
                    </span>
                    <span className="text-xs font-semibold text-[#1C1917] block">Custom ₹</span>
                    <span className="font-serif-luxury text-base sm:text-lg font-bold text-[#946E3A] block mt-1">
                      ₹{(customDepositAmount || Math.round(totalAmount * 0.35)).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#78716C] block mt-0.5">
                      Choose any amount
                    </span>
                  </button>
                </div>

                {/* Custom Amount Input Bar */}
                {paymentMode === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3.5 rounded-2xl bg-white border border-[#946E3A]/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <label className="text-[11px] font-semibold text-[#1C1917] uppercase tracking-wider block">
                        Enter Custom Deposit Amount (₹)
                      </label>
                      <span className="text-[10px] text-[#78716C]">
                        Min ₹500 · Max ₹{totalAmount.toLocaleString('en-IN')} (Full amount)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif-luxury text-lg text-[#946E3A] font-bold">₹</span>
                      <input
                        type="number"
                        min={500}
                        max={totalAmount}
                        step={500}
                        value={customDepositAmount || ''}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCustomDepositAmount(Math.min(totalAmount, Math.max(0, val)));
                        }}
                        placeholder="e.g. 20000"
                        className="w-36 px-3 py-1.5 rounded-xl border border-[#D8D0C5] text-sm font-mono font-bold text-[#1C1917] focus:border-[#946E3A] focus:outline-none"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Dynamic QR Code Card with Amount Encoding */}
              <div className="max-w-sm mx-auto p-6 rounded-3xl bg-white border-2 border-[#946E3A]/30 text-[#1C1917] shadow-xl flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#946E3A] via-[#C5A869] to-[#946E3A]" />

                <div className="text-[11px] uppercase tracking-widest text-[#78716C] font-semibold mb-2 flex items-center gap-1.5">
                  <QrIcon className="w-3.5 h-3.5 text-[#946E3A]" />
                  <span>Amount Encoded in QR Code</span>
                </div>

                <div className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#946E3A] mb-1">
                  ₹{payableAmount.toLocaleString('en-IN')}
                </div>

                <div className="text-xs text-[#57534E] mb-3">
                  {paymentMode === 'full' ? (
                    <span className="text-emerald-700 font-medium">✓ Full Suite Tariff Pre-Paid</span>
                  ) : (
                    <span>
                      Token Deposit · Balance <strong className="text-[#1C1917]">₹{remainingBalance.toLocaleString('en-IN')}</strong> upon arrival
                    </span>
                  )}
                </div>

                {/* QR Image */}
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DA] shadow-inner mb-3">
                  {upiQrDataUrl ? (
                    <img
                      src={upiQrDataUrl}
                      alt="UPI Payment QR Code"
                      className="w-52 h-52 object-contain"
                    />
                  ) : (
                    <div className="w-52 h-52 flex items-center justify-center bg-neutral-100 rounded-lg">
                      <QrIcon className="w-12 h-12 text-neutral-400 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Supported Apps Logos */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-[#78716C] font-medium pt-1 border-t border-[#F2ECE3] w-full">
                  <span>Supported Apps:</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border text-[#1C1917] font-semibold">GPay</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border text-[#1C1917] font-semibold">PhonePe</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border text-[#1C1917] font-semibold">Paytm</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border text-[#1C1917] font-semibold">BHIM</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border text-[#1C1917] font-semibold">CRED</span>
                </div>

                {/* Mobile Direct UPI Intent Link Button */}
                <a
                  href={`upi://pay?pa=${hotelContent.upiVpa}&pn=${encodeURIComponent(
                    hotelContent.upiPayeeName
                  )}&am=${payableAmount}&cu=INR&tn=${encodeURIComponent(`Reservation ${tempCode}`)}`}
                  className="mt-4 w-full py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#946E3A] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#C5A869]" />
                  <span>Tap to Pay in Any UPI App</span>
                  <ExternalLink className="w-3 h-3 text-[#C5A869]" />
                </a>
              </div>

              {/* UPI ID & Amount Quick Copy Box */}
              <div className="max-w-md mx-auto grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-2xl bg-white border border-[#EAE4DA] shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#78716C] block font-semibold">
                      Sanctuary UPI VPA
                    </span>
                    <span className="text-xs font-mono font-bold text-[#1C1917] truncate block mt-0.5">
                      {hotelContent.upiVpa}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyVpa}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#946E3A] hover:text-[#6B4C20] font-semibold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedVpa ? 'Copied VPA!' : 'Copy VPA'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#EAE4DA] shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#78716C] block font-semibold">
                      Exact Amount
                    </span>
                    <span className="text-xs font-mono font-bold text-[#946E3A] block mt-0.5">
                      ₹{payableAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(payableAmount.toString());
                      setCopiedAmount(true);
                      setTimeout(() => setCopiedAmount(false), 2000);
                    }}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#946E3A] hover:text-[#6B4C20] font-semibold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedAmount ? 'Copied Amount!' : 'Copy Amount'}</span>
                  </button>
                </div>
              </div>

              {/* UTR Input Form with Simulation Test Helper */}
              <div className="max-w-md mx-auto text-left pt-1 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-wider text-[#946E3A] font-semibold">
                    12-Digit UPI UTR / Transaction ID *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const sampleUtr = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
                      setUpiUtr(sampleUtr);
                    }}
                    className="text-[10px] text-[#946E3A] hover:text-[#6B4C20] underline font-medium cursor-pointer"
                  >
                    Simulate Successful UPI UTR
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="e.g. 428819003411"
                  value={upiUtr}
                  onChange={(e) => setUpiUtr(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D8D0C5] text-sm text-[#1C1917] font-mono tracking-wider focus:outline-none focus:border-[#946E3A] shadow-inner"
                />
                <p className="text-[11px] text-[#78716C] leading-normal">
                  Found on your payment screen under <strong>UPI Ref ID / UTR</strong>. Our concierge desk verifies in real-time.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmed Receipt & Voucher */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-sm">
                  <Check className="w-7 h-7" />
                </div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-[#946E3A] font-semibold mb-1">
                  Sanctuary Itinerary Secured via Amount QR
                </div>
                <h3 className="font-serif-luxury text-3xl font-light text-[#1C1917]">
                  Welcome to Hotel Manchester
                </h3>
                <p className="text-xs text-[#57534E] max-w-md mx-auto mt-2">
                  A personalized booking confirmation voucher has been generated and dispatched to{' '}
                  <span className="text-[#1C1917] font-medium">{confirmedBooking.guestDetails.email}</span>.
                </p>
              </div>

              {/* Luxury Boarding Pass Card in White Porcelain with Antique Gold Accents */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#946E3A]/40 shadow-xl space-y-5 text-left relative">
                <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#78716C] font-semibold">
                      Booking Reference Code
                    </span>
                    <div className="font-serif-luxury text-2xl text-[#946E3A] font-medium tracking-wider">
                      {confirmedBooking.bookingCode}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-[#78716C] font-semibold">
                      Payment Status
                    </span>
                    <div className="text-xs font-semibold text-emerald-700">
                      {confirmedBooking.paymentStatus === 'verified'
                        ? '✓ Verified & Room Reserved'
                        : 'Awaiting Concierge Verification'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[#78716C] block text-[10px] uppercase tracking-wider font-medium">
                      Sanctuary
                    </span>
                    <span className="text-[#1C1917] font-medium">{confirmedBooking.branchName}</span>
                  </div>
                  <div>
                    <span className="text-[#78716C] block text-[10px] uppercase tracking-wider font-medium">
                      Dates
                    </span>
                    <span className="text-[#1C1917] font-mono">
                      {confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate} ({confirmedBooking.nights}n)
                    </span>
                  </div>
                  <div>
                    <span className="text-[#78716C] block text-[10px] uppercase tracking-wider font-medium">
                      Deposit Paid via QR
                    </span>
                    <span className="text-emerald-700 font-mono font-bold text-sm">
                      ₹{(confirmedBooking.paidAmount || payableAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#78716C] block text-[10px] uppercase tracking-wider font-medium">
                      Balance at Check-in
                    </span>
                    <span className="text-[#946E3A] font-serif-luxury text-sm font-semibold">
                      ₹{Math.max(0, confirmedBooking.totalAmount - (confirmedBooking.paidAmount || payableAmount)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Summary Action Bar */}
        <div className="px-6 sm:px-8 py-4 bg-white border-t border-[#EAE4DA] flex flex-col sm:flex-row items-center justify-between gap-4">
          {step < 4 ? (
            <>
              {/* Cost calculation preview */}
              <div className="text-left w-full sm:w-auto">
                <div className="text-[10px] uppercase tracking-widest text-[#78716C] font-semibold">
                  Total ({nights} {nights === 1 ? 'Night' : 'Nights'} incl. Taxes)
                </div>
                <div className="font-serif-luxury text-2xl text-[#946E3A] font-semibold">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
                    className="px-5 py-2.5 rounded-full border border-[#D8D0C5] text-xs uppercase tracking-wider text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                )}

                {step === 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-7 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#946E3A] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>Guest Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {step === 2 && (
                  <button
                    type="button"
                    disabled={!fullName.trim() || !email.trim() || !phone.trim()}
                    onClick={() => setStep(3)}
                    className={`px-7 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md flex items-center gap-2 ${
                      fullName.trim() && email.trim() && phone.trim()
                        ? 'bg-[#1C1917] hover:bg-[#946E3A] text-white cursor-pointer'
                        : 'bg-[#EAE4DA] text-[#A8A29E] cursor-not-allowed'
                    }`}
                  >
                    <span>Proceed to UPI QR</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {step === 3 && (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="px-7 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#946E3A] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>I Have Paid · Confirm Booking</span>
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D8D0C5] hover:border-[#946E3A] text-xs text-[#1C1917] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#946E3A]" />
                <span>Print Luxury Pass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirmedBooking) onBookingConfirmed(confirmedBooking);
                  onClose();
                }}
                className="px-7 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#946E3A] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md cursor-pointer"
              >
                Track in Dashboard
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

import React, { useState, useEffect } from 'react';
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
  QrCode as QrIcon
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { Room, Booking } from '../types';

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

  // UPI Payment State
  const [upiQrDataUrl, setUpiQrDataUrl] = useState<string>('');
  const [upiUtr, setUpiUtr] = useState('');
  const [copiedVpa, setCopiedVpa] = useState(false);
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

  // Generate UPI QR Code dynamically whenever total amount changes
  useEffect(() => {
    const upiUri = `upi://pay?pa=${hotelContent.upiVpa}&pn=${encodeURIComponent(
      hotelContent.upiPayeeName
    )}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(`Resort Reservation ${tempCode}`)}`;

    QRCode.toDataURL(upiUri, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0c0d0e',
        light: '#fdfbf7',
      },
    })
      .then((url) => setUpiQrDataUrl(url))
      .catch((err) => console.error('QR code generation failed', err));
  }, [totalAmount, hotelContent, tempCode]);

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
        className="relative w-full max-w-3xl my-6 bg-[#0f1115] border border-[#262932] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#1e2129] flex items-center justify-between bg-[#12141a]">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#c5a880] font-medium">
              <span>Hotel Manchester</span>
              <span aria-hidden="true">·</span>
              <span>Sanctuary Reservation</span>
            </div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-light text-[#f7f3ec]">
              {step === 4 ? 'Reservation Confirmed' : `Reserving: ${room.name}`}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8c877e] hover:text-[#f7f3ec] hover:bg-[#1f222a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper (Except confirmation) */}
        {step < 4 && (
          <div className="px-6 sm:px-8 py-3 bg-[#0d0e12] border-b border-[#1c1e26] flex items-center justify-between text-xs">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              <span className={`font-medium ${step >= 1 ? 'text-[#c5a880]' : 'text-[#5a564e]'}`}>
                1. Itinerary &amp; Add-ons
              </span>
              <span className="text-[#33363f]">/</span>
              <span className={`font-medium ${step >= 2 ? 'text-[#c5a880]' : 'text-[#5a564e]'}`}>
                2. Guest Details
              </span>
              <span className="text-[#33363f]">/</span>
              <span className={`font-medium ${step >= 3 ? 'text-[#c5a880]' : 'text-[#5a564e]'}`}>
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
              <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-[#14161c] border border-[#22252e]">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full sm:w-36 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-serif-luxury text-lg text-[#f7f3ec]">{room.name}</h4>
                  <p className="text-xs text-[#9c968b]">{branch?.name} ({branch?.city})</p>
                  <p className="text-xs text-[#c5a880] mt-2 font-mono">
                    ₹{room.pricePerNight.toLocaleString('en-IN')} / night
                  </p>
                </div>
              </div>

              {/* Dates & Guests Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8a857b] mb-1.5 font-medium">
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14161c] border border-[#272a33] text-sm text-[#f7f3ec] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8a857b] mb-1.5 font-medium">
                    Check-Out Date ({nights} {nights === 1 ? 'Night' : 'Nights'})
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14161c] border border-[#272a33] text-sm text-[#f7f3ec] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8a857b] mb-1.5 font-medium">
                    Adult Guests
                  </label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14161c] border border-[#272a33] text-sm text-[#f7f3ec] focus:outline-none focus:border-[#c5a880]"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n} className="bg-[#14161c]">
                        {n} Adult{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8a857b] mb-1.5 font-medium">
                    Children
                  </label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14161c] border border-[#272a33] text-sm text-[#f7f3ec] focus:outline-none focus:border-[#c5a880]"
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n} className="bg-[#14161c]">
                        {n} Child{n !== 1 ? 'ren' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bespoke Luxury Add-ons */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#c5a880] mb-3 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Tailored Sanctuary Add-ons
                </label>
                <div className="space-y-2.5">
                  {LUXURY_ADD_ONS.map((addOn) => {
                    const isChecked = selectedAddOns.includes(addOn.id);
                    return (
                      <label
                        key={addOn.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                          isChecked
                            ? 'bg-[#181a22] border-[#c5a880]/60'
                            : 'bg-[#121419] border-[#22242c] hover:border-[#323642]'
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
                  <label className="block text-[11px] uppercase tracking-wider text-[#8a857b] mb-1 font-medium">
                    Primary Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharani / Dr. / Mr. Alexander Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14161c] border border-[#272a33] text-sm text-[#f7f3ec] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8a857b] mb-1 font-medium">
                    Email Address (For Voucher &amp; Concierge) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="guest@resort.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14161c] border border-[#272a33] text-sm text-[#f7f3ec] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8a857b] mb-1 font-medium">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14161c] border border-[#272a33] text-sm text-[#f7f3ec] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8a857b] mb-1 font-medium">
                    Estimated Arrival Time
                  </label>
                  <select
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14161c] border border-[#272a33] text-sm text-[#f7f3ec] focus:outline-none focus:border-[#c5a880]"
                  >
                    <option value="12:00">12:00 PM (Early Check-In Request)</option>
                    <option value="14:00">02:00 PM (Standard Check-In)</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                    <option value="20:00">08:00 PM or Later</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8a857b] mb-1 font-medium">
                    Pillow &amp; Linen Preference
                  </label>
                  <select
                    value={pillowPref}
                    onChange={(e) => setPillowPref(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14161c] border border-[#272a33] text-sm text-[#f7f3ec] focus:outline-none focus:border-[#c5a880]"
                  >
                    <option value="Hypoallergenic Goose Down">Hypoallergenic Goose Down</option>
                    <option value="Organic Mulberry Silk">Organic Mulberry Silk</option>
                    <option value="Contour Memory Foam">Contour Memory Foam</option>
                    <option value="Buckwheat Ergonomic">Buckwheat Ergonomic</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-[#8a857b] mb-1 font-medium">
                    Special Inquiries, Dietary Preferences, or Occasions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Honeymoon, dietary allergies, quiet floor preference..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14161c] border border-[#272a33] text-sm text-[#f7f3ec] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: UPI Payment with Dynamic QR Code */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b1712] border border-[#c5a880]/30 text-xs text-[#c5a880] mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Awaiting Payment Verification · {formatTimer(timerSeconds)}</span>
                </div>
                <h3 className="font-serif-luxury text-2xl text-[#f7f3ec] mb-1">
                  Scan to Complete UPI Payment
                </h3>
                <p className="text-xs text-[#a8a39a]">
                  Scan using Google Pay, PhonePe, Paytm, BHIM, or any UPI app.
                </p>
              </div>

              {/* Dynamic QR Code Card */}
              <div className="max-w-xs mx-auto p-4 rounded-2xl bg-[#fdfbf7] text-[#0c0d0e] shadow-2xl flex flex-col items-center">
                {upiQrDataUrl ? (
                  <img
                    src={upiQrDataUrl}
                    alt="UPI Payment QR Code"
                    className="w-56 h-56 object-contain"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center bg-neutral-100 rounded-lg">
                    <QrIcon className="w-12 h-12 text-neutral-400 animate-pulse" />
                  </div>
                )}

                <div className="mt-2 text-center">
                  <div className="text-[10px] uppercase tracking-widest text-[#736e65]">
                    Amount Payable
                  </div>
                  <div className="font-serif-luxury text-2xl font-bold text-[#0c0d0e]">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-[#6b665c] mt-0.5 font-mono">
                    Ref: {tempCode}
                  </div>
                </div>
              </div>

              {/* UPI ID Copy Box */}
              <div className="max-w-md mx-auto flex items-center justify-between p-3 rounded-xl bg-[#14161c] border border-[#272a33]">
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-widest text-[#827d74]">
                    Official Sanctuary UPI VPA
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-[#f7f3ec]">
                    {hotelContent.upiVpa}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyVpa}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22252f] hover:bg-[#2e323e] text-xs text-[#c5a880] transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedVpa ? 'Copied!' : 'Copy UPI'}</span>
                </button>
              </div>

              {/* UTR Input Form */}
              <div className="max-w-md mx-auto text-left pt-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#c5a880] mb-1.5 font-medium">
                  Enter 12-Digit UPI Transaction UTR / Ref Number *
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="e.g. 428819003411"
                  value={upiUtr}
                  onChange={(e) => setUpiUtr(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14161c] border border-[#272a33] text-sm text-[#f7f3ec] font-mono tracking-wider focus:outline-none focus:border-[#c5a880]"
                />
                <p className="text-[11px] text-[#857f75] mt-1.5">
                  Found in your UPI app payment receipt under "UPI Ref ID" or "UTR". Concierge will instantly cross-verify your booking.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmed Receipt & Voucher */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <Check className="w-7 h-7" />
                </div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-[#c5a880] font-medium mb-1">
                  Sanctuary Itinerary Secured
                </div>
                <h3 className="font-serif-luxury text-3xl font-light text-[#f7f3ec]">
                  Welcome to Hotel Manchester
                </h3>
                <p className="text-xs text-[#9c968b] max-w-md mx-auto mt-2">
                  A personalized booking confirmation voucher has been generated and dispatched to{' '}
                  <span className="text-[#f7f3ec]">{confirmedBooking.guestDetails.email}</span>.
                </p>
              </div>

              {/* Luxury Boarding Pass Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#15171e] to-[#0f1116] border border-[#c5a880]/30 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#242833]">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#827d74]">
                      Booking Reference Code
                    </span>
                    <div className="font-serif-luxury text-2xl text-[#c5a880] font-normal tracking-wider">
                      {confirmedBooking.bookingCode}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-[#827d74]">
                      Payment Status
                    </span>
                    <div className="text-xs font-medium text-emerald-400">
                      {confirmedBooking.paymentStatus === 'verified'
                        ? '✓ Verified & Room Reserved'
                        : 'Awaiting Concierge Verification'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[#827d74] block text-[10px] uppercase tracking-wider">
                      Sanctuary
                    </span>
                    <span className="text-[#ede8df] font-medium">{confirmedBooking.branchName}</span>
                  </div>
                  <div>
                    <span className="text-[#827d74] block text-[10px] uppercase tracking-wider">
                      Suite
                    </span>
                    <span className="text-[#ede8df] font-medium">{confirmedBooking.roomName}</span>
                  </div>
                  <div>
                    <span className="text-[#827d74] block text-[10px] uppercase tracking-wider">
                      Dates
                    </span>
                    <span className="text-[#ede8df] font-mono">
                      {confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate} ({confirmedBooking.nights}n)
                    </span>
                  </div>
                  <div>
                    <span className="text-[#827d74] block text-[10px] uppercase tracking-wider">
                      Primary Guest
                    </span>
                    <span className="text-[#ede8df] font-medium">
                      {confirmedBooking.guestDetails.fullName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#827d74] block text-[10px] uppercase tracking-wider">
                      UTR Reference
                    </span>
                    <span className="text-[#c5a880] font-mono">
                      {confirmedBooking.guestDetails.upiUtr || 'Pending'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#827d74] block text-[10px] uppercase tracking-wider">
                      Total Tariff
                    </span>
                    <span className="text-[#c5a880] font-serif-luxury text-base font-semibold">
                      ₹{confirmedBooking.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Summary Action Bar */}
        <div className="px-6 sm:px-8 py-4 bg-[#12141a] border-t border-[#1e2129] flex flex-col sm:flex-row items-center justify-between gap-4">
          {step < 4 ? (
            <>
              {/* Cost calculation preview */}
              <div className="text-left w-full sm:w-auto">
                <div className="text-[10px] uppercase tracking-widest text-[#827d74]">
                  Total ({nights} {nights === 1 ? 'Night' : 'Nights'} incl. Taxes)
                </div>
                <div className="font-serif-luxury text-2xl text-[#c5a880] font-normal">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
                    className="px-5 py-2.5 rounded-full border border-[#272a33] text-xs uppercase tracking-wider text-[#a8a39a] hover:text-[#f7f3ec] transition-colors"
                  >
                    Back
                  </button>
                )}

                {step === 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-7 py-2.5 rounded-full bg-[#c5a880] hover:bg-[#d8be96] text-[#0b0c0e] text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer"
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
                        ? 'bg-[#c5a880] hover:bg-[#d8be96] text-[#0b0c0e] cursor-pointer'
                        : 'bg-[#22252e] text-[#5c5952] cursor-not-allowed'
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
                    className="px-7 py-2.5 rounded-full bg-[#c5a880] hover:bg-[#d8be96] text-[#0b0c0e] text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer"
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#2d313d] hover:border-[#c5a880] text-xs text-[#f7f3ec] transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Print Luxury Pass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirmedBooking) onBookingConfirmed(confirmedBooking);
                  onClose();
                }}
                className="px-7 py-2.5 rounded-full bg-[#c5a880] hover:bg-[#d8be96] text-[#0b0c0e] text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md cursor-pointer"
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

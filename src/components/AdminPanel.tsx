import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
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
  Edit2,
  Building,
  Plus,
  RotateCcw,
  Eye,
  EyeOff,
  Trash2,
  MapPin,
  Check,
  Compass,
  Flame,
  Palette,
  Camera,
  Image as ImageIcon,
  QrCode as QrIcon,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { Room, Booking, PromotionalOffer, Branch, IndianFestivalTheme } from '../types';
import { resolveHotelImage, ASSET_IMAGES } from '../utils/imageAssets';
import { BranchPageModal } from './BranchPageModal';
import { FESTIVAL_THEMES } from '../utils/festivalThemes';
import { PHOTO_PRESETS } from '../utils/photoPresets';

interface AdminPanelProps {
  onBackToHome: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToHome }) => {
  const {
    branches,
    activeBranches,
    archivedBranches,
    rooms,
    updateRoom,
    toggleRoomAvailability,
    addBranch,
    updateBranch,
    removeBranch,
    restoreBranch,
    deleteBranchPermanently,
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

  const [activeTab, setActiveTab] = useState<
    'branches' | 'rooms' | 'photos' | 'festival_themes' | 'bookings' | 'messages' | 'content'
  >('festival_themes');
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomEditForm, setRoomEditForm] = useState<Room | null>(null);

  // Active chat thread for messaging
  const [selectedChatBookingId, setSelectedChatBookingId] = useState<string>(() => bookings[0]?.id || '');
  const [adminReplyText, setAdminReplyText] = useState('');

  // Content form
  const [contentForm, setContentForm] = useState(hotelContent);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Photo Studio state
  const [photoTarget, setPhotoTarget] = useState<'hero' | 'branch' | 'room' | 'dining' | 'spa'>('hero');
  const [selectedBranchForPhoto, setSelectedBranchForPhoto] = useState<string>(() => branches[0]?.id || '');
  const [selectedRoomForPhoto, setSelectedRoomForPhoto] = useState<string>(() => rooms[0]?.id || '');
  const [customPhotoInput, setCustomPhotoInput] = useState<string>('');

  // Live test QR generator state in Admin
  const [testQrAmount, setTestQrAmount] = useState<number>(25000);
  const [testQrDataUrl, setTestQrDataUrl] = useState<string>('');

  useEffect(() => {
    const upiUri = `upi://pay?pa=${hotelContent.upiVpa}&pn=${encodeURIComponent(
      hotelContent.upiPayeeName
    )}&am=${testQrAmount}&cu=INR&tn=${encodeURIComponent('Admin Test QR')}`;

    QRCode.toDataURL(upiUri, {
      width: 220,
      margin: 2,
      color: { dark: '#1C1917', light: '#FAF8F5' },
    })
      .then((url) => setTestQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [testQrAmount, hotelContent.upiVpa, hotelContent.upiPayeeName]);

  const handleSelectFestivalTheme = (themeId: IndianFestivalTheme) => {
    const cfg = FESTIVAL_THEMES[themeId];
    updateHotelContent({
      activeFestivalTheme: themeId,
      festivalGreetingTitle: cfg.defaultGreetingTitle,
      festivalGreetingSubtitle: cfg.defaultGreetingSubtitle,
      showFestivalBanner: themeId !== 'default',
    });
    setContentForm((prev) => ({
      ...prev,
      activeFestivalTheme: themeId,
      festivalGreetingTitle: cfg.defaultGreetingTitle,
      festivalGreetingSubtitle: cfg.defaultGreetingSubtitle,
      showFestivalBanner: themeId !== 'default',
    }));
    triggerSaved(`Activated Indian Festival Theme: "${cfg.name}" (${cfg.hindiName}).`);
  };

  const handleApplyHeroPhoto = (url: string) => {
    updateHotelContent({ heroImage: url });
    setContentForm((prev) => ({ ...prev, heroImage: url }));
    triggerSaved('Hero sanctuary background photo updated live.');
  };

  const handleApplyBranchPhoto = (branchId: string, url: string) => {
    const target = branches.find((b) => b.id === branchId);
    if (!target) return;
    updateBranch({ ...target, image: url });
    triggerSaved(`Updated photo for "${target.name}".`);
  };

  const handleApplyRoomPhoto = (roomId: string, url: string) => {
    const target = rooms.find((r) => r.id === roomId);
    if (!target) return;
    updateRoom({ ...target, image: url });
    triggerSaved(`Updated photo for suite "${target.name}".`);
  };

  const handleApplyDiningPhoto = (url: string) => {
    updateHotelContent({ diningImage: url });
    setContentForm((prev) => ({ ...prev, diningImage: url }));
    triggerSaved('Dining & banquet experience photo updated.');
  };

  const handleApplySpaPhoto = (url: string) => {
    updateHotelContent({ spaImage: url });
    setContentForm((prev) => ({ ...prev, spaImage: url }));
    triggerSaved('Ayurvedic Spa & Rasayana sanctuary photo updated.');
  };

  // Filter bookings
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending_upi' | 'verified' | 'checked_in' | 'cancelled'>('all');

  // Branch management states
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [adminPreviewBranch, setAdminPreviewBranch] = useState<Branch | null>(null);
  const [lastRemovedBranchId, setLastRemovedBranchId] = useState<string | null>(null);
  const [branchToRemove, setBranchToRemove] = useState<Branch | null>(null);

  // New Branch Form state
  const [newBranch, setNewBranch] = useState({
    name: '',
    city: '',
    state: '',
    country: 'India',
    tagline: '',
    address: '',
    phone: '+91 91712 90395',
    email: '',
    climateNote: 'Mild breezy climate with temperate evenings',
    rating: 4.95,
    signatureExperiences: [
      'Private sunset boat cruise with flutist',
      'Artisanal candlelight dinner under royal banyan',
      'Morning mindfulness and sound therapy'
    ],
    image: ASSET_IMAGES.palace,
  });

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.paymentStatus === bookingFilter;
  });

  const triggerSaved = (msg = 'Changes committed to Hotel Manchester database in real-time.') => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleStartEditRoom = (room: Room) => {
    setEditingRoomId(room.id);
    setRoomEditForm({ ...room });
  };

  const handleSaveRoom = () => {
    if (!roomEditForm) return;
    updateRoom(roomEditForm);
    setEditingRoomId(null);
    setRoomEditForm(null);
    triggerSaved('Suite details & pricing updated successfully.');
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
    triggerSaved('Concierge message sent to guest.');
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateHotelContent(contentForm);
    triggerSaved('Global sanctuary content and UPI gateway updated.');
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.name.trim() || !newBranch.city.trim()) {
      alert('Please provide at least a Sanctuary Name and City.');
      return;
    }

    const created = addBranch({
      name: newBranch.name.trim(),
      city: newBranch.city.trim(),
      state: newBranch.state.trim() || 'India',
      country: newBranch.country.trim() || 'India',
      tagline: newBranch.tagline.trim() || 'A tranquil sanctuary of refined aristocratic hospitality.',
      address: newBranch.address.trim() || `${newBranch.city}, India`,
      phone: newBranch.phone.trim() || hotelContent.contactNumber,
      email: newBranch.email.trim() || `${newBranch.city.toLowerCase()}@hotelmanchester.com`,
      climateNote: newBranch.climateNote.trim(),
      rating: Number(newBranch.rating) || 4.95,
      signatureExperiences: newBranch.signatureExperiences.filter(s => s.trim().length > 0),
      image: newBranch.image,
    });

    setIsAddingBranch(false);
    // Reset form
    setNewBranch({
      name: '',
      city: '',
      state: '',
      country: 'India',
      tagline: '',
      address: '',
      phone: '+91 91712 90395',
      email: '',
      climateNote: 'Mild breezy climate with temperate evenings',
      rating: 4.95,
      signatureExperiences: [
        'Private sunset boat cruise with flutist',
        'Artisanal candlelight dinner under royal banyan',
        'Morning mindfulness and sound therapy'
      ],
      image: ASSET_IMAGES.palace,
    });

    triggerSaved(`Sanctuary "${created.name}" published to website! Guests can now view its page and book suites.`);
  };

  const handleRemoveBranchPage = (branch: Branch) => {
    removeBranch(branch.id);
    setLastRemovedBranchId(branch.id);
    triggerSaved(`Branch page for "${branch.name}" removed from public website. You can restore it anytime.`);
  };

  const handleRestoreBranchPage = (branchId: string) => {
    restoreBranch(branchId);
    setLastRemovedBranchId(null);
    const restored = branches.find(b => b.id === branchId);
    triggerSaved(`Branch page for "${restored?.name || 'Sanctuary'}" restored! It is now live on the public website.`);
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#292524] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Admin Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#EAE4DA]">
          <div>
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#78716C] hover:text-[#946E3A] transition-colors mb-2 cursor-pointer font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Resort</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#1C1917]">
                Manchester Admin &amp; Concierge Console
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0E1] border border-[#946E3A]/40 text-[10px] text-[#946E3A] font-mono uppercase tracking-widest font-semibold">
                Real-Time Sync
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#EAE4DA] shadow-sm overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('festival_themes')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'festival_themes'
                  ? 'bg-[#1C1917] text-white shadow-sm font-semibold'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Festival Themes</span>
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'photos'
                  ? 'bg-[#1C1917] text-white shadow-sm font-semibold'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-[#946E3A]" />
              <span>Photo Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('branches')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'branches'
                  ? 'bg-[#1C1917] text-white shadow-sm font-semibold'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Sanctuaries ({activeBranches.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'rooms'
                  ? 'bg-[#1C1917] text-white shadow-sm font-semibold'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Suites ({rooms.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'bookings'
                  ? 'bg-[#1C1917] text-white shadow-sm font-semibold'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Reservations ({bookings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'messages'
                  ? 'bg-[#1C1917] text-white shadow-sm font-semibold'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Guest Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'content'
                  ? 'bg-[#1C1917] text-white shadow-sm font-semibold'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <QrIcon className="w-3.5 h-3.5" />
              <span>UPI &amp; Content</span>
            </button>
          </div>
        </div>

        {savedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{savedNotice}</span>
            </div>
            {lastRemovedBranchId && (
              <button
                onClick={() => handleRestoreBranchPage(lastRemovedBranchId)}
                className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Undo / Restore Now</span>
              </button>
            )}
          </motion.div>
        )}

        {/* Tab Contents with AnimatePresence */}
        <AnimatePresence mode="wait">
          {/* TAB: Indian Festival Themes & Seasonal Aesthetics */}
          {activeTab === 'festival_themes' && (
            <motion.div
              key="festival_themes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {/* Header Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE4DA] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#946E3A] font-semibold mb-1">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Executive Theme Customizer · Indian Festivals</span>
                  </div>
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#1C1917] font-light">
                    Switch Resort Theme for Indian Festivals
                  </h2>
                  <p className="text-xs text-[#57534E] max-w-2xl mt-1 leading-relaxed">
                    Transform the sanctuary website instantly for major Indian celebrations like Diwali, Holi, Navratri, Shravan Monsoon, or Royal Weddings. Changing themes updates the banner, greeting badges, celebratory color palette, and festive notices across the entire sanctuary in real-time.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-5 py-3 rounded-2xl bg-[#FAF5EC] border border-[#E8DCC8] text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#78716C] block font-medium">
                      Current Live Theme
                    </span>
                    <span className="font-serif-luxury text-lg font-bold text-[#946E3A]">
                      {FESTIVAL_THEMES[hotelContent.activeFestivalTheme || 'default'].name}
                    </span>
                  </div>
                </div>
              </div>

              {/* 6 Authentic Indian Festival Theme Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Object.values(FESTIVAL_THEMES) as Array<typeof FESTIVAL_THEMES[keyof typeof FESTIVAL_THEMES]>).map((theme) => {
                  const isActive = (hotelContent.activeFestivalTheme || 'default') === theme.id;
                  return (
                    <div
                      key={theme.id}
                      className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                        isActive
                          ? 'bg-white border-[#946E3A] shadow-xl ring-2 ring-[#946E3A]/20'
                          : 'bg-white border-[#EAE4DA] hover:border-[#946E3A]/50 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl">{theme.emoji}</span>
                          {isActive ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Active Theme</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border text-[10px] text-[#78716C] font-mono">
                              {theme.badge}
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-serif-luxury text-[#946E3A] font-semibold block">
                          {theme.hindiName}
                        </span>
                        <h3 className="font-serif-luxury text-xl text-[#1C1917] mb-2 leading-snug">
                          {theme.name}
                        </h3>
                        <p className="text-xs text-[#57534E] leading-relaxed mb-4">
                          {theme.tagline}
                        </p>

                        {/* Visual Banner Preview */}
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${theme.bannerGradient} text-white text-[11px] mb-4 truncate shadow-inner`}>
                          <span className="opacity-75">Announcement: </span>
                          <span className="font-medium">{theme.defaultBannerText}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#F2ECE3]">
                        <button
                          type="button"
                          onClick={() => handleSelectFestivalTheme(theme.id as IndianFestivalTheme)}
                          disabled={isActive}
                          className={`w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default font-bold'
                              : 'bg-[#1C1917] hover:bg-[#946E3A] text-white shadow-sm'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Active Across Sanctuary</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-[#C5A869]" />
                              <span>Activate {theme.name.split(' ')[0]} Theme</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Festival Banner & Greeting Customizer */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE4DA] shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE4DA] pb-4">
                  <div>
                    <h3 className="font-serif-luxury text-2xl text-[#1C1917]">
                      Customize Festive Announcement &amp; Greeting
                    </h3>
                    <p className="text-xs text-[#57534E]">
                      Edit the greeting message displayed in the hero section and celebratory top banner.
                    </p>
                  </div>

                  {/* Toggle Banner Switch */}
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA]">
                    <span className="text-xs text-[#1C1917] font-semibold">Show Festive Top Banner:</span>
                    <input
                      type="checkbox"
                      checked={contentForm.showFestivalBanner}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setContentForm((prev) => ({ ...prev, showFestivalBanner: val }));
                        updateHotelContent({ showFestivalBanner: val });
                        triggerSaved(val ? 'Festive top banner enabled.' : 'Festive top banner hidden.');
                      }}
                      className="w-5 h-5 accent-[#946E3A] rounded cursor-pointer"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                      Festive Greeting Title (Displayed in Hero &amp; Banner)
                    </label>
                    <input
                      type="text"
                      value={contentForm.festivalGreetingTitle || ''}
                      onChange={(e) => setContentForm({ ...contentForm, festivalGreetingTitle: e.target.value })}
                      placeholder="e.g. Shubh Deepavali & Festive Celebrations"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] focus:border-[#946E3A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                      Festive Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={contentForm.festivalGreetingSubtitle || ''}
                      onChange={(e) => setContentForm({ ...contentForm, festivalGreetingSubtitle: e.target.value })}
                      placeholder="e.g. 10,000 hand-poured brass diyas & celebratory royal feasts"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] focus:border-[#946E3A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-[#EAE4DA]">
                  <button
                    type="button"
                    onClick={() => {
                      updateHotelContent({
                        festivalGreetingTitle: contentForm.festivalGreetingTitle,
                        festivalGreetingSubtitle: contentForm.festivalGreetingSubtitle,
                      });
                      triggerSaved('Festive greetings updated in real-time.');
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#946E3A] text-white text-xs font-semibold cursor-pointer shadow-md transition-colors"
                  >
                    Save Festive Greetings
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: Photos & Media Studio (Change Any Photo Across Website) */}
          {activeTab === 'photos' && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE4DA] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#946E3A] font-semibold mb-1">
                    <Camera className="w-4 h-4 text-[#946E3A]" />
                    <span>Resort Photography &amp; Visual Studio</span>
                  </div>
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#1C1917] font-light">
                    Change Photos Across the Entire Website
                  </h2>
                  <p className="text-xs text-[#57534E] max-w-2xl mt-1 leading-relaxed">
                    Update the hero background banner, sanctuary cover photos, suite &amp; villa photography, or dining and spa imagery. Paste your own image URLs or pick from curated architectural presets with instant live preview.
                  </p>
                </div>

                {/* Target Navigation */}
                <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-2xl border border-[#EAE4DA] shrink-0">
                  <button
                    type="button"
                    onClick={() => { setPhotoTarget('hero'); setCustomPhotoInput(''); }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      photoTarget === 'hero' ? 'bg-[#1C1917] text-white font-semibold' : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    Hero Banner
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPhotoTarget('branch'); setCustomPhotoInput(''); }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      photoTarget === 'branch' ? 'bg-[#1C1917] text-white font-semibold' : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    Sanctuaries
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPhotoTarget('room'); setCustomPhotoInput(''); }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      photoTarget === 'room' ? 'bg-[#1C1917] text-white font-semibold' : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    Suites &amp; Villas
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPhotoTarget('dining'); setCustomPhotoInput(''); }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      photoTarget === 'dining' ? 'bg-[#1C1917] text-white font-semibold' : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    Dining &amp; Spa
                  </button>
                </div>
              </div>

              {/* SECTION 1: HERO BANNER PHOTO */}
              {photoTarget === 'hero' && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE4DA] shadow-sm space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#946E3A] font-bold block mb-1">
                      Target: Public Landing Page
                    </span>
                    <h3 className="font-serif-luxury text-2xl text-[#1C1917]">
                      Hero Sanctuary Background Photo
                    </h3>
                    <p className="text-xs text-[#57534E]">
                      This is the main cinematic photograph guests see when they enter Hotel Manchester.
                    </p>
                  </div>

                  {/* Current Image Preview & URL Input */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                          Custom Image URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={customPhotoInput}
                            onChange={(e) => setCustomPhotoInput(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] focus:border-[#946E3A] focus:outline-none font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customPhotoInput.trim()) {
                                handleApplyHeroPhoto(customPhotoInput.trim());
                                setCustomPhotoInput('');
                              }
                            }}
                            disabled={!customPhotoInput.trim()}
                            className={`px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                              customPhotoInput.trim()
                                ? 'bg-[#1C1917] hover:bg-[#946E3A] text-white shadow-sm'
                                : 'bg-[#EAE4DA] text-[#A8A29E] cursor-not-allowed'
                            }`}
                          >
                            Apply URL
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-[#78716C] leading-relaxed">
                        Currently using: <span className="font-mono text-[#1C1917] truncate block">{hotelContent.heroImage || ASSET_IMAGES.hero}</span>
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#EAE4DA] border border-[#D8D0C5] shadow-md">
                      <img
                        src={resolveHotelImage(hotelContent.heroImage || ASSET_IMAGES.hero)}
                        alt="Current Hero Background"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold">
                        Live Hero Preview
                      </div>
                    </div>
                  </div>

                  {/* Curated Luxury Architectural Presets */}
                  <div className="pt-4 border-t border-[#F2ECE3]">
                    <h4 className="text-xs uppercase tracking-wider text-[#78716C] font-semibold mb-3">
                      Or Choose from Curated Luxury Architectural Presets:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {PHOTO_PRESETS.filter((p) => p.category === 'hero').map((preset) => (
                        <div
                          key={preset.id}
                          className="p-3 rounded-2xl border border-[#EAE4DA] hover:border-[#946E3A] bg-[#FAF8F5] transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-2 bg-[#EAE4DA]">
                              <img
                                src={preset.url}
                                alt={preset.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <span className="font-serif-luxury text-sm text-[#1C1917] font-medium block">
                              {preset.title}
                            </span>
                            <span className="text-[11px] text-[#78716C] block leading-tight mt-0.5">
                              {preset.description}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleApplyHeroPhoto(preset.url)}
                            className="mt-3 w-full py-1.5 rounded-lg bg-white border border-[#D8D0C5] hover:border-[#946E3A] hover:bg-[#FAF5EC] text-xs font-semibold text-[#1C1917] transition-colors cursor-pointer"
                          >
                            Set as Hero Photo
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: SANCTUARY BRANCH PHOTOS */}
              {photoTarget === 'branch' && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE4DA] shadow-sm space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#946E3A] font-bold block mb-1">
                      Target: Sanctuary Branch Pages
                    </span>
                    <h3 className="font-serif-luxury text-2xl text-[#1C1917]">
                      Update Sanctuary Cover Photo
                    </h3>
                    <p className="text-xs text-[#57534E]">
                      Select any branch to update its cover image across the sanctuaries grid and dedicated page.
                    </p>
                  </div>

                  {/* Branch Selector Dropdown */}
                  <div className="max-w-md">
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                      Select Sanctuary Branch to Edit
                    </label>
                    <select
                      value={selectedBranchForPhoto}
                      onChange={(e) => setSelectedBranchForPhoto(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] font-semibold focus:border-[#946E3A] focus:outline-none"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.city}, {b.state})
                        </option>
                      ))}
                    </select>
                  </div>

                  {(() => {
                    const currentBranch = branches.find((b) => b.id === selectedBranchForPhoto) || branches[0];
                    if (!currentBranch) return null;
                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                              Custom Image URL for {currentBranch.name}
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={customPhotoInput}
                                onChange={(e) => setCustomPhotoInput(e.target.value)}
                                placeholder="https://..."
                                className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] focus:border-[#946E3A] focus:outline-none font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (customPhotoInput.trim()) {
                                    handleApplyBranchPhoto(currentBranch.id, customPhotoInput.trim());
                                    setCustomPhotoInput('');
                                  }
                                }}
                                disabled={!customPhotoInput.trim()}
                                className={`px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                                  customPhotoInput.trim()
                                    ? 'bg-[#1C1917] hover:bg-[#946E3A] text-white shadow-sm'
                                    : 'bg-[#EAE4DA] text-[#A8A29E] cursor-not-allowed'
                                }`}
                              >
                                Save Photo
                              </button>
                            </div>
                          </div>

                          <div className="pt-2">
                            <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold block mb-2">
                              Presets for Sanctuaries:
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              {PHOTO_PRESETS.slice(0, 4).map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => handleApplyBranchPhoto(currentBranch.id, p.url)}
                                  className="p-2 rounded-xl border border-[#EAE4DA] hover:border-[#946E3A] bg-[#FAF8F5] text-left text-xs transition-colors cursor-pointer group"
                                >
                                  <span className="font-medium text-[#1C1917] block truncate">{p.title}</span>
                                  <span className="text-[10px] text-[#946E3A]">Apply Preset</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Live Branch Preview */}
                        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#EAE4DA] border border-[#D8D0C5] shadow-md">
                          <img
                            src={resolveHotelImage(currentBranch.image)}
                            alt={currentBranch.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold">
                            {currentBranch.name} ({currentBranch.city})
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* SECTION 3: SUITES & ROOM PHOTOS */}
              {photoTarget === 'room' && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE4DA] shadow-sm space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#946E3A] font-bold block mb-1">
                      Target: Suite &amp; Villa Catalog
                    </span>
                    <h3 className="font-serif-luxury text-2xl text-[#1C1917]">
                      Update Room / Suite Photography
                    </h3>
                    <p className="text-xs text-[#57534E]">
                      Select any suite to update its showcase photograph across search results and reservation modals.
                    </p>
                  </div>

                  {/* Room Selector Dropdown */}
                  <div className="max-w-md">
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                      Select Suite / Villa to Edit
                    </label>
                    <select
                      value={selectedRoomForPhoto}
                      onChange={(e) => setSelectedRoomForPhoto(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] font-semibold focus:border-[#946E3A] focus:outline-none"
                    >
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} · ₹{r.pricePerNight.toLocaleString('en-IN')}/night
                        </option>
                      ))}
                    </select>
                  </div>

                  {(() => {
                    const currentRoom = rooms.find((r) => r.id === selectedRoomForPhoto) || rooms[0];
                    if (!currentRoom) return null;
                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                              Custom Image URL for {currentRoom.name}
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={customPhotoInput}
                                onChange={(e) => setCustomPhotoInput(e.target.value)}
                                placeholder="https://..."
                                className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] focus:border-[#946E3A] focus:outline-none font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (customPhotoInput.trim()) {
                                    handleApplyRoomPhoto(currentRoom.id, customPhotoInput.trim());
                                    setCustomPhotoInput('');
                                  }
                                }}
                                disabled={!customPhotoInput.trim()}
                                className={`px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                                  customPhotoInput.trim()
                                    ? 'bg-[#1C1917] hover:bg-[#946E3A] text-white shadow-sm'
                                    : 'bg-[#EAE4DA] text-[#A8A29E] cursor-not-allowed'
                                }`}
                              >
                                Save Photo
                              </button>
                            </div>
                          </div>

                          <div className="pt-2">
                            <span className="text-xs uppercase tracking-wider text-[#78716C] font-semibold block mb-2">
                              Suite &amp; Villa Presets:
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              {PHOTO_PRESETS.filter((p) => p.category === 'room').map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => handleApplyRoomPhoto(currentRoom.id, p.url)}
                                  className="p-2 rounded-xl border border-[#EAE4DA] hover:border-[#946E3A] bg-[#FAF8F5] text-left text-xs transition-colors cursor-pointer"
                                >
                                  <span className="font-medium text-[#1C1917] block truncate">{p.title}</span>
                                  <span className="text-[10px] text-[#946E3A]">Apply Preset</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Live Room Preview */}
                        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#EAE4DA] border border-[#D8D0C5] shadow-md">
                          <img
                            src={resolveHotelImage(currentRoom.image)}
                            alt={currentRoom.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold">
                            {currentRoom.name}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* SECTION 4: DINING & SPA PHOTOS */}
              {photoTarget === 'dining' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dining Photo Card */}
                  <div className="p-6 rounded-3xl bg-white border border-[#EAE4DA] shadow-sm space-y-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#946E3A] font-bold block">
                      Gastronomy &amp; Dining Cover
                    </span>
                    <h3 className="font-serif-luxury text-xl text-[#1C1917]">
                      Courtyard Banquets &amp; Cellar
                    </h3>

                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#EAE4DA]">
                      <img
                        src={resolveHotelImage(hotelContent.diningImage || ASSET_IMAGES.palace)}
                        alt="Dining Experience"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Paste dining image URL..."
                        value={customPhotoInput}
                        onChange={(e) => setCustomPhotoInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] font-mono focus:border-[#946E3A] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customPhotoInput.trim()) {
                            handleApplyDiningPhoto(customPhotoInput.trim());
                            setCustomPhotoInput('');
                          }
                        }}
                        disabled={!customPhotoInput.trim()}
                        className="px-4 py-2 rounded-xl bg-[#1C1917] hover:bg-[#946E3A] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>

                    <div className="flex gap-2 pt-1">
                      {PHOTO_PRESETS.filter((p) => p.category === 'dining').map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleApplyDiningPhoto(p.url)}
                          className="flex-1 p-2 rounded-lg bg-[#FAF8F5] border border-[#EAE4DA] hover:border-[#946E3A] text-left text-[11px] truncate cursor-pointer"
                        >
                          <span className="block truncate font-medium text-[#1C1917]">{p.title}</span>
                          <span className="text-[9px] text-[#946E3A]">Apply Preset</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spa Photo Card */}
                  <div className="p-6 rounded-3xl bg-white border border-[#EAE4DA] shadow-sm space-y-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#946E3A] font-bold block">
                      Wellness &amp; Spa Cover
                    </span>
                    <h3 className="font-serif-luxury text-xl text-[#1C1917]">
                      Ayurvedic Rasayana Sanctuary
                    </h3>

                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#EAE4DA]">
                      <img
                        src={resolveHotelImage(hotelContent.spaImage || ASSET_IMAGES.nature)}
                        alt="Spa Experience"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Paste spa image URL..."
                        value={customPhotoInput}
                        onChange={(e) => setCustomPhotoInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] font-mono focus:border-[#946E3A] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customPhotoInput.trim()) {
                            handleApplySpaPhoto(customPhotoInput.trim());
                            setCustomPhotoInput('');
                          }
                        }}
                        disabled={!customPhotoInput.trim()}
                        className="px-4 py-2 rounded-xl bg-[#1C1917] hover:bg-[#946E3A] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>

                    <div className="flex gap-2 pt-1">
                      {PHOTO_PRESETS.filter((p) => p.category === 'spa').map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleApplySpaPhoto(p.url)}
                          className="flex-1 p-2 rounded-lg bg-[#FAF8F5] border border-[#EAE4DA] hover:border-[#946E3A] text-left text-[11px] truncate cursor-pointer"
                        >
                          <span className="block truncate font-medium text-[#1C1917]">{p.title}</span>
                          <span className="text-[9px] text-[#946E3A]">Apply Preset</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 1: Sanctuaries & Branches Management (ADD, REMOVE & RESTORE) */}
          {activeTab === 'branches' && (
            <motion.div
              key="branches"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {/* Summary Metrics & Add Branch Header */}
              <div className="p-6 rounded-3xl bg-white border border-[#EAE4DA] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#946E3A] font-semibold mb-1">
                    <Compass className="w-4 h-4" />
                    <span>Sanctuary Pages &amp; Branches Administration</span>
                  </div>
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#1C1917] font-light">
                    Manage Website Branches &amp; Sanctuary Pages
                  </h2>
                  <p className="text-xs text-[#57534E] max-w-2xl mt-1 leading-relaxed">
                    Add new sanctuary branches to the website, unpublish or remove branch pages when needed, and restore any removed branch page at any time with a single click.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right px-4 py-2 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DA]">
                    <span className="text-[10px] uppercase tracking-wider text-[#78716C] block">
                      Active on Website
                    </span>
                    <span className="text-xl font-semibold text-[#1C1917]">
                      {activeBranches.length}
                    </span>
                  </div>

                  <div className="text-right px-4 py-2 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DA]">
                    <span className="text-[10px] uppercase tracking-wider text-[#78716C] block">
                      Removed / Hidden
                    </span>
                    <span className="text-xl font-semibold text-amber-700">
                      {archivedBranches.length}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsAddingBranch(!isAddingBranch)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#1C1917] hover:bg-[#946E3A] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAddingBranch ? 'Close Form' : 'Add New Branch'}</span>
                  </button>
                </div>
              </div>

              {/* Add New Branch Form Card (Collapsible) */}
              <AnimatePresence>
                {isAddingBranch && (
                  <motion.form
                    initial={{ opacity: 0, height: 0, scale: 0.98 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.98 }}
                    onSubmit={handleCreateBranch}
                    className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#946E3A]/40 shadow-lg space-y-6 overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-[#EAE4DA] pb-4">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-[#946E3A] font-semibold block">
                          Website Expansion
                        </span>
                        <h3 className="font-serif-luxury text-2xl text-[#1C1917]">
                          Add New Sanctuary Branch &amp; Dedicated Page
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddingBranch(false)}
                        className="text-xs text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                          Sanctuary / Branch Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Hotel Manchester Royal Haveli"
                          value={newBranch.name}
                          onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] focus:border-[#946E3A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Jaipur, Kashmir, Varanasi, Coorg"
                          value={newBranch.city}
                          onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] focus:border-[#946E3A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                          State / Region *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rajasthan, Himachal Pradesh"
                          value={newBranch.state}
                          onChange={(e) => setNewBranch({ ...newBranch, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] focus:border-[#946E3A] focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                          Sanctuary Tagline
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Centuries-old pink sandstone arches overlooking tranquil lotus pools"
                          value={newBranch.tagline}
                          onChange={(e) => setNewBranch({ ...newBranch, tagline: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] focus:border-[#946E3A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                          Star Rating (1 - 5)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="4"
                          max="5"
                          value={newBranch.rating}
                          onChange={(e) => setNewBranch({ ...newBranch, rating: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] font-mono focus:border-[#946E3A] focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                          Physical Address
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Amer Palace Road, Jal Mahal Sanctuary Precinct, Jaipur 302002"
                          value={newBranch.address}
                          onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] focus:border-[#946E3A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                          Concierge Phone
                        </label>
                        <input
                          type="text"
                          placeholder="+91 91712 90395"
                          value={newBranch.phone}
                          onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] focus:border-[#946E3A] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                          Microclimate Atmosphere Note
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Crisp alpine air &amp; starlit cedar evenings"
                          value={newBranch.climateNote}
                          onChange={(e) => setNewBranch({ ...newBranch, climateNote: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] focus:border-[#946E3A] focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1.5">
                          Sanctuary Photography Asset
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                          {[
                            { label: 'Royal Palace', img: ASSET_IMAGES.palace },
                            { label: 'Heritage Villa', img: ASSET_IMAGES.villa },
                            { label: 'Presidential Suite', img: ASSET_IMAGES.presidential },
                            { label: 'Luxury Resort', img: ASSET_IMAGES.hero },
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setNewBranch({ ...newBranch, image: item.img })}
                              className={`relative rounded-xl overflow-hidden border p-1 text-left cursor-pointer transition-all ${
                                newBranch.image === item.img
                                  ? 'border-[#946E3A] ring-2 ring-[#946E3A]'
                                  : 'border-[#EAE4DA] opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={item.img} alt={item.label} className="w-full h-14 object-cover rounded-lg mb-1" />
                              <span className="text-[10px] font-medium text-[#1C1917] block truncate">{item.label}</span>
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="Or paste custom image URL..."
                          value={newBranch.image}
                          onChange={(e) => setNewBranch({ ...newBranch, image: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#57534E] font-mono focus:border-[#946E3A] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Signature experiences inputs */}
                    <div className="pt-2">
                      <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-2">
                        3 Signature Experiences for this Sanctuary Page
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {newBranch.signatureExperiences.map((exp, idx) => (
                          <input
                            key={idx}
                            type="text"
                            placeholder={`Experience ${idx + 1}...`}
                            value={exp}
                            onChange={(e) => {
                              const updated = [...newBranch.signatureExperiences];
                              updated[idx] = e.target.value;
                              setNewBranch({ ...newBranch, signatureExperiences: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] focus:border-[#946E3A] focus:outline-none"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Form Submission */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE4DA]">
                      <button
                        type="button"
                        onClick={() => setIsAddingBranch(false)}
                        className="px-5 py-2.5 rounded-full border border-[#D8D0C5] text-xs font-medium text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-7 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#946E3A] text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Publish Sanctuary to Website</span>
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Active Sanctuary Branches List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-luxury text-2xl text-[#1C1917] font-light">
                    Active Sanctuary Pages ({activeBranches.length})
                  </h3>
                  <span className="text-xs text-[#78716C]">
                    Displayed on website search, navigation &amp; sanctuaries grid
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeBranches.map((branch) => {
                    const branchRoomsCount = rooms.filter(r => r.branchId === branch.id).length;

                    return (
                      <div
                        key={branch.id}
                        className="p-5 rounded-2xl bg-white border border-[#EAE4DA] hover:border-[#946E3A] transition-all shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-[#EAE4DA]">
                            <img
                              src={resolveHotelImage(branch.image)}
                              alt={branch.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-semibold text-[#1C1917] flex items-center gap-1 shadow-sm">
                              <MapPin className="w-3 h-3 text-[#946E3A]" />
                              <span>{branch.city}, {branch.state}</span>
                            </div>
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-semibold text-[#946E3A] shadow-sm">
                              ★ {branch.rating.toFixed(2)}
                            </div>
                          </div>

                          <h4 className="font-serif-luxury text-xl text-[#1C1917] leading-snug mb-1">
                            {branch.name}
                          </h4>
                          <p className="text-xs text-[#57534E] line-clamp-2 mb-3">
                            {branch.tagline}
                          </p>

                          <div className="py-2 border-y border-[#F2ECE3] text-[11px] text-[#78716C] flex items-center justify-between">
                            <span>{branchRoomsCount} suites linked</span>
                            <span className="truncate max-w-[140px]">{branch.phone}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex items-center justify-between gap-2 border-t border-[#F2ECE3]">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setAdminPreviewBranch(branch)}
                              className="inline-flex items-center gap-1.5 text-xs text-[#946E3A] hover:text-[#6B4C20] font-semibold cursor-pointer py-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedBranchForPhoto(branch.id);
                                setPhotoTarget('branch');
                                setActiveTab('photos');
                              }}
                              className="inline-flex items-center gap-1.5 text-xs text-[#57534E] hover:text-[#946E3A] font-semibold cursor-pointer py-1"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Change Photo</span>
                            </button>
                          </div>

                          <button
                            onClick={() => setBranchToRemove(branch)}
                            title="Remove or delete this branch"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-all cursor-pointer shadow-sm hover:shadow"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Remove Branch</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Archived & Removed Branch Pages (With Instant Restore!) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF5EB] border border-[#E8DEC9] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2D5BA] pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#946E3A] font-semibold">
                      <RotateCcw className="w-4 h-4" />
                      <span>Archived &amp; Removed Branch Pages ({archivedBranches.length})</span>
                    </div>
                    <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#1C1917] font-light mt-0.5">
                      Restore Removed Sanctuary Pages
                    </h3>
                  </div>
                  <p className="text-xs text-[#57534E] max-w-md">
                    Branches listed here are currently hidden from public guests. You can restore any branch page back to the website anytime.
                  </p>
                </div>

                {archivedBranches.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#78716C] bg-white/60 rounded-2xl border border-dashed border-[#D8CBB2]">
                    No branch pages are currently removed. When you click "Remove Page" on any active branch, it safely moves here so you can restore it at any time.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {archivedBranches.map((branch) => (
                      <div
                        key={branch.id}
                        className="p-4 rounded-2xl bg-white border border-[#DFD4BC] flex items-center justify-between gap-4 shadow-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={resolveHotelImage(branch.image)}
                            alt={branch.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 grayscale opacity-80"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold block">
                              Removed from Website
                            </span>
                            <h4 className="font-serif-luxury text-lg text-[#1C1917] truncate">
                              {branch.name}
                            </h4>
                            <span className="text-xs text-[#78716C] block truncate">
                              {branch.city}, {branch.state}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Prominent Restore Button */}
                          <button
                            onClick={() => handleRestoreBranchPage(branch.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                            title="Restore this branch page back to the website"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore Page</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Permanently delete "${branch.name}" completely from storage? This cannot be undone.`)) {
                                deleteBranchPermanently(branch.id);
                                triggerSaved(`Permanently deleted ${branch.name}.`);
                              }
                            }}
                            className="p-2 rounded-lg text-[#78716C] hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Permanently Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: Bookings Management */}
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
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#EAE4DA] shadow-sm">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#78716C] mr-2 font-medium">Filter by Status:</span>
                  {(['all', 'pending_upi', 'verified', 'checked_in', 'cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setBookingFilter(st)}
                      className={`px-3.5 py-1.5 rounded-full capitalize cursor-pointer transition-colors text-xs font-medium ${
                        bookingFilter === st
                          ? 'bg-[#1C1917] text-white shadow-sm font-semibold'
                          : 'bg-[#FAF8F5] text-[#57534E] hover:text-[#1C1917] border border-[#EAE4DA]'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-[#78716C] font-mono">
                  Showing {filteredBookings.length} of {bookings.length} reservations
                </div>
              </div>

              {/* Bookings Table / Cards */}
              <div className="space-y-4">
                {filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-6 rounded-2xl bg-white border border-[#EAE4DA] hover:border-[#946E3A] transition-all shadow-sm"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#F2ECE3] gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-semibold text-[#946E3A]">
                            {b.bookingCode}
                          </span>
                          <span className="text-xs text-[#C4B9AA]">·</span>
                          <span className="text-xs text-[#78716C]">
                            Booked on {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-serif-luxury text-2xl text-[#1C1917]">
                          {b.roomName}
                        </h3>
                        <p className="text-xs text-[#57534E]">{b.branchName}</p>
                      </div>

                      {/* Status & Quick Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-right mr-2">
                          <span className="text-[10px] uppercase tracking-wider text-[#78716C] block">
                            Tariff
                          </span>
                          <span className="font-serif-luxury text-2xl text-[#1C1917] font-normal">
                            ₹{b.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {b.paymentStatus === 'pending_upi' && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              updateBookingStatus(b.id, 'verified');
                              triggerSaved('Reservation marked verified.');
                            }}
                            className="px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer shadow-sm flex items-center gap-1.5"
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
                              triggerSaved('Guest checked in.');
                            }}
                            className="px-4 py-2 rounded-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold cursor-pointer shadow-sm flex items-center gap-1.5"
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
                                triggerSaved('Reservation cancelled.');
                              }
                            }}
                            className="px-3 py-1.5 rounded-full border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs cursor-pointer"
                          >
                            Cancel
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#78716C] block mb-1">
                          Guest Contact
                        </span>
                        <span className="text-[#1C1917] font-semibold block">{b.guestDetails.fullName}</span>
                        <span className="text-[#57534E] block truncate">{b.guestDetails.email}</span>
                        <span className="text-[#57534E] block">{b.guestDetails.phone}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#78716C] block mb-1">
                          Dates &amp; Party
                        </span>
                        <span className="text-[#1C1917] font-mono block font-medium">
                          {b.checkInDate} → {b.checkOutDate}
                        </span>
                        <span className="text-[#57534E] block">
                          {b.nights} Nights · {b.guests.adults}A, {b.guests.children}C
                        </span>
                        <span className="text-[#57534E] block">Arrival: {b.guestDetails.arrivalTime || '14:00'}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#78716C] block mb-1">
                          UPI Verification UTR
                        </span>
                        <span className="text-[#946E3A] font-mono font-semibold block">
                          {b.guestDetails.upiUtr || 'No UTR submitted'}
                        </span>
                        <span className="text-[11px] text-[#78716C] block">VPA: {hotelContent.upiVpa}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#78716C] block mb-1">
                          Add-ons &amp; Notes
                        </span>
                        <span className="text-[#1C1917] block truncate">
                          {b.addOns.length > 0 ? b.addOns.join(', ') : 'None'}
                        </span>
                        {b.guestDetails.specialRequests && (
                          <span className="text-[#946E3A] text-[11px] block italic line-clamp-2 mt-0.5">
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

          {/* TAB 3: Real-Time Room & Pricing Management */}
          {activeTab === 'rooms' && (
            <motion.div
              key="rooms"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="p-6 rounded-2xl bg-white border border-[#EAE4DA] shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury text-2xl text-[#1C1917]">
                    Real-Time Accommodations &amp; Pricing Editor
                  </h3>
                  <p className="text-xs text-[#57534E] mt-1">
                    Update nightly rates, toggle instant room availability, or edit descriptions. Changes reflect immediately across all guests.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rooms.map((room) => {
                  const isEditing = editingRoomId === room.id;
                  const branch = branches.find(b => b.id === room.branchId);

                  return (
                    <div
                      key={room.id}
                      className="p-6 rounded-2xl bg-white border border-[#EAE4DA] shadow-sm flex flex-col justify-between"
                    >
                      {isEditing && roomEditForm ? (
                        /* Edit Mode Form */
                        <div className="space-y-4">
                          <div>
                            <label className="text-[11px] uppercase tracking-wider text-[#78716C] block mb-1 font-semibold">
                              Suite Name
                            </label>
                            <input
                              type="text"
                              value={roomEditForm.name}
                              onChange={(e) =>
                                setRoomEditForm({ ...roomEditForm, name: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917]"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] uppercase tracking-wider text-[#78716C] block mb-1 font-semibold">
                              Suite Showcase Photo URL
                            </label>
                            <input
                              type="url"
                              value={roomEditForm.image}
                              onChange={(e) =>
                                setRoomEditForm({ ...roomEditForm, image: e.target.value })
                              }
                              placeholder="https://..."
                              className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] font-mono"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] uppercase tracking-wider text-[#946E3A] block mb-1 font-semibold">
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
                                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#946E3A] text-xs text-[#1C1917] font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] uppercase tracking-wider text-[#78716C] block mb-1 font-semibold">
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
                                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] uppercase tracking-wider text-[#78716C] block mb-1 font-semibold">
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
                              className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917]"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingRoomId(null);
                                setRoomEditForm(null);
                              }}
                              className="px-4 py-2 rounded-full border border-[#D8D0C5] text-xs text-[#57534E] cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveRoom}
                              className="px-5 py-2 rounded-full bg-[#1C1917] hover:bg-[#946E3A] text-white text-xs font-semibold cursor-pointer shadow-sm transition-colors"
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
                              <span className="text-[10px] uppercase tracking-widest text-[#78716C] font-mono">
                                {room.category} · {branch?.city || 'Estate'}
                              </span>

                              {/* Instant Availability Toggle */}
                              <button
                                onClick={() => {
                                  toggleRoomAvailability(room.id);
                                  triggerSaved(`Room availability toggled.`);
                                }}
                                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                                  room.available
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold'
                                    : 'bg-rose-50 text-rose-800 border border-rose-300 font-semibold'
                                }`}
                              >
                                {room.available ? '✓ Available Online' : '✕ Sold Out / Blocked'}
                              </button>
                            </div>

                            <h4 className="font-serif-luxury text-2xl text-[#1C1917] mb-2">
                              {room.name}
                            </h4>
                            <p className="text-xs text-[#57534E] leading-relaxed mb-4">
                              {room.description}
                            </p>

                            <div className="flex items-baseline gap-2 py-3 border-y border-[#F2ECE3]">
                              <span className="text-xs text-[#78716C]">Nightly Tariff:</span>
                              <span className="font-serif-luxury text-2xl text-[#946E3A] font-semibold">
                                ₹{room.pricePerNight.toLocaleString('en-IN')}
                              </span>
                              <span className="text-xs text-[#78716C]">· {room.sizeSqFt} sq.ft</span>
                            </div>
                          </div>

                          <div className="pt-4 flex items-center justify-between">
                            <button
                              onClick={() => {
                                setSelectedRoomForPhoto(room.id);
                                setPhotoTarget('room');
                                setActiveTab('photos');
                              }}
                              className="inline-flex items-center gap-1.5 text-xs text-[#57534E] hover:text-[#946E3A] font-semibold cursor-pointer py-1"
                            >
                              <Camera className="w-3.5 h-3.5 text-[#946E3A]" />
                              <span>Change Photo</span>
                            </button>

                            <button
                              onClick={() => handleStartEditRoom(room)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D8D0C5] hover:border-[#946E3A] hover:bg-[#FAF8F5] text-xs font-medium text-[#1C1917] transition-all cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-[#946E3A]" />
                              <span>Edit Tariff &amp; Copy</span>
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

          {/* TAB 4: Guest Messaging Concierge */}
          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]"
            >
              {/* Threads list */}
              <div className="bg-white rounded-2xl border border-[#EAE4DA] overflow-hidden flex flex-col shadow-sm">
                <div className="p-4 border-b border-[#EAE4DA] bg-[#FAF8F5]">
                  <h3 className="font-serif-luxury text-lg text-[#1C1917]">
                    Guest Conversations ({chatThreads.length})
                  </h3>
                </div>
                <div className="overflow-y-auto flex-1 divide-y divide-[#F2ECE3]">
                  {chatThreads.map((t) => {
                    const isSelected = t.booking.id === selectedChatBookingId;
                    return (
                      <button
                        key={t.booking.id}
                        onClick={() => setSelectedChatBookingId(t.booking.id)}
                        className={`w-full text-left p-4 transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#FAF5EB]' : 'hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs text-[#1C1917]">
                            {t.booking.guestDetails.fullName}
                          </span>
                          <span className="font-mono text-[10px] text-[#946E3A]">
                            {t.booking.bookingCode}
                          </span>
                        </div>
                        <p className="text-xs text-[#78716C] truncate">
                          {t.lastMessage ? t.lastMessage.text : 'No messages yet'}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Conversation Desk */}
              {activeThread && (
                <div className="md:col-span-2 bg-white rounded-2xl border border-[#EAE4DA] overflow-hidden flex flex-col shadow-sm">
                  <div className="p-4 border-b border-[#EAE4DA] bg-[#FAF8F5] flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-[#1C1917]">
                        {activeThread.booking.guestDetails.fullName}
                      </h4>
                      <span className="text-xs text-[#78716C]">
                        {activeThread.booking.roomName} ({activeThread.booking.bookingCode})
                      </span>
                    </div>
                    <span className="text-xs text-[#946E3A] font-mono">
                      {activeThread.booking.guestDetails.phone}
                    </span>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF8F5]/60">
                    {activeThread.messages.map((m) => {
                      const isGuest = m.sender === 'guest';
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isGuest ? 'items-start' : 'items-end'}`}
                        >
                          <span className="text-[10px] text-[#78716C] mb-1 px-1">
                            {isGuest ? `${m.guestName} (Guest)` : 'You (Resort Concierge)'}
                          </span>
                          <div
                            className={`max-w-md p-3.5 rounded-2xl text-xs ${
                              isGuest
                                ? 'bg-white text-[#1C1917] border border-[#EAE4DA] rounded-tl-none shadow-sm'
                                : 'bg-[#1C1917] text-white rounded-tr-none font-medium'
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
                    className="p-3 bg-white border-t border-[#EAE4DA] flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Reply as Hotel Manchester Concierge..."
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-full bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] focus:outline-none focus:border-[#946E3A]"
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#946E3A] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                    >
                      <span>Reply</span>
                      <Send className="w-3.5 h-3.5" />
                    </motion.button>
                  </form>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5: Content & Promotions Editor */}
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
              <div className="p-6 rounded-2xl bg-white border border-[#EAE4DA] space-y-4 shadow-sm">
                <h3 className="font-serif-luxury text-2xl text-[#1C1917]">
                  Promotional Offers &amp; Bottom Banner Manager
                </h3>
                <p className="text-xs text-[#57534E]">
                  These offers power the bottom promotional ticker and the booking discount code verification.
                </p>

                <div className="space-y-4 pt-2">
                  {promotions.map((promo) => (
                    <div
                      key={promo.id}
                      className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#946E3A]">
                            {promo.code}
                          </span>
                          <span className="text-xs text-[#78716C]">
                            ({promo.discountPercent}% Off)
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#1C1917] mt-1">{promo.title}</h4>
                        <p className="text-xs text-[#57534E] mt-0.5">{promo.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            updatePromotion({ ...promo, active: !promo.active });
                            triggerSaved('Promotion status toggled.');
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            promo.active
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                          }`}
                        >
                          {promo.active ? '✓ Active on Banner' : '✕ Inactive'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotel General Information & UPI VPA */}
              <form
                onSubmit={handleSaveContent}
                className="p-6 sm:p-8 rounded-2xl bg-white border border-[#EAE4DA] space-y-5 shadow-sm"
              >
                <h3 className="font-serif-luxury text-2xl text-[#1C1917]">
                  General Sanctuary Settings &amp; UPI Gateway
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1">
                      UPI VPA Address *
                    </label>
                    <input
                      type="text"
                      value={contentForm.upiVpa}
                      onChange={(e) => setContentForm({ ...contentForm, upiVpa: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs font-mono text-[#1C1917]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1">
                      UPI Merchant Payee Name *
                    </label>
                    <input
                      type="text"
                      value={contentForm.upiPayeeName}
                      onChange={(e) => setContentForm({ ...contentForm, upiPayeeName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1">
                      Concierge Phone
                    </label>
                    <input
                      type="text"
                      value={contentForm.contactNumber}
                      onChange={(e) => setContentForm({ ...contentForm, contactNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1">
                      Concierge WhatsApp
                    </label>
                    <input
                      type="text"
                      value={contentForm.whatsappNumber}
                      onChange={(e) => setContentForm({ ...contentForm, whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1">
                      Default Advance Token Deposit % *
                    </label>
                    <select
                      value={contentForm.defaultAdvanceDepositPercent || 25}
                      onChange={(e) => setContentForm({ ...contentForm, defaultAdvanceDepositPercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917] font-semibold"
                    >
                      <option value={25}>25% Advance Token Guarantee (Standard)</option>
                      <option value={50}>50% Half Deposit</option>
                      <option value={100}>100% Full Pre-Payment Only</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1">
                      Hero Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={contentForm.heroSubtitle}
                      onChange={(e) => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D0C5] text-xs text-[#1C1917]"
                    />
                  </div>
                </div>

                {/* Live Amount QR Generator Testing Station */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DA] space-y-4">
                  <div className="flex items-center gap-2">
                    <QrIcon className="w-4 h-4 text-[#946E3A]" />
                    <span className="font-serif-luxury text-base text-[#1C1917] font-medium">
                      Admin Test: Live Amount QR Code Generator
                    </span>
                  </div>
                  <p className="text-xs text-[#57534E]">
                    Verify that your UPI VPA ({contentForm.upiVpa}) encodes amounts and generates clean scannable QR codes for guests.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                    <div className="p-3 bg-white rounded-2xl border border-[#D8D0C5] shadow-sm">
                      {testQrDataUrl ? (
                        <img src={testQrDataUrl} alt="Test QR" className="w-40 h-40 object-contain" />
                      ) : (
                        <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-lg">
                          <QrIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 flex-1 text-xs">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#78716C] font-semibold mb-1">
                          Test QR Amount (₹)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="100"
                            step="500"
                            value={testQrAmount}
                            onChange={(e) => setTestQrAmount(Number(e.target.value))}
                            className="w-40 px-3 py-2 rounded-xl bg-white border border-[#D8D0C5] text-xs font-mono font-bold text-[#1C1917]"
                          />
                          <span className="font-serif-luxury text-xl font-bold text-[#946E3A]">
                            ₹{testQrAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#EAE4DA] font-mono text-[10px] text-[#78716C] truncate">
                        upi://pay?pa={contentForm.upiVpa}&amp;pn={encodeURIComponent(contentForm.upiPayeeName)}&amp;am={testQrAmount}&amp;cu=INR
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready for guest scanning via PhonePe, GPay, Paytm &amp; BHIM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#EAE4DA]">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset all demo bookings and revert to original catalog?')) {
                        resetAllData();
                        window.location.reload();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D8D0C5] text-xs text-[#78716C] hover:text-[#1C1917]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset All to Defaults</span>
                  </button>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#946E3A] text-white text-xs font-semibold cursor-pointer shadow-md transition-colors"
                  >
                    Save Global Settings
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sanctuary Branch Modal Preview for Admin */}
      <AnimatePresence>
        {adminPreviewBranch && (
          <BranchPageModal
            branch={adminPreviewBranch}
            isAdmin={true}
            onClose={() => setAdminPreviewBranch(null)}
            onSelectRoom={() => setAdminPreviewBranch(null)}
          />
        )}
      </AnimatePresence>

      {/* Remove Branch Confirmation Dialog Modal */}
      <AnimatePresence>
        {branchToRemove && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-white rounded-3xl border border-[#EAE4DA] shadow-2xl p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                  <Trash2 className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-2xl text-[#1C1917]">
                    Remove Branch
                  </h3>
                  <span className="text-xs text-[#78716C]">
                    {branchToRemove.name} · {branchToRemove.city}, {branchToRemove.state}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#57534E] leading-relaxed">
                Choose how you would like to handle this sanctuary branch:
              </p>

              <div className="space-y-3">
                {/* Option 1: Remove from Website (soft remove, restorable) */}
                <button
                  onClick={() => {
                    handleRemoveBranchPage(branchToRemove);
                    setBranchToRemove(null);
                  }}
                  className="w-full text-left p-4 rounded-2xl border-2 border-amber-300 bg-amber-50/70 hover:bg-amber-100 transition-all flex items-start gap-3.5 group cursor-pointer shadow-sm"
                >
                  <EyeOff className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-xs text-[#1C1917] block">
                      Remove from Website (Restorable Anytime)
                    </span>
                    <span className="text-xs text-[#57534E] block mt-0.5 leading-relaxed">
                      Immediately unpublishes this branch and hides its page from public visitors. It moves safely to the "Removed Branches" section below and can be restored with one click.
                    </span>
                  </div>
                </button>

                {/* Option 2: Delete permanently */}
                <button
                  onClick={() => {
                    deleteBranchPermanently(branchToRemove.id);
                    setBranchToRemove(null);
                    triggerSaved(`Permanently deleted "${branchToRemove.name}".`);
                  }}
                  className="w-full text-left p-4 rounded-2xl border border-rose-300 bg-rose-50/70 hover:bg-rose-100 transition-all flex items-start gap-3.5 group cursor-pointer"
                >
                  <Trash2 className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-xs text-rose-900 block">
                      Delete Branch Permanently
                    </span>
                    <span className="text-xs text-rose-700/80 block mt-0.5 leading-relaxed">
                      Completely purges this branch from storage. This action cannot be undone.
                    </span>
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE4DA]">
                <button
                  onClick={() => setBranchToRemove(null)}
                  className="px-5 py-2.5 rounded-full border border-[#D8D0C5] text-xs font-semibold text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

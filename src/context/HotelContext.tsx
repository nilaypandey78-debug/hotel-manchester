import React, { createContext, useContext, useState, useEffect } from 'react';
import { Branch, Room, Booking, ChatMessage, PromotionalOffer, HotelContent } from '../types';
import { resolveHotelImage } from '../utils/imageAssets';
import {
  INITIAL_BRANCHES,
  INITIAL_ROOMS,
  INITIAL_BOOKINGS,
  INITIAL_MESSAGES,
  INITIAL_PROMOTIONS,
  INITIAL_HOTEL_CONTENT
} from '../data/initialData';

interface HotelContextType {
  branches: Branch[];
  activeBranches: Branch[];
  archivedBranches: Branch[];
  rooms: Room[];
  bookings: Booking[];
  messages: ChatMessage[];
  promotions: PromotionalOffer[];
  hotelContent: HotelContent;
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
  // Room actions
  updateRoom: (room: Room) => void;
  toggleRoomAvailability: (roomId: string) => void;
  // Branch actions
  addBranch: (branch: Omit<Branch, 'id' | 'createdAt'>) => Branch;
  updateBranch: (branch: Branch) => void;
  removeBranch: (branchId: string) => void;
  restoreBranch: (branchId: string) => void;
  deleteBranchPermanently: (branchId: string) => void;
  // Booking actions
  createBooking: (booking: Omit<Booking, 'id' | 'bookingCode' | 'createdAt'>) => Booking;
  updateBookingStatus: (bookingId: string, status: Booking['paymentStatus']) => void;
  verifyBookingUtr: (bookingId: string, utr: string) => void;
  cancelBooking: (bookingId: string) => void;
  // Messaging actions
  sendMessage: (bookingId: string, guestName: string, guestEmail: string, sender: 'guest' | 'concierge', text: string) => void;
  // Promo & Content actions
  updatePromotion: (promo: PromotionalOffer) => void;
  updateHotelContent: (content: Partial<HotelContent>) => void;
  resetAllData: () => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BRANCHES: 'hotel_manchester_branches_v1',
  ROOMS: 'hotel_manchester_rooms_v1',
  BOOKINGS: 'hotel_manchester_bookings_v1',
  MESSAGES: 'hotel_manchester_messages_v1',
  PROMOTIONS: 'hotel_manchester_promotions_v1',
  CONTENT: 'hotel_manchester_content_v1',
};

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BRANCHES);
    const data: Branch[] = saved ? JSON.parse(saved) : INITIAL_BRANCHES;
    return data.map((b) => ({ ...b, image: resolveHotelImage(b.image) }));
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROOMS);
    const data: Room[] = saved ? JSON.parse(saved) : INITIAL_ROOMS;
    return data.map((r) => ({ ...r, image: resolveHotelImage(r.image) }));
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [promotions, setPromotions] = useState<PromotionalOffer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROMOTIONS);
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  const [hotelContent, setHotelContent] = useState<HotelContent>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTENT);
    if (!saved) return INITIAL_HOTEL_CONTENT;
    try {
      const parsed = JSON.parse(saved);
      if (!parsed.whatsappNumber || parsed.whatsappNumber === '+919876543210') {
        parsed.whatsappNumber = '+91 91712 90395';
      }
      return parsed;
    } catch {
      return INITIAL_HOTEL_CONTENT;
    }
  });

  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(hotelContent));
  }, [hotelContent]);

  const updateRoom = (updated: Room) => {
    setRooms(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const toggleRoomAvailability = (roomId: string) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, available: !r.available } : r));
  };

  const updateBranch = (updated: Branch) => {
    setBranches(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const addBranch = (branchData: Omit<Branch, 'id' | 'createdAt'>): Branch => {
    const slug = branchData.city.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'estate';
    const newBranch: Branch = {
      ...branchData,
      id: `branch-${slug}-${Date.now().toString().slice(-4)}`,
      image: resolveHotelImage(branchData.image),
      archived: false,
      createdAt: new Date().toISOString(),
    };
    setBranches(prev => [newBranch, ...prev]);
    return newBranch;
  };

  const removeBranch = (branchId: string) => {
    // Soft remove / archive branch page so public website hides it but admin can restore anytime
    setBranches(prev => prev.map(b => b.id === branchId ? { ...b, archived: true, archivedAt: new Date().toISOString() } : b));
  };

  const restoreBranch = (branchId: string) => {
    // Restore removed branch page back to the public website
    setBranches(prev => prev.map(b => b.id === branchId ? { ...b, archived: false, archivedAt: undefined } : b));
  };

  const deleteBranchPermanently = (branchId: string) => {
    setBranches(prev => prev.filter(b => b.id !== branchId));
  };

  const activeBranches = branches.filter(b => !b.archived);
  const archivedBranches = branches.filter(b => !!b.archived);

  const createBooking = (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt'>): Booking => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingCode: `HM-${randomSuffix}`,
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [newBooking, ...prev]);

    // Send initial automated welcome message from concierge
    const welcomeMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId: newBooking.id,
      guestName: newBooking.guestDetails.fullName,
      guestEmail: newBooking.guestDetails.email,
      sender: 'concierge',
      text: `Greetings ${newBooking.guestDetails.fullName}. We are delighted to welcome your reservation for ${newBooking.roomName}. Our concierge team is at your dedicated service. Please feel free to request any bespoke amenities or dining arrangements.`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [...prev, welcomeMsg]);

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: Booking['paymentStatus']) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, paymentStatus: status } : b));
  };

  const verifyBookingUtr = (bookingId: string, utr: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentStatus: 'verified',
          guestDetails: { ...b.guestDetails, upiUtr: utr }
        };
      }
      return b;
    }));
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, paymentStatus: 'cancelled' } : b));
  };

  const sendMessage = (bookingId: string, guestName: string, guestEmail: string, sender: 'guest' | 'concierge', text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId,
      guestName,
      guestEmail,
      sender,
      text,
      timestamp: new Date().toISOString(),
      read: sender === 'concierge' ? false : true
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const updatePromotion = (updated: PromotionalOffer) => {
    setPromotions(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const updateHotelContent = (content: Partial<HotelContent>) => {
    setHotelContent(prev => ({ ...prev, ...content }));
  };

  const resetAllData = () => {
    setBranches(INITIAL_BRANCHES);
    setRooms(INITIAL_ROOMS);
    setBookings(INITIAL_BOOKINGS);
    setMessages(INITIAL_MESSAGES);
    setPromotions(INITIAL_PROMOTIONS);
    setHotelContent(INITIAL_HOTEL_CONTENT);
    localStorage.clear();
  };

  return (
    <HotelContext.Provider
      value={{
        branches,
        activeBranches,
        archivedBranches,
        rooms,
        bookings,
        messages,
        promotions,
        hotelContent,
        selectedBranchId,
        setSelectedBranchId,
        updateRoom,
        toggleRoomAvailability,
        addBranch,
        updateBranch,
        removeBranch,
        restoreBranch,
        deleteBranchPermanently,
        createBooking,
        updateBookingStatus,
        verifyBookingUtr,
        cancelBooking,
        sendMessage,
        updatePromotion,
        updateHotelContent,
        resetAllData,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};

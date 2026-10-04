export interface Room {
  id: string;
  name: string;
  category: 'Royal Suite' | 'Garden Villa' | 'Presidential Penthouse' | 'Courtyard Pavilion' | 'Lakeview Sanctuary';
  branchId: string;
  pricePerNight: number;
  capacityAdults: number;
  capacityChildren: number;
  sizeSqFt: number;
  bedType: string;
  view: string;
  rating: number;
  reviewsCount: number;
  image: string;
  features: string[];
  description: string;
  available: boolean;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  signatureExperiences: string[];
  image: string;
  rating: number;
  climateNote: string;
  archived?: boolean;
  archivedAt?: string;
  createdAt?: string;
}

export type IndianFestivalTheme = 
  | 'default' 
  | 'diwali' 
  | 'holi' 
  | 'navratri' 
  | 'monsoon' 
  | 'royal_wedding';

export interface BookingGuestDetails {
  fullName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  upiUtr?: string;
  arrivalTime?: string;
  pillowPreference?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  roomId: string;
  roomName: string;
  branchId: string;
  branchName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: {
    adults: number;
    children: number;
  };
  guestDetails: BookingGuestDetails;
  totalAmount: number;
  paidAmount?: number;
  paymentType?: 'full' | 'advance_deposit';
  paymentStatus: 'pending_upi' | 'verified' | 'checked_in' | 'completed' | 'cancelled';
  createdAt: string;
  addOns: string[];
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  guestName: string;
  guestEmail: string;
  sender: 'guest' | 'concierge';
  text: string;
  timestamp: string;
  read: boolean;
}

export interface PromotionalOffer {
  id: string;
  title: string;
  code: string;
  discountPercent: number;
  description: string;
  validUntil: string;
  active: boolean;
}

export interface HotelContent {
  hotelName: string;
  tagline: string;
  welcomingHeadline: string;
  contactNumber: string;
  conciergeEmail: string;
  whatsappNumber: string;
  upiVpa: string;
  upiPayeeName: string;
  heroSubtitle: string;
  heroImage?: string;
  diningImage?: string;
  spaImage?: string;
  activeFestivalTheme: IndianFestivalTheme;
  festivalGreetingTitle?: string;
  festivalGreetingSubtitle?: string;
  showFestivalBanner: boolean;
  defaultAdvanceDepositPercent?: number;
  socialLinks: {
    instagram: string;
    youtube: string;
    pinterest: string;
    linkedin: string;
  };
}

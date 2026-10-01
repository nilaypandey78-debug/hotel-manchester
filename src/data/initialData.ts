import { Branch, Room, Booking, ChatMessage, PromotionalOffer, HotelContent } from '../types';
import { ASSET_IMAGES } from '../utils/imageAssets';

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'branch-udaipur',
    name: 'Hotel Manchester Royal Palace',
    city: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    tagline: 'Lakeside Mewar Grandeur & Aristocratic Sanctuaries',
    address: 'Ambamata Waterfront, Lake Pichola Sanctuary, Udaipur, Rajasthan 313001',
    phone: '+91 294 288 4100',
    email: 'udaipur.palace@hotelmanchester.com',
    signatureExperiences: [
      'Private Solar Yacht Cruise on Lake Pichola',
      'Royal Mewari Banquet with live Santoor recital',
      'Signature Ayurvedic Rasayana Rejuvenation'
    ],
    image: ASSET_IMAGES.palace,
    rating: 4.96,
    climateNote: 'Mild winters & serene lakeside breezes'
  },
  {
    id: 'branch-goa',
    name: 'Hotel Manchester Seaside Estate',
    city: 'South Goa',
    state: 'Goa',
    country: 'India',
    tagline: 'Private Cliffside Beachfront & Coconut Grove Pavilions',
    address: 'Cabo de Rama Ridge, Betul Bay, South Goa, Goa 403703',
    phone: '+91 832 277 8200',
    email: 'goa.estate@hotelmanchester.com',
    signatureExperiences: [
      'Sunset Champagne on Private Secluded Beach',
      'Artisanal Portuguese-Goan Wine Pairing Degustation',
      'Oceanfront Thermal Infinity Mineral Pool'
    ],
    image: ASSET_IMAGES.hero,
    rating: 4.94,
    climateNote: 'Gentle Arabian Sea whispers & tropical sunsets'
  },
  {
    id: 'branch-shimla',
    name: 'Hotel Manchester Alpine Pavilion',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    country: 'India',
    tagline: 'Cedar Forest Peaks & Colonial Cedarwood Sanctuaries',
    address: 'Wildflower Ridge Road, Mashobra Peak, Shimla, Himachal Pradesh 171007',
    phone: '+91 177 264 9100',
    email: 'shimla.alpine@hotelmanchester.com',
    signatureExperiences: [
      'Himalayan Pine Forest Forest-Bathing & High Tea',
      'Private Fireplace Stargazing with Mulled Spiced Wine',
      'Nordic Hot Stone Hydrotherapy Spa'
    ],
    image: ASSET_IMAGES.villa,
    rating: 4.98,
    climateNote: 'Crisp mountain air with panoramic snowy ridges'
  },
  {
    id: 'branch-kerala',
    name: 'Hotel Manchester Backwater Estate',
    city: 'Kumarakom',
    state: 'Kerala',
    country: 'India',
    tagline: 'Vembanad Water Lily Pavilions & Ayurvedic Sanctuaries',
    address: 'Kavanattinkara Waterfront, Kumarakom, Kottayam, Kerala 686563',
    phone: '+91 481 252 5900',
    email: 'kerala.estate@hotelmanchester.com',
    signatureExperiences: [
      'Private Teakwood Kettuvallam Day Houseboat Cruise',
      'Classical Kathakali & Temple Flute Twilight Performances',
      'Authentic Marma Abhyanga Ayurvedic Rejuvenation'
    ],
    image: ASSET_IMAGES.presidential,
    rating: 4.95,
    climateNote: 'Emerald backwaters & tranquil lotus breezes'
  },
  {
    id: 'branch-mumbai',
    name: 'Hotel Manchester Urban Manor',
    city: 'Colaba, Mumbai',
    state: 'Maharashtra',
    country: 'India',
    tagline: 'Harbourfront Heritage Elegance & Contemporary Luxury',
    address: '14 Apollo Bunder Promenade, Colaba, Mumbai, Maharashtra 400001',
    phone: '+91 22 6665 3300',
    email: 'mumbai.manor@hotelmanchester.com',
    signatureExperiences: [
      'Rooftop Harbor View Caviar & Single Malt Lounge',
      'Curated Architectural Walking Odyssey of Heritage Fort',
      'Chauffeured Rolls-Royce City Tour'
    ],
    image: ASSET_IMAGES.hero,
    rating: 4.92,
    climateNote: 'Seafront cosmopolitan energy and balmy evenings'
  }
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-presidential-udaipur',
    name: 'The Maharajah Presidential Penthouse',
    category: 'Presidential Penthouse',
    branchId: 'branch-udaipur',
    pricePerNight: 85000,
    capacityAdults: 3,
    capacityChildren: 2,
    sizeSqFt: 2400,
    bedType: 'Emperor Royal Bed with Frette 800-thread linen',
    view: 'Panoramic Lake Pichola & City Palace Waterfront',
    rating: 4.99,
    reviewsCount: 142,
    image: ASSET_IMAGES.presidential,
    features: [
      '24-Hour Private Butler Service',
      'Private Heated Infinity Plunge Pool',
      'Hand-carved Jharokha Balcony',
      'Dyson Hair Care & Acqua di Parma Bath Amenities',
      'Bose Acoustimass Sound & Curated Wine Cellar'
    ],
    description: 'The crowning jewel of Hotel Manchester Udaipur. Perched atop the palace with uninterrupted views of Lake Pichola, private dining pavilion, and hand-gilded artisanal ceiling frescoes.',
    available: true
  },
  {
    id: 'room-heritage-villa-udaipur',
    name: 'Royal Courtyard Garden Villa',
    category: 'Garden Villa',
    branchId: 'branch-udaipur',
    pricePerNight: 46000,
    capacityAdults: 2,
    capacityChildren: 1,
    sizeSqFt: 1450,
    bedType: 'Grand King Bed with Cashmere Throw',
    view: 'Private Lotus Pond & Mughal Garden',
    rating: 4.95,
    reviewsCount: 198,
    image: ASSET_IMAGES.villa,
    features: [
      'Freestanding Monolithic Travertine Soaking Tub',
      'Outdoor Rain Shower in Private Courtyard',
      'Complimentary Sunset High Tea Service',
      'Artisanal Herbal Tea & Nespresso Bar'
    ],
    description: 'Secluded amongst fragrant frangipani and whispering fountains, featuring ancient stone arches, sunlit reading alcoves, and bespoke brass furnishings.',
    available: true
  },
  {
    id: 'room-cliff-suite-goa',
    name: 'Cabo Cliff Oceanfront Suite',
    category: 'Royal Suite',
    branchId: 'branch-goa',
    pricePerNight: 52000,
    capacityAdults: 2,
    capacityChildren: 2,
    sizeSqFt: 1600,
    bedType: 'Four-Poster Handcrafted Teak King Bed',
    view: 'Unobstructed Arabian Sea & Sunset Horizon',
    rating: 4.97,
    reviewsCount: 174,
    image: ASSET_IMAGES.hero,
    features: [
      'Expansive Teak Sun Deck with Double Daybed',
      'Direct Private Beach Access Stairway',
      'Open-air Hydrotherapy Jacuzzi',
      'Curated Vinyl Turntable & Library'
    ],
    description: 'Elevated on the crimson cliffs of South Goa. Floor-to-ceiling retractable glass opens onto the soothing sound of rolling Arabian waves.',
    available: true
  },
  {
    id: 'room-pine-pavilion-shimla',
    name: 'Cedar Pine Heritage Pavilion',
    category: 'Courtyard Pavilion',
    branchId: 'branch-shimla',
    pricePerNight: 38000,
    capacityAdults: 2,
    capacityChildren: 1,
    sizeSqFt: 1250,
    bedType: 'Signature Feather-Top King Bed',
    view: 'Snowcapped Himalayan Peaks & Pine Valley',
    rating: 4.94,
    reviewsCount: 112,
    image: ASSET_IMAGES.villa,
    features: [
      'Wood-Burning Fireplace with Cedarwood logs',
      'Handwoven Pure Pashmina Throws',
      'Heated Italian Marble Bathroom Floors',
      'Forest View Glass-Enclosed Sunroom'
    ],
    description: 'Warm English colonial architecture married with Himalayan tranquility. Enjoy quiet evenings by the roaring fireplace with valley mist swirling below.',
    available: true
  },
  {
    id: 'room-lakeview-kerala',
    name: 'Vembanad Water Sanctuary Villa',
    category: 'Lakeview Sanctuary',
    branchId: 'branch-kerala',
    pricePerNight: 42000,
    capacityAdults: 2,
    capacityChildren: 2,
    sizeSqFt: 1550,
    bedType: 'Luxury Emperor Bed with Silk Drape',
    view: 'Vembanad Backwaters & Floating Water Lilies',
    rating: 4.96,
    reviewsCount: 156,
    image: ASSET_IMAGES.presidential,
    features: [
      'Private Plunge Pool Overlooking Waterways',
      'Private Jetty with Traditional Canoe',
      'Ayurvedic Copper Soaking Tub',
      'Open Verandah with Hand-Carved Swings'
    ],
    description: 'Constructed with centuries-old repurposed teakwood in authentic Kerala Nalukettu style, offering peerless stillness and gentle riparian fauna.',
    available: true
  },
  {
    id: 'room-harbour-suite-mumbai',
    name: 'The Viceroy Harbour Executive Suite',
    category: 'Royal Suite',
    branchId: 'branch-mumbai',
    pricePerNight: 58000,
    capacityAdults: 2,
    capacityChildren: 0,
    sizeSqFt: 1350,
    bedType: 'Bespoke Velvet Tufted King Bed',
    view: 'Gateway Promenade & Mumbai Harbor',
    rating: 4.93,
    reviewsCount: 220,
    image: ASSET_IMAGES.palace,
    features: [
      'Dedicated Bentley/Rolls Airport Concierge',
      'Private Cocktail Bar & Sommelier Selection',
      'Acoustic Triple-Glazed Heritage Windows',
      'Bang & Olufsen Integrated Media System'
    ],
    description: 'The height of historic prestige. Soaring ceilings with vintage crystal chandeliers, polished Burma teak floors, and refined city harbor vantage points.',
    available: true
  }
];

export const INITIAL_PROMOTIONS: PromotionalOffer[] = [
  {
    id: 'promo-1',
    title: 'Autumn Serenity Retreat',
    code: 'MANCHESTER20',
    discountPercent: 20,
    description: 'Enjoy 20% off all Suites & Villas, including complimentary daily High Tea & 60-min Ayurvedic Spa therapy.',
    validUntil: '31 Oct 2026',
    active: true
  },
  {
    id: 'promo-2',
    title: 'The Royal Weekend Sojourn',
    code: 'ROYALWEEKEND',
    discountPercent: 15,
    description: 'Complimentary private airport luxury transfer and sundowner cocktail reception on stays of 2 nights or more.',
    validUntil: '15 Nov 2026',
    active: true
  }
];

export const INITIAL_HOTEL_CONTENT: HotelContent = {
  hotelName: 'Hotel Manchester',
  tagline: 'Private Luxury Sanctuaries & Architectural Retreats',
  welcomingHeadline: 'Where timeless serenity meets refined aristocratic hospitality',
  contactNumber: '+91 22 8899 4400',
  conciergeEmail: 'concierge@hotelmanchester.com',
  whatsappNumber: '+919876543210',
  upiVpa: 'hotelmanchester@icici',
  upiPayeeName: 'Hotel Manchester Luxury Resorts Ltd',
  heroSubtitle: 'Immerse in sanctuaries crafted across India’s most breathtaking landscapes, from royal lakeside palaces to secluded cliffside estates.',
  socialLinks: {
    instagram: 'https://instagram.com/hotelmanchester',
    youtube: 'https://youtube.com/@hotelmanchester',
    pinterest: 'https://pinterest.com/hotelmanchester',
    linkedin: 'https://linkedin.com/company/hotel-manchester'
  }
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    bookingCode: 'HM-8492',
    roomId: 'room-presidential-udaipur',
    roomName: 'The Maharajah Presidential Penthouse',
    branchId: 'branch-udaipur',
    branchName: 'Hotel Manchester Royal Palace, Udaipur',
    checkInDate: '2026-10-15',
    checkOutDate: '2026-10-18',
    nights: 3,
    guests: { adults: 2, children: 1 },
    guestDetails: {
      fullName: 'Vikramaditya Singhania',
      email: 'vikram.singhania@heritage.org',
      phone: '+91 98200 45123',
      specialRequests: 'Early check-in at 11:00 AM, feather-free hypoallergenic pillows, welcome floral arrangement.',
      upiUtr: '428819003411',
      arrivalTime: '11:30 AM',
      pillowPreference: 'Organic Silk & Memory Foam'
    },
    totalAmount: 255000,
    paymentStatus: 'verified',
    createdAt: '2026-09-28T10:14:00Z',
    addOns: ['Private Butler Service', 'Lake Pichola Champagne Yacht Cruise', 'Ayurvedic Rasayana Spa']
  },
  {
    id: 'bk-102',
    bookingCode: 'HM-9143',
    roomId: 'room-cliff-suite-goa',
    roomName: 'Cabo Cliff Oceanfront Suite',
    branchId: 'branch-goa',
    branchName: 'Hotel Manchester Seaside Estate, Goa',
    checkInDate: '2026-10-22',
    checkOutDate: '2026-10-25',
    nights: 3,
    guests: { adults: 2, children: 0 },
    guestDetails: {
      fullName: 'Dr. Evelyn Montgomery',
      email: 'evelyn.montgomery@oxfordalumni.uk',
      phone: '+44 7700 900142',
      specialRequests: 'Celebrating wedding anniversary. Request chilled vintage champagne and quiet corner balcony.',
      upiUtr: '429188371902',
      arrivalTime: '02:00 PM',
      pillowPreference: 'Goose Down Deluxe'
    },
    totalAmount: 156000,
    paymentStatus: 'pending_upi',
    createdAt: '2026-09-30T16:45:00Z',
    addOns: ['Private Secluded Beach Dinner', 'Artisanal Wine Degustation']
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    bookingId: 'bk-101',
    guestName: 'Vikramaditya Singhania',
    guestEmail: 'vikram.singhania@heritage.org',
    sender: 'guest',
    text: 'Good day Concierge, could you please confirm if our private solar yacht cruise can be scheduled for sunset around 5:30 PM on October 16th?',
    timestamp: '2026-09-29T11:20:00Z',
    read: true
  },
  {
    id: 'msg-2',
    bookingId: 'bk-101',
    guestName: 'Vikramaditya Singhania',
    guestEmail: 'vikram.singhania@heritage.org',
    sender: 'concierge',
    text: 'Greetings Mr. Singhania, it is our distinct privilege. Your private sunset cruise on Lake Pichola has been reserved for 5:30 PM on October 16th, accompanied by our master sommelier and canapés.',
    timestamp: '2026-09-29T11:42:00Z',
    read: true
  },
  {
    id: 'msg-3',
    bookingId: 'bk-102',
    guestName: 'Dr. Evelyn Montgomery',
    guestEmail: 'evelyn.montgomery@oxfordalumni.uk',
    sender: 'guest',
    text: 'Hello, we have just transferred the booking deposit via UPI and submitted reference number 429188371902. Could you verify our anniversary arrangement?',
    timestamp: '2026-09-30T17:02:00Z',
    read: false
  }
];

import { ASSET_IMAGES } from './imageAssets';

export interface PhotoPreset {
  id: string;
  title: string;
  category: 'hero' | 'branch' | 'room' | 'dining' | 'spa';
  url: string;
  description: string;
}

export const PHOTO_PRESETS: PhotoPreset[] = [
  // Hero & Architectural Presets
  {
    id: 'hero-udaipur-palace',
    title: 'Udaipur Royal Lakeside Palace',
    category: 'hero',
    url: ASSET_IMAGES.hero,
    description: 'Majestic marble palace facade reflected on calm waters at dawn'
  },
  {
    id: 'hero-candlelit-courtyard',
    title: 'Candlelit Royal Haveli Courtyard',
    category: 'hero',
    url: ASSET_IMAGES.palace,
    description: 'Warm evening lighting with carved stone arches and brass lanterns'
  },
  {
    id: 'hero-misty-himalayas',
    title: 'Himalayan Ridge & Cedar Forest',
    category: 'hero',
    url: ASSET_IMAGES.nature,
    description: 'Serene mountain slopes surrounded by towering deodar trees and morning mist'
  },
  {
    id: 'hero-coastal-arabian-sea',
    title: 'Goa Cliff Oceanfront Sanctuary',
    category: 'hero',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1920&q=85',
    description: 'Arabian sea sunset view from private limestone terrace'
  },
  {
    id: 'hero-rajasthan-fort',
    title: 'Jaipur Pink Sandstone Estate',
    category: 'hero',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=85',
    description: 'Intricately hand-carved jharokhas with blooming bougainvillea'
  },

  // Suites & Rooms Presets
  {
    id: 'room-presidential-penthouse',
    title: 'Maharajah Presidential Penthouse',
    category: 'room',
    url: ASSET_IMAGES.room,
    description: 'Four-poster teak king bed, gold frescoes & private lake balcony'
  },
  {
    id: 'room-garden-villa',
    title: 'Courtyard Heritage Garden Villa',
    category: 'room',
    url: ASSET_IMAGES.villa,
    description: 'Secluded Mughal garden courtyard with monolithic travertine bathtub'
  },
  {
    id: 'room-ocean-suite',
    title: 'Cabo Cliff Oceanfront Suite',
    category: 'room',
    url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1600&q=80',
    description: 'Floor-to-ceiling glass doors opening directly to ocean breezes'
  },
  {
    id: 'room-himalayan-chalet',
    title: 'Cedarwood Himalayan Glass Chalet',
    category: 'room',
    url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=80',
    description: 'Hand-hewn pine timbers, stone fireplace and snow-capped peaks view'
  },
  {
    id: 'room-heritage-pavilion',
    title: 'Marwar Lotus Pavilion Suite',
    category: 'room',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
    description: 'Deep royal blue silks with antique brass lanterns and marble baths'
  },

  // Dining & Spa Presets
  {
    id: 'dining-courtyard-banquet',
    title: 'Royal Courtyard Silver Banquet',
    category: 'dining',
    url: ASSET_IMAGES.palace,
    description: 'Artisanal starlit dining with silver thali and acoustic santoor'
  },
  {
    id: 'dining-terrace-sunset',
    title: 'Lake Sunset Wine & Tapas Terrace',
    category: 'dining',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    description: 'Bespoke sommelier wine pairing with unobstructed panoramic views'
  },
  {
    id: 'spa-ayurvedic-pavilion',
    title: 'Ayurvedic Rasayana Open Pavilion',
    category: 'spa',
    url: ASSET_IMAGES.nature,
    description: 'Ancient copper soaking tub, herbal oils & singing bowl sound healing'
  },
  {
    id: 'spa-lotus-hydrotherapy',
    title: 'Thermal Lotus Reflection Pool',
    category: 'spa',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    description: 'Mineral-rich warm waters scented with night-blooming jasmine'
  }
];

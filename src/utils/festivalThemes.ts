import { IndianFestivalTheme } from '../types';

export interface FestivalThemeConfig {
  id: IndianFestivalTheme;
  name: string;
  hindiName: string;
  badge: string;
  emoji: string;
  tagline: string;
  defaultBannerText: string;
  defaultGreetingTitle: string;
  defaultGreetingSubtitle: string;
  bannerGradient: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  textColor: string;
  description: string;
}

export const FESTIVAL_THEMES: Record<IndianFestivalTheme, FestivalThemeConfig> = {
  default: {
    id: 'default',
    name: 'Royal Heritage Luxury (Classic)',
    hindiName: 'राजसी विरासत',
    badge: 'Classic Heritage',
    emoji: '⚜️',
    tagline: 'Timeless serenity, sandstone colonnades & champagne gold hospitality',
    defaultBannerText: 'Welcome to Hotel Manchester Sanctuaries · Reservations Open Across All Royal Estates',
    defaultGreetingTitle: 'Aristocratic Sanctuaries of India',
    defaultGreetingSubtitle: 'Private estates crafted in harmony with raw landscapes, from lakeside Udaipur to pine-scented Manali.',
    bannerGradient: 'from-[#1C1917] via-[#292524] to-[#1C1917]',
    accentColor: '#946E3A',
    accentBg: 'bg-[#946E3A]',
    accentBorder: 'border-[#946E3A]',
    textColor: 'text-[#946E3A]',
    description: 'The signature timeless aesthetic with sandalwood, antique bronze and light ivory textures.'
  },
  diwali: {
    id: 'diwali',
    name: 'Diwali Royale (Festival of Lights)',
    hindiName: 'शुभ दीपावली उत्सव',
    badge: 'Deepavali Mahotsav',
    emoji: '🪔',
    tagline: 'Illuminated courtyards, 10,000 brass diyas, auspicious rangoli & royal banquets',
    defaultBannerText: '🪔 Shubh Deepavali Celebrations · Complimentary Royal Mithai Box & Midnight Diya Lighting at Lake Pichola',
    defaultGreetingTitle: 'Shubh Deepavali at Hotel Manchester',
    defaultGreetingSubtitle: 'Celebrate the triumph of radiance. Hand-poured brass oil lamps, artisanal sweets and starlit royal feasts.',
    bannerGradient: 'from-[#78350F] via-[#92400E] to-[#B45309]',
    accentColor: '#D97706',
    accentBg: 'bg-amber-600',
    accentBorder: 'border-amber-500',
    textColor: 'text-amber-500',
    description: 'Luminous gold and warm vermillion palette celebrating Deepavali with festive diya motifs and royal courtyard lights.'
  },
  holi: {
    id: 'holi',
    name: 'Holi Elegance & Gulal Utsav',
    hindiName: 'रंगोत्सव होली',
    badge: 'Royal Rangotsav',
    emoji: '🎨',
    tagline: 'Organic floral gulal, chilled thandai fountains, saffron water & live sitar',
    defaultBannerText: '🎨 Royal Holi Celebrations · Organic Saffron & Rose Petal Rangotsav in Private Courtyards · Festive Feast Included',
    defaultGreetingTitle: 'Auspicious Holi Celebrations',
    defaultGreetingSubtitle: 'Immerse in joyful spring color with organic rose, marigold & turmeric gulal amidst marble courtyards.',
    bannerGradient: 'from-[#831843] via-[#9D174D] to-[#BE185D]',
    accentColor: '#E11D48',
    accentBg: 'bg-rose-600',
    accentBorder: 'border-rose-400',
    textColor: 'text-rose-400',
    description: 'Vibrant spring palette with royal gulal rose, saffron yellow, and celebratory festive motifs.'
  },
  navratri: {
    id: 'navratri',
    name: 'Navratri & Dussehra Grand Celebration',
    hindiName: 'नवरात्रि एवं विजयदशमी',
    badge: 'Navratri Utsav',
    emoji: '🌺',
    tagline: 'Nine divine nights of classical acoustic raagas, satvik royal feasts & garba under starlight',
    defaultBannerText: '🌺 Auspicious Navratri & Vijayadashami · Curated Royal Satvik Gastronomy & Evening Raaga Performances',
    defaultGreetingTitle: 'Divine Navratri & Dussehra Mahotsav',
    defaultGreetingSubtitle: 'Honor the nine celestial nights with heritage floral rangoli, acoustic raagas, and royal satvik dining.',
    bannerGradient: 'from-[#7F1D1D] via-[#991B1B] to-[#B91C1C]',
    accentColor: '#DC2626',
    accentBg: 'bg-red-700',
    accentBorder: 'border-red-500',
    textColor: 'text-red-400',
    description: 'Rich royal vermillion and ceremonial crimson with traditional marigold garlands and festive spiritual calm.'
  },
  monsoon: {
    id: 'monsoon',
    name: 'Royal Shravan & Monsoon Retreat',
    hindiName: 'श्रावण एवं वर्षा ऋतु',
    badge: 'Varsha Ritu Retreat',
    emoji: '🌧️',
    tagline: 'Mist over Lake Pichola, private veranda rain tea pavilions & Ayurvedic rasayana',
    defaultBannerText: '🌧️ Enchanting Monsoon Retreat · Special Ayurvedic Abhyanga Spa Treatments & Veranda Rain Tea Service',
    defaultGreetingTitle: 'The Romance of the Indian Monsoon',
    defaultGreetingSubtitle: 'Listen to the soothing rhythm of rain on palace pavilions. Fresh earthen fragrances and restorative herbal rasayana.',
    bannerGradient: 'from-[#064E3B] via-[#047857] to-[#0D9488]',
    accentColor: '#059669',
    accentBg: 'bg-emerald-700',
    accentBorder: 'border-emerald-500',
    textColor: 'text-emerald-400',
    description: 'Deep emerald rainforest and misty lake hues celebrating the serene beauty of the monsoon rains.'
  },
  royal_wedding: {
    id: 'royal_wedding',
    name: 'Royal Wedding & Grand Utsav Theme',
    hindiName: 'शाही विवाह एवं महोत्सव',
    badge: 'Shahi Vivah Utsav',
    emoji: '👑',
    tagline: 'Centuries-old palace courtyards for unforgettable wedding vows and celebrations',
    defaultBannerText: '👑 Royal Destination Celebrations · Full Palace Buyouts & Bespoke Aristocratic Banqueting',
    defaultGreetingTitle: 'Timeless Royal Celebrations',
    defaultGreetingSubtitle: 'Walk down red-carpeted heritage stone arches. Majestic vintage motorcades, royal shehnai, and private lake fireworks.',
    bannerGradient: 'from-[#4C0519] via-[#881337] to-[#9F1239]',
    accentColor: '#BE123C',
    accentBg: 'bg-rose-800',
    accentBorder: 'border-rose-600',
    textColor: 'text-rose-400',
    description: 'Opulent crimson velvet, gold brocade and royal wedding festivity for grand aristocratic affairs.'
  }
};

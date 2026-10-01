// Direct ES module imports ensure Vite bundles these assets into dist/
// and resolves correct relative URLs in any GitHub repository or deployment
import heroLuxuryResort from '../assets/images/hero_luxury_resort_1790862163016.jpg';
import roomPresidentialSuite from '../assets/images/room_presidential_suite_1790862175416.jpg';
import roomHeritageVilla from '../assets/images/room_heritage_villa_1790862186800.jpg';
import branchPalaceRetreat from '../assets/images/branch_palace_retreat_1790862196769.jpg';

export const ASSET_IMAGES = {
  hero: heroLuxuryResort,
  presidential: roomPresidentialSuite,
  villa: roomHeritageVilla,
  palace: branchPalaceRetreat,
} as const;

/**
 * Resolves any image URL (legacy /src paths, public paths, or direct imports)
 * to guaranteed bundled asset URLs that work in GitHub repositories, GitHub Pages,
 * production builds, and local development.
 */
export function resolveHotelImage(imagePath?: string): string {
  if (!imagePath) return heroLuxuryResort;

  // External URLs (Unsplash, HTTPS, data URLs)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // Match by known asset filenames
  if (imagePath.includes('branch_palace_retreat')) return branchPalaceRetreat;
  if (imagePath.includes('room_presidential_suite')) return roomPresidentialSuite;
  if (imagePath.includes('room_heritage_villa')) return roomHeritageVilla;
  if (imagePath.includes('hero_luxury_resort')) return heroLuxuryResort;

  // Support public folder paths
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  if (imagePath.startsWith('/public/')) {
    return `${cleanBase}${imagePath.replace('/public/', '')}`;
  }
  if (imagePath.startsWith('/')) {
    return `${cleanBase}${imagePath.slice(1)}`;
  }
  return `${cleanBase}${imagePath}`;
}

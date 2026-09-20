export type QueueStatus = 'low' | 'moderate' | 'heavy';
export type Availability = 'selling' | 'unavailable' | 'restocking';
export type Tab = 'Map' | 'Stations' | 'Report' | 'Saved' | 'Profile';

export type Coordinate = { latitude: number; longitude: number };

export type Station = {
  id: string;
  name: string;
  brand: 'NNPC' | 'Mobil' | 'TotalEnergies' | 'Oando' | 'Ardova';
  latitude: number;
  longitude: number;
  address: string;
  area: string;
  pmsPrice: number;
  agoPrice: number;
  lpgPrice: number;
  queueStatus: QueueStatus;
  availability: Availability;
  posAvailable: boolean;
  verified: boolean;
  lastUpdated: string;
  reportCount: number;
  image: keyof typeof stationImages;
  amenities: string[];
  activePumps: number;
  rating: number;
  trend: number[];
  verificationPhotoUri?: string;
};

export const stationImages = {
  nnpc: require('../mobile-assets/station-nnpc.webp'),
  mobil: require('../mobile-assets/station-mobil.webp'),
  total: require('../mobile-assets/station-total.webp'),
  oando: require('../mobile-assets/station-oando.webp'),
};

export const demoLocation: Coordinate = { latitude: 6.4441, longitude: 3.4329 };

export function formatPrice(value: number): string {
  return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function distanceKm(from: Coordinate, to: Coordinate): number {
  const rad = Math.PI / 180;
  const dLat = (to.latitude - from.latitude) * rad;
  const dLon = (to.longitude - from.longitude) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(from.latitude * rad) * Math.cos(to.latitude * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function relativeTime(iso: string): string {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

export function queueLabel(queue: QueueStatus): string {
  return queue === 'low' ? 'Low queue' : queue === 'moderate' ? 'Moderate queue' : 'Heavy queue';
}

export function queueWait(queue: QueueStatus): string {
  return queue === 'low' ? '< 5 min' : queue === 'moderate' ? '15–20 min' : '35+ min';
}

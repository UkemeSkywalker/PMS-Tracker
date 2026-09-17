import type { Station, QueueStatus } from './models';

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
type Seed = [string, string, Station['brand'], number, number, string, string, number, QueueStatus, Station['image'], number, number, string[], number, number];

// Coordinates are demo positions on real Lagos streets and corridors. Prices and conditions are illustrative.
const seeds: Seed[] = [
  ['nnpc-ikoyi', 'NNPC Mega Station', 'NNPC', 6.4563, 3.4311, 'Alfred Rewane Road, Ikoyi', 'Ikoyi', 1290, 'low', 'nnpc', 14, 38, ['Supermarket', 'ATM', 'Air', 'Restrooms', 'Lubricants', 'Security'], 4.9, 4],
  ['mobil-marwa', 'Mobil Service Station', 'Mobil', 6.4449, 3.4792, 'Lekki–Epe Expressway, Marwa', 'Lekki', 1305, 'moderate', 'mobil', 28, 26, ['Air', 'ATM', 'Car wash'], 4.7, 6],
  ['total-lekki', 'TotalEnergies', 'TotalEnergies', 6.4475, 3.4739, 'Admiralty Way, Lekki Phase 1', 'Lekki', 1330, 'low', 'total', 60, 18, ['Bonjour Mart', 'ATM', 'Restrooms'], 4.8, 5],
  ['oando-vi', 'Oando Gas & Fuel', 'Oando', 6.4386, 3.4458, 'Ozumba Mbadiwe Avenue, Victoria Island', 'Victoria Island', 1375, 'moderate', 'oando', 120, 11, ['Car wash', 'ATM', 'Air'], 4.6, 4],
  ['ardova-vi', 'Ardova PLC', 'Ardova', 6.4295, 3.4310, 'Adeola Odeku Street, Victoria Island', 'Victoria Island', 1350, 'low', 'total', 42, 21, ['ATM', 'Restrooms'], 4.5, 3],
  ['nnpc-island', 'NNPC Marina', 'NNPC', 6.4498, 3.3922, 'Marina Road, Lagos Island', 'Lagos Island', 1310, 'moderate', 'nnpc', 50, 15, ['ATM', 'Air'], 4.5, 5],
  ['mobil-island', 'Mobil Broad Street', 'Mobil', 6.4519, 3.3960, 'Broad Street, Lagos Island', 'Lagos Island', 1360, 'low', 'mobil', 32, 12, ['ATM'], 4.3, 3],
  ['total-surulere', 'TotalEnergies Surulere', 'TotalEnergies', 6.4981, 3.3558, 'Adeniran Ogunsanya Street, Surulere', 'Surulere', 1295, 'moderate', 'total', 65, 19, ['Supermarket', 'ATM', 'Air'], 4.6, 4],
  ['oando-surulere', 'Oando Stadium', 'Oando', 6.4964, 3.3627, 'Western Avenue, Surulere', 'Surulere', 1380, 'heavy', 'oando', 110, 8, ['ATM', 'Restrooms'], 4.1, 3],
  ['nnpc-yaba', 'NNPC Yaba', 'NNPC', 6.5168, 3.3775, 'Herbert Macaulay Way, Yaba', 'Yaba', 1265, 'low', 'nnpc', 18, 34, ['ATM', 'Air', 'Lubricants'], 4.8, 5],
  ['mobil-yaba', 'Mobil Sabo', 'Mobil', 6.5085, 3.3721, 'Commercial Avenue, Yaba', 'Yaba', 1315, 'moderate', 'mobil', 75, 16, ['Air', 'Car wash'], 4.4, 4],
  ['total-ikeja', 'TotalEnergies Ikeja', 'TotalEnergies', 6.6033, 3.3498, 'Allen Avenue, Ikeja', 'Ikeja', 1340, 'low', 'total', 24, 28, ['Supermarket', 'ATM', 'Restrooms'], 4.6, 6],
  ['nnpc-ikeja', 'NNPC Computer Village', 'NNPC', 6.5969, 3.3435, 'Obafemi Awolowo Way, Ikeja', 'Ikeja', 1280, 'moderate', 'nnpc', 38, 31, ['ATM', 'Security'], 4.5, 5],
  ['mobil-ikeja', 'Mobil Opebi', 'Mobil', 6.5881, 3.3572, 'Opebi Road, Ikeja', 'Ikeja', 1320, 'low', 'mobil', 15, 22, ['Air', 'Car wash', 'ATM'], 4.6, 4],
  ['oando-maryland', 'Oando Maryland', 'Oando', 6.5768, 3.3677, 'Ikorodu Road, Maryland', 'Maryland', 1365, 'heavy', 'oando', 85, 10, ['ATM', 'Restrooms'], 4.2, 4],
  ['ardova-maryland', 'Ardova Maryland', 'Ardova', 6.5719, 3.3719, 'Mobolaji Bank Anthony Way, Maryland', 'Maryland', 1310, 'moderate', 'total', 47, 17, ['ATM', 'Air'], 4.3, 3],
  ['total-ikoyi', 'TotalEnergies Ikoyi', 'TotalEnergies', 6.4598, 3.4426, 'Awolowo Road, Ikoyi', 'Ikoyi', 1345, 'low', 'total', 33, 20, ['Bonjour Mart', 'ATM'], 4.7, 4],
  ['mobil-vi', 'Mobil Ahmadu Bello', 'Mobil', 6.4260, 3.4239, 'Ahmadu Bello Way, Victoria Island', 'Victoria Island', 1390, 'moderate', 'mobil', 72, 9, ['ATM', 'Air'], 4.4, 4],
  ['nnpc-lekki', 'NNPC Lekki Phase 1', 'NNPC', 6.4356, 3.4748, 'Freedom Way, Lekki Phase 1', 'Lekki', 1250, 'heavy', 'nnpc', 12, 45, ['ATM', 'Restrooms', 'Security'], 4.7, 6],
  ['ardova-lekki', 'Ardova Chevron', 'Ardova', 6.4382, 3.5481, 'Lekki–Epe Expressway, Chevron', 'Lekki', 1385, 'low', 'oando', 95, 7, ['ATM', 'Air', 'Car wash'], 4.2, 4],
];

export const initialStations: Station[] = seeds.map(([id, name, brand, latitude, longitude, address, area, pmsPrice, queueStatus, image, age, reportCount, amenities, rating, activePumps]) => ({
  id, name, brand, latitude, longitude, address, area, pmsPrice,
  agoPrice: pmsPrice + 460, lpgPrice: 1200, queueStatus, availability: 'selling',
  posAvailable: true, verified: age < 90, lastUpdated: minutesAgo(age), reportCount,
  image, amenities, activePumps, rating,
  trend: [pmsPrice + 5, pmsPrice + 5, pmsPrice + 3, pmsPrice + 3, pmsPrice, pmsPrice, pmsPrice],
}));

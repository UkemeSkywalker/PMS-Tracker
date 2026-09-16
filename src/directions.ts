import { Linking, Platform } from 'react-native';
import type { Coordinate } from './models';

export async function openDirections(destination: Coordinate) {
  const { latitude, longitude } = destination;
  const url = Platform.OS === 'ios'
    ? `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`
    : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
  await Linking.openURL(url);
}

export type DrivingRoute = { coordinates: Coordinate[]; distanceKm: number; minutes: number };

export async function fetchDrivingRoute(from: Coordinate, to: Coordinate, signal?: AbortSignal): Promise<DrivingRoute | null> {
  const base = 'https://router.project-osrm.org/route/v1/driving';
  const url = `${base}/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson`;
  const response = await fetch(url, { signal });
  if (!response.ok) return null;
  const json = await response.json();
  const route = json.routes?.[0];
  if (!route?.geometry?.coordinates?.length) return null;
  return {
    coordinates: route.geometry.coordinates.map(([longitude, latitude]: [number, number]) => ({ latitude, longitude })),
    distanceKm: route.distance / 1000,
    minutes: Math.max(1, Math.round(route.duration / 60)),
  };
}

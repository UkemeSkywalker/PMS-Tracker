import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Availability, Coordinate, QueueStatus, Station, Tab } from './models';
import { demoLocation } from './models';
import { initialStations } from './stations';

type AppState = {
  stations: Station[]; saved: string[]; contributions: number; fuelPoints: number;
  tab: Tab; selectedId: string; detailsOpen: boolean; notificationsEnabled: boolean;
  location: Coordinate; usingDeviceLocation: boolean;
  setTab: (tab: Tab) => void; select: (id: string) => void; setDetailsOpen: (open: boolean) => void;
  setLocation: (location: Coordinate) => void; setUsingDeviceLocation: (enabled: boolean) => void;
  toggleSaved: (id: string) => void; setNotificationsEnabled: (enabled: boolean) => void;
  submit: (id: string, price: number, availability: Availability, queueStatus: QueueStatus) => void;
};
const Context = createContext<AppState | null>(null);
const storageKey = 'moniepoint-pms-state-v1';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [stations, setStations] = useState(initialStations);
  const [saved, setSaved] = useState<string[]>([]);
  const [contributions, setContributions] = useState(0);
  const [fuelPoints, setFuelPoints] = useState(0);
  const [tab, setTab] = useState<Tab>('Map');
  const [selectedId, setSelectedId] = useState('nnpc-ikoyi');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [location, setLocation] = useState<Coordinate>(demoLocation);
  const [usingDeviceLocation, setUsingDeviceLocation] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(storageKey).then(raw => {
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Pick<AppState, 'stations' | 'saved' | 'contributions' | 'fuelPoints' | 'notificationsEnabled'>>;
        if (parsed.stations) setStations(initialStations.map(seed => parsed.stations?.find(item => item.id === seed.id) ?? seed));
        if (parsed.saved) setSaved(parsed.saved);
        if (typeof parsed.contributions === 'number') setContributions(parsed.contributions);
        if (typeof parsed.fuelPoints === 'number') setFuelPoints(parsed.fuelPoints);
        if (typeof parsed.notificationsEnabled === 'boolean') setNotificationsEnabled(parsed.notificationsEnabled);
      }
    }).catch(() => {}).finally(() => setHydrated(true));
  }, []);
  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(storageKey, JSON.stringify({ stations, saved, contributions, fuelPoints, notificationsEnabled })).catch(() => {});
  }, [stations, saved, contributions, fuelPoints, notificationsEnabled, hydrated]);

  const value = useMemo<AppState>(() => ({
    stations, saved, contributions, fuelPoints, tab, selectedId, detailsOpen, notificationsEnabled, location, usingDeviceLocation,
    setTab, select: setSelectedId, setDetailsOpen, setNotificationsEnabled, setLocation, setUsingDeviceLocation,
    toggleSaved: id => setSaved(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]),
    submit: (id, price, availability, queueStatus) => {
      setStations(previous => previous.map(item => item.id === id ? { ...item, pmsPrice: price, availability, queueStatus, lastUpdated: new Date().toISOString(), reportCount: item.reportCount + 1, verified: true, trend: [...item.trend.slice(1), price] } : item));
      setContributions(previous => previous + 1);
      setFuelPoints(previous => previous + 25);
      setSelectedId(id);
    },
  }), [stations, saved, contributions, fuelPoints, tab, selectedId, detailsOpen, notificationsEnabled, location, usingDeviceLocation]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApp() {
  const state = useContext(Context);
  if (!state) throw new Error('AppProvider is missing');
  return state;
}

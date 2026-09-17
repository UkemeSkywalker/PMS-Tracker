import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import type { Coordinate, Station } from '../models';
import { demoLocation, distanceKm, formatPrice, queueLabel, relativeTime, stationImages } from '../models';
import { fetchDrivingRoute, openDirections, type DrivingRoute } from '../directions';
import { useApp } from '../store';
import { colors, radius, shadow } from '../theme';

type Filter = 'All' | 'Cheapest' | 'Verified Today' | 'Nearest' | 'Low Queue';
const filters: Filter[] = ['Cheapest', 'Verified Today', 'Nearest', 'Low Queue'];
const areas: { name: string; coordinate: Coordinate }[] = [
  { name: 'Victoria Island', coordinate: { latitude: 6.4281, longitude: 3.4219 } },
  { name: 'Ikoyi', coordinate: { latitude: 6.4549, longitude: 3.4334 } },
  { name: 'Lekki', coordinate: { latitude: 6.4372, longitude: 3.4728 } },
  { name: 'Lagos Island', coordinate: { latitude: 6.4549, longitude: 3.3944 } },
  { name: 'Surulere', coordinate: { latitude: 6.4989, longitude: 3.3587 } },
  { name: 'Yaba', coordinate: { latitude: 6.5147, longitude: 3.3792 } },
  { name: 'Ikeja', coordinate: { latitude: 6.6018, longitude: 3.3515 } },
  { name: 'Maryland', coordinate: { latitude: 6.5738, longitude: 3.3700 } },
];
const landmarks: { name: string; coordinate: Coordinate }[] = [
  { name: 'Tafawa Balewa Square', coordinate: { latitude: 6.4487, longitude: 3.4024 } },
  { name: 'University of Lagos', coordinate: { latitude: 6.5158, longitude: 3.3975 } },
  { name: 'Lekki Phase 1', coordinate: { latitude: 6.4363, longitude: 3.4750 } },
];

export function MapScreen() {
  const { stations, selectedId, select, setDetailsOpen, location, setLocation, usingDeviceLocation, setUsingDeviceLocation } = useApp();
  const map = useRef<MapView>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [traffic, setTraffic] = useState(false);
  const [route, setRoute] = useState<DrivingRoute | null>(null);
  const [routeState, setRouteState] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [locationChecked, setLocationChecked] = useState(false);
  const [recommendationOpen, setRecommendationOpen] = useState(false);
  const station = stations.find(item => item.id === selectedId) ?? stations[0];
  const average = Math.round(stations.reduce((sum, item) => sum + item.pmsPrice, 0) / stations.length);

  useEffect(() => {
    let live = true;
    Location.requestForegroundPermissionsAsync().then(async permission => {
      if (!live) return;
      if (permission.status === 'granted') {
        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (live) {
          const current = { latitude: position.coords.latitude, longitude: position.coords.longitude };
          setLocation(current); setUsingDeviceLocation(true);
        }
      }
    }).catch(() => {}).finally(() => { if (live) setLocationChecked(true); });
    return () => { live = false; };
  }, [setLocation, setUsingDeviceLocation]);

  useEffect(() => {
    if (!station) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    setRoute(null); setRouteState('loading');
    fetchDrivingRoute(location, station, controller.signal).then(result => { setRoute(result); setRouteState(result ? 'ready' : 'unavailable'); }).catch(() => setRouteState('unavailable')).finally(() => clearTimeout(timer));
    return () => { clearTimeout(timer); controller.abort(); };
  }, [location.latitude, location.longitude, station?.id]);

  const visible = useMemo(() => {
    let result = stations;
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter(item => `${item.name} ${item.brand} ${item.area} ${item.address}`.toLowerCase().includes(term));
    }
    if (filter === 'Cheapest') return [...result].sort((a, b) => a.pmsPrice - b.pmsPrice).slice(0, 6);
    if (filter === 'Verified Today') return result.filter(item => item.verified && Date.now() - new Date(item.lastUpdated).getTime() < 86_400_000);
    if (filter === 'Nearest') return [...result].sort((a, b) => distanceKm(location, a) - distanceKm(location, b)).slice(0, 6);
    if (filter === 'Low Queue') return result.filter(item => item.queueStatus === 'low');
    return result;
  }, [stations, search, filter, location]);

  function focus(coordinate: Coordinate, latitudeDelta = 0.024) {
    map.current?.animateToRegion({ ...coordinate, latitudeDelta, longitudeDelta: latitudeDelta * 1.2 }, 420);
  }
  function choose(item: Station, openPreview = false) {
    select(item.id);
    focus(item, 0.024);
    setSearch('');
    if (openPreview) setRecommendationOpen(true);
  }
  const suggestions = search.trim()
    ? [
        ...stations.filter(item => `${item.name} ${item.brand} ${item.area} ${item.address}`.toLowerCase().includes(search.toLowerCase())).slice(0, 4).map(item => ({ name: item.name, subtitle: item.area, coordinate: item, station: item })),
        ...areas.filter(item => item.name.toLowerCase().includes(search.toLowerCase())).slice(0, 2).map(item => ({ name: item.name, subtitle: 'Lagos area', coordinate: item.coordinate, station: undefined })),
        ...landmarks.filter(item => item.name.toLowerCase().includes(search.toLowerCase())).slice(0, 2).map(item => ({ name: item.name, subtitle: 'Landmark', coordinate: item.coordinate, station: undefined })),
      ]
    : [];

  return <View style={styles.screen}>
    <View style={styles.header}>
      <Image source={require('../../mobile-assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <View style={styles.avatar}><Image source={require('../../mobile-assets/profile.png')} style={styles.avatarImage} /></View>
    </View>
    <View style={styles.searchWrap}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={21} color={colors.blue} />
        <TextInput placeholder="Search stations, areas, landmarks" placeholderTextColor={colors.slate} value={search} onChangeText={setSearch} style={styles.searchInput} returnKeyType="search" accessibilityLabel="Search stations and Lagos areas" />
        {search ? <Pressable onPress={() => setSearch('')} style={styles.clear}><Ionicons name="close" size={19} color={colors.slate} /></Pressable> : null}
      </View>
      {suggestions.length > 0 && <View style={styles.suggestions}>
        {suggestions.map((item, index) => <Pressable key={`${item.name}-${index}`} onPress={() => item.station ? choose(item.station, true) : (focus(item.coordinate, 0.05), setSearch(''))} style={styles.suggestion}>
          <Ionicons name={item.station ? 'business-outline' : 'location-outline'} size={18} color={colors.blue} />
          <View><Text style={styles.suggestionName}>{item.name}</Text><Text style={styles.suggestionSub}>{item.subtitle}</Text></View>
        </Pressable>)}
      </View>}
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters} style={styles.filterStrip}>
      {filters.map(item => <Pressable key={item} onPress={() => setFilter(previous => previous === item ? 'All' : item)} style={[styles.filterChip, filter === item && styles.filterActive]}>
        <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
        {item === 'Cheapest' && <View style={styles.yellowDot} />}
      </Pressable>)}
    </ScrollView>
    <View style={styles.mapArea}>
      <MapView ref={map} style={StyleSheet.absoluteFill} mapType={mapType} showsTraffic={traffic} showsUserLocation={usingDeviceLocation} showsCompass={false} showsMyLocationButton={false} initialRegion={{ ...demoLocation, latitudeDelta: 0.058, longitudeDelta: 0.07 }} accessibilityLabel="Interactive Lagos map with filling stations">
        {!usingDeviceLocation && <Marker coordinate={demoLocation} title="Demo starting point"><View style={styles.userMarker}><View style={styles.userMarkerInner} /></View></Marker>}
        {visible.map(item => <Marker key={`${item.id}-${item.id === selectedId}`} coordinate={item} onPress={() => choose(item, true)} tracksViewChanges={false}>
          <View style={[styles.marker, item.id === selectedId && styles.markerSelected]}><Text numberOfLines={1} style={[styles.markerName, item.id === selectedId && styles.markerSelectedText]}>{item.brand}</Text><Text style={[styles.markerPrice, item.id === selectedId && styles.markerSelectedText]}>₦{formatPrice(item.pmsPrice)}</Text></View>
        </Marker>)}
        {route && <Polyline coordinates={route.coordinates} strokeColor={colors.blue} strokeWidth={5} />}
      </MapView>
      <View style={styles.mapControls}>
        <Pressable accessibilityLabel="Recenter map" onPress={() => focus(location, 0.035)} style={styles.mapControl}><Ionicons name="locate" size={23} color={colors.blue} /></Pressable>
        <Pressable accessibilityLabel="Toggle satellite map" onPress={() => setMapType(current => current === 'standard' ? 'satellite' : 'standard')} style={styles.mapControl}><Ionicons name="layers-outline" size={22} color={colors.navy} /></Pressable>
        <Pressable accessibilityLabel="Toggle traffic" onPress={() => setTraffic(current => !current)} style={styles.mapControl}><Ionicons name="car-outline" size={21} color={traffic ? colors.blue : colors.navy} /></Pressable>
      </View>
      {station && <View style={styles.bottomOverlay}>
        {recommendationOpen ? <View style={styles.recommendation}>
          <View style={styles.sheetBar}><View style={styles.sheetSpacer} /><Pressable onPress={() => setRecommendationOpen(false)} accessibilityLabel="Collapse station recommendation" style={styles.sheetHandleButton}><View style={styles.handle} /></Pressable><Pressable onPress={() => setRecommendationOpen(false)} accessibilityLabel="Close station recommendation" style={styles.sheetClose}><Ionicons name="close" size={21} color={colors.navy} /></Pressable></View>
          <View style={styles.cardHeader}><Text style={styles.eyebrow}>TOP RECOMMENDATION  ★</Text><Text style={styles.demoBadge}>DEMO DATA</Text></View>
          <Image source={stationImages[station.image]} style={styles.cardImage} resizeMode="cover" accessibilityLabel={`${station.name} filling station photo`} />
          <View style={styles.cardTitleRow}><View style={styles.cardTitleCol}><Text numberOfLines={1} style={styles.stationName}>{station.name}</Text><Text numberOfLines={1} style={styles.stationAddress}>{station.address}</Text></View><View style={styles.priceBlock}><Text style={styles.bigPrice}>₦{formatPrice(station.pmsPrice)}</Text><Text style={styles.perLitre}>/L</Text></View></View>
          <View style={styles.statusRow}>
            <Text style={styles.statusText}><Text style={{ color: colors.green }}>●</Text> {station.availability === 'selling' ? 'Selling now' : station.availability === 'restocking' ? 'Restocking' : 'Out of fuel'}</Text>
            <Text style={styles.statusText}>◷ {queueLabel(station.queueStatus)}</Text>
          </View>
          <View style={styles.metaRow}><Text style={styles.metaText}>⌖ {route ? route.distanceKm.toFixed(1) : distanceKm(location, station).toFixed(1)} km {route ? `· ${route.minutes} min drive` : routeState === 'loading' ? '· route loading' : '· route unavailable'}</Text><Text style={styles.metaText}>{relativeTime(station.lastUpdated)} · {station.reportCount} reports</Text></View>
          <View style={styles.metaRow}><Text style={styles.metaText}>✓ Moniepoint POS {station.posAvailable ? 'available' : 'unavailable'}</Text><Text style={styles.metaText}>{station.pmsPrice < average ? `₦${formatPrice(average - station.pmsPrice)} below avg` : 'View details'}</Text></View>
          <View style={styles.actions}><Pressable onPress={() => setDetailsOpen(true)} style={styles.detailsButton}><Text style={styles.detailsLabel}>Details</Text></Pressable><Pressable onPress={() => openDirections(station)} style={styles.directionsButton}><Ionicons name="navigate" size={17} color={colors.white} /><Text style={styles.directionsLabel}>Start Directions</Text></Pressable></View>
        </View> : <Pressable onPress={() => setRecommendationOpen(true)} accessibilityLabel={`Open recommended station ${station.name}, ₦${formatPrice(station.pmsPrice)} per litre`} style={styles.recommendationTrigger}><View style={styles.triggerIcon}><Ionicons name="star" size={19} color={colors.white} /></View><View style={styles.triggerCopy}><Text style={styles.triggerEyebrow}>TOP PICK · TAP TO OPEN</Text><Text numberOfLines={1} style={styles.triggerName}>{station.name}</Text></View><Text style={styles.triggerPrice}>₦{formatPrice(station.pmsPrice)}</Text><Ionicons name="chevron-up" size={17} color={colors.blue} /></Pressable>}
        <View style={styles.averageBanner}><Ionicons name="information-circle-outline" size={18} color={colors.blue} /><Text numberOfLines={1} style={styles.averageText}>Lagos demo average: ₦{formatPrice(average)}/L · {locationChecked && !usingDeviceLocation ? 'Using VI starting point' : 'Explore nearby prices'}</Text></View>
      </View>}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { height: 64, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white },
  logo: { width: 145, height: 40 },
  avatar: { width: 35, height: 35, borderRadius: 18, overflow: 'hidden', backgroundColor: colors.paleBlue }, avatarImage: { width: '100%', height: '100%' },
  searchWrap: { zIndex: 9, paddingHorizontal: 16, paddingTop: 12, backgroundColor: colors.background },
  searchBox: { height: 52, borderRadius: radius.button, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, gap: 10, borderWidth: 1, borderColor: colors.border, ...shadow },
  searchInput: { flex: 1, color: colors.navy, fontSize: 14, height: 52 }, clear: { width: 32, height: 40, alignItems: 'center', justifyContent: 'center' },
  suggestions: { position: 'absolute', top: 67, left: 16, right: 16, backgroundColor: colors.white, borderRadius: 16, padding: 6, ...shadow, zIndex: 10 },
  suggestion: { minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 12 }, suggestionName: { color: colors.navy, fontSize: 14, fontWeight: '700' }, suggestionSub: { color: colors.slate, fontSize: 11 },
  filterStrip: { flexGrow: 0, backgroundColor: colors.background, maxHeight: 60 }, filters: { alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 9 },
  filterChip: { minHeight: 40, borderRadius: 24, paddingHorizontal: 17, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 5 },
  filterActive: { backgroundColor: colors.blue, borderColor: colors.blue }, filterText: { color: colors.navy, fontSize: 12, fontWeight: '700' }, filterTextActive: { color: colors.white }, yellowDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.yellow },
  mapArea: { flex: 1, overflow: 'hidden' }, mapControls: { position: 'absolute', right: 14, top: 20, gap: 9 }, mapControl: { width: 45, height: 45, borderRadius: 14, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadow },
  marker: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.white, borderRadius: 21, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 9, paddingVertical: 7, maxWidth: 160, ...shadow },
  markerSelected: { backgroundColor: colors.blue, borderColor: colors.white, borderWidth: 2, paddingHorizontal: 13, paddingVertical: 9 }, markerName: { fontSize: 10, color: colors.navy, maxWidth: 72, fontWeight: '600' }, markerPrice: { fontSize: 12, color: colors.navy, fontWeight: '800' }, markerSelectedText: { color: colors.white },
  userMarker: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.white, borderColor: colors.blue, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }, userMarkerInner: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.blue },
  bottomOverlay: { position: 'absolute', left: 12, right: 12, bottom: 12, gap: 8 }, recommendation: { backgroundColor: colors.white, borderRadius: 22, padding: 15, paddingTop: 2, ...shadow }, sheetBar: { height: 42, flexDirection: 'row', alignItems: 'center' }, sheetSpacer: { width: 44 }, sheetHandleButton: { flex: 1, height: 42, alignItems: 'center', justifyContent: 'center' }, sheetClose: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, handle: { width: 44, height: 4, borderRadius: 2, backgroundColor: '#D9DDEA' },
  recommendationTrigger: { alignSelf: 'flex-start', maxWidth: '100%', height: 58, paddingHorizontal: 10, borderRadius: 29, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, ...shadow }, triggerIcon: { width: 37, height: 37, borderRadius: 19, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' }, triggerCopy: { width: 142 }, triggerEyebrow: { color: colors.blue, fontSize: 9, fontWeight: '800', letterSpacing: 0.3 }, triggerName: { color: colors.navy, fontSize: 12, fontWeight: '800', marginTop: 2 }, triggerPrice: { color: colors.navy, fontSize: 17, fontWeight: '900' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, eyebrow: { color: colors.blue, fontSize: 10, fontWeight: '800', letterSpacing: 0.6 }, demoBadge: { color: colors.slate, fontSize: 9, fontWeight: '800' },
  cardImage: { width: '100%', height: 94, borderRadius: 14, marginTop: 10 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 7, gap: 8 }, cardTitleCol: { flex: 1 }, stationName: { color: colors.navy, fontSize: 18, fontWeight: '800' }, stationAddress: { color: colors.slate, fontSize: 11, marginTop: 3 },
  priceBlock: { flexDirection: 'row', alignItems: 'baseline' }, bigPrice: { color: colors.navy, fontSize: 29, fontWeight: '900' }, perLitre: { color: colors.slate, fontSize: 12, fontWeight: '600' },
  statusRow: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' }, statusText: { color: colors.navy, fontSize: 11, fontWeight: '700' }, metaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 7 }, metaText: { color: colors.slate, fontSize: 10, flexShrink: 1 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 13 }, detailsButton: { height: 44, width: 95, borderRadius: 22, backgroundColor: colors.paleBlue, alignItems: 'center', justifyContent: 'center' }, detailsLabel: { color: colors.navy, fontSize: 13, fontWeight: '700' }, directionsButton: { height: 44, flex: 1, borderRadius: 22, backgroundColor: colors.blue, flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center' }, directionsLabel: { color: colors.white, fontSize: 13, fontWeight: '800' },
  averageBanner: { height: 36, borderRadius: 14, backgroundColor: '#DFEBFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, gap: 7 }, averageText: { color: colors.navy, fontSize: 11, flex: 1 },
});

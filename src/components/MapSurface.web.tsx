import React, { forwardRef, useImperativeHandle } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Coordinate, Station } from '../models';
import { demoLocation, formatPrice } from '../models';
import { colors, shadow } from '../theme';

export type MapSurfaceHandle = { focus: (coordinate: Coordinate, latitudeDelta?: number) => void };
type Props = { stations: Station[]; selectedId?: string; location?: Coordinate; center?: Coordinate; compact?: boolean; onSelect?: (id: string) => void };
const bounds = { minLat: 6.39, maxLat: 6.64, minLng: 3.31, maxLng: 3.52 };

export const MapSurface = forwardRef<MapSurfaceHandle, Props>(function MapSurface({ stations, selectedId, compact = false, onSelect }, ref) {
  useImperativeHandle(ref, () => ({ focus() { /* The presentation map keeps Lagos framed. */ } }), []);
  const displayStations = compact ? stations : stations.filter((item, index) => item.id === selectedId || index % 2 === 0).slice(0, 11);
  function position(item: Coordinate) {
    return {
      left: `${Math.max(5, Math.min(88, ((item.longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100))}%` as `${number}%`,
      top: `${Math.max(8, Math.min(82, (1 - (item.latitude - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100))}%` as `${number}%`,
    };
  }
  return <ImageBackground source={require('../../Assets/detailed_clean_top_down_vector_navigation_road_map_of_lagos_nigeria_including/screen.png')} style={styles.map} resizeMode="cover" accessibilityLabel="Interactive Lagos presentation map with filling stations">
    <View style={styles.tint} />
    {displayStations.map(item => <Pressable key={item.id} onPress={() => onSelect?.(item.id)} style={[styles.pinWrap, position(item)]} accessibilityLabel={`${item.name}, ₦${formatPrice(item.pmsPrice)} per litre`}>
      <View style={[styles.pin, item.id === selectedId && styles.pinSelected, compact && styles.pinCompact]}><Text numberOfLines={1} style={[styles.brand, item.id === selectedId && styles.selectedText]}>{compact ? '●' : item.brand}</Text>{!compact && <Text style={[styles.price, item.id === selectedId && styles.selectedText]}>₦{formatPrice(item.pmsPrice)}</Text>}</View>
    </Pressable>)}
    {!compact && <View style={[styles.user, position(demoLocation)]}><View style={styles.userDot} /></View>}
    {!compact && <View style={styles.demoPill}><Text style={styles.demoText}>INTERACTIVE DEMO MAP</Text></View>}
  </ImageBackground>;
});

const styles = StyleSheet.create({
  map: { position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#DDF2F8' }, tint: { position: 'absolute', inset: 0, backgroundColor: 'rgba(224,246,252,0.22)' },
  pinWrap: { position: 'absolute', transform: [{ translateX: -24 }, { translateY: -18 }] },
  pin: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.white, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 6, borderWidth: 1, borderColor: colors.border, ...shadow },
  pinSelected: { backgroundColor: colors.blue, borderColor: colors.white, borderWidth: 2 }, pinCompact: { paddingHorizontal: 9, paddingVertical: 6 },
  brand: { maxWidth: 58, color: colors.navy, fontSize: 9, fontWeight: '700' }, price: { color: colors.navy, fontSize: 10, fontWeight: '900' }, selectedText: { color: colors.white },
  user: { position: 'absolute', width: 22, height: 22, borderRadius: 11, backgroundColor: colors.white, borderWidth: 2, borderColor: colors.blue, alignItems: 'center', justifyContent: 'center', transform: [{ translateX: -11 }, { translateY: -11 }] }, userDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.blue },
  demoPill: { position: 'absolute', left: 10, top: 10, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10 }, demoText: { color: colors.blue, fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
});

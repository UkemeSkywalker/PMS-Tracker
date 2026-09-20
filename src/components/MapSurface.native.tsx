import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import type { Coordinate, Station } from '../models';
import { demoLocation, formatPrice } from '../models';
import { colors, shadow } from '../theme';
import { AndroidMap, type AndroidMapHandle } from './AndroidMap';

export type MapSurfaceHandle = { focus: (coordinate: Coordinate, latitudeDelta?: number) => void };
type Props = {
  stations: Station[];
  selectedId?: string;
  location?: Coordinate;
  route?: Coordinate[];
  mapType?: 'standard' | 'satellite';
  traffic?: boolean;
  usingDeviceLocation?: boolean;
  center?: Coordinate;
  compact?: boolean;
  onSelect?: (id: string) => void;
};

export const MapSurface = forwardRef<MapSurfaceHandle, Props>(function MapSurface({ stations, selectedId, location = demoLocation, route, mapType = 'standard', traffic = false, usingDeviceLocation = false, center, compact = false, onSelect }, ref) {
  const map = useRef<MapView>(null);
  const androidMap = useRef<AndroidMapHandle>(null);
  useImperativeHandle(ref, () => ({
    focus(coordinate, latitudeDelta = 0.024) {
      if (Platform.OS === 'android') androidMap.current?.focus(coordinate, Math.max(10, Math.min(16, Math.log2(360 / latitudeDelta) - 1.5)));
      else map.current?.animateToRegion({ ...coordinate, latitudeDelta, longitudeDelta: latitudeDelta * 1.2 }, 420);
    },
  }), []);

  if (Platform.OS === 'android') return <AndroidMap ref={androidMap} stations={stations} selectedId={selectedId} location={location} route={route} styleName={mapType === 'standard' ? 'liberty' : 'positron'} center={center} compact={compact} onSelect={onSelect} />;
  return <MapView ref={map} style={StyleSheet.absoluteFill} mapType={mapType} showsTraffic={traffic} showsUserLocation={usingDeviceLocation} showsCompass={false} showsMyLocationButton={false} initialRegion={{ ...(center ?? demoLocation), latitudeDelta: compact ? 0.015 : 0.058, longitudeDelta: compact ? 0.015 : 0.07 }} scrollEnabled={!compact} zoomEnabled={!compact} rotateEnabled={!compact} pitchEnabled={!compact} accessibilityLabel="Interactive Lagos map with filling stations">
    {!usingDeviceLocation && !compact && <Marker coordinate={demoLocation} title="Demo starting point"><View style={styles.userMarker}><View style={styles.userMarkerInner} /></View></Marker>}
    {stations.map(item => <Marker key={`${item.id}-${item.id === selectedId}`} coordinate={item} onPress={() => onSelect?.(item.id)} tracksViewChanges={false}>
      <View style={[styles.marker, item.id === selectedId && styles.markerSelected]}><Text numberOfLines={1} style={[styles.markerName, item.id === selectedId && styles.markerSelectedText]}>{item.brand}</Text><Text style={[styles.markerPrice, item.id === selectedId && styles.markerSelectedText]}>₦{formatPrice(item.pmsPrice)}</Text></View>
    </Marker>)}
    {route && <Polyline coordinates={route} strokeColor={colors.blue} strokeWidth={5} />}
  </MapView>;
});

const styles = StyleSheet.create({
  marker: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.white, borderRadius: 21, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 9, paddingVertical: 7, maxWidth: 160, ...shadow },
  markerSelected: { backgroundColor: colors.blue, borderColor: colors.white, borderWidth: 2, paddingHorizontal: 13, paddingVertical: 9 },
  markerName: { fontSize: 10, color: colors.navy, maxWidth: 72, fontWeight: '600' }, markerPrice: { fontSize: 12, color: colors.navy, fontWeight: '800' }, markerSelectedText: { color: colors.white },
  userMarker: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.white, borderColor: colors.blue, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }, userMarkerInner: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.blue },
});

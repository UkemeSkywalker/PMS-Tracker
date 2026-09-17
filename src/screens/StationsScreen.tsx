import React, { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Station } from '../models';
import { distanceKm, queueLabel, relativeTime, stationImages } from '../models';
import { openDirections } from '../directions';
import { useApp } from '../store';
import { colors, shadow } from '../theme';

type Sort = 'Cheapest First' | 'Nearest' | 'Recently Updated';
const sorts: Sort[] = ['Cheapest First', 'Nearest', 'Recently Updated'];
const zones = ['All Lagos', 'Victoria Island', 'Ikoyi', 'Lekki', 'Lagos Island', 'Surulere', 'Yaba', 'Ikeja', 'Maryland'];

export function StationsScreen() {
  const { stations, location, saved, toggleSaved, select, setDetailsOpen, setTab } = useApp();
  const [sort, setSort] = useState<Sort>('Cheapest First');
  const [zone, setZone] = useState('All Lagos');
  const average = Math.round(stations.reduce((sum, item) => sum + item.pmsPrice, 0) / stations.length);
  const below = stations.filter(item => item.pmsPrice < average).length;
  const visible = useMemo(() => {
    const list = stations.filter(item => zone === 'All Lagos' || item.area === zone);
    if (sort === 'Cheapest First') return list.sort((a, b) => a.pmsPrice - b.pmsPrice);
    if (sort === 'Nearest') return list.sort((a, b) => distanceKm(location, a) - distanceKm(location, b));
    return list.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }, [stations, location, zone, sort]);

  function showDetails(station: Station) { select(station.id); setDetailsOpen(true); }
  function report(station: Station) { select(station.id); setTab('Report'); }
  function share(station: Station) { Share.share({ message: `${station.name}, ${station.address}: PMS ₦${station.pmsPrice}/L. Demo price from Moniepoint PMS Tracker.` }); }

  return <View style={styles.screen}>
    <View style={styles.header}><Image source={require('../../mobile-assets/logo.png')} style={styles.logo} resizeMode="contain" /><View style={styles.headerTitles}><Text style={styles.title}>Stations</Text><Text style={styles.subtitle}>Lagos price comparison</Text></View><Image source={require('../../mobile-assets/profile.png')} style={styles.avatar} /></View>
    <FlatList data={visible} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}
      ListHeaderComponent={<>
        <View style={styles.zoneHead}><View><Text style={styles.zoneTitle}>{zone}</Text><Text style={styles.zoneSub}>{visible.length} stations reporting demo updates</Text></View><View style={styles.live}><View style={styles.liveDot} /><Text style={styles.liveText}>Demo</Text></View></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.zoneRow}>{zones.map(item => <Pressable key={item} onPress={() => setZone(item)} style={[styles.zoneChip, zone === item && styles.zoneChipActive]}><Text style={[styles.zoneChipText, zone === item && styles.zoneChipTextActive]}>{item}</Text></Pressable>)}</ScrollView>
        <View style={styles.averageCard}><View style={styles.averageIcon}><Ionicons name="stats-chart" size={21} color={colors.blue} /></View><View style={{ flex: 1 }}><Text style={styles.averageCaption}>TODAY’S LAGOS DEMO AVERAGE</Text><Text style={styles.averagePrice}>₦{average}<Text style={styles.averageUnit}> /L</Text></Text></View><View style={styles.below}><Ionicons name="trending-down" size={17} color="#9B7B00" /><Text style={styles.belowText}>{below} below avg</Text></View></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>{sorts.map(item => <Pressable key={item} onPress={() => setSort(item)} style={[styles.sortChip, sort === item && styles.sortActive]}><Text style={[styles.sortText, sort === item && styles.sortTextActive]}>{item}</Text></Pressable>)}</ScrollView>
      </>}
      renderItem={({ item }) => <StationCard station={item} average={average} distance={distanceKm(location, item)} saved={saved.includes(item.id)} onOpen={() => showDetails(item)} onSave={() => toggleSaved(item.id)} onShare={() => share(item)} onReport={() => report(item)} />}
      ListFooterComponent={<Text style={styles.footnote}>Demo prices and conditions. Confirm at the pump before paying.</Text>} />
  </View>;
}

function StationCard({ station, average, distance, saved, onOpen, onSave, onShare, onReport }: { station: Station; average: number; distance: number; saved: boolean; onOpen: () => void; onSave: () => void; onShare: () => void; onReport: () => void }) {
  const delta = station.pmsPrice - average;
  return <View style={styles.card}>
    <Pressable onPress={onOpen} accessibilityLabel={`Details for ${station.name}`}>
      <View style={styles.imageBox}><Image source={stationImages[station.image]} style={styles.stationImage} /><View style={styles.imageBadge}><Text style={styles.imageBadgeText}>{station.area}</Text></View><View style={styles.distanceBadge}><Ionicons name="navigate" size={12} color={colors.blue} /><Text style={styles.distanceText}>{distance.toFixed(1)} km</Text></View></View>
      <View style={styles.cardContent}><View style={styles.cardTop}><View style={styles.cardNameCol}><Text numberOfLines={1} style={styles.stationName}>{station.name} {station.verified && <Text style={{ color: colors.blue }}>✓</Text>}</Text><Text numberOfLines={1} style={styles.address}>{station.address}</Text></View><View style={styles.priceCol}><Text style={styles.price}>₦{station.pmsPrice}<Text style={styles.litre}>/L</Text></Text><Text style={[styles.delta, delta > 0 && styles.deltaHigh]}>{delta === 0 ? 'At average' : `₦${Math.abs(delta)} ${delta < 0 ? 'below' : 'above'} avg`}</Text></View></View>
        <View style={styles.badges}><Badge text={station.availability === 'selling' ? 'Selling now' : station.availability === 'restocking' ? 'Restocking' : 'Out of fuel'} icon="water-outline" color={station.availability === 'selling' ? colors.green : colors.red} /><Badge text={queueLabel(station.queueStatus)} icon="time-outline" color={station.queueStatus === 'heavy' ? colors.red : colors.blue} /><Badge text={`Verified ${relativeTime(station.lastUpdated)}`} icon="checkmark-circle-outline" color={colors.blue} />{station.posAvailable && <Badge text="POS active" icon="card-outline" color={colors.blue} />}</View>
      </View>
    </Pressable>
    <View style={styles.actions}><Pressable onPress={onSave} accessibilityLabel={saved ? 'Remove saved station' : 'Save station'} style={styles.iconButton}><Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={colors.blue} /></Pressable><Pressable onPress={onShare} accessibilityLabel="Share station" style={styles.iconButton}><Ionicons name="share-social-outline" size={20} color={colors.navy} /></Pressable><View style={{ flex: 1 }} /><Pressable onPress={onReport} style={styles.confirmButton}><Text style={styles.confirmText}>Confirm price</Text></Pressable><Pressable onPress={() => openDirections(station)} accessibilityLabel={`Navigate to ${station.name}`} style={styles.navigateButton}><Ionicons name="navigate" size={19} color={colors.white} /></Pressable></View>
  </View>;
}

function Badge({ text, icon, color }: { text: string; icon: keyof typeof Ionicons.glyphMap; color: string }) {
  return <View style={styles.badge}><Ionicons name={icon} size={12} color={color} /><Text style={styles.badgeText}>{text}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, header: { height: 64, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, backgroundColor: colors.white }, logo: { width: 105, height: 32 }, headerTitles: { flex: 1 }, title: { fontSize: 20, fontWeight: '800', color: colors.navy }, subtitle: { fontSize: 11, color: colors.slate }, avatar: { width: 35, height: 35, borderRadius: 18 },
  list: { paddingBottom: 24 }, zoneHead: { paddingHorizontal: 16, paddingTop: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, zoneTitle: { color: colors.navy, fontSize: 20, fontWeight: '800' }, zoneSub: { color: colors.slate, fontSize: 11, marginTop: 3 }, live: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.paleBlue, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 7 }, liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.blue }, liveText: { fontSize: 11, fontWeight: '700', color: colors.blue },
  zoneRow: { gap: 7, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 }, zoneChip: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, paddingHorizontal: 11, paddingVertical: 7 }, zoneChipActive: { backgroundColor: colors.blue, borderColor: colors.blue }, zoneChipText: { color: colors.slate, fontSize: 11, fontWeight: '700' }, zoneChipTextActive: { color: colors.white },
  averageCard: { margin: 16, marginBottom: 4, padding: 16, minHeight: 78, borderRadius: 18, backgroundColor: '#E1ECFF', flexDirection: 'row', alignItems: 'center', gap: 12 }, averageIcon: { width: 42, height: 42, backgroundColor: colors.white, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, averageCaption: { color: colors.slate, fontSize: 10, fontWeight: '800' }, averagePrice: { color: colors.navy, fontSize: 26, fontWeight: '900', marginTop: 2 }, averageUnit: { fontSize: 12, color: colors.slate }, below: { alignItems: 'flex-end' }, belowText: { color: '#786500', fontSize: 10, fontWeight: '700' },
  sortRow: { paddingHorizontal: 16, gap: 7, paddingVertical: 12 }, sortChip: { paddingHorizontal: 14, minHeight: 39, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, justifyContent: 'center' }, sortActive: { backgroundColor: colors.blue, borderColor: colors.blue }, sortText: { color: colors.navy, fontSize: 11, fontWeight: '700' }, sortTextActive: { color: colors.white },
  card: { marginHorizontal: 16, marginBottom: 14, backgroundColor: colors.white, borderRadius: 20, overflow: 'hidden', ...shadow }, imageBox: { height: 132, backgroundColor: colors.paleBlue }, stationImage: { width: '100%', height: '100%' }, imageBadge: { position: 'absolute', left: 10, top: 10, backgroundColor: colors.white, borderRadius: 15, paddingHorizontal: 10, paddingVertical: 5 }, imageBadgeText: { color: colors.navy, fontSize: 10, fontWeight: '700' }, distanceBadge: { position: 'absolute', right: 10, top: 10, backgroundColor: colors.white, borderRadius: 15, paddingHorizontal: 9, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 3 }, distanceText: { color: colors.navy, fontSize: 10, fontWeight: '700' },
  cardContent: { paddingHorizontal: 15, paddingTop: 13 }, cardTop: { flexDirection: 'row', gap: 6, alignItems: 'flex-start' }, cardNameCol: { flex: 1 }, stationName: { color: colors.navy, fontSize: 16, fontWeight: '800' }, address: { color: colors.slate, fontSize: 11, marginTop: 3 }, priceCol: { alignItems: 'flex-end' }, price: { color: colors.navy, fontSize: 24, fontWeight: '900' }, litre: { color: colors.slate, fontSize: 11 }, delta: { color: colors.blue, backgroundColor: colors.paleBlue, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, overflow: 'hidden', fontSize: 9, fontWeight: '700' }, deltaHigh: { color: colors.red, backgroundColor: '#FFE7E9' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 14 }, badge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#EFF4FF', borderRadius: 11, paddingHorizontal: 7, paddingVertical: 5 }, badgeText: { color: colors.navy, fontSize: 10, fontWeight: '600' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 7, padding: 14, paddingTop: 13 }, iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.paleBlue, alignItems: 'center', justifyContent: 'center' }, confirmButton: { height: 40, borderRadius: 20, backgroundColor: colors.paleBlue, paddingHorizontal: 13, justifyContent: 'center' }, confirmText: { color: colors.navy, fontSize: 11, fontWeight: '700' }, navigateButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' }, footnote: { color: colors.slate, textAlign: 'center', fontSize: 11, padding: 20 },
});

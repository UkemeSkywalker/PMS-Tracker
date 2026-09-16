import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { Tab } from './models';
import { useApp } from './store';
import { colors } from './theme';
import { MapScreen } from './screens/MapScreen';

const tabs: { name: Tab; icon: keyof typeof Ionicons.glyphMap }[] = [
  { name: 'Map', icon: 'map-outline' }, { name: 'Stations', icon: 'business-outline' },
  { name: 'Report', icon: 'add' }, { name: 'Saved', icon: 'bookmark-outline' },
  { name: 'Profile', icon: 'person-outline' },
];

function Placeholder({ title, icon }: { title: string; icon: keyof typeof Ionicons.glyphMap }) {
  return <View style={styles.placeholder}><Ionicons name={icon} size={52} color={colors.blue} /><Text style={styles.placeholderTitle}>{title}</Text></View>;
}

export function RootNavigator() {
  const { tab, setTab } = useApp();
  const insets = useSafeAreaInsets();
  const title = tab === 'Map' ? 'Explore Lagos' : tab === 'Report' ? 'Report a price' : tab;
  return <View style={[styles.root, { paddingTop: insets.top }]}>
    {tab === 'Map' ? <MapScreen /> : <Placeholder title={title} icon={tabs.find(item => item.name === tab)?.icon ?? 'map-outline'} />}
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {tabs.map(item => {
        const active = tab === item.name;
        const isReport = item.name === 'Report';
        return <Pressable key={item.name} onPress={() => setTab(item.name)} accessibilityRole="tab" accessibilityState={{ selected: active }} style={styles.tab}>
          <View style={[styles.iconWrap, isReport && styles.reportIcon]}><Ionicons name={item.icon} size={isReport ? 28 : 23} color={isReport ? colors.white : active ? colors.blue : colors.slate} /></View>
          <Text style={[styles.tabLabel, active && styles.activeLabel]}>{item.name}</Text>
        </Pressable>;
      })}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  placeholderTitle: { fontSize: 27, fontWeight: '700', color: colors.navy },
  bar: { flexDirection: 'row', backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 5, paddingHorizontal: 5 },
  tab: { flex: 1, alignItems: 'center', minHeight: 65, justifyContent: 'center' },
  iconWrap: { width: 48, height: 45, alignItems: 'center', justifyContent: 'center' },
  reportIcon: { width: 55, height: 55, borderRadius: 28, backgroundColor: colors.blue, marginTop: -15, shadowColor: colors.blue, shadowOpacity: 0.28, shadowRadius: 9, elevation: 5 },
  tabLabel: { fontSize: 10, fontWeight: '600', color: colors.slate },
  activeLabel: { color: colors.blue, fontWeight: '800' },
});

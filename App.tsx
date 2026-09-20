import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/store';
import { RootNavigator } from './src/navigation';

export default function App() {
  return <View style={styles.page}><View style={styles.device}><SafeAreaProvider><AppProvider><StatusBar style="dark" /><RootNavigator /></AppProvider></SafeAreaProvider></View></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#E8EDF7' : '#F7F8FC', alignItems: 'center' },
  device: { flex: 1, width: '100%', maxWidth: Platform.OS === 'web' ? 430 : undefined, backgroundColor: '#F7F8FC', ...(Platform.OS === 'web' ? { boxShadow: '0 0 45px rgba(2,16,45,0.16)' } : {}) },
});

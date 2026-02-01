import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, useWindowDimensions, StyleSheet, Text, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainData from '@/app/gameData';
import { LanguageProvider } from '@/app/context/LanguageContext';
import { MusicProvider } from '@/app/context/MusicContext';
import { Slot } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { width, height } = useWindowDimensions();
  const [dataReady, setDataReady] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [loaded] = useFonts({
    Balthazar: require('../assets/fonts/PlayfairDisplay-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (!loaded) return;
    MainData.loadFromRemote()
      .then(() => setDataReady(true))
      .catch((e) => setDataError(e instanceof Error ? e.message : String(e)));
  }, [loaded]);

  useEffect(() => {
    if (loaded && (dataReady || dataError)) SplashScreen.hideAsync();
  }, [loaded, dataReady, dataError]);

  if (!loaded) return null;
  if (dataError) {
    return (
      <View style={[styles.root, styles.centered, { width, height }]}>
        <Text style={styles.errorText}>Failed to load data: {dataError}</Text>
      </View>
    );
  }
  if (!dataReady) {
    return (
      <View style={[styles.root, styles.centered, { width, height }]}>
        <ActivityIndicator size="large" color="#2e5560" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <LanguageProvider>
        <MusicProvider>
          <View style={[styles.root, { width, height, minWidth: width, minHeight: height }]}>
            <Slot />
          </View>
        </MusicProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: '#c00',
    textAlign: 'center',
    padding: 24,
  },
});

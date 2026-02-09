import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import storage from '@/src/utils/storage';
import { STORAGE_KEYS } from '@/src/config/storageKeys';

/** Default music volume 0–1; lower so it doesn't overpower the game. */
const MUSIC_VOLUME = 0.2;

/** Playlist: add music_2.mp3 etc. when available. */
const MUSIC_PLAYLIST = [
  require('../../assets/sounds/music_0.mp3'),
  require('../../assets/sounds/music_1.mp3'),
  // require('../../assets/sounds/music_2.mp3'),
] as const;

type MusicContextValue = {
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => Promise<void>;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [musicEnabled, setMusicEnabledState] = useState(true);
  const [ready, setReady] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentIndexRef = useRef(0);
  const enabledRef = useRef(true);

  useEffect(() => {
    storage.getItem(STORAGE_KEYS.musicEnabled).then((raw) => {
      if (raw === 'false') setMusicEnabledState(false);
      else if (raw === 'true') setMusicEnabledState(true);
      setReady(true);
    });
  }, []);

  const setMusicEnabled = useCallback(async (enabled: boolean) => {
    setMusicEnabledState(enabled);
    enabledRef.current = enabled;
    await storage.setItem(STORAGE_KEYS.musicEnabled, enabled ? 'true' : 'false');
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (Platform.OS === 'web') return;

    enabledRef.current = musicEnabled;

    const onPlaybackStatusUpdate = (status: { didJustFinish?: boolean; isLoaded?: boolean }) => {
      if (!status.isLoaded || !status.didJustFinish) return;
      if (!enabledRef.current) return;
      currentIndexRef.current = (currentIndexRef.current + 1) % MUSIC_PLAYLIST.length;
      playNext();
    };

    async function playNext() {
      if (!enabledRef.current || MUSIC_PLAYLIST.length === 0) return;
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        const index = currentIndexRef.current % MUSIC_PLAYLIST.length;
        const source = MUSIC_PLAYLIST[index];
        const { sound } = await Audio.Sound.createAsync(
          source,
          { shouldPlay: true, volume: MUSIC_VOLUME },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
      } catch (e) {
        if (__DEV__) console.warn('[Music] playNext failed', e);
      }
    }

    if (musicEnabled) {
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      }).then(() => playNext());
    } else {
      soundRef.current?.unloadAsync().then(() => {
        soundRef.current = null;
      });
    }

    return () => {
      enabledRef.current = false;
      soundRef.current?.unloadAsync().then(() => {
        soundRef.current = null;
      });
    };
  }, [ready, musicEnabled]);

  const value: MusicContextValue = { musicEnabled, setMusicEnabled };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}

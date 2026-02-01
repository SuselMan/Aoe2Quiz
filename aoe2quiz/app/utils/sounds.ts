import { Audio } from 'expo-av';
import { Platform } from 'react-native';

const VICTORY_SOURCE = require('../../assets/sounds/victory.mp3');
const GAME_STARTED_SOURCE = require('../../assets/sounds/game-started.mp3');
const BUTTON_SOURCE = require('../../assets/sounds/button.mp3');

/** Play victory sound (level complete or multiplayer win). No-op on web if unsupported. */
export async function playVictorySound(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const { sound } = await Audio.Sound.createAsync(
      VICTORY_SOURCE,
      { shouldPlay: true },
      (status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      }
    );
  } catch {
    // ignore
  }
}

/** Play button tap sound. No-op on web if unsupported. Volume 0 = muted for now. */
export async function playButtonSound(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const { sound } = await Audio.Sound.createAsync(
      BUTTON_SOURCE,
      { shouldPlay: true, volume: 0 },
      (status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      }
    );
  } catch {
    // ignore
  }
}

/** Play game started sound (single or multiplayer). No-op on web if unsupported. */
export async function playGameStartedSound(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const { sound } = await Audio.Sound.createAsync(
      GAME_STARTED_SOURCE,
      { shouldPlay: true },
      (status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      }
    );
  } catch {
    // ignore
  }
}

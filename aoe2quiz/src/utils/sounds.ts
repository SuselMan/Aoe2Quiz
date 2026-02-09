import { Audio } from 'expo-av';
import { Platform } from 'react-native';

const VICTORY_SOURCE = require('../../assets/sounds/victory.mp3');
const GAME_STARTED_SOURCE = require('../../assets/sounds/game-started.mp3');
const BUTTON_SOURCE = require('../../assets/sounds/button.mp3');

/** Preloaded button sound — reuse to avoid delay on each tap. */
let buttonSound: Audio.Sound | null = null;

/** Call at app start (e.g. after data loaded) so first tap has no delay. */
export async function preloadButtonSound(): Promise<void> {
  if (Platform.OS === 'web') return;
  if (buttonSound != null) return;
  try {
    const { sound } = await Audio.Sound.createAsync(BUTTON_SOURCE, { shouldPlay: false, volume: 1 });
    buttonSound = sound;
  } catch {
    // ignore
  }
}

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

/** Play button tap sound. Uses preloaded sound when available for instant playback. */
export async function playButtonSound(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    if (buttonSound != null) {
      await buttonSound.setPositionAsync(0);
      await buttonSound.playAsync();
      return;
    }
    const { sound } = await Audio.Sound.createAsync(
      BUTTON_SOURCE,
      { shouldPlay: true, volume: 1 },
      (status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      }
    );
    buttonSound = sound;
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

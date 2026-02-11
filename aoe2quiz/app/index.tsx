import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, Modal, TouchableOpacity, useWindowDimensions, Platform, Alert } from 'react-native';
import Strings from '@/app/strings';
import { useLanguage } from '@/src/context/LanguageContext';
import { getDifficultyLevelById } from '@/src/config/difficulty';
import { STORAGE_KEYS } from '@/src/config/storageKeys';
import storage from '@/src/utils/storage';
import { clearCivParsedCache } from '@/src/utils/parseCivHelpTexts';
import { getOrCreateDeviceId } from '@/src/utils/deviceId';
import { playVictorySound, playGameStartedSound } from '@/src/utils/sounds';
import {
  getSocket,
  joinQueue,
  leaveQueue,
  onMatchFound,
  onMatchmakingTimeout,
  subscribeToConnection,
  type MatchFoundPayload,
  type GameOverPayload,
} from '@/src/services/socket';
import MainMenuScreen from '@/src/screens/MainMenuScreen';
import SettingsScreen from '@/src/screens/SettingsScreen';
import LevelSelectScreen from '@/src/screens/LevelSelectScreen';
import ResultScreen from '@/src/screens/ResultScreen';
import CampaignQuiz from '@/src/components/CampaignQuiz';
import MultiplayerEntryScreen from '@/src/screens/MultiplayerEntryScreen';
import SearchingScreen from '@/src/screens/SearchingScreen';
import MultiplayerQuiz from '@/src/components/MultiplayerQuiz';
import MultiplayerResultScreen from '@/src/screens/MultiplayerResultScreen';
import TrainingSelectScreen from '@/src/screens/TrainingSelectScreen';
import TrainingQuiz from '@/src/components/TrainingQuiz';
import LeaderboardScreen from '@/src/screens/LeaderboardScreen';
import ProfileEditScreen from '@/src/screens/ProfileEditScreen';
import SupportScreen from '@/src/screens/SupportScreen';
import SoundPressable from '@/src/components/ui/SoundPressable';
import type { QuestionTypeVariantValue } from '@/src/config/questionTypes';

type Screen =
  | 'menu'
  | 'settings'
  | 'support'
  | 'level_select'
  | 'quiz'
  | 'result'
  | 'multiplayer_entry'
  | 'multiplayer_searching'
  | 'multiplayer_game'
  | 'multiplayer_result'
  | 'training_select'
  | 'training_quiz'
  | 'leaderboard'
  | 'profile_edit';

export default function Index() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { locale, t } = useLanguage();
  const [screen, setScreen] = useState<Screen>('menu');
  const [socketConnected, setSocketConnected] = useState(false);
  const [quizLevelId, setQuizLevelId] = useState<string | null>(null);
  const [resultStars, setResultStars] = useState(0);
  const [searchTimedOut, setSearchTimedOut] = useState(false);
  const [matchPayload, setMatchPayload] = useState<MatchFoundPayload | null>(null);
  const [gameOverPayload, setGameOverPayload] = useState<GameOverPayload | null>(null);
  const [stringsVersion, setStringsVersion] = useState(0);
  const [trainingVariant, setTrainingVariant] = useState<QuestionTypeVariantValue | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const incrementGamesPlayed = useCallback(() => {
    storage.getItem(STORAGE_KEYS.totalGamesPlayed).then((raw) => {
      const n = raw != null && raw !== '' ? parseInt(raw, 10) : 0;
      const next = (Number.isNaN(n) ? 0 : n) + 1;
      storage.setItem(STORAGE_KEYS.totalGamesPlayed, String(next));
    });
  }, []);

  useEffect(() => {
    Strings.loadForLocale(locale).then(() => {
      clearCivParsedCache();
      setStringsVersion((v) => v + 1);
    });
  }, [locale]);

  useEffect(() => {
    return subscribeToConnection(setSocketConnected);
  }, []);

  // Subscribe to matchmaking events once on mount so we never miss match_found (server can respond before we set screen)
  useEffect(() => {
    const unsubMatch = onMatchFound((data) => {
      if (__DEV__) console.log('[client] match_found received', data?.roomId);
      playGameStartedSound();
      setMatchPayload(data);
      setScreen('multiplayer_game');
    });
    const unsubTimeout = onMatchmakingTimeout(() => {
      setSearchTimedOut(true);
    });
    if (__DEV__) {
      const s = getSocket();
      s.on('connect', () => console.log('[client] socket connected', s.id));
      s.on('connect_error', (e: Error) => console.log('[client] socket connect_error', e.message));
    }
    return () => {
      unsubMatch();
      unsubTimeout();
    };
  }, []);

  const handleWin = useCallback((stars: number) => {
    incrementGamesPlayed();
    playVictorySound();
    setResultStars(stars);
    if (quizLevelId) {
      storage.getItem(STORAGE_KEYS.stars).then((raw) => {
        const prev: Record<string, number> = raw ? JSON.parse(raw) : {};
        prev[quizLevelId!] = Math.max(prev[quizLevelId!] ?? 0, stars);
        storage.setItem(STORAGE_KEYS.stars, JSON.stringify(prev));
      });
    }
    setScreen('result');
  }, [quizLevelId, incrementGamesPlayed]);

  const handleLose = useCallback((_correctAnswerText: string) => {}, []);

  useEffect(() => {
    if (screen !== 'menu') return;
    let cancelled = false;
    storage
      .getItem(STORAGE_KEYS.totalGamesPlayed)
      .then((raw) => {
        const n = raw != null && raw !== '' ? parseInt(raw, 10) : 0;
        if (cancelled || Number.isNaN(n) || n < 15) return undefined;
        return storage.getItem(STORAGE_KEYS.supportModalShown);
      })
      .then((shown) => {
        if (cancelled || shown === undefined || shown === '1' || shown === 'true') return;
        return storage.setItem(STORAGE_KEYS.supportModalShown, '1').then(() => {
          if (!cancelled) setShowSupportModal(true);
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [screen]);

  const level = quizLevelId ? getDifficultyLevelById(quizLevelId) : null;

  const backgroundSource =
    screen === 'menu' || screen === 'level_select' || screen === 'multiplayer_entry' || screen === 'multiplayer_result' || screen === 'training_select' || screen === 'leaderboard'
      ? require('../assets/images/bg_main3.png')
      : require('../assets/images/bg.png');

  const backgroundStyle =
    Platform.OS === 'web'
      ? [
          styles.background,
          {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: windowWidth,
            height: windowHeight,
            minWidth: windowWidth,
            minHeight: windowHeight,
            zIndex: 0,
          },
        ]
      : styles.background;

  return (
    <View style={[styles.wrapper, { width: windowWidth, height: windowHeight, minWidth: windowWidth, minHeight: windowHeight }]}>
      {Platform.OS === 'web' ? (
        <Image
          source={backgroundSource}
          style={backgroundStyle}
          resizeMode="cover"
        />
      ) : (
        <ImageBackground
          source={backgroundSource}
          style={styles.background}
          resizeMode="cover"
        />
      )}
      <View style={[styles.container, Platform.OS === 'web' ? { position: 'relative' as const, zIndex: 1 } : null]}>
        {screen === 'menu' && (
          <MainMenuScreen
            multiplayerDisabled={!socketConnected}
            onNavigate={(s) => {
              if (s === 'level_select') setScreen('level_select');
              else if (s === 'training_select') setScreen('training_select');
              else if (s === 'leaderboard') setScreen('leaderboard');
              else if (s === 'multiplayer') {
                if (!getSocket().connected) {
                  Alert.alert('', t('multiplayer.connectionError'));
                  return;
                }
                storage
                  .getItem(STORAGE_KEYS.multiplayerName)
                  .then((name) =>
                    storage.getItem(STORAGE_KEYS.multiplayerCiv).then((civId) => ({ name, civId }))
                  )
                  .then(({ name, civId }) => {
                    if (name && civId) {
                      if (!getSocket().connected) {
                        Alert.alert('', t('multiplayer.connectionError'));
                        return;
                      }
                      setSearchTimedOut(false);
                      setMatchPayload(null);
                      getOrCreateDeviceId().then((deviceId) => {
                        joinQueue(deviceId, name, civId, () => setScreen('multiplayer_searching'));
                      });
                    } else {
                      setScreen('multiplayer_entry');
                    }
                  });
              } else setScreen(s);
            }}
          />
        )}
        {screen === 'settings' && (
          <SettingsScreen
            onBack={() => setScreen('menu')}
            onSupportProject={() => setScreen('support')}
          />
        )}
        {screen === 'support' && (
          <SupportScreen onBack={() => setScreen('settings')} />
        )}
        {screen === 'level_select' && (
          <LevelSelectScreen
            onBack={() => setScreen('menu')}
            onStartLevel={(levelId) => {
              playGameStartedSound();
              setQuizLevelId(levelId);
              setScreen('quiz');
            }}
          />
        )}
        {screen === 'quiz' && level && (
          <CampaignQuiz
            level={level}
            onWin={handleWin}
            onLose={handleLose}
            onMenu={() => {
              setQuizLevelId(null);
              setScreen('menu');
            }}
            onLoseAndGoToMenu={() => {
              incrementGamesPlayed();
              setQuizLevelId(null);
              setScreen('menu');
            }}
          />
        )}
        {screen === 'result' && (
          <ResultScreen
            stars={resultStars}
            levelId={quizLevelId ?? ''}
            onNext={() => {
              setScreen('level_select');
              setQuizLevelId(null);
            }}
            onMenu={() => {
              setScreen('menu');
              setQuizLevelId(null);
            }}
          />
        )}
        {screen === 'multiplayer_entry' && (
          <MultiplayerEntryScreen
            onFindGame={(name, civId) => {
              storage.setItem(STORAGE_KEYS.multiplayerName, name);
              storage.setItem(STORAGE_KEYS.multiplayerCiv, civId);
              setSearchTimedOut(false);
              setMatchPayload(null);
              getOrCreateDeviceId().then((deviceId) => {
                joinQueue(deviceId, name, civId, () => setScreen('multiplayer_searching'));
              });
            }}
            onBack={() => setScreen('menu')}
          />
        )}
        {screen === 'multiplayer_searching' && (
          <SearchingScreen
            timedOut={searchTimedOut}
            onBack={() => {
              leaveQueue();
              setSearchTimedOut(false);
              setScreen('menu');
            }}
            onChangeProfile={() => {
              leaveQueue();
              setSearchTimedOut(false);
              setScreen('multiplayer_entry');
            }}
          />
        )}
        {screen === 'multiplayer_game' && matchPayload && (
          <MultiplayerQuiz
            roomId={matchPayload.roomId}
            opponent={matchPayload.opponent}
            you={matchPayload.you}
            onGameOver={(payload) => {
              incrementGamesPlayed();
              if (payload.youWon) playVictorySound();
              setGameOverPayload(payload);
              storage.setItem(STORAGE_KEYS.multiplayerRating, String(payload.newRating)).catch(() => {});
              setScreen('multiplayer_result');
            }}
            onMenu={() => {
              setMatchPayload(null);
              setScreen('menu');
            }}
          />
        )}
        {screen === 'multiplayer_result' && gameOverPayload && (
          <MultiplayerResultScreen
            payload={gameOverPayload}
            onMenu={() => {
              setGameOverPayload(null);
              setMatchPayload(null);
              setScreen('menu');
            }}
          />
        )}
        {screen === 'training_select' && (
          <TrainingSelectScreen
            onBack={() => setScreen('menu')}
            onSelectVariant={(v) => {
              setTrainingVariant(v);
              setScreen('training_quiz');
            }}
          />
        )}
        {screen === 'training_quiz' && trainingVariant && (
          <TrainingQuiz
            variant={trainingVariant}
            onBack={() => {
              incrementGamesPlayed();
              setTrainingVariant(null);
              setScreen('training_select');
            }}
          />
        )}
        {screen === 'leaderboard' && (
          <LeaderboardScreen onBack={() => setScreen('menu')} />
        )}
        {screen === 'profile_edit' && (
          <ProfileEditScreen
            onSave={(name, civId) => {
              storage.setItem(STORAGE_KEYS.multiplayerName, name);
              storage.setItem(STORAGE_KEYS.multiplayerCiv, civId);
              setScreen('menu');
            }}
            onBack={() => setScreen('menu')}
          />
        )}
      </View>

      <Modal visible={showSupportModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Do you like Aoe2Quiz? Do you want to support the project?</Text>
            <Text style={styles.modalDisclaimer}>
              (We will never show you this window again no matter what you click)
            </Text>
            <View style={styles.modalButtons}>
              <SoundPressable
                style={styles.modalButton}
                onPress={() => {
                  setShowSupportModal(false);
                  setScreen('support');
                }}
              >
                <Text style={styles.modalButtonText}>1</Text>
              </SoundPressable>
              <SoundPressable
                style={styles.modalButton}
                onPress={() => setShowSupportModal(false)}
              >
                <Text style={styles.modalButtonText}>2</Text>
              </SoundPressable>
              <SoundPressable
                style={styles.modalButton}
                onPress={() => setShowSupportModal(false)}
              >
                <Text style={styles.modalButtonText}>14</Text>
              </SoundPressable>
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingTop: 48,
    paddingBottom: 4,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    maxWidth: 360,
    width: '100%',
  },
  modalTitle: {
    fontFamily: 'Balthazar',
    fontSize: 22,
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDisclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  modalButton: {
    backgroundColor: '#2e5560',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    minWidth: 72,
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: 'Balthazar',
    fontSize: 20,
    color: '#fff',
  },
});

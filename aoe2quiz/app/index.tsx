import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Image, ImageBackground, useWindowDimensions, Platform, Alert } from 'react-native';
import Strings from '@/app/strings';
import { useLanguage } from '@/app/context/LanguageContext';
import { getDifficultyLevelById } from '@/app/config/difficulty';
import { STORAGE_KEYS } from '@/app/config/storageKeys';
import storage from '@/app/utils/storage';
import { clearCivParsedCache } from '@/app/utils/parseCivHelpTexts';
import { getOrCreateDeviceId } from '@/app/utils/deviceId';
import { playVictorySound, playGameStartedSound } from '@/app/utils/sounds';
import {
  getSocket,
  joinQueue,
  leaveQueue,
  onMatchFound,
  onMatchmakingTimeout,
  subscribeToConnection,
  type MatchFoundPayload,
  type GameOverPayload,
} from '@/app/services/socket';
import MainMenuScreen from '@/app/screens/MainMenuScreen';
import SettingsScreen from '@/app/screens/SettingsScreen';
import LevelSelectScreen from '@/app/screens/LevelSelectScreen';
import ResultScreen from '@/app/screens/ResultScreen';
import CampaignQuiz from '@/app/components/CampaignQuiz';
import MultiplayerEntryScreen from '@/app/screens/MultiplayerEntryScreen';
import SearchingScreen from '@/app/screens/SearchingScreen';
import MultiplayerQuiz from '@/app/components/MultiplayerQuiz';
import MultiplayerResultScreen from '@/app/screens/MultiplayerResultScreen';
import TrainingSelectScreen from '@/app/screens/TrainingSelectScreen';
import TrainingQuiz from '@/app/components/TrainingQuiz';
import LeaderboardScreen from '@/app/screens/LeaderboardScreen';
import ProfileEditScreen from '@/app/screens/ProfileEditScreen';
import type { QuestionTypeVariantValue } from '@/app/config/questionTypes';

type Screen =
  | 'menu'
  | 'settings'
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
  }, [quizLevelId]);

  const handleLose = useCallback((_correctAnswerText: string) => {}, []);

  const level = quizLevelId ? getDifficultyLevelById(quizLevelId) : null;

  const backgroundSource =
    screen === 'menu' || screen === 'level_select' || screen === 'settings' || screen === 'multiplayer_entry' || screen === 'multiplayer_searching' || screen === 'multiplayer_result' || screen === 'training_select' || screen === 'leaderboard'
      ? require('../assets/images/bg_main2.png')
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
                    Promise.all([
                      storage.getItem(STORAGE_KEYS.multiplayerCiv),
                      storage.getItem(STORAGE_KEYS.multiplayerCountry),
                    ]).then(([civId, legacy]) => ({ name, civId: civId || legacy }))
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
          <SettingsScreen onBack={() => setScreen('menu')} />
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
    paddingTop: 20,
    paddingBottom: 4,
    width: '100%',
  },
});

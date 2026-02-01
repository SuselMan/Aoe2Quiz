import 'react-native-reanimated';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import SoundPressable from './ui/SoundPressable';
import AnswerButton from './ui/AnswerButton';
import ResourcesButton from './ui/ResourcesButton';
import TechTreeBranch from './TechTree';
import { Answer, Question } from '@/app/const/common';
import { getQuestionByVariants } from '@/app/utils/game';
import { createSeededRandom } from '@/app/utils/seededRandom';
import { useLanguage } from '@/app/context/LanguageContext';
import { getDifficultyLevelById } from '@/app/config/difficulty';
import type { TechTreeBrunch } from '@/app/const/techTree';
import {
  onQuestion,
  onGameOver as subscribeToGameOver,
  sendReady,
  sendAnswer,
  type QuestionPayload,
  type GameOverPayload,
} from '@/app/services/socket';
import { getCivIconUri } from '@/app/utils/helpers';

const QUESTION_TIME_SEC = 30;

type Props = {
  roomId: string;
  opponent: { name: string; civId: string; rating: number };
  you: { name: string; civId: string; rating: number };
  onGameOver: (payload: GameOverPayload) => void;
  onMenu: () => void;
};

export default function MultiplayerQuiz({ roomId, opponent, you, onGameOver, onMenu }: Props) {
  const { t } = useLanguage();
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SEC);
  const [wrongAnswerReveal, setWrongAnswerReveal] = useState(false);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const usedQuestionKeysRef = useRef<string[]>([]);

  useEffect(() => {
    const unsubQ = onQuestion((data: QuestionPayload) => {
      const level = getDifficultyLevelById(data.levelId);
      if (!level) return;
      if (data.questionIndex === 0) usedQuestionKeysRef.current = [];
      const random = createSeededRandom(data.seed);
      const usedKeys = new Set(usedQuestionKeysRef.current);
      const q = getQuestionByVariants(level.questionVariants, level.id, random, t, usedKeys);
      if (q.questionKey) usedQuestionKeysRef.current.push(q.questionKey);
      setCurrentQ(q);
      setQuestionIndex(data.questionIndex);
      setTimeLeft(data.timeSec);
      setWrongAnswerReveal(false);
      setAnswered(false);
    });
    const unsubG = subscribeToGameOver((payload: GameOverPayload) => {
      onGameOver(payload);
    });
    sendReady(roomId);
    return () => {
      unsubQ();
      unsubG();
    };
  }, [roomId, onGameOver, t]);

  useEffect(() => {
    if (wrongAnswerReveal || answered) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setAnswered(true);
          setWrongAnswerReveal(true);
          sendAnswer(roomId, false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [wrongAnswerReveal, answered, roomId, questionIndex]);

  const onAnswer = useCallback(
    (correct: boolean) => {
      if (answered) return;
      setAnswered(true);
      sendAnswer(roomId, correct);
      if (!correct) setWrongAnswerReveal(true);
    },
    [roomId, answered]
  );

  const showExitConfirm = useCallback(() => {
    Alert.alert(t('confirmExit.title'), t('confirmExit.message'), [
      { text: t('confirmExit.cancel'), style: 'cancel' },
      { text: t('confirmExit.confirm'), onPress: onMenu },
    ]);
  }, [t, onMenu]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      showExitConfirm();
      return true;
    });
    return () => sub.remove();
  }, [showExitConfirm]);

  const isPriceAnswer = (a: Answer) => a.cost != null;
  const isCivTechTreeAnswer = (a: Answer) =>
    !isPriceAnswer(a) && (a.text != null || a.image != null);

  if (!currentQ) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>{t('multiplayer.searching')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.quizContainer}>
      {!wrongAnswerReveal && (
        <View style={styles.timerTrack}>
          <View style={[styles.timerFill, { width: `${(timeLeft / QUESTION_TIME_SEC) * 100}%` }]} />
        </View>
      )}
      <View style={styles.header}>
        <SoundPressable style={styles.backButton} onPress={showExitConfirm}>
          <Text style={styles.backButtonText}>{t('levelSelect.back')}</Text>
        </SoundPressable>
        <View style={styles.opponentRow}>
          <Image
            source={{ uri: getCivIconUri(opponent.civId) }}
            style={styles.opponentCivIcon}
            resizeMode="contain"
          />
          <Text style={styles.opponentName} numberOfLines={1}>
            {opponent.name}
          </Text>
          <Text style={styles.opponentRating}> {opponent.rating}</Text>
        </View>
        <Text style={styles.count}>
          {t('quiz.questionProgress', {
            current: questionIndex + 1,
            total: 50,
          })}
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{currentQ.text}</Text>
        {!!currentQ.image && (
          <ImageBackground
            source={require('../../assets/images/image_bg.png')}
            style={styles.imageBackground}
            resizeMode="stretch"
          >
            <Image source={{ uri: currentQ.image }} style={styles.questionImage} />
          </ImageBackground>
        )}
        {!!currentQ.tree && !!currentQ.building && (
          <ScrollView
            horizontal
            style={styles.scrollContainer}
            showsHorizontalScrollIndicator
            persistentScrollbar
          >
            <TechTreeBranch
              data={currentQ.tree as TechTreeBrunch}
              civId="Armenians"
              type={currentQ.building}
            />
          </ScrollView>
        )}
        <Text style={styles.subtext}>{currentQ.subText}</Text>
        {!!currentQ.additionalInfo && (
          <Text style={styles.additional}>{currentQ.additionalInfo}</Text>
        )}
      </View>
      <View style={styles.footer}>
        <View style={styles.buttonsContainer}>
          {currentQ.answers.map((answer) => {
            const revealCorrect = answer.isCorrect && (wrongAnswerReveal || answered);
            const onPress =
              wrongAnswerReveal || answered
                ? () => {}
                : answer.isCorrect
                  ? () => onAnswer(true)
                  : () => onAnswer(false);
            return (
              <View key={answer.id} style={styles.answerButton}>
                {isCivTechTreeAnswer(answer) && (
                  <AnswerButton
                    reveal={revealCorrect}
                    isCorrect={answer.isCorrect}
                    text={answer?.text ?? ''}
                    onPress={onPress}
                    imageUrl={answer.image}
                  />
                )}
                {isPriceAnswer(answer) && (
                  <ResourcesButton
                    reveal={revealCorrect}
                    isCorrect={answer.isCorrect}
                    cost={answer.cost}
                    onPress={onPress}
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  quizContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Balthazar',
    fontSize: 20,
    color: '#1a1a1a',
  },
  timerTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 10,
  },
  timerFill: {
    height: '100%',
    backgroundColor: '#2e5560',
  },
  header: {
    flexShrink: 0,
    minHeight: 56,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(46, 85, 96, 0.9)',
  },
  backButtonText: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#fff',
  },
  opponentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  opponentCivIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    marginRight: 8,
  },
  opponentName: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#1a1a1a',
    flexShrink: 1,
  },
  opponentRating: {
    fontFamily: 'Balthazar',
    fontSize: 14,
    color: '#666',
  },
  count: {
    fontFamily: 'Balthazar',
    fontSize: 24,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'Balthazar',
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
  },
  imageBackground: {
    width: 142,
    height: 148,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
    paddingBottom: 4,
  },
  questionImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  scrollContainer: { flexGrow: 0 },
  subtext: {
    fontFamily: 'Balthazar',
    fontSize: 20,
    marginTop: 12,
    textAlign: 'center',
  },
  additional: {
    fontFamily: 'Balthazar',
    fontSize: 14,
    marginTop: 8,
    color: '#555',
  },
  footer: {
    flexGrow: 0,
    width: '100%',
    paddingHorizontal: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  answerButton: {
    maxWidth: '50%',
    minWidth: '50%',
    flexBasis: '50%',
    padding: 8,
  },
});

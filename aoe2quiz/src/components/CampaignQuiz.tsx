import 'react-native-reanimated';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView, BackHandler, Alert } from 'react-native';
import SoundPressable from './ui/SoundPressable';
import AnswerButton from './ui/AnswerButton';
import ResourcesButton from './ui/ResourcesButton';
import TechTreeBranch from './TechTree';
import { Answer, Question } from '@/src/const/common';
import { getQuestionByVariants } from '@/src/utils/game';
import { useLanguage } from '@/src/context/LanguageContext';
import type { DifficultyLevel } from '@/src/config/difficulty';
import type { TechTreeBrunch } from '@/src/const/techTree';

const QUESTION_TIME_SEC = 30;

type Props = {
  level: DifficultyLevel;
  onWin: (stars: number) => void;
  onLose: (correctAnswerText: string) => void;
  onMenu: () => void;
};

export default function CampaignQuiz({ level, onWin, onLose, onMenu }: Props) {
  const { t } = useLanguage();
  const [questionsLeft, setQuestionsLeft] = useState(level.questionCount);
  const [currentQ, setCurrentQ] = useState<Question>(() => getQuestionByVariants(level.questionVariants, level.id, undefined, t));
  const [lives, setLives] = useState(level.lives);
  const [wrongAnswerReveal, setWrongAnswerReveal] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SEC);
  const [questionKey, setQuestionKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const usedQuestionKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const key = currentQ.questionKey;
    if (key) usedQuestionKeysRef.current.add(key);
  }, []);

  const goNext = useCallback(() => {
    if (questionsLeft - 1 <= 0) {
      const stars = lives;
      onWin(stars);
      return;
    }
    setTimeLeft(QUESTION_TIME_SEC);
    setQuestionKey((k) => k + 1);
    setQuestionsLeft(questionsLeft - 1);
    const nextQ = getQuestionByVariants(level.questionVariants, level.id, undefined, t, usedQuestionKeysRef.current);
    if (nextQ.questionKey) usedQuestionKeysRef.current.add(nextQ.questionKey);
    setCurrentQ(nextQ);
  }, [questionsLeft, lives, level.questionVariants, level.id, onWin, t]);

  const onCorrect = useCallback(() => {
    goNext();
  }, [goNext]);

  const onIncorrect = useCallback(() => {
    setWrongAnswerReveal(true);
    const newLives = lives - 1;
    if (newLives <= 0) {
      setIsGameOver(true);
      return;
    }
    setLives(newLives);
  }, [lives]);

  useEffect(() => {
    if (wrongAnswerReveal) {
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
          onIncorrect();
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
  }, [wrongAnswerReveal, questionKey, onIncorrect]);

  const handleContinueAfterWrong = useCallback(() => {
    if (questionsLeft - 1 <= 0) {
      onWin(lives);
      return;
    }
    setWrongAnswerReveal(false);
    setTimeLeft(QUESTION_TIME_SEC);
    setQuestionKey((k) => k + 1);
    setQuestionsLeft(questionsLeft - 1);
    const nextQ = getQuestionByVariants(level.questionVariants, level.id, undefined, t, usedQuestionKeysRef.current);
    if (nextQ.questionKey) usedQuestionKeysRef.current.add(nextQ.questionKey);
    setCurrentQ(nextQ);
  }, [questionsLeft, lives, level.questionVariants, level.id, onWin, t]);

  const handleRepeat = useCallback(() => {
    setIsGameOver(false);
    setWrongAnswerReveal(false);
    setTimeLeft(QUESTION_TIME_SEC);
    setQuestionKey((k) => k + 1);
    setLives(level.lives);
    setQuestionsLeft(level.questionCount);
    usedQuestionKeysRef.current.clear();
    const firstQ = getQuestionByVariants(level.questionVariants, level.id, undefined, t);
    if (firstQ.questionKey) usedQuestionKeysRef.current.add(firstQ.questionKey);
    setCurrentQ(firstQ);
  }, [level.lives, level.questionCount, level.questionVariants, level.id, t]);

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
  /** Show icon+text only when this is not a price answer (price questions must show only costs) */
  const isCivTechTreeAnswer = (a: Answer) => !isPriceAnswer(a) && (a.text != null || a.image != null);

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
        <View style={styles.lives}>
          {new Array(lives).fill(0).map((_, i) => (
            <Image key={`live-${i}`} source={require('../../assets/images/heart.png')} style={styles.heart} />
          ))}
        </View>
        <Text style={styles.count}>
          {t('quiz.questionProgress', { current: level.questionCount - questionsLeft + 1, total: level.questionCount })}
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
          <ScrollView horizontal style={styles.scrollContainer} showsHorizontalScrollIndicator persistentScrollbar>
            <TechTreeBranch
              data={currentQ.tree as TechTreeBrunch}
              civId="Armenians"
              type={currentQ.building}
            />
          </ScrollView>
        )}
        <Text style={styles.subtext}>{currentQ.subText}</Text>
        {!!currentQ.additionalInfo && <Text style={styles.additional}>{currentQ.additionalInfo}</Text>}
        {wrongAnswerReveal && (
          <View style={styles.actionButtonsRow}>
            {isGameOver ? (
              <>
                <SoundPressable style={styles.actionButton} onPress={handleRepeat}>
                  <Text style={styles.actionButtonText}>{t('gameOver.repeat')}</Text>
                </SoundPressable>
                <SoundPressable style={[styles.actionButton, styles.actionButtonSecondary]} onPress={onMenu}>
                  <Text style={styles.actionButtonTextSecondary}>{t('gameOver.menu')}</Text>
                </SoundPressable>
              </>
            ) : (
              <SoundPressable style={styles.actionButton} onPress={handleContinueAfterWrong}>
                <Text style={styles.actionButtonText}>{t('result.next')}</Text>
              </SoundPressable>
            )}
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <View style={styles.buttonsContainer}>
          {currentQ.answers.map((answer) => {
            const revealCorrect = wrongAnswerReveal && answer.isCorrect;
            const onAnswerPress = wrongAnswerReveal ? () => {} : (answer.isCorrect ? onCorrect : onIncorrect);
            return (
              <View key={answer.id} style={styles.answerButton}>
                {isCivTechTreeAnswer(answer) && (
                  <AnswerButton
                    reveal={revealCorrect}
                    isCorrect={answer.isCorrect}
                    text={answer?.text ?? ''}
                    onPress={onAnswerPress}
                    imageUrl={answer.image}
                  />
                )}
                {isPriceAnswer(answer) && (
                  <ResourcesButton
                    reveal={revealCorrect}
                    isCorrect={answer.isCorrect}
                    cost={answer.cost}
                    onPress={onAnswerPress}
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
    height: 60,
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
  lives: { flexDirection: 'row', gap: 4 },
  heart: { width: 42, height: 42 },
  count: { fontFamily: 'Balthazar', fontSize: 24 },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: { fontFamily: 'Balthazar', fontSize: 22, marginBottom: 12, textAlign: 'center' },
  imageBackground: {
    width: 142,
    height: 148,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
    paddingBottom: 4,
  },
  questionImage: { width: 64, height: 64, borderRadius: 10 },
  scrollContainer: { flexGrow: 0 },
  subtext: { fontFamily: 'Balthazar', fontSize: 20, marginTop: 12, textAlign: 'center' },
  additional: { fontFamily: 'Balthazar', fontSize: 14, marginTop: 8, color: '#555' },
  actionButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    borderRadius: 12,
    backgroundColor: '#2e5560',
    paddingVertical: 14,
    paddingHorizontal: 24,
    minWidth: 120,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2e5560',
  },
  actionButtonText: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#fff',
  },
  actionButtonTextSecondary: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#2e5560',
  },
  footer: { flexGrow: 0, width: '100%', paddingHorizontal: 8 },
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

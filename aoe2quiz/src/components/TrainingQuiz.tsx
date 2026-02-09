import 'react-native-reanimated';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView, BackHandler } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import SoundPressable from './ui/SoundPressable';
import AnswerButton from './ui/AnswerButton';
import ResourcesButton from './ui/ResourcesButton';
import TechTreeBranch from './TechTree';
import { Answer, Question } from '@/src/const/common';
import { getQuestionByVariants } from '@/src/utils/game';
import { useLanguage } from '@/src/context/LanguageContext';
import type { QuestionTypeVariantValue } from '@/src/config/questionTypes';
import type { TechTreeBrunch } from '@/src/const/techTree';

const QUESTION_TIME_SEC = 30;

type Props = {
  variant: QuestionTypeVariantValue;
  onBack: () => void;
};

export default function TrainingQuiz({ variant, onBack }: Props) {
  const { t } = useLanguage();
  const [currentQ, setCurrentQ] = useState<Question>(() =>
    getQuestionByVariants([variant], undefined, undefined, t)
  );
  const [wrongAnswerReveal, setWrongAnswerReveal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SEC);
  const [questionKey, setQuestionKey] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const usedQuestionKeysRef = useRef<Set<string>>(new Set());
  const swipeStartX = useSharedValue(0);

  useEffect(() => {
    const key = currentQ.questionKey;
    if (key) usedQuestionKeysRef.current.add(key);
  }, []);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-20, 20])
        .onStart((e) => {
          swipeStartX.value = e.x;
        })
        .onEnd((e) => {
          if (swipeStartX.value < 50 && e.translationX > 70) {
            runOnJS(onBack)();
          }
        }),
    [onBack, swipeStartX]
  );

  const goNext = useCallback(() => {
    setTimeLeft(QUESTION_TIME_SEC);
    setQuestionKey((k) => k + 1);
    setAnsweredCount((c) => c + 1);
    const nextQ = getQuestionByVariants([variant], undefined, undefined, t, usedQuestionKeysRef.current);
    if (nextQ.questionKey) usedQuestionKeysRef.current.add(nextQ.questionKey);
    setCurrentQ(nextQ);
  }, [variant, t]);

  const onCorrect = useCallback(() => {
    goNext();
  }, [goNext]);

  const onIncorrect = useCallback(() => {
    setWrongAnswerReveal(true);
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

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
    setWrongAnswerReveal(false);
    setTimeLeft(QUESTION_TIME_SEC);
    setQuestionKey((k) => k + 1);
    setAnsweredCount((c) => c + 1);
    const nextQ = getQuestionByVariants([variant], undefined, undefined, t, usedQuestionKeysRef.current);
    if (nextQ.questionKey) usedQuestionKeysRef.current.add(nextQ.questionKey);
    setCurrentQ(nextQ);
  }, [variant, t]);

  const isPriceAnswer = (a: Answer) => a.cost != null;
  const isCivTechTreeAnswer = (a: Answer) => !isPriceAnswer(a) && (a.text != null || a.image != null);

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.quizContainer}>
      {!wrongAnswerReveal && (
        <View style={styles.timerTrack}>
          <View style={[styles.timerFill, { width: `${(timeLeft / QUESTION_TIME_SEC) * 100}%` }]} />
        </View>
      )}
      <View style={styles.header}>
        <SoundPressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>{t('training.back')}</Text>
        </SoundPressable>
        <Text style={styles.count}>{t('training.answered', { count: answeredCount })}</Text>
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
            <SoundPressable style={styles.actionButton} onPress={handleContinueAfterWrong}>
              <Text style={styles.actionButtonText}>{t('result.next')}</Text>
            </SoundPressable>
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
    </GestureDetector>
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
  count: {
    fontFamily: 'Balthazar',
    fontSize: 20,
    color: '#1a1a1a',
  },
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
  actionButtonText: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#fff',
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

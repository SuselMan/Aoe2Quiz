import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SoundPressable from '@/src/components/ui/SoundPressable';
import { useLanguage } from '@/src/context/LanguageContext';

type Props = {
  correctAnswerText: string;
  onRepeat: () => void;
  onMenu: () => void;
};

export default function GameOverScreen({ correctAnswerText, onRepeat, onMenu }: Props) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('gameOver.title')}</Text>
      <Text style={styles.label}>{t('gameOver.correctWas')}</Text>
      <ScrollView style={styles.answerScroll}>
        <Text style={styles.correctAnswer}>{correctAnswerText}</Text>
      </ScrollView>
      <SoundPressable style={styles.button} onPress={onRepeat}>
        <Text style={styles.buttonText}>{t('gameOver.repeat')}</Text>
      </SoundPressable>
      <SoundPressable style={[styles.button, styles.buttonSecondary]} onPress={onMenu}>
        <Text style={styles.buttonTextSecondary}>{t('gameOver.menu')}</Text>
      </SoundPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Balthazar',
    fontSize: 28,
    marginBottom: 24,
    color: '#c0392b',
  },
  label: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
    alignSelf: 'flex-start',
  },
  answerScroll: {
    maxHeight: 120,
    width: '100%',
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  correctAnswer: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#1a1a1a',
  },
  button: {
    width: '100%',
    maxWidth: 280,
    borderRadius: 12,
    backgroundColor: '#2e5560',
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2e5560',
  },
  buttonText: {
    fontFamily: 'Balthazar',
    fontSize: 20,
    color: '#fff',
  },
  buttonTextSecondary: {
    fontFamily: 'Balthazar',
    fontSize: 20,
    color: '#2e5560',
  },
});

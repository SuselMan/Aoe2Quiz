import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SoundPressable from '@/src/components/ui/SoundPressable';
import { useLanguage } from '@/src/context/LanguageContext';

type Props = {
  stars: number;
  levelId: string;
  onNext: () => void;
  onMenu: () => void;
};

export default function ResultScreen({ stars, onNext, onMenu }: Props) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('result.winTitle')}</Text>
      <Text style={styles.stars}>{t('result.starsEarned', { count: stars })}</Text>
      <View style={styles.starRow}>
        {[1, 2, 3].map((i) => (
          <Text key={i} style={styles.star}>{i <= stars ? '★' : '☆'}</Text>
        ))}
      </View>
      <SoundPressable style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>{t('result.next')}</Text>
      </SoundPressable>
      <SoundPressable style={[styles.button, styles.buttonSecondary]} onPress={onMenu}>
        <Text style={styles.buttonTextSecondary}>{t('result.menu')}</Text>
      </SoundPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontFamily: 'Balthazar',
    fontSize: 28,
    marginBottom: 16,
    color: '#1a1a1a',
  },
  stars: {
    fontFamily: 'Balthazar',
    fontSize: 20,
    marginBottom: 24,
    color: '#333',
  },
  starRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  star: {
    fontSize: 48,
    color: '#d4a017',
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

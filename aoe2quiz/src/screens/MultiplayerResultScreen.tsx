import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SoundPressable from '@/src/components/ui/SoundPressable';
import { useLanguage } from '@/src/context/LanguageContext';
import type { GameOverPayload } from '@/src/services/socket';

type Props = {
  payload: GameOverPayload;
  onMenu: () => void;
};

export default function MultiplayerResultScreen({ payload, onMenu }: Props) {
  const { t } = useLanguage();
  const { youWon, result, yourRatingChange, newRating } = payload;

  const title =
    result === 'draw'
      ? t('multiplayer.draw')
      : youWon
        ? t('multiplayer.youWon')
        : t('multiplayer.youLost');

  const changeStr =
    yourRatingChange >= 0 ? `+${yourRatingChange}` : String(yourRatingChange);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.rating}>
        {t('multiplayer.rating')}: {newRating}
      </Text>
      <Text style={styles.change}>
        {t('multiplayer.ratingChange')}: {changeStr}
      </Text>
      <SoundPressable style={styles.button} onPress={onMenu}>
        <Text style={styles.buttonText}>{t('multiplayer.back')}</Text>
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
    marginBottom: 24,
    color: '#1a1a1a',
  },
  rating: {
    fontFamily: 'Balthazar',
    fontSize: 20,
    marginBottom: 8,
    color: '#1a1a1a',
  },
  change: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    marginBottom: 32,
    color: '#666',
  },
  button: {
    borderRadius: 12,
    backgroundColor: '#2e5560',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontFamily: 'Balthazar',
    fontSize: 20,
    color: '#fff',
  },
});

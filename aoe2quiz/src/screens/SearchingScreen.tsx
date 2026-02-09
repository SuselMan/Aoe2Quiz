import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import SoundPressable from '@/src/components/ui/SoundPressable';
import { useLanguage } from '@/src/context/LanguageContext';

type Props = {
  timedOut?: boolean;
  onBack: () => void;
  onChangeProfile?: () => void;
};

export default function SearchingScreen({ timedOut, onBack, onChangeProfile }: Props) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      {!timedOut ? (
        <>
          <ActivityIndicator size="large" color="#2e5560" />
          <Text style={styles.text}>{t('multiplayer.searching')}</Text>
        </>
      ) : (
        <Text style={[styles.text, styles.timeoutText]}>{t('multiplayer.noPlayers')}</Text>
      )}
      <SoundPressable style={styles.button} onPress={onBack}>
        <Text style={styles.buttonText}>{t('multiplayer.back')}</Text>
      </SoundPressable>
      {onChangeProfile && (
        <SoundPressable style={[styles.button, styles.buttonSecondary]} onPress={onChangeProfile}>
          <Text style={styles.buttonTextSecondary}>{t('multiplayer.changeProfile')}</Text>
        </SoundPressable>
      )}
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
  text: {
    fontFamily: 'Balthazar',
    fontSize: 22,
    marginTop: 24,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  timeoutText: {
    marginTop: 0,
  },
  button: {
    marginTop: 32,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#2e5560',
    borderRadius: 12,
  },
  buttonSecondary: {
    marginTop: 12,
    borderColor: 'transparent',
  },
  buttonText: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#2e5560',
  },
  buttonTextSecondary: {
    fontFamily: 'Balthazar',
    fontSize: 16,
    color: '#666',
  },
});

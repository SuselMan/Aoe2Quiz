import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import SoundPressable from '@/app/components/ui/SoundPressable';
import { useLanguage } from '@/app/context/LanguageContext';
import { STORAGE_KEYS } from '@/app/config/storageKeys';
import storage from '@/app/utils/storage';
import { getCivIconUri } from '@/app/utils/helpers';

type Screen = 'menu' | 'settings' | 'level_select' | 'quiz' | 'result' | 'multiplayer' | 'training_select' | 'training_quiz' | 'leaderboard' | 'profile_edit';

type Props = {
  onNavigate: (screen: Screen) => void;
  multiplayerDisabled?: boolean;
};

export default function MainMenuScreen({ onNavigate, multiplayerDisabled }: Props) {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<{
    name: string | null;
    civId: string | null;
    rating: number | null;
  }>({ name: null, civId: null, rating: null });

  useEffect(() => {
    Promise.all([
      storage.getItem(STORAGE_KEYS.multiplayerName),
      storage.getItem(STORAGE_KEYS.multiplayerCiv),
      storage.getItem(STORAGE_KEYS.multiplayerRating),
    ]).then(([name, civId, ratingStr]) => {
      setProfile({
        name: name ?? null,
        civId: civId ?? null,
        rating: ratingStr != null && ratingStr !== '' ? parseInt(ratingStr, 10) : null,
      });
    });
  }, []);

  const showProfile = profile.name && profile.civId;

  return (
    <View style={styles.container}>
      {showProfile && (
        <SoundPressable
          style={styles.profileBadge}
          onPress={() => onNavigate('profile_edit')}
          accessibilityLabel={t('multiplayer.changeProfile')}
        >
          <Image
            source={{ uri: getCivIconUri(profile.civId!) }}
            style={styles.profileCivIcon}
            resizeMode="contain"
          />
          <Text style={styles.profileName} numberOfLines={1}>
            {profile.name}
          </Text>
          {profile.rating != null && !Number.isNaN(profile.rating) && (
            <Text style={styles.profileRating}>{profile.rating}</Text>
          )}
        </SoundPressable>
      )}
      <SoundPressable
        style={styles.settingsButton}
        onPress={() => onNavigate('settings')}
        accessibilityLabel={t('menu.settings')}
      >
        <Image
          source={require('../../assets/images/settings-icon.png')}
          style={styles.settingsIcon}
          resizeMode="contain"
        />
      </SoundPressable>
      <Text style={styles.title}>AoE2 Quiz</Text>
      <SoundPressable style={styles.button} onPress={() => onNavigate('level_select')}>
        <Text style={styles.buttonText}>{t('menu.singlePlayer')}</Text>
      </SoundPressable>
      <SoundPressable style={styles.button} onPress={() => onNavigate('training_select')}>
        <Text style={styles.buttonText}>{t('menu.training')}</Text>
      </SoundPressable>
      <SoundPressable
        style={[styles.button, multiplayerDisabled && styles.buttonDisabled]}
        onPress={() => onNavigate('multiplayer')}
        disabled={multiplayerDisabled}
      >
        <Text style={styles.buttonText}>{t('menu.competition')}</Text>
      </SoundPressable>
      <SoundPressable style={styles.button} onPress={() => onNavigate('leaderboard')}>
        <Text style={styles.buttonText}>{t('menu.leaderboard')}</Text>
      </SoundPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  profileBadge: {
    position: 'absolute',
    top: 16,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    maxWidth: 180,
    gap: 6,
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 24,
    padding: 8,
  },
  settingsIcon: {
    width: 48,
    height: 48,
  },
  profileCivIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  profileName: {
    fontFamily: 'Balthazar',
    fontSize: 16,
    color: '#1a1a1a',
    flexShrink: 1,
  },
  profileRating: {
    fontFamily: 'Balthazar',
    fontSize: 14,
    color: '#2e5560',
    fontWeight: 'bold',
  },
  title: {
    fontFamily: 'Balthazar',
    fontSize: 32,
    marginBottom: 40,
    color: '#1a1a1a',
  },
  button: {
    width: '100%',
    maxWidth: 280,
    borderRadius: 12,
    backgroundColor: '#2e5560',
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Balthazar',
    fontSize: 20,
    color: '#fff',
  },
});

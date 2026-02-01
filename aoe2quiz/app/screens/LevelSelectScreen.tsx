import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, ScrollView, BackHandler } from 'react-native';
import SoundPressable from '@/app/components/ui/SoundPressable';
import { useLanguage } from '@/app/context/LanguageContext';
import { DIFFICULTY_LEVELS } from '@/app/config/difficulty';
import { getUnitImageById } from '@/app/utils/helpers';
import { Unit } from '@/app/const/techTree';
import storage from '@/app/utils/storage';
import { STORAGE_KEYS } from '@/app/config/storageKeys';
import type { StarsPayload } from '@/app/config/storageKeys';

/** Map difficulty level id to Unit enum (same as in quiz unit-price questions). King uses crown icon (unique_tech_2). */
const LEVEL_TO_UNIT: Record<string, Unit> = {
  villager: Unit.Villager,
  militia: Unit.Militia,
  scout: Unit.ScoutCavalry,
  pikeman: Unit.Pikeman,
  archer: Unit.Archer,
  knight: Unit.Knight,
  cavalier: Unit.Monk,
  paladin: Unit.Paladin,
};

const KING_ICON_URI = 'https://aoe2techtree.net/img/Techs/unique_tech_2.png';

type Props = {
  onBack: () => void;
  onStartLevel: (levelId: string) => void;
};

export default function LevelSelectScreen({ onBack, onStartLevel }: Props) {
  const { t } = useLanguage();
  const [stars, setStars] = useState<StarsPayload>({});

  useEffect(() => {
    storage.getItem(STORAGE_KEYS.stars).then((raw) => {
      if (raw) try { setStars(JSON.parse(raw)); } catch {}
    });
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

  const isUnlocked = (levelIndex: number) => {
    if (levelIndex === 0) return true;
    const prevId = DIFFICULTY_LEVELS[levelIndex - 1].id;
    return (stars[prevId] ?? 0) >= 1;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('levelSelect.title')}</Text>
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {DIFFICULTY_LEVELS.map((level, index) => {
          const unlocked = isUnlocked(index);
          const starCount = stars[level.id] ?? 0;
          return (
            <SoundPressable
              key={level.id}
              style={[styles.levelRow, !unlocked && styles.levelRowLocked]}
              onPress={() => unlocked && onStartLevel(level.id)}
              disabled={!unlocked}
            >
              <View style={styles.levelLeftWrap}>
                <ImageBackground
                  source={require('../../assets/images/image_bg.png')}
                  style={styles.levelIconBg}
                  resizeMode="stretch"
                >
                  <Image
                    source={{
                      uri: level.id === 'king'
                        ? KING_ICON_URI
                        : getUnitImageById(LEVEL_TO_UNIT[level.id] ?? Unit.Villager),
                    }}
                    style={styles.levelIcon}
                  />
                </ImageBackground>
                <View style={styles.levelLeft}>
                  <Text style={styles.levelName}>{t(level.nameKey)}</Text>
                  <Text style={styles.levelMeta}>
                    {level.questionCount} · {starCount} {t('levelSelect.stars')}
                  </Text>
                </View>
              </View>
              <View style={styles.stars}>
                {[1, 2, 3].map((i) => (
                  <Text key={i} style={styles.star}>{i <= starCount ? '★' : '☆'}</Text>
                ))}
              </View>
              {!unlocked && (
                <Text style={styles.lockedLabel}>{t('levelSelect.locked')}</Text>
              )}
            </SoundPressable>
          );
        })}
      </ScrollView>
      <SoundPressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>{t('levelSelect.back')}</Text>
      </SoundPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontFamily: 'Balthazar',
    fontSize: 24,
    marginBottom: 20,
    color: '#1a1a1a',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
    width: '100%',
    alignSelf: 'stretch',
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    width: '100%',
  },
  levelRowLocked: {
    opacity: 0.7,
    backgroundColor: '#e0e0e0',
  },
  levelLeftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  levelIconBg: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  levelIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  levelLeft: {
    flex: 1,
    minWidth: 100,
  },
  levelName: {
    fontFamily: 'Balthazar',
    fontSize: 20,
    color: '#1a1a1a',
  },
  levelMeta: {
    fontFamily: 'Balthazar',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
    flexShrink: 0,
  },
  star: {
    fontSize: 20,
    color: '#d4a017',
  },
  lockedLabel: {
    position: 'absolute',
    right: 16,
    fontFamily: 'Balthazar',
    fontSize: 12,
    color: '#999',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#2e5560',
    marginTop: 16,
  },
  backButtonText: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#fff',
  },
});

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler } from 'react-native';
import SoundPressable from '@/app/components/ui/SoundPressable';
import { useLanguage } from '@/app/context/LanguageContext';
import { SUPPORTED_TRAINING_VARIANTS } from '@/app/utils/game';
import type { QuestionTypeVariantValue } from '@/app/config/questionTypes';

type Props = {
  onBack: () => void;
  onSelectVariant: (variant: QuestionTypeVariantValue) => void;
};

export default function TrainingSelectScreen({ onBack, onSelectVariant }: Props) {
  const { t } = useLanguage();

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('training.title')}</Text>
      <Text style={styles.subtitle}>{t('training.selectType')}</Text>
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {SUPPORTED_TRAINING_VARIANTS.map((variant) => (
          <SoundPressable
            key={variant}
            style={styles.row}
            onPress={() => onSelectVariant(variant)}
          >
            <Text style={styles.rowText}>{t(`questions.${variant}`)}</Text>
          </SoundPressable>
        ))}
      </ScrollView>
      <SoundPressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>{t('training.back')}</Text>
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
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontFamily: 'Balthazar',
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
    width: '100%',
    alignSelf: 'stretch',
  },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    width: '100%',
  },
  rowText: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#1a1a1a',
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

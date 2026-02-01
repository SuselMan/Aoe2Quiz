import React, { createElement, useState } from 'react';
import { View, Text, StyleSheet, Platform, Modal, ScrollView, Switch } from 'react-native';
import SoundPressable from '@/app/components/ui/SoundPressable';
import { useLanguage } from '@/app/context/LanguageContext';
import { useMusic } from '@/app/context/MusicContext';
import { LOCALES, type Locale } from '@/app/i18n';

type Props = {
  onBack: () => void;
};

export default function SettingsScreen({ onBack }: Props) {
  const { t, locale, setLocale } = useLanguage();
  const { musicEnabled, setMusicEnabled } = useMusic();
  const [pickerVisible, setPickerVisible] = useState(false);

  const currentLabel = LOCALES.find((l) => l.value === locale)?.label ?? locale;

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setPickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings.title')}</Text>
      <Text style={styles.label}>{t('settings.language')}</Text>

      {Platform.OS === 'web' ? (
        createElement(
          'select',
          {
            value: locale,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
              handleLocaleChange(e.target.value as Locale),
            style: {
              padding: '12px 16px',
              borderRadius: 8,
              backgroundColor: '#e0e0e0',
              fontSize: 18,
              color: '#333',
              marginBottom: 32,
              minWidth: 200,
              border: '1px solid #ccc',
              cursor: 'pointer',
            },
          },
          LOCALES.map(({ value, label }) =>
            createElement('option', { key: value, value }, label)
          )
        )
      ) : (
        <>
          <SoundPressable
            style={styles.selectButton}
            onPress={() => setPickerVisible(true)}
          >
            <Text style={styles.selectButtonText}>{currentLabel}</Text>
          </SoundPressable>
          <Modal
            visible={pickerVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setPickerVisible(false)}
          >
            <SoundPressable style={styles.modalOverlay} onPress={() => setPickerVisible(false)}>
              <SoundPressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                <ScrollView style={styles.modalScroll}>
                  {LOCALES.map(({ value, label }) => (
                    <SoundPressable
                      key={value}
                      style={[styles.modalOption, locale === value && styles.modalOptionActive]}
                      onPress={() => handleLocaleChange(value)}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          locale === value && styles.modalOptionTextActive,
                        ]}
                      >
                        {label}
                      </Text>
                    </SoundPressable>
                  ))}
                </ScrollView>
              </SoundPressable>
            </SoundPressable>
          </Modal>
        </>
      )}

      <Text style={styles.label}>{t('settings.music')}</Text>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>
          {musicEnabled ? t('settings.musicOn') : t('settings.musicOff')}
        </Text>
        <Switch
          value={musicEnabled}
          onValueChange={(v) => setMusicEnabled(v)}
          trackColor={{ false: '#ccc', true: '#7eb8c2' }}
          thumbColor="#fff"
        />
      </View>

      <SoundPressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>{t('settings.back')}</Text>
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
    fontSize: 28,
    marginBottom: 24,
    color: '#1a1a1a',
  },
  label: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    maxWidth: 280,
  },
  toggleLabel: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#333',
  },
  select: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    fontSize: 18,
    color: '#333',
    marginBottom: 32,
    minWidth: 200,
  },
  selectButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 32,
    minWidth: 200,
  },
  selectButtonText: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '80%',
    width: '100%',
    maxWidth: 320,
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionActive: {
    backgroundColor: '#e8f4f6',
  },
  modalOptionText: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#333',
  },
  modalOptionTextActive: {
    color: '#2e5560',
    fontWeight: 'bold',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#2e5560',
  },
  backButtonText: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#fff',
  },
});

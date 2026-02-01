import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  useWindowDimensions,
} from 'react-native';
import SoundPressable from '@/app/components/ui/SoundPressable';
import { useLanguage } from '@/app/context/LanguageContext';
import { getCivIdsSortedByName, getCivIconUri, getCivNameById } from '@/app/utils/helpers';
import MainData from '@/app/gameData';
import storage from '@/app/utils/storage';
import { STORAGE_KEYS } from '@/app/config/storageKeys';

const CIV_ICON_SIZE = 40;
const CIV_COLS = 4;

type Props = {
  onSave: (name: string, civId: string) => void;
  onBack: () => void;
};

function getDefaultCivId(): string {
  const civIds = Object.keys(MainData.data.civ_names || {});
  return civIds.length > 0 ? civIds[0] : 'Britons';
}

export default function ProfileEditScreen({ onSave, onBack }: Props) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [civId, setCivId] = useState<string>(getDefaultCivId);
  const { width } = useWindowDimensions();

  const civIds = useMemo(() => getCivIdsSortedByName(), []);

  useEffect(() => {
    storage.getItem(STORAGE_KEYS.multiplayerName).then((savedName) => {
      if (savedName) setName(savedName);
    });
    Promise.all([
      storage.getItem(STORAGE_KEYS.multiplayerCiv),
      storage.getItem(STORAGE_KEYS.multiplayerCountry),
    ]).then(([savedCiv, savedCountry]) => {
      const ids = getCivIdsSortedByName();
      const validCiv = savedCiv && ids.includes(savedCiv);
      const legacyAsCiv = savedCountry && ids.includes(savedCountry);
      if (validCiv) setCivId(savedCiv);
      else if (legacyAsCiv) setCivId(savedCountry);
      else if (ids.length > 0) setCivId((prev) => (ids.includes(prev) ? prev : ids[0]));
    });
  }, []);

  const gap = 8;
  const itemWidth = (width - 24 * 2 - gap * (CIV_COLS - 1)) / CIV_COLS;

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed, civId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profileEdit.title')}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={t('multiplayer.enterName')}
        placeholderTextColor="#888"
        maxLength={24}
        autoCorrect={false}
      />
      <Text style={styles.label}>{t('multiplayer.selectCivilization')}</Text>
      <FlatList
        data={civIds}
        keyExtractor={(item) => item}
        numColumns={CIV_COLS}
        contentContainerStyle={[styles.civList, { gap }]}
        columnWrapperStyle={{ gap }}
        renderItem={({ item }) => {
          const selected = civId === item;
          return (
            <SoundPressable
              style={[
                styles.civItem,
                { width: itemWidth },
                selected && styles.civItemSelected,
              ]}
              onPress={() => setCivId(item)}
            >
              <Image
                source={{ uri: getCivIconUri(item) }}
                style={[styles.civIcon, { width: CIV_ICON_SIZE, height: CIV_ICON_SIZE }]}
                resizeMode="contain"
              />
              <Text style={styles.civName} numberOfLines={2}>
                {getCivNameById(item)}
              </Text>
            </SoundPressable>
          );
        }}
      />
      <View style={styles.buttons}>
        <SoundPressable style={[styles.button, styles.buttonPrimary]} onPress={handleSave}>
          <Text style={styles.buttonText}>{t('profileEdit.save')}</Text>
        </SoundPressable>
        <SoundPressable style={[styles.button, styles.buttonSecondary]} onPress={onBack}>
          <Text style={styles.buttonTextSecondary}>{t('profileEdit.back')}</Text>
        </SoundPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontFamily: 'Balthazar',
    fontSize: 22,
    marginBottom: 12,
    color: '#1a1a1a',
  },
  input: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#2e5560',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    color: '#1a1a1a',
  },
  label: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    marginBottom: 12,
    color: '#1a1a1a',
  },
  civList: {
    paddingBottom: 20,
    maxHeight: 320,
  },
  civItem: {
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  civItemSelected: {
    borderColor: '#2e5560',
  },
  civIcon: {
    borderRadius: 6,
    marginBottom: 4,
  },
  civName: {
    fontFamily: 'Balthazar',
    fontSize: 12,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  buttons: {
    gap: 12,
    marginTop: 'auto',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#2e5560',
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

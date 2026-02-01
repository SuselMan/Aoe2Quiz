import React, { useState, useEffect } from 'react';
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
import { FLAG_CODES, type FlagCode } from '@/app/const/flagCodes';
import storage from '@/app/utils/storage';
import { STORAGE_KEYS } from '@/app/config/storageKeys';

const FLAG_SIZE = 40;
const FLAG_COLS = 6;

function getFlagUri(code: string): string {
  const two = code.split('-')[0].slice(0, 2);
  return `https://flagcdn.com/w80/${two}.png`;
}

type Props = {
  onFindGame: (name: string, countryCode: string) => void;
  onBack: () => void;
};

export default function MultiplayerEntryScreen({ onFindGame, onBack }: Props) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState<FlagCode>('ru');
  const { width } = useWindowDimensions();

  useEffect(() => {
    storage.getItem(STORAGE_KEYS.multiplayerName).then((savedName) => {
      if (savedName) setName(savedName);
    });
    storage.getItem(STORAGE_KEYS.multiplayerCountry).then((savedCountry) => {
      if (savedCountry && FLAG_CODES.includes(savedCountry as FlagCode)) setCountryCode(savedCountry as FlagCode);
    });
  }, []);
  const gap = 8;
  const itemSize = (width - 24 * 2 - gap * (FLAG_COLS - 1)) / FLAG_COLS;

  const handleFindGame = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onFindGame(trimmed, countryCode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('multiplayer.enterName')}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={t('multiplayer.enterName')}
        placeholderTextColor="#888"
        maxLength={24}
        autoCorrect={false}
      />
      <Text style={styles.label}>{t('multiplayer.selectCountry')}</Text>
      <FlatList
        data={FLAG_CODES}
        keyExtractor={(item) => item}
        numColumns={FLAG_COLS}
        contentContainerStyle={[styles.flagList, { gap }]}
        columnWrapperStyle={{ gap }}
        renderItem={({ item }) => {
          const selected = countryCode === item;
          return (
            <SoundPressable
              style={[
                styles.flagItem,
                { width: itemSize, height: itemSize },
                selected && styles.flagItemSelected,
              ]}
              onPress={() => setCountryCode(item)}
            >
              <Image
                source={{ uri: getFlagUri(item) }}
                style={[styles.flagImage, { width: itemSize - 8, height: itemSize - 8 }]}
                resizeMode="cover"
              />
            </SoundPressable>
          );
        }}
      />
      <View style={styles.buttons}>
        <SoundPressable style={[styles.button, styles.buttonPrimary]} onPress={handleFindGame}>
          <Text style={styles.buttonText}>{t('multiplayer.findGame')}</Text>
        </SoundPressable>
        <SoundPressable style={[styles.button, styles.buttonSecondary]} onPress={onBack}>
          <Text style={styles.buttonTextSecondary}>{t('multiplayer.back')}</Text>
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
  flagList: {
    paddingBottom: 20,
    maxHeight: 280,
  },
  flagItem: {
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  flagItemSelected: {
    borderColor: '#2e5560',
  },
  flagImage: {
    borderRadius: 6,
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

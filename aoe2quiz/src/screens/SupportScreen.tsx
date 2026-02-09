import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  Linking,
  Platform,
  BackHandler,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import SoundPressable from '@/src/components/ui/SoundPressable';
import { useLanguage } from '@/src/context/LanguageContext';

const BTC_ADDRESS = 'bc1qu0shj4wlpscrmys5jp90srmgacqtm660sa2gda';
const ETH_ADDRESS = '0xE73Ae0144c289C2bE01ee411B5cdd80f30481821';
const USDT_TRON_ADDRESS = 'TLv2X3TXJ8cs9KVSozMRynX91a1tyj2b3x';
const BOOSTY_URL = 'https://boosty.to/scione';
const PATREON_URL =
  'https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbUhydEFEOXY5TGRsZmpoZmtJdEFCRDUwNnI4Z3xBQ3Jtc0tuQnd1VjIyMHBlUEJNWVVnSXc4RENtYWFwS2VFWGlBemJTSnkzcVc5aEJHS2xwUDVxS0w4eTY1Y1VlSTNHSElTUzBqMTRKTzNVRE5yWnVXYm1KV1M4SFVJZnI3V2xFZGR3VG9JYUxYQnppeVZUS3Iyaw&q=https%3A%2F%2Fwww.patreon.com%2FSciOne&v=sCze6EXfK9k';

type QrAsset = 'btc' | 'eth' | 'usdtEth' | 'usdtTron' | null;

const QR_IMAGES: Record<NonNullable<QrAsset>, number> = {
  btc: require('../../assets/images/btc-qr.png'),
  eth: require('../../assets/images/eth-qr.png'),
  usdtEth: require('../../assets/images/usdt-eth-qr.png'),
  usdtTron: require('../../assets/images/usdt-tron-qr.png'),
};

type Props = {
  onBack: () => void;
};

export default function SupportScreen({ onBack }: Props) {
  const { t } = useLanguage();
  const [qrModal, setQrModal] = useState<QrAsset>(null);

  const copyAddress = async (address: string) => {
    await Clipboard.setStringAsync(address);
  };

  const openUrl = (url: string) => {
    Linking.openURL(url);
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (qrModal !== null) {
        setQrModal(null);
        return true;
      }
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack, qrModal]);

  const cryptoRow = (
    label: string,
    address: string,
    qrKey: NonNullable<QrAsset>
  ) => (
    <View key={qrKey} style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.address} numberOfLines={2} selectable>
        {address}
      </Text>
      <View style={styles.rowButtons}>
        <SoundPressable
          style={styles.smallButton}
          onPress={() => copyAddress(address)}
        >
          <Text style={styles.smallButtonText}>{t('support.copy')}</Text>
        </SoundPressable>
        <SoundPressable
          style={[styles.smallButton, styles.smallButtonSecondary]}
          onPress={() => setQrModal(qrKey)}
        >
          <Text style={styles.smallButtonTextSecondary}>{t('support.showQr')}</Text>
        </SoundPressable>
      </View>
    </View>
  );

  const linkRow = (label: string, url: string) => (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <SoundPressable
        style={styles.linkButton}
        onPress={() => openUrl(url)}
      >
        <Text style={styles.linkButtonText}>{label}</Text>
      </SoundPressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('support.title')}</Text>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {cryptoRow(t('support.bitcoin'), BTC_ADDRESS, 'btc')}
        {cryptoRow(t('support.eth'), ETH_ADDRESS, 'eth')}
        {cryptoRow(t('support.usdtEth'), ETH_ADDRESS, 'usdtEth')}
        {cryptoRow(t('support.usdtTron'), USDT_TRON_ADDRESS, 'usdtTron')}
        {linkRow(t('support.boosty'), BOOSTY_URL)}
        {linkRow(t('support.patreon'), PATREON_URL)}
      </ScrollView>

      <SoundPressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>{t('support.back')}</Text>
      </SoundPressable>

      <Modal
        visible={qrModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setQrModal(null)}
      >
        <SoundPressable
          style={styles.modalOverlay}
          onPress={() => setQrModal(null)}
        >
          <SoundPressable
            style={styles.modalContent}
            onPress={(e) => (Platform.OS === 'web' ? e.stopPropagation() : null)}
          >
            {qrModal && (
              <Image
                source={QR_IMAGES[qrModal]}
                style={styles.qrImage}
                resizeMode="contain"
              />
            )}
            <SoundPressable
              style={styles.modalCloseButton}
              onPress={() => setQrModal(null)}
            >
              <Text style={styles.modalCloseText}>{t('support.back')}</Text>
            </SoundPressable>
          </SoundPressable>
        </SoundPressable>
      </Modal>
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
    marginBottom: 20,
    color: '#1a1a1a',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  row: {
    marginBottom: 24,
  },
  rowLabel: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  address: {
    fontFamily: 'Balthazar',
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2e5560',
  },
  smallButtonSecondary: {
    backgroundColor: '#5a8a94',
  },
  smallButtonText: {
    fontFamily: 'Balthazar',
    fontSize: 16,
    color: '#fff',
  },
  smallButtonTextSecondary: {
    fontFamily: 'Balthazar',
    fontSize: 16,
    color: '#fff',
  },
  linkButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#2e5560',
    alignSelf: 'flex-start',
  },
  linkButtonText: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#fff',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    maxWidth: 320,
  },
  qrImage: {
    width: 240,
    height: 240,
    marginBottom: 16,
  },
  modalCloseButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#2e5560',
  },
  modalCloseText: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#fff',
  },
});

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, BackHandler, useWindowDimensions } from 'react-native';
import SoundPressable from '@/app/components/ui/SoundPressable';
import { useLanguage } from '@/app/context/LanguageContext';
import { fetchLeaderboard, type LeaderboardEntry } from '@/app/services/leaderboard';
import { getOrCreateDeviceId } from '@/app/utils/deviceId';
import { getCivIconUri } from '@/app/utils/helpers';

type Props = {
  onBack: () => void;
};

const HORIZONTAL_PADDING = 24;

export default function LeaderboardScreen({ onBack }: Props) {
  const { t } = useLanguage();
  const { width: windowWidth } = useWindowDimensions();
  const contentWidth = windowWidth - HORIZONTAL_PADDING * 2;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [top, setTop] = useState<LeaderboardEntry[]>([]);
  const [me, setMe] = useState<LeaderboardEntry | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const deviceId = await getOrCreateDeviceId();
      const data = await fetchLeaderboard(deviceId);
      setTop(data.top);
      setMe(data.me);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('multiplayer.connectionError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

  const isMe = (entry: LeaderboardEntry) =>
    me != null && entry.rank === me.rank && entry.name === me.name;

  return (
    <View style={[styles.container, { width: windowWidth }]}>
      <Text style={styles.title}>{t('leaderboard.title')}</Text>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2e5560" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={[styles.listContent, { width: contentWidth }]}>
          {top.map((entry) => (
            <View
              key={`${entry.rank}-${entry.name}`}
              style={[styles.row, isMe(entry) && styles.rowMe, { width: contentWidth }]}
            >
              <Text style={styles.rank}>{entry.rank}</Text>
              <Image
                source={{ uri: getCivIconUri(entry.civId) }}
                style={styles.civIcon}
                resizeMode="contain"
              />
              <Text style={styles.name} numberOfLines={1}>
                {entry.name}
              </Text>
              <Text style={styles.rating}>{entry.rating}</Text>
            </View>
          ))}
          {me != null && me.rank > 40 && (
            <View style={[styles.meBlock, { width: contentWidth }]}>
              <Text style={styles.meLabel}>{t('leaderboard.yourPosition')}</Text>
              <View style={[styles.row, styles.rowMe, { width: contentWidth }]}>
                <Text style={styles.rank}>{me.rank}</Text>
                <Image
                  source={{ uri: getCivIconUri(me.civId) }}
                  style={styles.civIcon}
                  resizeMode="contain"
                />
                <Text style={styles.name} numberOfLines={1}>
                  {me.name}
                </Text>
                <Text style={styles.rating}>{me.rating}</Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}
      <View style={styles.backButtonWrap}>
        <SoundPressable style={[styles.backButton, { maxWidth: contentWidth }]} onPress={onBack}>
          <Text style={styles.backButtonText} numberOfLines={1}>{t('leaderboard.back')}</Text>
        </SoundPressable>
      </View>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Balthazar',
    fontSize: 16,
    color: '#c00',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  rowMe: {
    backgroundColor: 'rgba(46, 85, 96, 0.2)',
    borderWidth: 1,
    borderColor: '#2e5560',
  },
  rank: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    width: 32,
    color: '#1a1a1a',
  },
  civIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontFamily: 'Balthazar',
    fontSize: 18,
    color: '#1a1a1a',
    minWidth: 0,
  },
  rating: {
    fontFamily: 'Balthazar',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e5560',
    marginLeft: 12,
  },
  meBlock: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  meLabel: {
    fontFamily: 'Balthazar',
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  backButtonWrap: {
    width: '100%',
    marginTop: 16,
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

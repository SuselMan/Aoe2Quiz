import uuid from 'react-native-uuid';
import storage from '@/app/utils/storage';
import { STORAGE_KEYS } from '@/app/config/storageKeys';

let cached: string | null = null;

export async function getOrCreateDeviceId(): Promise<string> {
  if (cached) return cached;
  const existing = await storage.getItem(STORAGE_KEYS.deviceId);
  if (existing) {
    cached = existing;
    return existing;
  }
  const id = uuid.v4() as string;
  await storage.setItem(STORAGE_KEYS.deviceId, id);
  cached = id;
  return id;
}

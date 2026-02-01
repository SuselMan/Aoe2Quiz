import { MULTIPLAYER_SERVER_URL } from '@/app/config/api';

export type LeaderboardEntry = {
  rank: number;
  name: string;
  countryCode: string;
  rating: number;
};

export type LeaderboardResponse = {
  top: LeaderboardEntry[];
  me: LeaderboardEntry | null;
};

export async function fetchLeaderboard(deviceId?: string | null): Promise<LeaderboardResponse> {
  const url = new URL('/api/leaderboard', MULTIPLAYER_SERVER_URL);
  if (deviceId) url.searchParams.set('deviceId', deviceId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json() as Promise<LeaderboardResponse>;
}

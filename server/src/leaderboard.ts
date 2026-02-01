import type { IncomingMessage, ServerResponse } from 'http';
import { Player } from './models/Player';

const TOP_LIMIT = 40;

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

export async function getLeaderboard(deviceId?: string | null): Promise<LeaderboardResponse> {
  const topPlayers = await Player.find()
    .sort({ rating: -1 })
    .limit(TOP_LIMIT)
    .lean();

  const top: LeaderboardEntry[] = topPlayers.map((p, i) => ({
    rank: i + 1,
    name: p.name,
    countryCode: p.countryCode,
    rating: p.rating,
  }));

  if (!deviceId) {
    return { top, me: null };
  }

  const me = await Player.findOne({ deviceId }).lean();
  if (!me) {
    return { top, me: null };
  }

  const rank =
    (await Player.countDocuments({ rating: { $gt: me.rating } })) + 1;

  const meEntry: LeaderboardEntry = {
    rank,
    name: me.name,
    countryCode: me.countryCode,
    rating: me.rating,
  };

  return { top, me: meEntry };
}

export function handleLeaderboardRequest(
  req: IncomingMessage,
  res: ServerResponse
): boolean {
  if (req.method !== 'GET' || !req.url?.startsWith('/api/leaderboard')) {
    return false;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const deviceId = url.searchParams.get('deviceId') ?? undefined;

  getLeaderboard(deviceId)
    .then((data) => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify(data));
    })
    .catch((err) => {
      console.error('[leaderboard]', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    });

  return true;
}

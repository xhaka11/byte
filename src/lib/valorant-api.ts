import { stripDiacritics } from "@/lib/normalize";
import { henrikConfig } from "@/config/api";

const headers = {
  "Authorization": henrikConfig.apiKey,
};

function buildUrl(path: string, params?: Record<string, string | number>) {
  const url = new URL(path, henrikConfig.baseUrl);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function henrikFetch<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const res = await fetch(buildUrl(path, params), { headers });
  if (!res.ok) throw new Error("Server Busy, try again later");
  return res.json();
}

// ─── Types ───────────────────────────────────────────

export interface MMRData {
  status: number;
  data: {
    account: { name: string; tag: string; puuid: string };
    current: {
      tier: { id: number; name: string };
      rr: number;
      last_change: number;
      elo: number;
    };
    peak: {
      tier: { id: number; name: string };
      rr: number;
      season: { id: string; short: string };
    } | null;
    seasonal: Array<{
      season: { id: string; short: string };
      wins: number;
      games: number;
      end_tier: { id: number; name: string };
      end_rr: number;
    }>;
  };
}

export interface MatchData {
  status: number;
  data: Array<{
    metadata: {
      match_id: string;
      map: { id: string; name: string };
      started_at: string;
      game_length_in_ms: number;
      queue: { id: string; name: string | null };
    };
    players: Array<{
      puuid: string;
      name: string;
      tag: string;
      agent: { id: string; name: string };
      stats: {
        score: number;
        kills: number;
        deaths: number;
        assists: number;
        headshots: number;
        bodyshots: number;
        legshots: number;
      };
      team_id: string;
    }>;
    teams: Array<{
      team_id: string;
      won: boolean;
      rounds: { won: number; lost: number };
    }>;
  }>;
}

// ─── API Functions ───────────────────────────────────

export async function getMMR() {
  const { name, tag, region, platform } = henrikConfig;
  return henrikFetch<MMRData>(`/valorant/v3/mmr/${region}/${platform}/${name}/${tag}`);
}

export async function getMatches(size = 10) {
  return getMatchesByName(henrikConfig.name, henrikConfig.tag, henrikConfig.region, henrikConfig.platform, size);
}

export async function getMatchesByName(name: string, tag: string, region: string, platform: string, size = 10) {
  return henrikFetch<MatchData>(`/valorant/v4/matches/${region}/${platform}/${name}/${tag}`, { size });
}

export async function getMMRByName(name: string, tag: string, region: string, platform: string) {
  return henrikFetch<MMRData>(`/valorant/v3/mmr/${region}/${platform}/${name}/${tag}`);
}

// ─── MatchCardData (for useMatches hook) ─────────────

export interface MatchCardData {
  map: string;
  result: "victory" | "defeat";
  score: string;
  kda: string;
  kd: string;
  hs: string;
  acs: string;
  agent: string;
  mode: string;
  date: string;
}

export async function fetchRecentMatches(count = 8): Promise<MatchCardData[]> {
  if (!henrikConfig.apiKey) return [];

  try {
    const res = await getMatches(count);
    if (res.status !== 200 || !res.data) return [];

    return res.data.map((match) => {
      const player = match.players.find(
        (p) => stripDiacritics(p.name).toLowerCase() === stripDiacritics(henrikConfig.name).toLowerCase() && stripDiacritics(p.tag).toLowerCase() === stripDiacritics(henrikConfig.tag).toLowerCase()
      );
      if (!player) return null;

      const team = match.teams.find((t) => t.team_id === player.team_id);
      const won = team?.won ?? false;
      const roundsWon = team?.rounds.won ?? 0;
      const roundsLost = team?.rounds.lost ?? 0;

      const totalShots = player.stats.headshots + player.stats.bodyshots + player.stats.legshots;
      const hsPercent = totalShots > 0 ? ((player.stats.headshots / totalShots) * 100).toFixed(0) : "0";
      const kdRatio = player.stats.deaths > 0 ? (player.stats.kills / player.stats.deaths).toFixed(2) : player.stats.kills.toFixed(2);
      const acs = Math.round(player.stats.score / Math.max(1, (match.metadata.game_length_in_ms / 60000)));

      const date = new Date(match.metadata.started_at);
      const dateStr = `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString("en", { month: "short" })}`;

      return {
        map: match.metadata.map.name,
        result: won ? "victory" : "defeat",
        score: `${roundsWon} - ${roundsLost}`,
        kda: `${player.stats.kills} / ${player.stats.deaths} / ${player.stats.assists}`,
        kd: kdRatio,
        hs: `${hsPercent}%`,
        acs: String(acs),
        agent: player.agent.name,
        mode: match.metadata.queue.name ?? "Unknown",
        date: dateStr,
      };
    }).filter(Boolean) as MatchCardData[];
  } catch {
    return [];
  }
}

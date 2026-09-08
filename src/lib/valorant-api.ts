import { apiConfig } from "@/config/api";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface HenrikMatch {
  metadata: {
    map: string;
    game_version: string;
    match_id: string;
    mode: string;
    mode_id: string;
    season_id: string;
    platform: string;
    shard: string;
    queue: string | null;
    is_ranked: boolean;
  };
  players: {
    all_players: HenrikPlayer[];
  };
  teams: {
    red: { has_won: boolean; rounds_won: number; rounds_lost: number };
    blue: { has_won: boolean; rounds_won: number; rounds_lost: number };
  };
}

export interface HenrikPlayer {
  puuid: string;
  name: string;
  tag: string;
  team: string;
  level: number;
  character: string;
  tier: number;
  stats: {
    score: number;
    kills: number;
    deaths: number;
    assists: number;
    bodyshots: number;
    headshots: number;
    legshots: number;
    damage_dealt: number;
    kills_near_enemy: number;
    grenade_damage: number;
    ability1_damage: number;
    ability2_damage: number;
    ult_damage: number;
  };
  assets: {
    card: { small: string; large: string; wide: string };
    agent: { small: string; full: string; bust: string; killfeed: string };
  };
  economy: {
    spent: { overall: number; average: number };
    loadout_value: { overall: number; average: number };
  };
  ability_casts: {
    grenade: number;
    ability1: number;
    ability2: number;
    ultimate: number;
  };
}

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

/* ------------------------------------------------------------------ */
/*  API Functions                                                      */
/* ------------------------------------------------------------------ */

/**
 * Fetch recent matches from Henrik.dev API
 * Docs: https://docs.henrikdev.xyz/valorant/api-reference/matchlist
 */
export async function fetchRecentMatches(
  size = 10,
): Promise<MatchCardData[]> {
  const { baseUrl, apiKey, player } = apiConfig;

  if (!apiKey) {
    console.warn("HENRIK_API_KEY not set — falling back to static data");
    return [];
  }

  const url = `${baseUrl}/valorant/v3/matches/${player.region}/${player.name}/${player.tag}?size=${size}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  const matches: HenrikMatch[] = json.data ?? [];

  return matches.map((match) => {
    const { name, tag } = apiConfig.player;
    const playerData = match.players.all_players.find(
      (p) => p.name.toLowerCase() === name.toLowerCase() && p.tag.toLowerCase() === tag.toLowerCase(),
    );

    if (!playerData) {
      throw new Error(`Player ${name}#${tag} not found in match ${match.metadata.match_id}`);
    }

    const { stats } = playerData;
    const kd = stats.deaths === 0 ? stats.kills.toFixed(2) : (stats.kills / stats.deaths).toFixed(2);
    const totalShots = stats.headshots + stats.bodyshots + stats.legshots;
    const hsPercent = totalShots === 0 ? 0 : Math.round((stats.headshots / totalShots) * 100);
    const acs = Math.round(stats.score / Math.max(1, match.metadata.mode === "Deathmatch" ? 1 : 12));

    const teamWins = playerData.team === "Red" ? match.teams.red.has_won : match.teams.blue.has_won;

    // Calculate date from match metadata (approximate)
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, "0")} ${now.toLocaleString("en-US", { month: "short" })}`;

    return {
      map: match.metadata.map,
      result: teamWins ? "victory" : "defeat",
      score: `${match.teams.red.rounds_won} - ${match.teams.blue.rounds_lost}`,
      kda: `${stats.kills} / ${stats.deaths} / ${stats.assists}`,
      kd,
      hs: `${hsPercent}%`,
      acs: String(acs),
      agent: playerData.character,
      mode: match.metadata.queue ?? match.metadata.mode,
      date: dateStr,
    } satisfies MatchCardData;
  });
}

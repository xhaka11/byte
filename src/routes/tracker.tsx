import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Search, Crosshair, Trophy, Activity, Shield, Swords, Target, Flame, ChevronDown, AlertCircle } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { getMMRByName, getMatchesByName, type MatchCardData } from "@/lib/valorant-api";

export const Route = createFileRoute("/tracker")({
  head: () => ({
    meta: [
      { title: "Byte - Game" },
      { name: "description", content: "Public Valorant player tracker — look up any player's rank, stats, and match history." },
      { property: "og:title", content: "Byte - Game" },
    ],
  }),
  component: TrackerPage,
});

// ─── Types ───────────────────────────────────

interface MMRResponse {
  status: number;
  data: {
    account: { name: string; tag: string };
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

interface MatchResponse {
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
        damage?: { dealt: number; received: number };
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

// ─── Rank Colors ───────────────────────────────

const RANK_COLORS: Record<number, string> = {
  3: "#cd7f32",
  4: "#cd7f32",
  5: "#e8d5b7",
  6: "#5ce1e6",
  7: "#5ce1e6",
  8: "#e84057",
  9: "#ff6b6b",
  10: "#ff4757",
  11: "#ffd700",
};

function RankIcon({ tierId, size = 48 }: { tierId: number; size?: number }) {
  const color = RANK_COLORS[tierId] ?? "#666";
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="none" stroke={color} strokeWidth="2.5" />
      <circle cx="24" cy="24" r="15" fill={color} opacity="0.2" />
      <circle cx="24" cy="24" r="15" fill="none" stroke={color} strokeWidth="1.5" />
      {tierId >= 8 && <polygon points="24,8 28,18 38,18 30,24 33,34 24,28 15,34 18,24 10,18 20,18" fill={color} opacity="0.6" />}
      {tierId >= 5 && tierId < 8 && (
        <>
          <rect x="18" y="14" width="12" height="3" rx="1" fill={color} opacity="0.5" />
          <rect x="20" y="20" width="8" height="3" rx="1" fill={color} opacity="0.4" />
          <rect x="18" y="26" width="12" height="3" rx="1" fill={color} opacity="0.3" />
        </>
      )}
      {tierId < 5 && (
        <>
          <circle cx="24" cy="24" r="6" fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx="24" cy="24" r="2" fill={color} />
        </>
      )}
    </svg>
  );
}

// ─── Stat Card ───────────────────────────────

function StatCard({ icon: Icon, label, value, color = "text-foreground" }: { icon: React.ElementType; label: string; value: string; color?: string }) {
  return (
    <div className="panel grain p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="label-hud">{label}</span>
      </div>
      <div className={`text-display mt-1 text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

// ─── Region Options ────────────────────────────

const REGIONS = [
  { value: "ap", label: "Asia Pacific" },
  { value: "eu", label: "Europe" },
  { value: "na", label: "North America" },
  { value: "sa", label: "South America" },
  { value: "sea", label: "Southeast Asia" },
] as const;

// ─── Main Page ────────────────────────────────

function TrackerPage() {
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [region, setRegion] = useState("ap");

  const [searched, setSearched] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchTag, setSearchTag] = useState("");

  const [mmr, setMmr] = useState<MMRResponse | null>(null);
  const [matches, setMatches] = useState<MatchResponse["data"]>([]);
  const [matchCards, setMatchCards] = useState<MatchCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = useCallback(() => {
    const n = name.trim();
    const t = tag.trim();
    if (!n || !t) return;
    setSearched(true);
    setSearchName(n);
    setSearchTag(t);
    setLoading(true);
    setError(null);
    setNotFound(false);
    setMmr(null);
    setMatches([]);
    setMatchCards([]);

    (async () => {
      try {
        const [mmrRes, matchRes] = await Promise.all([
          getMMRByName(n, t, region, "pc"),
          getMatchesByName(n, t, region, "pc", 12),
        ]);

        if (mmrRes.status === 404 || matchRes.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        if (mmrRes.status === 200 && mmrRes.data) setMmr(mmrRes);
        if (matchRes.status === 200) {
          const data = matchRes.data ?? [];
          setMatches(data);

          const cards: MatchCardData[] = data.map((m) => {
            const player = m.players.find((p) => p.name.toLowerCase() === n.toLowerCase() && p.tag.toLowerCase() === t.toLowerCase());
            if (!player) return null;
            const team = m.teams.find((tm) => tm.team_id === player.team_id);
            const won = team?.won ?? false;
            const roundsWon = team?.rounds.won ?? 0;
            const roundsLost = team?.rounds.lost ?? 0;
            const totalShots = player.stats.headshots + player.stats.bodyshots + player.stats.legshots;
            const hsPercent = totalShots > 0 ? ((player.stats.headshots / totalShots) * 100).toFixed(0) : "0";
            const kdRatio = player.stats.deaths > 0 ? (player.stats.kills / player.stats.deaths).toFixed(2) : player.stats.kills.toFixed(2);
            const acs = Math.round(player.stats.score / Math.max(1, m.metadata.game_length_in_ms / 60000));
            const date = new Date(m.metadata.started_at);
            const dateStr = `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString("en", { month: "short" })}`;
            return {
              map: m.metadata.map.name,
              result: won ? "victory" : "defeat",
              score: `${roundsWon} - ${roundsLost}`,
              kda: `${player.stats.kills} / ${player.stats.deaths} / ${player.stats.assists}`,
              kd: kdRatio,
              hs: `${hsPercent}%`,
              acs: String(acs),
              agent: player.agent.name,
              mode: m.metadata.queue.name ?? "Unknown",
              date: dateStr,
            };
          }).filter(Boolean) as MatchCardData[];
          setMatchCards(cards);
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [name, tag, region]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  }, [handleSearch]);

  // Calculate stats from matches
  const playerMatches = matches.map((m) => {
    const player = m.players.find((p) => p.name.toLowerCase() === searchName.toLowerCase() && p.tag.toLowerCase() === searchTag.toLowerCase());
    if (!player) return null;
    const team = m.teams.find((t) => t.team_id === player.team_id);
    return { ...m, player, won: team?.won ?? false };
  }).filter(Boolean) as Array<{
    metadata: MatchResponse["data"][0]["metadata"];
    player: MatchResponse["data"][0]["players"][0];
    won: boolean;
    teams: MatchResponse["data"][0]["teams"];
  }>;

  const totalGames = playerMatches.length;
  const wins = playerMatches.filter((m) => m.won).length;
  const losses = totalGames - wins;
  const totalKills = playerMatches.reduce((s, m) => s + m.player.stats.kills, 0);
  const totalDeaths = playerMatches.reduce((s, m) => s + m.player.stats.deaths, 0);
  const totalAssists = playerMatches.reduce((s, m) => s + m.player.stats.assists, 0);
  const totalHS = playerMatches.reduce((s, m) => {
    const t = m.player.stats.headshots + m.player.stats.bodyshots + m.player.stats.legshots;
    return s + (t > 0 ? m.player.stats.headshots / t : 0);
  }, 0);
  const totalDamage = playerMatches.reduce((s, m) => s + (m.player.stats.damage?.dealt ?? 0), 0);
  const totalScore = playerMatches.reduce((s, m) => s + m.player.stats.score, 0);

  const kd = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills.toFixed(2);
  const hsPercent = totalGames > 0 ? ((totalHS / totalGames) * 100).toFixed(1) : "0";
  const avgACS = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
  const avgDamage = totalGames > 0 ? Math.round(totalDamage / totalGames) : 0;
  const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : "0";

  const agentMap = new Map<string, { name: string; games: number; wins: number; kills: number; deaths: number; assists: number }>();
  for (const m of playerMatches) {
    const a = m.player.agent.name;
    const existing = agentMap.get(a) ?? { name: a, games: 0, wins: 0, kills: 0, deaths: 0, assists: 0 };
    existing.games++;
    if (m.won) existing.wins++;
    existing.kills += m.player.stats.kills;
    existing.deaths += m.player.stats.deaths;
    existing.assists += m.player.stats.assists;
    agentMap.set(a, existing);
  }
  const agentStats = [...agentMap.values()].sort((a, b) => b.games - a.games);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      {/* Header */}
      <Reveal>
        <div className="mb-8 text-center">
          <span className="label-hud text-primary">Player Tracker</span>
          <h1 className="text-display mt-3 text-4xl font-extrabold sm:text-5xl">Look Up Any Player</h1>
          <p className="mx-auto mt-2 max-w-lg text-xs text-muted-foreground">
            Enter a Riot ID to check rank, match history, agent performance, and season history.
          </p>
        </div>
      </Reveal>

      {/* Search Form */}
      <Reveal delay={0.05}>
        <div className="mx-auto mb-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Riot Name"
            className="clip-tag flex-1 border border-border bg-background/60 px-4 py-3 text-sm font-medium tracking-wider text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
          />
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tag"
            maxLength={5}
            className="clip-tag w-full border border-border bg-background/60 px-4 py-3 text-center text-sm font-bold tracking-wider text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 sm:w-24"
          />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="clip-tag w-full cursor-pointer border border-border bg-background/60 px-4 py-3 text-sm font-medium tracking-wider text-foreground outline-none transition-colors focus:border-primary/60 sm:w-40"
          >
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading || !name.trim() || !tag.trim()}
            className="clip-tag flex items-center justify-center gap-2 border border-primary/70 bg-primary/10 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-glow disabled:opacity-40"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </Reveal>

      {/* Error */}
      {error && (
        <Reveal>
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm text-red-300">{error}</span>
          </div>
        </Reveal>
      )}

      {/* Not Found */}
      {notFound && (
        <Reveal>
          <div className="mb-6 flex flex-col items-center gap-3 rounded-lg border border-border bg-background/50 px-4 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Player not found. Check the Riot ID and region.</p>
          </div>
        </Reveal>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Looking up {name} #{tag}...</p>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && !error && !notFound && searched && mmr && (
        <>
          {/* Player Header */}
          <Reveal>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <RankIcon tierId={mmr.data.current.tier.id} size={64} />
                <div>
                  <div className="text-display text-3xl font-bold">{mmr.data.current.tier.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {mmr.data.current.rr} RR
                    {mmr.data.current.last_change !== 0 && (
                      <span className={mmr.data.current.last_change > 0 ? "ml-2 text-green-400" : "ml-2 text-red-400"}>
                        {mmr.data.current.last_change > 0 ? "+" : ""}{mmr.data.current.last_change}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="sm:ml-auto">
                <span className="label-hud text-primary">Tracker</span>
                <h2 className="text-display text-2xl font-bold">{mmr.data.account.name} #{mmr.data.account.tag}</h2>
              </div>
            </div>
          </Reveal>

          {/* Peak Rank */}
          {mmr.data.peak && (
            <Reveal delay={0.05}>
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-border/50 bg-background/50 px-4 py-3">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">Peak:</span>
                <span className="text-display font-bold">{mmr.data.peak.tier.name}</span>
                <span className="text-sm text-muted-foreground">{mmr.data.peak.rr} RR</span>
                <span className="text-xs text-muted-foreground">({mmr.data.peak.season.short})</span>
              </div>
            </Reveal>
          )}

          {/* Stats Grid */}
          <section className="mb-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Reveal delay={0.06}>
                <StatCard icon={Trophy} label="Win Rate" value={`${winRate}%`} color={Number(winRate) >= 50 ? "text-green-400" : "text-red-400"} />
              </Reveal>
              <Reveal delay={0.1}>
                <StatCard icon={Target} label="K/D" value={kd} />
              </Reveal>
              <Reveal delay={0.14}>
                <StatCard icon={Crosshair} label="Headshot %" value={`${hsPercent}%`} />
              </Reveal>
              <Reveal delay={0.18}>
                <StatCard icon={Activity} label="Avg ACS" value={String(avgACS)} />
              </Reveal>
              <Reveal delay={0.22}>
                <StatCard icon={Flame} label="Avg Damage" value={String(avgDamage)} />
              </Reveal>
              <Reveal delay={0.26}>
                <StatCard icon={Swords} label="Matches" value={`${wins}W ${losses}L`} />
              </Reveal>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
            {/* Match History */}
            <section>
              <h2 className="label-hud mb-4 text-primary">Recent Matches</h2>
              <div className="space-y-2">
                {playerMatches.map((m, i) => {
                  const p = m.player;
                  const totalShots = p.stats.headshots + p.stats.bodyshots + p.stats.legshots;
                  const hs = totalShots > 0 ? ((p.stats.headshots / totalShots) * 100).toFixed(0) : "0";
                  const gameKd = p.stats.deaths > 0 ? (p.stats.kills / p.stats.deaths).toFixed(2) : p.stats.kills.toFixed(2);
                  const team = m.teams.find((t) => t.team_id === p.team_id);
                  const rounds = team ? `${team.rounds.won} - ${team.rounds.lost}` : "? - ?";
                  const date = new Date(m.metadata.started_at);
                  const dateStr = `${date.getDate()} ${date.toLocaleString("en", { month: "short" })}`;
                  const duration = Math.round(m.metadata.game_length_in_ms / 60000);

                  return (
                    <Reveal key={m.metadata.match_id} delay={i * 0.04}>
                      <div className={`panel grain flex flex-col gap-3 p-4 transition-all hover:border-primary/30 sm:flex-row sm:items-center sm:gap-4 ${m.won ? "border-l-2 border-l-green-500" : "border-l-2 border-l-red-500"}`}>
                        <div className="flex items-center gap-3 sm:w-28">
                          <div className={`flex h-8 w-8 items-center justify-center rounded text-xs font-bold ${m.won ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                            {m.won ? "W" : "L"}
                          </div>
                          <div className="text-xs text-muted-foreground">{rounds}</div>
                        </div>
                        <div className="flex items-center gap-3 sm:w-40">
                          <div className="text-sm font-bold">{p.agent.name}</div>
                          <div className="text-xs text-muted-foreground">{m.metadata.map.name}</div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="font-bold">{p.stats.kills}</span>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-red-400">{p.stats.deaths}</span>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-muted-foreground">{p.stats.assists}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{gameKd} K/D</div>
                        </div>
                        <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
                          <span>{hs}% HS</span>
                          <span>{p.stats.score} ACS</span>
                        </div>
                        <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{m.metadata.queue.name ?? "Ranked"}</span>
                          <span>{duration}m</span>
                          <span>{dateStr}</span>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}

                {playerMatches.length === 0 && (
                  <div className="panel grain flex h-32 items-center justify-center">
                    <p className="text-sm text-muted-foreground">No matches found</p>
                  </div>
                )}
              </div>
            </section>

            {/* Sidebar */}
            <section>
              <h2 className="label-hud mb-4 text-primary">Agent Performance</h2>
              <div className="space-y-2">
                {agentStats.map((a, i) => {
                  const agentKd = a.deaths > 0 ? (a.kills / a.deaths).toFixed(2) : a.kills.toFixed(2);
                  const agentWR = a.games > 0 ? ((a.wins / a.games) * 100).toFixed(0) : "0";
                  return (
                    <Reveal key={a.name} delay={i * 0.05}>
                      <div className="panel grain p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-primary" />
                            <div>
                              <div className="text-display text-sm font-bold">{a.name}</div>
                              <div className="text-xs text-muted-foreground">{a.games} games</div>
                            </div>
                          </div>
                          <div className="text-right text-xs">
                            <div className="font-bold">{agentKd} K/D</div>
                            <div className={Number(agentWR) >= 50 ? "text-green-400" : "text-red-400"}>{agentWR}% WR</div>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              {mmr.data.seasonal && mmr.data.seasonal.length > 0 && (
                <>
                  <h2 className="label-hud mb-4 mt-8 text-primary">Season History</h2>
                  <div className="space-y-2">
                    {mmr.data.seasonal.slice(0, 4).map((s, i) => (
                      <Reveal key={s.season.id} delay={i * 0.05}>
                        <div className="panel grain p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-display text-sm font-bold">{s.season.short}</div>
                              <div className="text-xs text-muted-foreground">{s.wins}W / {s.games} games</div>
                            </div>
                            <div className="text-right text-sm">
                              <div className="font-bold">{s.end_tier.name}</div>
                              <div className="text-xs text-muted-foreground">{s.end_rr} RR</div>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        </>
      )}

      {/* Empty state after search */}
      {!loading && !error && !notFound && searched && !mmr && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-background/50 px-4 py-12 text-center">
          <Crosshair className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No data found for this player.</p>
        </div>
      )}

      {/* Initial hint */}
      {!searched && !loading && (
        <Reveal>
          <div className="mx-auto mt-4 max-w-md text-center">
            <p className="text-xs text-muted-foreground">
              Try searching for any Valorant player by their Riot ID.
            </p>
          </div>
        </Reveal>
      )}
    </div>
  );
}
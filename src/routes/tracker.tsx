import { createFileRoute } from "@tanstack/react-router";
import { Activity, BarChart3, Crosshair, Shield, Swords, Trophy, Target, Flame } from "lucide-react";
import { useState, useEffect } from "react";

import { Reveal } from "@/components/site/Reveal";
import { henrikConfig } from "@/config/api";

export const Route = createFileRoute("/tracker")({
  head: () => ({
    meta: [
      { title: "Byte - Game" },
      { name: "description", content: "Live Valorant tracker — rank, matches, stats." },
      { property: "og:title", content: "Byte - Game" },
    ],
  }),
  component: TrackerPage,
});

// ─── Types ───────────────────────────────────────────

interface MMRResponse {
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
        damage: { dealt: number; received: number };
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

// ─── Rank Icon ───────────────────────────────────────

const RANK_COLORS: Record<number, string> = {
  3: "#cd7f32",  // Bronze
  4: "#cd7f32",  // Silver
  5: "#e8d5b7",  // Gold
  6: "#5ce1e6",  // Platinum
  7: "#5ce1e6",  // Emerald
  8: "#e84057",  // Diamond
  9: "#ff6b6b",  // Ascendant
  10: "#ff4757", // Immortal
  11: "#ffd700", // Radiant
};

function RankIcon({ tierId, size = 48 }: { tierId: number; size?: number }) {
  const color = RANK_COLORS[tierId] ?? "#666";
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="none" stroke={color} strokeWidth="2.5" />
      <circle cx="24" cy="24" r="15" fill={color} opacity="0.2" />
      <circle cx="24" cy="24" r="15" fill="none" stroke={color} strokeWidth="1.5" />
      {tierId >= 8 && <polygon points="24,8 28,18 38,18 30,24 33,34 24,28 15,34 18,24 10,18 20,18" fill={color} opacity="0.6" />}
      {tierId < 8 && tierId >= 5 && (
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

// ─── Stat Card ───────────────────────────────────────

function StatCard({ icon: Icon, label, value, color = "text-primary" }: { icon: React.ElementType; label: string; value: string; color?: string }) {
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

// ─── Main Page ───────────────────────────────────────

function TrackerPage() {
  const [mmr, setMmr] = useState<MMRResponse | null>(null);
  const [matches, setMatches] = useState<MatchResponse["data"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!henrikConfig.apiKey) {
      setError("API key not configured");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const [mmrRes, matchRes] = await Promise.all([
          fetch(`/api/mmr`),
          fetch(`/api/matches?size=12`),
        ]);

        if (mmrRes.ok) setMmr(await mmrRes.json());
        if (matchRes.ok) setMatches((await matchRes.json()).data ?? []);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Calculate stats from matches
  const playerMatches = matches.map((m) => {
    const player = m.players.find(
      (p) => p.name.toLowerCase() === henrikConfig.name.toLowerCase(),
    );
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
  const totalDamage = playerMatches.reduce((s, m) => s + m.player.stats.damage.dealt, 0);

  const kd = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills.toFixed(2);
  const hsPercent = totalGames > 0 ? ((totalHS / totalGames) * 100).toFixed(1) : "0";
  const avgACS = totalGames > 0 ? Math.round(playerMatches.reduce((s, m) => s + m.player.stats.score, 0) / totalGames) : 0;
  const avgDamage = totalGames > 0 ? Math.round(totalDamage / totalGames) : 0;
  const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : "0";

  // Agent stats
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

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-6">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading tracker data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-6">
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      {/* Header */}
      <Reveal>
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center">
          {mmr && (
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
          )}
          <div className="sm:ml-auto">
            <span className="label-hud text-primary">Live Tracker</span>
            <h1 className="text-display text-2xl font-bold">{henrikConfig.name} #{henrikConfig.tag}</h1>
          </div>
        </div>
      </Reveal>

      {/* Peak Rank */}
      {mmr?.data.peak && (
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
            <StatCard icon={BarChart3} label="Avg ACS" value={String(avgACS)} />
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
                    {/* Result */}
                    <div className="flex items-center gap-3 sm:w-28">
                      <div className={`flex h-8 w-8 items-center justify-center rounded text-xs font-bold ${m.won ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {m.won ? "W" : "L"}
                      </div>
                      <div className="text-xs text-muted-foreground">{rounds}</div>
                    </div>

                    {/* Agent + Map */}
                    <div className="flex items-center gap-3 sm:w-40">
                      <div className="text-sm font-bold">{p.agent.name}</div>
                      <div className="text-xs text-muted-foreground">{m.metadata.map.name}</div>
                    </div>

                    {/* K/D/A */}
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

                    {/* HS + Score */}
                    <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
                      <span>{hs}% HS</span>
                      <span>{p.stats.score} ACS</span>
                    </div>

                    {/* Meta */}
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

        {/* Agent Stats Sidebar */}
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

          {/* Seasonal */}
          {mmr?.data.seasonal && mmr.data.seasonal.length > 0 && (
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
    </div>
  );
}

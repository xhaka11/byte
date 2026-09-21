import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AlertCircle } from "lucide-react";
import { MatchCard } from "@/components/site/MatchCard";
import { useMatches } from "@/hooks/useMatches";

export const Route = createFileRoute("/match-history")({
  head: () => ({
    meta: [
      { title: "Byte - Game" },
      {
        name: "description",
        content:
          "Recent Valorant matches for Byte with map, score, agent, K/D/A, headshot percentage and ACS, filterable by result.",
      },
      { property: "og:title", content: "Byte - Game" },
      { property: "og:description", content: "Filterable recent Valorant match results." },
    ],
  }),
  component: MatchHistoryPage,
});

const filters = ["All", "Victory", "Defeat"] as const;
type Filter = (typeof filters)[number];

function MatchHistoryPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const { matches: allMatches, isLoading, error } = useMatches(20);

  const matches = allMatches.filter((m) => {
    if (filter === "All") return true;
    return m.result === filter.toLowerCase();
  });

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-6">
      <header className="mb-10">
        <span className="label-hud text-primary">Performance Log</span>
        <h1 className="text-display mt-3 text-5xl font-extrabold sm:text-6xl">Match History</h1>
      </header>

      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading match history...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-4 w-4 text-primary" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="mb-8 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`clip-tag border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition-all ${
                  filter === f
                    ? "border-primary bg-primary/15 text-primary shadow-glow"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div key={filter} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((m, i) => (
              <div
                key={`${m.map}-${m.date}-${i}`}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "backwards" }}
              >
                <MatchCard match={m} detailed />
              </div>
            ))}
          </div>

          {matches.length === 0 && (
            <p className="py-16 text-center text-sm text-muted-foreground">No matches found.</p>
          )}
        </>
      )}
    </div>
  );
}
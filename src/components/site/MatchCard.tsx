import { Flame } from "lucide-react";

/** Generic match shape — works with both static config and live API data */
interface MatchLike {
  map: string;
  result: string;
  score: string;
  kda: string;
  kd: string;
  hs: string;
  acs: string;
  agent: string;
  mode: string;
  date: string;
}

export function MatchCard({ match, detailed = false }: { match: MatchLike; detailed?: boolean }) {
  const win = match.result === "victory";

  return (
    <article className="panel panel-hover group relative overflow-hidden p-4">
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: win ? "var(--victory)" : "var(--defeat)" }}
      />
      <div className="flex items-center gap-3">
        <span className="clip-tag grid h-9 w-9 shrink-0 place-items-center border border-primary/30 text-primary">
          <Flame className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div
            className="text-display text-xs font-bold tracking-[0.18em]"
            style={{ color: win ? "var(--victory)" : "var(--defeat)" }}
          >
            {win ? "Victory" : "Defeat"}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {match.map} · {match.agent} · {match.mode}
          </div>
        </div>
        <div className="text-display ml-auto shrink-0 text-xl font-bold">{match.score}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <div className="label-hud">K/D/A</div>
          <div className="text-display font-bold">{match.kda}</div>
        </div>
        <div>
          <div className="label-hud">K/D</div>
          <div className="text-display font-bold">{match.kd}</div>
        </div>
        {detailed && (
          <>
            <div>
              <div className="label-hud">HS %</div>
              <div className="text-display font-bold">{match.hs}</div>
            </div>
            <div>
              <div className="label-hud">ACS</div>
              <div className="text-display font-bold">{match.acs}</div>
            </div>
          </>
        )}
      </div>

      <div className="mt-3 text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground/70">
        {match.date}
      </div>
    </article>
  );
}

import { Crosshair, Flame, Percent, Swords, Target } from "lucide-react";

import { useInView } from "./Reveal";
import { playerConfig } from "@/config/player";

const stats = [
  { label: "Matches", value: playerConfig.stats.matches, Icon: Swords },
  { label: "Win Rate", value: `${playerConfig.stats.winRate}%`, Icon: Percent },
  { label: "K/D Ratio", value: playerConfig.stats.kd, Icon: Target },
  { label: "Headshot %", value: `${playerConfig.stats.headshot}%`, Icon: Crosshair },
  { label: "Most Played Agent", value: playerConfig.mainAgent, Icon: Flame },
];

export function StatsBar() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="panel grain grid grid-cols-2 gap-px overflow-hidden bg-border/40 sm:grid-cols-3 lg:grid-cols-5"
    >
      {stats.map(({ label, value, Icon }, i) => (
        <div
          key={label}
          style={{ transitionDelay: `${i * 0.07}s` }}
          className={`group flex items-center gap-3 bg-background/60 px-4 py-5 transition-all duration-700 hover:bg-primary/5 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span className="clip-tag grid h-10 w-10 shrink-0 place-items-center border border-primary/30 text-primary transition-all group-hover:border-primary group-hover:shadow-glow">
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="label-hud truncate">{label}</div>
            <div className="text-display truncate text-xl font-bold">{value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

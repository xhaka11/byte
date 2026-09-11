import { Crown, Globe, Timer } from "lucide-react";

import logoImg from "@/assets/logo.png";
import { playerConfig } from "@/config/player";

function RankBadge() {
  return (
    <span className="text-[#cd7f32]">
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
        <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="20" r="13" fill="currentColor" opacity="0.85" />
        <text x="20" y="25" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1a1412" fontFamily="sans-serif">III</text>
      </svg>
    </span>
  );
}

export function ProfileCard() {
  return (
    <div className="panel grain relative p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

      <div className="flex flex-col items-center sm:flex-row sm:items-start">
        <div className="relative mb-4 sm:mb-0 sm:mr-4">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
          <img
            src={logoImg}
            alt={playerConfig.handle}
            className="relative h-16 w-16 rounded-full border-2 border-primary/50 object-cover shadow-lg"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-display text-lg font-bold">{playerConfig.handle}</div>
          <div className="text-xs text-muted-foreground">{playerConfig.riotId}</div>

          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center gap-1.5">
              <Crown className="h-3 w-3 text-primary" />
              <span className="label-hud">Peak Rank</span>
            </div>
            <div className="text-display font-bold">{playerConfig.peakRank.name}</div>
            <div className="text-xs text-muted-foreground">{playerConfig.peakRank.detail}</div>
          </div>
        </div>
      </div>

      <div className="my-5 h-px bg-border" />

      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="label-hud flex items-center gap-1.5">
            <Globe className="h-3 w-3" /> Region
          </dt>
          <dd className="font-semibold">{playerConfig.region}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="label-hud flex items-center gap-1.5">
            <Timer className="h-3 w-3" /> Playtime
          </dt>
          <dd className="font-semibold">{playerConfig.playtime}</dd>
        </div>
      </dl>
    </div>
  );
}

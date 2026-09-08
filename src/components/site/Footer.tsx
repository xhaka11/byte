import { Music2 } from "lucide-react";

import { Emblem } from "./Emblem";
import { playerConfig } from "@/config/player";

function DiscordIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
    </svg>
  );
}

function TiktokIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 4.84 1.58V7.53a4.85 4.85 0 0 1-1-.84z" />
    </svg>
  );
}

const socials = [
  { key: "discord", label: "Discord", Icon: DiscordIcon },
  { key: "tiktok", label: "TikTok", Icon: TiktokIcon },
] as const;

export function Footer() {
  return (
    <footer className="grain relative mt-24 overflow-hidden border-t border-border/70">
      <div className="absolute inset-0 hud-grid opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <div className="relative mx-auto mb-8 h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-primary/15 blur-2xl animate-glow-pulse" />
          <div className="absolute inset-0 rounded-full border border-primary/25 animate-spin-slow" />
          <div className="absolute inset-0 grid place-items-center text-primary">
            <Emblem className="h-12 w-12" />
          </div>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="animate-drift absolute h-1 w-1 rounded-full bg-primary/70"
              style={{
                left: `${12 + i * 15}%`,
                top: "70%",
                animationDuration: `${9 + i * 2}s`,
                animationDelay: `${-i * 1.4}s`,
              }}
            />
          ))}
        </div>

        <h2 className="text-display text-3xl font-bold sm:text-4xl">
          Play. <span className="text-primary">Adapt.</span> Win.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          I don't play for rank. I play to improve.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {socials.map(({ key, label, Icon }) => {
            const href = playerConfig.socials[key as keyof typeof playerConfig.socials];
            return (
              <a
                key={key}
                href={href || undefined}
                target={href ? "_blank" : undefined}
                rel="noreferrer"
                aria-label={label}
                title={href ? label : `${label} — link not configured`}
                className={`clip-tag grid h-11 w-11 place-items-center border border-border transition-all hover:border-primary/70 hover:text-primary hover:shadow-glow ${
                  href ? "" : "opacity-45"
                }`}
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>

        <p className="mt-10 text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground/70">
          © {new Date().getFullYear()} {playerConfig.handle} — {playerConfig.name} · Defy The Limits
        </p>
      </div>
    </footer>
  );
}

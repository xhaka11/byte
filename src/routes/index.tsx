import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, User, Settings, Monitor, Swords, Heart } from "lucide-react";

import { Hero } from "@/components/site/Hero";
import { Reveal } from "@/components/site/Reveal";
import { playerConfig } from "@/config/player";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Byte - Game" },
      {
        name: "description",
        content:
          "Byte — Immortal Valorant player from Indonesia. Sensitivity, crosshair code, setup, stats and match history.",
      },
      { property: "og:title", content: "Byte - Game" },
    ],
  }),
  component: Home,
});

const pages = [
  {
    label: "Profile",
    desc: "Rank, agents, maps & playstyle",
    to: "/profile",
    Icon: User,
  },
  {
    label: "Settings",
    desc: "Sensitivity, crosshair & keybinds",
    to: "/settings",
    Icon: Settings,
  },
  {
    label: "Setup",
    desc: "Mouse, keyboard, monitor & PC",
    to: "/setup",
    Icon: Monitor,
  },
  {
    label: "Match History",
    desc: "Recent matches & stats",
    to: "/match-history",
    Icon: Swords,
  },
];

function Home() {
  return (
    <>
      <Hero />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pages.map(({ label, desc, to, Icon }, i) => (
            <Reveal key={to} delay={i * 0.08}>
              <Link
                to={to}
                className="panel panel-hover group grain flex items-center gap-4 p-5 transition-all hover:border-primary/50 hover:shadow-glow"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-display text-sm font-bold">{label}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            </Reveal>
          ))}
        </section>

        <section className="mt-20 flex flex-col items-center gap-4">
          <Link
            to="/support"
            className="clip-tag group inline-flex items-center gap-2 border border-primary/70 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-glow"
          >
            <Heart className="h-4 w-4 transition-transform group-hover:scale-110" />
            Support Me
          </Link>
          <p className="text-xs text-muted-foreground">
            {playerConfig.handle} — {playerConfig.region}
          </p>
        </section>
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import { SupportCard } from "@/components/site/SupportCard";
import { playerConfig } from "@/config/player";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Byte, Valorant Player from Indonesia" },
      {
        name: "description",
        content:
          "The story behind Byte: an Indonesian Valorant player who flexes across agents and focuses on fundamentals.",
      },
      { property: "og:title", content: "About — Byte" },
      { property: "og:description", content: "An Indonesian Valorant player who plays what the team needs." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-6">
      <header className="mb-12">
        <span className="label-hud text-primary">Who Am I</span>
        <h1 className="text-display mt-3 text-5xl font-extrabold sm:text-6xl">About</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Reveal>
          <div className="panel grain p-6 sm:p-8">
            <p className="text-lg text-foreground/90">
              I'm {playerConfig.name} — {playerConfig.handle} in game. {playerConfig.region}.{" "}
              {playerConfig.playstyle}
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              "{playerConfig.quote}" I usually play what the team needs — sometimes entry, sometimes
              support. I care more about crosshair placement and positioning than maining one agent.
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              Everything on this site is what I actually use. No sponsored fluff, no fake numbers.
              All powered by a Lenovo Legion 5 laptop.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <SupportCard />
        </Reveal>
      </div>
    </div>
  );
}

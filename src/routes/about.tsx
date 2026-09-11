import { createFileRoute } from "@tanstack/react-router";

import logoImg from "@/assets/logo.png";
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
      <header className="mb-12 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
        <div className="relative mb-6 sm:mb-0 sm:mr-6">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
          <img
            src={logoImg}
            alt="Byte"
            className="relative h-24 w-24 rounded-full border-2 border-primary/50 object-cover shadow-lg sm:h-28 sm:w-28"
          />
        </div>
        <div>
          <span className="label-hud text-primary">Who Am I</span>
          <h1 className="text-display mt-2 text-5xl font-extrabold sm:text-6xl">About</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {playerConfig.region} — {playerConfig.playstyle}
          </p>
        </div>
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

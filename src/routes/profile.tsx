import { createFileRoute } from "@tanstack/react-router";



import heroAgent from "@/assets/hero-agent.png";
import { ProfileCard } from "@/components/site/ProfileCard";
import { Reveal, SectionTitle } from "@/components/site/Reveal";
import { playerConfig } from "@/config/player";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Byte | Valorant Player" },
      {
        name: "description",
        content:
          "Full player profile for Byte: rank, peak rank, agents, maps, playstyle and career stats.",
      },
      { property: "og:title", content: "Profile — Byte" },
      {
        property: "og:description",
        content: "Rank, agents, maps, playstyle and career stats for Byte." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      <header className="mb-8">
        <span className="label-hud text-primary">Player Dossier</span>
        <h1 className="text-display mt-3 text-5xl font-extrabold sm:text-6xl">Profile</h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
          {playerConfig.name} — better known as {playerConfig.handle}. {playerConfig.playstyle}
        </p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left column: ProfileCard + Favorites */}
        <div className="flex flex-col gap-4 lg:w-[40%]">
          <Reveal>
            <ProfileCard />
          </Reveal>

          <Reveal delay={0.05}>
            <div className="panel grain p-5">
              <div className="label-hud text-primary mb-2">Favorite Agents</div>
              <div className="flex flex-wrap gap-2">
                {playerConfig.favoriteAgents.map((a) => (
                  <span
                    key={a}
                    className="clip-tag border border-primary/40 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="panel grain p-5">
              <div className="label-hud mb-2">Favorite Maps</div>
              <div className="flex flex-wrap gap-2">
                {playerConfig.favoriteMaps.map((m) => (
                  <span
                    key={m}
                    className="clip-tag border border-border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right column: Raze image */}
        <div className="lg:w-[60%]">
          <Reveal delay={0.15}>
            <div className="panel grain relative flex items-center justify-center overflow-hidden p-6 lg:h-full" style={{ minHeight: '420px' }}>
              <div className="absolute inset-0 hud-grid opacity-40" />
              <div className="absolute inset-x-10 bottom-0 top-8 bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--primary)_25%,transparent),transparent_65%)] blur-2xl" />
              <img
                src={heroAgent}
                alt="Raze agent showcase"
                loading="lazy"
                width={1024}
                height={1280}
                className="animate-float relative h-[400px] w-auto object-contain lg:h-full lg:max-h-[600px]"
              />

              <div className="absolute bottom-5 left-6">
                <div className="label-hud text-primary">Main Agent</div>
                <div className="text-display text-3xl font-bold">{playerConfig.mainAgent}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";

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
  const charRef = useRef<HTMLImageElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    let nx = 0;
    let ny = 0;
    const apply = () => {
      raf = 0;
      if (charRef.current) {
        charRef.current.style.transform = `translate3d(${-nx * 18}px, ${-ny * 12}px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${nx * 24}px, ${ny * 14}px, 0)`;
      }
    };
    const onMove = (e: MouseEvent) => {
      nx = (e.clientX / window.innerWidth) * 2 - 1;
      ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const sparks = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        left: 8 + ((i * 27) % 82),
        top: 12 + ((i * 39) % 76),
        size: 2 + (i % 3),
        duration: 8 + (i % 5) * 2.5,
        delay: -(i * 1.1),
        rotate: i * 30,
      })),
    [],
  );

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

        {/* Right column: Agent showcase */}
        <div className="lg:w-[60%]">
          <Reveal delay={0.15}>
            <div className="relative flex items-center justify-center overflow-hidden p-6 lg:h-full" style={{ minHeight: '420px' }}>
              <div ref={glowRef} className="pointer-events-none absolute inset-0 -z-10 transition-transform duration-300 ease-out">
                <div className="absolute right-[8%] top-8 h-[400px] w-[400px] rounded-full bg-primary/12 blur-[100px] animate-glow-pulse" />
              </div>

              <div className="absolute inset-x-8 bottom-8 top-10 -z-10 bg-[radial-gradient(circle_at_60%_40%,color-mix(in_oklab,var(--primary)_25%,transparent),transparent_65%)] blur-2xl" />

              {sparks.map((s, i) => (
                <span
                  key={i}
                  className="animate-drift absolute z-10 bg-primary/70"
                  style={{
                    left: `${s.left}%`,
                    top: `${s.top}%`,
                    width: s.size,
                    height: s.size,
                    animationDuration: `${s.duration}s`,
                    animationDelay: `${s.delay}s`,
                    rotate: `${s.rotate}deg`,
                  }}
                />
              ))}

              <img
                ref={charRef}
                src={heroAgent}
                alt="Agent showcase"
                loading="lazy"
                width={1024}
                height={1280}
                className="relative mx-auto w-full max-w-[420px] drop-shadow-[0_25px_60px_rgba(0,0,0,0.7)] transition-transform duration-500 ease-out lg:h-full lg:max-h-[600px] lg:w-auto lg:object-contain"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

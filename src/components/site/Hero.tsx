import { Link } from "@tanstack/react-router";
import { ArrowRight, MonitorPlay, Target } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import heroAgent from "@/assets/hero-agent.png";
import { ProfileCard } from "./ProfileCard";
import { playerConfig } from "@/config/player";

export function Hero() {
  const charRef = useRef<HTMLImageElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  /* Subtle mouse parallax, rAF-throttled. */
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
      Array.from({ length: 16 }, (_, i) => ({
        left: 6 + ((i * 29) % 86),
        top: 10 + ((i * 41) % 78),
        size: 2 + (i % 4),
        duration: 8 + (i % 5) * 2.5,
        delay: -(i * 1.1),
        rotate: i * 24,
      })),
    [],
  );

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      <div ref={glowRef} className="pointer-events-none absolute inset-0 -z-10 transition-transform duration-300 ease-out">
        <div className="absolute right-[8%] top-8 h-[560px] w-[560px] rounded-full bg-primary/12 blur-[120px] animate-glow-pulse" />
        <div className="absolute left-[-8%] top-40 h-[320px] w-[320px] rounded-full bg-ember/10 blur-[110px]" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        {/* Character: above text on mobile, right side on desktop */}
        <div className="relative order-1 lg:order-2">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="absolute inset-x-8 bottom-8 top-10 -z-10 bg-[radial-gradient(circle_at_60%_40%,color-mix(in_oklab,var(--primary)_30%,transparent),transparent_65%)] blur-2xl" />
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
              alt="Raze-inspired agent illustration in an explosive action pose"
              width={1024}
              height={1280}
              className="relative mx-auto w-full max-w-[420px] drop-shadow-[0_25px_60px_rgba(0,0,0,0.7)] transition-transform duration-500 ease-out"
            />

            <div className="absolute left-2 top-16 hidden items-center gap-2 sm:flex">
              <span className="h-px w-10 bg-primary/50" />
              <span className="label-hud text-primary/80">Ranked</span>
            </div>
            <div className="absolute bottom-16 right-2 hidden items-center gap-2 sm:flex">
              <span className="label-hud text-primary/80">Flex</span>
              <span className="h-px w-10 bg-primary/50" />
            </div>
          </div>
        </div>

        <div className="order-2 lg:order-1">
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 text-primary">
              <Target className="h-4 w-4" />
              <span className="label-hud text-primary">{playerConfig.label}</span>
              <span className="h-px w-10 bg-primary/60" />
            </div>

            <h1 className="text-display mt-4 text-6xl font-extrabold leading-[0.9] sm:text-7xl xl:text-8xl">
              {playerConfig.handle}
            </h1>
            <p className="text-display mt-2 text-2xl font-bold text-primary sm:text-3xl">
              {playerConfig.subtitle}
            </p>

            <p className="text-display mt-6 text-lg tracking-[0.12em] text-foreground/90">
              {playerConfig.tagline}
            </p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">"{playerConfig.quote}"</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/profile"
                className="clip-tag group inline-flex items-center gap-2 bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-glow hover:brightness-110 active:scale-[0.98]"
              >
                View Profile
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/setup"
                className="clip-tag group inline-flex items-center gap-2 border border-border px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] transition-all hover:-translate-y-0.5 hover:border-primary/70 hover:text-primary hover:shadow-glow active:scale-[0.98]"
              >
                My Setup
                <MonitorPlay className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-10 max-w-sm">
            <ProfileCard />
          </div>
        </div>
      </div>
    </section>
  );
}

import { useMemo } from "react";

/** Lightweight CSS-only ambient layer: grid, glow, drifting embers, scanlines. */
export function AmbientBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: (i * 37) % 100,
        top: 10 + ((i * 53) % 80),
        size: 2 + (i % 3),
        duration: 14 + (i % 7) * 3,
        delay: -(i * 1.7),
        square: i % 4 === 0,
      })),
    [],
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="hud-grid absolute inset-0 opacity-60" />
      <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/12 blur-[130px] animate-glow-pulse" />
      <div className="absolute bottom-[-10rem] right-[-6rem] h-[420px] w-[420px] rounded-full bg-ember/10 blur-[120px] animate-glow-pulse" />

      {/* tactical corner ticks */}
      <div className="absolute left-6 top-24 hidden h-40 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent lg:block" />
      <div className="absolute right-6 top-52 hidden h-56 w-px bg-gradient-to-b from-transparent via-primary/25 to-transparent lg:block" />

      {particles.map((p, i) => (
        <span
          key={i}
          className={`animate-drift absolute bg-primary/60 ${p.square ? "" : "rounded-full"}`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div className="scanlines absolute inset-0 opacity-40" />
    </div>
  );
}

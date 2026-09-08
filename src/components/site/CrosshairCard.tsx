import { Check, Copy, Crosshair } from "lucide-react";
import { useState } from "react";

import { playerConfig } from "@/config/player";

function parseCrosshair(code: string) {
  const parts = code.split(";");
  const map: Record<string, string> = {};
  for (let i = 0; i < parts.length - 1; i += 2) {
    map[parts[i]] = parts[i + 1];
  }
  return {
    dot: map["d"] === "1",
    innerT: parseInt(map["0t"] ?? "0", 10),
    innerL: parseInt(map["0l"] ?? "0", 10),
    innerO: parseInt(map["0o"] ?? "0", 10) / 10,
    outerT: parseInt(map["1t"] ?? "0", 10),
    outerL: parseInt(map["1l"] ?? "0", 10),
    outerO: parseInt(map["1o"] ?? "0", 10) / 10,
    color: parseInt(map["c"] ?? "1", 10),
    outline: map["o"] === "1",
  };
}

const COLORS = ["#00ffff", "#00ff00", "#ff0000", "#ff00ff", "#ffffff", "#00ffe7"];
const SCALE = 4;

export function CrosshairPreview({ className = "" }: { className?: string }) {
  const ch = parseCrosshair(playerConfig.crosshairCode);
  const color = COLORS[ch.color] ?? COLORS[0];

  return (
    <div
      className={`scanlines clip-tag relative grid place-items-center overflow-hidden border border-border bg-background/80 ${className}`}
    >
      <div className="absolute inset-0 hud-grid opacity-50" />
      <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-primary/50" />
      <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-primary/50" />
      <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-primary/50" />
      <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-primary/50" />

      <div className="relative h-10 w-10">
        {ch.dot && (
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: 3, height: 3, background: color, borderRadius: 1 }}
          />
        )}
        {ch.innerT > 0 && ch.innerL > 0 && ch.innerO > 0 && (
          <>
            <span className="absolute left-1/2 top-1/2 -translate-y-1/2" style={{ height: ch.innerT, width: ch.innerL * SCALE, background: color, opacity: ch.innerO, transform: `translateX(calc(-100% - ${ch.innerT}px))` }} />
            <span className="absolute left-1/2 top-1/2 -translate-y-1/2" style={{ height: ch.innerT, width: ch.innerL * SCALE, background: color, opacity: ch.innerO, transform: `translateX(${ch.innerT}px)` }} />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2" style={{ width: ch.innerT, height: ch.innerL * SCALE, background: color, opacity: ch.innerO, transform: `translateY(calc(-100% - ${ch.innerT}px))` }} />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2" style={{ width: ch.innerT, height: ch.innerL * SCALE, background: color, opacity: ch.innerO, transform: `translateY(${ch.innerT}px)` }} />
          </>
        )}
        {ch.outerT > 0 && ch.outerL > 0 && ch.outerO > 0 && (
          <>
            <span className="absolute left-1/2 top-1/2 -translate-y-1/2" style={{ height: ch.outerT, width: ch.outerL * SCALE, background: color, opacity: ch.outerO, transform: `translateX(calc(-100% - ${ch.outerT + ch.innerL * SCALE + ch.innerT * 2}px))` }} />
            <span className="absolute left-1/2 top-1/2 -translate-y-1/2" style={{ height: ch.outerT, width: ch.outerL * SCALE, background: color, opacity: ch.outerO, transform: `translateX(${ch.outerT + ch.innerL * SCALE + ch.innerT * 2}px)` }} />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2" style={{ width: ch.outerT, height: ch.outerL * SCALE, background: color, opacity: ch.outerO, transform: `translateY(calc(-100% - ${ch.outerT + ch.innerL * SCALE + ch.innerT * 2}px))` }} />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2" style={{ width: ch.outerT, height: ch.outerL * SCALE, background: color, opacity: ch.outerO, transform: `translateY(${ch.outerT + ch.innerL * SCALE + ch.innerT * 2}px)` }} />
          </>
        )}
      </div>
    </div>
  );
}

export function CrosshairCard() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(playerConfig.crosshairCode);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="panel grain flex h-full flex-col p-5 sm:p-6">
      <header className="mb-5 flex items-center gap-2 text-primary">
        <Crosshair className="h-4 w-4" />
        <h3 className="text-display text-lg font-bold text-foreground">My Crosshair</h3>
      </header>

      <CrosshairPreview className="h-44 w-full" />

      <div className="label-hud mt-5">Crosshair Import Code</div>
      <code className="clip-tag mt-2 block overflow-x-auto whitespace-nowrap border border-border bg-background/70 px-3 py-2.5 text-xs text-foreground/90">
        {playerConfig.crosshairCode}
      </code>

      <button
        type="button"
        onClick={copy}
        className={`clip-tag mt-4 inline-flex items-center justify-center gap-2 border px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] transition-all active:scale-[0.98] ${
          copied
            ? "border-primary bg-primary/15 text-primary shadow-glow"
            : "border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-glow"
        }`}
      >
        {copied ? (
          <span className="animate-scale-in inline-flex items-center gap-2">
            <Check className="h-4 w-4" /> Copied!
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Copy className="h-4 w-4" /> Copy Import Code
          </span>
        )}
      </button>
    </div>
  );
}

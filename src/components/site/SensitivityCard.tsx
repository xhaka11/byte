import { Check, Copy, MousePointer2 } from "lucide-react";
import { useState } from "react";

import { playerConfig } from "@/config/player";

const s = playerConfig.sensitivity;

const rows = [
  { label: "DPI", value: s.dpi },
  { label: "In-game Sens", value: s.inGame },
  { label: "eDPI", value: s.edpi },
  { label: "Scoped Sens", value: s.scoped },
  { label: "ADS Sens", value: s.ads },
  { label: "Polling Rate", value: `${s.pollingRate} Hz` },
];

export function SensitivityCard() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = [
      `${playerConfig.handle} — Sensitivity`,
      ...rows.map((r) => `${r.label}: ${r.value}`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="panel grain relative flex h-full flex-col p-5 sm:p-6">
      <header className="mb-5 flex items-center gap-2 text-primary">
        <MousePointer2 className="h-4 w-4" />
        <h3 className="text-display text-lg font-bold text-foreground">Sensitivity &amp; DPI</h3>
      </header>

      <p className="mb-4 text-xs text-muted-foreground">{playerConfig.setup.mouse.name}</p>

      <dl className="space-y-0.5">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between gap-3 border-b border-border/40 py-2.5 text-sm transition-colors hover:bg-primary/5"
          >
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className="text-display font-bold">{r.value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={copy}
        className={`clip-tag mt-6 inline-flex items-center justify-center gap-2 border px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] transition-all active:scale-[0.98] ${
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
            <Copy className="h-4 w-4" /> Copy Sensitivity
          </span>
        )}
      </button>
    </div>
  );
}

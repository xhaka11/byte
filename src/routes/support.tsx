import { createFileRoute } from "@tanstack/react-router";
import { Bitcoin, Copy, Check } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/site/Reveal";
import { playerConfig } from "@/config/player";

function SociabuzzIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <img
      src="https://storage.sociabuzz.com/storage/landingpage/img/sociabuzz-logo-icon.png"
      alt="Sociabuzz"
      className={className}
      draggable={false}
    />
  );
}

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Byte - Game" },
      {
        name: "description",
        content: "Support Byte — Sociabuzz, QRIS, or crypto donation.",
      },
      { property: "og:title", content: "Byte - Game" },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-6">
      <header className="mb-12">
        <span className="label-hud text-primary">Support</span>
        <h1 className="text-display mt-3 text-5xl font-extrabold sm:text-6xl">Support Me</h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
          If you enjoy my content or want to support the grind, pick any method below.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <Reveal>
          <SociabuzzCard />
        </Reveal>
        <Reveal delay={0.08}>
          <CryptoCard />
        </Reveal>
      </div>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        Every bit of support means a lot. Thank you.
      </p>
    </div>
  );
}

function SociabuzzCard() {
  const href = playerConfig.supportLinks.sociabuzz;
  return (
    <div className="panel panel-hover grain flex h-full flex-col p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <SociabuzzIcon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-display text-xl font-bold">Sociabuzz</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Support via Sociabuzz — tip, donate, or subscribe directly.
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="clip-tag mt-6 inline-flex items-center justify-center gap-2 border border-primary/60 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-glow"
        >
          Open Sociabuzz
        </a>
      ) : (
        <span className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
          Not configured yet
        </span>
      )}
    </div>
  );
}

function CryptoCard() {
  const [copied, setCopied] = useState(false);
  const address = playerConfig.supportLinks.crypto;

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="panel panel-hover grain flex h-full flex-col p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Bitcoin className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-display text-xl font-bold">Crypto (USDT)</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Send USDT on BSC / EVM-compatible networks to the address below.
      </p>

      {address ? (
        <>
          <code className="clip-tag mt-4 block overflow-x-auto whitespace-nowrap border border-border bg-background/70 px-3 py-2.5 text-xs text-foreground/90">
            {address}
          </code>
          <button
            type="button"
            onClick={copyAddress}
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
                <Copy className="h-4 w-4" /> Copy Address
              </span>
            )}
          </button>
        </>
      ) : (
        <span className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
          Not configured yet
        </span>
      )}
    </div>
  );
}

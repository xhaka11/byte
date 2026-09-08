import { Bitcoin, ExternalLink } from "lucide-react";

import { playerConfig } from "@/config/player";

function SociabuzzIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <img
      src="https://storage.sociabuzz.com/storage/landingpage/img/sociabuzz-logo-icon.png"
      alt="Sociabuzz"
      className={className}
      draggable={false}
    />
  );
}

const buttons = [
  { key: "sociabuzz", label: "Sociabuzz", Icon: SociabuzzIcon },
  { key: "crypto", label: "Crypto (USDT)", Icon: Bitcoin },
] as const;

export function SupportCard() {
  return (
    <div id="support" className="panel grain flex flex-col p-5 sm:p-6">
      <header className="mb-5 flex items-center gap-2 text-primary">
        <SociabuzzIcon className="h-4 w-4" />
        <h3 className="text-display text-lg font-bold text-foreground">Support The Grind</h3>
      </header>

      <p className="text-sm text-muted-foreground">
        Enjoying my content or setup?
        <br />
        You can support me here.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {buttons.map(({ key, label, Icon }) => {
          const href = playerConfig.supportLinks[key];
          const isCrypto = key === "crypto";

          const handleClick = async () => {
            if (isCrypto && href) {
              try {
                await navigator.clipboard.writeText(href);
                alert("Address copied!");
              } catch {
                alert("Address: " + href);
              }
            }
          };

          return (
            <a
              key={key}
              href={isCrypto ? undefined : href || undefined}
              onClick={isCrypto ? handleClick : undefined}
              target={href && !isCrypto ? "_blank" : undefined}
              rel="noreferrer"
              title={href ? (isCrypto ? `${label} — click to copy address` : label) : `${label} — link not configured yet`}
              className={`clip-tag group inline-flex items-center gap-2 border border-primary/40 px-3 py-3 text-xs font-bold uppercase tracking-[0.14em] transition-all hover:border-primary hover:bg-primary/10 hover:shadow-glow ${
                href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:scale-110" />
              <span className="truncate">{label}</span>
            </a>
          );
        })}
      </div>

      <p className="mt-auto pt-5 text-sm text-muted-foreground">
        Every bit of support means a lot. Thank you.
      </p>
    </div>
  );
}

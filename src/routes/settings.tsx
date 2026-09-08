import { createFileRoute } from "@tanstack/react-router";

import { CrosshairCard } from "@/components/site/CrosshairCard";
import { Reveal, SectionTitle } from "@/components/site/Reveal";
import { SensitivityCard } from "@/components/site/SensitivityCard";
import { playerConfig } from "@/config/player";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Byte - Game" },
      {
        name: "description",
        content:
          "Byte's full Valorant settings: DPI and sensitivity, crosshair import code, keybinds and video settings.",
      },
      { property: "og:title", content: "Byte - Game" },
      {
        property: "og:description",
        content: "Sensitivity, crosshair code, keybinds and video settings.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-6">
      <header className="mb-12">
        <span className="label-hud text-primary">Config Sheet</span>
        <h1 className="text-display mt-3 text-5xl font-extrabold sm:text-6xl">Settings</h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
          Exactly what I run — mouse, crosshair, keybinds and video. Copy anything you want.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <SensitivityCard />
        </Reveal>
        <Reveal delay={0.08}>
          <CrosshairCard />
        </Reveal>
      </div>

      <section className="mt-20">
        <SectionTitle>Keybinds</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(playerConfig.keybinds).map(([group, binds], i) => (
            <Reveal key={group} delay={i * 0.06}>
              <div className="panel panel-hover h-full p-5">
                <div className="label-hud mb-3 text-primary">{group}</div>
                <dl className="space-y-2 text-sm">
                  {binds.map((b) => (
                    <div key={b.action} className="flex items-center justify-between gap-3 border-b border-border/40 pb-2">
                      <dt className="truncate text-muted-foreground">{b.action}</dt>
                      <dd className="text-display shrink-0 font-bold">{b.key}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionTitle>Video Settings</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Object.entries(playerConfig.video).map(([label, value], i) => (
            <Reveal key={label} delay={i * 0.05}>
              <div className="panel panel-hover h-full p-4">
                <div className="label-hud truncate">{label}</div>
                <div className="text-display mt-1 text-base font-bold">{value}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

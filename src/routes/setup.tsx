import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import { SetupCard } from "@/components/site/SetupCard";
import { playerConfig } from "@/config/player";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Byte - Game" },
      {
        name: "description",
        content:
          "Every piece of gear Byte competes on: IGNIX F3 Pro mouse, Furycube M68 HE keyboard, Lenovo Legion 5 laptop and full specs.",
      },
      { property: "og:title", content: "Byte - Game" },
      { property: "og:description", content: "Mouse, keyboard, display and laptop specs." },
    ],
  }),
  component: SetupPage,
});

const entries = [
  { category: "Mouse", ...playerConfig.setup.mouse },
  { category: "Keyboard", ...playerConfig.setup.keyboard },
  { category: "Display", ...playerConfig.setup.monitor },
  { category: "Laptop", ...playerConfig.setup.pc },
];

function SetupPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-6">
      <header className="mb-12">
        <span className="label-hud text-primary">Battlestation</span>
        <h1 className="text-display mt-3 text-5xl font-extrabold sm:text-6xl">My Setup</h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
          Laptop-first, lightweight peripherals, nothing fancy. Hover a card for full specs.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {entries.map((item, i) => (
          <Reveal key={item.category} delay={i * 0.07}>
            <SetupCard {...item} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

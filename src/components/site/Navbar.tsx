import { Link } from "@tanstack/react-router";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

import logoImg from "@/assets/logo.png";
import { playerConfig } from "@/config/player";

const links = [
  { label: "Home", to: "/" },
  { label: "Profile", to: "/profile" },
  { label: "Settings", to: "/settings" },
  { label: "Setup", to: "/setup" },
  { label: "Match History", to: "/match-history" },
  { label: "About", to: "/about" },
  { label: "Support", to: "/support" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:flex lg:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src={logoImg} alt="Byte" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-display truncate text-xl font-bold tracking-widest">
            {playerConfig.handle.toUpperCase()}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="group relative px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
            >
              {l.label}
              <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 group-data-[status=active]:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/support"
            className="clip-tag group hidden items-center gap-2 border border-primary/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-glow sm:inline-flex"
          >
            <Heart className="h-3.5 w-3.5 transition-transform group-hover:scale-125" />
            Support Me
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="clip-tag border border-border p-2 text-foreground transition-colors hover:border-primary/60 hover:text-primary lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <nav
        className={`overflow-hidden border-t border-border/70 bg-background/95 transition-all duration-300 lg:hidden ${
          open ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-4 py-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              onClick={() => setOpen(false)}
              className="border-b border-border/40 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground data-[status=active]:text-primary"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/support"
            onClick={() => setOpen(false)}
            className="clip-tag mb-3 mt-4 inline-flex items-center justify-center gap-2 border border-primary/70 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-primary"
          >
            <Heart className="h-3.5 w-3.5" /> Support Me
          </Link>
        </div>
      </nav>
    </header>
  );
}

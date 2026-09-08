<div align="center">

<img src="public/vite.svg" alt="Byte" width="100" />

# BYTE

### Personal Valorant Hub

**Play. Adapt. Win.**

[![Deploy to Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare-F48120?style=for-the-badge&logo=cloudflare&logoColor=white)]()
[![Built with React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)]()
[![Built with Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)]()

</div>

---

## About

A personal Valorant player hub built with a dark tactical HUD aesthetic. Profile, settings, setup specs, match history, and support — all in one place.

## Pages

| Page | Description |
|------|-------------|
| **Home** | Hero + quick navigation |
| **Profile** | Rank, agents, maps, playstyle |
| **Settings** | Sensitivity, crosshair, keybinds, video |
| **Setup** | Mouse, keyboard, monitor, PC specs |
| **Match History** | Recent matches with filters |
| **About** | Bio and journey |
| **Support** | Sociabuzz & crypto donations |

## Tech Stack

- **Framework:** TanStack Start + React 19
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Icons:** Lucide React
- **Animations:** CSS + Framer Motion
- **Deployment:** Cloudflare Workers

## Getting Started

```bash
# Clone
git clone https://github.com/your-username/byte-valorant.git
cd byte-valorant

# Install
npm install

# Dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Configuration

All player data lives in a single file:

```
src/config/player.ts
```

Edit `playerConfig` to update:
- Name, handle, Riot ID
- Rank, peak rank, playtime
- Sensitivity & DPI
- Crosshair code
- Setup gear specs
- Support links
- Match history
- Social links

## Deploy

**Cloudflare (recommended):**

```bash
npm run build
npx wrangler pages deploy .output/public --project-name=byte-valorant
```

Or connect your GitHub repo to [Cloudflare Pages](https://dash.cloudflare.com) for auto-deploy.

## License

Made with Lovable

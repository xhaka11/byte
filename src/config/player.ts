import mouseImg from "@/assets/gear-mouse.png";
import keyboardImg from "@/assets/gear-keyboard.png";
import monitorImg from "@/assets/gear-monitor.png";
import pcImg from "@/assets/gear-pc.png";

/**
 * SINGLE SOURCE OF TRUTH
 * Everything shown on the site is edited here. No APIs, no fake integrations.
 */
export const playerConfig = {
  name: "Byte",
  handle: "Byte",
  riotId: "Byte #IDN",
  tagline: "Play different. Adapt faster.",
  quote: "Valor is temporary, crosshair placement is eternal.",
  subtitle: "Flexible Duelist / Flex",
  label: "Flex Player",
  region: "Indonesia (ID)",
  playtime: "ERR_TIMEOUT",
  rank: { name: "Immortal 2", detail: "124 RR" },
  peakRank: { name: "ERR_UNKNOWN", detail: "TypeError: rank.fetch() failed" },
  mainAgent: "Raze",
  playstyle: "Flexible player — adapts to the team, plays what's needed, focuses on fundamentals and positioning.",
  favoriteAgents: ["Raze", "Fade", "Deadlock", "Phoenix"],
  favoriteMaps: ["Split", "Bind", "Ascent", "Lotus"],

  stats: {
    matches: "2,548",
    winRate: "52.3",
    kd: "1.35",
    headshot: "27.8",
    acs: "241",
    firstBloods: "18.4",
  },

  sensitivity: {
    dpi: "1400",
    inGame: "0.3",
    edpi: "420",
    scoped: "0.6",
    ads: "0.6",
    pollingRate: "1000",
  },

  crosshairCode: "0;s;1;P;c;5;o;1;d;1;z;4;f;0;0t;0;0l;0;0v;0;0o;0;0a;1;0f;0;1b;0",

  keybinds: {
    Movement: [
      { action: "Walk", key: "Left Shift" },
      { action: "Crouch", key: "Left Ctrl" },
      { action: "Jump", key: "Space / Mouse Wheel" },
    ],
    Abilities: [
      { action: "Blast Pack (C)", key: "C" },
      { action: "Paint Shells (Q)", key: "Q" },
      { action: "Boom Bot (E)", key: "E" },
      { action: "Showstopper (X)", key: "X" },
    ],
    Weapon: [
      { action: "Primary", key: "1" },
      { action: "Sidearm", key: "2" },
      { action: "Melee", key: "3" },
      { action: "Spike", key: "4" },
    ],
    Communication: [
      { action: "Team Voice", key: "V" },
      { action: "Party Voice", key: "Y" },
      { action: "Ping", key: "Mouse 4" },
    ],
  },

  video: {
    Resolution: "1920 × 1080",
    "Display Mode": "Fullscreen",
    "Refresh Rate": "165 Hz",
    "Graphics Quality": "Low / All off",
    "Multithreaded Rendering": "On",
    "Anti-Aliasing": "None",
    "NVIDIA Reflex": "On + Boost",
    "VSync": "Off",
  },

  setup: {
    mouse: {
      name: "VortexSeries IGNIX F3 Pro",
      image: mouseImg,
      specs: [
        { label: "Sensor", value: "PAW 3395 PRO" },
        { label: "Max DPI", value: "40,000" },
      ],
      extra: [
        { label: "Weight", value: "39 g" },
        { label: "Polling", value: "1000 Hz" },
        { label: "Switches", value: "Omron D2FC" },
        { label: "Modes", value: "2.4G / BT / Wired" },
      ],
    },
    keyboard: {
      name: "Furycube M68 HE",
      image: keyboardImg,
      specs: [
        { label: "Rapid Trigger", value: "0.01 mm" },
        { label: "Polling Rate", value: "8000 Hz" },
      ],
      extra: [
        { label: "Switches", value: "Hall Effect Magnetic" },
        { label: "Layout", value: "65%" },
        { label: "Latency", value: "0.1 ms" },
        { label: "Features", value: "SOCD / DKS / MT" },
      ],
    },
    monitor: {
      name: "Lenovo Legion 5 Display",
      image: monitorImg,
      specs: [
        { label: "Resolution", value: "1920 × 1080" },
        { label: "Refresh Rate", value: "165 Hz" },
      ],
      extra: [
        { label: "Size", value: '15.6" IPS' },
        { label: "Response", value: "3ms" },
        { label: "Panel", value: "Matte" },
        { label: "Sync", value: "FreeSync" },
      ],
    },
    pc: {
      name: "Lenovo Legion 5 15ACH6",
      image: pcImg,
      specs: [
        { label: "CPU", value: "Ryzen 7 5800H" },
        { label: "GPU", value: "RTX 3050 Ti 4GB" },
      ],
      extra: [
        { label: "RAM", value: "16 GB DDR4 3200" },
        { label: "Storage", value: "512 GB NVMe" },
        { label: "WiFi", value: "WiFi 6 + BT 5.2" },
        { label: "Weight", value: "2.4 kg" },
      ],
    },
  },

  /** Replace with real destinations. Empty string = button shows as unavailable. */
  supportLinks: {
    sociabuzz: "https://sociabuzz.com/bytee/tribe",
    crypto: "0x9e13862e22b89edfa51c124cb6a3b15fc33d5967",
  },

  socials: {
    discord: "",
    twitter: "",
    youtube: "",
    tiktok: "",
    instagram: "",
  },

  matches: [
    { map: "Split", result: "victory", score: "13 - 7", kda: "20 / 12 / 4", kd: "1.67", hs: "31%", acs: "268", agent: "Raze", mode: "Ranked", date: "12 Aug" },
    { map: "Bind", result: "defeat", score: "8 - 13", kda: "14 / 16 / 6", kd: "0.88", hs: "22%", acs: "196", agent: "Raze", mode: "Ranked", date: "12 Aug" },
    { map: "Ascent", result: "victory", score: "13 - 10", kda: "24 / 15 / 4", kd: "1.60", hs: "29%", acs: "281", agent: "Jett", mode: "Ranked", date: "11 Aug" },
    { map: "Fracture", result: "victory", score: "13 - 4", kda: "18 / 9 / 5", kd: "2.00", hs: "34%", acs: "302", agent: "Raze", mode: "Unrated", date: "11 Aug" },
    { map: "Haven", result: "defeat", score: "10 - 13", kda: "17 / 18 / 3", kd: "0.94", hs: "24%", acs: "211", agent: "Neon", mode: "Ranked", date: "10 Aug" },
    { map: "Lotus", result: "victory", score: "13 - 11", kda: "22 / 17 / 7", kd: "1.29", hs: "26%", acs: "254", agent: "Raze", mode: "Unrated", date: "09 Aug" },
    { map: "Icebox", result: "victory", score: "13 - 9", kda: "19 / 13 / 5", kd: "1.46", hs: "28%", acs: "263", agent: "Raze", mode: "Ranked", date: "08 Aug" },
    { map: "Sunset", result: "defeat", score: "11 - 13", kda: "16 / 17 / 4", kd: "0.94", hs: "21%", acs: "218", agent: "Yoru", mode: "Unrated", date: "07 Aug" },
  ],
} as const;

export type PlayerConfig = typeof playerConfig;
export type MatchEntry = PlayerConfig["matches"][number];

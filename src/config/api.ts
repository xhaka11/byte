/**
 * Henrik API Configuration
 * Get your free API key at: https://api.henrikdev.xyz/dashboard/
 */
export const henrikConfig = {
  apiKey: "", // <-- Paste your Henrik API key here
  baseUrl: "https://api.henrikdev.xyz",

  /** Player Riot ID */
  name: "Byte",
  tag: "IDN",
  region: "ap",
  platform: "pc",
} as const;

export type HenrikConfig = typeof henrikConfig;

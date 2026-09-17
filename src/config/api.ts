/**
 * Henrik API Configuration
 * Get your free API key at: https://api.henrikdev.xyz/dashboard/
 */
export const henrikConfig = {
  apiKey: "HDEV-a9cdde48-db96-48a4-ab33-2638017b993f",
  baseUrl: "https://api.henrikdev.xyz",

  /** Player Riot ID — used by Match History */
  name: "earl",
  tag: "evo",
  region: "ap",
  platform: "pc",
} as const;

export type HenrikConfig = typeof henrikConfig;

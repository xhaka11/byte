/**
 * Henrik.dev API Configuration
 * Get your API key at: https://api.henrikdev.xyz/dashboard/
 */
export const apiConfig = {
  baseUrl: "https://api.henrikdev.xyz",

  /** Your Henrik.dev API key — set in .env as VITE_HENRIK_API_KEY */
  get apiKey(): string {
    return import.meta.env.VITE_HENRIK_API_KEY || "";
  },

  /** Player identifiers */
  player: {
    name: "Byte",
    tag: "IDN",
    region: "ap",
  },
} as const;

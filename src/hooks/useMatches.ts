import { useEffect, useState } from "react";

import { type MatchCardData, fetchRecentMatches } from "@/lib/valorant-api";
import { playerConfig } from "@/config/player";

type UseMatchesResult = {
  matches: MatchCardData[];
  isLoading: boolean;
  error: string | null;
  source: "api" | "static";
};

/**
 * Hook that tries to fetch live match data from Henrik.dev API,
 * falling back to static config data if the API key isn't set or fails.
 */
export function useMatches(count = 8): UseMatchesResult {
  const [state, setState] = useState<UseMatchesResult>({
    matches: playerConfig.matches as unknown as MatchCardData[],
    isLoading: true,
    error: null,
    source: "static",
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const apiMatches = await fetchRecentMatches(count);
        if (cancelled) return;

        if (apiMatches.length > 0) {
          setState({ matches: apiMatches, isLoading: false, error: null, source: "api" });
        } else {
          // API key not set or empty — use static data
          setState({
            matches: playerConfig.matches as unknown as MatchCardData[],
            isLoading: false,
            error: null,
            source: "static",
          });
        }
      } catch (err) {
        if (cancelled) return;
        // On error, fall back to static data
        console.error("Failed to fetch matches from API:", err);
        setState({
          matches: playerConfig.matches as unknown as MatchCardData[],
          isLoading: false,
          error: err instanceof Error ? err.message : "Unknown error",
          source: "static",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [count]);

  return state;
}

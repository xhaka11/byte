import { useEffect, useState } from "react";

import { type MatchCardData, fetchRecentMatches } from "@/lib/valorant-api";

type UseMatchesResult = {
  matches: MatchCardData[];
  isLoading: boolean;
  error: string | null;
};

export function useMatches(count = 8): UseMatchesResult {
  const [state, setState] = useState<UseMatchesResult>({
    matches: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const apiMatches = await fetchRecentMatches(count);
        if (cancelled) return;
        setState({ matches: apiMatches, isLoading: false, error: null });
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to fetch matches from API:", err);
        setState({
          matches: [],
          isLoading: false,
          error: err instanceof Error ? err.message : "Failed to load matches",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [count]);

  return state;
}
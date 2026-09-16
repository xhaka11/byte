import { useState, useEffect } from "react";
import type { MMRData, MatchData } from "@/lib/valorant-api";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> { data: T; ts: number }
const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const e = cache.get(key);
  if (e && Date.now() - e.ts < CACHE_TTL) return e.data as T;
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T) {
  cache.set(key, { data, ts: Date.now() });
}

export function useMMR() {
  const [data, setData] = useState<MMRData["data"] | null>(getCached("mmr"));
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = getCached<MMRData["data"]>("mmr");
    if (cached) { setData(cached); setLoading(false); return; }

    fetch("/api/mmr")
      .then((r) => r.json())
      .then((json: MMRData) => {
        setCache("mmr", json.data);
        setData(json.data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useMatches(size = 10) {
  const [data, setData] = useState<MatchData["data"] | null>(getCached("matches"));
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = `matches-${size}`;
    const cached = getCached<MatchData["data"]>(cacheKey);
    if (cached) { setData(cached); setLoading(false); return; }

    fetch(`/api/matches?size=${size}`)
      .then((r) => r.json())
      .then((json: MatchData) => {
        setCache(cacheKey, json.data);
        setData(json.data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [size]);

  return { data, loading, error };
}

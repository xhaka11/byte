import { createFileRoute } from "@tanstack/react-router";
import { getMMR } from "@/lib/valorant-api";

export const Route = createFileRoute("/api/mmr")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const data = await getMMR();
          return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: (e as Error).message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});

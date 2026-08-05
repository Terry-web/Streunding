import { NextResponse } from "next/server";

const endpoints = [
  { label: "Supabase API (lokaal)", url: "http://192.168.1.117:8000/rest/v1/" },
  { label: "Supabase API (extern)", url: "http://mc.streunding.nl:8000/rest/v1/" },
];

export async function GET() {
  const results = await Promise.all(
    endpoints.map(async (e) => {
      const start = Date.now();
      try {
        const res = await fetch(e.url, {
          signal: AbortSignal.timeout(4000),
          cache: "no-store",
        });
        return {
          label: e.label,
          url: e.url,
          online: res.status > 0,
          latency: Date.now() - start,
        };
      } catch {
        return {
          label: e.label,
          url: e.url,
          online: false,
          latency: null,
        };
      }
    })
  );

  return NextResponse.json({ results, checkedAt: new Date().toISOString() });
}

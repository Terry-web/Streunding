import { NextResponse } from "next/server";

const endpoints = [
  { label: "Lokaal netwerk", url: "http://192.168.1.117:3000/api/ping" },
  { label: "mc.streunding.nl", url: "http://mc.streunding.nl:3000/api/ping" },
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
        const data = await res.json();
        return {
          label: e.label,
          url: e.url,
          online: data.ok === true,
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

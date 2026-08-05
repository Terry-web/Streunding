import { NextResponse } from "next/server";

const endpoints = [
  { label: "Supabase API (lokaal)", url: "http://192.168.1.117:8000/rest/v1/" },
  { label: "Supabase API (extern)", url: "http://mc.streunding.nl:8000/rest/v1/" },
];

async function checkEndpoint(e: { label: string; url: string }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  const start = Date.now();
  try {
    const res = await fetch(e.url, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    return { label: e.label, url: e.url, online: res.status > 0, latency: Date.now() - start };
  } catch {
    clearTimeout(timer);
    return { label: e.label, url: e.url, online: false, latency: null };
  }
}

export async function GET() {
  const results = await Promise.all(endpoints.map(checkEndpoint));
  return NextResponse.json({ results, checkedAt: new Date().toISOString() });
}

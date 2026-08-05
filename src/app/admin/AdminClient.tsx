"use client";
import { useEffect, useState } from "react";

type Result = {
  label: string;
  url: string;
  online: boolean;
  latency: number | null;
};

type StatusResponse = {
  results: Result[];
  checkedAt: string;
};

export default function AdminClient() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const check = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch {
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const tijd = data?.checkedAt
    ? new Date(data.checkedAt).toLocaleTimeString("nl-NL")
    : null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest">
          Bereikbaarheid
        </h2>
        <div className="flex items-center gap-3">
          {tijd && <span className="text-stone-500 text-xs">Gecheckt: {tijd}</span>}
          <button
            onClick={check}
            disabled={loading}
            className="text-xs bg-stone-700 hover:bg-stone-600 disabled:opacity-40 text-stone-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            {loading ? "Controleren..." : "Vernieuwen"}
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {loading && !data
          ? [0, 1].map((i) => (
              <div key={i} className="rounded-2xl p-5 bg-stone-800 border border-stone-700 animate-pulse h-24" />
            ))
          : data?.results.map((r) => (
              <div
                key={r.url}
                className={`rounded-2xl p-5 border ${
                  r.online
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      r.online ? "bg-green-400" : "bg-red-500"
                    }`}
                  />
                  <span
                    className={`font-black text-lg ${
                      r.online ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {r.online ? "Online" : "Niet bereikbaar"}
                  </span>
                  {r.latency !== null && (
                    <span className="text-stone-500 text-xs ml-auto">
                      {r.latency}ms
                    </span>
                  )}
                </div>
                <p className="font-bold text-white text-sm">{r.label}</p>
                <p className="font-mono text-xs text-stone-500 mt-1">{r.url}</p>
              </div>
            ))}
      </div>

      <p className="text-stone-600 text-xs mt-3">
        ℹ️ Check wordt uitgevoerd vanuit de server (VM) — niet vanuit jouw browser.
        Auto-refresh elke 30 seconden.
      </p>
    </section>
  );
}

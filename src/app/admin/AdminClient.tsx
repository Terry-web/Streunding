"use client";
import { useEffect, useState } from "react";

const endpoints = [
  { label: "Lokaal netwerk", url: "http://192.168.1.117:8000/rest/v1/" },
  { label: "mc.streunding.nl", url: "http://mc.streunding.nl:8000/rest/v1/" },
];

type Status = "checking" | "online" | "offline";

type Result = {
  label: string;
  url: string;
  status: Status;
  latency: number | null;
};

export default function AdminClient() {
  const [results, setResults] = useState<Result[]>(
    endpoints.map((e) => ({ ...e, status: "checking", latency: null }))
  );
  const [lastChecked, setLastChecked] = useState<string>("");

  const check = async () => {
    setResults((r) => r.map((e) => ({ ...e, status: "checking", latency: null })));

    await Promise.all(
      endpoints.map(async (e, i) => {
        const start = Date.now();
        try {
          await fetch(e.url, {
            signal: AbortSignal.timeout(4000),
            cache: "no-store",
            mode: "no-cors",
          });
          setResults((r) => {
            const updated = [...r];
            updated[i] = { ...e, status: "online", latency: Date.now() - start };
            return updated;
          });
        } catch {
          setResults((r) => {
            const updated = [...r];
            updated[i] = { ...e, status: "offline", latency: null };
            return updated;
          });
        }
      })
    );

    setLastChecked(new Date().toLocaleTimeString("nl-NL"));
  };

  useEffect(() => {
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest">
          Bereikbaarheid
        </h2>
        <div className="flex items-center gap-3">
          {lastChecked && (
            <span className="text-stone-500 text-xs">Gecheckt: {lastChecked}</span>
          )}
          <button
            onClick={check}
            className="text-xs bg-stone-700 hover:bg-stone-600 text-stone-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            Vernieuwen
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {results.map((r) => (
          <div
            key={r.url}
            className={`rounded-2xl p-5 border ${
              r.status === "online"
                ? "bg-green-500/10 border-green-500/30"
                : r.status === "offline"
                ? "bg-red-500/10 border-red-500/30"
                : "bg-stone-800 border-stone-700"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  r.status === "online"
                    ? "bg-green-400"
                    : r.status === "offline"
                    ? "bg-red-500"
                    : "bg-stone-500 animate-pulse"
                }`}
              />
              <span
                className={`font-black text-lg ${
                  r.status === "online"
                    ? "text-green-400"
                    : r.status === "offline"
                    ? "text-red-400"
                    : "text-stone-400"
                }`}
              >
                {r.status === "online"
                  ? "Bereikbaar"
                  : r.status === "offline"
                  ? "Niet bereikbaar"
                  : "Controleren..."}
              </span>
              {r.latency !== null && (
                <span className="text-stone-500 text-xs ml-auto">{r.latency}ms</span>
              )}
            </div>
            <p className="font-bold text-white text-sm">{r.label}</p>
            <p className="font-mono text-xs text-stone-500 mt-1">{r.url}</p>
          </div>
        ))}
      </div>

      <p className="text-stone-600 text-xs mt-3">
        ℹ️ Check loopt vanuit jouw browser — groen betekent dat jíj de Supabase-instantie kunt bereiken.
        Auto-refresh elke 30 seconden.
      </p>
    </section>
  );
}

"use client";
import { useEffect, useState } from "react";

type Result = {
  label: string;
  url: string;
  online: boolean;
  latency: number | null;
};

type State =
  | { phase: "loading" }
  | { phase: "ok"; results: Result[]; tijd: string }
  | { phase: "error" };

export default function AdminClient() {
  const [state, setState] = useState<State>({ phase: "loading" });

  const check = async () => {
    setState({ phase: "loading" });
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error("status " + res.status);
      const json = await res.json();
      setState({
        phase: "ok",
        results: json.results,
        tijd: new Date(json.checkedAt).toLocaleTimeString("nl-NL"),
      });
    } catch {
      setState({ phase: "error" });
    }
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
          {state.phase === "ok" && (
            <span className="text-stone-500 text-xs">Gecheckt: {state.tijd}</span>
          )}
          <button
            onClick={check}
            disabled={state.phase === "loading"}
            className="text-xs bg-stone-700 hover:bg-stone-600 disabled:opacity-40 text-stone-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            {state.phase === "loading" ? "Controleren..." : "Vernieuwen"}
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {state.phase === "loading" && (
          <>
            <div className="rounded-2xl p-5 bg-stone-800 border border-stone-700 animate-pulse h-24" />
            <div className="rounded-2xl p-5 bg-stone-800 border border-stone-700 animate-pulse h-24" />
          </>
        )}

        {state.phase === "error" && (
          <div className="col-span-2 rounded-2xl p-5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            Kon /api/status niet bereiken. Is de dev-server actief?
          </div>
        )}

        {state.phase === "ok" &&
          state.results.map((r) => (
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
                  {r.online ? "Bereikbaar" : "Niet bereikbaar"}
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
        ℹ️ Check wordt uitgevoerd vanuit de Next.js server.
        Auto-refresh elke 30 seconden.
      </p>
    </section>
  );
}

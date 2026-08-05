"use client";
import { useEffect, useState } from "react";

const endpoints = [
  { label: "Lokaal netwerk", url: "http://192.168.1.117:3000/api/ping" },
  { label: "mc.streunding.nl", url: "http://mc.streunding.nl:3000/api/ping" },
];

type Status = "checking" | "online" | "offline";

export default function AdminClient() {
  const [statuses, setStatuses] = useState<Record<string, Status>>(
    Object.fromEntries(endpoints.map((e) => [e.url, "checking"]))
  );
  const [lastChecked, setLastChecked] = useState<string>("");

  const check = async () => {
    setLastChecked(new Date().toLocaleTimeString("nl-NL"));
    await Promise.all(
      endpoints.map(async (e) => {
        try {
          const res = await fetch(e.url, { signal: AbortSignal.timeout(4000) });
          const data = await res.json();
          setStatuses((s) => ({ ...s, [e.url]: data.ok ? "online" : "offline" }));
        } catch {
          setStatuses((s) => ({ ...s, [e.url]: "offline" }));
        }
      })
    );
  };

  useEffect(() => {
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const kleur: Record<Status, string> = {
    checking: "bg-stone-600 text-stone-300",
    online: "bg-green-500/20 text-green-400 border border-green-500/30",
    offline: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  const dot: Record<Status, string> = {
    checking: "bg-stone-500 animate-pulse",
    online: "bg-green-400",
    offline: "bg-red-500",
  };

  const label: Record<Status, string> = {
    checking: "Controleren...",
    online: "Online",
    offline: "Niet bereikbaar",
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest">Bereikbaarheid</h2>
        <div className="flex items-center gap-3">
          {lastChecked && <span className="text-stone-500 text-xs">Laatste check: {lastChecked}</span>}
          <button
            onClick={check}
            className="text-xs bg-stone-700 hover:bg-stone-600 text-stone-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            Vernieuwen
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {endpoints.map((e) => {
          const status = statuses[e.url];
          return (
            <div key={e.url} className={`rounded-2xl p-5 ${kleur[status]}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot[status]}`} />
                <span className="font-black text-lg">{label[status]}</span>
              </div>
              <p className="font-bold text-sm">{e.label}</p>
              <p className="font-mono text-xs opacity-60 mt-1">{e.url}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

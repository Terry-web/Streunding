"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Row = Record<string, unknown>;

type TestResult = {
  label: string;
  ok: boolean;
  data?: Row[];
  error?: string;
  ms: number;
};

async function run(label: string, fn: () => Promise<Row[]>): Promise<TestResult> {
  const start = Date.now();
  try {
    const data = await fn();
    return { label, ok: true, data, ms: Date.now() - start };
  } catch (e) {
    return { label, ok: false, error: String(e), ms: Date.now() - start };
  }
}

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [insertLog, setInsertLog] = useState<string[]>([]);

  const runTests = async () => {
    setRunning(true);
    setResults([]);

    const tests: TestResult[] = [];

    // 1. Verbinding checken via apiaries
    tests.push(await run("SELECT apiaries", async () => {
      const { data, error } = await supabase.from("apiaries").select("*").limit(10);
      if (error) throw error.message;
      return data ?? [];
    }));

    // 2. Kasten ophalen
    tests.push(await run("SELECT hives", async () => {
      const { data, error } = await supabase.from("hives").select("*").limit(10);
      if (error) throw error.message;
      return data ?? [];
    }));

    // 3. Volken ophalen
    tests.push(await run("SELECT colonies", async () => {
      const { data, error } = await supabase.from("colonies").select("*").limit(10);
      if (error) throw error.message;
      return data ?? [];
    }));

    // 4. Inspecties ophalen
    tests.push(await run("SELECT inspections", async () => {
      const { data, error } = await supabase.from("inspections").select("*").limit(10);
      if (error) throw error.message;
      return data ?? [];
    }));

    // 5. colony_overview view
    tests.push(await run("VIEW colony_overview", async () => {
      const { data, error } = await supabase.from("colony_overview").select("*");
      if (error) throw error.message;
      return data ?? [];
    }));

    // 6. colony_last_inspection view
    tests.push(await run("VIEW colony_last_inspection", async () => {
      const { data, error } = await supabase.from("colony_last_inspection").select("*");
      if (error) throw error.message;
      return data ?? [];
    }));

    setResults(tests);
    setRunning(false);
  };

  const insertTestData = async () => {
    const log: string[] = [];

    // Standplaats
    const { data: apiary, error: e1 } = await supabase
      .from("apiaries")
      .insert({ name: "Test Standplaats", city: "Testdorp", type: "home" })
      .select()
      .single();
    if (e1) { log.push("❌ apiary: " + e1.message); }
    else log.push("✅ apiary: " + apiary.id);

    // Kast
    const { data: hive, error: e2 } = await supabase
      .from("hives")
      .insert({ label: "Testkast 1", type: "simplex", frame_count: 10 })
      .select()
      .single();
    if (e2) { log.push("❌ hive: " + e2.message); }
    else log.push("✅ hive: " + hive.id);

    // Koningin
    const { data: queen, error: e3 } = await supabase
      .from("queens")
      .insert({ birth_year: 2025, race: "carnica", origin: "purchased", marked: true, marking_color: "wit" })
      .select()
      .single();
    if (e3) { log.push("❌ queen: " + e3.message); }
    else log.push("✅ queen: " + queen.id);

    // Volk (alleen als apiary en hive gelukt zijn)
    if (apiary && hive) {
      const { data: colony, error: e4 } = await supabase
        .from("colonies")
        .insert({
          name: "Testvolk 1",
          apiary_id: apiary.id,
          hive_id: hive.id,
          queen_id: queen?.id ?? null,
          status: "active",
        })
        .select()
        .single();
      if (e4) { log.push("❌ colony: " + e4.message); }
      else {
        log.push("✅ colony: " + colony.id);

        // Inspectie
        const { error: e5 } = await supabase
          .from("inspections")
          .insert({
            colony_id: colony.id,
            queen_seen: true,
            eggs_seen: true,
            brood_pattern: "solid",
            temperament: "calm",
            frames_of_bees: 6,
            frames_of_brood: 4,
            honey_stores: "gemiddeld",
            weather: "zonnig",
          });
        if (e5) log.push("❌ inspection: " + e5.message);
        else log.push("✅ inspection aangemaakt");
      }
    }

    setInsertLog(log);
    await runTests();
  };

  const clearTestData = async () => {
    await supabase.from("inspections").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("colonies").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("queens").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("hives").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("apiaries").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    setInsertLog(["🗑 Alle testdata verwijderd"]);
    await runTests();
  };

  useEffect(() => { runTests(); }, []);

  return (
    <div className="min-h-screen bg-stone-900 text-white pt-20 px-6">
      <div className="max-w-4xl mx-auto py-12">

        <div className="mb-8">
          <p className="text-amber-400 font-mono text-sm mb-1">Supabase</p>
          <h1 className="text-4xl font-black">Database test</h1>
          <p className="text-stone-400 text-sm mt-2">{process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={runTests}
            disabled={running}
            className="bg-stone-700 hover:bg-stone-600 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            {running ? "Testen..." : "Tests uitvoeren"}
          </button>
          <button
            onClick={insertTestData}
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            Testdata invoegen
          </button>
          <button
            onClick={clearTestData}
            className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            Alles leegmaken
          </button>
        </div>

        {insertLog.length > 0 && (
          <div className="bg-stone-800 border border-stone-700 rounded-2xl p-4 mb-6 font-mono text-xs space-y-1">
            {insertLog.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        )}

        <div className="space-y-4">
          {results.map((r) => (
            <div
              key={r.label}
              className={`rounded-2xl border p-5 ${r.ok ? "border-stone-700 bg-stone-800" : "border-red-500/40 bg-red-500/10"}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${r.ok ? "bg-green-400" : "bg-red-500"}`} />
                <span className="font-bold text-sm">{r.label}</span>
                <span className="text-stone-500 text-xs ml-auto">{r.ms}ms</span>
                {r.ok && (
                  <span className="text-stone-500 text-xs">{r.data?.length ?? 0} rijen</span>
                )}
              </div>

              {r.error && (
                <p className="text-red-400 text-xs font-mono">{r.error}</p>
              )}

              {r.ok && r.data && r.data.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="text-xs w-full">
                    <thead>
                      <tr className="text-stone-500 border-b border-stone-700">
                        {Object.keys(r.data[0]).map((k) => (
                          <th key={k} className="text-left pb-1 pr-4 font-mono">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {r.data.map((row, i) => (
                        <tr key={i} className="border-b border-stone-700/50">
                          {Object.values(row).map((v, j) => (
                            <td key={j} className="py-1 pr-4 font-mono text-stone-300 max-w-32 truncate">
                              {v === null ? <span className="text-stone-600">null</span> : String(v)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {r.ok && r.data?.length === 0 && (
                <p className="text-stone-500 text-xs">Geen data</p>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

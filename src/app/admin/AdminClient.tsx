"use client";
import { useEffect, useState } from "react";

export default function AdminClient() {
  const [text, setText] = useState("laden...");

  useEffect(() => {
    setText("useEffect gestart");
    fetch("/api/ping")
      .then((r) => r.json())
      .then((d) => setText("ping ok: " + JSON.stringify(d)))
      .catch((e) => setText("ping fout: " + e.message));
  }, []);

  return <pre className="text-white text-xs break-all">{text}</pre>;
}

"use client";
import { useEffect, useState } from "react";

export default function AdminClient() {
  const [text, setText] = useState("laden...");

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((d) => setText(JSON.stringify(d)))
      .catch((e) => setText("fout: " + e.message));
  }, []);

  return <pre className="text-white text-xs break-all">{text}</pre>;
}

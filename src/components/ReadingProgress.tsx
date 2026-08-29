"use client";
import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setProgress((scrollTop / (scrollHeight - clientHeight)) * 100);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-[82px] left-0 right-0 z-40 h-px bg-[#201f1d]/10">
      <div
        className="h-full bg-[#b68235] transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

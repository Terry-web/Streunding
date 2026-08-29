"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  pendingLabel = "Bezig...",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded border border-[#b68235] px-6 py-3 text-base tracking-[0.06em] text-[#7d5411] transition-colors hover:bg-[#b68235]/10 disabled:cursor-not-allowed disabled:border-[#201f1d]/25 disabled:text-[#a3a09e] disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235]"
      style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

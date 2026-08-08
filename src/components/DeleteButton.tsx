"use client";

import { useFormStatus } from "react-dom";

export default function DeleteButton({
  confirmMessage = "Weet je het zeker?",
  children = "Verwijderen",
}: {
  confirmMessage?: string;
  children?: React.ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
      className="text-red-600 hover:text-red-700 disabled:opacity-50 text-sm font-bold transition-colors"
    >
      {pending ? "Bezig..." : children}
    </button>
  );
}

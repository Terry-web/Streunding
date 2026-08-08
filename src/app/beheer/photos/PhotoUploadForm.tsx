"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/SubmitButton";
import type { PhotoFormState } from "./actions";

export default function PhotoUploadForm({
  action,
}: {
  action: (prevState: PhotoFormState, formData: FormData) => Promise<PhotoFormState>;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="bg-white text-stone-800 rounded-2xl shadow border border-amber-100 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3"
    >
      <input
        type="file"
        name="file"
        accept="image/*"
        required
        className="text-sm flex-1 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white file:px-3 file:py-1.5 file:font-bold file:cursor-pointer"
      />
      <div className="w-full sm:w-auto">
        <SubmitButton pendingLabel="Uploaden...">Foto toevoegen</SubmitButton>
      </div>
      {state?.error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2 w-full">
          {state.error}
        </p>
      )}
    </form>
  );
}

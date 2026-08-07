"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthFormState } from "./actions";

const initialState: AuthFormState = undefined;

export default function LoginPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [signInState, signInAction, signInPending] = useActionState(signIn, initialState);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialState);

  const state = mode === "in" ? signInState : signUpState;
  const action = mode === "in" ? signInAction : signUpAction;
  const pending = mode === "in" ? signInPending : signUpPending;

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 pt-32 px-6 pb-20">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🐝</div>
          <h1 className="text-3xl font-black text-stone-900">
            {mode === "in" ? "Inloggen" : "Account maken"}
          </h1>
        </div>

        <form action={action} className="bg-white rounded-2xl shadow border border-amber-100 p-7 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-stone-700 mb-1">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-stone-700 mb-1">
              Wachtwoord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete={mode === "in" ? "current-password" : "new-password"}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {state?.error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors"
          >
            {pending ? "Bezig..." : mode === "in" ? "Inloggen" : "Account maken"}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          {mode === "in" ? "Nog geen account?" : "Al een account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "in" ? "up" : "in")}
            className="text-amber-700 font-bold hover:underline"
          >
            {mode === "in" ? "Account maken" : "Inloggen"}
          </button>
        </p>
      </div>
    </div>
  );
}

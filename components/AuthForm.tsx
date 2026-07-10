"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setError("");
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      body: formData
    });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(payload.error ?? "Something went wrong.");
      return;
    }
    router.push(params.get("next") ?? "/dashboard");
    router.refresh();
  }

  return (
    <form className="form panel" action={submit}>
      {mode === "signup" ? (
        <label className="field">
          <span>Name</span>
          <input name="name" autoComplete="name" required />
        </label>
      ) : null}
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" defaultValue={mode === "login" ? "demo@linkvault.local" : ""} required />
      </label>
      <label className="field">
        <span>Password</span>
        <input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} defaultValue={mode === "login" ? "Demo1234" : ""} required />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button disabled={loading}>{loading ? "Working..." : mode === "login" ? "Sign in" : "Create account"}</button>
    </form>
  );
}

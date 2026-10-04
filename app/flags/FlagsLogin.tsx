"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function FlagsLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    // The server decides whether this account may see the flags.
    router.refresh();
  }

  return (
    <main className="login-main" style={{ minHeight: "100vh" }}>
      <form onSubmit={handleSubmit} className="form-card">
        <h2>Sign in</h2>

        <div className="field">
          <Label htmlFor="flags-email">Email</Label>
          <Input
            id="flags-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <Label htmlFor="flags-password">Password</Label>
          <Input
            id="flags-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className={buttonVariants()} type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
          {loading ? "Signing in…" : "Sign in"}
        </button>

        {error && (
          <p className="form-status err" role="alert">
            {error}
          </p>
        )}
      </form>
    </main>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WreathMark } from "@/components/site/WreathDefs";
import WreathDefs from "@/components/site/WreathDefs";

export default function AdminLoginPage() {
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

    router.replace("/admin");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg)",
        padding: "1.5rem",
      }}
    >
      <WreathDefs />
      <form
        onSubmit={handleSubmit}
        className="form-card"
        style={{ width: "100%", maxWidth: "380px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: ".7rem", marginBottom: "1.4rem" }}>
          <WreathMark />
          <div>
            <strong style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 650, display: "block" }}>
              The Laurels Global School
            </strong>
            <span className="eyebrow" style={{ fontSize: ".7rem" }}>Admin Login</span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        {error && (
          <p className="form-status err" role="status">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

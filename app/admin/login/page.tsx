"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SchoolLogo from "@/components/site/SchoolLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="login-shell">
      <aside className="login-side">
        <div>
          <span className="badge-mark">
            <SchoolLogo />
          </span>
          <h1>The Laurels Global School</h1>
          <p>Admin panel. Update notices, photos, events, admissions enquiries and everything else on the school website.</p>
        </div>
        <small style={{ color: "rgba(255,255,255,.65)" }}>Authorised staff only</small>
      </aside>
      <main className="login-main">
      <form onSubmit={handleSubmit} className="form-card">
        <h2>Sign in</h2>
        <p className="sub">Use the email and password you were given.</p>

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
          <div className="field-toggle-wrap">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="field-toggle-btn"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.5A10.5 10.5 0 0 1 12 5c5 0 9 4.5 10 7-.5 1.1-1.4 2.6-2.7 3.9M6.7 6.7C4.7 8 3.3 9.9 2 12c1 2.5 5 7 10 7 1.4 0 2.7-.3 3.9-.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M2 12c1-2.5 5-7 10-7s9 4.5 10 7c-1 2.5-5 7-10 7s-9-4.5-10-7Z" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        {error && (
          <p className="form-status err" role="alert">
            {error}
          </p>
        )}
      </form>
      </main>
    </div>
  );
}

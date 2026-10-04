"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { saveHomeRedirect, type FlagsState } from "./actions";

type Props = {
  email: string;
  homeRedirectOn: boolean;
  homeRedirectTo: string;
};

export default function FlagsPanel({ email, homeRedirectOn, homeRedirectTo }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<FlagsState, FormData>(saveHomeRedirect, null);

  async function signOut() {
    await createClient().auth.signOut();
    router.refresh();
  }

  return (
    <main className="login-main" style={{ minHeight: "100vh" }}>
      <div className="form-card">
        <h2>Site switches</h2>
        <p className="sub">Signed in as {email}. Only you can see this page.</p>

        <form action={formAction}>
          <h3 style={{ marginTop: 0 }}>Homepage redirect</h3>
          <p className="sub">
            When on, visitors who open the homepage are sent to the page below instead. Any path on this site works,
            including one that doesn&apos;t exist (to test the 404 page).
          </p>

          <div className="field">
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" name="enabled" defaultChecked={homeRedirectOn} />
              Redirect the homepage
            </label>
          </div>
          <div className="field">
            <Label htmlFor="flags-target">Send visitors to (path)</Label>
            <Input id="flags-target" name="target" required defaultValue={homeRedirectTo} placeholder="/gallery" />
          </div>

          <button className={buttonVariants()} type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </button>

          {state?.ok && (
            <p className="form-status ok" role="status">
              Saved. The homepage is refreshed.
            </p>
          )}
          {state?.error && (
            <p className="form-status err" role="alert">
              {state.error}
            </p>
          )}
        </form>

        <p style={{ marginTop: 24 }}>
          <button type="button" className={buttonVariants({ variant: "outline" })} onClick={signOut}>
            Sign out
          </button>
        </p>
      </div>
    </main>
  );
}

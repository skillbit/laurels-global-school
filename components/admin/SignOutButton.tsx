"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buttonVariants } from "@/components/ui/button";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button className={buttonVariants({ variant: "outline-light", size: "sm" })} onClick={handleSignOut} style={{ width: "100%" }}>
      Sign Out
    </button>
  );
}

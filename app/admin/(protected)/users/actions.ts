"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function createAdminUser(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") || "").trim();
  const fullName = String(formData.get("fullName") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || password.length < 8) {
    redirect(
      `/admin/users?error=${encodeURIComponent("Email and an 8+ character password are required.")}`
    );
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    redirect(`/admin/users?error=${encodeURIComponent(error?.message || "Could not create user.")}`);
  }

  const { error: insertError } = await adminClient.from("admin_users").insert({
    id: data.user.id,
    email,
    full_name: fullName || null,
    role: "admin",
    is_active: true,
  });

  if (insertError) {
    redirect(`/admin/users?error=${encodeURIComponent(insertError.message)}`);
  }

  revalidatePath("/admin/users");
  redirect("/admin/users?success=1");
}

export async function toggleAdminActive(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const nextActive = formData.get("nextActive") === "true";

  const supabase = await createClient();
  await supabase.from("admin_users").update({ is_active: nextActive }).eq("id", id);

  revalidatePath("/admin/users");
}

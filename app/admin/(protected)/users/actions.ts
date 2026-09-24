"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { isProtectedAdmin } from "@/lib/protected-admins";

// Reads the email from the login itself, so editing admin_users can't get around the protection.
async function isProtectedId(id: string) {
  const { data } = await createAdminClient().auth.admin.getUserById(id);
  return isProtectedAdmin(data.user?.email);
}

export async function createAdminUser(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") || "").trim();
  const fullName = String(formData.get("fullName") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || password.length < 12) {
    redirect(
      `/admin/users?error=${encodeURIComponent("Email and a password of at least 12 characters are required.")}`
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
  const me = await requireAdmin();

  const id = String(formData.get("id"));
  const nextActive = formData.get("nextActive") === "true";

  const supabase = await createClient();

  if (!nextActive) {
    if (await isProtectedId(id)) {
      redirect(`/admin/users?error=${encodeURIComponent("The school owner's account can't be disabled.")}`);
    }
    // Never let the panel lock everyone out: no self-disable, and always keep one active admin.
    if (id === me.id) {
      redirect(`/admin/users?error=${encodeURIComponent("You can't disable your own account. Ask another admin to do it.")}`);
    }
    const { count } = await supabase
      .from("admin_users")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);
    if ((count ?? 0) <= 1) {
      redirect(`/admin/users?error=${encodeURIComponent("At least one admin account must stay active.")}`);
    }
  }

  await supabase.from("admin_users").update({ is_active: nextActive }).eq("id", id);

  revalidatePath("/admin/users");
}

export async function deleteAdminUser(formData: FormData) {
  const me = await requireAdmin();
  const id = String(formData.get("id"));
  const fail = (message: string): never => redirect(`/admin/users?error=${encodeURIComponent(message)}`);

  if (id === me.id) fail("You can't delete your own account. Ask another admin to do it.");
  if (await isProtectedId(id)) fail("The school owner's account can't be deleted.");

  const supabase = await createClient();
  const { data: target } = await supabase.from("admin_users").select("id, is_active").eq("id", id).maybeSingle();
  if (!target) fail("That admin account no longer exists.");

  // Same rule as disabling: always keep at least one active admin.
  if (target?.is_active) {
    const { count } = await supabase
      .from("admin_users")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);
    if ((count ?? 0) <= 1) fail("At least one admin account must stay active.");
  }

  // Deleting the login also removes its admin_users row (on delete cascade).
  const { error } = await createAdminClient().auth.admin.deleteUser(id);
  if (error) fail(error.message);

  revalidatePath("/admin/users");
  redirect("/admin/users?success=deleted");
}

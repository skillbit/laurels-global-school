"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

function refresh() {
  revalidatePath("/admin/careers/applications");
  revalidatePath("/admin");
}

export async function toggleApplicationStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const next = String(formData.get("next")) === "reviewed" ? "reviewed" : "new";

  const supabase = await createClient();
  await supabase.from("career_applications").update({ status: next }).eq("id", id);

  refresh();
}

export async function deleteApplication(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const supabase = await createClient();
  const { data: existing } = await supabase.from("career_applications").select("resume_path").eq("id", id).maybeSingle();
  if (existing?.resume_path) await supabase.storage.from("private").remove([existing.resume_path]);
  await supabase.from("career_applications").delete().eq("id", id);

  refresh();
}

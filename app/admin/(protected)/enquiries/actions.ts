"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function toggleEnquiryStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const next = String(formData.get("next")) === "contacted" ? "contacted" : "new";

  const supabase = await createClient();
  await supabase.from("enquiries").update({ status: next }).eq("id", id);

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function deleteEnquiry(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const supabase = await createClient();
  await supabase.from("enquiries").delete().eq("id", id);

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

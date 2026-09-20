"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { DOCUMENT_CATEGORIES } from "@/lib/documents";

export type DocumentInput = {
  title: string;
  category: string;
  published_date: string;
  is_published: boolean;
  file_path: string;
};

function refresh() {
  revalidatePath("/admin/documents");
  revalidatePath("/admin");
  revalidatePath("/documents");
}

export async function saveDocument(id: string | null, input: DocumentInput): Promise<{ error?: string }> {
  await requireAdmin();

  const title = input.title.trim();
  if (!title) return { error: "Title is required." };
  if (title.length > 150) return { error: "Title must be under 150 characters." };
  if (!DOCUMENT_CATEGORIES.some((c) => c.value === input.category)) return { error: "Choose a category." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.published_date)) return { error: "Choose a valid date." };
  // Files are uploaded from the browser (avoids the Server Action body limit);
  // only accept paths inside documents/.
  if (!/^documents\/[\w-]+\.\w+$/.test(input.file_path)) return { error: "Upload a file first." };

  const fields = {
    title,
    category: input.category,
    published_date: input.published_date,
    is_published: input.is_published,
    file_path: input.file_path,
  };

  const supabase = await createClient();

  if (id) {
    const { data: existing } = await supabase.from("documents").select("file_path").eq("id", id).maybeSingle();
    const { error } = await supabase
      .from("documents")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { error: error.message };
    if (existing?.file_path && existing.file_path !== fields.file_path) {
      await supabase.storage.from("public").remove([existing.file_path]);
    }
  } else {
    const { error } = await supabase.from("documents").insert(fields);
    if (error) return { error: error.message };
  }

  refresh();
  return {};
}

export async function deleteDocument(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));

  const supabase = await createClient();
  const { data: existing } = await supabase.from("documents").select("file_path").eq("id", id).maybeSingle();
  if (existing?.file_path) await supabase.storage.from("public").remove([existing.file_path]);
  await supabase.from("documents").delete().eq("id", id);

  refresh();
  redirect("/admin/documents?success=deleted");
}

export async function toggleDocumentPublished(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const next = formData.get("next") === "true";

  const supabase = await createClient();
  await supabase.from("documents").update({ is_published: next }).eq("id", id);

  refresh();
}

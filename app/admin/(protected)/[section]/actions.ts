"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { getAdminSection, type AdminSection } from "@/lib/admin-sections";

export type EntryInput = {
  values: Record<string, string>;
  is_published: boolean;
  file_path: string | null;
};

function refresh(section: AdminSection) {
  revalidatePath(`/admin/${section.key}`);
  revalidatePath("/admin");
  for (const path of section.paths) revalidatePath(path);
}

// Checks every field against the section's description and returns the row to store.
function readRow(section: AdminSection, input: EntryInput): { error: string } | { row: Record<string, unknown> } {
  const row: Record<string, unknown> = { is_published: Boolean(input.is_published) };

  for (const field of section.fields) {
    const value = String(input.values?.[field.name] ?? "").trim();
    if (field.required && !value) return { error: `${field.label} is required.` };

    if (field.type === "number") {
      const n = value ? Number(value) : 0;
      if (!Number.isInteger(n) || n < 0 || n > 9999) return { error: `${field.label}: enter a whole number from 0 to 9999.` };
      row[field.name] = n;
    } else if (field.type === "date") {
      if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return { error: "Choose a valid date." };
      row[field.name] = value || null;
    } else if (field.type === "select") {
      if (!field.options?.some((o) => o.value === value)) return { error: `Choose an option for “${field.label}”.` };
      row[field.name] = value;
    } else {
      if (field.max && value.length > field.max) return { error: `${field.label} must be under ${field.max} characters.` };
      row[field.name] = value || null;
    }
  }

  if (section.file) {
    // Files are uploaded from the browser; only accept paths inside this section's folder.
    const inFolder = new RegExp(`^${section.file.folder}/[\\w-]+\\.\\w+$`);
    if (input.file_path !== null && !inFolder.test(input.file_path)) return { error: "Invalid file." };
    row[section.file.column] = input.file_path;
  }
  return { row };
}

export async function saveEntry(sectionKey: string, id: string | null, input: EntryInput): Promise<{ error?: string }> {
  await requireAdmin();
  const section = getAdminSection(sectionKey);
  if (!section) return { error: "Unknown section." };

  const result = readRow(section, input);
  if ("error" in result) return { error: result.error };

  const supabase = await createClient();
  if (id) {
    const fileColumn = section.file?.column;
    const { data: existing } = fileColumn
      ? await supabase.from(section.table).select("*").eq("id", id).maybeSingle()
      : { data: null };
    const { error } = await supabase
      .from(section.table)
      .update({ ...result.row, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { error: error.message };
    const oldPath = fileColumn ? (existing?.[fileColumn] as string | null) : null;
    if (fileColumn && oldPath && oldPath !== result.row[fileColumn]) {
      await supabase.storage.from("public").remove([oldPath]);
    }
  } else {
    const { error } = await supabase.from(section.table).insert(result.row);
    if (error) return { error: error.message };
  }

  refresh(section);
  return {};
}

export async function deleteEntry(sectionKey: string, formData: FormData) {
  await requireAdmin();
  const section = getAdminSection(sectionKey);
  if (!section) redirect("/admin");
  const id = String(formData.get("id"));

  const supabase = await createClient();
  if (section.file) {
    const { data: existing } = await supabase.from(section.table).select("*").eq("id", id).maybeSingle();
    const path = existing?.[section.file.column] as string | null | undefined;
    if (path) await supabase.storage.from("public").remove([path]);
  }
  await supabase.from(section.table).delete().eq("id", id);

  refresh(section);
  redirect(`/admin/${section.key}?success=deleted`);
}

export async function toggleEntryPublished(sectionKey: string, formData: FormData) {
  await requireAdmin();
  const section = getAdminSection(sectionKey);
  if (!section) return;
  const id = String(formData.get("id"));
  const next = formData.get("next") === "true";

  const supabase = await createClient();
  await supabase.from(section.table).update({ is_published: next }).eq("id", id);

  refresh(section);
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { PAGE_IMAGE_SLOTS, pageImageFolder, slotOfFile, type PageKey } from "@/lib/page-images";

function findSlot(page: string, slot: string) {
  const config = PAGE_IMAGE_SLOTS[page as PageKey];
  if (!config || !config.slots.some((s) => s.key === slot)) return null;
  return config;
}

// Deletes the files stored for one slot, except `keep`.
async function removeSlotFiles(page: PageKey, slot: string, keep?: string) {
  const supabase = await createClient();
  const folder = pageImageFolder(page);
  const { data } = await supabase.storage.from("public").list(folder, { limit: 200 });
  const old = (data ?? [])
    .filter((f) => slotOfFile(f.name) === slot && `${folder}/${f.name}` !== keep)
    .map((f) => `${folder}/${f.name}`);
  if (old.length > 0) await supabase.storage.from("public").remove(old);
}

/** Called after the browser has uploaded a new photo for a slot. */
export async function setPageImage(page: string, slot: string, path: string): Promise<{ error?: string }> {
  await requireAdmin();
  const config = findSlot(page, slot);
  if (!config) return { error: "Unknown photo spot." };
  const valid = new RegExp(`^page-images/${page}/${slot}--[\\w-]+\\.(jpg|jpeg|png|webp)$`);
  if (!valid.test(path)) return { error: "Upload the photo first." };

  await removeSlotFiles(page as PageKey, slot, path);
  revalidatePath(config.path);
  revalidatePath("/admin/page-images");
  return {};
}

/** Removes a slot's photo; the site shows the placeholder again. */
export async function removePageImage(page: string, slot: string): Promise<{ error?: string }> {
  await requireAdmin();
  const config = findSlot(page, slot);
  if (!config) return { error: "Unknown photo spot." };

  await removeSlotFiles(page as PageKey, slot);
  revalidatePath(config.path);
  revalidatePath("/admin/page-images");
  return {};
}

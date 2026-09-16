"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function createGalleryImage(data: {
  image_path: string;
  caption: string;
  alt_text: string;
}) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: maxRow } = await supabase
    .from("gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("gallery_images").insert({
    image_path: data.image_path,
    caption: data.caption || null,
    alt_text: data.alt_text || null,
    sort_order: nextOrder,
    is_published: true,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function deleteGalleryImage(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const imagePath = String(formData.get("image_path"));

  const supabase = await createClient();
  await supabase.storage.from("public").remove([imagePath]);
  await supabase.from("gallery_images").delete().eq("id", id);

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function toggleGalleryPublished(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const next = formData.get("next") === "true";

  const supabase = await createClient();
  await supabase.from("gallery_images").update({ is_published: next }).eq("id", id);

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

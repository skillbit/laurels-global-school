import { createPublicClient } from "@/lib/supabase/public";

// Fixed photo spots on public pages, changed from Admin -> Page Images. Each photo is
// stored in the public bucket as page-images/<page>/<slot>--<random>.<ext>; a spot
// without a photo shows a placeholder on the site.
export const PAGE_IMAGE_SLOTS = {
  academics: {
    title: "Academics page",
    path: "/academics",
    slots: [
      { key: "stage-1", label: "Pre-Primary (Nursery – UKG)", hint: "Beside the Pre-Primary stage" },
      { key: "stage-2", label: "Primary (Classes 1 – 5)", hint: "Beside the Primary stage" },
      { key: "stage-3", label: "Middle School (Classes 6 – 8)", hint: "Beside the Middle School stage" },
      { key: "stage-4", label: "Secondary (Classes 9 – 10)", hint: "Beside the Secondary stage" },
      { key: "activities-1", label: "Activities: large photo", hint: "Tall arch-shaped photo in “Co-curricular & Activities”" },
      { key: "activities-2", label: "Activities: top-right photo", hint: "Small photo in “Co-curricular & Activities”" },
      { key: "activities-3", label: "Activities: bottom-right photo", hint: "Small photo in “Co-curricular & Activities”" },
    ],
  },
} as const;

export type PageKey = keyof typeof PAGE_IMAGE_SLOTS;
export const PAGE_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const PAGE_IMAGE_ACCEPT = ".jpg,.jpeg,.png,.webp";

export function pageImageFolder(page: PageKey) {
  return `page-images/${page}`;
}

/** The slot a stored file belongs to, from its name "<slot>--<random>.<ext>". */
export function slotOfFile(name: string) {
  return name.split("--")[0];
}

/** Public URL of the current photo for each slot of a page (missing slots are absent). */
export async function getPageImages(page: PageKey): Promise<Record<string, string>> {
  const client = createPublicClient();
  const folder = pageImageFolder(page);
  const { data } = await client.storage.from("public").list(folder, {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });
  const urls: Record<string, string> = {};
  for (const file of data ?? []) {
    const slot = slotOfFile(file.name);
    // Newest first, so if an old file was left behind the latest upload wins.
    if (!urls[slot]) urls[slot] = client.storage.from("public").getPublicUrl(`${folder}/${file.name}`).data.publicUrl;
  }
  return urls;
}

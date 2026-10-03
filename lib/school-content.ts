import { createPublicClient } from "@/lib/supabase/public";
import { STAGE_OPTIONS, DISCLOSURE_SECTIONS } from "@/lib/admin-sections";

// Public reads of the lists managed in the admin (subjects, co-curricular, daily
// activities, mandatory disclosure). Until migration 0005 has been run the tables
// are missing, so each one falls back to what the site showed before.

const DEFAULT_SUBJECTS = [
  "English", "Hindi", "Mathematics", "Science", "Social Science",
  "Computer Science", "Environmental Studies", "Art & Craft",
  "Physical Education", "Value Education",
];
const DEFAULT_ACTIVITIES = [
  "Sports", "Dance & Music", "Elocution & Debate", "Science Exhibition",
  "Art Club", "Annual Day", "Field Trips",
];

const publicUrl = (path: string | null) =>
  path ? createPublicClient().storage.from("public").getPublicUrl(path).data.publicUrl : null;

export type SubjectGroup = { label: string; subjects: string[] };

/** Subjects grouped by stage, in stage order; groups with no subjects are left out. */
export async function getSubjectGroups(): Promise<SubjectGroup[]> {
  const { data, error } = await createPublicClient()
    .from("subjects")
    .select("name, stage")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) return [{ label: STAGE_OPTIONS[0].label, subjects: DEFAULT_SUBJECTS }];
  return STAGE_OPTIONS.map((s) => ({
    label: s.label,
    subjects: data.filter((d) => d.stage === s.value).map((d) => d.name as string),
  })).filter((g) => g.subjects.length > 0);
}

export type Activity = { name: string; description: string | null; photoUrl: string | null };

export async function getCoCurricular(): Promise<Activity[]> {
  const { data, error } = await createPublicClient()
    .from("co_curricular")
    .select("name, description, photo_path")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) return DEFAULT_ACTIVITIES.map((name) => ({ name, description: null, photoUrl: null }));
  return data.map((d) => ({ name: d.name, description: d.description, photoUrl: publicUrl(d.photo_path) }));
}

export type DailyActivity = {
  id: string;
  date: string;
  title: string;
  classLabel: string | null;
  description: string | null;
  photoUrl: string | null;
};

/** Newest first. */
export async function getDailyActivities(limit: number): Promise<DailyActivity[]> {
  const { data } = await createPublicClient()
    .from("daily_activities")
    .select("id, activity_date, title, class_label, description, photo_path")
    .eq("is_published", true)
    .order("activity_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map((d) => ({
    id: d.id,
    date: d.activity_date,
    title: d.title,
    classLabel: d.class_label,
    description: d.description,
    photoUrl: publicUrl(d.photo_path),
  }));
}

export type DisclosureItem = { id: string; label: string; value: string | null; fileUrl: string | null };
export type DisclosureSection = { label: string; items: DisclosureItem[] };

/** Filled-in disclosure rows, grouped in the CBSE section order. */
export async function getDisclosureSections(): Promise<DisclosureSection[]> {
  const { data } = await createPublicClient()
    .from("disclosures")
    .select("id, section, label, value, file_path")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  const rows = (data ?? []).filter((d) => d.value || d.file_path);
  return DISCLOSURE_SECTIONS.map((s) => ({
    label: s.label,
    items: rows
      .filter((d) => d.section === s.value)
      .map((d) => ({ id: d.id, label: d.label, value: d.value, fileUrl: publicUrl(d.file_path) })),
  })).filter((s) => s.items.length > 0);
}

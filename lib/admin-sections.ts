// Simple admin lists (subjects, co-curricular, daily activities, mandatory disclosure)
// share one set of pages under /admin/<key>, driven by this description of each list.
export type SectionField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "number" | "select";
  required?: boolean;
  max?: number;
  placeholder?: string;
  options?: readonly { value: string; label: string }[];
  /** Date fields: start on today's date for a new entry. */
  today?: boolean;
};

export type SectionFile = {
  column: "photo_path" | "file_path";
  /** Folder in the public bucket; files are saved as <folder>/<uuid>.<ext>. */
  folder: string;
  label: string;
  accept: string;
  maxBytes: number;
  image: boolean;
};

export type AdminSection = {
  key: string;
  table: string;
  title: string;
  singular: string;
  intro: string;
  empty: string;
  fields: readonly SectionField[];
  file?: SectionFile;
  /** Columns shown in the list: the bold title, a line under it, and a short tag. */
  titleField: string;
  subField?: string;
  tagField?: string;
  /** Select field whose option order groups the list (e.g. stage, section). */
  groupField?: string;
  order: readonly { column: string; ascending: boolean }[];
  publishedLabel: string;
  /** Public pages to refresh after a change. */
  paths: readonly string[];
};

export const STAGE_OPTIONS = [
  { value: "all", label: "All stages" },
  { value: "pre_primary", label: "Pre-Primary" },
  { value: "primary", label: "Primary" },
  { value: "middle", label: "Middle School" },
  { value: "secondary", label: "Secondary" },
] as const;

export const DISCLOSURE_SECTIONS = [
  { value: "general", label: "A. General information" },
  { value: "documents", label: "B. Documents and information" },
  { value: "academics", label: "C. Results and academics" },
  { value: "staff", label: "D. Staff (teaching)" },
  { value: "infrastructure", label: "E. School infrastructure" },
] as const;

const SORT_FIELD: SectionField = { name: "sort_order", label: "Position in the list (smaller numbers come first)", type: "number" };
const IMAGE_ACCEPT = ".jpg,.jpeg,.png,.webp";

export const ADMIN_SECTIONS: readonly AdminSection[] = [
  {
    key: "subjects",
    table: "subjects",
    title: "Subjects",
    singular: "Subject",
    intro: "The “Core subjects” list on the Academics page. Choose a stage to group a subject under it, or leave it on “All stages”.",
    empty: "No subjects yet. Add the subjects taught at the school.",
    fields: [
      { name: "name", label: "Subject", type: "text", required: true, max: 60, placeholder: "e.g. Mathematics" },
      { name: "stage", label: "Taught in", type: "select", required: true, options: STAGE_OPTIONS },
      SORT_FIELD,
    ],
    titleField: "name",
    tagField: "stage",
    groupField: "stage",
    order: [{ column: "sort_order", ascending: true }, { column: "name", ascending: true }],
    publishedLabel: "Published (visible on the Academics page)",
    paths: ["/academics"],
  },
  {
    key: "co-curricular",
    table: "co_curricular",
    title: "Co-curricular",
    singular: "Activity",
    intro: "Clubs, sports and activities on the Academics page. A name alone shows as a label; add a description or photo to give it a card.",
    empty: "No activities yet. Add the clubs, sports and activities the school offers.",
    fields: [
      { name: "name", label: "Activity", type: "text", required: true, max: 60, placeholder: "e.g. Dance & Music" },
      { name: "description", label: "Short description (optional)", type: "textarea", max: 300 },
      SORT_FIELD,
    ],
    file: { column: "photo_path", folder: "co-curricular", label: "Photo (optional, max 5 MB)", accept: IMAGE_ACCEPT, maxBytes: 5 * 1024 * 1024, image: true },
    titleField: "name",
    subField: "description",
    order: [{ column: "sort_order", ascending: true }, { column: "name", ascending: true }],
    publishedLabel: "Published (visible on the Academics page)",
    paths: ["/academics"],
  },
  {
    key: "daily-activities",
    table: "daily_activities",
    title: "Daily Activities",
    singular: "Daily Activity",
    intro: "What happened at school today. The newest day shows on the home page as “Today at Laurels”; all of them are on the Daily activities page.",
    empty: "No daily activities yet. Add what the classes did today.",
    fields: [
      { name: "activity_date", label: "Date", type: "date", required: true, today: true },
      { name: "title", label: "Title", type: "text", required: true, max: 120, placeholder: "e.g. Class 3 planted saplings in the school garden" },
      { name: "class_label", label: "Class or group (optional)", type: "text", max: 60, placeholder: "e.g. Class 3, Pre-Primary, Whole school" },
      { name: "description", label: "Details (optional)", type: "textarea", max: 1000 },
    ],
    file: { column: "photo_path", folder: "daily-activities", label: "Photo (optional, max 5 MB)", accept: IMAGE_ACCEPT, maxBytes: 5 * 1024 * 1024, image: true },
    titleField: "title",
    subField: "class_label",
    tagField: "activity_date",
    order: [{ column: "activity_date", ascending: false }, { column: "created_at", ascending: false }],
    publishedLabel: "Published (visible on the home page and the Daily activities page)",
    paths: ["/", "/activities"],
  },
  {
    key: "disclosure",
    table: "disclosures",
    title: "Mandatory Disclosure",
    singular: "Disclosure Item",
    intro: "The CBSE mandatory public disclosure page. Fill in the value, attach the certificate, or both. A row with neither stays hidden on the public page.",
    empty: "No items yet. Run supabase/migrations/0005_page_content.sql to add the standard CBSE headings, or add your own.",
    fields: [
      { name: "section", label: "Section", type: "select", required: true, options: DISCLOSURE_SECTIONS },
      { name: "label", label: "Item", type: "text", required: true, max: 160, placeholder: "e.g. Principal name" },
      { name: "value", label: "Value (text, a number or an https:// link)", type: "textarea", max: 600 },
      SORT_FIELD,
    ],
    file: {
      column: "file_path",
      folder: "disclosure",
      label: "Document (optional: PDF or image, max 10 MB)",
      accept: ".pdf,.jpg,.jpeg,.png",
      maxBytes: 10 * 1024 * 1024,
      image: false,
    },
    titleField: "label",
    subField: "value",
    tagField: "section",
    groupField: "section",
    order: [{ column: "sort_order", ascending: true }, { column: "created_at", ascending: true }],
    publishedLabel: "Published (visible on the Mandatory disclosure page)",
    paths: ["/mandatory-disclosure"],
  },
];

export function getAdminSection(key: string) {
  return ADMIN_SECTIONS.find((s) => s.key === key);
}

/** Columns to read for a section's list and edit form. */
export function sectionColumns(section: AdminSection) {
  return ["id", ...section.fields.map((f) => f.name), ...(section.file ? [section.file.column] : []), "is_published"].join(", ");
}

/** Text shown for a stored value: the option's label for selects, a readable date for dates. */
export function displayValue(section: AdminSection, name: string, value: unknown) {
  if (value === null || value === undefined || value === "") return "";
  const field = section.fields.find((f) => f.name === name);
  if (field?.type === "select") return field.options?.find((o) => o.value === value)?.label ?? String(value);
  if (field?.type === "date") {
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }
  return String(value);
}

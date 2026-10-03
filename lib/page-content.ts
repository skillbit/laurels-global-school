import { createPublicClient } from "@/lib/supabase/public";

// Every piece of public page text the office can change in Admin -> Page Text.
// `text` is what the site shows until someone saves something else; saved text
// lives in the page_content table under the same key.
type TextField = { key: string; label: string; text: string; long?: boolean; max?: number };
type TextGroup = { key: string; title: string; hint: string; paths: string[]; fields: readonly TextField[] };

const STAGE_FIELDS = [
  { key: "stage.1.title", label: "Stage 1: name", text: "Pre-Primary" },
  { key: "stage.1.grades", label: "Stage 1: classes", text: "Nursery – UKG" },
  { key: "stage.1.text", label: "Stage 1: description", text: "Play-based learning that builds early language, motor skills and curiosity.", long: true },
  { key: "stage.2.title", label: "Stage 2: name", text: "Primary" },
  { key: "stage.2.grades", label: "Stage 2: classes", text: "Classes 1 – 5" },
  { key: "stage.2.text", label: "Stage 2: description", text: "Foundational literacy, numeracy and inquiry-based learning across core subjects.", long: true },
  { key: "stage.3.title", label: "Stage 3: name", text: "Middle School" },
  { key: "stage.3.grades", label: "Stage 3: classes", text: "Classes 6 – 8" },
  { key: "stage.3.text", label: "Stage 3: description", text: "Wider subject exposure with a focus on conceptual clarity and project work.", long: true },
  { key: "stage.4.title", label: "Stage 4: name", text: "Secondary" },
  { key: "stage.4.grades", label: "Stage 4: classes", text: "Classes 9 – 10" },
  { key: "stage.4.text", label: "Stage 4: description", text: "CBSE curriculum with focused preparation for board examinations.", long: true },
] as const;

export const PAGE_TEXT = [
  {
    key: "shared",
    title: "Board and stages",
    hint: "Shown on both the home page and the Academics page, so they always match.",
    paths: ["/", "/academics"],
    fields: [
      { key: "board.label", label: "Board badge (short)", text: "CBSE", max: 20 },
      { key: "board.note", label: "Board line beside the badge", text: "Curriculum of the Central Board of Secondary Education (CBSE)", max: 160 },
      ...STAGE_FIELDS,
    ],
  },
  {
    key: "home",
    title: "Home page",
    hint: "The main quote, banner and quick facts are in Site Settings.",
    paths: ["/"],
    fields: [
      { key: "home.badge.title", label: "Small card on the photos: title", text: "Admissions open", max: 40 },
      { key: "home.badge.sub", label: "Small card on the photos: line below", text: "Nursery to Class 10 · CBSE", max: 60 },
      { key: "home.today.title", label: "Daily activities heading", text: "Today at Laurels", max: 60 },
      { key: "home.academics.title", label: "Academics heading", text: "A Path from Nursery to Class 10" },
      { key: "home.academics.text", label: "Academics paragraph", text: "Four stages, one CBSE curriculum. Each stage builds on the last, from learning through play to focused preparation for the Class 10 board examinations.", long: true },
      { key: "home.why.title", label: "Crimson band heading", text: "A School Built Around the Child" },
      { key: "home.why.text", label: "Crimson band line", text: "Four things we teach alongside every subject." },
      { key: "home.why.1.title", label: "Card 1: title", text: "Confidence" },
      { key: "home.why.1.text", label: "Card 1: text", text: "Building self-belief through supported, real learning experiences.", long: true },
      { key: "home.why.2.title", label: "Card 2: title", text: "Curiosity" },
      { key: "home.why.2.text", label: "Card 2: text", text: "Encouraging students to ask questions and explore ideas.", long: true },
      { key: "home.why.3.title", label: "Card 3: title", text: "Responsibility" },
      { key: "home.why.3.text", label: "Card 3: text", text: "Instilling strong values and accountability in everyday choices.", long: true },
      { key: "home.why.4.title", label: "Card 4: title", text: "Technology & Life Skills" },
      { key: "home.why.4.text", label: "Card 4: text", text: "Practical, future-ready skills alongside academic learning.", long: true },
      { key: "home.cta.title", label: "Admissions panel heading", text: "Admissions are open" },
      { key: "home.cta.text", label: "Admissions panel paragraph", text: "Nursery to Class 10 for the current academic year. Visit the campus, call the office, or send an enquiry and we'll get back to you.", long: true },
    ],
  },
  {
    key: "academics",
    title: "Academics page",
    hint: "Subjects and activities have their own lists in the menu. Photos are in Page Images.",
    paths: ["/academics"],
    fields: [
      { key: "academics.title", label: "Page title", text: "From Nursery to Class 10" },
      { key: "academics.intro", label: "Line under the title", text: "A CBSE curriculum that grows with the child, in four stages that build on each other.", long: true },
      { key: "academics.journey.title", label: "Stages heading", text: "Four Stages, One Curriculum" },
      { key: "academics.subjects.title", label: "Subjects heading", text: "What Students Study" },
      { key: "academics.subjects.text", label: "Subjects line", text: "Subjects follow the CBSE framework and deepen stage by stage.", long: true },
      { key: "academics.activities.title", label: "Activities heading", text: "Co-curricular & Activities" },
      { key: "academics.activities.text", label: "Activities line", text: "Sport, the arts and events through the year help every child find something they love.", long: true },
      { key: "academics.facilities.title", label: "Facilities heading", text: "Built for Learning" },
      { key: "academics.facility.1.title", label: "Facility 1: title", text: "Smart Classrooms" },
      { key: "academics.facility.1.text", label: "Facility 1: text", text: "Technology-supported classrooms designed to make lessons interactive and engaging.", long: true },
      { key: "academics.facility.2.title", label: "Facility 2: title", text: "Library & Reading Corner" },
      { key: "academics.facility.2.text", label: "Facility 2: text", text: "A quiet space to build reading habits and support independent learning.", long: true },
      { key: "academics.facility.3.title", label: "Facility 3: title", text: "Science & Computer Labs" },
      { key: "academics.facility.3.text", label: "Facility 3: text", text: "Hands-on spaces for experiments and early technology skills.", long: true },
      { key: "academics.facility.4.title", label: "Facility 4: title", text: "Sports & Play Areas" },
      { key: "academics.facility.4.text", label: "Facility 4: text", text: "Outdoor space for physical activity, games and team sports.", long: true },
      { key: "academics.cta.title", label: "Closing panel heading", text: "Admissions are open" },
      { key: "academics.cta.text", label: "Closing panel paragraph", text: "Nursery to Class 10. See how admissions work, or send an enquiry and the office will call you back.", long: true },
    ],
  },
  {
    key: "admissions",
    title: "Admissions page",
    hint: "The quick facts panel is in Site Settings.",
    paths: ["/admissions"],
    fields: [
      { key: "admissions.title", label: "Page title", text: "Joining The Laurels" },
      { key: "admissions.intro", label: "Line under the title", text: "Four simple steps from the first call to a confirmed seat.", long: true },
      { key: "admissions.step.1.title", label: "Step 1: title", text: "Enquire" },
      { key: "admissions.step.1.text", label: "Step 1: text", text: "Call the school office, or visit the campus near Jln College on NH2, Pahleja Road. You can also submit the enquiry form on this page.", long: true },
      { key: "admissions.step.2.title", label: "Step 2: title", text: "Share Details" },
      { key: "admissions.step.2.text", label: "Step 2: text", text: "Tell us the child's age and the grade you're applying for, along with basic documents.", long: true },
      { key: "admissions.step.3.title", label: "Step 3: title", text: "Interaction" },
      { key: "admissions.step.3.text", label: "Step 3: text", text: "A short, age-appropriate interaction with the child, and parents for younger grades.", long: true },
      { key: "admissions.step.4.title", label: "Step 4: title", text: "Confirmation" },
      { key: "admissions.step.4.text", label: "Step 4: text", text: "Seat confirmation and fee details are shared directly by the school office.", long: true },
    ],
  },
  {
    key: "about",
    title: "About page",
    hint: "The mission statement is in Site Settings. Staff and History have their own lists.",
    paths: ["/about"],
    fields: [
      { key: "about.title", label: "Page title", text: "About The Laurels" },
      { key: "about.intro", label: "Line under the title", text: "Our mission, our values, and the people behind the school.", long: true },
      { key: "about.values.title", label: "Values heading", text: "Eight Things Every Child Grows In" },
      { key: "about.value.1.title", label: "Value 1: title", text: "Confidence" },
      { key: "about.value.1.text", label: "Value 1: text", text: "Building self-belief through supported, real learning experiences.", long: true },
      { key: "about.value.2.title", label: "Value 2: title", text: "Curiosity" },
      { key: "about.value.2.text", label: "Value 2: text", text: "Encouraging students to ask questions and explore ideas.", long: true },
      { key: "about.value.3.title", label: "Value 3: title", text: "Responsibility" },
      { key: "about.value.3.text", label: "Value 3: text", text: "Instilling strong values and accountability in everyday choices.", long: true },
      { key: "about.value.4.title", label: "Value 4: title", text: "Communication" },
      { key: "about.value.4.text", label: "Value 4: text", text: "Helping students express ideas clearly, in speech and writing.", long: true },
      { key: "about.value.5.title", label: "Value 5: title", text: "Creativity" },
      { key: "about.value.5.text", label: "Value 5: text", text: "Space for original thinking across art, science and ideas.", long: true },
      { key: "about.value.6.title", label: "Value 6: title", text: "Critical Thinking" },
      { key: "about.value.6.text", label: "Value 6: text", text: "Learning to reason, question and evaluate with care.", long: true },
      { key: "about.value.7.title", label: "Value 7: title", text: "Leadership" },
      { key: "about.value.7.text", label: "Value 7: text", text: "Preparing students to guide, collaborate and take initiative.", long: true },
      { key: "about.value.8.title", label: "Value 8: title", text: "Technology & Life Skills" },
      { key: "about.value.8.text", label: "Value 8: text", text: "Practical, future-ready skills alongside academic learning.", long: true },
    ],
  },
] as const satisfies readonly TextGroup[];

export type PageTextKey = (typeof PAGE_TEXT)[number]["fields"][number]["key"];
export type PageText = Record<PageTextKey, string>;

/** Longest text a field accepts: its own limit, else 400 for paragraphs and 100 for one-liners. */
export function maxLength(field: TextField) {
  return field.max ?? (field.long ? 400 : 100);
}

const ALL_FIELDS: readonly TextField[] = PAGE_TEXT.flatMap((g) => g.fields as readonly TextField[]);

/** Current text for every key: what the office saved, otherwise the built-in text. */
export async function getPageText(): Promise<PageText> {
  const text = Object.fromEntries(ALL_FIELDS.map((f) => [f.key, f.text])) as PageText;
  // Before migration 0005 has been run the table is missing: keep the built-in text.
  const { data } = await createPublicClient().from("page_content").select("key, value");
  for (const row of data ?? []) {
    if (row.key in text && row.value) text[row.key as PageTextKey] = row.value;
  }
  return text;
}

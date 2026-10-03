import { createClient } from "@/lib/supabase/server";
import { PAGE_TEXT, getPageText, maxLength } from "@/lib/page-content";
import { savePageText } from "./actions";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function AdminPageTextPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const text = await getPageText();
  // Only checks that the table exists, to explain a missing migration.
  const supabase = await createClient();
  const { error: tableError } = await supabase.from("page_content").select("key").limit(1);

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Page Text</h1>
      </div>
      <p style={{ color: "var(--ink-soft)", maxWidth: "64ch", marginBottom: "1.4rem" }}>
        Headings and paragraphs on the public pages. Each box shows what is live right now. Change the words and save; clear a box and
        save to go back to the original text.
      </p>

      {tableError && (
        <p className="form-status err" role="alert">
          Saving isn&apos;t ready yet: {tableError.message}. Run supabase/migrations/0005_page_content.sql in the Supabase SQL editor.
        </p>
      )}
      {params.error && (
        <p className="form-status err" role="alert">
          {params.error}
        </p>
      )}

      <nav className="pt-jump" aria-label="Pages">
        {PAGE_TEXT.map((g) => (
          <a key={g.key} className={buttonVariants({ variant: "outline", size: "sm" })} href={`#${g.key}`}>
            {g.title}
          </a>
        ))}
      </nav>

      {PAGE_TEXT.map((group) => (
        <form
          key={group.key}
          id={group.key}
          action={savePageText.bind(null, group.key)}
          className="form-card pt-group"
          style={{ maxWidth: "720px" }}
        >
          <h2 style={{ fontSize: "1.15rem" }}>{group.title}</h2>
          <p style={{ color: "var(--ink-soft)", fontSize: ".9rem", marginBottom: ".8rem" }}>{group.hint}</p>
          {params.success === group.key && (
            <p className="form-status ok" role="status">
              {group.title} saved.
            </p>
          )}
          {group.fields.map((f) => (
            <div className="field" key={f.key}>
              <Label htmlFor={f.key}>{f.label}</Label>
              {"long" in f && f.long ? (
                <Textarea id={f.key} name={f.key} maxLength={maxLength(f)} defaultValue={text[f.key]} placeholder={f.text} style={{ minHeight: "84px" }} />
              ) : (
                <Input id={f.key} name={f.key} type="text" maxLength={maxLength(f)} defaultValue={text[f.key]} placeholder={f.text} />
              )}
            </div>
          ))}
          <button className={buttonVariants()} type="submit">
            Save {group.title.toLowerCase()}
          </button>
        </form>
      ))}
    </>
  );
}

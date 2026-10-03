import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { getAdminSection, sectionColumns, displayValue } from "@/lib/admin-sections";
import { deleteEntry, toggleEntryPublished } from "./actions";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MESSAGES: Record<string, string> = {
  saved: "Saved.",
  deleted: "Deleted.",
};

type Row = Record<string, unknown> & { id: string; is_published: boolean };

export default async function AdminSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { section: key } = await params;
  const query = await searchParams;
  const section = getAdminSection(key);
  if (!section) notFound();

  const supabase = await createClient();
  let request = supabase.from(section.table).select(sectionColumns(section));
  for (const o of section.order) request = request.order(o.column, { ascending: o.ascending });
  const { data, error } = await request;
  const rows = (data ?? []) as unknown as Row[];

  // Keep groups (stage, disclosure section) together, in the order of their options.
  const group = section.fields.find((f) => f.name === section.groupField);
  if (group?.options) {
    const position = (r: Row) => group.options!.findIndex((o) => o.value === r[group.name]);
    rows.sort((a, b) => position(a) - position(b));
  }

  return (
    <>
      <div className="section-head" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <span className="eyebrow">Admin</span>
          <h1>{section.title}</h1>
        </div>
        <Link className={buttonVariants()} href={`/admin/${section.key}/new`}>
          Add {section.singular}
        </Link>
      </div>
      <p style={{ color: "var(--ink-soft)", maxWidth: "64ch", marginBottom: "1.2rem" }}>{section.intro}</p>

      {query.success && MESSAGES[query.success] && (
        <p className="form-status ok" role="status">
          {MESSAGES[query.success]}
        </p>
      )}
      {error && (
        <p className="form-status err" role="alert">
          Couldn&apos;t load this list: {error.message}. If this is new, run supabase/migrations/0005_page_content.sql in the Supabase SQL editor.
        </p>
      )}

      {rows.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>{section.singular}</th>
              {section.tagField && <th>{section.fields.find((f) => f.name === section.tagField)?.label}</th>}
              <th>Status</th>
              <th>
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const title = String(r[section.titleField] ?? "");
              const sub = section.subField ? displayValue(section, section.subField, r[section.subField]) : "";
              const hasFile = Boolean(section.file && r[section.file.column]);
              return (
                <tr key={r.id}>
                  <td>
                    <strong>{title}</strong>
                    {(sub || hasFile) && (
                      <div style={{ color: "var(--ink-soft)", fontSize: ".85rem", marginTop: ".2rem", maxWidth: "48ch", overflowWrap: "anywhere" }}>
                        {sub}
                        {hasFile ? `${sub ? " · " : ""}${section.file!.image ? "Photo attached" : "File attached"}` : ""}
                      </div>
                    )}
                  </td>
                  {section.tagField && <td>{displayValue(section, section.tagField, r[section.tagField])}</td>}
                  <td>
                    <Badge variant={r.is_published ? "published" : "draft"}>{r.is_published ? "Published" : "Draft"}</Badge>
                  </td>
                  <td style={{ display: "flex", gap: ".5rem" }}>
                    <Link className={buttonVariants({ variant: "soft", size: "sm" })} href={`/admin/${section.key}/${r.id}`}>
                      Edit
                    </Link>
                    <form action={toggleEntryPublished.bind(null, section.key)}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="next" value={(!r.is_published).toString()} />
                      <button className={buttonVariants({ variant: "outline", size: "sm" })} type="submit">
                        {r.is_published ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={deleteEntry.bind(null, section.key)}>
                      <input type="hidden" name="id" value={r.id} />
                      <ConfirmDeleteButton confirmText={`Delete "${title}"? This can't be undone.`} />
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        !error && <div className="admin-empty">{section.empty}</div>
      )}
    </>
  );
}

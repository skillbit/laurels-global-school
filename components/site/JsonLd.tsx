// Structured data for search engines. The only place raw HTML is injected: it is
// our own data run through JSON.stringify, and "<" is escaped so the content can
// never close the <script> tag.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

import { notFound } from "next/navigation";

// Unknown URLs land here so the 404 page is shown inside the normal site
// layout (header, footer and announcement banner) instead of on a bare page.
export default function CatchAll() {
  notFound();
}

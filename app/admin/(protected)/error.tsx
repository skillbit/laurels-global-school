"use client";

import ErrorPanel from "@/components/site/ErrorPanel";

export default function AdminErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorPanel error={error} retry={retry} homeHref="/admin" homeLabel="Back to the dashboard" />;
}

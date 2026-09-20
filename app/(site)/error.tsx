"use client";

import ErrorPanel from "@/components/site/ErrorPanel";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorPanel error={error} retry={retry} homeHref="/" homeLabel="Go to the homepage" />;
}

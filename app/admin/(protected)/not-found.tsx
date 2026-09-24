import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="ph" style={{ marginTop: 0 }}>
      <span className="eyebrow">Not found</span>
      <h1>That item doesn&apos;t exist</h1>
      <p className="ph-intro">It may have been deleted, or the link is out of date.</p>
      <div className="nf-links">
        <Link className={buttonVariants()} href="/admin">
          Back to the dashboard
        </Link>
      </div>
    </div>
  );
}

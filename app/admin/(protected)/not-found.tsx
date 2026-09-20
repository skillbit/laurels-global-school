import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="ph" style={{ marginTop: 0 }}>
      <span className="eyebrow">Not found</span>
      <h1>That item doesn&apos;t exist</h1>
      <p className="ph-intro">It may have been deleted, or the link is out of date.</p>
      <div className="nf-links">
        <Link className="btn btn-primary" href="/admin">
          Back to the dashboard
        </Link>
      </div>
    </div>
  );
}

// The school's shield logo. Uses the one uploaded in /admin/branding when there is one,
// otherwise the copy shipped with the site in public/logo.jpg.
export const DEFAULT_LOGO = "/logo.jpg";

export default function SchoolLogo({
  src,
  className = "mark",
  alt = "",
}: {
  src?: string | null;
  className?: string;
  alt?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={className} src={src || DEFAULT_LOGO} alt={alt} width={120} height={120} style={{ objectFit: "contain" }} />
  );
}

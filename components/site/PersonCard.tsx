export default function PersonCard({
  name,
  role,
  photoUrl,
  children,
}: {
  name: string;
  role: string;
  photoUrl?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="person-card">
      <div className="avatar" aria-hidden={photoUrl ? undefined : "true"}>
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={name} loading="lazy" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
          </svg>
        )}
      </div>
      <h3>{name}</h3>
      <span className="role">{role}</span>
      {children && <p>{children}</p>}
    </div>
  );
}

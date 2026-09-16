import type { ReactNode } from "react";

export default function FacilityCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="facility-card">
      <span className="icon-wrap">{icon}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

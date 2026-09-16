import type { ReactNode } from "react";

export default function ValueCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="value-card">
      {icon}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

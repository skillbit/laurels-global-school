export default function StageCard({
  num,
  grades,
  title,
  children,
}: {
  num: string;
  grades: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="stage">
      <span className="num mono">{num}</span>
      <div className="stage-card">
        <span className="grades">{grades}</span>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

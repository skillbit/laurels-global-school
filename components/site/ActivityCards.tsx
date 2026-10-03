import Image from "next/image";
import type { DailyActivity } from "@/lib/school-content";

// Cards for one day's activities. A single entry gets a wide card (photo beside the
// text) so it doesn't sit alone in a three-column row.
export default function ActivityCards({ activities }: { activities: DailyActivity[] }) {
  return (
    <div className={`card-grid${activities.length === 1 ? " da-single" : ""}`}>
      {activities.map((a) => (
        <article className="info-card" key={a.id}>
          {a.photoUrl && (
            <div className="info-media">
              <Image src={a.photoUrl} alt={a.title} fill sizes="(max-width: 520px) 100vw, (max-width: 860px) 50vw, 480px" />
            </div>
          )}
          <div className="body">
            {a.classLabel && <span className="meta">{a.classLabel}</span>}
            <h3>{a.title}</h3>
            {a.description && <p className="da-text">{a.description}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}

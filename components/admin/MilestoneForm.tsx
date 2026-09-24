import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
type Milestone = {
  id: string;
  year: number;
  title: string;
  description: string | null;
  is_published: boolean;
};

export default function MilestoneForm({
  action,
  milestone,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  milestone?: Milestone;
  submitLabel: string;
}) {
  const thisYear = new Date().getFullYear();

  return (
    <form action={action} className="form-card" style={{ maxWidth: "620px" }}>
      <div className="form-grid">
        <div className="field">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            type="number"
            required
            min={1900}
            max={thisYear + 1}
            defaultValue={milestone?.year}
            placeholder={String(thisYear)}
          />
        </div>
        <div className="field">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            type="text"
            required
            maxLength={120}
            defaultValue={milestone?.title}
            placeholder="e.g. School founded"
          />
        </div>
      </div>
      <div className="field">
        <Label htmlFor="description">Short description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          maxLength={600}
          defaultValue={milestone?.description ?? ""}
          style={{ minHeight: "110px" }}
        />
      </div>
      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".6rem" }}>
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          style={{ width: "auto" }}
          defaultChecked={milestone ? milestone.is_published : true}
        />
        <Label htmlFor="is_published" style={{ marginBottom: 0 }}>
          Published (visible on the public About page)
        </Label>
      </div>
      <button className={buttonVariants()} type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

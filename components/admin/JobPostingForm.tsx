import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
type JobPosting = {
  id: string;
  title: string;
  department: string | null;
  description: string | null;
  posted_date: string;
  is_active: boolean;
};

export default function JobPostingForm({
  action,
  posting,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  posting?: JobPosting;
  submitLabel: string;
}) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  return (
    <form action={action} className="form-card" style={{ maxWidth: "620px" }}>
      <div className="field">
        <Label htmlFor="title">Job title</Label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          maxLength={150}
          defaultValue={posting?.title}
          placeholder="e.g. Mathematics Teacher (Classes 6–10)"
        />
      </div>
      <div className="form-grid">
        <div className="field">
          <Label htmlFor="department">Department (optional)</Label>
          <Input id="department" name="department" type="text" maxLength={80} defaultValue={posting?.department ?? ""} />
        </div>
        <div className="field">
          <Label htmlFor="posted_date">Posted on</Label>
          <Input id="posted_date" name="posted_date" type="date" defaultValue={posting?.posted_date ?? today} />
        </div>
      </div>
      <div className="field">
        <Label htmlFor="description">Description, qualifications and how to apply (optional)</Label>
        <Textarea
          id="description"
          name="description"
          maxLength={4000}
          defaultValue={posting?.description ?? ""}
          style={{ minHeight: "160px" }}
        />
      </div>
      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".6rem" }}>
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          style={{ width: "auto" }}
          defaultChecked={posting ? posting.is_active : true}
        />
        <Label htmlFor="is_active" style={{ marginBottom: 0 }}>
          Open (listed on the public Careers page)
        </Label>
      </div>
      <button className={buttonVariants()} type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

import { createClient } from "@/lib/supabase/server";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";
import { isProtectedAdmin } from "@/lib/protected-admins";
import { createAdminUser, deleteAdminUser, toggleAdminActive } from "./actions";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: admins } = await supabase
    .from("admin_users")
    .select("id, email, full_name, is_active, created_at")
    .order("created_at", { ascending: true });

  return (
    <>
      <div className="section-head">
        <span className="eyebrow">Admin</span>
        <h1>Admin Accounts</h1>
      </div>

      {params.error && (
        <p className="form-status err" role="alert">
          {params.error}
        </p>
      )}
      {params.success && (
        <p className="form-status ok" role="status">
          {params.success === "deleted" ? "Admin account deleted." : "Admin account created."}
        </p>
      )}

      {admins && admins.length > 0 ? (
        <table className="admin-table" style={{ marginBottom: "2rem" }}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Status</th>
              <th>Added</th>
              <th>
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>{a.email}</td>
                <td>{a.full_name ?? "—"}</td>
                <td>
                  <Badge variant={a.is_active ? "published" : "draft"}>
                    {a.is_active ? "Active" : "Disabled"}
                  </Badge>
                </td>
                <td className="mono">{new Date(a.created_at).toLocaleDateString()}</td>
                <td>
                  {isProtectedAdmin(a.email) ? (
                    <Badge variant="draft">Owner</Badge>
                  ) : (
                    <>
                      <form action={toggleAdminActive}>
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="nextActive" value={(!a.is_active).toString()} />
                        <button className={buttonVariants({ variant: "outline", size: "sm" })} type="submit">
                          {a.is_active ? "Disable" : "Enable"}
                        </button>
                      </form>
                      <form action={deleteAdminUser}>
                        <input type="hidden" name="id" value={a.id} />
                        <ConfirmDeleteButton
                          confirmText={`Delete the admin account ${a.email}? They will no longer be able to sign in. This can't be undone.`}
                        />
                      </form>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="admin-empty" style={{ marginBottom: "2rem" }}>
          No admin accounts found.
        </div>
      )}

      <div className="section-head">
        <h2 style={{ fontSize: "var(--step-1)" }}>Add an Admin Account</h2>
      </div>
      <form action={createAdminUser} className="form-card" style={{ maxWidth: "480px" }}>
        <div className="field">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" type="text" />
        </div>
        <div className="field">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="field">
          <Label htmlFor="password">Temporary Password</Label>
          <Input id="password" name="password" type="text" required minLength={12} />
        </div>
        <button className={buttonVariants()} type="submit">
          Create Admin Account
        </button>
        <p className="form-note">Share this password with them directly so they can log in.</p>
      </form>
    </>
  );
}

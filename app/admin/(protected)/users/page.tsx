import { createClient } from "@/lib/supabase/server";
import { createAdminUser, toggleAdminActive } from "./actions";

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
          Admin account created.
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
                  <span className={`badge ${a.is_active ? "badge-published" : "badge-draft"}`}>
                    {a.is_active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="mono">{new Date(a.created_at).toLocaleDateString()}</td>
                <td>
                  <form action={toggleAdminActive}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="nextActive" value={(!a.is_active).toString()} />
                    <button className="btn btn-ghost btn-row" type="submit">
                      {a.is_active ? "Disable" : "Enable"}
                    </button>
                  </form>
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
          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" name="fullName" type="text" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Temporary Password</label>
          <input id="password" name="password" type="text" required minLength={8} />
        </div>
        <button className="btn btn-primary" type="submit">
          Create Admin Account
        </button>
        <p className="form-note">Share this password with them directly so they can log in.</p>
      </form>
    </>
  );
}

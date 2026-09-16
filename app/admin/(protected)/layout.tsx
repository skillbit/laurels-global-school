import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow || !adminRow.is_active) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-shell">
      <AdminSidebar email={user.email ?? ""} />
      <div className="admin-main">{children}</div>
    </div>
  );
}

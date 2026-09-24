// The owner's admin account can never be disabled or deleted from the admin panel.
export const PROTECTED_ADMIN_EMAILS = ["shreyansh001717@gmail.com"];

export function isProtectedAdmin(email: string | null | undefined) {
  return Boolean(email) && PROTECTED_ADMIN_EMAILS.includes(email!.trim().toLowerCase());
}

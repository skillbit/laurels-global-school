# Security

Security review and checklists for **The Laurels Global School** website and admin panel.

- **Last reviewed:** 2026-09-20
- **Scope:** the Next.js app in this repo, its Supabase project (database, auth, storage) and how it is deployed (Vercel, GitHub, domain).
- **How it was checked:** line-by-line code review; a probe run against the live database using only the public key; response-header inspection of the live site; `npm audit`; a scan of the full git history for leaked keys.
- **Severity guide:** **High** = fix before promoting the site widely · **Medium** = fix soon · **Low** = good hygiene · **Info** = no action, keep in mind.

> Re-run the automated checks any time with `npm run security:probe` (database/storage access), `npm audit` (dependencies) and the header check in [section 6](#6-how-to-re-run-the-checks).

---

## 1. Summary

**What is solid**

| Area | Result |
| --- | --- |
| Admin access control | Three layers: middleware redirect, admin-role check in the admin layout, and `requireAdmin()` at the top of **every** admin Server Action (16 files audited, 0 unguarded). The database enforces the same rule again with row-level security. |
| Database | Row-level security is on for every table. Verified from the outside with only the public key: it **cannot** read enquiries, job applications or admin accounts, cannot write any content table, and cannot upload files. |
| Secrets | The service-role key is only used in two server-side places (resume upload, admin account creation). `.env*` is git-ignored and **0** keys were found in the whole git history (the repo is public, so this matters). |
| Uploads | Resumes go to a private bucket and are opened through signed links that expire after 1 hour. Upload paths are validated against a strict pattern. |
| Injection / XSS | No `dangerouslySetInnerHTML`, `eval` or raw HTML anywhere; React escapes all output. The map embed only accepts Google Maps / OpenStreetMap URLs. |
| Dependencies | `npm audit`: 0 vulnerabilities (production and dev). |
| Transport | HTTPS with HSTS (set by Vercel). |
| Spam | Honeypot field and server-side validation on the enquiry and career forms. |

**Fixed during this review** (in code, already committed)

- **F1** Added `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and `Cross-Origin-Opener-Policy` headers; removed the `X-Powered-By: Next.js` banner.
- **F2** An admin can no longer disable their own account, and the last active admin can't be disabled (prevents locking everyone out).
- **F3** New admin passwords must be at least 12 characters (was 8).

---

## 2. Findings and status

| ID | Severity | Finding | Status |
| --- | --- | --- | --- |
| **S1** | **High** | Public forms can be flooded, and the database accepts anything sent straight to the API (verified: a forged status and a 20,000-character message were accepted). | **Open** |
| **S2** | **High** | Admin login is password-only (no two-factor); Supabase Auth settings (public sign-ups, password rules, rate limits) are not verified. | **Partly fixed** (F3); rest open |
| **S3** | Medium | No Content-Security-Policy, and the admin session cookie is readable by page scripts, so any future XSS bug would be worse than it needs to be. | **Partly fixed** (F1); CSP open |
| **S4** | Medium | Uploads are checked by file extension only; storage buckets have no size or file-type limits; anyone can send resumes (3 MB each, unlimited count) and admins open them. | **Open** |
| **S5** | Medium | Local development and preview deployments use the **live** database and keys (this happened during testing); the service-role key sits in `.env.local` on a personal PC. | **Open** |
| **S6** | Medium | One all-powerful admin role and no audit trail: any admin can change or delete anything and create admins, with no record of who did what. | **Partly fixed** (F2); rest open |
| **S7** | Low | Admin pages show text taken from the URL (`?error=...`). It is escaped (no script risk) but can be used to display misleading messages. | Open |
| **S8** | Low | `site_settings` is readable by everyone (intended). Never store anything secret in it. | Accepted, rule below |
| **S9** | Low | The `public` storage bucket can be listed by anyone. Only files meant to be public may ever go there. | Accepted, rule below |
| **S10** | Low | Forms collect parent and child details with no privacy notice, consent line or retention rule (India's DPDP Act, 2023). | **Open** |
| **S11** | Low | Backups: the Supabase free plan has no point-in-time recovery. | **Open** |
| **S12** | Info | The GitHub repo is public. No secrets are in it today; keep it that way. | Monitor |

### How to fix the open items

**S1: abuse of the public forms** (the most important one)

1. *Database limits.* Run this in the Supabase SQL editor (test on a copy first). It caps field sizes, forces new rows to start as `new`, and stops forged resume paths:

   ```sql
   alter table public.enquiries add constraint enquiries_sizes check (
     char_length(parent_name) <= 100 and char_length(phone) <= 20
     and char_length(coalesce(email, '')) <= 120 and char_length(coalesce(child_age, '')) <= 30
     and char_length(coalesce(grade_applying, '')) <= 30 and char_length(coalesce(message, '')) <= 2000);
   drop policy if exists "Anyone can submit an enquiry" on public.enquiries;
   create policy "Anyone can submit an enquiry" on public.enquiries
     for insert with check (status = 'new');

   alter table public.career_applications add constraint applications_sizes check (
     char_length(applicant_name) <= 100 and char_length(phone) <= 20
     and char_length(coalesce(email, '')) <= 120 and char_length(coalesce(message, '')) <= 2000);
   drop policy if exists "Anyone can submit an application" on public.career_applications;
   create policy "Anyone can submit an application" on public.career_applications
     for insert with check (status = 'new' and (resume_path is null or resume_path like 'resumes/%'));
   ```
2. *Rate limiting / bot protection.* (WhatsApp alerts already pause after more than 8 submissions in 10 minutes, but the entries are still saved.) Add Cloudflare Turnstile (free CAPTCHA) or Vercel's bot protection to both forms, plus a per-IP limit (for example 5 submissions per hour) using Upstash Ratelimit or Vercel WAF rules.
3. *Better still:* stop accepting direct database inserts from the public key altogether. Make the Server Actions the only way in (insert with the service role) and remove the public insert policies.
4. Confirm with `npm run security:probe`; the last check should turn to PASS.

**S2: admin sign-in**

- Supabase → Authentication → Sign In / Providers: turn **off** "Allow new users to sign up" (admins are created from the panel).
- Password policy: minimum length 12, require mixed characters; enable "leaked password protection" if your plan allows.
- Turn on **multi-factor authentication (TOTP)** for every admin and require it at sign-in (needs a small login-page change; ask for it).
- Check Authentication → Rate Limits and keep the defaults or tighter.
- Use a password manager; never reuse passwords; never share admin passwords in chat or email.

**S3: Content-Security-Policy**

Add it in **report-only** mode first, watch for breakage (maps, Supabase uploads), then enforce. Starting point (needs per-request nonces for scripts):

```
default-src 'self'; script-src 'self' 'nonce-<per-request>'; style-src 'self' 'unsafe-inline';
img-src 'self' data: https://*.supabase.co; connect-src 'self' https://*.supabase.co;
frame-src https://www.google.com https://www.openstreetmap.org; font-src 'self';
frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'
```

**S4: uploads**

- Set bucket limits (run in SQL editor; adjust the list if you allow other file types):

  ```sql
  update storage.buckets set file_size_limit = 10485760, allowed_mime_types = array[
    'image/jpeg','image/png','image/webp','image/svg+xml','image/x-icon','image/vnd.microsoft.icon',
    'application/pdf','application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ] where id = 'public';
  update storage.buckets set file_size_limit = 3145728, allowed_mime_types = array[
    'application/pdf','application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ] where id = 'private';
  ```
- Tell staff: open resumes only from the admin panel, on a computer with antivirus, and treat unexpected files as suspicious.
- Optional: scan resumes with an antivirus API (for example ClamAV or VirusTotal) before they reach the admin.

**S5: separate live and test data**

- Create a second Supabase project for development and put its keys in `.env.local`; keep the live keys only in Vercel → Production environment variables.
- In Vercel, do not expose Production variables to Preview deployments.
- Keep `.env.local` out of cloud-synced folders; if the PC is lost, rotate the service-role key immediately (Supabase → Project Settings → API).

**S6: least privilege and audit**

- Add an `editor` role (content only) alongside `admin` (can manage accounts and settings).
- Add an `audit_log` table recording who changed what and when; show it in the admin.
- Review the list in Admin → Admin Accounts monthly and disable people who left.

**S7:** replace `?error=<text>` with short error codes mapped to fixed messages.

**S10 privacy:** WhatsApp alerts (when enabled) send the parent's name, phone number and a short note through WhatsApp/Meta or CallMeBot, so include that in the privacy notice and send alerts only to staff who handle admissions. Add a Privacy Policy page and a consent line under the enquiry and career forms ("We use these details only to contact you about admissions/jobs"); delete enquiries and applications after a fixed period (for example 12 months); name a person responsible for data requests.

**S11 backups:** schedule a monthly export of the database and storage (or upgrade the Supabase plan for point-in-time recovery) and test one restore.

**Rules that keep S8/S9 safe**

- Nothing secret in `site_settings` (it is public).
- Nothing private in the `public` bucket (it is public and listable). Private files go in `private` only.

---

## 3. Checklists

### 3.1 Before promoting the site widely (must)

- [ ] S1 database limits applied and the form bot protection added
- [ ] Admin sign-ups disabled in Supabase; two-factor on for every admin
- [ ] Only real staff have admin accounts (the test account `dummy@gmail.com` deleted)
- [ ] Live and test data separated (S5)
- [ ] Privacy notice on the forms (S10)
- [ ] Bucket size and file-type limits applied (S4)
- [ ] `npm run security:probe` shows all PASS; `npm audit` shows 0 issues

### 3.2 Supabase dashboard

- [ ] Authentication → sign-ups disabled; password rules set; MFA enabled
- [ ] Authentication → URL configuration: Site URL and redirect URLs list only the real domain(s)
- [ ] Row-level security shows **enabled** on every table (Table editor → each table)
- [ ] No table without a policy that you did not intend
- [ ] Storage: `public` and `private` buckets exist with limits; `private` is **not** public
- [ ] API settings: service-role key never used in the browser or committed
- [ ] Project owner and members reviewed; 2FA on your Supabase account
- [ ] Database backups reviewed (S11)

### 3.3 Vercel

- [ ] Environment variables set for **Production** only; Preview does not get the live service-role key
- [ ] Deployment protection on for preview deployments
- [ ] Custom domain has HTTPS (automatic) and HSTS
- [ ] Only the people who need access are team members; 2FA on
- [ ] Log alerts/notifications turned on for failed deployments

### 3.4 GitHub

- [ ] 2FA on every account with access
- [ ] Secret scanning and push protection on (Settings → Code security)
- [ ] Dependabot alerts and security updates on
- [ ] Branch protection on `main` (no force-push)
- [ ] `.env*` files never committed (`git ls-files | grep env` must print nothing)

### 3.5 Domain and email (GoDaddy)

- [ ] 2FA on the GoDaddy account and a strong unique password
- [ ] Domain lock on; auto-renew on; contact details correct
- [ ] Only the two Vercel DNS records added; no leftover parking records
- [ ] If school email is set up on the domain: SPF, DKIM and DMARC records added

### 3.6 Admin account hygiene

- [ ] One account per person; no shared logins
- [ ] Passwords: 12+ characters, unique, in a password manager
- [ ] Accounts of people who left are disabled the same day
- [ ] Sign out on shared computers
- [ ] Admin panel only opened from `https://` on the real domain

### 3.7 When you add a new feature (developer checklist)

- [ ] New admin Server Action starts with `await requireAdmin()`
- [ ] New table: `enable row level security` and explicit policies (public read only for published/active rows; admin write via `is_admin()`)
- [ ] Public write path (a form) has size limits, a honeypot/CAPTCHA and rate limiting, and the database policy is as strict as the server validation
- [ ] File upload: check size and type, use a generated file name, store under a fixed folder, and validate the saved path with a strict pattern
- [ ] Output is never inserted as raw HTML; URLs shown as links start with `https://` or `/`
- [ ] New page under `(site)` that reads data: uses the cookie-less client and gets refreshed on save (`revalidatePath` with the **page** form, e.g. `revalidatePath("/gallery")`)
- [ ] No secrets in `NEXT_PUBLIC_*` variables or client components; the service-role client stays in server files
- [ ] Run `npm run lint`, `npm run build`, `npm audit` and `npm run security:probe` before merging

### 3.8 Recurring

| When | Do |
| --- | --- |
| Every release | Lint, build, `npm audit`, `npm run security:probe` |
| Monthly | Review admin accounts; review enquiry and application inboxes for spam; check Vercel and Supabase usage for spikes; apply dependency updates |
| Quarterly | Re-read this file; rotate the service-role key; test a backup restore; review Supabase Auth logs for failed sign-ins |
| Yearly | Renew the domain; review who has access to GitHub, Vercel, Supabase and GoDaddy; review the privacy notice |

### 3.9 If something goes wrong

- **Key leaked (for example pushed to GitHub):** rotate it in Supabase now (Project Settings → API), update Vercel, redeploy; remove it from git history; check the audit and API logs.
- **Admin account compromised:** disable it in Admin Accounts (or set `is_active = false` in Supabase), reset the password, review recent changes, sign the account out everywhere.
- **Spam flood:** turn on the CAPTCHA/rate limit (S1), delete junk rows in Supabase, and block abusive IPs in Vercel.
- **Defacement or wrong content:** unpublish or delete it in the admin, restore from backup if needed, then find how it was done (audit log, Supabase auth logs).

---

## 4. Privacy and compliance notes

- Personal data stored: enquiry (parent name, phone, child age and grade, message), job applications (name, phone, email, resume), admin emails. Only admins can read it.
- India's Digital Personal Data Protection Act, 2023 expects a clear notice and consent, a purpose limit, and deletion when no longer needed. See S10.
- The site sets no analytics or advertising cookies. The admin sign-in cookie is only set for admins. The Contact page loads a Google Maps embed (a third-party request when the page is opened).

## 5. Responsible disclosure

If someone reports a vulnerability, thank them, do not blame them, fix it, and note the fix here.

## 6. How to re-run the checks

```bash
# 1) database and storage access with only the public key (needs .env.local)
npm run security:probe

# 2) dependency vulnerabilities
npm audit

# 3) response headers on the live site (expect X-Content-Type-Options, X-Frame-Options,
#    Referrer-Policy, Permissions-Policy, Strict-Transport-Security; no X-Powered-By)
curl -sI https://laurels-global-school.vercel.app/ | grep -i -E "strict-transport|x-frame|x-content|referrer|permissions|x-powered"

# 4) secrets in git history (expect 0)
git log --all -p | grep -c "eyJhbGciOi"

# 5) env files never tracked (expect no output)
git ls-files | grep -i "\.env"
```

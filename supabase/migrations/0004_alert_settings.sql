-- Who gets the WhatsApp alert for new enquiries and job applications.
-- Set from Admin -> WhatsApp Alerts. Only admins can read or change it (the
-- CallMeBot keys are secrets), so it is kept out of the public site_settings table.
-- Run this once in the Supabase SQL editor (safe to re-run).

create table if not exists public.alert_settings (
  id int primary key check (id = 1),
  -- One recipient per line: "919771020700" or "919771020700 | 1234567" (CallMeBot key).
  whatsapp_recipients text,
  alerts_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);
insert into public.alert_settings (id) values (1) on conflict (id) do nothing;

alter table public.alert_settings enable row level security;
drop policy if exists "Admins manage alert settings" on public.alert_settings;
create policy "Admins manage alert settings" on public.alert_settings
  for all using (is_admin()) with check (is_admin());

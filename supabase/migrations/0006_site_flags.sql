-- Owner-only switches used by the hidden /flags page (not linked anywhere, not in the
-- admin panel). Currently: send the homepage to another page. Values here are public
-- by nature (they change what visitors see), so anyone can read them; only the server
-- (service role, after the owner's sign-in check) can write.
-- Run this once in the Supabase SQL editor (safe to re-run).

create table if not exists public.site_flags (
  key text primary key check (char_length(key) <= 80),
  value text not null default '' check (char_length(value) <= 200),
  updated_at timestamptz not null default now()
);

alter table public.site_flags enable row level security;
drop policy if exists "Public can read site flags" on public.site_flags;
create policy "Public can read site flags" on public.site_flags for select using (true);
-- No insert/update/delete policy on purpose: writes go through the service role only.

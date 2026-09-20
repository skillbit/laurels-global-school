-- History & milestones shown as a timeline on the About page.
-- Run this once in the Supabase SQL editor (safe to re-run).

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  year int not null check (year between 1900 and 2100),
  title text not null,
  description text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.milestones enable row level security;
drop policy if exists "Public can read published milestones" on public.milestones;
create policy "Public can read published milestones" on public.milestones
  for select using (is_published = true);
drop policy if exists "Admins manage milestones" on public.milestones;
create policy "Admins manage milestones" on public.milestones
  for all using (is_admin()) with check (is_admin());

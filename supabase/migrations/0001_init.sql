-- The Laurels Global School — initial schema
-- Run in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS throughout.

create extension if not exists pgcrypto;

-- ============================================================
-- Admin core
-- ============================================================

create table if not exists public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER so this can be called from RLS policies on admin_users
-- itself without recursing (it runs as the function owner, which bypasses
-- RLS on the underlying select).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true
  );
$$;

alter table public.admin_users enable row level security;
drop policy if exists "Admins manage admin_users" on public.admin_users;
create policy "Admins manage admin_users" on public.admin_users
  for all using (is_admin()) with check (is_admin());

-- ============================================================
-- Content tables
-- ============================================================

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  notice_date date not null default current_date,
  attachment_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  caption text,
  alt_text text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  photo_path text,
  group_label text not null default 'faculty', -- 'leadership' | 'faculty'
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  end_date date,
  category text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('fee_structure','syllabus','admission_form','circular','newsletter')),
  file_path text not null,
  published_date date not null default current_date,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  photo_path text,
  achievement_date date not null default current_date,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_postings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  department text,
  is_active boolean not null default true,
  posted_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.alumni (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  batch_year int,
  note text,
  photo_path text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Singleton settings row (banner, contact info, branding, homepage text)
create table if not exists public.site_settings (
  id int primary key check (id = 1),
  banner_message text,
  banner_link text,
  banner_active boolean not null default false,
  address text,
  phone_primary text,
  phone_secondary text,
  email text,
  office_hours text,
  map_embed_url text,
  logo_path text,
  favicon_path text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  x_url text,
  hero_quote text,
  mission_statement text,
  quick_facts jsonb not null default '[]',
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ============================================================
-- Inbox tables (public insert, admin read/update)
-- ============================================================

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null,
  phone text not null,
  email text,
  child_age text,
  grade_applying text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  job_posting_id uuid references public.job_postings (id) on delete set null,
  applicant_name text not null,
  phone text not null,
  email text,
  resume_path text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- ============================================================
-- RLS: content tables with is_published — public reads published rows,
-- admins do everything
-- ============================================================

do $$
declare
  t text;
begin
  foreach t in array array[
    'notices','gallery_images','staff','events','documents',
    'achievements','alumni'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "Public can read published %1$s" on public.%1$s', t);
    execute format(
      'create policy "Public can read published %1$s" on public.%1$s for select using (is_published = true)',
      t
    );
    execute format('drop policy if exists "Admins manage %1$s" on public.%1$s', t);
    execute format(
      'create policy "Admins manage %1$s" on public.%1$s for all using (is_admin()) with check (is_admin())',
      t
    );
  end loop;
end $$;

-- job_postings uses is_active (not is_published) as its public-visibility flag
alter table public.job_postings enable row level security;
drop policy if exists "Public can read active job_postings" on public.job_postings;
create policy "Public can read active job_postings" on public.job_postings
  for select using (is_active = true);
drop policy if exists "Admins manage job_postings" on public.job_postings;
create policy "Admins manage job_postings" on public.job_postings
  for all using (is_admin()) with check (is_admin());

alter table public.site_settings enable row level security;
drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings for select using (true);
drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings for all using (is_admin()) with check (is_admin());

-- ============================================================
-- RLS: inbox tables — anyone can insert, only admins can read/update
-- ============================================================

alter table public.enquiries enable row level security;
drop policy if exists "Anyone can submit an enquiry" on public.enquiries;
create policy "Anyone can submit an enquiry" on public.enquiries for insert with check (true);
drop policy if exists "Admins manage enquiries" on public.enquiries;
create policy "Admins manage enquiries" on public.enquiries for all using (is_admin()) with check (is_admin());

alter table public.career_applications enable row level security;
drop policy if exists "Anyone can submit an application" on public.career_applications;
create policy "Anyone can submit an application" on public.career_applications for insert with check (true);
drop policy if exists "Admins manage career applications" on public.career_applications;
create policy "Admins manage career applications" on public.career_applications for all using (is_admin()) with check (is_admin());

-- ============================================================
-- Storage buckets
-- ============================================================

insert into storage.buckets (id, name, public)
values ('public', 'public', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('private', 'private', false)
on conflict (id) do nothing;

drop policy if exists "Public read access to public bucket" on storage.objects;
create policy "Public read access to public bucket" on storage.objects
  for select using (bucket_id = 'public');
drop policy if exists "Admins write to public bucket" on storage.objects;
create policy "Admins write to public bucket" on storage.objects
  for insert with check (bucket_id = 'public' and is_admin());
drop policy if exists "Admins update public bucket" on storage.objects;
create policy "Admins update public bucket" on storage.objects
  for update using (bucket_id = 'public' and is_admin());
drop policy if exists "Admins delete public bucket" on storage.objects;
create policy "Admins delete public bucket" on storage.objects
  for delete using (bucket_id = 'public' and is_admin());

drop policy if exists "Admins full access to private bucket" on storage.objects;
create policy "Admins full access to private bucket" on storage.objects
  for all using (bucket_id = 'private' and is_admin()) with check (bucket_id = 'private' and is_admin());

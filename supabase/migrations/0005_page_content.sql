-- Editable page text, subjects, co-curricular activities, daily activities and the
-- CBSE mandatory public disclosure. Also lets Documents hold the academic calendar.
-- Run this once in the Supabase SQL editor (safe to re-run).

-- ============================================================
-- Page text: one row per piece of text changed in Admin -> Page Text.
-- A missing row means "use the text built into the site".
-- ============================================================
create table if not exists public.page_content (
  key text primary key check (char_length(key) <= 80),
  value text not null check (char_length(value) <= 2000),
  updated_at timestamptz not null default now()
);

alter table public.page_content enable row level security;
drop policy if exists "Public can read page content" on public.page_content;
create policy "Public can read page content" on public.page_content for select using (true);
drop policy if exists "Admins manage page content" on public.page_content;
create policy "Admins manage page content" on public.page_content
  for all using (is_admin()) with check (is_admin());

-- ============================================================
-- Lists shown on the public site
-- ============================================================
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 60),
  stage text not null default 'all' check (stage in ('all','pre_primary','primary','middle','secondary')),
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.co_curricular (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 60),
  description text check (char_length(description) <= 300),
  photo_path text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_activities (
  id uuid primary key default gen_random_uuid(),
  activity_date date not null default current_date,
  title text not null check (char_length(title) <= 120),
  class_label text check (char_length(class_label) <= 60),
  description text check (char_length(description) <= 1000),
  photo_path text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists daily_activities_date_idx on public.daily_activities (activity_date desc);

create table if not exists public.disclosures (
  id uuid primary key default gen_random_uuid(),
  section text not null default 'general' check (section in ('general','documents','academics','staff','infrastructure')),
  label text not null check (char_length(label) <= 160),
  value text check (char_length(value) <= 600),
  file_path text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare
  t text;
begin
  foreach t in array array['subjects','co_curricular','daily_activities','disclosures'] loop
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

-- ============================================================
-- Documents: allow the academic calendar as a category
-- ============================================================
alter table public.documents drop constraint if exists documents_category_check;
alter table public.documents add constraint documents_category_check
  check (category in ('fee_structure','syllabus','admission_form','circular','newsletter','academic_calendar'));

-- ============================================================
-- Starting rows (only when a table is still empty), so the admin lists show
-- what the site already displays and the school can correct it.
-- ============================================================
insert into public.subjects (name, sort_order)
select v.name, v.ord from (values
  ('English', 1), ('Hindi', 2), ('Mathematics', 3), ('Science', 4), ('Social Science', 5),
  ('Computer Science', 6), ('Environmental Studies', 7), ('Art & Craft', 8),
  ('Physical Education', 9), ('Value Education', 10)
) as v(name, ord)
where not exists (select 1 from public.subjects);

insert into public.co_curricular (name, sort_order)
select v.name, v.ord from (values
  ('Sports', 1), ('Dance & Music', 2), ('Elocution & Debate', 3), ('Science Exhibition', 4),
  ('Art Club', 5), ('Annual Day', 6), ('Field Trips', 7)
) as v(name, ord)
where not exists (select 1 from public.co_curricular);

-- The CBSE mandatory public disclosure headings. Values are left empty: a row only
-- appears on the public page once its value or file has been filled in.
insert into public.disclosures (section, label, sort_order)
select v.section, v.label, v.ord from (values
  ('general', 'Name of the school', 1),
  ('general', 'Affiliation number', 2),
  ('general', 'School code', 3),
  ('general', 'Complete address with PIN code', 4),
  ('general', 'Principal name', 5),
  ('general', 'Principal qualification', 6),
  ('general', 'School email', 7),
  ('general', 'Contact numbers', 8),
  ('general', 'Year of establishment', 9),
  ('documents', 'Affiliation / upgradation letter and latest extension of affiliation', 1),
  ('documents', 'Society / trust / company registration or renewal certificate', 2),
  ('documents', 'No Objection Certificate (NOC) issued by the State Government', 3),
  ('documents', 'Recognition certificate under the RTE Act, 2009 and its renewal', 4),
  ('documents', 'Valid building safety certificate', 5),
  ('documents', 'Valid fire safety certificate', 6),
  ('documents', 'DEO certificate / self-certification submitted for affiliation', 7),
  ('documents', 'Valid water, health and sanitation certificates', 8),
  ('academics', 'Fee structure of the school', 1),
  ('academics', 'Annual academic calendar', 2),
  ('academics', 'List of School Management Committee (SMC) members', 3),
  ('academics', 'List of Parent Teacher Association (PTA) members', 4),
  ('academics', 'Board examination results of the last three years', 5),
  ('staff', 'Principal', 1),
  ('staff', 'Total number of teachers', 2),
  ('staff', 'PGT', 3),
  ('staff', 'TGT', 4),
  ('staff', 'PRT', 5),
  ('staff', 'Teacher to section ratio', 6),
  ('staff', 'Special educator', 7),
  ('staff', 'Counsellor and wellness teacher', 8),
  ('infrastructure', 'Total campus area (square metres)', 1),
  ('infrastructure', 'Number and size of classrooms (square metres)', 2),
  ('infrastructure', 'Number and size of laboratories, including computer labs', 3),
  ('infrastructure', 'Internet facility', 4),
  ('infrastructure', 'Number of girls'' toilets', 5),
  ('infrastructure', 'Number of boys'' toilets', 6),
  ('infrastructure', 'YouTube link of the school inspection video', 7)
) as v(section, label, ord)
where not exists (select 1 from public.disclosures);

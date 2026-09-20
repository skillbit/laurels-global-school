-- Gallery albums: each album has a title, a date and many photos.
-- Run this once in the Supabase SQL editor (safe to re-run).

create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  album_date date not null default current_date,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gallery_images
  add column if not exists album_id uuid references public.gallery_albums (id) on delete cascade;
create index if not exists gallery_images_album_id_idx on public.gallery_images (album_id);

alter table public.gallery_albums enable row level security;
drop policy if exists "Public can read published gallery_albums" on public.gallery_albums;
create policy "Public can read published gallery_albums" on public.gallery_albums
  for select using (is_published = true);
drop policy if exists "Admins manage gallery_albums" on public.gallery_albums;
create policy "Admins manage gallery_albums" on public.gallery_albums
  for all using (is_admin()) with check (is_admin());

-- Move any photos uploaded before albums existed into a starter album,
-- so nothing disappears from the public Gallery.
do $$
declare
  starter uuid;
begin
  if exists (select 1 from public.gallery_images where album_id is null) then
    insert into public.gallery_albums (title) values ('Campus Photos') returning id into starter;
    update public.gallery_images set album_id = starter where album_id is null;
  end if;
end $$;

-- 20231013_000003_profiles.sql
-- Add profiles table for staff accounts, enable RLS, and create admin seed

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  role text not null default 'editor' check (role in ('admin','editor'))
);

alter table public.profiles enable row level security;

create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);

-- Seed admin profile for the Tipape staff user (replace with actual email if different)
insert into public.profiles (id, display_name, role)
select id, 'Tipape', 'admin'
from auth.users
where email = 'info.unitywithin@gmail.com'
  and not exists (select 1 from public.profiles where id = auth.users.id);


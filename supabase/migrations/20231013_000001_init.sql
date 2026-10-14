-- 20231013_000001_init.sql
-- Initial migration: enums, tables, timestamps, and triggers

-- Enable extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- 1. ENUM types
create type user_role as enum ('admin', 'editor');
create type story_type as enum ('story', 'testimonial', 'video');
create type story_status as enum ('draft', 'published', 'archived');
create type submission_status as enum ('new', 'approved', 'rejected');
create type event_status as enum ('draft', 'published', 'archived');
create type career_type as enum ('volunteer', 'leadership', 'research', 'internship', 'fellowship', 'paid');
create type career_status as enum ('open', 'closed', 'draft');
create type resource_status as enum ('draft', 'published');

-- Helper function for timestamps
create or replace function set_timestamp()
returns trigger language plpgsql as $$
begin
  NEW.updated_at = now();
  if TG_OP = 'INSERT' then
    NEW.created_at = now();
  end if;
  return NEW;
end;
$$;

-- 2. Tables
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role user_role not null default 'editor',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create trigger profiles_timestamp before insert or update on public.profiles
for each row execute function set_timestamp();

-- is_staff & is_admin helpers (security definer)
create or replace function public.is_staff(uid uuid)
returns boolean language sql stable security definer as $$
  select exists (select 1 from public.profiles where id = uid and role in ('admin','editor'));
$$;
create or replace function public.is_admin(uid uuid)
returns boolean language sql stable security definer as $$
  select exists (select 1 from public.profiles where id = uid and role = 'admin');
$$;

-- stories
create table public.stories (
  id uuid primary key default gen_random_uuid(),
  type story_type not null,
  title text not null,
  author_display_name text,
  role_label text,
  quote text,
  body_markdown text,
  image_path text,
  image_alt text,
  video_url text,
  featured boolean default false,
  consent_confirmed boolean default false,
  consent_note text,
  status story_status not null default 'draft',
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create trigger stories_timestamp before insert or update on public.stories
for each row execute function set_timestamp();
-- Ensure published stories have consent
alter table public.stories add constraint chk_story_consent
  check (status <> 'published' or (consent_confirmed and trim(coalesce(consent_note,'')) <> ''));

-- story submissions
create table public.story_submissions (
  id uuid primary key default gen_random_uuid(),
  name text,
  anonymous boolean default false,
  contact text,
  story_text text not null,
  consent_given boolean not null,
  status submission_status not null default 'new',
  created_at timestamp with time zone default now()
);
alter table public.story_submissions add constraint chk_submission_consent
  check (consent_given = true);

-- events
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text,
  description text,
  location text,
  starts_at timestamp with time zone,
  ends_at timestamp with time zone,
  image_path text,
  image_alt text,
  status event_status not null default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create trigger events_timestamp before insert or update on public.events
for each row execute function set_timestamp();

-- careers
create table public.careers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  type career_type not null,
  status career_status not null default 'draft',
  summary text,
  responsibilities jsonb,
  looking_for jsonb,
  mode text,
  commitment text,
  location text,
  apply_url text,
  apply_email text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create trigger careers_timestamp before insert or update on public.careers
for each row execute function set_timestamp();

-- resources
create table public.resources (
  id uuid primary key default gen_random_uuid(),
  category text,
  title text not null,
  description text,
  file_path text,
  link_url text,
  status resource_status not null default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create trigger resources_timestamp before insert or update on public.resources
for each row execute function set_timestamp();

-- impact_stats
create table public.impact_stats (
  key text primary key,
  label text not null,
  value integer not null default 0,
  goal_text text
);

-- settings
create table public.settings (
  key text primary key,
  value jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create trigger settings_timestamp before insert or update on public.settings
for each row execute function set_timestamp();

-- rate_limits
create table public.rate_limits (
  key text primary key,
  created_at timestamp with time zone default now()
);

-- audit_log
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  table_name text not null,
  row_id uuid not null,
  created_at timestamp with time zone default now()
);

-- Trigger to populate audit_log for main tables
create or replace function public.audit_trigger()
returns trigger language plpgsql security definer as $$
begin
  insert into public.audit_log (user_id, action, table_name, row_id)
  values (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id);
  return NEW;
end;
$$;

-- Attach audit trigger to mutable tables
create trigger audit_stories after insert or update on public.stories
for each row execute function public.audit_trigger();
create trigger audit_events after insert or update on public.events
for each row execute function public.audit_trigger();
create trigger audit_careers after insert or update on public.careers
for each row execute function public.audit_trigger();
create trigger audit_resources after insert or update on public.resources
for each row execute function public.audit_trigger();
create trigger audit_impact after insert or update on public.impact_stats
for each row execute function public.audit_trigger();
create trigger audit_settings after update on public.settings
for each row execute function public.audit_trigger();
create trigger audit_story_submissions after insert or update on public.story_submissions
for each row execute function public.audit_trigger();


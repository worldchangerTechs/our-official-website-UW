-- CMS publication state, revision history, audit detail, and media permissions.
-- Existing status columns remain intact for compatibility; content_status is
-- the publishing workflow shared by all content editors.

alter table public.stories
  add column if not exists content_status text not null default 'draft',
  add constraint stories_content_status_check
    check (content_status in ('draft', 'scheduled', 'published', 'archived'));
alter table public.events
  add column if not exists content_status text not null default 'draft',
  add column if not exists published_at timestamptz,
  add constraint events_content_status_check
    check (content_status in ('draft', 'scheduled', 'published', 'archived'));
alter table public.careers
  add column if not exists content_status text not null default 'draft',
  add column if not exists published_at timestamptz,
  add constraint careers_content_status_check
    check (content_status in ('draft', 'scheduled', 'published', 'archived'));
alter table public.resources
  add column if not exists content_status text not null default 'draft',
  add column if not exists published_at timestamptz,
  add constraint resources_content_status_check
    check (content_status in ('draft', 'scheduled', 'published', 'archived'));
alter table public.impact_stats
  add column if not exists content_status text not null default 'published',
  add column if not exists published_at timestamptz default now(),
  add constraint impact_stats_content_status_check
    check (content_status in ('draft', 'scheduled', 'published', 'archived'));

update public.stories
set content_status = case status::text
  when 'published' then 'published'
  when 'archived' then 'archived'
  else 'draft'
end,
published_at = coalesce(published_at, case when status::text = 'published' then updated_at else null end);
update public.events
set content_status = case status::text
  when 'published' then 'published'
  when 'archived' then 'archived'
  else 'draft'
end,
published_at = case when status::text = 'published' then coalesce(published_at, updated_at) else published_at end;
update public.careers
set content_status = case
  when status::text = 'open' then 'published'
  when status::text = 'closed' then 'archived'
  else 'draft'
end,
published_at = case when status::text = 'open' then coalesce(published_at, updated_at) else published_at end;
update public.resources
set content_status = case status::text
  when 'published' then 'published'
  when 'archived' then 'archived'
  else 'draft'
end,
published_at = case when status::text = 'published' then coalesce(published_at, updated_at) else published_at end;

create table if not exists public.content_revisions (
  id bigint generated always as identity primary key,
  table_name text not null,
  record_id text not null,
  snapshot jsonb not null,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists content_revisions_lookup
  on public.content_revisions (table_name, record_id, created_at desc);
alter table public.content_revisions enable row level security;
drop policy if exists content_revisions_staff_read on public.content_revisions;
create policy content_revisions_staff_read on public.content_revisions
  for select to authenticated using (public.is_staff(auth.uid()));

create table if not exists public.content_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  draft_key uuid not null,
  table_name text not null check (table_name in ('stories', 'events', 'careers', 'resources', 'impact_stats')),
  record_id text,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, draft_key)
);
alter table public.content_drafts enable row level security;
drop policy if exists content_drafts_owner_access on public.content_drafts;
create policy content_drafts_owner_access on public.content_drafts
  for all to authenticated
  using (user_id = auth.uid() and public.is_staff(auth.uid()))
  with check (user_id = auth.uid() and public.is_staff(auth.uid()));
create trigger content_drafts_timestamp before insert or update on public.content_drafts
  for each row execute function public.set_timestamp();

alter table public.audit_log
  alter column row_id type text using row_id::text,
  add column if not exists before_data jsonb,
  add column if not exists after_data jsonb;
drop trigger if exists audit_stories on public.stories;
drop trigger if exists audit_events on public.events;
drop trigger if exists audit_careers on public.careers;
drop trigger if exists audit_resources on public.resources;
drop trigger if exists audit_impact on public.impact_stats;
drop trigger if exists audit_story_submissions on public.story_submissions;
drop trigger if exists audit_settings on public.settings;

create or replace function public.capture_admin_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  old_row jsonb;
  new_row jsonb;
  changed_row jsonb;
  item_id text;
begin
  if TG_OP <> 'INSERT' then old_row := to_jsonb(OLD); end if;
  if TG_OP <> 'DELETE' then new_row := to_jsonb(NEW); end if;
  changed_row := coalesce(new_row, old_row);
  item_id := coalesce(changed_row ->> 'id', changed_row ->> 'key', changed_row ->> 'slug');

  if TG_TABLE_NAME in ('stories', 'events', 'careers', 'resources', 'impact_stats', 'content_drafts') and TG_OP <> 'DELETE' then
    insert into public.content_revisions (table_name, record_id, snapshot, user_id)
    values (
      TG_TABLE_NAME,
      case when TG_TABLE_NAME = 'content_drafts' then coalesce(new_row ->> 'draft_key', item_id) else item_id end,
      new_row,
      auth.uid()
    );
  end if;

  insert into public.audit_log (user_id, action, table_name, row_id, before_data, after_data)
  values (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    item_id,
    old_row,
    new_row
  );

  if TG_OP = 'DELETE' then return OLD; end if;
  return NEW;
end;
$$;

create trigger capture_stories_change after insert or update or delete on public.stories
  for each row execute function public.capture_admin_change();
create trigger capture_events_change after insert or update or delete on public.events
  for each row execute function public.capture_admin_change();
create trigger capture_careers_change after insert or update or delete on public.careers
  for each row execute function public.capture_admin_change();
create trigger capture_resources_change after insert or update or delete on public.resources
  for each row execute function public.capture_admin_change();
create trigger capture_impact_change after insert or update or delete on public.impact_stats
  for each row execute function public.capture_admin_change();
create trigger capture_drafts_change after insert or update or delete on public.content_drafts
  for each row execute function public.capture_admin_change();
create trigger capture_submissions_change after insert or update or delete on public.story_submissions
  for each row execute function public.capture_admin_change();

drop view if exists public.public_stories;
create view public.public_stories as
  select id, type, title, author_display_name, role_label, quote, body_markdown,
         image_path, image_alt, video_url, featured, published_at
  from public.stories
  where content_status in ('published', 'scheduled')
    and published_at is not null and published_at <= now()
    and consent_confirmed = true
    and trim(coalesce(consent_note, '')) <> '';
grant select on public.public_stories to anon, authenticated;

drop view if exists public.public_events;
create view public.public_events as
  select id, title, type, description, location, starts_at, ends_at,
         image_path, image_alt, published_at
  from public.events
  where content_status in ('published', 'scheduled')
    and published_at is not null and published_at <= now();
grant select on public.public_events to anon, authenticated;

drop view if exists public.public_careers;
create view public.public_careers as
  select slug, title, type, summary, responsibilities, looking_for, mode,
         commitment, location, apply_url, apply_email, published_at
  from public.careers
  where status::text = 'open'
    and content_status in ('published', 'scheduled')
    and published_at is not null and published_at <= now();
grant select on public.public_careers to anon, authenticated;

drop view if exists public.public_resources;
create view public.public_resources as
  select id, category, title, description, file_path, link_url, published_at
  from public.resources
  where content_status in ('published', 'scheduled')
    and published_at is not null and published_at <= now();
grant select on public.public_resources to anon, authenticated;

drop view if exists public.public_impact;
create view public.public_impact as
  select key, label, value, goal_text, published_at
  from public.impact_stats
  where content_status in ('published', 'scheduled')
    and published_at is not null and published_at <= now();
grant select on public.public_impact to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('unity-media', 'unity-media', true)
on conflict (id) do update set public = excluded.public;
drop policy if exists unity_media_staff_upload on storage.objects;
create policy unity_media_staff_upload on storage.objects
  for insert to authenticated with check (
    bucket_id = 'unity-media' and public.is_staff(auth.uid())
  );
drop policy if exists unity_media_staff_update on storage.objects;
create policy unity_media_staff_update on storage.objects
  for update to authenticated using (
    bucket_id = 'unity-media' and public.is_staff(auth.uid())
  ) with check (
    bucket_id = 'unity-media' and public.is_staff(auth.uid())
  );
drop policy if exists unity_media_admin_delete on storage.objects;
create policy unity_media_admin_delete on storage.objects
  for delete to authenticated using (
    bucket_id = 'unity-media' and public.is_admin(auth.uid())
  );

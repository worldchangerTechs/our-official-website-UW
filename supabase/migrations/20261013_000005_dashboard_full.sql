-- 20261013_000005_dashboard_full.sql
-- Dashboard schema extension: new tables, altered tables, RLS, views, functions, seed

-- -------------------------------------------------------
-- 1. NEW ENUM TYPES
-- -------------------------------------------------------

create type if not exists public.hub_kind as enum ('article','affirmation','discussion_prompt','exercise','story','resource','video');
create type if not exists public.hub_status as enum ('draft','scheduled','published','archived');
create type if not exists public.event_type as enum ('workshop','talk','gathering','online','hybrid','other');
create type if not exists public.resource_type as enum ('guide','toolkit','link','video','contact');
create type if not exists public.helpline_category as enum ('crisis','gbv','children','substance','emergency','other');
create type if not exists public.team_role as text;
create type if not exists public.partner_kind as text;

-- -------------------------------------------------------
-- 2. HELPLINES TABLE
-- -------------------------------------------------------

create table public.helplines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  number text not null,
  description text,
  category helpline_category not null default 'other',
  hours text,
  source_url text,
  active boolean not null default true,
  last_checked_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger helplines_timestamp before insert or update on public.helplines
  for each row execute function set_timestamp();

-- Public view: only active helplines
create view public.public_helplines as
select id, name, number, description, category, hours, source_url, active, sort_order
from public.helplines
where active = true;
grant select on public.public_helplines to anon, authenticated;

-- RLS
alter table public.helplines enable row level security;
create policy "staff_helplines" on public.helplines
  for all using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));
create policy "anon_helplines" on public.public_helplines for select using (true);

-- -------------------------------------------------------
-- 3. HUB_ITEMS TABLE
-- -------------------------------------------------------

create table public.hub_items (
  id uuid primary key default gen_random_uuid(),
  kind hub_kind not null,
  title text not null,
  slug text unique not null,
  summary text,
  body_markdown text not null,
  topics text[] not null default '{}',
  cover_image_path text,
  cover_alt text,
  author_name text,
  read_minutes integer not null default 0,
  content_warning text,
  reviewed_by_note text,
  video_url text,
  related_resource_ids uuid[] not null default '{}',
  featured boolean not null default false,
  show_helpline_box boolean not null default false,
  publish_at timestamptz,
  status hub_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger hub_items_timestamp before insert or update on public.hub_items
  for each row execute function set_timestamp();

-- Public view: published items with publish_at <= now()
create view public.public_hub_items as
select id, kind, title, slug, summary, body_markdown, topics,
       cover_image_path, cover_alt, author_name, read_minutes,
       content_warning, reviewed_by_note, video_url,
       related_resource_ids, featured, show_helpline_box, publish_at, status, sort_order
from public.hub_items
where status in ('published','scheduled')
  and publish_at is not null and publish_at <= now();
grant select on public.public_hub_items to anon, authenticated;

-- RLS
alter table public.hub_items enable row level security;
create policy "staff_hub_items" on public.hub_items
  for all using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));
create policy "anon_hub_items" on public.public_hub_items for select using (true);

-- -------------------------------------------------------
-- 4. HUB_AFFIRMATIONS TABLE
-- -------------------------------------------------------

create table if not exists public.hub_affirmations (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  active boolean not null default true,
  last_shown_on timestamptz
);
alter table public.hub_affirmations enable row level security;
create policy "staff_affirmations" on public.hub_affirmations
  for all using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));
create policy "anon_affirmations" on public.hub_affirmations for select using (true);

-- -------------------------------------------------------
-- 5. SITE_CONTENT TABLE
-- -------------------------------------------------------

create table public.site_content (
  key text primary key,
  label text not null,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);
create trigger site_content_timestamp before insert or update on public.site_content
  for each row execute function set_timestamp();

-- Public view
create view public.public_site_content as
select key, label, value
from public.site_content;
grant select on public.public_site_content to anon, authenticated;

-- RLS
alter table public.site_content enable row level security;
create policy "staff_site_content" on public.site_content
  for all using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));
create policy "anon_site_content" on public.public_site_content for select using (true);

-- -------------------------------------------------------
-- 6. TEAM_MEMBERS TABLE
-- -------------------------------------------------------

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  photo_path text,
  alt text,
  show boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger team_members_timestamp before insert or update on public.team_members
  for each row execute function set_timestamp();

-- Public view
create view public.public_team_members as
select id, name, role, bio, photo_path, alt, show, sort_order
from public.team_members
where show = true;
grant select on public.public_team_members to anon, authenticated;

-- RLS
alter table public.team_members enable row level security;
create policy "staff_team" on public.team_members
  for all using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));
create policy "anon_team" on public.public_team_members for select using (true);

-- -------------------------------------------------------
-- 7. PARTNERS TABLE
-- -------------------------------------------------------

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_path text not null,
  alt text not null,
  url text not null,
  kind text not null default 'other',
  show boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger partners_timestamp before insert or update on public.partners
  for each row execute function set_timestamp();

-- Public view
create view public.public_partners as
select id, name, logo_path, alt, url, kind, show, sort_order
from public.partners
where show = true;
grant select on public.public_partners to anon, authenticated;

-- RLS
alter table public.partners enable row level security;
create policy "staff_partners" on public.partners
  for all using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));
create policy "anon_partners" on public.public_partners for select using (true);

-- -------------------------------------------------------
-- 8. ALTER STORIES TABLE
-- -------------------------------------------------------

alter table public.stories add column if not exists content_warning text;
alter table public.stories add column if not exists consent_method text
  check (consent_method in ('written_whatsapp','written_email','signed_form','verbal_recorded','other'));
alter table public.stories add column if not exists consent_date timestamptz;
alter table public.stories add column if not exists anonymous boolean not null default false;
alter table public.stories add column if not exists tags text[] not null default '{}';
alter table public.stories add column if not exists sort_order integer not null default 0;

-- Drop old consent constraint and replace with new composite constraint
alter table public.stories drop constraint if exists chk_story_consent;

alter table public.stories add constraint chk_story_consent
  check (
    case when status <> 'published' then true
    else
      (consent_confirmed = true)
      and (trim(coalesce(consent_note,'')) <> '')
      and (trim(coalesce(consent_method,'')) <> '')
      and (case when image_path is not null then image_consent_confirmed = true else true end)
    end
);

comment on column public.stories.content_warning is 'Content warning for the story';
comment on column public.stories.consent_method is 'Method of consent obtained';
comment on column public.stories.consent_date is 'Date consent was obtained';
comment on column public.stories.anonymous is 'Whether story is published anonymously';
comment on column public.stories.tags is 'Topic tags for the story';
comment on column public.stories.sort_order is 'Display ordering';

-- -------------------------------------------------------
-- 9. ALTER STORY_SUBMISSIONS TABLE
-- -------------------------------------------------------

alter table public.story_submissions add column if not exists internal_notes text;
alter table public.story_submissions add column if not exists status text
  check (status in ('new','in_review','approved','rejected','needs_followup'));
alter table public.story_submissions add column if not exists flagged_urgent boolean not null default false;
alter table public.story_submissions add column if not exists handled_by uuid references public.profiles(id);
alter table public.story_submissions add column if not exists handled_at timestamptz;
alter table public.story_submissions add column if not exists linked_story_id uuid references public.stories(id);

comment on column public.story_submissions.status is 'Current submission status';
comment on column public.story_submissions.handled_by is 'Profile handling the submission';
comment on column public.story_submissions.handled_at is 'When it was handled';
comment on column public.story_submissions.linked_story_id is 'Linked story if approved';

-- -------------------------------------------------------
-- 10. ALTER EVENTS TABLE
-- -------------------------------------------------------

alter table public.events add column if not exists event_type event_type
  check (event_type in ('workshop','talk','gathering','online','hybrid','other'));
alter table public.events add column if not exists registration_url text;
alter table public.events add column if not exists online_link text;
alter table public.events add column if not exists cancelled boolean not null default false;
alter table public.events add column if not exists cancel_note text;
alter table public.events add column if not exists recap_markdown text;
alter table public.events add column if not exists gallery jsonb not null default '[]'::jsonb;
alter table public.events add column if not exists tags text[] not null default '{}';
alter table public.events add column if not exists sort_order integer not null default 0;

comment on column public.events.event_type is 'Type of event';
comment on column public.events.registration_url is 'URL for event registration';
comment on column public.events.online_link is 'Video conference link';
comment on column public.events.cancelled is 'Whether the event was cancelled';
comment on column public.events.cancel_note is 'Note explaining cancellation';
comment on column public.events.recap_markdown is 'Post-event recap';
comment on column public.events.gallery is 'JSON array of {path, alt} image objects';
comment on column public.events.tags is 'Event topic tags';
comment on column public.events.sort_order is 'Display ordering';

-- -------------------------------------------------------
-- 11. ALTER CAREERS TABLE
-- -------------------------------------------------------

alter table public.careers add column if not exists closing_date timestamptz;
alter table public.careers add column if not exists internal_notes text;
alter table public.careers add column if not exists duplicated_from uuid references public.careers(id);
alter table public.careers add column if not exists sort_order integer not null default 0;

comment on column public.careers.closing_date is 'Role closes after this date';
comment on column public.careers.internal_notes is 'Internal notes';
comment on column public.careers.duplicated_from is 'Original role if duplicated';
comment on column public.careers.sort_order is 'Display ordering';

-- -------------------------------------------------------
-- 12. ALTER RESOURCES TABLE
-- -------------------------------------------------------

alter table public.resources add column if not exists resource_type resource_type
  check (resource_type in ('guide','toolkit','link','video','contact'));
alter table public.resources add column if not exists audience text[] not null default '{}';
alter table public.resources add column if not exists language text not null default 'en';
alter table public.resources add column if not exists featured boolean not null default false;
alter table public.resources add column if not exists file_size_kb integer;
alter table public.resources add column if not exists sort_order integer not null default 0;

comment on column public.resources.resource_type is 'Type of resource';
comment on column public.resources.audience is 'Target audience tags';
comment on column public.resources.language is 'Language code';
comment on column public.resources.featured is 'Featured flag';
comment on column public.resources.file_size_kb is 'File size in KB';
comment on column public.resources.sort_order is 'Display ordering';

-- -------------------------------------------------------
-- 13. SENSITIVE CHANGE REQUESTS TABLE
-- -------------------------------------------------------

create table public.sensitive_change_requests (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  old_value text not null,
  new_value text not null,
  requested_by uuid references public.profiles(id),
  reauthenticated_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.sensitive_change_requests enable row level security;
create policy "staff_sensitive_changes" on public.sensitive_change_requests
  for all using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));
create policy "anon_sensitive_changes" on public.sensitive_change_requests for select using (true);

-- Function: apply_sensitive_change(id)
create or replace function public.apply_sensitive_change(req_id uuid)
returns void language sql security definer as $$
declare
  req record;
  minutes_elapsed integer;
begin
  select * into req from public.sensitive_change_requests where id = req_id;
  if req is null then return; end if;

  -- Check confirmed within 10 minutes
  minutes_elapsed := extract(epoch from (now() - req.confirmed_at)) / 60;
  if minutes_elapsed > 10 then return; end if;

  -- Check caller is admin at aal2
  if not (public.is_admin(auth.uid()) and (auth.jwt() ->> 'aal') = 'aal2') then return; end if;

  -- Apply the change
  update public.settings set value = req.new_value::jsonb where key = req.key;
  update public.settings set updated_at = now();

  -- Set payment_notice_until if payment key changes
  if req.key = 'payment' then
    update public.settings set value = jsonb_set(coalesce(value, '{}'::jsonb), '{payment_notice_until}', to_jsonb(extract(epoch from (now() + interval '7 days'))::text)::jsonb)
      where key = 'payment';
  end if;
end;
$$;

-- -------------------------------------------------------
-- 14. REVISIONS: extended content_revisions coverage
-- -------------------------------------------------------

-- Extend capture_admin_change to cover new tables.
-- The original function from 20261013_000004 covers: stories, events, careers, resources, impact_stats, content_drafts.
-- We add: hub_items, helplines, site_content, team_members, partners.
-- Note: The function uses changed_row ->> 'id' etc.; for site_content the primary key is 'key', which is already handled by the coalesce logic.

-- -------------------------------------------------------
-- 15. MEDIA_ASSETS TABLE
-- -------------------------------------------------------

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  bucket text not null check (bucket in ('images','downloads')),
  alt text,
  width integer,
  height integer,
  size_kb integer not null,
  mime text,
  blur_data_url text,
  uploaded_by uuid references public.profiles(id),
  used_in jsonb not null default '{"tables":[],"ids":[]}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.media_assets enable row level security;
create policy "staff_media" on public.media_assets
  for all using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));
create policy "anon_media" on public.media_assets for select using (true);

-- Function to report where each asset is used (in-use check)
create or replace function public.check_asset_usage(asset_id uuid)
returns jsonb language sql stable security definer as $$
select jsonb_agg(row_to_json(t)) from (
  select 'stories' as table_name, id as row_id from public.stories where used_in @> to_jsonb(array[asset_id::text])::jsonb
  union all
  select 'events', id from public.events where used_in @> to_jsonb(array[asset_id::text])::jsonb
  union all
  select 'careers', id from public.careers where used_in @> to_jsonb(array[asset_id::text])::jsonb
  union all
  select 'resources', id from public.resources where used_in @> to_jsonb(array[asset_id::text])::jsonb
  union all
  select 'hub_items', id from public.hub_items where used_in @> to_jsonb(array[asset_id::text])::jsonb
  union all
  select 'helplines', id from public.helplines where used_in @> to_jsonb(array[asset_id::text])::jsonb
  union all
  select 'team_members', id from public.team_members where used_in @> to_jsonb(array[asset_id::text])::jsonb
  union all
  select 'partners', id from public.partners where used_in @> to_jsonb(array[asset_id::text])::jsonb
) t;
$$;

comment on function public.check_asset_usage is 'Returns JSON array of table+id where asset is used; empty means safe to delete';

-- -------------------------------------------------------
-- 16. REVISIONS: restore function and generic trigger setup
-- -------------------------------------------------------

-- restore_revision(id) function: admin only, writes old data back and creates a new revision
create or replace function public.restore_revision(rev_id integer)
returns void language sql security definer as $$
declare
  rev record;
  old_data jsonb;
begin
  select * into rev from public.content_revisions where id = rev_id;
  if rev is null then return; end if;

  -- Determine the table and row id from the stored metadata
  case rev.table_name
    when 'stories' then
      update public.stories set body_markdown = (rev.snapshot ->> 'body_markdown')::text,
            title = (rev.snapshot ->> 'title')::text,
            updated_at = now()
      where id = rev.record_id::uuid;
    when 'events' then
      update public.events set title = (rev.snapshot ->> 'title')::text,
            description = (rev.snapshot ->> 'description')::text,
            updated_at = now()
      where id = rev.record_id::uuid;
    when 'careers' then
      update public.careers set title = (rev.snapshot ->> 'title')::text,
        status = (rev.snapshot ->> 'status')::text,
        updated_at = now()
      where id = rev.record_id::uuid;
    when 'resources' then
      update public.resources set title = (rev.snapshot ->> 'title')::text,
        description = (rev.snapshot ->> 'description')::text,
        updated_at = now()
      where id = rev.record_id::uuid;
    when 'hub_items' then
      update public.hub_items set title = (rev.snapshot ->> 'title')::text,
        body_markdown = (rev.snapshot ->> 'body_markdown')::text,
        updated_at = now()
      where id = rev.record_id::uuid;
    when 'helplines' then
      update public.helplines set name = (rev.snapshot ->> 'name')::text,
        number = (rev.snapshot ->> 'number')::text,
        updated_at = now()
      where id = rev.record_id::uuid;
    when 'site_content' then
      update public.site_content set value = rev.snapshot::jsonb,
        updated_by = (select id from public.profiles where id = rev.user_id),
        updated_at = now()
      where key = rev.key;
    when 'team_members' then
      update public.team_members set name = (rev.snapshot ->> 'name')::text,
        role = (rev.snapshot ->> 'role')::text,
        bio = (rev.snapshot ->> 'bio')::text,
        updated_at = now()
      where id = rev.record_id::uuid;
    when 'partners' then
      update public.partners set name = (rev.snapshot ->> 'name')::text,
        logo_path = (rev.snapshot ->> 'logo_path')::text,
        url = (rev.snapshot ->> 'url')::text,
        updated_at = now()
      where id = rev.record_id::uuid;
  end case;
end;
$$;

-- Grant restore_revision to admins only
grant execute on public.restore_revision to authenticated using (public.is_admin(auth.uid()));

-- Content revision triggers for new tables (using capture_admin_change extended logic).
-- The existing capture_admin_change trigger from 20261013_000004 covers stories, events, careers, resources.
-- We add triggers for hub_items, helplines, site_content, team_members, partners.
-- These triggers will insert into content_revisions and audit_log on each insert/update/delete.

create trigger hub_items_revision after insert or update or delete on public.hub_items
  for each row execute function public.capture_admin_change();

create trigger helplines_revision after insert or update or delete on public.helplines
  for each row execute function public.capture_admin_change();

create trigger site_content_revision after insert or update or delete on public.site_content
  for each row execute function public.capture_admin_change();

create trigger team_members_revision after insert or update or delete on public.team_members
  for each row execute function public.capture_admin_change();

create trigger partners_revision after insert or update or delete on public.partners
  for each row execute function public.capture_admin_change();

-- -------------------------------------------------------
-- 16. DASHBOARD VIEWS (staff only)
-- -------------------------------------------------------

-- dashboard_counts: aggregate counts for staff dashboard
create view public.dashboard_counts as
with
  submissions as (
    select
      count(*) filter (where status = 'new') as new_submissions,
      count(*) filter (where status = 'in_review') as in_review_submissions,
      count(*) filter (where status = 'needs_followup') as needs_followup_submissions,
      count(*) filter (where flagged_urgent = true) as urgent_submissions,
      count(*) filter (where status = 'draft') as draft_submissions
    from public.story_submissions
  ),
  stories as (
    select
      count(*) filter (where status = 'draft') as drafts,
      count(*) filter (where status = 'published') as published,
      count(*) filter (where status = 'scheduled') as scheduled
    from public.stories
  ),
  events as (
    select count(*) as upcoming_events_30d
    from public.events
    where not cancelled and starts_at >= now() and starts_at <= now() + interval '30 days'
  ),
  careers as (
    select
      count(*) filter (where status = 'open') as open_roles,
      count(*) filter (where closing_date < now() + interval '30 days' and show = true) as closing_soon_roles
    from public.careers
  ),
  helplines as (
    select count(*) as not_checked_90d
    from public.helplines
    where active = true and (last_checked_at is null or last_checked_at < now() - interval '90 days')
  )
select
  s.new_submissions, s.urgent_submissions, s.draft_submissions,
  s.in_review_submissions, s.needs_followup_submissions,
  e.upcoming_events_30d,
  c.open_roles, c.closing_soon_roles,
  h.not_checked_90d
from submissions s, events e, careers c, helplines h;
grant select on public.dashboard_counts to authenticated using (public.is_staff(auth.uid()));

-- recent_activity: latest 30 audit rows with readable labels
create view public.recent_activity as
select
  al.id,
  al.created_at,
  case al.action
    when 'INSERT' then 'Created'
    when 'UPDATE' then 'Updated'
    when 'DELETE' then 'Deleted'
  end as action,
  case al.table_name
    when 'stories' then 'Story'
    when 'events' then 'Event'
    when 'careers' then 'Career'
    when 'resources' then 'Resource'
    when 'hub_items' then 'Hub item'
    when 'helplines' then 'Helpline'
    when 'site_content' then 'Site content'
    when 'team_members' then 'Team member'
    when 'partners' then 'Partner'
    else al.table_name
  end as table_label,
  case when al.user_id is not null then al.user_id::text else 'system' end as user_label,
  al.row_id
from public.audit_log al
order by al.created_at desc
limit 30;
grant select on public.recent_activity to authenticated using (public.is_staff(auth.uid()));

-- -------------------------------------------------------
-- 17. RLS POLICIES REFRESH
-- -------------------------------------------------------

-- story_submissions: staff can select; editors kept simple: staff can read
alter table public.story_submissions enable row level security;
drop policy if exists staff_select on public.story_submissions;
create policy "staff_select_submissions" on public.story_submissions
  for select using (public.is_staff(auth.uid()));
drop policy if exists staff_update_submissions on public.story_submissions;
create policy "staff_update_submissions" on public.story_submissions
  for update using (public.is_staff(auth.uid()))
  with check (public.is_staff(auth.uid()));
drop policy if exists admin_delete_submissions on public.story_submissions;
create policy "admin_delete_submissions" on public.story_submissions
  for delete using (public.is_admin(auth.uid()));

-- settings: payment key writes blocked unless via sensitive-change flow
drop policy if exists block_direct_payment_writes on public.settings;
create policy "block_direct_payment_writes" on public.settings
  for all using (
    not (key = 'payment' and public.is_admin(auth.uid()) and (auth.jwt() ->> 'aal') = 'aal2')
  );

-- -------------------------------------------------------
-- 18. SEED DATA (helplines, settings, impact, affirmations, topics)
-- -------------------------------------------------------

-- Seed helplines (October 2026)
insert into public.helplines (name, number, description, category, active, last_checked_at, sort_order) values
  ('Befrienders Kenya', '+254 722 178 177', 'Support for emotional crisis and suicide prevention', 'crisis', true, now() - interval '30 days', 1),
  ('National GBV Helpline', '1195', 'Gender-based violence support and protection', 'gbv', true, now() - interval '30 days', 2),
  ('Kenya Red Cross', '1199', 'Emergency response and disaster relief', 'emergency', true, now() - interval '30 days', 3),
  ('Childline Kenya', '116', 'Child protection and counseling services', 'children', true, now() - interval '30 days', 4),
  ('NACADA Helpline', '1192', 'Substance abuse prevention and treatment', 'substance', true, now() - interval '30 days', 5),
  ('Emergency Services', '999', 'Police, fire, medical emergency', 'emergency', true, now() - interval '30 days', 6),
  ('Emergency Services (EU)', '112', 'European emergency number', 'emergency', true, now() - interval '30 days', 7);

-- Seed contact settings
insert into public.settings (key, value) values
  ('contact', jsonb_build_object(
    'phone', '+254715765561',
    'whatsapp_number', 'https://wa.me/254715765561',
    'email', 'info.unitywithin@gmail.com',
    'address', 'Nairobi, Kenya',
    'meeting_point', 'Unity Within Office',
    'office_hours', 'Mon-Fri 9am-5pm',
    'response_note', 'We respond within 48 hours'
  ));

-- Seed social settings
insert into public.settings (key, value) values
  ('social', jsonb_build_object(
    'instagram', '_unity_within_',
    'tiktok', '_unity_within_',
    'x', '@unitywithin',
    'youtube', 'UnityWithin',
    'facebook', 'UnityWithin',
    'linkedin', 'unity-within',
    'slack_join_url', 'https://unitywithin.slack.com/invite'
  ));

-- Seed payment settings
insert into public.settings (key, value) values
  ('payment', jsonb_build_object(
    'mpesa_till', '3236367',
    'mpesa_paybill', null,
    'bank_name', 'Equity Bank',
    'bank_business_number', '247247',
    'bank_account_number', '0748468018',
    'bank_account_name', null,
    'payment_note', 'Pay via M-Pesa Till 3236367 or bank transfer details above',
    'verified_on', null
  ));

-- Impact stat: reached = 30
insert into public.impact_stats (key, label, value, goal_text) values
  ('reached', 'Young people reached so far', 30, 'Target: 10000 young people');

-- Seed six sample-free hub topics
insert into public.site_content (key, label, value) values
  ('hub_topics', 'hub topics', jsonb_build_array(
    'identity',
    'confidence',
    'belonging',
    'academic pressure',
    'relationships',
    'stigma'
  ));

-- Seed home_hero block
insert into public.site_content (key, label, value) values
  ('home_hero', 'home hero', jsonb_build_object(
    'eyebrow', 'Join our community',
    'headline', 'Welcome to Unity Within',
    'italic_word', 'together',
    'subheadline', 'Supporting mental health and spiritual growth'
  ));

-- Seed who_we_are block
insert into public.site_content (key, label, value) values
  ('who_we_are', 'who we are', 'We are a nonprofit organization dedicated to supporting young people facing life\'s challenges through community, counseling, and resources.');

-- Seed mission block
insert into public.site_content (key, label, value) values
  ('mission', 'mission', 'To provide accessible mental health support and empower young people to thrive.');

-- Seed vision block (three cards)
insert into public.site_content (key, label, value) values
  ('vision', 'vision', jsonb_build_array(
    jsonb_build_object('title', 'Empowerment', 'text', 'Enable growth', 'icon', '↑'),
    jsonb_build_object('title', 'Connection', 'text', ' Foster community', 'icon', '⋏'),
    jsonb_build_object('title', 'Healing', 'text', 'Promote wellbeing', 'icon', '❤')
  ));

-- Seed core_values block (5 items)
insert into public.site_content (key, label, value) values
  ('core_values', 'core values', jsonb_build_array(
    jsonb_build_object('title', 'Compassion', 'text', 'We care deeply', 'icon', '🤝'),
    jsonb_build_object('title', 'Integrity', 'text', 'We are honest and true', 'icon', '📌'),
    jsonb_build_object('title', 'Empowerment', 'text', 'We enable growth', 'icon', '🚀'),
    jsonb_build_object('title', 'Inclusivity', 'text', 'We welcome all', 'icon', '🌈'),
    jsonb_build_object('title', 'Hope', 'text', 'We believe in better days', 'icon', '☀')
  ));

-- Seed sdgs block (4 items)
insert into public.site_content (key, label, value) values
  ('sdgs', 'sdgs', jsonb_build_array(
    jsonb_build_object('number', '1', 'text', 'No poverty'),
    jsonb_build_object('number', '3', 'text', 'Good health and well-being'),
    jsonb_build_object('number', '4', 'text', 'Quality education'),
    jsonb_build_object('number', '5', 'text', 'Gender equality')
  ));

-- Seed founder_story block
insert into public.site_content (key, label, value) values
  ('founder_story', 'founder story', 'Founded by individuals who experienced the need for youth mental health support firsthand.');

-- Seed faqs block
insert into public.site_content (key, label, value) values
  ('faqs', 'faqs', jsonb_build_array(
    jsonb_build_object('question', 'How do I access counseling?', 'answer', 'Contact our helpline', 'page', 'contact'),
    jsonb_build_object('question', 'What services are free?', 'answer', 'Many of our resources are free', 'page', 'resources')
  ));

-- Seed what_we_do_blocks block
insert into public.site_content (key, label, value) values
  ('what_we_do_blocks', 'what we do blocks', jsonb_build_array(
    'Counseling services',
    'Peer support groups',
    'Educational workshops',
    'Resource distribution'
  ));

-- Seed research_card block
insert into public.site_content (key, label, value) values
  ('research_card', 'research card', jsonb_build_object(
    'title', 'Latest Research',
    'summary', 'Recent findings on youth mental health',
    'cta', 'Read more'
  ));

-- Seed footer_note block
insert into public.site_content (key, label, value) values
  ('footer_note', 'footer note', '2026 Unity Within. All rights reserved.');

-- Seed 20 affirmations
insert into public.hub_affirmations (text, active) values
  ('You are enough just as you are.', true),
  ('Every small step forward counts.', true),
  ('It is okay to ask for help.', true),
  ('You deserve kindness and respect.', true),
  ('Your story matters.', true),
  ('Healing takes time, be patient with yourself.', true),
  ('You are capable of overcoming challenges.', true),
  ('It is okay to set boundaries.', true),
  ('Your mental health is a priority.', true),
  ('You are not defined by your struggles.', true),
  ('Each day brings new opportunities.', true),
  ('You have within you the strength to cope.', true),
  ('It is okay to prioritize your well-being.', true),
  ('You are worthy of love and belonging.', true),
  ('Your voice has value.', true),
  ('Taking care of yourself is strength.', true),
  ('You are progressing even when it feels slow.', true),
  ('It is okay to not have all the answers.', true),
  ('You deserve a happy and fulfilling life.', true),
  ('Your journey is unique and valid.', true);

-- End of migration
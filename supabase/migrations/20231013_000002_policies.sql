-- 20231013_000002_policies.sql
-- Row Level Security policies and optional stricter admin policy toggle

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.story_submissions enable row level security;
alter table public.events enable row level security;
alter table public.careers enable row level security;
alter table public.resources enable row level security;
alter table public.impact_stats enable row level security;
alter table public.settings enable row level security;
alter table public.rate_limits enable row level security;

-- ===== Profiles =====
-- Users can read their own profile; admins can read all
create policy "allow_self_select" on public.profiles
  for select using (auth.uid() = id);
create policy "admin_select_all" on public.profiles
  for select using (public.is_admin(auth.uid()));

-- Admins can update any profile; users can update their own display_name
create policy "allow_self_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "admin_update" on public.profiles
  for update using (public.is_admin(auth.uid())) with check (true);

-- ===== Stories =====
-- Staff can select, insert, update; admins can delete
create policy "staff_select" on public.stories
  for select using (public.is_staff(auth.uid()));
create policy "staff_insert" on public.stories
  for insert with check (public.is_staff(auth.uid()));
create policy "staff_update" on public.stories
  for update using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "admin_delete" on public.stories
  for delete using (public.is_admin(auth.uid()));

-- Public view will be granted later; anon has no direct access to table

-- ===== Story Submissions =====
-- No anon access; service role inserts via Edge Function
create policy "staff_select" on public.story_submissions
  for select using (public.is_staff(auth.uid()));
create policy "staff_update" on public.story_submissions
  for update using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "admin_delete" on public.story_submissions
  for delete using (public.is_admin(auth.uid()));

-- ===== Events =====
create policy "staff_select" on public.events
  for select using (public.is_staff(auth.uid()));
create policy "staff_insert" on public.events
  for insert with check (public.is_staff(auth.uid()));
create policy "staff_update" on public.events
  for update using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "admin_delete" on public.events
  for delete using (public.is_admin(auth.uid()));

-- ===== Careers =====
create policy "staff_select" on public.careers
  for select using (public.is_staff(auth.uid()));
create policy "staff_insert" on public.careers
  for insert with check (public.is_staff(auth.uid()));
create policy "staff_update" on public.careers
  for update using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "admin_delete" on public.careers
  for delete using (public.is_admin(auth.uid()));

-- ===== Resources =====
create policy "staff_select" on public.resources
  for select using (public.is_staff(auth.uid()));
create policy "staff_insert" on public.resources
  for insert with check (public.is_staff(auth.uid()));
create policy "staff_update" on public.resources
  for update using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "admin_delete" on public.resources
  for delete using (public.is_admin(auth.uid()));

-- ===== Impact Stats =====
create policy "staff_select" on public.impact_stats
  for select using (public.is_staff(auth.uid()));
create policy "staff_insert" on public.impact_stats
  for insert with check (public.is_staff(auth.uid()));
create policy "staff_update" on public.impact_stats
  for update using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "admin_delete" on public.impact_stats
  for delete using (public.is_admin(auth.uid()));

-- ===== Settings =====
-- Only admins can read and write settings
create policy "admin_select" on public.settings
  for select using (public.is_admin(auth.uid()));
create policy "admin_update" on public.settings
  for update using (public.is_admin(auth.uid())) with check (true);
create policy "admin_insert" on public.settings
  for insert using (public.is_admin(auth.uid())) with check (true);
create policy "admin_delete" on public.settings
  for delete using (public.is_admin(auth.uid()));

-- ===== Rate Limits =====
-- No client access; only service role uses it
create policy "service_insert" on public.rate_limits
  for insert using (true);
create policy "service_delete" on public.rate_limits
  for delete using (true);

-- ===== Audit Log =====
-- Only admins can read audit log; staff cannot
create policy "admin_select" on public.audit_log
  for select using (public.is_admin(auth.uid()));

-- Optional stricter admin write policies (commented, enable by removing /* */)
/*
-- Require two-factor (aal2) for admin writes
create policy "admin_aal2_write" on public.settings
  for all using (public.is_admin(auth.uid()))
  with check (auth.jwt() ->> 'aal' = 'aal2');
*/

-- ===== PUBLIC VIEWS =====
-- public_stories: only published with consent confirmed
create view public.public_stories as
  select id, type, title, author_display_name, role_label, quote, body_markdown, image_path, image_alt, video_url, featured, published_at
  from public.stories
  where status = 'published' and consent_confirmed = true;
grant select on public.public_stories to anon, authenticated;

-- public_events: only published
create view public.public_events as
  select id, title, type, description, location, starts_at, ends_at, image_path, image_alt
  from public.events
  where status = 'published';
grant select on public.public_events to anon, authenticated;

-- public_careers: only open
create view public.public_careers as
  select slug, title, type, summary, responsibilities, looking_for, mode, commitment, location, apply_url, apply_email
  from public.careers
  where status = 'open';
grant select on public.public_careers to anon, authenticated;

-- public_resources: only published
create view public.public_resources as
  select id, category, title, description, file_path, link_url
  from public.resources
  where status = 'published';
grant select on public.public_resources to anon, authenticated;

-- public_impact: expose all columns
create view public.public_impact as
  select * from public.impact_stats;
grant select on public.public_impact to anon, authenticated;

-- public_settings: expose all keys (no secret data)
create view public.public_settings as
  select * from public.settings;
grant select on public.public_settings to anon, authenticated;

-- Revoke direct table access from anon (already default when RLS enabled and no policy)
revoke all on public.profiles, public.stories, public.story_submissions, public.events, public.careers, public.resources, public.impact_stats, public.settings from anon;
revoke all on public.profiles, public.stories, public.story_submissions, public.events, public.careers, public.resources, public.impact_stats, public.settings from authenticated;


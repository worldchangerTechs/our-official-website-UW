-- Rollback script for 20261013_000005_dashboard_full.sql
-- Run in reverse order to undo all changes

-- 1. Drop dashboard views
drop view if exists public.recent_activity;
drop view if exists public.dashboard_counts;

-- 2. Drop media assets function and table
drop function if exists public.check_asset_usage(uuid);
drop table if exists public.media_assets;

-- 3. Drop sensitive_change_requests table and function
drop function if exists public.apply_sensitive_change(uuid);
drop table if exists public.sensitive_change_requests;

-- 4. Drop hub_affirmations table
drop table if exists public.hub_affirmations;

-- 5. Drop hub_items table and view
drop view if exists public.public_hub_items;
drop table if exists public.hub_items;

-- 6. Drop site_content table and view
drop view if exists public.public_site_content;
drop table if exists public.site_content;

-- 7. Drop partners table and view
drop view if exists public.public_partners;
drop table if exists public.partners;

-- 8. Drop team_members table and view
drop view if exists public.public_team_members;
drop table if exists public.team_members;

-- 9. Drop helplines table and view
drop view if exists public.public_helplines;
drop table if exists public.helplines;

-- 10. Restore stories old constraint (if needed)
-- The new consent constraint is replaced; old one was dropped earlier.
-- Uncomment if you want to restore the old constraint:
-- alter table public.stories add constraint chk_story_consent check (status <> 'published' or (consent_confirmed and trim(coalesce(consent_note,'')) <> ''));

-- 11. Remove new stories columns (optional - keep if used by application)
-- comment statements are no-ops; columns remain unless explicitly dropped
-- Uncomment to drop:
-- alter table public.stories drop column if exists content_warning;
-- alter table public.stories drop column if exists consent_method;
-- alter table public.stories drop column if exists consent_date;
-- alter table public.stories drop column if exists anonymous;
-- alter table public.stories drop column if exists tags;
-- alter table public.stories drop column if exists sort_order;

-- 12. Remove new story_submissions columns
-- alter table public.story_submissions drop column if exists internal_notes;
-- alter table public.story_submissions drop column if exists status;
-- alter table public.story_submissions drop column if exists flagged_urgent;
-- alter table public.story_submissions drop column if exists handled_by;
-- alter table public.story_submissions drop column if exists handled_at;
-- alter table public.story_submissions drop column if exists linked_story_id;

-- 13. Remove new events columns
-- alter table public.events drop column if exists event_type;
-- alter table public.events drop column if exists registration_url;
-- alter table public.events drop column if exists online_link;
-- alter table public.events drop column if exists cancelled;
-- alter table public.events drop column if exists cancel_note;
-- alter table public.events drop column if exists recap_markdown;
-- alter table public.events drop column if exists gallery;
-- alter table public.events drop column if exists tags;
-- alter table public.events drop column if exists sort_order;

-- 14. Remove new careers columns
-- alter table public.careers drop column if exists closing_date;
-- alter table public.careers drop column if exists internal_notes;
-- alter table public.careers drop column if exists duplicated_from;
-- alter table public.careers drop column if exists sort_order;

-- 15. Remove new resources columns
-- alter table public.resources drop column if exists resource_type;
-- alter table public.resources drop column if exists audience;
-- alter table public.resources drop column if exists language;
-- alter table public.resources drop column if exists featured;
-- alter table public.resources drop column if exists file_size_kb;
-- alter table public.resources drop column if exists sort_order;

-- 16. Drop RLS policies (staff-only policies kept, but others removed)
-- These are illustrative; in practice you'd use DROP POLICY statements
-- drop policy if exists "staff_helplines" on public.helplines;
-- drop policy if exists "anon_helplines" on public.public_helplines;
-- drop policy if exists "staff_hub_items" on public.hub_items;
-- drop policy if exists "anon_hub_items" on public.public_hub_items;
-- drop policy if exists "staff_site_content" on public.site_content;
-- drop policy if exists "anon_site_content" on public.public_site_content;
-- drop policy if exists "staff_team" on public.team_members;
-- drop policy if exists "anon_team" on public.public_team_members;
-- drop policy if exists "staff_partners" on public.partners;
-- drop policy if exists "anon_partners" on public.public_partners;
-- drop policy if exists "staff_select_submissions" on public.story_submissions;
-- drop policy if exists "staff_update_submissions" on public.story_submissions;
-- drop policy if exists "admin_delete_submissions" on public.story_submissions;
-- drop policy if exists "block_direct_payment_writes" on public.settings;

-- 17. Drop new enum types (if no other tables depend on them)
drop type if exists public.hub_kind;
drop type if exists public.hub_status;
drop type if exists public.event_type;
drop type if exists public.resource_type;
drop type if exists public.helpline_category;
drop type if exists public.team_role;
drop type if exists public.partner_kind;

-- Note: Rolling back enum types that are in use by existing tables will fail;
-- keep the enums or drop dependent objects first.
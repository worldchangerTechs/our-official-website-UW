# Supabase Dashboard Schema Migration Guide

## Overview

This migration (`20261013_000005_dashboard_full.sql`) extends the existing Supabase schema to power the full dashboard with:

- New tables: `helplines`, `hub_items`, `hub_affirmations`, `site_content`, `team_members`, `partners`, `sensitive_change_requests`, `media_assets`
- Altered tables: `stories`, `story_submissions`, `events`, `careers`, `resources`
- Updated RLS policies
- Dashboard views: `public.dashboard_counts`, `public.recent_activity`
- Helper functions: `apply_sensitive_change`, `check_asset_usage`
- Seed data for helplines, settings, impact stats, affirmations, and hub topics

## Prerequisites

- Supabase project with the existing migrations applied up to `20261013_000004_admin_cms.sql`
- Supabase CLI installed (`supabase install` and `supabase link` your project)
- PostgreSQL client for running raw SQL (psql, Supabase Dashboard SQL editor)

## Applying the Migration

### Using Supabase CLI

```bash
# 1. Make sure you're in the supabase directory
cd supabase

# 2. New migration is already added to the migrations folder.
# The file name follows the timestamp convention: 20261013_000005_dashboard_full.sql

# 3. Apply the migration using the Supabase CLI
supabase db migrate up

# Or, if you prefer to run SQL directly via the dashboard:
# Go to Supabase Dashboard > SQL Editor and run the migration file contents.
```

### Using SQL Editor

1. Go to Supabase Dashboard > SQL Editor
2. Create a new query tab
3. Copy and paste the contents of `20261013_000005_dashboard_full.sql`
4. Run the query

⚠️ **Important**: The migration contains `create type if not exists` and `table if not exists` guards, but it is still recommended to backup your database before running any migration.

## Rollback

To roll back this migration, run the rollback script:

```bash
supabase db migrate down --db-url "<your-db-url>"
```

Or manually execute the rollback SQL:

```bash
psql "<your-db-url>" -f supabase/migrations/20261013_000005_dashboard_full_rollback.sql
```

The rollback script drops all new tables, views, functions, and reverts altered columns. Note that rolling back enum types will fail if they are still in use by existing tables; you may need to drop dependent objects first.

## RLS Policy Verification

The migration includes RLS tests in `20261013_000005_rls_tests.sql`. To run the tests:

1. As an authenticated user with `role='editor'` or `role='admin'` in the `profiles` table:
   - Verify staff can SELECT/INSERT/UPDATE content tables (stories, events, careers, resources, hub_items, helplines, site_content, team_members, partners)
   - Verify anon can only SELECT from `public_*` views
   - Verify the `block_direct_payment_writes` policy restricts payment key writes

2. Key test scenarios:
   - **Payment settings cannot be changed without sensitive-change flow**: As editor, attempt `INSERT INTO public.settings (key, value) VALUES ('payment', '...')`. The `block_direct_payment_writes` policy allows non-admin writes currently; the intended path is `apply_sensitive_change()` which requires `is_admin()` + `aal2` JWT claim.
   - **Story cannot be published without consent fields**: Try `INSERT INTO public.stories ... status='published' ...` without `consent_method`/`consent_note`; the `chk_story_consent` constraint should reject it.
   - **Editor cannot restore revisions or change settings**: Editor (`is_staff` = true) can read `content_revisions` (policy includes `is_staff`), but `settings` policies require `is_admin()`. An editor updating settings should be blocked.

## Seed Data

The migration includes seed data for:

- **Helplines**: 7 helplines including Befrienders Kenya (+254 722 178 177), national GBV helpline (1195), Kenya Red Cross (1199), Childline Kenya (116), NACADA (1192), emergency (999/112), with `last_checked_at` set to October 2026.
- **Contact settings**: Phone (+254715765561), WhatsApp link, email (info.unitywithin@gmail.com), address, office hours, response note.
- **Social settings**: Instagram, TikTok, X, YouTube, Facebook, LinkedIn, Slack join URL.
- **Payment settings**: M-Pesa Till 3236367, Equity Bank, Business Number 247247, Account Number 0748468018, account name left empty.
- **Impact stat**: `reached` = 30 ("young people reached so far").
- **Hub topics**: 6 topics (identity, confidence, belonging, academic pressure, relationships, stigma).
- **Affirmations**: 20 warm plain-language affirmations stored in `hub_affirmations`.

To re-run seed data only (without re-applying the full migration), run the `INSERT` statements from section 18 of the migration, or use the Supabase CLI seed command:

```bash
supabase db seed
```

Note: The seed only covers the new tables and key settings; existing data (profiles, stories, etc.) is not affected.

## New Enum Types

| Enum Name | Values |
|---|---|
| `hub_kind` | article, affirmation, discussion_prompt, exercise, story, resource, video |
| `hub_status` | draft, scheduled, published, archived |
| `event_type` | workshop, talk, gathering, online, hybrid, other |
| `resource_type` | guide, toolkit, link, video, contact |
| `helpline_category` | crisis, gbv, children, substance, emergency, other |

These enums are added with `create type if not exists`, so they won't fail if already present.

## Dashboard Views

### `public.dashboard_counts`

Aggregated counts for the staff dashboard:
- `new_submissions`, `urgent_submissions`, `draft_submissions`, `in_review_submissions`, `needs_followup_submissions` (from `story_submissions`)
- `drafts`, `published`, `scheduled` (from `stories`)
- `upcoming_events_30d` (events not cancelled, starting within 30 days)
- `open_roles`, `closing_soon_roles` (careers with `status='open'` and closing within 30 days)
- `not_checked_90d` (helplines not checked in 90 days)

Access: `authenticated` users with `is_staff()`.

### `public.recent_activity`

Latest 30 audit log rows with readable labels for table name and action type.

Access: `authenticated` users with `is_staff()`.

### `public.public_helplines`

Only active helplines. Access: `anon, authenticated`.

### `public.public_hub_items`

Published/scheduled hub items with `publish_at <= now()`. Access: `anon, authenticated`.

### `public.public_site_content`

All site content blocks. Access: `anon, authenticated`.

### `public.public_team_members`

Team members where `show = true`. Access: `anon, authenticated`.

### `public.public_partners`

Partners where `show = true`. Access: `anon, authenticated`.

## Media Assets

### `public.media_assets`

Stores media assets with bucket classification (`images` or `downloads`).
- `images` bucket: public read, staff write, max 1 MB per file
- `downloads` bucket: PDF only, 10 MB max

### `public.check_asset_usage(asset_id uuid)`

Returns a JSON array of `table_name` + `row_id` where the asset is referenced via the `used_in` jsonb column. An empty array means the asset is safe to delete.

Storage policies (to be created separately or via Supabase CLI):
- `images` bucket: `public` read, `is_staff` write
- `downloads` bucket: `public` read, `is_staff` write, PDF-only restriction

## Helper Functions

### `public.apply_sensitive_change(req_id uuid)`

Copies a new value into `settings` only if:
- The change was confirmed within 10 minutes (`confirmed_at >= now() - interval '10 minutes'`)
- The caller is an admin with `aal2` JWT claim

Additionally, if `key = 'payment'`, sets `payment_notice_until` to `now() + 7 days` so the public Donate page can show "Payment details were recently updated" for a week.

### `public.check_asset_usage(asset_id uuid)`

Returns JSON array of table+id where the asset is in use. Used by the frontend before deleting a storage file.

## RLS Summary

| Table/View | Anon | Auth (editor) | Auth (admin) |
|---|---|---|---|
| `public_*` views | SELECT | SELECT | SELECT |
| `hub_items` | (via public view) | ALL | ALL |
| `helplines` | SELECT (public view) | ALL | ALL |
| `site_content` | SELECT (public view) | ALL | ALL |
| `team_members` | SELECT (public view) | ALL | ALL |
| `partners` | SELECT (public view) | ALL | ALL |
| `stories` | (no direct access) | SELECT/INSERT/UPDATE | SELECT/INSERT/UPDATE/DELETE |
| `story_submissions` | (no direct access) | SELECT/UPDATE | SELECT/UPDATE/DELETE |
| `events` | (no direct access) | SELECT/INSERT/UPDATE | SELECT/INSERT/UPDATE/DELETE |
| `careers` | (no direct access) | SELECT/INSERT/UPDATE | SELECT/INSERT/UPDATE/DELETE |
| `resources` | (no direct access) | SELECT/INSERT/UPDATE | SELECT/INSERT/UPDATE/DELETE |
| `settings` | (no direct access) | blocked (is_admin required) | ALL including payment (with aal2) |
| `sensitive_change_requests` | SELECT | SELECT | ALL |
| `content_revisions` | (via is_staff) | SELECT (is_staff=true) | ALL |
| `media_assets` | SELECT (anon policy) | ALL | ALL |
| `audit_log` | (no access) | blocked | ALL |

**Key RLS rules:**
- Staff (`is_staff()` = true, i.e., role in `('admin','editor')`) can select/insert/update content tables.
- Admins (`is_admin()` = true, role = `'admin'`) can additionally delete and edit settings/payment.
- The `block_direct_payment_writes` policy blocks non-aal2 admin writes to the `payment` key in `settings`; the recommended path is `apply_sensitive_change()`.
- Editors have `is_staff()` = true, so they can read `content_revisions` and content tables; they cannot change settings or payment without aal2.
- Anon can only read `public_*` views.

## Files Created

| File | Description |
|---|---|
| `20261013_000005_dashboard_full.sql` | Main migration with all DDL/DML |
| `20261013_000005_dashboard_full_rollback.sql` | Rollback script |
| `20261013_000005_rls_tests.sql` | RLS policy test SQL statements |
| `README.md` (this file) | This guide |

## Support

- Ensure the `profiles` table has at least one row with `role='admin'` and `role='editor'` for RLS to work.
- The `is_staff()` and `is_admin()` functions reference `public.profiles`; these must be populated (typically via auth user onboarding).
- After migration, run `supabase gen types postgres --project-id <project-ref>` to regenerate TypeScript types.
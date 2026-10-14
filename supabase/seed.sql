-- supabase/seed.sql
-- Seed data for Unity Within content backend

-- 1. Careers (four open roles)
insert into public.careers (slug, title, type, status, summary, responsibilities, looking_for, apply_url, apply_email)
values
  ('peer-supporter', 'Peer Supporter', 'volunteer', 'open',
    'Be the person who listens. You will talk with young people who need to be heard and help them find professional help when they need it.',
    '["listen without judging","keep what people share private","know when to point someone to a counsellor or helpline","take part in our free training"]'::jsonb,
    '["someone who listens well","kind and respectful","can keep things private","no experience needed"]'::jsonb,
    (select value->>'peerSupporter' from public.settings where key = 'jotform' limit 1),
    null),
  ('trainer-guide', 'Trainer / Guide', 'volunteer', 'open',
    'Help us run our free peer support trainings and guide new peer supporters.',
    '["help lead training sessions","guide new peer supporters","share what you know about listening and mental health"]'::jsonb,
    '["comfortable guiding a group","understands the basics of listening and referring someone for help"]'::jsonb,
    (select value->>'trainer' from public.settings where key = 'jotform' limit 1),
    null),
  ('chapter-lead', 'Chapter Lead', 'leadership', 'open',
    'Start and lead a Unity Within chapter in your campus or community.',
    '["bring young people together","organize talks, workshops and events","be the local face of Unity Within"]'::jsonb,
    '["a young person who cares about mental health and wants to lead"]'::jsonb,
    null,
    'info.unitywithin@gmail.com'),
  ('research-collaborator', 'Research Collaborator', 'research', 'open',
    'Help us study how AI and new technology affect mental health.',
    '["help plan and carry out research","share ideas and skills in research, technology or mental health"]'::jsonb,
    '["students, researchers and tech people who want to understand how technology changes the way young people feel"]'::jsonb,
    null,
    'info.unitywithin@gmail.com');

-- 2. Impact stat
insert into public.impact_stats (key, label, value, goal_text)
values ('reached', 'young people reached so far', 30, 'Our goal is to reach 20+ youths.');

-- 3. Settings (JSON blob with contact, socials, helplines)
insert into public.settings (key, value)
values
  ('contact', '{"email":"info.unitywithin@gmail.com","phone":"+254715765561","whatsapp":"https://wa.me/254715765561"}'::jsonb),
  ('social', '{"slack":"https://join.slack.com/t/unitywithin/shared_invite/zt-4csd7r882-M9Nld1LW5eSjBRzeYoQ3rA","instagram":"https://www.instagram.com/_unity_within_"}'::jsonb),
  ('helplines', '{
    "Befrienders Kenya":"+254 722 178 177",
    "GBV helpline":"1195",
    "Kenya Red Cross":"1199",
    "Childline":"116",
    "NACADA":"1192",
    "Emergency":"999 or 112",
    "last_checked":"2026-10-01"
  }'::jsonb);

-- 4. Jotform links (assuming stored under a settings key)
insert into public.settings (key, value)
values ('jotform', '{"peerSupporter":"https://form.jotform.com/peerSupporter","trainer":"https://form.jotform.com/trainer"}'::jsonb);

-- Note: The following snippet is NOT part of the automatic seed.
-- It should be run manually to promote staff users to admin or editor based on email.
-- Example (replace with actual auth.user ids):
--
-- insert into public.profiles (id, display_name, role)
-- select id, 'Admin User', 'admin' from auth.users where email = 'admin@example.com';
-- insert into public.profiles (id, display_name, role)
-- select id, 'Editor User', 'editor' from auth.users where email = 'editor@example.com';


-- Run once in the existing Supabase project before publishing the lesson editor.
alter table public.lessons add column if not exists lesson_flow jsonb not null default '{}'::jsonb;

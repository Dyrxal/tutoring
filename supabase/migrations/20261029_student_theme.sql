-- Nullable means uninitialized; the application displays Light until an explicit choice.
-- This migration preserves existing profile policies and column-level grants.
begin;
alter table public.profiles add column if not exists student_theme text default null;
do $$ begin
 if not exists (
  select 1 from pg_catalog.pg_constraint
  where conname = 'profiles_student_theme_check' and conrelid = 'public.profiles'::regclass
 ) then
  alter table public.profiles add constraint profiles_student_theme_check
   check (student_theme is null or student_theme in ('light', 'midnight'));
 end if;
end $$;

-- No caller-supplied identity: only the authenticated student's own profile is read.
create or replace function public.get_student_theme()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); chosen text;
begin
 if actor is null then
  raise exception 'Student sign-in is required.' using errcode = '42501';
 end if;
 select p.student_theme into chosen from public.profiles p
 where p.id = actor and p.role = 'student';
 if not found then
  raise exception 'Student permission is required.' using errcode = '42501';
 end if;
 return pg_catalog.jsonb_build_object('theme', chosen);
end $$;

-- Narrow RPC avoids granting direct UPDATE of any additional profile column.
create or replace function public.save_student_theme(p_theme text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); chosen text;
begin
 if actor is null then
  raise exception 'Student sign-in is required.' using errcode = '42501';
 end if;
 if p_theme is null or p_theme not in ('light', 'midnight') then
  raise exception 'Choose Light or Midnight Study.' using errcode = '22023';
 end if;
 -- Ownership and role are checked on the row actually being updated.
 update public.profiles p set student_theme = p_theme
 where p.id = actor and p.role = 'student'
 returning p.student_theme into chosen;
 if not found then
  raise exception 'Student permission is required.' using errcode = '42501';
 end if;
 return pg_catalog.jsonb_build_object('theme', chosen);
end $$;

revoke all on function public.get_student_theme() from public, anon;
revoke all on function public.save_student_theme(text) from public, anon;
grant execute on function public.get_student_theme() to authenticated;
grant execute on function public.save_student_theme(text) to authenticated;
commit;

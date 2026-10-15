-- Tutor Analytics additions for the existing Supabase schema.
-- Safe to run more than once in the Supabase SQL editor.
alter table public.profiles add column if not exists year_level text;
alter table public.profiles add column if not exists avatar_key text not null default 'book';
alter table public.practice_attempts add column if not exists response_text text;

do $$ begin
 if not exists(select 1 from pg_constraint where conname='profiles_year_level_check' and conrelid='public.profiles'::regclass) then
  alter table public.profiles add constraint profiles_year_level_check check(year_level is null or year_level in ('Year 7','Year 8','Year 9','Year 10','Year 11','Year 12'));
 end if;
 if not exists(select 1 from pg_constraint where conname='profiles_avatar_key_check' and conrelid='public.profiles'::regclass) then
  alter table public.profiles add constraint profiles_avatar_key_check check(avatar_key in ('book','owl','cat','fish','leaf','rocket','star','person'));
 end if;
end $$;

-- New accounts retain the existing auth.users -> profiles identity flow.
create or replace function public.create_profile() returns trigger
language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id,email,full_name,year_level,avatar_key)
 values(
  new.id,
  new.email,
  coalesce(new.raw_user_meta_data->>'full_name',''),
  case when new.raw_user_meta_data->>'year_level' in ('Year 7','Year 8','Year 9','Year 10','Year 11','Year 12') then new.raw_user_meta_data->>'year_level' else null end,
  case when new.raw_user_meta_data->>'avatar_key' in ('book','owl','cat','fish','leaf','rocket','star','person') then new.raw_user_meta_data->>'avatar_key' else 'book' end
 );
 return new;
end $$;

-- Keep the existing self-profile policy if present; add it only on older installations.
-- Column grants below prevent students from changing role or other protected fields.
do $$ begin
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='profiles_update_own') then
  create policy profiles_update_own on public.profiles for update to authenticated
   using(id=auth.uid() and role='student')
   with check(id=auth.uid() and role='student');
 end if;
end $$;
revoke update on public.profiles from authenticated;
grant update(full_name,year_level,avatar_key) on public.profiles to authenticated;

-- Enrol a student only when exactly one course title matches their selected year.
-- Existing enrolments are never removed, so year changes do not erase access or progress.
create or replace function public.auto_enrol_student_for_year(p_student_id uuid,p_year_level text)
returns void language plpgsql security definer set search_path=public as $$
declare matching_courses integer; matching_course_id uuid;
begin
 if p_year_level not in ('Year 7','Year 8','Year 9','Year 10','Year 11','Year 12') then return; end if;
 select count(*) into matching_courses
 from public.courses c
 where lower(btrim(c.title)) ~ ('^year[[:space:]]*'||substring(p_year_level from '[0-9]+')||'([[:space:]-]|$)');
 if matching_courses <> 1 then return; end if;
 select c.id into matching_course_id
 from public.courses c
 where lower(btrim(c.title)) ~ ('^year[[:space:]]*'||substring(p_year_level from '[0-9]+')||'([[:space:]-]|$)');
 insert into public.enrolments(student_id,course_id)
 select p.id,matching_course_id from public.profiles p
 where p.id=p_student_id and p.role='student' and p.year_level=p_year_level
 on conflict(student_id,course_id) do nothing;
end $$;

create or replace function public.auto_enrol_profile_year_trigger()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.role='student' then perform public.auto_enrol_student_for_year(new.id,new.year_level); end if;
 return new;
end $$;

create or replace function public.auto_enrol_course_year_trigger()
returns trigger language plpgsql security definer set search_path=public as $$
declare year_number text; year_value text; student_row record;
begin
 year_number := (regexp_match(btrim(new.title),'^Year[[:space:]]*(7|8|9|10|11|12)([[:space:]-]|$)','i'))[1];
 if year_number is null then return new; end if;
 year_value := 'Year '||year_number;
 for student_row in select p.id from public.profiles p where p.role='student' and p.year_level=year_value loop
  perform public.auto_enrol_student_for_year(student_row.id,year_value);
 end loop;
 return new;
end $$;

revoke execute on function public.auto_enrol_student_for_year(uuid,text) from public,anon,authenticated;
revoke execute on function public.auto_enrol_profile_year_trigger() from public,anon,authenticated;
revoke execute on function public.auto_enrol_course_year_trigger() from public,anon,authenticated;

-- Add triggers only if this migration has not already installed them.
do $$ begin
 if not exists(select 1 from pg_trigger where tgname='auto_enrol_profile_year_insert' and tgrelid='public.profiles'::regclass and not tgisinternal) then
  execute 'create trigger auto_enrol_profile_year_insert after insert on public.profiles for each row execute function public.auto_enrol_profile_year_trigger()';
 end if;
 if not exists(select 1 from pg_trigger where tgname='auto_enrol_profile_year_update' and tgrelid='public.profiles'::regclass and not tgisinternal) then
  execute 'create trigger auto_enrol_profile_year_update after update of year_level,role on public.profiles for each row execute function public.auto_enrol_profile_year_trigger()';
 end if;
 if not exists(select 1 from pg_trigger where tgname='auto_enrol_course_year_insert' and tgrelid='public.courses'::regclass and not tgisinternal) then
  execute 'create trigger auto_enrol_course_year_insert after insert on public.courses for each row execute function public.auto_enrol_course_year_trigger()';
 end if;
 if not exists(select 1 from pg_trigger where tgname='auto_enrol_course_year_update' and tgrelid='public.courses'::regclass and not tgisinternal) then
  execute 'create trigger auto_enrol_course_year_update after update of title on public.courses for each row execute function public.auto_enrol_course_year_trigger()';
 end if;
end $$;

-- Bring existing student profiles into sync without duplicating or removing enrolments.
do $$ declare student_row record; begin
 for student_row in select id,year_level from public.profiles where role='student' and year_level is not null loop
  perform public.auto_enrol_student_for_year(student_row.id,student_row.year_level);
 end loop;
end $$;

-- Existing attempt and progress RLS policies already restrict students to their own rows
-- and allow tutors to read performance. Analytics are calculated from those records.

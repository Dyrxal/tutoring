-- Run once in the Supabase SQL editor. Then run seed.sql from a tutor account.
create extension if not exists pgcrypto;
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, email text not null, full_name text not null default '', role text not null default 'student' check(role in ('student','tutor')), year_level text check(year_level is null or year_level in ('Year 7','Year 8','Year 9','Year 10','Year 11','Year 12')), avatar_key text not null default 'book' check(avatar_key in ('book','owl','cat','fish','leaf','rocket','star','person')), created_at timestamptz not null default now());
create table public.courses (id uuid primary key default gen_random_uuid(), title text not null, description text not null default '', created_at timestamptz not null default now());
create table public.modules (id uuid primary key default gen_random_uuid(), course_id uuid not null references public.courses(id) on delete cascade, title text not null, position integer not null default 0);
create table public.lessons (id uuid primary key default gen_random_uuid(), module_id uuid not null references public.modules(id) on delete cascade, title text not null, objective text not null default '', notes text not null default '', worked_example text not null default '', notes_image_path text, notes_image_alt text not null default '', example_image_path text, example_image_alt text not null default '', video_url text, resources jsonb not null default '[]'::jsonb, lesson_flow jsonb not null default '{}'::jsonb, position integer not null default 0);
create table public.questions (id uuid primary key default gen_random_uuid(), lesson_id uuid not null references public.lessons(id) on delete cascade, prompt text not null, options jsonb not null, correct_index integer not null check(correct_index between 0 and 3), explanation text not null default '', image_path text, image_alt text not null default '', position integer not null default 0);
create table public.enrolments (student_id uuid not null references public.profiles(id) on delete cascade, course_id uuid not null references public.courses(id) on delete cascade, enrolled_at timestamptz not null default now(), primary key(student_id,course_id));
create table public.lesson_progress (student_id uuid not null references public.profiles(id) on delete cascade, lesson_id uuid not null references public.lessons(id) on delete cascade, completed_at timestamptz, last_accessed_at timestamptz not null default now(), primary key(student_id,lesson_id));
create table public.practice_attempts (id uuid primary key default gen_random_uuid(), student_id uuid not null references public.profiles(id) on delete cascade, question_id uuid not null references public.questions(id) on delete cascade, selected_index integer not null check(selected_index between 0 and 3), is_correct boolean not null, response_text text, attempted_at timestamptz not null default now());
create index on public.modules(course_id,position); create index on public.lessons(module_id,position); create index on public.questions(lesson_id,position); create index on public.lesson_progress(student_id,last_accessed_at desc); create index on public.practice_attempts(student_id,attempted_at desc);
create function public.is_tutor() returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from profiles where id=auth.uid() and role='tutor')$$;
create function public.enrolled_in(c uuid) returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from enrolments where student_id=auth.uid() and course_id=c)$$;
create function public.can_read_lesson(l uuid) returns boolean language sql stable security definer set search_path=public as $$select public.is_tutor() or exists(select 1 from lessons join modules on modules.id=lessons.module_id where lessons.id=l and public.enrolled_in(modules.course_id))$$;
create function public.create_profile() returns trigger language plpgsql security definer set search_path=public as $$begin insert into public.profiles(id,email,full_name,year_level,avatar_key) values(new.id,new.email,coalesce(new.raw_user_meta_data->>'full_name',''),case when new.raw_user_meta_data->>'year_level' in ('Year 7','Year 8','Year 9','Year 10','Year 11','Year 12') then new.raw_user_meta_data->>'year_level' else null end,case when new.raw_user_meta_data->>'avatar_key' in ('book','owl','cat','fish','leaf','rocket','star','person') then new.raw_user_meta_data->>'avatar_key' else 'book' end); return new; end$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.create_profile();
-- Keep each student enrolled in the single course whose title begins with their selected year.
-- The trigger adds enrolments only; it never removes existing enrolments or progress.
create function public.auto_enrol_student_for_year(p_student_id uuid,p_year_level text)
returns void language plpgsql security definer set search_path=public as $$
declare matching_courses integer; matching_course_id uuid;
begin
 if p_year_level not in ('Year 7','Year 8','Year 9','Year 10','Year 11','Year 12') then return; end if;
 select count(*) into matching_courses from public.courses c
 where lower(btrim(c.title)) ~ ('^year[[:space:]]*'||substring(p_year_level from '[0-9]+')||'([[:space:]-]|$)');
 if matching_courses <> 1 then return; end if;
 select c.id into matching_course_id from public.courses c
 where lower(btrim(c.title)) ~ ('^year[[:space:]]*'||substring(p_year_level from '[0-9]+')||'([[:space:]-]|$)');
 insert into public.enrolments(student_id,course_id)
 select p.id,matching_course_id from public.profiles p
 where p.id=p_student_id and p.role='student' and p.year_level=p_year_level
 on conflict(student_id,course_id) do nothing;
end $$;
create function public.auto_enrol_profile_year_trigger()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.role='student' then perform public.auto_enrol_student_for_year(new.id,new.year_level); end if;
 return new;
end $$;
create function public.auto_enrol_course_year_trigger()
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
create trigger auto_enrol_profile_year_insert after insert on public.profiles for each row execute function public.auto_enrol_profile_year_trigger();
create trigger auto_enrol_profile_year_update after update of year_level,role on public.profiles for each row execute function public.auto_enrol_profile_year_trigger();
create trigger auto_enrol_course_year_insert after insert on public.courses for each row execute function public.auto_enrol_course_year_trigger();
create trigger auto_enrol_course_year_update after update of title on public.courses for each row execute function public.auto_enrol_course_year_trigger();
-- Promote the owner manually in SQL editor: update public.profiles set role='tutor' where email='you@example.com';
alter table public.profiles enable row level security; alter table public.courses enable row level security; alter table public.modules enable row level security; alter table public.lessons enable row level security; alter table public.questions enable row level security; alter table public.enrolments enable row level security; alter table public.lesson_progress enable row level security; alter table public.practice_attempts enable row level security;
create policy profiles_read on public.profiles for select to authenticated using(id=auth.uid() or public.is_tutor());
create policy profiles_update_own on public.profiles for update to authenticated using(id=auth.uid() and role='student') with check(id=auth.uid() and role='student');
revoke update on public.profiles from authenticated; grant update(full_name,year_level,avatar_key) on public.profiles to authenticated;
create policy courses_read on public.courses for select to authenticated using(public.is_tutor() or public.enrolled_in(id));
create policy courses_write on public.courses for all to authenticated using(public.is_tutor()) with check(public.is_tutor());
create policy modules_read on public.modules for select to authenticated using(public.is_tutor() or public.enrolled_in(course_id));
create policy modules_write on public.modules for all to authenticated using(public.is_tutor()) with check(public.is_tutor());
create policy lessons_read on public.lessons for select to authenticated using(public.is_tutor() or exists(select 1 from public.modules m where m.id=module_id and public.enrolled_in(m.course_id)));
create policy lessons_write on public.lessons for all to authenticated using(public.is_tutor()) with check(public.is_tutor());
create policy questions_read on public.questions for select to authenticated using(public.can_read_lesson(lesson_id));
create policy questions_write on public.questions for all to authenticated using(public.is_tutor()) with check(public.is_tutor());
create policy enrolments_read on public.enrolments for select to authenticated using(student_id=auth.uid() or public.is_tutor());
create policy enrolments_write on public.enrolments for all to authenticated using(public.is_tutor()) with check(public.is_tutor());
create policy progress_read on public.lesson_progress for select to authenticated using(student_id=auth.uid() or public.is_tutor());
create policy progress_insert on public.lesson_progress for insert to authenticated with check(student_id=auth.uid() and public.can_read_lesson(lesson_id));
create policy progress_update on public.lesson_progress for update to authenticated using(student_id=auth.uid() and public.can_read_lesson(lesson_id)) with check(student_id=auth.uid() and public.can_read_lesson(lesson_id));
create policy attempts_read on public.practice_attempts for select to authenticated using(student_id=auth.uid() or public.is_tutor());
create policy attempts_insert on public.practice_attempts for insert to authenticated with check(student_id=auth.uid() and exists(select 1 from public.questions q where q.id=question_id and public.can_read_lesson(q.lesson_id)));

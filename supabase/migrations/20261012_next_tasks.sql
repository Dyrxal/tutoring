-- Run this entire file once in Supabase SQL Editor. Safe to rerun.
-- Automatic next tasks use existing progress and require no new records.
-- This stores only tutor-added subchapters. It never changes learning data.
begin;
create table if not exists public.student_lesson_tasks (
 id uuid primary key,
 student_id uuid not null references public.profiles(id) on delete cascade,
 lesson_id uuid not null references public.lessons(id),
 assigned_by uuid references public.profiles(id) on delete set null,
 assigned_at timestamptz not null default now(),
 sort_order integer not null default 0,
 removed_at timestamptz,
 removed_by uuid references public.profiles(id) on delete set null
);
create unique index if not exists student_lesson_tasks_one_active_idx
 on public.student_lesson_tasks(student_id,lesson_id) where removed_at is null;
create index if not exists student_lesson_tasks_student_date_idx
 on public.student_lesson_tasks(student_id,assigned_at,sort_order,id);
alter table public.student_lesson_tasks enable row level security;
do $$ begin
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='student_lesson_tasks' and policyname='student_lesson_tasks_read') then
  create policy student_lesson_tasks_read on public.student_lesson_tasks for select to authenticated
   using(public.is_tutor() or (student_id=auth.uid() and exists(
    select 1 from public.lessons l join public.modules m on m.id=l.module_id
    join public.enrolments e on e.course_id=m.course_id
    where l.id=student_lesson_tasks.lesson_id and e.student_id=auth.uid())));
 end if;
end $$;
revoke all on public.student_lesson_tasks from public,anon,authenticated;
grant select on public.student_lesson_tasks to authenticated;

create or replace function public.assign_student_lesson_tasks(p_tutor_id uuid,p_student_id uuid,p_items jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); item record; task public.student_lesson_tasks%rowtype; saved jsonb:='[]'::jsonb;
begin
 if actor is null or actor is distinct from p_tutor_id or not public.is_tutor() then
  raise exception 'Tutor permission is required.' using errcode='42501';
 end if;
 if p_items is null or jsonb_typeof(p_items)<>'array' then
  raise exception 'Select subchapters to assign.' using errcode='22023';
 end if;
 if jsonb_array_length(p_items)=0 then raise exception 'Select at least one subchapter.' using errcode='22023'; end if;
 -- Lock the existing student profile to serialise simultaneous assignment batches.
 perform 1 from public.profiles where id=p_student_id and role='student' for update;
 if not found then raise exception 'Student profile was not found.' using errcode='42501'; end if;
 if exists(select 1 from jsonb_to_recordset(p_items) as x(id uuid,lesson_id uuid,sort_order integer)
   where x.id is null or x.lesson_id is null or x.sort_order is null or x.sort_order<0)
  or (select count(distinct x.lesson_id) from jsonb_to_recordset(p_items) as x(lesson_id uuid))<>jsonb_array_length(p_items)
  or (select count(distinct x.id) from jsonb_to_recordset(p_items) as x(id uuid))<>jsonb_array_length(p_items) then
  raise exception 'Each selected lesson needs a unique submission ID and order.' using errcode='22023';
 end if;
 -- Validate the whole batch before inserting: existing enrolled practice lessons only.
 if exists(select 1 from jsonb_to_recordset(p_items) as x(lesson_id uuid) where not exists(
  select 1 from public.lessons l join public.modules m on m.id=l.module_id
  join public.enrolments e on e.course_id=m.course_id
  where l.id=x.lesson_id and e.student_id=p_student_id
   and exists(select 1 from public.questions q where q.lesson_id=l.id))) then
  raise exception 'Only practice subchapters in the student''s enrolled courses can be assigned.' using errcode='42501';
 end if;
 for item in select * from jsonb_to_recordset(p_items) as x(id uuid,lesson_id uuid,sort_order integer) order by x.sort_order,x.id loop
  select * into task from public.student_lesson_tasks where id=item.id;
  if found then
   if task.student_id is distinct from p_student_id or task.lesson_id is distinct from item.lesson_id or task.assigned_by is distinct from actor then
    raise exception 'This submission ID was already used.' using errcode='22023';
   end if;
   -- An uncertain-save retry returns its original row, even if later removed.
   saved:=saved||jsonb_build_array(to_jsonb(task));
   continue;
  end if;
  select * into task from public.student_lesson_tasks where student_id=p_student_id and lesson_id=item.lesson_id and removed_at is null;
  if not found then
   insert into public.student_lesson_tasks(id,student_id,lesson_id,assigned_by,sort_order)
   values(item.id,p_student_id,item.lesson_id,actor,item.sort_order) returning * into task;
  end if;
  saved:=saved||jsonb_build_array(to_jsonb(task));
 end loop;
 return saved;
end $$;

create or replace function public.remove_student_lesson_task(p_tutor_id uuid,p_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare task public.student_lesson_tasks%rowtype;
begin
 if auth.uid() is null or auth.uid() is distinct from p_tutor_id or not public.is_tutor() then
  raise exception 'Tutor permission is required.' using errcode='42501';
 end if;
 select * into task from public.student_lesson_tasks where id=p_id for update;
 if not found then raise exception 'Extra task was not found.' using errcode='22023'; end if;
 if task.removed_at is null then
  update public.student_lesson_tasks set removed_at=now(),removed_by=auth.uid() where id=p_id returning * into task;
 end if;
 return to_jsonb(task);
end $$;
revoke all on function public.assign_student_lesson_tasks(uuid,uuid,jsonb) from public,anon;
revoke all on function public.remove_student_lesson_task(uuid,uuid) from public,anon;
grant execute on function public.assign_student_lesson_tasks(uuid,uuid,jsonb) to authenticated;
grant execute on function public.remove_student_lesson_task(uuid,uuid) to authenticated;
notify pgrst,'reload schema';
commit;

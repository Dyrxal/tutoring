begin;

alter table public.student_lesson_tasks
 add column question_scope text not null default 'lesson'
   constraint student_lesson_tasks_question_scope_check check (question_scope in ('lesson','core','all')),
 add column due_date date;

create or replace function public.assign_student_lesson_tasks(p_tutor_id uuid,p_student_id uuid,p_items jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 actor uuid := auth.uid();
 item record;
 task public.student_lesson_tasks%rowtype;
 saved jsonb := '[]'::jsonb;
begin
 if actor is null or actor is distinct from p_tutor_id or not public.is_tutor() then
  raise exception 'Tutor permission is required.' using errcode='42501';
 end if;
 if p_items is null or jsonb_typeof(p_items)<>'array' then
  raise exception 'Select subchapters to assign.' using errcode='22023';
 end if;
 if jsonb_array_length(p_items)=0 then
  raise exception 'Select at least one subchapter.' using errcode='22023';
 end if;

 -- All assignment batches for the same student take this lock before checking for an existing task.
 perform 1 from public.profiles where id=p_student_id and role='student' for update;
 if not found then
  raise exception 'Student profile was not found.' using errcode='42501';
 end if;
 if exists(select from jsonb_array_elements(p_items) as input(value) where jsonb_typeof(value)<>'object') then
  raise exception 'Each selected subchapter needs an assignment item.' using errcode='22023';
 end if;
 if exists(
  select from jsonb_array_elements(p_items) as input(value)
  where value ? 'question_scope' and (
   jsonb_typeof(value->'question_scope')<>'string' or value->>'question_scope' not in ('lesson','core','all')
  )
 ) then
  raise exception 'Choose lesson, core or all for each assignment.' using errcode='22023';
 end if;
 if exists(
  select from jsonb_array_elements(p_items) as input(value)
  where value->>'due_date' is not null and (
   jsonb_typeof(value->'due_date')<>'string' or
   value->>'due_date' !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' or
   not pg_input_is_valid(value->>'due_date','date')
  )
 ) then
  raise exception 'Enter a valid deadline as YYYY-MM-DD.' using errcode='22023';
 end if;
 if exists(select from jsonb_to_recordset(p_items) as x(id uuid,lesson_id uuid,sort_order integer)
   where x.id is null or x.lesson_id is null or x.sort_order is null or x.sort_order<0)
  or (select count(distinct x.lesson_id) from jsonb_to_recordset(p_items) as x(lesson_id uuid))<>jsonb_array_length(p_items)
  or (select count(distinct x.id) from jsonb_to_recordset(p_items) as x(id uuid))<>jsonb_array_length(p_items) then
  raise exception 'Each selected lesson needs a unique submission ID and order.' using errcode='22023';
 end if;
 if exists(select from jsonb_to_recordset(p_items) as x(lesson_id uuid) where not exists(
  select from public.lessons l join public.modules m on m.id=l.module_id
  join public.enrolments e on e.course_id=m.course_id
  where l.id=x.lesson_id and e.student_id=p_student_id
   and exists(select from public.questions q where q.lesson_id=l.id))) then
  raise exception 'Only practice subchapters in the student''s enrolled courses can be assigned.' using errcode='42501';
 end if;

 for item in
  select x.id,x.lesson_id,x.sort_order,coalesce(x.question_scope,'lesson') as question_scope,x.due_date
  from jsonb_to_recordset(p_items) as x(id uuid,lesson_id uuid,sort_order integer,question_scope text,due_date date)
  order by x.sort_order,x.id
 loop
  select * into task from public.student_lesson_tasks where id=item.id for update;
  if found then
   if task.student_id is distinct from p_student_id or task.lesson_id is distinct from item.lesson_id
    or task.assigned_by is distinct from actor or task.question_scope is distinct from item.question_scope
    or task.due_date is distinct from item.due_date then
    raise exception 'This submission ID was already used for a different assignment.' using errcode='22023';
   end if;
  else
   select * into task from public.student_lesson_tasks
    where student_id=p_student_id and lesson_id=item.lesson_id and removed_at is null for update;
   if found then
    if task.question_scope is distinct from item.question_scope or task.due_date is distinct from item.due_date then
     raise exception 'This lesson already has different requirements or a different deadline. Remove the active assignment before reassigning it.'
      using errcode='22023';
    end if;
   else
    insert into public.student_lesson_tasks(id,student_id,lesson_id,assigned_by,sort_order,question_scope,due_date)
    values(item.id,p_student_id,item.lesson_id,actor,item.sort_order,item.question_scope,item.due_date)
    returning * into task;
   end if;
  end if;
  saved := saved || jsonb_build_array(to_jsonb(task));
 end loop;
 return saved;
end $$;

notify pgrst,'reload schema';
commit;

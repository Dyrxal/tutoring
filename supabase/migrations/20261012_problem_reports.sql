-- Run this complete file in Supabase > SQL Editor > New query.
-- Additive and safe to rerun. Does not change content, attempts or progress.
begin;

create table if not exists public.problem_reports (
 id uuid primary key,
 student_id uuid references public.profiles(id) on delete set null,
 course_id uuid references public.courses(id) on delete set null,
 lesson_id uuid references public.lessons(id) on delete set null,
 question_id uuid references public.questions(id) on delete set null,
 category text not null check(category in ('incorrect_answer','unclear_wording','formatting','other')),
 description text not null check(char_length(btrim(description)) between 1 and 4000),
 status text not null default 'new' check(status in ('new','accepted','resolved','ignored')),
 context jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.problem_report_history (
 id uuid primary key,
 report_id uuid not null references public.problem_reports(id),
 actor_id uuid references public.profiles(id) on delete set null,
 actor_name text not null,
 from_status text check(from_status in ('new','accepted','resolved','ignored')),
 to_status text not null check(to_status in ('new','accepted','resolved','ignored')),
 internal_note text not null default '' check(char_length(internal_note)<=4000),
 created_at timestamptz not null default now()
);
create index if not exists problem_reports_student_date_idx on public.problem_reports(student_id,created_at desc);
create index if not exists problem_reports_status_date_idx on public.problem_reports(status,created_at desc);
create index if not exists problem_report_history_report_date_idx on public.problem_report_history(report_id,created_at,id);
alter table public.problem_reports enable row level security;
alter table public.problem_report_history enable row level security;

-- Match existing LMS scope: is_tutor() grants global content management.
-- No client write/delete policies: all writes use validated, atomic RPCs below.
do $$ begin
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='problem_reports' and policyname='problem_reports_read') then
  create policy problem_reports_read on public.problem_reports for select to authenticated
   using(student_id=auth.uid() or public.is_tutor());
 end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='problem_report_history' and policyname='problem_report_history_tutor_read') then
  create policy problem_report_history_tutor_read on public.problem_report_history for select to authenticated
   using(public.is_tutor());
 end if;
end $$;
revoke all on public.problem_reports, public.problem_report_history from public,anon,authenticated;
grant select on public.problem_reports, public.problem_report_history to authenticated;

-- Context, identity and dates are derived on the server, never trusted from form data.
create or replace function public.submit_problem_report(
 p_id uuid,p_lesson_id uuid,p_question_id uuid,p_category text,p_description text
) returns jsonb language plpgsql security definer set search_path='' as $$
declare
 actor uuid:=auth.uid(); existing public.problem_reports%rowtype;
 saved public.problem_reports%rowtype; ctx record; actor_label text;
begin
 if actor is null or not exists(select 1 from public.profiles where id=actor and role='student') then
  raise exception 'Only signed-in students can submit reports.' using errcode='42501';
 end if;
 if p_id is null or p_category is null or p_category not in ('incorrect_answer','unclear_wording','formatting','other')
  or p_description is null or char_length(btrim(p_description)) not between 1 and 4000 then
  raise exception 'Choose a category and enter a description of up to 4000 characters.' using errcode='22023';
 end if;
 select c.id as course_id,c.title as course_title,l.title as lesson_title,q.prompt as question_prompt
 into ctx from public.lessons l join public.modules m on m.id=l.module_id
 join public.courses c on c.id=m.course_id
 left join public.questions q on q.id=p_question_id and q.lesson_id=l.id
 where l.id=p_lesson_id and (p_question_id is null or q.id is not null)
 and exists(select 1 from public.enrolments e where e.student_id=actor and e.course_id=c.id);
 if not found then raise exception 'This content is not available to your account.' using errcode='42501'; end if;
 select coalesce(nullif(full_name,''),email) into actor_label from public.profiles where id=actor;
 insert into public.problem_reports(id,student_id,course_id,lesson_id,question_id,category,description,context)
 values(p_id,actor,ctx.course_id,p_lesson_id,p_question_id,p_category,btrim(p_description),
  jsonb_build_object('student_name',actor_label,'course_title',ctx.course_title,'lesson_title',ctx.lesson_title,'question_prompt',ctx.question_prompt))
 on conflict(id) do nothing returning * into saved;
 if found then
  insert into public.problem_report_history(id,report_id,actor_id,actor_name,from_status,to_status)
   values(p_id,p_id,actor,actor_label,null,'new');
  return to_jsonb(saved);
 end if;
 select * into existing from public.problem_reports where id=p_id;
 if existing.student_id is distinct from actor or existing.lesson_id is distinct from p_lesson_id
  or existing.question_id is distinct from p_question_id or existing.category is distinct from p_category
  or existing.description is distinct from btrim(p_description) then
  raise exception 'This submission ID was already used. Retry the original report.' using errcode='22023';
 end if;
 return to_jsonb(existing);
end $$;

-- A stable action ID makes an uncertain network retry idempotent. The row lock
-- and expected status prevent a second tutor from silently overwriting a decision.
create or replace function public.manage_problem_report(
 p_action_id uuid,p_report_id uuid,p_expected_status text,p_status text,p_internal_note text
) returns jsonb language plpgsql security definer set search_path='' as $$
declare
 actor uuid:=auth.uid(); ticket public.problem_reports%rowtype;
 event public.problem_report_history%rowtype; actor_label text;
begin
 if actor is null or not public.is_tutor() then
  raise exception 'Tutor permission is required.' using errcode='42501';
 end if;
 if p_action_id is null or p_status is null or p_status not in ('new','accepted','resolved','ignored')
  or p_expected_status is null or p_expected_status not in ('new','accepted','resolved','ignored')
  or char_length(coalesce(p_internal_note,''))>4000 then
  raise exception 'Invalid status or note.' using errcode='22023';
 end if;
 select * into ticket from public.problem_reports where id=p_report_id for update;
 if not found then raise exception 'Report not found.' using errcode='22023'; end if;
 select * into event from public.problem_report_history where id=p_action_id;
 if found then
  if event.report_id is distinct from p_report_id or event.actor_id is distinct from actor
   or event.from_status is distinct from p_expected_status or event.to_status is distinct from p_status
   or event.internal_note is distinct from btrim(coalesce(p_internal_note,'')) then
   raise exception 'This action ID was already used.' using errcode='22023';
  end if;
  return to_jsonb(ticket);
 end if;
 if ticket.status is distinct from p_expected_status then
  raise exception 'This report changed. Refresh it before choosing an action.' using errcode='40001';
 end if;
 if ticket.status=p_status then raise exception 'Choose a different status.' using errcode='22023'; end if;
 select coalesce(nullif(full_name,''),email) into actor_label from public.profiles where id=actor;
 insert into public.problem_report_history(id,report_id,actor_id,actor_name,from_status,to_status,internal_note)
 values(p_action_id,p_report_id,actor,actor_label,ticket.status,p_status,btrim(coalesce(p_internal_note,'')));
 update public.problem_reports set status=p_status,updated_at=now() where id=p_report_id returning * into ticket;
 return to_jsonb(ticket);
end $$;
revoke all on function public.submit_problem_report(uuid,uuid,uuid,text,text) from public,anon;
revoke all on function public.manage_problem_report(uuid,uuid,text,text,text) from public,anon;
grant execute on function public.submit_problem_report(uuid,uuid,uuid,text,text) to authenticated;
grant execute on function public.manage_problem_report(uuid,uuid,text,text,text) to authenticated;
notify pgrst,'reload schema';
commit;

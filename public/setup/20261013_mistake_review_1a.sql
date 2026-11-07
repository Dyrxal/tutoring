-- Run the ENTIRE file in Supabase SQL Editor. Additive and safe to rerun.
-- Pilot: the existing Year 9 1A lesson only. No learning content is replaced.
begin;
alter table public.profiles add column if not exists review_timezone text;
alter table public.practice_attempts add column if not exists attempt_context text not null default 'lesson';
alter table public.practice_attempts add column if not exists review_help_used boolean not null default false;
alter table public.practice_attempts add column if not exists review_local_date date;
alter table public.practice_attempts add column if not exists review_outcome jsonb;

create table if not exists public.mistake_review_settings (
 lesson_id uuid primary key references public.lessons(id),
 intervals integer[] not null default array[1,3,7,14,30,60],
 fallback_timezone text not null default 'Australia/Melbourne'
);
insert into public.mistake_review_settings(lesson_id)
 select id from public.lessons where id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid
 on conflict(lesson_id) do nothing;
create table if not exists public.mistake_review_schedules (
 student_id uuid not null references public.profiles(id) on delete cascade,
 question_id uuid not null references public.questions(id),
 timezone text not null,
 stage integer not null default 0 check(stage>=0),
 next_due date not null,
 last_scheduled_date date,
 help_used_on date,
 revision bigint not null default 1,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 primary key(student_id,question_id)
);
alter table public.mistake_review_schedules add column if not exists help_used_on date;
create index if not exists mistake_review_due_idx on public.mistake_review_schedules(student_id,next_due,question_id);
create index if not exists mistake_review_attempt_history_idx on public.practice_attempts(student_id,question_id,attempted_at desc,id desc);
alter table public.mistake_review_settings enable row level security;
alter table public.mistake_review_schedules enable row level security;
do $$ begin
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='mistake_review_settings' and policyname='mistake_review_settings_read') then
  create policy mistake_review_settings_read on public.mistake_review_settings for select to authenticated
   using(public.can_read_lesson(lesson_id));
 end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='mistake_review_schedules' and policyname='mistake_review_schedules_read') then
  create policy mistake_review_schedules_read on public.mistake_review_schedules for select to authenticated
   using((student_id=auth.uid() or public.is_tutor()) and exists(
    select 1 from public.questions q join public.lessons l on l.id=q.lesson_id
    join public.modules m on m.id=l.module_id join public.enrolments e on e.course_id=m.course_id
    where q.id=mistake_review_schedules.question_id and l.id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid
     and e.student_id=mistake_review_schedules.student_id));
 end if;
 -- Existing lesson inserts still work. Review metadata can be written only by
 -- the authorised SECURITY DEFINER review RPC, which bypasses this policy.
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='practice_attempts' and policyname='review_metadata_rpc_only') then
  create policy review_metadata_rpc_only on public.practice_attempts as restrictive for insert to authenticated
   with check(attempt_context='lesson' and not review_help_used and review_local_date is null and review_outcome is null);
 end if;
end $$;
revoke all on public.mistake_review_schedules,public.mistake_review_settings from public,anon,authenticated;
grant select on public.mistake_review_schedules,public.mistake_review_settings to authenticated;

-- Numeric equivalence and exact written-form matching mirror question-types.ts.
create or replace function public._mistake_review_normalise(p_value text)
returns text language sql immutable set search_path='' as $$
 select lower(btrim(regexp_replace(replace(replace(coalesce(p_value,''),'−','-'),'–','-'),'\s+',' ','g')))
$$;
create or replace function public._mistake_review_numeric(p_value text)
returns numeric language plpgsql immutable set search_path='' as $$
declare value text:=replace(public._mistake_review_normalise(p_value),',',''); parts text[];
begin
 parts:=regexp_match(value,'^([+-]?[0-9]+)\s*/\s*([+-]?[0-9]+)$');
 if parts is not null then
  if parts[2]::numeric=0 then return null; end if;
  return parts[1]::numeric/parts[2]::numeric;
 end if;
 if value ~ '^[+-]?([0-9]+(\.[0-9]*)?|\.[0-9]+)$' then return value::numeric; end if;
 return null;
exception when numeric_value_out_of_range or division_by_zero then return null;
end $$;
create or replace function public._mistake_review_grade(p_options jsonb,p_correct_index integer,p_selected integer,p_response text)
returns boolean language plpgsql immutable set search_path='' as $$
declare candidate text; actual numeric; expected numeric;
begin
 if jsonb_typeof(p_options)='array' then
  if p_selected is null or p_selected<0 or p_selected>=jsonb_array_length(p_options) then
   raise exception 'Choose a valid answer.' using errcode='22023';
  end if;
  return p_selected=p_correct_index;
 end if;
 if p_options->>'kind' is distinct from 'short_answer' or jsonb_typeof(p_options->'accepted') is distinct from 'array' then
  raise exception 'This question needs a valid answer key.' using errcode='22023';
 end if;
 if public._mistake_review_normalise(p_response)='' then raise exception 'Enter an answer.' using errcode='22023'; end if;
 if length(p_response)>2000 then raise exception 'The answer is too long.' using errcode='22023'; end if;
 for candidate in select jsonb_array_elements_text(p_options->'accepted') loop
  if public._mistake_review_normalise(p_response)=public._mistake_review_normalise(candidate) then return true; end if;
  if coalesce((p_options->>'exact')::boolean,false) then continue; end if;
  actual:=public._mistake_review_numeric(p_response);expected:=public._mistake_review_numeric(candidate);
  if actual is not null and expected is not null and abs(actual-expected)<=0.000000001*greatest(1,abs(expected)) then return true; end if;
 end loop;
 return false;
end $$;

create or replace function public._mistake_review_timezone(p_student_id uuid,p_candidate text default null)
returns text language plpgsql security definer set search_path='' as $$
declare chosen text; fallback text;
begin
 select review_timezone into chosen from public.profiles where id=p_student_id and role='student' for update;
 if not found then raise exception 'Student profile was not found.' using errcode='42501'; end if;
 if chosen is not null and exists(select 1 from pg_catalog.pg_timezone_names where name=chosen) then return chosen; end if;
 select fallback_timezone into fallback from public.mistake_review_settings where lesson_id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid;
 chosen:=case when exists(select 1 from pg_catalog.pg_timezone_names where name=p_candidate) then p_candidate else coalesce(fallback,'Australia/Melbourne') end;
 if not exists(select 1 from pg_catalog.pg_timezone_names where name=chosen) then chosen:='Australia/Melbourne'; end if;
 update public.profiles set review_timezone=chosen where id=p_student_id;
 return chosen;
end $$;

-- Grade only new pilot attempts on the server. Other lessons remain untouched.
create or replace function public.mistake_review_guard_attempt()
returns trigger language plpgsql security definer set search_path='' as $$
declare question public.questions%rowtype; graded boolean;
begin
 select * into question from public.questions where id=new.question_id and lesson_id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid for share;
 if not found then return new; end if;
 perform public._mistake_review_timezone(new.student_id);
 graded:=public._mistake_review_grade(question.options,question.correct_index,new.selected_index,new.response_text);
 if new.attempt_context='lesson' and new.is_correct is distinct from graded then
  raise exception 'The answer key has changed. Reload the lesson before answering.' using errcode='40001';
 end if;
 new.is_correct:=graded;
 if jsonb_typeof(question.options)<>'array' then new.selected_index:=case when new.is_correct then 0 else 1 end; end if;
 new.attempted_at:=now();
 return new;
end $$;
create or replace function public.mistake_review_enrol_attempt()
returns trigger language plpgsql security definer set search_path='' as $$
declare zone text; today date; first_gap integer;
begin
 if new.attempt_context<>'lesson' or new.is_correct or not exists(
  select 1 from public.questions q where q.id=new.question_id and q.lesson_id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid
 ) then return new; end if;
 zone:=public._mistake_review_timezone(new.student_id);today:=(now() at time zone zone)::date;
 select intervals[1] into first_gap from public.mistake_review_settings where lesson_id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid;
 insert into public.mistake_review_schedules(student_id,question_id,timezone,next_due)
 values(new.student_id,new.question_id,zone,today+coalesce(first_gap,1))
 on conflict(student_id,question_id) do update set stage=0,next_due=excluded.next_due,
  revision=public.mistake_review_schedules.revision+1,updated_at=now();
 return new;
end $$;
do $$ begin
 if not exists(select 1 from pg_trigger where tgrelid='public.practice_attempts'::regclass and tgname='mistake_review_guard_attempt_trigger') then
  create trigger mistake_review_guard_attempt_trigger before insert on public.practice_attempts for each row execute function public.mistake_review_guard_attempt();
 end if;
 if not exists(select 1 from pg_trigger where tgrelid='public.practice_attempts'::regclass and tgname='mistake_review_enrol_attempt_trigger') then
  create trigger mistake_review_enrol_attempt_trigger after insert on public.practice_attempts for each row execute function public.mistake_review_enrol_attempt();
 end if;
end $$;

create or replace function public.initialise_mistake_reviews(p_student_id uuid,p_timezone text default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare zone text; gaps integer[];
begin
 if auth.uid() is null or auth.uid() is distinct from p_student_id or not exists(select 1 from public.profiles where id=p_student_id and role='student') then
  raise exception 'Student permission is required.' using errcode='42501';
 end if;
 if not exists(select 1 from public.lessons l join public.modules m on m.id=l.module_id join public.enrolments e on e.course_id=m.course_id
  where l.id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid and e.student_id=p_student_id) then
  raise exception 'This review pilot requires enrolment in Year 9 1A.' using errcode='42501';
 end if;
 select intervals into gaps from public.mistake_review_settings where lesson_id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid;
 if gaps is null then raise exception 'The Year 9 1A review settings are missing.' using errcode='22023'; end if;
 zone:=public._mistake_review_timezone(p_student_id,p_timezone);
 -- Initialise latest LESSON mistakes only, without resetting any existing schedule.
 insert into public.mistake_review_schedules(student_id,question_id,timezone,next_due)
 select p_student_id,a.question_id,zone,(a.attempted_at at time zone zone)::date+gaps[1]
 from (
  select distinct on (pa.question_id) pa.question_id,pa.is_correct,pa.attempted_at
  from public.practice_attempts pa join public.questions q on q.id=pa.question_id
  where pa.student_id=p_student_id and pa.attempt_context='lesson' and q.lesson_id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid
  order by pa.question_id,pa.attempted_at desc,pa.id desc
 ) a where not a.is_correct
 on conflict(student_id,question_id) do nothing;
 return jsonb_build_object('timezone',zone,'today',(now() at time zone zone)::date,'intervals',gaps);
end $$;

-- Pure, independently testable calendar-day scheduling policy.
create or replace function public._mistake_review_transition(p_stage integer,p_due date,p_last_date date,p_help_date date,p_today date,p_correct boolean,p_help boolean,p_gaps integer[])
returns jsonb language plpgsql immutable set search_path='' as $$
declare kind text; stage integer:=p_stage; due date:=p_due; last_date date:=p_last_date; used_help boolean:=p_help or coalesce(p_help_date=p_today,false);
begin
 kind:=case when p_due<=p_today and p_last_date is distinct from p_today then 'scheduled_review'
  when p_last_date=p_today then 'review_retry' else 'early_practice' end;
 if kind='scheduled_review' then
  last_date:=p_today;
  if p_correct and not used_help then stage:=least(stage+1,cardinality(p_gaps)-1);due:=p_today+p_gaps[stage+1];
  else stage:=0;due:=p_today+p_gaps[1];end if;
 elsif not p_correct or used_help then stage:=0;due:=least(due,p_today+p_gaps[1]);end if;
 return jsonb_build_object('context',kind,'stage',stage,'next_due',due,'last_scheduled_date',last_date,'help_used',used_help);
end $$;

create or replace function public.note_mistake_review_help(p_student_id uuid,p_question_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare zone text; schedule public.mistake_review_schedules%rowtype;
begin
 if auth.uid() is null or auth.uid() is distinct from p_student_id then raise exception 'Student permission is required.' using errcode='42501'; end if;
 if not exists(select 1 from public.questions q join public.lessons l on l.id=q.lesson_id join public.modules m on m.id=l.module_id
  join public.enrolments e on e.course_id=m.course_id where q.id=p_question_id and l.id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid and e.student_id=p_student_id) then
  raise exception 'This question is not available in your review pilot.' using errcode='42501';
 end if;
 zone:=public._mistake_review_timezone(p_student_id);
 update public.mistake_review_schedules set help_used_on=(now() at time zone zone)::date
  where student_id=p_student_id and question_id=p_question_id returning * into schedule;
 if not found then raise exception 'This question has no review schedule.' using errcode='40001'; end if;
 return to_jsonb(schedule);
end $$;

create or replace function public.submit_mistake_review(p_id uuid,p_student_id uuid,p_question_id uuid,p_selected_index integer,p_response_text text,p_help_used boolean,p_revision bigint,p_question_state jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare question public.questions%rowtype; schedule public.mistake_review_schedules%rowtype; attempt public.practice_attempts%rowtype;
 today date; zone text; gaps integer[]; correct boolean; used_help boolean; kind text; chosen integer; outcome jsonb; transition jsonb;
begin
 if auth.uid() is null or auth.uid() is distinct from p_student_id or not exists(select 1 from public.profiles where id=p_student_id and role='student') then
  raise exception 'Student permission is required.' using errcode='42501';
 end if;
 if p_id is null or p_help_used is null then raise exception 'Submission details are required.' using errcode='22023'; end if;
 select q.* into question from public.questions q join public.lessons l on l.id=q.lesson_id
 join public.modules m on m.id=l.module_id join public.enrolments e on e.course_id=m.course_id
 where q.id=p_question_id and l.id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid and e.student_id=p_student_id for share of q;
 if not found then raise exception 'This question is not available in your review pilot.' using errcode='42501'; end if;
 -- All attempt/enrolment/schedule writers take the same student lock first.
 zone:=public._mistake_review_timezone(p_student_id);today:=(now() at time zone zone)::date;
 select * into schedule from public.mistake_review_schedules where student_id=p_student_id and question_id=p_question_id for update;
 if not found then raise exception 'This question has no review schedule. Refresh your review list.' using errcode='40001'; end if;
 select * into attempt from public.practice_attempts where id=p_id;
 if found then
  if attempt.student_id is distinct from p_student_id or attempt.question_id is distinct from p_question_id or attempt.attempt_context='lesson'
   or attempt.response_text is distinct from p_response_text or coalesce((attempt.review_outcome->>'reported_help_used')::boolean,attempt.review_help_used) is distinct from p_help_used
   or (jsonb_typeof(question.options)='array' and attempt.selected_index is distinct from p_selected_index) then
   raise exception 'This submission ID was already used.' using errcode='22023';
  end if;
  return jsonb_build_object('attempt',to_jsonb(attempt),'schedule',to_jsonb(schedule));
 end if;
 if p_revision is null or p_revision<>schedule.revision then raise exception 'This review changed in another tab. Refresh its schedule before trying again.' using errcode='40001'; end if;
 if p_question_state is distinct from jsonb_build_object('prompt',question.prompt,'options',question.options,'correct_index',question.correct_index,'explanation',question.explanation) then
  raise exception 'This question was edited. Refresh the question and schedule before answering.' using errcode='40001';
 end if;
 select intervals into gaps from public.mistake_review_settings where lesson_id=question.lesson_id;
 if gaps is null then raise exception 'Review settings are missing.' using errcode='22023'; end if;
 correct:=public._mistake_review_grade(question.options,question.correct_index,p_selected_index,p_response_text);
 chosen:=case when jsonb_typeof(question.options)='array' then p_selected_index when correct then 0 else 1 end;
 transition:=public._mistake_review_transition(schedule.stage,schedule.next_due,schedule.last_scheduled_date,schedule.help_used_on,today,correct,p_help_used,gaps);
 kind:=transition->>'context';used_help:=(transition->>'help_used')::boolean;
 schedule.stage:=(transition->>'stage')::integer;schedule.next_due:=(transition->>'next_due')::date;
 schedule.last_scheduled_date:=(transition->>'last_scheduled_date')::date;
 update public.mistake_review_schedules set stage=schedule.stage,next_due=schedule.next_due,last_scheduled_date=schedule.last_scheduled_date,
  help_used_on=case when used_help then today else help_used_on end,
  revision=revision+1,updated_at=now() where student_id=p_student_id and question_id=p_question_id returning * into schedule;
 outcome:=jsonb_build_object('stage',schedule.stage,'next_due',schedule.next_due,'revision',schedule.revision,'timezone',schedule.timezone,'reported_help_used',p_help_used);
 insert into public.practice_attempts(id,student_id,question_id,selected_index,is_correct,response_text,attempt_context,review_help_used,review_local_date,review_outcome)
 values(p_id,p_student_id,p_question_id,chosen,correct,p_response_text,kind,used_help,today,outcome) returning * into attempt;
 return jsonb_build_object('attempt',to_jsonb(attempt),'schedule',to_jsonb(schedule));
end $$;

-- Optional tutor configuration. Existing due dates are not rewritten.
create or replace function public.configure_mistake_review(p_tutor_id uuid,p_intervals integer[])
returns jsonb language plpgsql security definer set search_path='' as $$
declare settings public.mistake_review_settings%rowtype;
begin
 if auth.uid() is null or auth.uid() is distinct from p_tutor_id or not public.is_tutor() then raise exception 'Tutor permission is required.' using errcode='42501'; end if;
 if p_intervals is null or cardinality(p_intervals)<>6 or p_intervals[1]<>1 or exists(
  select 1 from generate_subscripts(p_intervals,1) i where p_intervals[i] is null or p_intervals[i]<1 or p_intervals[i]>365 or (i>1 and p_intervals[i]<=p_intervals[i-1])
 ) then raise exception 'Use six increasing day intervals, starting at 1 and ending at no more than 365.' using errcode='22023'; end if;
 update public.mistake_review_settings set intervals=p_intervals where lesson_id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid returning * into settings;
 if not found then raise exception 'The pilot settings are missing.' using errcode='22023'; end if;
 return to_jsonb(settings);
end $$;
revoke all on function public._mistake_review_normalise(text) from public,anon,authenticated;
revoke all on function public._mistake_review_numeric(text) from public,anon,authenticated;
revoke all on function public._mistake_review_grade(jsonb,integer,integer,text) from public,anon,authenticated;
revoke all on function public._mistake_review_timezone(uuid,text) from public,anon,authenticated;
revoke all on function public._mistake_review_transition(integer,date,date,date,date,boolean,boolean,integer[]) from public,anon,authenticated;
revoke all on function public.mistake_review_guard_attempt() from public,anon,authenticated;
revoke all on function public.mistake_review_enrol_attempt() from public,anon,authenticated;
revoke all on function public.initialise_mistake_reviews(uuid,text) from public,anon;
revoke all on function public.note_mistake_review_help(uuid,uuid) from public,anon;
revoke all on function public.submit_mistake_review(uuid,uuid,uuid,integer,text,boolean,bigint,jsonb) from public,anon;
revoke all on function public.configure_mistake_review(uuid,integer[]) from public,anon;
grant execute on function public.initialise_mistake_reviews(uuid,text) to authenticated;
grant execute on function public.note_mistake_review_help(uuid,uuid) to authenticated;
grant execute on function public.submit_mistake_review(uuid,uuid,uuid,integer,text,boolean,bigint,jsonb) to authenticated;
grant execute on function public.configure_mistake_review(uuid,integer[]) to authenticated;
notify pgrst,'reload schema';
commit;

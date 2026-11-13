-- PREPARED ONLY: requires explicit production-change approval and verified recovery readiness.
-- Retains owner, grants, data, signatures and all genuine serialization errors.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';
DO $mm_guard$
BEGIN
 IF replace(pg_get_functiondef('public.note_mistake_review_help(uuid, uuid)'::regprocedure), chr(13), '') IS DISTINCT FROM $mm_expected$CREATE OR REPLACE FUNCTION public.note_mistake_review_help(p_student_id uuid, p_question_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare zone text; schedule public.mistake_review_schedules%rowtype;
begin
 if auth.uid() is null or auth.uid() is distinct from p_student_id then raise exception 'Student permission is required.' using errcode='42501'; end if;
 if not exists(select 1 from public.questions q join public.lessons l on l.id=q.lesson_id join public.modules m on m.id=l.module_id
  join public.enrolments e on e.course_id=m.course_id where q.id=p_question_id and exists(select 1 from public.mistake_review_settings cfg where cfg.lesson_id=l.id) and e.student_id=p_student_id) then
  raise exception 'This question is not available in your enrolled review lessons.' using errcode='42501';
 end if;
 zone:=public._mistake_review_timezone(p_student_id);
 update public.mistake_review_schedules set help_used_on=(now() at time zone zone)::date
  where student_id=p_student_id and question_id=p_question_id returning * into schedule;
 if not found then raise exception 'This question has no review schedule.' using errcode='40001'; end if;
 return to_jsonb(schedule);
end $function$
$mm_expected$ THEN
  RAISE EXCEPTION 'Definition drift: note_mistake_review_help; abort and re-review';
 END IF;
 IF replace(pg_get_functiondef('public.submit_mistake_review(uuid, uuid, uuid, integer, text, boolean, bigint, jsonb)'::regprocedure), chr(13), '') IS DISTINCT FROM $mm_expected$CREATE OR REPLACE FUNCTION public.submit_mistake_review(p_id uuid, p_student_id uuid, p_question_id uuid, p_selected_index integer, p_response_text text, p_help_used boolean, p_revision bigint, p_question_state jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare question public.questions%rowtype; schedule public.mistake_review_schedules%rowtype; attempt public.practice_attempts%rowtype;
 today date; zone text; gaps integer[]; correct boolean; used_help boolean; kind text; chosen integer; outcome jsonb; transition jsonb;
begin
 if auth.uid() is null or auth.uid() is distinct from p_student_id or not exists(select 1 from public.profiles where id=p_student_id and role='student') then
  raise exception 'Student permission is required.' using errcode='42501';
 end if;
 if p_id is null or p_help_used is null then raise exception 'Submission details are required.' using errcode='22023'; end if;
 select q.* into question from public.questions q join public.lessons l on l.id=q.lesson_id
 join public.modules m on m.id=l.module_id join public.enrolments e on e.course_id=m.course_id
 where q.id=p_question_id and exists(select 1 from public.mistake_review_settings cfg where cfg.lesson_id=l.id) and e.student_id=p_student_id for share of q;
 if not found then raise exception 'This question is not available in your enrolled review lessons.' using errcode='42501'; end if;
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
end $function$
$mm_expected$ THEN
  RAISE EXCEPTION 'Definition drift: submit_mistake_review; abort and re-review';
 END IF;
END;
$mm_guard$;
CREATE OR REPLACE FUNCTION public.note_mistake_review_help(p_student_id uuid, p_question_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare zone text; schedule public.mistake_review_schedules%rowtype;
begin
 if auth.uid() is null or auth.uid() is distinct from p_student_id then raise exception 'Student permission is required.' using errcode='42501'; end if;
 if not exists(select 1 from public.questions q join public.lessons l on l.id=q.lesson_id join public.modules m on m.id=l.module_id
  join public.enrolments e on e.course_id=m.course_id where q.id=p_question_id and exists(select 1 from public.mistake_review_settings cfg where cfg.lesson_id=l.id) and e.student_id=p_student_id) then
  raise exception 'This question is not available in your enrolled review lessons.' using errcode='42501';
 end if;
 zone:=public._mistake_review_timezone(p_student_id);
 update public.mistake_review_schedules set help_used_on=(now() at time zone zone)::date
  where student_id=p_student_id and question_id=p_question_id returning * into schedule;
 if not found then raise exception 'This question has no review schedule.' using errcode='PT409'; end if;
 return to_jsonb(schedule);
end $function$
;
CREATE OR REPLACE FUNCTION public.submit_mistake_review(p_id uuid, p_student_id uuid, p_question_id uuid, p_selected_index integer, p_response_text text, p_help_used boolean, p_revision bigint, p_question_state jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare question public.questions%rowtype; schedule public.mistake_review_schedules%rowtype; attempt public.practice_attempts%rowtype;
 today date; zone text; gaps integer[]; correct boolean; used_help boolean; kind text; chosen integer; outcome jsonb; transition jsonb;
begin
 if auth.uid() is null or auth.uid() is distinct from p_student_id or not exists(select 1 from public.profiles where id=p_student_id and role='student') then
  raise exception 'Student permission is required.' using errcode='42501';
 end if;
 if p_id is null or p_help_used is null then raise exception 'Submission details are required.' using errcode='22023'; end if;
 select q.* into question from public.questions q join public.lessons l on l.id=q.lesson_id
 join public.modules m on m.id=l.module_id join public.enrolments e on e.course_id=m.course_id
 where q.id=p_question_id and exists(select 1 from public.mistake_review_settings cfg where cfg.lesson_id=l.id) and e.student_id=p_student_id for share of q;
 if not found then raise exception 'This question is not available in your enrolled review lessons.' using errcode='42501'; end if;
 -- All attempt/enrolment/schedule writers take the same student lock first.
 zone:=public._mistake_review_timezone(p_student_id);today:=(now() at time zone zone)::date;
 select * into schedule from public.mistake_review_schedules where student_id=p_student_id and question_id=p_question_id for update;
 if not found then raise exception 'This question has no review schedule. Refresh your review list.' using errcode='PT409'; end if;
 select * into attempt from public.practice_attempts where id=p_id;
 if found then
  if attempt.student_id is distinct from p_student_id or attempt.question_id is distinct from p_question_id or attempt.attempt_context='lesson'
   or attempt.response_text is distinct from p_response_text or coalesce((attempt.review_outcome->>'reported_help_used')::boolean,attempt.review_help_used) is distinct from p_help_used
   or (jsonb_typeof(question.options)='array' and attempt.selected_index is distinct from p_selected_index) then
   raise exception 'This submission ID was already used.' using errcode='22023';
  end if;
  return jsonb_build_object('attempt',to_jsonb(attempt),'schedule',to_jsonb(schedule));
 end if;
 if p_revision is null or p_revision<>schedule.revision then raise exception 'This review changed in another tab. Refresh its schedule before trying again.' using errcode='PT409'; end if;
 if p_question_state is distinct from jsonb_build_object('prompt',question.prompt,'options',question.options,'correct_index',question.correct_index,'explanation',question.explanation) then
  raise exception 'This question was edited. Refresh the question and schedule before answering.' using errcode='PT409';
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
end $function$
;
COMMIT;

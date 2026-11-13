-- PREVIEW ONLY. Target project lcddnpafrkbwsrhqexqe; never run on production.
-- Captured application schema; synthetic data is seeded separately.
DO $$ BEGIN IF EXISTS(SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname=ANY(ARRAY['courses','enrolments','lesson_progress','lessons','mistake_review_schedules','mistake_review_settings','modules','practice_attempts','problem_report_history','problem_reports','profiles','question_flag_courses','question_flags','questions','student_lesson_tasks'])) THEN RAISE EXCEPTION 'Preview bootstrap requires an empty application schema'; END IF; END $$;
CREATE TABLE public."courses" ("id" uuid DEFAULT gen_random_uuid() NOT NULL,"title" text NOT NULL,"description" text DEFAULT ''::text NOT NULL,"created_at" timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public."enrolments" ("student_id" uuid NOT NULL,"course_id" uuid NOT NULL,"enrolled_at" timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public."lesson_progress" ("student_id" uuid NOT NULL,"lesson_id" uuid NOT NULL,"completed_at" timestamp with time zone,"last_accessed_at" timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public."lessons" ("id" uuid DEFAULT gen_random_uuid() NOT NULL,"module_id" uuid NOT NULL,"title" text NOT NULL,"objective" text DEFAULT ''::text NOT NULL,"notes" text DEFAULT ''::text NOT NULL,"worked_example" text DEFAULT ''::text NOT NULL,"video_url" text,"resources" jsonb DEFAULT '[]'::jsonb NOT NULL,"position" integer DEFAULT 0 NOT NULL,"lesson_flow" jsonb DEFAULT '{}'::jsonb NOT NULL,"notes_image_path" text,"notes_image_alt" text DEFAULT ''::text NOT NULL,"example_image_path" text,"example_image_alt" text DEFAULT ''::text NOT NULL);
CREATE TABLE public."mistake_review_schedules" ("student_id" uuid NOT NULL,"question_id" uuid NOT NULL,"timezone" text NOT NULL,"stage" integer DEFAULT 0 NOT NULL,"next_due" date NOT NULL,"last_scheduled_date" date,"help_used_on" date,"revision" bigint DEFAULT 1 NOT NULL,"created_at" timestamp with time zone DEFAULT now() NOT NULL,"updated_at" timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public."mistake_review_settings" ("lesson_id" uuid NOT NULL,"intervals" integer[] DEFAULT ARRAY[1, 3, 7, 14, 30, 60] NOT NULL,"fallback_timezone" text DEFAULT 'Australia/Melbourne'::text NOT NULL);
CREATE TABLE public."modules" ("id" uuid DEFAULT gen_random_uuid() NOT NULL,"course_id" uuid NOT NULL,"title" text NOT NULL,"position" integer DEFAULT 0 NOT NULL);
CREATE TABLE public."practice_attempts" ("id" uuid DEFAULT gen_random_uuid() NOT NULL,"student_id" uuid NOT NULL,"question_id" uuid NOT NULL,"selected_index" integer NOT NULL,"is_correct" boolean NOT NULL,"attempted_at" timestamp with time zone DEFAULT now() NOT NULL,"response_text" text,"attempt_context" text DEFAULT 'lesson'::text NOT NULL,"review_help_used" boolean DEFAULT false NOT NULL,"review_local_date" date,"review_outcome" jsonb);
CREATE TABLE public."problem_report_history" ("id" uuid NOT NULL,"report_id" uuid NOT NULL,"actor_id" uuid,"actor_name" text NOT NULL,"from_status" text,"to_status" text NOT NULL,"internal_note" text DEFAULT ''::text NOT NULL,"created_at" timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public."problem_reports" ("id" uuid NOT NULL,"student_id" uuid,"course_id" uuid,"lesson_id" uuid,"question_id" uuid,"category" text NOT NULL,"description" text NOT NULL,"status" text DEFAULT 'new'::text NOT NULL,"context" jsonb DEFAULT '{}'::jsonb NOT NULL,"created_at" timestamp with time zone DEFAULT now() NOT NULL,"updated_at" timestamp with time zone DEFAULT now() NOT NULL);
CREATE TABLE public."profiles" ("id" uuid NOT NULL,"email" text NOT NULL,"full_name" text DEFAULT ''::text NOT NULL,"role" text DEFAULT 'student'::text NOT NULL,"created_at" timestamp with time zone DEFAULT now() NOT NULL,"year_level" text,"avatar_key" text DEFAULT 'book'::text NOT NULL,"review_timezone" text);
CREATE TABLE public."question_flag_courses" ("course_id" uuid NOT NULL);
CREATE TABLE public."question_flags" ("id" uuid NOT NULL,"student_id" uuid,"course_id" uuid,"lesson_id" uuid,"question_id" uuid,"status" text DEFAULT 'outstanding'::text NOT NULL,"context" jsonb DEFAULT '{}'::jsonb NOT NULL,"created_at" timestamp with time zone DEFAULT now() NOT NULL,"closed_at" timestamp with time zone,"reviewed_by" uuid,"reviewer_name" text);
CREATE TABLE public."questions" ("id" uuid DEFAULT gen_random_uuid() NOT NULL,"lesson_id" uuid NOT NULL,"prompt" text NOT NULL,"options" jsonb NOT NULL,"correct_index" integer NOT NULL,"explanation" text DEFAULT ''::text NOT NULL,"position" integer DEFAULT 0 NOT NULL,"image_path" text,"image_alt" text DEFAULT ''::text NOT NULL);
CREATE TABLE public."student_lesson_tasks" ("id" uuid NOT NULL,"student_id" uuid NOT NULL,"lesson_id" uuid NOT NULL,"assigned_by" uuid,"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,"sort_order" integer DEFAULT 0 NOT NULL,"removed_at" timestamp with time zone,"removed_by" uuid);
ALTER TABLE public."courses" ADD CONSTRAINT "courses_pkey" PRIMARY KEY (id);
ALTER TABLE public."enrolments" ADD CONSTRAINT "enrolments_pkey" PRIMARY KEY (student_id, course_id);
ALTER TABLE public."lesson_progress" ADD CONSTRAINT "lesson_progress_pkey" PRIMARY KEY (student_id, lesson_id);
ALTER TABLE public."lessons" ADD CONSTRAINT "lessons_pkey" PRIMARY KEY (id);
ALTER TABLE public."mistake_review_schedules" ADD CONSTRAINT "mistake_review_schedules_pkey" PRIMARY KEY (student_id, question_id);
ALTER TABLE public."mistake_review_schedules" ADD CONSTRAINT "mistake_review_schedules_stage_check" CHECK (stage >= 0);
ALTER TABLE public."mistake_review_settings" ADD CONSTRAINT "mistake_review_settings_pkey" PRIMARY KEY (lesson_id);
ALTER TABLE public."modules" ADD CONSTRAINT "modules_pkey" PRIMARY KEY (id);
ALTER TABLE public."practice_attempts" ADD CONSTRAINT "practice_attempts_pkey" PRIMARY KEY (id);
ALTER TABLE public."practice_attempts" ADD CONSTRAINT "practice_attempts_selected_index_check" CHECK (selected_index >= 0 AND selected_index <= 3);
ALTER TABLE public."problem_report_history" ADD CONSTRAINT "problem_report_history_from_status_check" CHECK (from_status = ANY (ARRAY['new'::text, 'accepted'::text, 'resolved'::text, 'ignored'::text]));
ALTER TABLE public."problem_report_history" ADD CONSTRAINT "problem_report_history_internal_note_check" CHECK (char_length(internal_note) <= 4000);
ALTER TABLE public."problem_report_history" ADD CONSTRAINT "problem_report_history_pkey" PRIMARY KEY (id);
ALTER TABLE public."problem_report_history" ADD CONSTRAINT "problem_report_history_to_status_check" CHECK (to_status = ANY (ARRAY['new'::text, 'accepted'::text, 'resolved'::text, 'ignored'::text]));
ALTER TABLE public."problem_reports" ADD CONSTRAINT "problem_reports_category_check" CHECK (category = ANY (ARRAY['incorrect_answer'::text, 'unclear_wording'::text, 'formatting'::text, 'other'::text]));
ALTER TABLE public."problem_reports" ADD CONSTRAINT "problem_reports_description_check" CHECK (char_length(btrim(description)) >= 1 AND char_length(btrim(description)) <= 4000);
ALTER TABLE public."problem_reports" ADD CONSTRAINT "problem_reports_pkey" PRIMARY KEY (id);
ALTER TABLE public."problem_reports" ADD CONSTRAINT "problem_reports_status_check" CHECK (status = ANY (ARRAY['new'::text, 'accepted'::text, 'resolved'::text, 'ignored'::text]));
ALTER TABLE public."profiles" ADD CONSTRAINT "profiles_avatar_key_check" CHECK (avatar_key = ANY (ARRAY['book'::text, 'owl'::text, 'cat'::text, 'fish'::text, 'leaf'::text, 'rocket'::text, 'star'::text, 'person'::text]));
ALTER TABLE public."profiles" ADD CONSTRAINT "profiles_pkey" PRIMARY KEY (id);
ALTER TABLE public."profiles" ADD CONSTRAINT "profiles_role_check" CHECK (role = ANY (ARRAY['student'::text, 'tutor'::text]));
ALTER TABLE public."profiles" ADD CONSTRAINT "profiles_year_level_check" CHECK (year_level IS NULL OR (year_level = ANY (ARRAY['Year 7'::text, 'Year 8'::text, 'Year 9'::text, 'Year 10'::text, 'Year 11'::text, 'Year 12'::text])));
ALTER TABLE public."question_flag_courses" ADD CONSTRAINT "question_flag_courses_pkey" PRIMARY KEY (course_id);
ALTER TABLE public."question_flags" ADD CONSTRAINT "question_flags_check" CHECK (status = 'outstanding'::text AND closed_at IS NULL OR status <> 'outstanding'::text AND closed_at IS NOT NULL);
ALTER TABLE public."question_flags" ADD CONSTRAINT "question_flags_pkey" PRIMARY KEY (id);
ALTER TABLE public."question_flags" ADD CONSTRAINT "question_flags_status_check" CHECK (status = ANY (ARRAY['outstanding'::text, 'reviewed'::text, 'withdrawn'::text]));
ALTER TABLE public."questions" ADD CONSTRAINT "questions_correct_index_check" CHECK (correct_index >= 0 AND correct_index <= 3);
ALTER TABLE public."questions" ADD CONSTRAINT "questions_pkey" PRIMARY KEY (id);
ALTER TABLE public."student_lesson_tasks" ADD CONSTRAINT "student_lesson_tasks_pkey" PRIMARY KEY (id);
ALTER TABLE public."enrolments" ADD CONSTRAINT "enrolments_course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE public."enrolments" ADD CONSTRAINT "enrolments_student_id_fkey" FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE public."lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE;
ALTER TABLE public."lesson_progress" ADD CONSTRAINT "lesson_progress_student_id_fkey" FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE public."lessons" ADD CONSTRAINT "lessons_module_id_fkey" FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE;
ALTER TABLE public."mistake_review_schedules" ADD CONSTRAINT "mistake_review_schedules_question_id_fkey" FOREIGN KEY (question_id) REFERENCES questions(id);
ALTER TABLE public."mistake_review_schedules" ADD CONSTRAINT "mistake_review_schedules_student_id_fkey" FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE public."mistake_review_settings" ADD CONSTRAINT "mistake_review_settings_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES lessons(id);
ALTER TABLE public."modules" ADD CONSTRAINT "modules_course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE public."practice_attempts" ADD CONSTRAINT "practice_attempts_question_id_fkey" FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;
ALTER TABLE public."practice_attempts" ADD CONSTRAINT "practice_attempts_student_id_fkey" FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE public."problem_report_history" ADD CONSTRAINT "problem_report_history_actor_id_fkey" FOREIGN KEY (actor_id) REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE public."problem_report_history" ADD CONSTRAINT "problem_report_history_report_id_fkey" FOREIGN KEY (report_id) REFERENCES problem_reports(id);
ALTER TABLE public."problem_reports" ADD CONSTRAINT "problem_reports_course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL;
ALTER TABLE public."problem_reports" ADD CONSTRAINT "problem_reports_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL;
ALTER TABLE public."problem_reports" ADD CONSTRAINT "problem_reports_question_id_fkey" FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE SET NULL;
ALTER TABLE public."problem_reports" ADD CONSTRAINT "problem_reports_student_id_fkey" FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE public."profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."question_flag_courses" ADD CONSTRAINT "question_flag_courses_course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE public."question_flags" ADD CONSTRAINT "question_flags_course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL;
ALTER TABLE public."question_flags" ADD CONSTRAINT "question_flags_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL;
ALTER TABLE public."question_flags" ADD CONSTRAINT "question_flags_question_id_fkey" FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE SET NULL;
ALTER TABLE public."question_flags" ADD CONSTRAINT "question_flags_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE public."question_flags" ADD CONSTRAINT "question_flags_student_id_fkey" FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE public."questions" ADD CONSTRAINT "questions_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE;
ALTER TABLE public."student_lesson_tasks" ADD CONSTRAINT "student_lesson_tasks_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE public."student_lesson_tasks" ADD CONSTRAINT "student_lesson_tasks_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES lessons(id);
ALTER TABLE public."student_lesson_tasks" ADD CONSTRAINT "student_lesson_tasks_removed_by_fkey" FOREIGN KEY (removed_by) REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE public."student_lesson_tasks" ADD CONSTRAINT "student_lesson_tasks_student_id_fkey" FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE;
CREATE INDEX enrolments_course_id_idx ON public.enrolments USING btree (course_id);
CREATE INDEX lesson_progress_lesson_id_idx ON public.lesson_progress USING btree (lesson_id);
CREATE INDEX lesson_progress_student_id_last_accessed_at_idx ON public.lesson_progress USING btree (student_id, last_accessed_at DESC);
CREATE INDEX lessons_module_id_position_idx ON public.lessons USING btree (module_id, "position");
CREATE INDEX mistake_review_due_idx ON public.mistake_review_schedules USING btree (student_id, next_due, question_id);
CREATE INDEX mistake_review_schedules_question_id_idx ON public.mistake_review_schedules USING btree (question_id);
CREATE INDEX modules_course_id_position_idx ON public.modules USING btree (course_id, "position");
CREATE INDEX mistake_review_attempt_history_idx ON public.practice_attempts USING btree (student_id, question_id, attempted_at DESC, id DESC);
CREATE INDEX practice_attempts_question_id_idx ON public.practice_attempts USING btree (question_id);
CREATE INDEX practice_attempts_student_id_attempted_at_idx ON public.practice_attempts USING btree (student_id, attempted_at DESC);
CREATE INDEX problem_report_history_actor_id_idx ON public.problem_report_history USING btree (actor_id);
CREATE INDEX problem_report_history_report_date_idx ON public.problem_report_history USING btree (report_id, created_at, id);
CREATE INDEX problem_reports_course_id_idx ON public.problem_reports USING btree (course_id);
CREATE INDEX problem_reports_lesson_id_idx ON public.problem_reports USING btree (lesson_id);
CREATE INDEX problem_reports_question_id_idx ON public.problem_reports USING btree (question_id);
CREATE INDEX problem_reports_status_date_idx ON public.problem_reports USING btree (status, created_at DESC);
CREATE INDEX problem_reports_student_date_idx ON public.problem_reports USING btree (student_id, created_at DESC);
CREATE INDEX question_flags_course_id_idx ON public.question_flags USING btree (course_id);
CREATE INDEX question_flags_lesson_id_idx ON public.question_flags USING btree (lesson_id);
CREATE UNIQUE INDEX question_flags_one_active_idx ON public.question_flags USING btree (student_id, question_id) WHERE (status = 'outstanding'::text);
CREATE INDEX question_flags_question_id_idx ON public.question_flags USING btree (question_id);
CREATE INDEX question_flags_reviewed_by_idx ON public.question_flags USING btree (reviewed_by);
CREATE INDEX question_flags_student_date_idx ON public.question_flags USING btree (student_id, created_at DESC);
CREATE INDEX questions_lesson_id_position_idx ON public.questions USING btree (lesson_id, "position");
CREATE INDEX student_lesson_tasks_assigned_by_idx ON public.student_lesson_tasks USING btree (assigned_by);
CREATE INDEX student_lesson_tasks_lesson_id_idx ON public.student_lesson_tasks USING btree (lesson_id);
CREATE UNIQUE INDEX student_lesson_tasks_one_active_idx ON public.student_lesson_tasks USING btree (student_id, lesson_id) WHERE (removed_at IS NULL);
CREATE INDEX student_lesson_tasks_removed_by_idx ON public.student_lesson_tasks USING btree (removed_by);
CREATE INDEX student_lesson_tasks_student_date_idx ON public.student_lesson_tasks USING btree (student_id, assigned_at, sort_order, id);
SET check_function_bodies=off;
CREATE OR REPLACE FUNCTION public._mistake_review_grade(p_options jsonb, p_correct_index integer, p_selected integer, p_response text)
 RETURNS boolean
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO ''
AS $function$
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
end $function$
;
CREATE OR REPLACE FUNCTION public._mistake_review_has_access(p_student_id uuid, p_question_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
 select exists(select 1 from public.questions q join public.mistake_review_settings cfg on cfg.lesson_id=q.lesson_id
  join public.lessons l on l.id=q.lesson_id join public.modules m on m.id=l.module_id
  join public.enrolments e on e.course_id=m.course_id join public.profiles p on p.id=e.student_id
  where q.id=p_question_id and e.student_id=p_student_id and p.role='student')
$function$
;
CREATE OR REPLACE FUNCTION public._mistake_review_normalise(p_value text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
 select lower(btrim(regexp_replace(replace(replace(coalesce(p_value,''),'−','-'),'–','-'),'\s+',' ','g')))
$function$
;
CREATE OR REPLACE FUNCTION public._mistake_review_numeric(p_value text)
 RETURNS numeric
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO ''
AS $function$
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
end $function$
;
CREATE OR REPLACE FUNCTION public._mistake_review_timezone(p_student_id uuid, p_candidate text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare chosen text; fallback text;
begin
 select review_timezone into chosen from public.profiles where id=p_student_id and role='student' for update;
 if not found then raise exception 'Student profile was not found.' using errcode='42501'; end if;
 if chosen is not null and exists(select 1 from pg_catalog.pg_timezone_names where name=chosen) then return chosen; end if;
 fallback:='Australia/Melbourne';
 chosen:=case when exists(select 1 from pg_catalog.pg_timezone_names where name=p_candidate) then p_candidate else coalesce(fallback,'Australia/Melbourne') end;
 if not exists(select 1 from pg_catalog.pg_timezone_names where name=chosen) then chosen:='Australia/Melbourne'; end if;
 update public.profiles set review_timezone=chosen where id=p_student_id;
 return chosen;
end $function$
;
CREATE OR REPLACE FUNCTION public._mistake_review_transition(p_stage integer, p_due date, p_last_date date, p_help_date date, p_today date, p_correct boolean, p_help boolean, p_gaps integer[])
 RETURNS jsonb
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO ''
AS $function$
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
end $function$
;
CREATE OR REPLACE FUNCTION public.assign_student_lesson_tasks(p_tutor_id uuid, p_student_id uuid, p_items jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 actor uuid:=auth.uid();
 item record;
 task public.student_lesson_tasks%rowtype;
 saved jsonb:='[]'::jsonb;
begin
 if actor is null
  or actor is distinct from p_tutor_id
  or not public.is_tutor()
 then
  raise exception 'Tutor permission is required.'
   using errcode='42501';
 end if;

 if p_items is null or jsonb_typeof(p_items)<>'array' then
  raise exception 'Select subchapters to assign.'
   using errcode='22023';
 end if;

 if jsonb_array_length(p_items)=0 then
  raise exception 'Select at least one subchapter.'
   using errcode='22023';
 end if;

 perform 1 from public.profiles
  where id=p_student_id and role='student'
  for update;

 if not found then
  raise exception 'Student profile was not found.'
   using errcode='42501';
 end if;

 if exists(
  select 1
  from jsonb_to_recordset(p_items)
   as x(id uuid,lesson_id uuid,sort_order integer)
  where x.id is null
   or x.lesson_id is null
   or x.sort_order is null
   or x.sort_order<0
 )
 or (
  select count(distinct x.lesson_id)
  from jsonb_to_recordset(p_items) as x(lesson_id uuid)
 )<>jsonb_array_length(p_items)
 or (
  select count(distinct x.id)
  from jsonb_to_recordset(p_items) as x(id uuid)
 )<>jsonb_array_length(p_items)
 then
  raise exception
   'Each selected lesson needs a unique submission ID and order.'
   using errcode='22023';
 end if;

 if exists(
  select 1
  from jsonb_to_recordset(p_items) as x(lesson_id uuid)
  where not exists(
   select 1
   from public.lessons l
   join public.modules m on m.id=l.module_id
   join public.enrolments e on e.course_id=m.course_id
   where l.id=x.lesson_id
    and e.student_id=p_student_id
    and exists(
     select 1 from public.questions q where q.lesson_id=l.id
    )
  )
 ) then
  raise exception
   'Only practice subchapters in the student''s enrolled courses can be assigned.'
   using errcode='42501';
 end if;

 for item in
  select *
  from jsonb_to_recordset(p_items)
   as x(id uuid,lesson_id uuid,sort_order integer)
  order by x.sort_order,x.id
 loop
  select * into task
  from public.student_lesson_tasks
  where id=item.id;

  if found then
   if task.student_id is distinct from p_student_id
    or task.lesson_id is distinct from item.lesson_id
    or task.assigned_by is distinct from actor
   then
    raise exception 'This submission ID was already used.'
     using errcode='22023';
   end if;

   saved:=saved||jsonb_build_array(to_jsonb(task));
   continue;
  end if;

  select * into task
  from public.student_lesson_tasks
  where student_id=p_student_id
   and lesson_id=item.lesson_id
   and removed_at is null;

  if not found then
   insert into public.student_lesson_tasks(
    id,student_id,lesson_id,assigned_by,sort_order
   )
   values(
    item.id,p_student_id,item.lesson_id,actor,item.sort_order
   )
   returning * into task;
  end if;

  saved:=saved||jsonb_build_array(to_jsonb(task));
 end loop;

 return saved;
end $function$
;
CREATE OR REPLACE FUNCTION public.can_read_lesson(l uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$select public.is_tutor() or exists(select 1 from lessons join modules on modules.id=lessons.module_id where lessons.id=l and public.enrolled_in(modules.course_id))$function$
;
CREATE OR REPLACE FUNCTION public.configure_mistake_review(p_tutor_id uuid, p_intervals integer[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare settings public.mistake_review_settings%rowtype;
begin
 if auth.uid() is null or auth.uid() is distinct from p_tutor_id or not public.is_tutor() then raise exception 'Tutor permission is required.' using errcode='42501'; end if;
 if p_intervals is null or cardinality(p_intervals)<>6 or p_intervals[1]<>1 or exists(
  select 1 from generate_subscripts(p_intervals,1) i where p_intervals[i] is null or p_intervals[i]<1 or p_intervals[i]>365 or (i>1 and p_intervals[i]<=p_intervals[i-1])
 ) then raise exception 'Use six increasing day intervals, starting at 1 and ending at no more than 365.' using errcode='22023'; end if;
 update public.mistake_review_settings set intervals=p_intervals where lesson_id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid returning * into settings;
 if not found then raise exception 'The pilot settings are missing.' using errcode='22023'; end if;
 return to_jsonb(settings);
end $function$
;
CREATE OR REPLACE FUNCTION public.configure_mistake_review(p_tutor_id uuid, p_intervals integer[], p_lesson_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare settings public.mistake_review_settings%rowtype;
begin
 if auth.uid() is null or auth.uid() is distinct from p_tutor_id or not public.is_tutor() then raise exception 'Tutor permission is required.' using errcode='42501'; end if;
 if p_intervals is null or cardinality(p_intervals)<>6 or p_intervals[1]<>1 or exists(
  select 1 from generate_subscripts(p_intervals,1) i where p_intervals[i] is null or p_intervals[i]<1 or p_intervals[i]>365 or (i>1 and p_intervals[i]<=p_intervals[i-1])
 ) then raise exception 'Use six increasing day intervals, starting at 1 and ending at no more than 365.' using errcode='22023'; end if;
 update public.mistake_review_settings set intervals=p_intervals where lesson_id=p_lesson_id and public.can_read_lesson(p_lesson_id) returning * into settings;
 if not found then raise exception 'This lesson is not enabled for review.' using errcode='22023'; end if;
 return to_jsonb(settings);
end $function$
;
CREATE OR REPLACE FUNCTION public.create_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
end $function$
;
CREATE OR REPLACE FUNCTION public.enrolled_in(c uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$select exists(select 1 from enrolments where student_id=auth.uid() and course_id=c)$function$
;
CREATE OR REPLACE FUNCTION public.flag_question(p_id uuid, p_question_id uuid, p_student_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare actor uuid:=auth.uid(); ticket public.question_flags%rowtype; ctx record; student_name text;
begin
 if actor is null or actor is distinct from p_student_id or not exists(select 1 from public.profiles where id=actor and role='student') then
  raise exception 'Student permission is required.' using errcode='42501';
 end if;
 if p_id is null then raise exception 'Submission ID is required.' using errcode='22023'; end if;
 select q.prompt,q.position,l.id as lesson_id,l.title as lesson_title,c.id as course_id,c.title as course_title,m.title as chapter_title
 into ctx from public.questions q join public.lessons l on l.id=q.lesson_id
 join public.modules m on m.id=l.module_id join public.courses c on c.id=m.course_id
 join public.question_flag_courses scope on scope.course_id=c.id
 where q.id=p_question_id
 and exists(select 1 from public.enrolments e where e.student_id=actor and e.course_id=c.id);
 if not found then raise exception 'This question is not in an enrolled Year 9 or Year 10 course.' using errcode='42501'; end if;
 -- Serialise this student's flags: concurrent clicks cannot create two active rows.
 perform 1 from public.profiles where id=actor for update;
 select * into ticket from public.question_flags where id=p_id;
 if found then
  if ticket.student_id is distinct from actor or ticket.question_id is distinct from p_question_id then
   raise exception 'This submission ID was already used.' using errcode='22023';
  end if;
  return to_jsonb(ticket);
 end if;
 select * into ticket from public.question_flags where student_id=actor and question_id=p_question_id and status='outstanding';
 if found then return to_jsonb(ticket); end if;
 select coalesce(nullif(full_name,''),email) into student_name from public.profiles where id=actor;
 insert into public.question_flags(id,student_id,course_id,lesson_id,question_id,context)
 values(p_id,actor,ctx.course_id,ctx.lesson_id,p_question_id,
  jsonb_build_object('student_name',student_name,'course_title',ctx.course_title,'lesson_title',ctx.lesson_title,'chapter_title',ctx.chapter_title,'question_prompt',ctx.prompt,'question_number',ctx.position+1)) returning * into ticket;
 return to_jsonb(ticket);
end $function$
;
CREATE OR REPLACE FUNCTION public.flag_question_1a(p_id uuid, p_question_id uuid, p_student_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
 if not exists(select 1 from public.questions where id=p_question_id and lesson_id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid) then
  raise exception 'Use the shared Year 9/10 flag action for this lesson.' using errcode='42501';
 end if;
 return public.flag_question(p_id,p_question_id,p_student_id);
end $function$
;
CREATE OR REPLACE FUNCTION public.initialise_mistake_reviews(p_student_id uuid, p_timezone text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare zone text; gaps integer[];
begin
 if auth.uid() is null or auth.uid() is distinct from p_student_id or not exists(select 1 from public.profiles where id=p_student_id and role='student') then
  raise exception 'Student permission is required.' using errcode='42501';
 end if;
 zone:=public._mistake_review_timezone(p_student_id,p_timezone);
 insert into public.mistake_review_schedules(student_id,question_id,timezone,next_due)
 select p_student_id,a.question_id,zone,(a.attempted_at at time zone zone)::date+a.first_gap
 from (
  select distinct on (pa.question_id) pa.question_id,pa.is_correct,pa.attempted_at,cfg.intervals[1] as first_gap
  from public.practice_attempts pa join public.questions q on q.id=pa.question_id
  join public.mistake_review_settings cfg on cfg.lesson_id=q.lesson_id
  join public.lessons l on l.id=q.lesson_id join public.modules m on m.id=l.module_id
  join public.enrolments e on e.course_id=m.course_id and e.student_id=p_student_id
  where pa.student_id=p_student_id and pa.attempt_context='lesson'
  order by pa.question_id,pa.attempted_at desc,pa.id desc
 ) a where not a.is_correct
 on conflict(student_id,question_id) do nothing;
 gaps:=array[1,3,7,14,30,60];
 return jsonb_build_object('timezone',zone,'today',(now() at time zone zone)::date,'intervals',gaps,'scope','year9_year10');
end $function$
;
CREATE OR REPLACE FUNCTION public.is_tutor()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$select exists(select 1 from profiles where id=auth.uid() and role='tutor')$function$
;
CREATE OR REPLACE FUNCTION public.manage_problem_report(p_action_id uuid, p_report_id uuid, p_expected_status text, p_status text, p_internal_note text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 actor uuid:=auth.uid();
 ticket public.problem_reports%rowtype;
 event public.problem_report_history%rowtype;
 actor_label text;
begin
 if actor is null or not public.is_tutor() then
  raise exception 'Tutor permission is required.'
   using errcode='42501';
 end if;

 if p_action_id is null or p_status is null
  or p_status not in ('new','accepted','resolved','ignored')
  or p_expected_status is null
  or p_expected_status not in ('new','accepted','resolved','ignored')
  or char_length(coalesce(p_internal_note,''))>4000
 then
  raise exception 'Invalid status or note.' using errcode='22023';
 end if;

 select * into ticket from public.problem_reports
 where id=p_report_id for update;

 if not found then
  raise exception 'Report not found.' using errcode='22023';
 end if;

 select * into event from public.problem_report_history
 where id=p_action_id;

 if found then
  if event.report_id is distinct from p_report_id
   or event.actor_id is distinct from actor
   or event.from_status is distinct from p_expected_status
   or event.to_status is distinct from p_status
   or event.internal_note is distinct from btrim(coalesce(p_internal_note,''))
  then
   raise exception 'This action ID was already used.'
    using errcode='22023';
  end if;
  return to_jsonb(ticket);
 end if;

 if ticket.status is distinct from p_expected_status then
  raise exception 'This report changed. Refresh it before choosing an action.'
   using errcode='40001';
 end if;

 if ticket.status=p_status then
  raise exception 'Choose a different status.' using errcode='22023';
 end if;

 select coalesce(nullif(full_name,''),email)
 into actor_label from public.profiles where id=actor;

 insert into public.problem_report_history(
  id,report_id,actor_id,actor_name,
  from_status,to_status,internal_note
 )
 values(
  p_action_id,p_report_id,actor,actor_label,
  ticket.status,p_status,btrim(coalesce(p_internal_note,''))
 );

 update public.problem_reports
 set status=p_status,updated_at=now()
 where id=p_report_id returning * into ticket;

 return to_jsonb(ticket);
end $function$
;
CREATE OR REPLACE FUNCTION public.mistake_review_enrol_attempt()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare zone text; today date; first_gap integer;
begin
 if new.attempt_context<>'lesson' or new.is_correct or not exists(
  select 1 from public.questions q join public.mistake_review_settings cfg on cfg.lesson_id=q.lesson_id where q.id=new.question_id
 ) then return new; end if;
 zone:=public._mistake_review_timezone(new.student_id);today:=(now() at time zone zone)::date;
 select cfg.intervals[1] into first_gap from public.mistake_review_settings cfg join public.questions q on q.lesson_id=cfg.lesson_id where q.id=new.question_id;
 insert into public.mistake_review_schedules(student_id,question_id,timezone,next_due)
 values(new.student_id,new.question_id,zone,today+coalesce(first_gap,1))
 on conflict(student_id,question_id) do update set stage=0,next_due=excluded.next_due,
  revision=public.mistake_review_schedules.revision+1,updated_at=now();
 return new;
end $function$
;
CREATE OR REPLACE FUNCTION public.mistake_review_guard_attempt()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare question public.questions%rowtype; graded boolean;
begin
 select q.* into question from public.questions q join public.mistake_review_settings cfg on cfg.lesson_id=q.lesson_id where q.id=new.question_id for share of q;
 if not found then return new; end if;
 if auth.uid() is not null and (auth.uid() is distinct from new.student_id or not public._mistake_review_has_access(new.student_id,new.question_id)) then
  raise exception 'This question is not available to this student.' using errcode='42501';
 end if;
 perform public._mistake_review_timezone(new.student_id);
 graded:=public._mistake_review_grade(question.options,question.correct_index,new.selected_index,new.response_text);
 if new.attempt_context='lesson' and new.is_correct is distinct from graded then
  raise exception 'The answer key has changed. Reload the lesson before answering.' using errcode='40001';
 end if;
 new.is_correct:=graded;
 if jsonb_typeof(question.options)<>'array' then new.selected_index:=case when new.is_correct then 0 else 1 end; end if;
 new.attempted_at:=now();
 return new;
end $function$
;
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
 if not found then raise exception 'This question has no review schedule.' using errcode='40001'; end if;
 return to_jsonb(schedule);
end $function$
;
CREATE OR REPLACE FUNCTION public.remove_student_lesson_task(p_tutor_id uuid, p_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 task public.student_lesson_tasks%rowtype;
begin
 if auth.uid() is null
  or auth.uid() is distinct from p_tutor_id
  or not public.is_tutor()
 then
  raise exception 'Tutor permission is required.'
   using errcode='42501';
 end if;

 select * into task
 from public.student_lesson_tasks
 where id=p_id
 for update;

 if not found then
  raise exception 'Extra task was not found.'
   using errcode='22023';
 end if;

 if task.removed_at is null then
  update public.student_lesson_tasks
  set removed_at=now(),removed_by=auth.uid()
  where id=p_id
  returning * into task;
 end if;

 return to_jsonb(task);
end $function$
;
CREATE OR REPLACE FUNCTION public.review_question_flag(p_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare ticket public.question_flags%rowtype; actor_name text;
begin
 if auth.uid() is null or not public.is_tutor() then raise exception 'Tutor permission is required.' using errcode='42501'; end if;
 select * into ticket from public.question_flags where id=p_id for update;
 if not found then raise exception 'Flag was not found.' using errcode='22023'; end if;
 if ticket.status='reviewed' then return to_jsonb(ticket); end if;
 if ticket.status<>'outstanding' then raise exception 'The student removed this flag. Refresh the list.' using errcode='40001'; end if;
 select coalesce(nullif(full_name,''),email) into actor_name from public.profiles where id=auth.uid();
 update public.question_flags set status='reviewed',closed_at=now(),reviewed_by=auth.uid(),reviewer_name=actor_name where id=p_id returning * into ticket;
 return to_jsonb(ticket);
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
;
CREATE OR REPLACE FUNCTION public.submit_problem_report(p_id uuid, p_lesson_id uuid, p_question_id uuid, p_category text, p_description text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 actor uuid:=auth.uid();
 existing public.problem_reports%rowtype;
 saved public.problem_reports%rowtype;
 ctx record;
 actor_label text;
begin
 if actor is null or not exists(
  select 1 from public.profiles where id=actor and role='student'
 ) then
  raise exception 'Only signed-in students can submit reports.'
   using errcode='42501';
 end if;

 if p_id is null or p_category is null
  or p_category not in ('incorrect_answer','unclear_wording','formatting','other')
  or p_description is null
  or char_length(btrim(p_description)) not between 1 and 4000
 then
  raise exception 'Choose a category and enter a description of up to 4000 characters.'
   using errcode='22023';
 end if;

 select c.id as course_id,c.title as course_title,
  l.title as lesson_title,q.prompt as question_prompt
 into ctx
 from public.lessons l
 join public.modules m on m.id=l.module_id
 join public.courses c on c.id=m.course_id
 left join public.questions q
  on q.id=p_question_id and q.lesson_id=l.id
 where l.id=p_lesson_id
  and (p_question_id is null or q.id is not null)
  and exists(
   select 1 from public.enrolments e
   where e.student_id=actor and e.course_id=c.id
  );

 if not found then
  raise exception 'This content is not available to your account.'
   using errcode='42501';
 end if;

 select coalesce(nullif(full_name,''),email)
 into actor_label from public.profiles where id=actor;

 insert into public.problem_reports(
  id,student_id,course_id,lesson_id,question_id,
  category,description,context
 )
 values(
  p_id,actor,ctx.course_id,p_lesson_id,p_question_id,
  p_category,btrim(p_description),
  jsonb_build_object(
   'student_name',actor_label,
   'course_title',ctx.course_title,
   'lesson_title',ctx.lesson_title,
   'question_prompt',ctx.question_prompt
  )
 )
 on conflict(id) do nothing returning * into saved;

 if found then
  insert into public.problem_report_history(
   id,report_id,actor_id,actor_name,from_status,to_status
  ) values(p_id,p_id,actor,actor_label,null,'new');
  return to_jsonb(saved);
 end if;

 select * into existing from public.problem_reports where id=p_id;

 if existing.student_id is distinct from actor
  or existing.lesson_id is distinct from p_lesson_id
  or existing.question_id is distinct from p_question_id
  or existing.category is distinct from p_category
  or existing.description is distinct from btrim(p_description)
 then
  raise exception 'This submission ID was already used. Retry the original report.'
   using errcode='22023';
 end if;

 return to_jsonb(existing);
end $function$
;
CREATE OR REPLACE FUNCTION public.withdraw_question_flag(p_id uuid, p_student_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare ticket public.question_flags%rowtype;
begin
 if auth.uid() is null or auth.uid() is distinct from p_student_id then raise exception 'Sign in to remove your flag.' using errcode='42501'; end if;
 select * into ticket from public.question_flags where id=p_id and student_id=auth.uid() for update;
 if not found then raise exception 'Your flag was not found.' using errcode='42501'; end if;
 if ticket.status='outstanding' then
  update public.question_flags set status='withdrawn',closed_at=now() where id=p_id returning * into ticket;
 end if;
 return to_jsonb(ticket);
end $function$
;
SET check_function_bodies=on;
REVOKE ALL ON FUNCTION public."_mistake_review_grade"(p_options jsonb, p_correct_index integer, p_selected integer, p_response text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public."_mistake_review_has_access"(p_student_id uuid, p_question_id uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public."_mistake_review_normalise"(p_value text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public."_mistake_review_numeric"(p_value text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public."_mistake_review_timezone"(p_student_id uuid, p_candidate text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public."_mistake_review_transition"(p_stage integer, p_due date, p_last_date date, p_help_date date, p_today date, p_correct boolean, p_help boolean, p_gaps integer[]) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public."assign_student_lesson_tasks"(p_tutor_id uuid, p_student_id uuid, p_items jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."assign_student_lesson_tasks"(p_tutor_id uuid, p_student_id uuid, p_items jsonb) TO authenticated;
REVOKE ALL ON FUNCTION public."can_read_lesson"(l uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."can_read_lesson"(l uuid) TO anon;
GRANT EXECUTE ON FUNCTION public."can_read_lesson"(l uuid) TO authenticated;
REVOKE ALL ON FUNCTION public."configure_mistake_review"(p_tutor_id uuid, p_intervals integer[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."configure_mistake_review"(p_tutor_id uuid, p_intervals integer[]) TO authenticated;
REVOKE ALL ON FUNCTION public."configure_mistake_review"(p_tutor_id uuid, p_intervals integer[], p_lesson_id uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."configure_mistake_review"(p_tutor_id uuid, p_intervals integer[], p_lesson_id uuid) TO authenticated;
REVOKE ALL ON FUNCTION public."create_profile"() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."create_profile"() TO anon;
GRANT EXECUTE ON FUNCTION public."create_profile"() TO authenticated;
REVOKE ALL ON FUNCTION public."enrolled_in"(c uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."enrolled_in"(c uuid) TO anon;
GRANT EXECUTE ON FUNCTION public."enrolled_in"(c uuid) TO authenticated;
REVOKE ALL ON FUNCTION public."flag_question"(p_id uuid, p_question_id uuid, p_student_id uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."flag_question"(p_id uuid, p_question_id uuid, p_student_id uuid) TO authenticated;
REVOKE ALL ON FUNCTION public."flag_question_1a"(p_id uuid, p_question_id uuid, p_student_id uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."flag_question_1a"(p_id uuid, p_question_id uuid, p_student_id uuid) TO authenticated;
REVOKE ALL ON FUNCTION public."initialise_mistake_reviews"(p_student_id uuid, p_timezone text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."initialise_mistake_reviews"(p_student_id uuid, p_timezone text) TO authenticated;
REVOKE ALL ON FUNCTION public."is_tutor"() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."is_tutor"() TO anon;
GRANT EXECUTE ON FUNCTION public."is_tutor"() TO authenticated;
REVOKE ALL ON FUNCTION public."manage_problem_report"(p_action_id uuid, p_report_id uuid, p_expected_status text, p_status text, p_internal_note text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."manage_problem_report"(p_action_id uuid, p_report_id uuid, p_expected_status text, p_status text, p_internal_note text) TO authenticated;
REVOKE ALL ON FUNCTION public."mistake_review_enrol_attempt"() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public."mistake_review_guard_attempt"() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public."note_mistake_review_help"(p_student_id uuid, p_question_id uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."note_mistake_review_help"(p_student_id uuid, p_question_id uuid) TO authenticated;
REVOKE ALL ON FUNCTION public."remove_student_lesson_task"(p_tutor_id uuid, p_id uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."remove_student_lesson_task"(p_tutor_id uuid, p_id uuid) TO authenticated;
REVOKE ALL ON FUNCTION public."review_question_flag"(p_id uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."review_question_flag"(p_id uuid) TO authenticated;
REVOKE ALL ON FUNCTION public."submit_mistake_review"(p_id uuid, p_student_id uuid, p_question_id uuid, p_selected_index integer, p_response_text text, p_help_used boolean, p_revision bigint, p_question_state jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."submit_mistake_review"(p_id uuid, p_student_id uuid, p_question_id uuid, p_selected_index integer, p_response_text text, p_help_used boolean, p_revision bigint, p_question_state jsonb) TO authenticated;
REVOKE ALL ON FUNCTION public."submit_problem_report"(p_id uuid, p_lesson_id uuid, p_question_id uuid, p_category text, p_description text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."submit_problem_report"(p_id uuid, p_lesson_id uuid, p_question_id uuid, p_category text, p_description text) TO authenticated;
REVOKE ALL ON FUNCTION public."withdraw_question_flag"(p_id uuid, p_student_id uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public."withdraw_question_flag"(p_id uuid, p_student_id uuid) TO authenticated;
ALTER TABLE public."courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."enrolments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."lesson_progress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."lessons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."mistake_review_schedules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."mistake_review_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."modules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."practice_attempts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."problem_report_history" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."problem_reports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."question_flag_courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."question_flags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."questions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."student_lesson_tasks" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public."courses" FROM anon, authenticated, service_role;
REVOKE ALL ON public."enrolments" FROM anon, authenticated, service_role;
REVOKE ALL ON public."lesson_progress" FROM anon, authenticated, service_role;
REVOKE ALL ON public."lessons" FROM anon, authenticated, service_role;
REVOKE ALL ON public."mistake_review_schedules" FROM anon, authenticated, service_role;
REVOKE ALL ON public."mistake_review_settings" FROM anon, authenticated, service_role;
REVOKE ALL ON public."modules" FROM anon, authenticated, service_role;
REVOKE ALL ON public."practice_attempts" FROM anon, authenticated, service_role;
REVOKE ALL ON public."problem_report_history" FROM anon, authenticated, service_role;
REVOKE ALL ON public."problem_reports" FROM anon, authenticated, service_role;
REVOKE ALL ON public."profiles" FROM anon, authenticated, service_role;
REVOKE ALL ON public."question_flag_courses" FROM anon, authenticated, service_role;
REVOKE ALL ON public."question_flags" FROM anon, authenticated, service_role;
REVOKE ALL ON public."questions" FROM anon, authenticated, service_role;
REVOKE ALL ON public."student_lesson_tasks" FROM anon, authenticated, service_role;
GRANT DELETE ON public."courses" TO "anon";
GRANT INSERT ON public."courses" TO "anon";
GRANT REFERENCES ON public."courses" TO "anon";
GRANT SELECT ON public."courses" TO "anon";
GRANT TRIGGER ON public."courses" TO "anon";
GRANT TRUNCATE ON public."courses" TO "anon";
GRANT UPDATE ON public."courses" TO "anon";
GRANT DELETE ON public."courses" TO "authenticated";
GRANT INSERT ON public."courses" TO "authenticated";
GRANT REFERENCES ON public."courses" TO "authenticated";
GRANT SELECT ON public."courses" TO "authenticated";
GRANT TRIGGER ON public."courses" TO "authenticated";
GRANT TRUNCATE ON public."courses" TO "authenticated";
GRANT UPDATE ON public."courses" TO "authenticated";
GRANT DELETE ON public."courses" TO "service_role";
GRANT INSERT ON public."courses" TO "service_role";
GRANT REFERENCES ON public."courses" TO "service_role";
GRANT SELECT ON public."courses" TO "service_role";
GRANT TRIGGER ON public."courses" TO "service_role";
GRANT TRUNCATE ON public."courses" TO "service_role";
GRANT UPDATE ON public."courses" TO "service_role";
GRANT DELETE ON public."enrolments" TO "anon";
GRANT INSERT ON public."enrolments" TO "anon";
GRANT REFERENCES ON public."enrolments" TO "anon";
GRANT SELECT ON public."enrolments" TO "anon";
GRANT TRIGGER ON public."enrolments" TO "anon";
GRANT TRUNCATE ON public."enrolments" TO "anon";
GRANT UPDATE ON public."enrolments" TO "anon";
GRANT DELETE ON public."enrolments" TO "authenticated";
GRANT INSERT ON public."enrolments" TO "authenticated";
GRANT REFERENCES ON public."enrolments" TO "authenticated";
GRANT SELECT ON public."enrolments" TO "authenticated";
GRANT TRIGGER ON public."enrolments" TO "authenticated";
GRANT TRUNCATE ON public."enrolments" TO "authenticated";
GRANT UPDATE ON public."enrolments" TO "authenticated";
GRANT DELETE ON public."enrolments" TO "service_role";
GRANT INSERT ON public."enrolments" TO "service_role";
GRANT REFERENCES ON public."enrolments" TO "service_role";
GRANT SELECT ON public."enrolments" TO "service_role";
GRANT TRIGGER ON public."enrolments" TO "service_role";
GRANT TRUNCATE ON public."enrolments" TO "service_role";
GRANT UPDATE ON public."enrolments" TO "service_role";
GRANT DELETE ON public."lesson_progress" TO "anon";
GRANT INSERT ON public."lesson_progress" TO "anon";
GRANT REFERENCES ON public."lesson_progress" TO "anon";
GRANT SELECT ON public."lesson_progress" TO "anon";
GRANT TRIGGER ON public."lesson_progress" TO "anon";
GRANT TRUNCATE ON public."lesson_progress" TO "anon";
GRANT UPDATE ON public."lesson_progress" TO "anon";
GRANT DELETE ON public."lesson_progress" TO "authenticated";
GRANT INSERT ON public."lesson_progress" TO "authenticated";
GRANT REFERENCES ON public."lesson_progress" TO "authenticated";
GRANT SELECT ON public."lesson_progress" TO "authenticated";
GRANT TRIGGER ON public."lesson_progress" TO "authenticated";
GRANT TRUNCATE ON public."lesson_progress" TO "authenticated";
GRANT UPDATE ON public."lesson_progress" TO "authenticated";
GRANT DELETE ON public."lesson_progress" TO "service_role";
GRANT INSERT ON public."lesson_progress" TO "service_role";
GRANT REFERENCES ON public."lesson_progress" TO "service_role";
GRANT SELECT ON public."lesson_progress" TO "service_role";
GRANT TRIGGER ON public."lesson_progress" TO "service_role";
GRANT TRUNCATE ON public."lesson_progress" TO "service_role";
GRANT UPDATE ON public."lesson_progress" TO "service_role";
GRANT DELETE ON public."lessons" TO "anon";
GRANT INSERT ON public."lessons" TO "anon";
GRANT REFERENCES ON public."lessons" TO "anon";
GRANT SELECT ON public."lessons" TO "anon";
GRANT TRIGGER ON public."lessons" TO "anon";
GRANT TRUNCATE ON public."lessons" TO "anon";
GRANT UPDATE ON public."lessons" TO "anon";
GRANT DELETE ON public."lessons" TO "authenticated";
GRANT INSERT ON public."lessons" TO "authenticated";
GRANT REFERENCES ON public."lessons" TO "authenticated";
GRANT SELECT ON public."lessons" TO "authenticated";
GRANT TRIGGER ON public."lessons" TO "authenticated";
GRANT TRUNCATE ON public."lessons" TO "authenticated";
GRANT UPDATE ON public."lessons" TO "authenticated";
GRANT DELETE ON public."lessons" TO "service_role";
GRANT INSERT ON public."lessons" TO "service_role";
GRANT REFERENCES ON public."lessons" TO "service_role";
GRANT SELECT ON public."lessons" TO "service_role";
GRANT TRIGGER ON public."lessons" TO "service_role";
GRANT TRUNCATE ON public."lessons" TO "service_role";
GRANT UPDATE ON public."lessons" TO "service_role";
GRANT SELECT ON public."mistake_review_schedules" TO "authenticated";
GRANT DELETE ON public."mistake_review_schedules" TO "service_role";
GRANT INSERT ON public."mistake_review_schedules" TO "service_role";
GRANT REFERENCES ON public."mistake_review_schedules" TO "service_role";
GRANT SELECT ON public."mistake_review_schedules" TO "service_role";
GRANT TRIGGER ON public."mistake_review_schedules" TO "service_role";
GRANT TRUNCATE ON public."mistake_review_schedules" TO "service_role";
GRANT UPDATE ON public."mistake_review_schedules" TO "service_role";
GRANT SELECT ON public."mistake_review_settings" TO "authenticated";
GRANT DELETE ON public."mistake_review_settings" TO "service_role";
GRANT INSERT ON public."mistake_review_settings" TO "service_role";
GRANT REFERENCES ON public."mistake_review_settings" TO "service_role";
GRANT SELECT ON public."mistake_review_settings" TO "service_role";
GRANT TRIGGER ON public."mistake_review_settings" TO "service_role";
GRANT TRUNCATE ON public."mistake_review_settings" TO "service_role";
GRANT UPDATE ON public."mistake_review_settings" TO "service_role";
GRANT DELETE ON public."modules" TO "anon";
GRANT INSERT ON public."modules" TO "anon";
GRANT REFERENCES ON public."modules" TO "anon";
GRANT SELECT ON public."modules" TO "anon";
GRANT TRIGGER ON public."modules" TO "anon";
GRANT TRUNCATE ON public."modules" TO "anon";
GRANT UPDATE ON public."modules" TO "anon";
GRANT DELETE ON public."modules" TO "authenticated";
GRANT INSERT ON public."modules" TO "authenticated";
GRANT REFERENCES ON public."modules" TO "authenticated";
GRANT SELECT ON public."modules" TO "authenticated";
GRANT TRIGGER ON public."modules" TO "authenticated";
GRANT TRUNCATE ON public."modules" TO "authenticated";
GRANT UPDATE ON public."modules" TO "authenticated";
GRANT DELETE ON public."modules" TO "service_role";
GRANT INSERT ON public."modules" TO "service_role";
GRANT REFERENCES ON public."modules" TO "service_role";
GRANT SELECT ON public."modules" TO "service_role";
GRANT TRIGGER ON public."modules" TO "service_role";
GRANT TRUNCATE ON public."modules" TO "service_role";
GRANT UPDATE ON public."modules" TO "service_role";
GRANT DELETE ON public."practice_attempts" TO "anon";
GRANT INSERT ON public."practice_attempts" TO "anon";
GRANT REFERENCES ON public."practice_attempts" TO "anon";
GRANT SELECT ON public."practice_attempts" TO "anon";
GRANT TRIGGER ON public."practice_attempts" TO "anon";
GRANT TRUNCATE ON public."practice_attempts" TO "anon";
GRANT UPDATE ON public."practice_attempts" TO "anon";
GRANT DELETE ON public."practice_attempts" TO "authenticated";
GRANT INSERT ON public."practice_attempts" TO "authenticated";
GRANT REFERENCES ON public."practice_attempts" TO "authenticated";
GRANT SELECT ON public."practice_attempts" TO "authenticated";
GRANT TRIGGER ON public."practice_attempts" TO "authenticated";
GRANT TRUNCATE ON public."practice_attempts" TO "authenticated";
GRANT UPDATE ON public."practice_attempts" TO "authenticated";
GRANT DELETE ON public."practice_attempts" TO "service_role";
GRANT INSERT ON public."practice_attempts" TO "service_role";
GRANT REFERENCES ON public."practice_attempts" TO "service_role";
GRANT SELECT ON public."practice_attempts" TO "service_role";
GRANT TRIGGER ON public."practice_attempts" TO "service_role";
GRANT TRUNCATE ON public."practice_attempts" TO "service_role";
GRANT UPDATE ON public."practice_attempts" TO "service_role";
GRANT SELECT ON public."problem_report_history" TO "authenticated";
GRANT DELETE ON public."problem_report_history" TO "service_role";
GRANT INSERT ON public."problem_report_history" TO "service_role";
GRANT REFERENCES ON public."problem_report_history" TO "service_role";
GRANT SELECT ON public."problem_report_history" TO "service_role";
GRANT TRIGGER ON public."problem_report_history" TO "service_role";
GRANT TRUNCATE ON public."problem_report_history" TO "service_role";
GRANT UPDATE ON public."problem_report_history" TO "service_role";
GRANT SELECT ON public."problem_reports" TO "authenticated";
GRANT DELETE ON public."problem_reports" TO "service_role";
GRANT INSERT ON public."problem_reports" TO "service_role";
GRANT REFERENCES ON public."problem_reports" TO "service_role";
GRANT SELECT ON public."problem_reports" TO "service_role";
GRANT TRIGGER ON public."problem_reports" TO "service_role";
GRANT TRUNCATE ON public."problem_reports" TO "service_role";
GRANT UPDATE ON public."problem_reports" TO "service_role";
GRANT DELETE ON public."profiles" TO "anon";
GRANT INSERT ON public."profiles" TO "anon";
GRANT REFERENCES ON public."profiles" TO "anon";
GRANT SELECT ON public."profiles" TO "anon";
GRANT TRIGGER ON public."profiles" TO "anon";
GRANT TRUNCATE ON public."profiles" TO "anon";
GRANT UPDATE ON public."profiles" TO "anon";
GRANT DELETE ON public."profiles" TO "authenticated";
GRANT INSERT ON public."profiles" TO "authenticated";
GRANT REFERENCES ON public."profiles" TO "authenticated";
GRANT SELECT ON public."profiles" TO "authenticated";
GRANT TRIGGER ON public."profiles" TO "authenticated";
GRANT TRUNCATE ON public."profiles" TO "authenticated";
GRANT DELETE ON public."profiles" TO "service_role";
GRANT INSERT ON public."profiles" TO "service_role";
GRANT REFERENCES ON public."profiles" TO "service_role";
GRANT SELECT ON public."profiles" TO "service_role";
GRANT TRIGGER ON public."profiles" TO "service_role";
GRANT TRUNCATE ON public."profiles" TO "service_role";
GRANT UPDATE ON public."profiles" TO "service_role";
GRANT SELECT ON public."question_flag_courses" TO "authenticated";
GRANT DELETE ON public."question_flag_courses" TO "service_role";
GRANT INSERT ON public."question_flag_courses" TO "service_role";
GRANT REFERENCES ON public."question_flag_courses" TO "service_role";
GRANT SELECT ON public."question_flag_courses" TO "service_role";
GRANT TRIGGER ON public."question_flag_courses" TO "service_role";
GRANT TRUNCATE ON public."question_flag_courses" TO "service_role";
GRANT UPDATE ON public."question_flag_courses" TO "service_role";
GRANT SELECT ON public."question_flags" TO "authenticated";
GRANT DELETE ON public."question_flags" TO "service_role";
GRANT INSERT ON public."question_flags" TO "service_role";
GRANT REFERENCES ON public."question_flags" TO "service_role";
GRANT SELECT ON public."question_flags" TO "service_role";
GRANT TRIGGER ON public."question_flags" TO "service_role";
GRANT TRUNCATE ON public."question_flags" TO "service_role";
GRANT UPDATE ON public."question_flags" TO "service_role";
GRANT DELETE ON public."questions" TO "anon";
GRANT INSERT ON public."questions" TO "anon";
GRANT REFERENCES ON public."questions" TO "anon";
GRANT SELECT ON public."questions" TO "anon";
GRANT TRIGGER ON public."questions" TO "anon";
GRANT TRUNCATE ON public."questions" TO "anon";
GRANT UPDATE ON public."questions" TO "anon";
GRANT DELETE ON public."questions" TO "authenticated";
GRANT INSERT ON public."questions" TO "authenticated";
GRANT REFERENCES ON public."questions" TO "authenticated";
GRANT SELECT ON public."questions" TO "authenticated";
GRANT TRIGGER ON public."questions" TO "authenticated";
GRANT TRUNCATE ON public."questions" TO "authenticated";
GRANT UPDATE ON public."questions" TO "authenticated";
GRANT DELETE ON public."questions" TO "service_role";
GRANT INSERT ON public."questions" TO "service_role";
GRANT REFERENCES ON public."questions" TO "service_role";
GRANT SELECT ON public."questions" TO "service_role";
GRANT TRIGGER ON public."questions" TO "service_role";
GRANT TRUNCATE ON public."questions" TO "service_role";
GRANT UPDATE ON public."questions" TO "service_role";
GRANT SELECT ON public."student_lesson_tasks" TO "authenticated";
GRANT DELETE ON public."student_lesson_tasks" TO "service_role";
GRANT INSERT ON public."student_lesson_tasks" TO "service_role";
GRANT REFERENCES ON public."student_lesson_tasks" TO "service_role";
GRANT SELECT ON public."student_lesson_tasks" TO "service_role";
GRANT TRIGGER ON public."student_lesson_tasks" TO "service_role";
GRANT TRUNCATE ON public."student_lesson_tasks" TO "service_role";
GRANT UPDATE ON public."student_lesson_tasks" TO "service_role";
GRANT UPDATE ("avatar_key") ON public."profiles" TO "authenticated";
GRANT UPDATE ("full_name") ON public."profiles" TO "authenticated";
GRANT UPDATE ("year_level") ON public."profiles" TO "authenticated";
CREATE POLICY "courses_read" ON "public"."courses" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((is_tutor() OR enrolled_in(id)));
CREATE POLICY "courses_write" ON "public"."courses" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_tutor()) WITH CHECK (is_tutor());
CREATE POLICY "enrolments_read" ON "public"."enrolments" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((student_id = auth.uid()) OR is_tutor()));
CREATE POLICY "enrolments_write" ON "public"."enrolments" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_tutor()) WITH CHECK (is_tutor());
CREATE POLICY "progress_insert" ON "public"."lesson_progress" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((student_id = auth.uid()) AND can_read_lesson(lesson_id)));
CREATE POLICY "progress_read" ON "public"."lesson_progress" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((student_id = auth.uid()) OR is_tutor()));
CREATE POLICY "progress_update" ON "public"."lesson_progress" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((student_id = auth.uid()) AND can_read_lesson(lesson_id))) WITH CHECK (((student_id = auth.uid()) AND can_read_lesson(lesson_id)));
CREATE POLICY "lessons_read" ON "public"."lessons" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((is_tutor() OR (EXISTS ( SELECT 1
   FROM modules m
  WHERE ((m.id = lessons.module_id) AND enrolled_in(m.course_id))))));
CREATE POLICY "lessons_write" ON "public"."lessons" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_tutor()) WITH CHECK (is_tutor());
CREATE POLICY "mistake_review_schedules_read" ON "public"."mistake_review_schedules" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((((student_id = auth.uid()) OR is_tutor()) AND (EXISTS ( SELECT 1
   FROM ((((questions q
     JOIN lessons l ON ((l.id = q.lesson_id)))
     JOIN mistake_review_settings cfg ON ((cfg.lesson_id = l.id)))
     JOIN modules m ON ((m.id = l.module_id)))
     JOIN enrolments e ON ((e.course_id = m.course_id)))
  WHERE ((q.id = mistake_review_schedules.question_id) AND (e.student_id = mistake_review_schedules.student_id))))));
CREATE POLICY "mistake_review_settings_read" ON "public"."mistake_review_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING (can_read_lesson(lesson_id));
CREATE POLICY "modules_read" ON "public"."modules" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((is_tutor() OR enrolled_in(course_id)));
CREATE POLICY "modules_write" ON "public"."modules" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_tutor()) WITH CHECK (is_tutor());
CREATE POLICY "attempts_insert" ON "public"."practice_attempts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((student_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM questions q
  WHERE ((q.id = practice_attempts.question_id) AND can_read_lesson(q.lesson_id))))));
CREATE POLICY "attempts_read" ON "public"."practice_attempts" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((student_id = auth.uid()) OR is_tutor()));
CREATE POLICY "review_metadata_rpc_only" ON "public"."practice_attempts" AS RESTRICTIVE FOR INSERT TO "authenticated" WITH CHECK (((attempt_context = 'lesson'::text) AND (NOT review_help_used) AND (review_local_date IS NULL) AND (review_outcome IS NULL)));
CREATE POLICY "problem_report_history_tutor_read" ON "public"."problem_report_history" AS PERMISSIVE FOR SELECT TO "authenticated" USING (is_tutor());
CREATE POLICY "problem_reports_read" ON "public"."problem_reports" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((student_id = auth.uid()) OR is_tutor()));
CREATE POLICY "profiles_read" ON "public"."profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((id = auth.uid()) OR is_tutor()));
CREATE POLICY "profiles_update_own" ON "public"."profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((id = auth.uid()) AND (role = 'student'::text))) WITH CHECK (((id = auth.uid()) AND (role = 'student'::text)));
CREATE POLICY "question_flag_courses_read" ON "public"."question_flag_courses" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((is_tutor() OR (EXISTS ( SELECT 1
   FROM enrolments e
  WHERE ((e.course_id = question_flag_courses.course_id) AND (e.student_id = auth.uid()))))));
CREATE POLICY "question_flags_read" ON "public"."question_flags" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((student_id = auth.uid()) OR is_tutor()));
CREATE POLICY "questions_read" ON "public"."questions" AS PERMISSIVE FOR SELECT TO "authenticated" USING (can_read_lesson(lesson_id));
CREATE POLICY "questions_write" ON "public"."questions" AS PERMISSIVE FOR ALL TO "authenticated" USING (is_tutor()) WITH CHECK (is_tutor());
CREATE POLICY "student_lesson_tasks_read" ON "public"."student_lesson_tasks" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((is_tutor() OR ((student_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM ((lessons l
     JOIN modules m ON ((m.id = l.module_id)))
     JOIN enrolments e ON ((e.course_id = m.course_id)))
  WHERE ((l.id = student_lesson_tasks.lesson_id) AND (e.student_id = auth.uid())))))));
CREATE POLICY "lesson_images_delete" ON "storage"."objects" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((bucket_id = 'lesson-images'::text) AND is_tutor()));
CREATE POLICY "lesson_images_read" ON "storage"."objects" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((bucket_id = 'lesson-images'::text) AND (EXISTS ( SELECT 1
   FROM lessons l
  WHERE ((l.id = (split_part(objects.name, '/'::text, 1))::uuid) AND can_read_lesson(l.id))))));
CREATE POLICY "lesson_images_upload" ON "storage"."objects" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((bucket_id = 'lesson-images'::text) AND is_tutor() AND (EXISTS ( SELECT 1
   FROM lessons l
  WHERE (l.id = (split_part(objects.name, '/'::text, 1))::uuid)))));
CREATE POLICY "lesson_resource_delete" ON "storage"."objects" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((bucket_id = 'lesson-resources'::text) AND is_tutor()));
CREATE POLICY "lesson_resource_read" ON "storage"."objects" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((bucket_id = 'lesson-resources'::text) AND can_read_lesson((split_part(name, '/'::text, 1))::uuid)));
CREATE POLICY "lesson_resource_upload" ON "storage"."objects" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((bucket_id = 'lesson-resources'::text) AND is_tutor() AND can_read_lesson((split_part(name, '/'::text, 1))::uuid)));
CREATE POLICY "question_image_delete" ON "storage"."objects" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((bucket_id = 'question-images'::text) AND is_tutor()));
CREATE POLICY "question_image_read" ON "storage"."objects" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((bucket_id = 'question-images'::text) AND (EXISTS ( SELECT 1
   FROM questions q
  WHERE ((q.id = (split_part(objects.name, '/'::text, 1))::uuid) AND can_read_lesson(q.lesson_id))))));
CREATE POLICY "question_image_upload" ON "storage"."objects" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((bucket_id = 'question-images'::text) AND is_tutor() AND (EXISTS ( SELECT 1
   FROM questions q
  WHERE (q.id = (split_part(objects.name, '/'::text, 1))::uuid)))));
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_profile();
CREATE TRIGGER mistake_review_enrol_attempt_trigger AFTER INSERT ON practice_attempts FOR EACH ROW EXECUTE FUNCTION mistake_review_enrol_attempt();
CREATE TRIGGER mistake_review_guard_attempt_trigger BEFORE INSERT ON practice_attempts FOR EACH ROW EXECUTE FUNCTION mistake_review_guard_attempt();
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types) VALUES('lesson-images','lesson-images',false,8388608,ARRAY['image/png','image/jpeg','image/webp']);
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types) VALUES('lesson-resources','lesson-resources',false,20971520,ARRAY['application/pdf']);
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types) VALUES('question-images','question-images',false,8388608,ARRAY['image/png','image/jpeg','image/webp']);

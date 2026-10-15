-- Safe setup check: reads metadata and asks the API to refresh its schema cache.
-- Run the ENTIRE query in the SAME Supabase project used by your LMS.
notify pgrst,'reload schema';
with functions(label,signature,callable) as (values
 ('Initialise reviews','public.initialise_mistake_reviews(uuid,text)',true),
 ('Submit review','public.submit_mistake_review(uuid,uuid,uuid,integer,text,boolean,bigint,jsonb)',true),
 ('Record help use','public.note_mistake_review_help(uuid,uuid)',true),
 ('Configure intervals','public.configure_mistake_review(uuid,integer[])',true),
 ('Timezone helper','public._mistake_review_timezone(uuid,text)',false),
 ('Scheduling helper','public._mistake_review_transition(integer,date,date,date,date,boolean,boolean,integer[])',false),
 ('Answer grading helper','public._mistake_review_grade(jsonb,integer,integer,text)',false)
), tables(label,name) as (values
 ('Review schedules','public.mistake_review_schedules'),
 ('Review settings','public.mistake_review_settings')
), columns(table_name,column_name) as (values
 ('profiles','review_timezone'),
 ('practice_attempts','attempt_context'),
 ('practice_attempts','review_help_used'),
 ('practice_attempts','review_local_date'),
 ('practice_attempts','review_outcome'),
 ('mistake_review_schedules','help_used_on')
)
select label as check_name,
 case when to_regprocedure(signature) is null then 'MISSING'
  when callable and not has_function_privilege('authenticated',to_regprocedure(signature),'EXECUTE') then 'PERMISSION MISSING'
  when not callable and has_function_privilege('authenticated',to_regprocedure(signature),'EXECUTE') then 'PRIVATE HELPER EXPOSED'
  else 'OK' end as result,
 signature as detail from functions
union all
select label,case when to_regclass(name) is null then 'MISSING'
 when not has_table_privilege('authenticated',to_regclass(name),'SELECT') then 'PERMISSION MISSING' else 'OK' end,name from tables
union all
select table_name||'.'||column_name,
 case when exists(select 1 from information_schema.columns c where c.table_schema='public' and c.table_name=columns.table_name and c.column_name=columns.column_name) then 'OK' else 'MISSING' end,
 'Required review column' from columns
union all
select 'Pilot settings',case when to_regclass('public.mistake_review_settings') is not null then 'CHECK SETTINGS IN TUTOR VIEW' else 'MISSING' end,
 'The existing Year 9 1A lesson ID must be present in the settings table'
order by check_name;

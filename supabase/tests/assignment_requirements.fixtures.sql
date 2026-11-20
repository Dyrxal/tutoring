-- Build a legacy task history on the captured preview schema before installing the migration.
create schema fixture;
grant usage on schema fixture to anon,authenticated;
create function fixture.id(kind text,n integer) returns uuid language sql immutable
  as $$select md5('assignment-fixture-' || kind || '-' || n)::uuid$$;
create function fixture.item(task integer,lesson integer,options jsonb default '{}') returns jsonb language sql immutable as $$
  select jsonb_build_object('id',fixture.id('task',task),'lesson_id',fixture.id('lesson',lesson),'sort_order',task) || options
$$;
create function fixture.assign(item jsonb) returns jsonb language sql as $$
  select public.assign_student_lesson_tasks(fixture.id('person',1),fixture.id('person',2),jsonb_build_array(item))
$$;
insert into auth.users(id,email) select fixture.id('person',i),concat('assignment-',i,'@synthetic.invalid') from generate_series(1,3) i;
update public.profiles set role='tutor' where id=fixture.id('person',1);
insert into public.courses(id,title) select fixture.id('course',i),'Course '||i from generate_series(1,2) i;
insert into public.modules(id,course_id,title) select fixture.id('module',i),fixture.id('course',i),'Module '||i from generate_series(1,2) i;
insert into public.lessons(id,module_id,title) select fixture.id('lesson',i),fixture.id('module',case when i=11 then 2 else 1 end),'Lesson '||i from generate_series(1,11) i;
insert into public.questions(lesson_id,prompt,options,correct_index)
  select fixture.id('lesson',i),'Example','["A","B"]',0 from generate_series(1,11) i where i<>10;
insert into public.enrolments(student_id,course_id) select fixture.id('person',i),fixture.id('course',1) from generate_series(2,3) i;
set role authenticated;
select set_config('request.jwt.claim.sub',fixture.id('person',1)::text,false);
select fixture.assign(fixture.item(1,1));
select fixture.assign(fixture.item(2,2));
select public.remove_student_lesson_task(auth.uid(),fixture.id('task',2));
select public.assign_student_lesson_tasks(auth.uid(),fixture.id('person',3),jsonb_build_array(fixture.item(3,1)));
reset role;
create table fixture.legacy as select id,to_jsonb(t) as original from public.student_lesson_tasks t;

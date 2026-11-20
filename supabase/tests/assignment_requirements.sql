set plpgsql.check_asserts=on;
create function fixture.expect_invalid(items jsonb,fragment text) returns void language plpgsql as $$
begin
 perform public.assign_student_lesson_tasks(fixture.id('person',1),fixture.id('person',2),items);
 raise exception 'Expected invalid assignment: %',fragment;
exception when invalid_parameter_value then
 if position(fragment in sqlerrm)=0 then raise; end if;
end $$;
create function fixture.expect_denied(tutor uuid,student uuid,items jsonb) returns void language plpgsql as $$
begin
 perform public.assign_student_lesson_tasks(tutor,student,items);
 raise exception 'Expected a permission rejection';
exception when insufficient_privilege then null;
end $$;
do $$
begin
 assert (select count(*) from fixture.legacy)=3;
 assert (select count(*) from fixture.legacy l join public.student_lesson_tasks t using(id)
   where t.question_scope='lesson' and t.due_date is null and (to_jsonb(t)-'question_scope'-'due_date')=l.original)=3;
 begin
  update public.student_lesson_tasks set question_scope='invalid';
  raise exception 'Expected a database constraint';
 exception when check_violation then null;
 end;
end $$;
\echo PASS existing active and removed rows preserved with legacy defaults.

set role authenticated;
select set_config('request.jwt.claim.sub',fixture.id('person',1)::text,false);
do $$
declare result jsonb; core jsonb := fixture.item(4,2,'{"question_scope":"core","due_date":"2028-02-29"}'); item jsonb;
begin
 assert fixture.assign(fixture.item(1,1))->0->>'id'=fixture.id('task',1)::text;
 assert fixture.assign(fixture.item(20,1,'{"question_scope":"lesson","due_date":null}'))->0->>'id'=fixture.id('task',1)::text;
 assert fixture.assign(fixture.item(2,2))->0->>'removed_at' is not null;

 result := public.assign_student_lesson_tasks(auth.uid(),fixture.id('person',2),
   jsonb_build_array(fixture.item(5,3,'{"question_scope":"all"}'),core,fixture.item(6,4,'{"due_date":"2026-01-02"}')));
 assert result->0->>'id'=fixture.id('task',4)::text and result->0->>'question_scope'='core' and result->0->>'due_date'='2028-02-29';
 assert result->1->>'question_scope'='all' and result->1->'due_date'='null'::jsonb;
 assert result->2->>'question_scope'='lesson' and result->2->>'due_date'='2026-01-02';
 assert fixture.assign(core)->0=result->0;

 perform fixture.expect_invalid(jsonb_build_array(core || '{"due_date":"2028-03-01"}'),'submission ID');
 perform fixture.expect_invalid(jsonb_build_array(core || '{"question_scope":"all"}'),'submission ID');
 perform fixture.expect_invalid(jsonb_build_array(fixture.item(22,2)),'Remove the active assignment');
 perform fixture.expect_invalid(jsonb_build_array(fixture.item(22,2,'{"question_scope":"core","due_date":"2028-03-01"}')),'Remove the active assignment');

 for item in select value from jsonb_array_elements('[{"question_scope":null},{"question_scope":"bad"},{"question_scope":2},{"question_scope":{}}]') loop
  perform fixture.expect_invalid(jsonb_build_array(fixture.item(30,5),fixture.item(31,6,item)),'Choose lesson, core or all');
 end loop;
 for item in select value from jsonb_array_elements('[{"due_date":"2027-02-29"},{"due_date":"2028-13-01"},{"due_date":"10/12/2026"},{"due_date":"2026-01-01T00:00:00Z"},{"due_date":123},{"due_date":"today"},{"due_date":"infinity"},{"due_date":""}]') loop
  perform fixture.expect_invalid(jsonb_build_array(fixture.item(30,5),fixture.item(31,6,item)),'valid deadline');
 end loop;
 perform fixture.expect_invalid(jsonb_build_array(fixture.item(30,5),fixture.item(33,3,'{"question_scope":"core"}')),'Remove the active assignment');
 perform fixture.expect_invalid(jsonb_build_array(fixture.item(30,5),fixture.item(30,6)),'unique');
 perform fixture.expect_invalid(jsonb_build_array(fixture.item(30,5),fixture.item(31,5)),'unique');
 perform fixture.expect_denied(auth.uid(),fixture.id('person',2),jsonb_build_array(fixture.item(30,5),fixture.item(31,11)));
 perform fixture.expect_denied(auth.uid(),fixture.id('person',2),jsonb_build_array(fixture.item(30,5),fixture.item(31,10)));
 assert not exists(select from public.student_lesson_tasks where lesson_id in(fixture.id('lesson',5),fixture.id('lesson',6)));
 perform public.remove_student_lesson_task(auth.uid(),fixture.id('task',4));
 result := fixture.assign(fixture.item(23,2,'{"question_scope":"all"}'));
 assert result->0->>'id'=fixture.id('task',23)::text;
 assert fixture.assign(core)->0->>'removed_at' is not null;
 assert (select count(*) from public.student_lesson_tasks where lesson_id=fixture.id('lesson',2) and removed_at is null)=1;
end $$;
\echo PASS lesson, core, all, optional deadlines, whole-batch validation, retry and reassignment.

select set_config('request.jwt.claim.sub',fixture.id('person',2)::text,false);
do $$
begin
 assert (select count(*) from public.student_lesson_tasks where question_scope in ('core','all'))=3;
 assert not exists(select from public.student_lesson_tasks where student_id<>auth.uid());
 assert not has_table_privilege(current_user,'public.student_lesson_tasks','INSERT,UPDATE,DELETE');
 perform fixture.expect_denied(auth.uid(),auth.uid(),jsonb_build_array(fixture.item(40,5)));
 perform fixture.expect_denied(fixture.id('person',1),auth.uid(),jsonb_build_array(fixture.item(40,5)));
end $$;
select set_config('request.jwt.claim.sub',fixture.id('person',3)::text,false);
do $$ begin
 assert (select count(*) from public.student_lesson_tasks)=1;
 assert not exists(select from public.student_lesson_tasks where student_id<>auth.uid());
end $$;
set role anon;
select set_config('request.jwt.claim.sub','',false);
select fixture.expect_denied(fixture.id('person',1),fixture.id('person',2),jsonb_build_array(fixture.item(40,5)));
do $$ begin
 assert not has_table_privilege(current_user,'public.student_lesson_tasks','SELECT,INSERT,UPDATE,DELETE');
end $$;
reset role;
\echo PASS tutor-only writes, enrolled student reads and anonymous access restrictions.

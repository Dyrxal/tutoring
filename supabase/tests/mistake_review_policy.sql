-- Optional READ-ONLY verification after the pilot migration is installed.
-- Run the whole query as SQL Editor owner. No content/progress/attempts are written.
-- These check scheduling/marking helpers, not authenticated RLS or RPC concurrency.
do $$
declare result jsonb; step integer; gaps integer[]:=array[1,3,7,14,30,60]; expected integer[]:=array[3,7,14,30,60,60]; today date:='2026-10-13';
begin
 for step in 0..5 loop
  result:=public._mistake_review_transition(step,today,null,null,today,true,false,gaps);
  assert (result->>'stage')::integer=least(step+1,5), 'Incorrect successful review stage';
  assert (result->>'next_due')::date=today+expected[step+1], 'Incorrect successful review interval';
  assert result->>'context'='scheduled_review', 'Due question classified incorrectly';
 end loop;
 result:=public._mistake_review_transition(4,today-20,today-30,null,today,false,false,gaps);
 assert (result->>'stage')::integer=0 and (result->>'next_due')::date=today+1, 'Incorrect scheduled mistake reset';
 result:=public._mistake_review_transition(2,today-20,today-30,null,today,true,false,gaps);
 assert (result->>'next_due')::date=today+14, 'Overdue success must schedule from actual review date';
 result:=public._mistake_review_transition(4,today,null,null,today,true,true,gaps);
 assert (result->>'stage')::integer=0 and (result->>'next_due')::date=today+1, 'Help-assisted success must relearn';
 result:=public._mistake_review_transition(4,today,null,today,today,true,false,gaps);
 assert (result->>'help_used')::boolean and (result->>'next_due')::date=today+1, 'Saved same-day help must survive reopening';
 result:=public._mistake_review_transition(3,today+14,null,null,today,true,false,gaps);
 assert result->>'context'='early_practice' and (result->>'stage')::integer=3 and (result->>'next_due')::date=today+14, 'Early success must retain schedule';
 result:=public._mistake_review_transition(3,today+14,null,null,today,false,false,gaps);
 assert (result->>'stage')::integer=0 and (result->>'next_due')::date=today+1, 'Early mistake must bring date forward';
 result:=public._mistake_review_transition(3,today+14,null,null,today,true,true,gaps);
 assert (result->>'stage')::integer=0 and (result->>'next_due')::date=today+1, 'Early assisted answer must bring date forward';
 result:=public._mistake_review_transition(3,today+14,today,null,today,true,false,gaps);
 assert result->>'context'='review_retry' and (result->>'stage')::integer=3 and (result->>'next_due')::date=today+14, 'Same-day retry must not advance';
 result:=public._mistake_review_transition(0,'2026-10-04',null,null,'2026-10-03',false,false,gaps);
 assert (result->>'next_due')::date='2026-10-04', 'Calendar-day arithmetic must survive daylight saving';
 assert not public._mistake_review_grade('{"kind":"short_answer","accepted":["5.00"],"exact":true}',0,null,'5'), 'Written precision must be enforced';
 assert public._mistake_review_grade('{"kind":"short_answer","accepted":["5.00"],"exact":true}',0,null,' 5.00 '), 'Exact accepted form must pass';
 assert public._mistake_review_grade('{"kind":"short_answer","accepted":["0.5"]}',0,null,'1/2'), 'Numeric equivalent fraction must pass';
 assert not public._mistake_review_grade('{"kind":"short_answer","accepted":["0.5"]}',0,null,'1/0'), 'Invalid fractions must fail';
 assert public._mistake_review_grade('["wrong","correct","wrong","wrong"]',1,1,null), 'Correct multiple choice must pass';
 assert not public._mistake_review_grade('["wrong","correct","wrong","wrong"]',1,0,null), 'Incorrect multiple choice must fail';
end $$;
select 'Spaced-review scheduling and marking checks passed.' as result;

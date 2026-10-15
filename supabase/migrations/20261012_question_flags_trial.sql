-- Year 9 1A trial. Run the complete file in Supabase SQL Editor.
-- Additive, safe to rerun, independent of the Reported Problems migration.
begin;
create table if not exists public.question_flags (
 id uuid primary key,
 student_id uuid references public.profiles(id) on delete set null,
 course_id uuid references public.courses(id) on delete set null,
 lesson_id uuid references public.lessons(id) on delete set null,
 question_id uuid references public.questions(id) on delete set null,
 status text not null default 'outstanding' check(status in ('outstanding','reviewed','withdrawn')),
 context jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(),
 closed_at timestamptz,
 reviewed_by uuid references public.profiles(id) on delete set null,
 reviewer_name text,
 check((status='outstanding' and closed_at is null) or (status<>'outstanding' and closed_at is not null))
);
create unique index if not exists question_flags_one_active_idx
 on public.question_flags(student_id,question_id) where status='outstanding';
create index if not exists question_flags_student_date_idx on public.question_flags(student_id,created_at desc);
alter table public.question_flags enable row level security;
do $$ begin
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='question_flags' and policyname='question_flags_read') then
  create policy question_flags_read on public.question_flags for select to authenticated
   using(student_id=auth.uid() or public.is_tutor());
 end if;
end $$;
revoke all on public.question_flags from public,anon,authenticated;
grant select on public.question_flags to authenticated;

create or replace function public.flag_question_1a(p_id uuid,p_question_id uuid,p_student_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); ticket public.question_flags%rowtype; ctx record; student_name text;
begin
 if actor is null or actor is distinct from p_student_id or not exists(select 1 from public.profiles where id=actor and role='student') then
  raise exception 'Student permission is required.' using errcode='42501';
 end if;
 if p_id is null then raise exception 'Submission ID is required.' using errcode='22023'; end if;
 select q.prompt,q.position,l.id as lesson_id,l.title as lesson_title,c.id as course_id,c.title as course_title
 into ctx from public.questions q join public.lessons l on l.id=q.lesson_id
 join public.modules m on m.id=l.module_id join public.courses c on c.id=m.course_id
 where q.id=p_question_id and l.id='1313fc50-2b9a-405d-a64a-7f385a1db1b8'::uuid
 and exists(select 1 from public.enrolments e where e.student_id=actor and e.course_id=c.id);
 if not found then raise exception 'This trial is available only for enrolled Year 9 1A questions.' using errcode='42501'; end if;
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
  jsonb_build_object('student_name',student_name,'course_title',ctx.course_title,'lesson_title',ctx.lesson_title,'question_prompt',ctx.prompt,'question_number',ctx.position+1)) returning * into ticket;
 return to_jsonb(ticket);
end $$;

create or replace function public.withdraw_question_flag(p_id uuid,p_student_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare ticket public.question_flags%rowtype;
begin
 if auth.uid() is null or auth.uid() is distinct from p_student_id then raise exception 'Sign in to remove your flag.' using errcode='42501'; end if;
 select * into ticket from public.question_flags where id=p_id and student_id=auth.uid() for update;
 if not found then raise exception 'Your flag was not found.' using errcode='42501'; end if;
 if ticket.status='outstanding' then
  update public.question_flags set status='withdrawn',closed_at=now() where id=p_id returning * into ticket;
 end if;
 return to_jsonb(ticket);
end $$;

create or replace function public.review_question_flag(p_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
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
end $$;
revoke all on function public.flag_question_1a(uuid,uuid,uuid) from public,anon;
revoke all on function public.withdraw_question_flag(uuid,uuid) from public,anon;
revoke all on function public.review_question_flag(uuid) from public,anon;
grant execute on function public.flag_question_1a(uuid,uuid,uuid) to authenticated;
grant execute on function public.withdraw_question_flag(uuid,uuid) to authenticated;
grant execute on function public.review_question_flag(uuid) to authenticated;
notify pgrst,'reload schema';
commit;

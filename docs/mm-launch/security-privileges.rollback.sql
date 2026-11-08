-- PREPARED ONLY. Requires fresh production ACL/definition review and explicit approval.
-- Apply after owner-content.forward.sql; roll back security before owner-content rollback.
-- No function definition, policy, DML permission, column grant or service_role change.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='60s';
DO $guard$
DECLARE f text; r text; t text; present boolean;
BEGIN
 IF (SELECT count(*) FROM public.profiles WHERE role='tutor')<>1
    OR EXISTS(SELECT 1 FROM unnest(ARRAY['courses','modules','lessons','questions']) x(t)
       CROSS JOIN unnest(ARRAY['anon','authenticated']) y(r)
       WHERE has_table_privilege(y.r,format('public.%I',x.t),'TRUNCATE')) THEN
  RAISE EXCEPTION 'Owner-only prerequisite not established';
 END IF;
 FOREACH f IN ARRAY ARRAY['public.is_tutor()','public.enrolled_in(uuid)','public.can_read_lesson(uuid)','public.create_profile()'] LOOP
  SELECT EXISTS(SELECT 1 FROM pg_proc p CROSS JOIN LATERAL aclexplode(coalesce(p.proacl,acldefault('f',p.proowner))) a
   WHERE p.oid=f::regprocedure AND a.grantee=0 AND a.privilege_type='EXECUTE') INTO present;
  IF present IS DISTINCT FROM false THEN RAISE EXCEPTION 'PUBLIC function ACL drift: %',f; END IF;
 END LOOP;
 FOREACH r IN ARRAY ARRAY['anon','authenticated'] LOOP
  SELECT EXISTS(SELECT 1 FROM pg_proc p CROSS JOIN LATERAL aclexplode(p.proacl) a
   WHERE p.oid='public.create_profile()'::regprocedure AND a.grantee=r::regrole
    AND a.privilege_type='EXECUTE') INTO present;
  IF present IS DISTINCT FROM false THEN RAISE EXCEPTION 'Trigger-function ACL drift: %',r; END IF;
  FOREACH t IN ARRAY ARRAY['enrolments','lesson_progress','practice_attempts','profiles'] LOOP
   SELECT EXISTS(SELECT 1 FROM pg_class c CROSS JOIN LATERAL aclexplode(c.relacl) a
    WHERE c.oid=format('public.%I',t)::regclass AND c.relowner=current_user::regrole
     AND a.grantee=r::regrole AND a.privilege_type='TRUNCATE') INTO present;
   IF present IS DISTINCT FROM false THEN RAISE EXCEPTION 'Table TRUNCATE ACL drift: % %',t,r; END IF;
  END LOOP;
 END LOOP;
END
$guard$;
GRANT EXECUTE ON FUNCTION public.is_tutor(),public.enrolled_in(uuid),public.can_read_lesson(uuid),public.create_profile() TO PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_profile() TO anon,authenticated;
GRANT TRUNCATE ON public.enrolments,public.lesson_progress,public.practice_attempts,public.profiles TO anon,authenticated;
COMMIT;

-- PREPARED ONLY. No production execution authorized.
-- Required session inputs: mm.owner_id, mm.owner_email, mm.expected_tutors (JSON UUID array).
-- Verify the production project in the dashboard/connection independently before use.
-- Expected tutor list is the original reviewed snapshot, including the owner.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';
LOCK TABLE public.profiles IN SHARE ROW EXCLUSIVE MODE;
DO $guard$
DECLARE
 owner_id uuid := nullif(current_setting('mm.owner_id',true),'')::uuid;
 owner_email text := nullif(current_setting('mm.owner_email',true),'');
 expected uuid[];
 actual uuid[];
 table_name text;
 role_name text;
BEGIN
 IF owner_id IS NULL OR owner_email IS NULL OR nullif(current_setting('mm.expected_tutors',true),'') IS NULL THEN
  RAISE EXCEPTION 'Missing reviewed owner/tutor inputs';
 END IF;
 SELECT array_agg(v::uuid ORDER BY v::uuid) INTO expected
 FROM jsonb_array_elements_text(current_setting('mm.expected_tutors')::jsonb) AS x(v);
 IF expected IS NULL OR array_position(expected,NULL) IS NOT NULL
    OR cardinality(expected) <> (SELECT count(DISTINCT v) FROM unnest(expected) x(v))
    OR NOT owner_id=ANY(expected) THEN
  RAISE EXCEPTION 'Invalid reviewed tutor snapshot';
 END IF;
 IF (SELECT count(*) FROM auth.users u JOIN public.profiles p ON p.id=u.id
     WHERE lower(u.email)=lower(owner_email) AND lower(p.email)=lower(owner_email)) <> 1
    OR NOT EXISTS (SELECT 1 FROM auth.users u JOIN public.profiles p ON p.id=u.id
       WHERE u.id=owner_id AND lower(u.email)=lower(owner_email)
         AND lower(p.email)=lower(owner_email) AND p.role='tutor') THEN
  RAISE EXCEPTION 'Owner identity/role mismatch';
 END IF;
 SELECT array_agg(id ORDER BY id) INTO actual FROM public.profiles WHERE role='tutor';
 IF actual IS DISTINCT FROM expected THEN
  RAISE EXCEPTION 'Tutor snapshot drift; re-review required';
 END IF;
 -- Do not replace existing identity-aware authorization with a different helper.
 IF regexp_replace((SELECT prosrc FROM pg_proc WHERE oid='public.is_tutor()'::regprocedure),
       '\s','','g') <> 'selectexists(select1fromprofileswhereid=auth.uid()androle=''tutor'')' THEN
  RAISE EXCEPTION 'Tutor helper drift; re-review required';
 END IF;
 FOREACH table_name IN ARRAY ARRAY['courses','modules','lessons','questions'] LOOP
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid=format('public.%I',table_name)::regclass) THEN
   RAISE EXCEPTION 'Curriculum RLS disabled; re-review required';
  END IF;
  FOREACH role_name IN ARRAY ARRAY['anon','authenticated'] LOOP
   IF NOT EXISTS (
    SELECT 1 FROM pg_class c CROSS JOIN LATERAL aclexplode(c.relacl) a
    WHERE c.oid=format('public.%I',table_name)::regclass
      AND c.relowner=current_user::regrole
      AND a.grantor=current_user::regrole AND a.grantee=role_name::regrole
      AND a.privilege_type='TRUNCATE' AND NOT a.is_grantable
   ) THEN
    RAISE EXCEPTION 'Original direct TRUNCATE ACL differs; exact rollback requires re-review';
   END IF;
   IF NOT has_table_privilege(role_name,format('public.%I',table_name),'TRUNCATE') THEN
    RAISE EXCEPTION 'Curriculum TRUNCATE grant drift; re-review required';
   END IF;
  END LOOP;
 END LOOP;
END
$guard$;
UPDATE public.profiles SET role='student'
WHERE role='tutor' AND id<>current_setting('mm.owner_id')::uuid
  AND id IN (SELECT v::uuid FROM jsonb_array_elements_text(current_setting('mm.expected_tutors')::jsonb) AS x(v));
REVOKE TRUNCATE ON public.courses,public.modules,public.lessons,public.questions FROM anon,authenticated;
-- Inherited privileges must not leave a bypass after direct grants are removed.
DO $check$
DECLARE t text; r text;
BEGIN
 FOREACH t IN ARRAY ARRAY['courses','modules','lessons','questions'] LOOP
  FOREACH r IN ARRAY ARRAY['anon','authenticated'] LOOP
   IF has_table_privilege(r,format('public.%I',t),'TRUNCATE') THEN
    RAISE EXCEPTION 'Inherited TRUNCATE remains; transaction aborted';
   END IF;
  END LOOP;
 END LOOP;
END
$check$;
COMMIT;

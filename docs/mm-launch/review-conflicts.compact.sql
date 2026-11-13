-- Same reviewed two-function fix; exact original and result SHA-256 checks.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

DO $mm_fix$
DECLARE
 signatures text[] := ARRAY[
  'public.note_mistake_review_help(uuid,uuid)',
  'public.submit_mistake_review(uuid,uuid,uuid,integer,text,boolean,bigint,jsonb)'
 ];
 original_hashes text[] := ARRAY[
  '97bbe290f92cf4836914f50bb14664aec2d1afef72d21fb8e6759828c1ae52ac',
  '78a2f62c4266d53b4794352aa8e6e731ec71011b1762b1b7db36404abace0ba3'
 ];
 result_hashes text[] := ARRAY[
  '63a9cc1ffb1e1a7e85cacfc8a5f572042e5413ccf1f9fd11a3e1e0129cc2b9d2',
  '18284f6bbe9ddb02c7a35c091013971bac6a3fd070f38921844681261a3086f9'
 ];
 prepared text[] := ARRAY[]::text[];
 definition text;
 patched text;
 i integer;
BEGIN
 IF current_database() <> 'postgres'
    OR (SELECT system_identifier::text FROM pg_control_system())
       IS DISTINCT FROM '7678071634733212629' THEN
  RAISE EXCEPTION 'Wrong production database; stop';
 END IF;

 -- Validate both original definitions before changing either function.
 FOR i IN 1..2 LOOP
  definition := replace(pg_get_functiondef(to_regprocedure(signatures[i])), chr(13), '');
  IF encode(sha256(convert_to(definition, 'UTF8')), 'hex')
     IS DISTINCT FROM original_hashes[i] THEN
   RAISE EXCEPTION 'Original function mismatch: %. Stop and inspect.', signatures[i];
  END IF;
  patched := replace(definition, 'using errcode=''40001''', 'using errcode=''PT409''');
  IF encode(sha256(convert_to(patched, 'UTF8')), 'hex')
     IS DISTINCT FROM result_hashes[i] THEN
   RAISE EXCEPTION 'Unexpected patch result: %. Stop.', signatures[i];
  END IF;
  prepared := array_append(prepared, patched);
 END LOOP;

 -- Install only the two verified definitions, then check the stored results.
 FOR i IN 1..2 LOOP
  EXECUTE prepared[i];
  definition := replace(pg_get_functiondef(to_regprocedure(signatures[i])), chr(13), '');
  IF encode(sha256(convert_to(definition, 'UTF8')), 'hex')
     IS DISTINCT FROM result_hashes[i] THEN
   RAISE EXCEPTION 'Installed function mismatch: %. Rolling back.', signatures[i];
  END IF;
 END LOOP;
END;
$mm_fix$;

COMMIT;

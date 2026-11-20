#!/usr/bin/env bash
# Runs synthetic assignment tests on the same pinned PostgreSQL image as the local database rehearsal.
set -euo pipefail
cd "$(dirname "$0")/.."
image='postgres@sha256:665dc7b37ac52a17e298511414c21d23ffa4e6a6ef6225b3e5d59c7afb35e994'
local_docker() { docker --host=unix:///var/run/docker.sock "$@"; }
unset DOCKER_HOST DOCKER_CONTEXT DOCKER_TLS DOCKER_TLS_VERIFY DOCKER_CERT_PATH
local_docker image inspect "$image" >/dev/null
container=$(local_docker run --rm --pull=never --network none -d -e POSTGRES_HOST_AUTH_METHOD=trust "$image")
scratch=$(mktemp -d)
trap 'local_docker rm -fv "$container" >/dev/null; rm -rf "$scratch"' EXIT
for ((attempt=0; attempt<100; attempt++)); do
  if local_docker exec "$container" sh -c '[ "$(cat /proc/1/comm)" = postgres ] && pg_isready -U postgres' >/dev/null; then break; fi
  sleep .2
done
sql() { local_docker exec -i "$container" psql -XqAt -v ON_ERROR_STOP=1 -U postgres "$@"; }
sql <<'SQL'
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create schema auth;
create schema storage;
create table auth.users(id uuid primary key, email text not null, raw_user_meta_data jsonb not null default '{}');
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
grant usage on schema public,auth,storage to anon,authenticated,service_role;
create table storage.buckets(id text primary key,name text not null,public boolean,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id),name text not null);
alter table storage.objects enable row level security;
SQL
sql < supabase/preview/bootstrap.sql
# Read the fixtures, the actual migration, and the assertions in one psql session.
{
  cat supabase/tests/assignment_requirements.fixtures.sql
  cat supabase/migrations/20261120091800_lesson_assignment_requirements.sql
  cat supabase/tests/assignment_requirements.sql
} | sql

# Hold one real assignment transaction open. A retry and a conflicting assignment must both
# wait for the same student, then see the first committed task before deciding what to return.
coproc WRITER { sql; }
writer_pid=$WRITER_PID
writer_in=${WRITER[1]}
writer_out=${WRITER[0]}
cat >&"$writer_in" <<'SQL'
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub',fixture.id('person',1)::text,true);
select fixture.assign(fixture.item(100,8,'{"question_scope":"all","due_date":"2028-02-29"}'));
\echo WRITER_READY
SQL
while IFS= read -r -t 15 line <&"$writer_out"; do
  [[ "$line" == WRITER_READY ]] && break
done
[[ "$line" == WRITER_READY ]]

sql >"$scratch/retry" <<'SQL' &
set application_name='assignment_retry';
set role authenticated;
select set_config('request.jwt.claim.sub',fixture.id('person',1)::text,false);
select (fixture.assign(fixture.item(101,8,'{"question_scope":"all","due_date":"2028-02-29"}'))->0->>'id')::uuid = fixture.id('task',100);
SQL
retry_pid=$!
sql <<'SQL' &
set application_name='assignment_conflict';
set role authenticated;
select set_config('request.jwt.claim.sub',fixture.id('person',1)::text,false);
select fixture.expect_invalid(jsonb_build_array(fixture.item(102,8,'{"question_scope":"core"}')),'Remove the active assignment');
SQL
conflict_pid=$!
for ((attempt=0; attempt<100; attempt++)); do
  blocked=$(sql -c "select count(*) from pg_stat_activity where application_name in ('assignment_retry','assignment_conflict') and cardinality(pg_blocking_pids(pid))>0")
  [[ "$blocked" == 2 ]] && break
  sleep .1
done
[[ "$blocked" == 2 ]]
printf 'commit;\n\\q\n' >&"$writer_in"
wait "$writer_pid"
wait "$retry_pid"
wait "$conflict_pid"
[[ "$(tail -n 1 "$scratch/retry")" == t ]]
[[ "$(sql -c "select count(*) from public.student_lesson_tasks where student_id=fixture.id('person',2) and lesson_id=fixture.id('lesson',8) and removed_at is null")" == 1 ]]
echo 'PASS concurrent applications wait, return the committed task on retry, and reject conflicting requirements.'

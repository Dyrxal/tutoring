#!/usr/bin/env node
// Integration tests only: disposable, network-isolated Postgres with synthetic data.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const image = 'postgres@sha256:665dc7b37ac52a17e298511414c21d23ffa4e6a6ef6225b3e5d59c7afb35e994';
const db = 'mm_synthetic_rehearsal', label = 'mm.synthetic-rehearsal';
const env = { ...process.env };
for (const key of ['DOCKER_HOST', 'DOCKER_CONTEXT', 'DOCKER_TLS', 'DOCKER_TLS_VERIFY', 'DOCKER_CERT_PATH']) delete env[key];
const checks = [], created = [], dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mm-synthetic-'));
const sha = value => createHash('sha256').update(value).digest('hex');
const docker = args => ['--host=unix:///var/run/docker.sock', ...args];
function run(args, input) {
    const r = spawnSync('docker', docker(args), { env, input, encoding: 'utf8', timeout: 60000, maxBuffer: 30 * 1024 * 1024 });
    if (r.error) throw r.error;
    return r;
}
function command(args, input) {
    const r = run(args, input);
    assert.equal(r.status, 0, r.stderr || 'Local Docker command failed');
    return r.stdout;
}
function owned(name) {
    assert(created.includes(name), 'Not a container created by this run');
    const info = JSON.parse(command(['inspect', name]))[0];
    assert.equal(info.Config.Labels[label], 'true');
    assert.equal(info.HostConfig.NetworkMode, 'none');
    assert(!info.HostConfig.PortBindings || Object.keys(info.HostConfig.PortBindings).length === 0, 'Unexpected published port');
}
function sql(name, query, expectSuccess = true) {
    owned(name);
    const r = run(['exec', '-i', name, 'psql', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1', '-v', 'VERBOSITY=verbose', '-U', 'postgres', '-d', db], query);
    if (expectSuccess) assert.equal(r.status, 0, r.stderr);
    return r;
}
function pass(id, detail) { checks.push({ id, status: 'passing', detail }); console.error('PASS ' + id); }
async function start() {
    const name = 'mm-synthetic-' + randomUUID();
    command(['run', '-d', '--name', name, '--label', label + '=true', '--network', 'none', '-e', 'POSTGRES_HOST_AUTH_METHOD=trust', image]);
    created.push(name);
    const deadline = Date.now() + 30000;
    // The entrypoint briefly starts a temporary server during initdb; wait for its final exec.
    while (run(['exec', name, 'sh', '-c', '[ "$(cat /proc/1/comm)" = postgres ] && pg_isready -U postgres']).status !== 0) {
        assert(Date.now() < deadline, 'Local Postgres startup timeout');
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    owned(name);
    command(['exec', name, 'createdb', '-U', 'postgres', db]);
    sql(name, `COMMENT ON DATABASE ${db} IS 'MM_SYNTHETIC_ONLY_v1';`);
    return name;
}
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const ids = { student: 'e1111111-1111-4111-8111-000000000001', other: 'e1111111-1111-4111-8111-000000000002', tutor: 'e1111111-1111-4111-8111-000000000003', outside: 'e1111111-1111-4111-8111-000000000004' };
const course = 'a1111111-1111-4111-8111-111111111111', otherCourse = 'a1111111-1111-4111-8111-111111111112';
const question = 'd1111111-1111-4111-8111-000000000001', otherQuestion = 'd1111111-1111-4111-8111-000000000010';
const lesson = 'c1111111-1111-4111-8111-111111111111';
function actor(role, id, statement) { return `BEGIN; SET LOCAL ROLE ${role}; SET LOCAL request.jwt.claim.sub='${id || ''}'; ${statement}; ROLLBACK;`; }
function value(name, role, id, statement) { return sql(name, actor(role, id, statement)).stdout.trim(); }
function denied(name, role, id, statement) {
    const r = sql(name, actor(role, id, statement), false);
    assert.notEqual(r.status, 0, 'Expected a permission rejection');
    assert.match(r.stderr, /42501|permission denied|row-level security/);
}
function dump(name, flags) { owned(name); return command(['exec', name, 'pg_dump', '-U', 'postgres', '-d', db, ...flags]); }
function schema(name) { return dump(name, ['--schema-only']).split('\n').filter(l => !/^\\(?:un)?restrict /.test(l)).join('\n'); }
function baseline(name) {
    const tables = JSON.parse(sql(name, "SELECT json_agg(format('%I.%I',schemaname,tablename) ORDER BY schemaname,tablename) FROM pg_tables WHERE schemaname IN ('public','auth','storage')").stdout);
    return tables.map(table => ({ table, ...JSON.parse(sql(name, `SELECT json_build_object('rows',count(*),'digest',md5(coalesce(string_agg(md5(to_jsonb(t)::text),'' ORDER BY to_jsonb(t)::text COLLATE "C"),''))) FROM ${table} t`).stdout) }));
}
function boundaries(name, phase, expectedConflict) {
    assert.equal(value(name, 'anon', '', 'SELECT count(*) FROM public.questions'), '0');
    assert.equal(value(name, 'anon', '', 'SELECT public.is_tutor()'), 'f');
    denied(name, 'anon', '', `SELECT public.note_mistake_review_help('${ids.student}','${question}')`);
    pass(phase + ':anonymous', 'No question rows or tutor status; privileged student action denied');
    assert.equal(value(name, 'authenticated', ids.outside, 'SELECT count(*) FROM public.questions'), '0');
    assert.equal(value(name, 'authenticated', ids.student, `SELECT count(*) FROM public.questions WHERE id='${question}'`), '1');
    assert.equal(value(name, 'authenticated', ids.student, `SELECT count(*) FROM public.questions WHERE id='${otherQuestion}'`), '0');
    pass(phase + ':enrolment-reads', 'Enrolled content visible; unenrolled course/actor denied');
    denied(name, 'authenticated', ids.student, `UPDATE public.profiles SET role='tutor' WHERE id='${ids.student}'`);
    denied(name, 'authenticated', ids.student, `INSERT INTO public.enrolments(student_id,course_id) VALUES('${ids.student}','${otherCourse}')`);
    assert.equal(value(name, 'authenticated', ids.student, 'SELECT count(*) FROM public.profiles'), '1');
    pass(phase + ':self-escalation', 'Role column update and self-enrolment rejected; cross-student profile hidden');
    denied(name, 'authenticated', ids.student, `SELECT public.note_mistake_review_help('${ids.other}','${question}')`);
    denied(name, 'authenticated', ids.student, `SELECT public.assign_student_lesson_tasks('${ids.tutor}','${ids.other}','[]'::jsonb)`);
    denied(name, 'authenticated', ids.student, `SELECT public._mistake_review_timezone('${ids.other}')`);
    pass(phase + ':actor-spoofing', 'Cross-account review, spoofed tutor action and private helper invocation denied');
    for (const statement of [
        `SELECT public.note_mistake_review_help('${ids.student}','${question}')`,
        `SELECT public.submit_mistake_review('f1111111-1111-4111-8111-000000000001','${ids.student}','${question}',0,'1',false,1,'{}'::jsonb)`
    ]) {
        const stale = sql(name, actor('authenticated', ids.student, statement), false);
        assert.notEqual(stale.status, 0);
        assert.match(stale.stderr, new RegExp(expectedConflict));
    }
    pass(phase + ':review-conflict', 'Both review RPCs return ' + expectedConflict + ' for an enrolled student with no schedule');
    denied(name, 'authenticated', ids.student, `INSERT INTO public.practice_attempts(student_id,question_id,selected_index,is_correct,attempt_context) VALUES('${ids.student}','${question}',0,true,'review')`);
    denied(name, 'authenticated', ids.student, `INSERT INTO public.practice_attempts(student_id,question_id,selected_index,is_correct) VALUES('${ids.other}','${question}',0,true)`);
    pass(phase + ':attempt-boundaries', 'Direct review metadata and another student’s answer writes denied');
    assert.equal(value(name, 'anon', '', 'SELECT count(*) FROM storage.objects'), '0');
    assert.equal(value(name, 'authenticated', ids.outside, 'SELECT count(*) FROM storage.objects'), '0');
    assert.equal(value(name, 'authenticated', ids.student, 'SELECT count(*) FROM storage.objects'), '2');
    denied(name, 'authenticated', ids.student, `INSERT INTO storage.objects(bucket_id,name) VALUES('question-images','${question}/unauthorized.png')`);
    pass(phase + ':private-storage', 'Anonymous/unenrolled objects hidden; enrolled metadata visible; student upload denied (Storage service not emulated)');
    assert.equal(value(name, 'authenticated', ids.tutor, 'SELECT count(*) FROM public.courses'), '2');
    assert.equal(value(name, 'authenticated', ids.tutor, `UPDATE public.lessons SET objective='Synthetic tutor edit' WHERE id='${lesson}' RETURNING objective`), 'Synthetic tutor edit');
    pass(phase + ':tutor', 'Tutor can view both courses and edit; transaction rolled back');
}

let output, failure;
try {
    assert.equal(fs.realpathSync(process.cwd()), fs.realpathSync(root), 'Run from repository root');
    const args = process.argv.slice(2);
    assert(args.length === 0 || args.length === 2 && args[0] === '--out', 'Only --out is supported; no database URL or external target accepted');
    const requestedOutput = args[1] && path.resolve(args[1]);
    if (requestedOutput) {
        assert(!fs.existsSync(requestedOutput), 'Use a new output path');
        assert(!['dist','public'].some(d => requestedOutput.startsWith(path.join(root, d) + path.sep)), 'Report must not be public');
        output = requestedOutput;
    }
    command(['image', 'inspect', image]); // Pull explicitly before running; no hidden network/package operations.
    const source = await start(), target = await start();
    pass('local-isolation', 'Two new labelled containers on fixed local Docker socket; network none; no published ports or mounted production inputs');
    sql(source, `CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS;
      CREATE SCHEMA auth; CREATE SCHEMA storage;
      CREATE TABLE auth.users(id uuid PRIMARY KEY,email text NOT NULL,raw_user_meta_data jsonb NOT NULL DEFAULT '{}'::jsonb);
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      GRANT USAGE ON SCHEMA public,auth,storage TO anon,authenticated,service_role;
      CREATE TABLE storage.buckets(id text PRIMARY KEY,name text NOT NULL,public boolean DEFAULT false,file_size_limit bigint,allowed_mime_types text[]);
      CREATE TABLE storage.objects(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),bucket_id text REFERENCES storage.buckets(id),name text NOT NULL,metadata jsonb DEFAULT '{}'::jsonb,UNIQUE(bucket_id,name));
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
      GRANT SELECT,INSERT,UPDATE,DELETE ON storage.objects TO anon,authenticated,service_role;`);
    sql(source, read('supabase/preview/bootstrap.sql'));
    sql(source, read('supabase/preview/seed-synthetic.sql'));
    sql(source, `INSERT INTO auth.users(id,email,raw_user_meta_data) VALUES ${Object.entries(ids).map(([key,id]) => `('${id}','${key}@synthetic.invalid','{"full_name":"Synthetic ${key}","year_level":"Year 9","role":"tutor"}')`).join(',')};
      UPDATE public.profiles SET role='tutor' WHERE id='${ids.tutor}';
      INSERT INTO public.enrolments(student_id,course_id) VALUES('${ids.student}','${course}'),('${ids.other}','${otherCourse}');
      INSERT INTO storage.objects(bucket_id,name,metadata) VALUES('question-images','${question}/synthetic.png','{"mimetype":"image/png"}'),('lesson-resources','${lesson}/synthetic.pdf','{"mimetype":"application/pdf"}');`);
    assert.equal(sql(source, `SELECT role FROM public.profiles WHERE id='${ids.student}'`).stdout.trim(), 'student');
    assert.equal(sql(source, `SELECT count(*) FROM enrolments WHERE student_id='${ids.outside}'`).stdout.trim(), '0');
    pass('registration-metadata', 'User-supplied tutor role ignored; profile creation does not auto-enrol by year');
    boundaries(source, 'original', '40001');
    const original = baseline(source), originalSchema = schema(source);
    // These are the exact shipped files. No project guard is removed or repinned.
    sql(source, read('docs/mm-launch/review-conflicts.forward.sql'));
    assert.deepEqual(baseline(source), original);
    pass('forward-data-preservation', 'Exact guarded change applied locally; every synthetic table count/digest unchanged');
    const installedSchema = schema(source);
    const repeated = sql(source, read('docs/mm-launch/review-conflicts.forward.sql'), false);
    assert.notEqual(repeated.status, 0); assert.match(repeated.stderr, /Definition drift/);
    assert.equal(schema(source), installedSchema);
    pass('forward-drift-aborts', 'Applying forward package to the new definitions aborts without schema/data change');
    boundaries(source, 'prepared', 'PT409');
    sql(source, read('docs/mm-launch/review-conflicts.rollback.sql'));
    assert.equal(schema(source), originalSchema); assert.deepEqual(baseline(source), original);
    pass('rollback-exact', 'Exact guarded rollback restores original schema/ACL/owner/definition dump and preserves every synthetic row');
    const secondRollback = sql(source, read('docs/mm-launch/review-conflicts.rollback.sql'), false);
    assert.notEqual(secondRollback.status, 0); assert.match(secondRollback.stderr, /Definition drift/);
    pass('rollback-drift-aborts', 'Rollback against already-original definitions is rejected');
    sql(source, read('docs/mm-launch/review-conflicts.forward.sql'));
    const beforeRestore = baseline(source), schemaDump = dump(source, ['--schema-only']), dataDump = dump(source, ['--data-only']);
    const roles = command(['exec', source, 'pg_dumpall', '-U', 'postgres', '--roles-only', '--no-role-passwords']).split('\n').filter(l => !/^(?:CREATE|ALTER) ROLE postgres\b/.test(l)).join('\n');
    // Local-only adaptation: target already owns postgres; all synthetic app roles are restored.
    // pg_dump assumes the standard public schema already exists on a fresh database.
    sql(target, roles); sql(target, schemaDump);
    const normalRestore = sql(target, 'BEGIN;\n' + dataDump + '\nCOMMIT;', false);
    assert.notEqual(normalRestore.status, 0); assert.match(normalRestore.stderr, /23505|duplicate key/);
    assert.equal(sql(target, 'SELECT count(*) FROM auth.users').stdout.trim(), '0');
    pass('trigger-replay-negative-control', 'Without trigger suppression Auth replay duplicates profiles; stop-on-error transaction rolls back');
    sql(target, 'BEGIN; SET LOCAL session_replication_role=replica;\n' + dataDump + '\nCOMMIT;');
    assert.equal(sql(target, 'SHOW session_replication_role').stdout.trim(), 'origin');
    assert.deepEqual(baseline(target), beforeRestore); assert.equal(schema(target), schema(source));
    assert.equal(sql(target, 'SELECT count(*) FROM auth.users').stdout.trim(), '4');
    assert.equal(sql(target, 'SELECT count(*) FROM public.profiles').stdout.trim(), '4');
    pass('synthetic-restore', 'Role/schema/data restore preserves every synthetic table digest and schema definition; triggers return to origin; four users/four profiles');
    boundaries(target, 'restored', 'PT409');
    sql(target, `INSERT INTO auth.users(id,email) VALUES('e1111111-1111-4111-8111-000000000099','after-restore@synthetic.invalid');`);
    assert.equal(sql(target, "SELECT count(*) FROM public.profiles WHERE id='e1111111-1111-4111-8111-000000000099'").stdout.trim(), '1');
    pass('restored-trigger-active', 'Fresh synthetic user creates exactly one profile after restore');
    sql(target, read('docs/mm-launch/review-conflicts.rollback.sql'));
    pass('restored-rollback', 'Rollback guard and original definitions work on the restored synthetic database');
    const sourceBytes = path.join(dir, 'source-objects'), restoredBytes = path.join(dir, 'restored-objects');
    const objects = [['question-images', question + '/synthetic.png', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64')], ['lesson-resources', lesson + '/synthetic.pdf', Buffer.from('%PDF-1.4\n% Synthetic recovery byte sentinel only; no PDF decode claim.\n%%EOF')]];
    const manifest = objects.map(([bucket,key,bytes]) => { const f=path.join(sourceBytes,bucket,key);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,bytes);return {bucket,key,bytes:bytes.length,sha256:sha(bytes)}; });
    assert(!fs.existsSync(restoredBytes), 'Database dump cannot restore object bytes');
    fs.cpSync(sourceBytes, restoredBytes, { recursive: true });
    for (const o of manifest) assert.equal(sha(fs.readFileSync(path.join(restoredBytes,o.bucket,o.key))),o.sha256);
    pass('separate-storage-bytes', 'Database-only restore has no object files; separate synthetic byte copy matches paths/checksums (not a real Storage-service restore)');
    fs.appendFileSync(path.join(restoredBytes,manifest[0].bucket,manifest[0].key),'tamper');
    assert.notEqual(sha(fs.readFileSync(path.join(restoredBytes,manifest[0].bucket,manifest[0].key))),manifest[0].sha256);
    pass('storage-corruption-detected', 'Checksum comparison detects changed copied bytes');
    checks.push({ id: 'synthetic-manifest', status: 'passing', detail: manifest });
} catch (e) { failure = String(e.stack || e); checks.push({ id: 'exercise', status: 'failing', detail: failure }); }
finally {
    for (const name of created.reverse()) {
        try { owned(name); command(['rm','-f','-v',name]); } catch (e) { failure ||= String(e); checks.push({id:'cleanup',status:'failing',detail:String(e)}); }
    }
    fs.rmSync(dir,{recursive:true,force:true});
}
const report = { format:1,kind:'local-synthetic-database-rehearsal',observed_at:new Date().toISOString(),image,
    repository_head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),
    inputs_sha256:Object.fromEntries(['scripts/check-mm-local-database.mjs','supabase/preview/bootstrap.sql','supabase/preview/seed-synthetic.sql','docs/mm-launch/review-conflicts.forward.sql','docs/mm-launch/review-conflicts.rollback.sql'].map(f=>[f,sha(read(f))])),
    ready:!failure,summary:{passing:checks.filter(x=>x.status==='passing').length,failing:checks.filter(x=>x.status==='failing').length},checks,
    production_access:false,hosted_preview_access:false,emails_sent:0,cleanup:checks.some(c=>c.id==='cleanup')?'Container cleanup failed; see failing checks. Temporary synthetic byte files removed.':'Run-created containers and volumes removed; temporary synthetic byte files removed',
    limitations:['Synthetic Auth/Storage schema stubs; no live Auth/Storage service or actual email/login/file rendering tested.','Raw local pg_dump is deliberately not the Supabase CLI production backup procedure.','No real data/secret export, managed-project restore or production backup verified.','No physical-device/time/quota acceptance implied.'] };
if (output) fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if (failure) process.exitCode=1;

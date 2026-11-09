import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const cli = path.resolve('scripts/mm-preflight.mjs'), ref = 'lcddnpafrkbwsrhqexqe';
function run(args) {
    const r = spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
    let data;
    try {
        data = JSON.parse(r.stdout);
    }
    catch { }
    return { ...r, data };
}
function temp(fn) {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mm-preflight-'));
    try {
        return fn(d);
    }
    finally {
        fs.rmSync(d, { recursive: true, force: true });
    }
}
const jwt = p => 'eyJhbGciOiJIUzI1NiJ9.' + Buffer.from(JSON.stringify(p)).toString('base64url') + '.fixtureSignature';
test('asset CLI accepts only intended backend and public key, including compressed assets', () => temp(d => { fs.writeFileSync(path.join(d, 'app.js'), `const url="https://${ref}.supabase.co",key="sb_publishable_fixture";`); let r = run(['assets', '--target', 'preview', '--dir', d]); assert.equal(r.status, 0, r.stderr); assert.equal(r.data.ready, true); fs.writeFileSync(path.join(d, 'other.js'), 'https://lmuwsjjrqmmmtmxjvqln.supabase.co'); r = run(['assets', '--target', 'preview', '--dir', d]); assert.equal(r.status, 1); assert(r.data.checks.some(c => c.id === 'backend' && c.status === 'failing')); }));
test('asset CLI rejects leaked secret/JWT without printing their values', () => temp(d => { const secret = 'sb_secret_SUPER_PRIVATE_TEST'; fs.writeFileSync(path.join(d, 'app.js'), `https://${ref}.supabase.co sb_publishable_fixture ${secret} ${jwt({ role: 'service_role', ref })}`); const r = run(['assets', '--target', 'preview', '--dir', d]); assert.equal(r.status, 1); assert(!r.stdout.includes(secret)); assert(!r.stdout.includes('fixtureSignature')); }));
test('empty/missing asset directories cannot pass', () => temp(d => { assert.equal(run(['assets', '--target', 'preview', '--dir', d]).status, 1); assert.notEqual(run(['assets', '--target', 'production', '--dir', d + 'missing']).status, 0); }));
test('malformed snapshots and unknown commands fail closed with JSON', () => temp(d => { const f = path.join(d, 'bad.json'); fs.writeFileSync(f, '{}'); const r = run(['baseline', '--before', f, '--after', f]); assert.equal(r.status, 1); assert(r.data); assert.equal(run(['deploy']).status, 1); }));
import zlib from 'node:zlib';
import { metadata, baseline, report, review, packageState, read, refs } from './mm-preflight/core.mjs';
import { captureSQL } from './mm-preflight/sql.mjs';
const snap = (kind, data, project_ref = ref) => ({ format: 1, kind, project_ref, captured_at: new Date().toISOString(), scope: {}, database_identity: read('docs/mm-launch/project-bindings.json').bindings[project_ref], data });
const content = () => ['courses', 'modules', 'lessons', 'questions'].map(entity => ({ entity, rows: 1, digest: 'a'.repeat(32) }));
const bs = () => snap('baseline', { content: content(), storage: ['question-images', 'lesson-images', 'lesson-resources'].map(entity => ({ entity, rows: 0, digest: 'a'.repeat(32) })), missing_refs: { questions: 0, notes: 0, examples: 0, resources: 0 } });
test('compressed and escaped foreign hosts/secrets cannot bypass scan', () => temp(d => { fs.writeFileSync(path.join(d, 'app.js'), `https://${ref}.supabase.co sb_publishable_fixture`); fs.writeFileSync(path.join(d, 'bad.js.gz'), zlib.gzipSync('https://lmuw\\u0073jjrqmmmtmxjvqln.supabase.co sb_\\u0073ecret_HIDDEN_TEST')); const r = run(['assets', '--target', 'preview', '--dir', d]); assert.equal(r.status, 1); assert(!r.stdout.includes('HIDDEN_TEST')); assert.equal(r.data.checks.find(c => c.id === 'secrets').status, 'failing'); }));
test('legacy anon JWT must match intended project; user JWT is rejected', () => temp(d => { const f = path.join(d, 'a.js'); fs.writeFileSync(f, `https://${ref}.supabase.co ${jwt({ role: 'anon', ref })}`); assert.equal(run(['assets', '--target', 'preview', '--dir', d]).status, 0); fs.appendFileSync(f, ' ' + jwt({ role: 'authenticated', ref })); assert.equal(run(['assets', '--target', 'preview', '--dir', d]).status, 1); }));
test('baseline unchanged passes, changed content requires exact approved aggregate pair', () => { const b = bs(), a = structuredClone(b); assert(baseline(b, a).ready); a.data.content[3].rows = 2; assert(!baseline(b, a).ready); assert(baseline(b, a, [{ group: 'content', entity: 'questions', before: b.data.content[3], after: a.data.content[3], reason: 'Approved tutor edit' }]).ready); a.data.content[3].rows = 3; assert(!baseline(b, a, [{ group: 'content', entity: 'questions', before: b.data.content[3], after: { ...a.data.content[3], rows: 2 }, reason: 'Approved' }]).ready); });
test('baseline rejects changed fixture scope, project mismatch and nonzero missing files', () => { const b = bs(), a = bs(); a.scope = { questions: ['x'] }; assert.throws(() => baseline(b, a)); a.scope = {}; a.project_ref = refs.production; assert.throws(() => baseline(b, a)); a.project_ref = ref; a.data.missing_refs.questions = 1; assert(!baseline(b, a).ready); });
test('incomplete baseline and malformed digests cannot pass', () => { const b = bs(); b.data.content = []; assert.throws(() => baseline(b, b)); const a = bs(); a.data.content[0].digest = 'not-a-digest'; assert.throws(() => baseline(a, a)); });
test('stale snapshots fail and reversed baseline chronology is rejected', () => { const b = bs(), a = bs(); b.captured_at = '2020-01-01T00:00:00Z'; a.captured_at = '2020-01-02T00:00:00Z'; assert(!baseline(b, a).ready); assert.throws(() => baseline(a, b)); });
test('SQL generation rejects injection in fixture scope and emits only read-only capture', () => { assert.throws(() => captureSQL('baseline', ref, { questions: ["x');drop table questions;--"] })); assert.throws(() => captureSQL('baseline', ref, { profiles: [] })); const s = captureSQL('baseline', ref, { questions: ['f1111111-1111-4111-8111-111111111111', 'f1111111-1111-4111-8111-111111111112'] }); assert(s.startsWith('BEGIN TRANSACTION READ ONLY;')); assert(s.includes('= ANY')); assert(s.endsWith('ROLLBACK;')); assert(!/select\s+\*/i.test(s)); assert.throws(() => captureSQL('baseline', 'other')); });
test('review checks distinguish forward from rollback state and detect package tampering', () => temp(d => {
    const pins = read('docs/mm-acceptance/launch-preparation.json').sql_sha256, states = packageState('docs/mm-launch', pins), functions = Object.entries(states.forward).map(([identity, definition]) => ({ identity, definition })), s = snap('metadata', { functions }, refs.production);
    assert(review(s, states, 'forward').ready);
    assert(!review(s, states, 'rollback').ready);
    s.data.functions[0].definition += ' ';
    assert(!review(s, states, 'forward').ready);
    for (const name of Object.keys(pins))
        fs.copyFileSync('docs/mm-launch/' + name, path.join(d, name));
    fs.appendFileSync(path.join(d, 'review-conflicts.forward.sql'), '\n-- changed');
    assert.throws(() => packageState(d, pins));
}));
test('metadata reports exact missing column and definition drift, not just section counts', () => { const sections = { columns: [{ table: 'questions', column: 'options', type: 'jsonb' }], constraints: [{ name: 'pk' }], policies: [{ policyname: 'p' }], triggers: [{ table: 'q' }], table_grants: [{ table_name: 'q' }], effective: [{ identity: 'f' }], rls: [{ table: 'q' }], buckets: [{ name: 'private' }], functions: [{ identity: 'public.f()', definition: 'x', owner: 'postgres', acl: '{postgres=X/postgres}' }] }; const e = snap('metadata', sections), a = structuredClone(e); assert(metadata(a, e, { rollback: {} }, 'before').ready); a.data.columns[0].type = 'text'; a.data.functions[0].definition = 'changed'; const r = metadata(a, e, { rollback: {} }, 'before'); assert(!r.ready); assert(r.checks.some(c => c.id.includes('questions.options') && c.status === 'failing')); assert(r.checks.some(c => c.id === 'definition:public.f()' && c.status === 'failing')); });
test('readiness never treats absent evidence or empty reports as passing', () => { const gates = Object.fromEntries(['production_auth', 'smtp', 'database_backup', 'storage_backup', 'restore_rehearsal', 'production_build_settings', 'rollback_version', 'owner_launch_approval', 'device_time_acceptance', 'security_acceptance', 'enrolment_behavior', 'production_smoke_scope'].map(n => [n, { status: 'passing', evidence: 'controlled fixture' }])); const empty = ['assets', 'metadata', 'baseline', 'review'].map(kind => ({ format: 1, kind, project_ref: ref, captured_at: new Date().toISOString(), source_commit: 'a'.repeat(40), checks: [] })); assert(!report(empty, gates, 'a'.repeat(40)).ready); assert(!report([], {}, 'a'.repeat(40)).ready); });
test('production metadata distinguishes before-change and installed definitions', () => { const states = packageState('docs/mm-launch', read('docs/mm-acceptance/launch-preparation.json').sql_sha256); const e = snap('metadata', { columns: [{ table: 'q' }], constraints: [{ name: 'pk' }], policies: [{ policyname: 'p' }], triggers: [{ table: 'q' }], table_grants: [{ table_name: 'q' }], effective: [{ identity: 'f' }], rls: [{ table: 'q' }], buckets: [{ name: 'private' }], functions: Object.entries(states.rollback).map(([identity, definition]) => ({ identity, definition, owner: 'postgres', acl: '{postgres=X/postgres}' })) }); const a = structuredClone(e); a.project_ref = refs.production; a.database_identity = read('docs/mm-launch/project-bindings.json').bindings[refs.production]; a.data.functions = Object.entries(states.forward).map(([identity, definition]) => ({ identity, definition, owner: 'postgres', acl: '{postgres=X/postgres}' })); assert(metadata(a, e, states, 'before').ready); assert(!metadata(a, e, states, 'after').ready); });
test('production expected ACLs are exact and restored PUBLIC access fails', () => {
    const e = read('docs/mm-launch/production-after-contract.json');
    const a = structuredClone(e); a.captured_at = new Date().toISOString();
    const states = packageState('docs/mm-launch', read('docs/mm-acceptance/launch-preparation.json').sql_sha256);
    assert(metadata(a, e, states, 'after').ready);
    a.data.functions.find(f => f.identity === 'public.is_tutor()').acl = '{postgres=X/postgres,service_role=X/postgres,anon=X/postgres,authenticated=X/postgres,=X/postgres}';
    assert(!metadata(a, e, states, 'after').ready);
});
test('production installed-state CLI uses reviewed narrowed contract and rejects extra grants', () => temp(d => {
    const a = read('docs/mm-launch/production-after-contract.json'); a.captured_at = new Date().toISOString();
    const file = path.join(d, 'after.json'), args = ['metadata', '--actual', file, '--phase', 'after'];
    fs.writeFileSync(file, JSON.stringify(a)); assert.equal(run(args).status, 0);
    a.data.table_grants.push({ grantor: 'postgres', grantee: 'authenticated', table_catalog: 'postgres', table_schema: 'public', table_name: 'courses', privilege_type: 'TRIGGER', is_grantable: 'NO', with_hierarchy: 'NO' });
    fs.writeFileSync(file, JSON.stringify(a)); assert.equal(run(args).status, 1);
}));
import { inputDigest } from './mm-preflight/build.mjs';
test('build manifest binds assets and current inputs; content drift invalidates provenance', () => temp(d => { fs.writeFileSync(path.join(d, 'a.js'), `https://${ref}.supabase.co sb_publishable_fixture`); const args = ['assets', '--target', 'preview', '--dir', d], r = run(args); assert.equal(r.data.provenance.status, 'unverified'); fs.writeFileSync(path.join(d, 'mm-build-manifest.json'), JSON.stringify({ format: 1, source_commit: 'a'.repeat(40), project_ref: ref, input_digest: inputDigest(), artifact_digest: r.data.artifact_digest })); assert.equal(run(args).data.provenance.status, 'failing'); fs.appendFileSync(path.join(d, 'a.js'), ' changed'); assert.equal(run(args).data.provenance.status, 'failing'); }));
test('missing gates and mixed-project reports yield a nonzero report CLI exit', () => temp(d => { const r = run(['report', '--candidate', 'a'.repeat(40)]); assert.notEqual(r.status, 0); assert.equal(r.data.ready, false); assert.equal(r.data.checks.find(c => c.id === 'owner_launch_approval').status, 'blocked'); const a = bs(), b = bs(); a.project_ref = refs.production; fs.writeFileSync(path.join(d, 'a'), JSON.stringify(a)); fs.writeFileSync(path.join(d, 'b'), JSON.stringify(b)); assert.equal(run(['baseline', '--before', path.join(d, 'a'), '--after', path.join(d, 'b')]).status, 1); }));
test('fresh report wrappers cannot refresh stale source evidence', () => { const r = report([{ format: 1, kind: 'metadata', project_ref: ref, captured_at: new Date().toISOString(), evidence_at: '2020-01-01T00:00:00Z', checks: [] }], {}, 'a'.repeat(40)); assert.equal(r.checks.find(c => c.id === 'fresh:metadata').status, 'failing'); });
test('public text and SVG files are scanned and included in artifact digest', () => temp(d => { fs.writeFileSync(path.join(d, 'a.js'), `https://${ref}.supabase.co sb_publishable_fixture`); const args = ['assets', '--target', 'preview', '--dir', d], before = run(args).data.artifact_digest; fs.writeFileSync(path.join(d, 'leak.txt'), 'sb_secret_TEXT_FILE_TEST'); let r = run(args); assert.equal(r.status, 1); assert.notEqual(r.data.artifact_digest, before); assert(!r.stdout.includes('TEXT_FILE_TEST')); fs.unlinkSync(path.join(d, 'leak.txt')); fs.writeFileSync(path.join(d, 'image.svg'), 'https://lmuwsjjrqmmmtmxjvqln.supabase.co'); assert.equal(run(args).status, 1); }));
test('lookalike Supabase host cannot count as intended backend', () => temp(d => { fs.writeFileSync(path.join(d, 'a.js'), `https://${ref}.supabase.co.attacker.example sb_publishable_fixture`); assert.equal(run(['assets', '--target', 'preview', '--dir', d]).status, 1); }));
test('report output cannot overwrite its snapshot input', () => temp(d => { const f = path.join(d, 'before.json'); fs.writeFileSync(f, JSON.stringify(bs())); const original = fs.readFileSync(f, 'utf8'); const r = run(['baseline', '--before', f, '--after', f, '--out', f]); assert.equal(r.status, 1); assert.equal(fs.readFileSync(f, 'utf8'), original); }));
test('baseline scope is mandatory, UUID-validated, and exclusions need complete aggregates', () => { const a = bs(); delete a.scope; assert.throws(() => baseline(a, a)); const b = bs(); b.scope = { profiles: [] }; assert.throws(() => baseline(b, b)); const c = bs(); c.scope = { questions: ['f1111111-1111-4111-8111-111111111111'] }; assert.throws(() => baseline(c, c)); });
test('removing a failing function check cannot turn a failing metadata report ready', () => { const r = { format: 1, kind: 'metadata', project_ref: ref, captured_at: new Date().toISOString(), ready: false, checks: ['columns', 'constraints', 'policies', 'triggers', 'table_grants', 'effective', 'rls', 'buckets', 'function_count'].map(id => ({ id, status: 'passing', detail: 'fixture' })) }; const out = report([r], {}, 'a'.repeat(40)); assert(out.checks.some(c => c.id === 'consistent:metadata' && c.status === 'failing')); assert(out.checks.some(c => c.id === 'complete:metadata' && c.status === 'failing')); });
test('capture SQL checks a server-derived identity before returning a project label', () => { const q = captureSQL('metadata', refs.production); assert(q.includes('pg_control_system()')); assert(q.includes('7678071634733212629')); assert(q.indexOf('RAISE EXCEPTION') < q.indexOf('AS snapshot')); assert(q.includes('database_identity')); });
test('snapshot cannot be relabelled to a different project', () => { const a = bs(); a.project_ref = refs.production; assert.throws(() => baseline(a, a), /identity/); });
import { execFileSync } from 'node:child_process';
import { provenance, candidateDigest } from './mm-preflight/build.mjs';
test('provenance accepts a real clean candidate and rejects dirty or untracked source', () => temp(d => { const repo = path.join(d, 'repo'), dir = path.join(d, 'assets'); fs.mkdirSync(repo); fs.mkdirSync(dir); fs.writeFileSync(path.join(repo, 'app.js'), 'original'); execFileSync('git', ['init', '-q', repo]); execFileSync('git', ['-C', repo, 'add', '.']); execFileSync('git', ['-C', repo, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'fixture']); const commit = execFileSync('git', ['-C', repo, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); assert.equal(inputDigest(repo), candidateDigest(commit, repo)); const file = path.join(dir, 'mm-build-manifest.json'), digest = 'a'.repeat(64); fs.writeFileSync(file, JSON.stringify({ format: 1, source_commit: commit, project_ref: ref, input_digest: inputDigest(repo), artifact_digest: digest })); assert.equal(provenance(dir, digest, repo).status, 'passing'); fs.writeFileSync(path.join(repo, 'app.js'), 'modified'); assert.equal(provenance(dir, digest, repo).status, 'failing'); fs.writeFileSync(path.join(repo, 'app.js'), 'original'); fs.writeFileSync(path.join(repo, 'extra.js'), 'untracked'); assert.equal(provenance(dir, digest, repo).status, 'failing'); }));
test('storage baseline requires every known bucket, including empty buckets', () => { const a = bs(); a.data.storage = []; assert.throws(() => baseline(a, a)); });
test('complete synthetic installed-state report passes only with all external gates', () => {
    const e = read('docs/mm-launch/production-after-contract.json'), states = packageState('docs/mm-launch', read('docs/mm-acceptance/launch-preparation.json').sql_sha256), a = structuredClone(e);
    a.project_ref = refs.production;
    a.database_identity = read('docs/mm-launch/project-bindings.json').bindings[refs.production];
    a.captured_at = new Date().toISOString();
    const m = metadata(a, e, states, 'after'), b = bs();
    b.project_ref = refs.production;
    b.database_identity = a.database_identity;
    const asset = { format: 1, kind: 'assets', project_ref: refs.production, source_commit: 'a'.repeat(40), captured_at: new Date().toISOString(), ready: true, provenance: { status: 'passing' }, checks: ['build_manifest', 'files', 'backend', 'public_key', 'secrets'].map(id => ({ id, status: 'passing', detail: 'controlled fixture' })) };
    const reports = [asset, m, baseline(b, b), review(a, states, 'rollback')], gates = Object.fromEntries(['production_auth', 'smtp', 'database_backup', 'storage_backup', 'restore_rehearsal', 'production_build_settings', 'rollback_version', 'owner_launch_approval', 'device_time_acceptance', 'security_acceptance', 'enrolment_behavior', 'production_smoke_scope'].map(n => [n, { status: 'passing', evidence: 'Synthetic test evidence only' }]));
    assert(report(reports, gates, 'a'.repeat(40)).ready);
    delete gates.owner_launch_approval;
    assert(!report(reports, gates, 'a'.repeat(40)).ready);
    m.checks = m.checks.filter(c => !c.id.startsWith('definition:'));
    assert.equal(report(reports, gates, 'a'.repeat(40)).checks.find(c => c.id === 'complete:metadata').status, 'failing');
});
test('snapshot normalization accepts guarded SQL JSON but rejects wrong identity/project', () => temp(d => { const raw = path.join(d, 'raw.json'); fs.writeFileSync(raw, JSON.stringify([{ snapshot: bs() }])); const args = ['snapshot', '--input', raw, '--kind', 'baseline', '--project-ref', ref]; assert.equal(run(args).status, 0); assert.equal(run([...args.slice(0, -1), refs.production]).status, 1); const s = bs(); s.database_identity.system_identifier = '0'; fs.writeFileSync(raw, JSON.stringify([{ snapshot: s }])); assert.equal(run(args).status, 1); }));
test('preview artifacts cannot be reported as an official production release', () => { const r = report([{ format: 1, kind: 'assets', project_ref: ref, captured_at: new Date().toISOString(), ready: true, source_commit: 'a'.repeat(40), provenance: { status: 'passing' }, checks: ['build_manifest', 'files', 'backend', 'public_key', 'secrets'].map(id => ({ id, status: 'passing' })) }], {}, 'a'.repeat(40)); assert.equal(r.checks.find(c => c.id === 'release_target').status, 'blocked'); });
test('additional unresolved owner gates are not silently ignored', () => { const r = report([], { owner_custom_check: { status: 'blocked', evidence: 'Additional owner condition' } }, 'a'.repeat(40)); assert.equal(r.checks.find(c => c.id === 'owner_custom_check')?.status, 'blocked'); });
test('report independently rejects a nonexistent candidate instead of trusting a saved asset label', () => { const r = run(['report', '--candidate', 'a'.repeat(40)]); assert.equal(r.data.checks.find(c => c.id === 'candidate_inputs')?.status, 'failing'); });
import { candidateIntegrity } from './mm-preflight/build.mjs';
test('release candidate binds protected contracts as well as application inputs', () => temp(d => { const files = ['app.js', 'docs/mm-launch/metadata-contract.json', 'docs/mm-launch/project-bindings.json', 'docs/mm-acceptance/launch-preparation.json', 'docs/mm-launch/review-conflicts.forward.sql', 'docs/mm-launch/review-conflicts.rollback.sql', 'docs/mm-launch/production-after-contract.json', 'docs/mm-launch/owner-content.forward.sql', 'docs/mm-launch/owner-content.rollback.sql', 'docs/mm-launch/security-privileges.forward.sql', 'docs/mm-launch/security-privileges.rollback.sql']; for (const f of files) {
    fs.mkdirSync(path.dirname(path.join(d, f)), { recursive: true });
    fs.writeFileSync(path.join(d, f), 'fixture');
} execFileSync('git', ['init', '-q', d]); execFileSync('git', ['-C', d, 'add', '.']); execFileSync('git', ['-C', d, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'fixture']); const commit = execFileSync('git', ['-C', d, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); assert(candidateIntegrity(commit, d)); for (const f of files.slice(1)) { fs.appendFileSync(path.join(d, f), ' changed'); assert.equal(candidateIntegrity(commit, d), false, f); fs.writeFileSync(path.join(d, f), 'fixture'); } }));

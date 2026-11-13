import fs from 'node:fs';
import crypto from 'node:crypto';
export const refs = { preview: 'lcddnpafrkbwsrhqexqe', production: 'lmuwsjjrqmmmtmxjvqln' };
export const hash = x => crypto.createHash('sha256').update(x).digest('hex');
export const norm = x => x.replaceAll('\r', '');
export function canonical(x) {
    if (Array.isArray(x))
        return JSON.stringify(x.map(v => JSON.parse(canonical(v))).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))));
    if (x && typeof x === 'object')
        return JSON.stringify(Object.fromEntries(Object.keys(x).sort().map(k => [k, JSON.parse(canonical(x[k]))])));
    return JSON.stringify(x);
}
export function result(kind, project_ref, checks, extra = {}) { const summary = Object.fromEntries(['passing', 'failing', 'blocked', 'unverified'].map(status => [status, checks.filter(c => c.status === status).length])); return { format: 1, kind, project_ref, captured_at: new Date().toISOString(), ...extra, ready: checks.length > 0 && checks.every(c => c.status === 'passing'), summary, checks }; }
export const check = (id, pass, detail) => ({ id, status: pass ? 'passing' : 'failing', detail });
export function read(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
export const projectBindings = read(new URL('../../docs/mm-launch/project-bindings.json', import.meta.url)).bindings;
export function validateScope(scope) {
    if (!scope || typeof scope !== 'object' || Array.isArray(scope))
        throw Error('Fixture scope required');
    for (const [key, ids] of Object.entries(scope))
        if (!['courses', 'modules', 'lessons', 'questions'].includes(key) || !Array.isArray(ids) || new Set(ids).size !== ids.length || ids.some(id => typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)))
            throw Error('Invalid fixture scope');
}
export function snapshot(s, kind) {
    if (s?.format !== 1 || s.kind !== kind || !Object.values(refs).includes(s.project_ref) || !s.data || !Number.isFinite(Date.parse(s.captured_at)))
        throw Error('Invalid ' + kind + ' snapshot');
    if (canonical(s.database_identity) !== canonical(projectBindings[s.project_ref]))
        throw Error('Database identity mismatch');
    validateScope(s.scope);
    return s;
}
export function fresh(s, maxAge = 3600) { const age = (Date.now() - Date.parse(s.captured_at)) / 1000; return age >= -60 && age <= maxAge; }
export function packageState(dir, pins) {
    const files = {};
    for (const direction of ['forward', 'rollback']) {
        const name = 'review-conflicts.' + direction + '.sql', raw = fs.readFileSync(dir + '/' + name, 'utf8');
        if (hash(raw) !== pins[name])
            throw Error('SQL package checksum drift: ' + name);
        const guards = [...raw.matchAll(/pg_get_functiondef\('([^']+)'::regprocedure\), chr\(13\), ''\) IS DISTINCT FROM \$mm_expected\$([\s\S]*?)\$mm_expected\$/g)];
        if (guards.length !== 2)
            throw Error('Expected two definition guards');
        files[direction] = Object.fromEntries(guards.map(m => [m[1].replace(/,\s*/g, ','), norm(m[2])]));
    }
    return files;
}
export function metadata(actual, expected, states, phase = 'before', maxAge = 3600) {
    snapshot(actual, 'metadata');
    snapshot(expected, 'metadata');
    if (!['before', 'after'].includes(phase))
        throw Error('Invalid metadata phase');
    const checks = [check('freshness', fresh(actual, maxAge), 'Snapshot age must be within configured window')];
    for (const k of ['columns', 'constraints', 'policies', 'triggers', 'table_grants', 'effective', 'rls', 'buckets']) {
        if (!Array.isArray(expected.data[k]) || !Array.isArray(actual.data[k]))
            throw Error('Missing metadata section ' + k);
        if (expected.data[k].length === 0)
            throw Error('Empty expected metadata ' + k);
        checks.push(check(k, canonical(actual.data[k]) === canonical(expected.data[k]), k + ' comparison'));
        if (canonical(actual.data[k]) !== canonical(expected.data[k])) {
            const identity = x => k === 'columns' ? x.table + '.' + x.column : k === 'policies' ? x.schemaname + '.' + x.tablename + '.' + x.policyname : k === 'table_grants' ? x.table_name + ':' + x.grantee + ':' + x.privilege_type : k === 'triggers' ? x.table + ':' + (x.definition?.match(/TRIGGER (\w+)/)?.[1] || 'trigger') : x.identity || x.table || x.name;
            const am = new Map(actual.data[k].map(x => [identity(x), x])), em = new Map(expected.data[k].map(x => [identity(x), x]));
            for (const id of new Set([...am.keys(), ...em.keys()]))
                if (canonical(am.get(id)) !== canonical(em.get(id)))
                    checks.push(check(k + ':' + id, false, !am.has(id) ? 'Missing entry' : !em.has(id) ? 'Unexpected entry' : 'Changed fields: ' + Object.keys({ ...am.get(id), ...em.get(id) }).filter(f => canonical(am.get(id)[f]) !== canonical(em.get(id)[f])).join(', ')));
        }
    }
    const af = actual.data.functions, ef = expected.data.functions;
    if (!Array.isArray(af) || !Array.isArray(ef) || ef.length === 0)
        throw Error('Missing function metadata');
    const map = new Map(af.map(f => [f.identity, f]));
    checks.push(check('function_count', map.size === ef.length && af.length === ef.length, 'Unique signatures/count'));
    for (const e of ef) {
        const a = map.get(e.identity);
        if (!a) {
            checks.push(check('function:' + e.identity, false, 'Missing function'));
            continue;
        }
        let want = norm(e.definition);
        if (actual.project_ref === refs.production && phase === 'before' && states.forward[e.identity])
            want = states.forward[e.identity];
        checks.push(check('definition:' + e.identity, norm(a.definition) === want, 'Exact definition (line endings normalized)'));
        checks.push(check('owner:' + e.identity, a.owner === e.owner, 'Function owner'));
        const acl = x => (x || '').replace(/[{}]/g, '').split(',').filter(Boolean).sort();
        const ac = acl(a.acl), ec = acl(e.acl);
        if (actual.project_ref === refs.production && expected.project_ref === refs.preview && ['public.is_tutor()', 'public.enrolled_in(uuid)', 'public.can_read_lesson(uuid)', 'public.create_profile()'].includes(e.identity))
            ec.push('=X/postgres');
        checks.push(check('acl:' + e.identity, canonical(ac) === canonical([...new Set(ec)]), 'Explicit ACL, including reviewed PUBLIC difference'));
    }
    return result('metadata', actual.project_ref, checks, { phase, evidence_at: actual.captured_at, contract_digest: hash(canonical(expected.data)) });
}
export function baseline(before, after, approvals = [], maxAge = 3600) {
    snapshot(before, 'baseline');
    snapshot(after, 'baseline');
    if (before.project_ref !== after.project_ref)
        throw Error('Baseline project mismatch');
    if (canonical(before.scope) !== canonical(after.scope))
        throw Error('Fixture exclusion scope changed');
    if (Date.parse(before.captured_at) > Date.parse(after.captured_at))
        throw Error('Baseline order reversed');
    for (const s of [before, after]) {
        if (!Array.isArray(s.data.storage) || canonical(s.data.storage.map(x => x.entity)) !== canonical(['question-images', 'lesson-images', 'lesson-resources']))
            throw Error('Incomplete storage baseline');
        const rows = s.data.content;
        if (!Array.isArray(rows) || canonical(rows.map(x => x.entity)) !== canonical(['courses', 'modules', 'lessons', 'questions']))
            throw Error('Incomplete content baseline');
        for (const row of [...rows, ...(s.data.storage || [])])
            if (!Number.isInteger(row.rows) || row.rows < 0 || !/^[a-f0-9]{32}$/.test(row.digest))
                throw Error('Invalid aggregate');
    }
    for (const s of [before, after])
        if (Object.values(s.scope).some(ids => ids.length)) {
            if (!Array.isArray(s.data.excluded) || canonical(s.data.excluded.map(x => x.entity)) !== canonical(['courses', 'modules', 'lessons', 'questions']))
                throw Error('Excluded aggregates required');
            for (const row of s.data.excluded)
                if (!Number.isInteger(row.rows) || row.rows < 0 || row.rows > (s.scope[row.entity] || []).length || !/^[a-f0-9]{32}$/.test(row.digest))
                    throw Error('Invalid excluded aggregate');
        }
    const checks = [check('freshness', fresh(after, maxAge), 'After snapshot age')];
    for (const group of ['content', 'storage']) {
        if (!Array.isArray(before.data[group]) || !Array.isArray(after.data[group]))
            throw Error('Missing baseline ' + group);
        const bm = new Map(before.data[group].map(x => [x.entity, x])), am = new Map(after.data[group].map(x => [x.entity, x]));
        if (bm.size !== before.data[group].length || am.size !== after.data[group].length)
            throw Error('Duplicate baseline entity');
        for (const key of new Set([...bm.keys(), ...am.keys()])) {
            const b = bm.get(key), a = am.get(key);
            const approved = approvals.some(x => x.group === group && x.entity === key && typeof x.reason === 'string' && x.reason.trim() && canonical(x.before) === canonical(b) && canonical(x.after) === canonical(a));
            checks.push(check(group + ':' + key, !!b && !!a && (canonical(b) === canonical(a) || approved), approved ? 'Exact before/after change explicitly approved' : 'Count/digest comparison'));
        }
    }
    if (!after.data.missing_refs || Object.keys(after.data.missing_refs).length !== 4)
        throw Error('Missing resource integrity counts');
    for (const [key, n] of Object.entries(after.data.missing_refs))
        checks.push(check('resource:' + key, Number.isInteger(n) && n === 0, 'Missing referenced objects'));
    return result('baseline', after.project_ref, checks, { evidence_at: after.captured_at, scope: after.scope, excluded: after.data.excluded || [], note: 'Excluded fixture records are reported separately; approvals bind exact before/after aggregates. Digests are not backups.' });
}
export function review(actual, states, direction, maxAge = 3600) {
    snapshot(actual, 'metadata');
    if (!states[direction])
        throw Error('Invalid direction');
    const map = new Map(actual.data.functions.map(f => [f.identity, norm(f.definition)]));
    return result('review', actual.project_ref, [check('freshness', fresh(actual, maxAge), 'Snapshot age'), ...Object.entries(states[direction]).map(([id, def]) => check('guard:' + id, map.get(id) === def, 'Read-only ' + direction + ' precondition; no SQL executed'))], { direction, evidence_at: actual.captured_at });
}
export const gateNames = ['production_auth', 'smtp', 'database_backup', 'storage_backup', 'restore_rehearsal', 'production_build_settings', 'rollback_version', 'owner_launch_approval', 'device_time_acceptance', 'security_acceptance', 'enrolment_behavior', 'production_smoke_scope'];
export function report(reports, gates, candidate, maxAge = 3600) {
    if (!candidate)
        throw Error('Candidate commit required');
    const checks = [];
    const byKind = new Map();
    for (const r of reports) {
        if (!r || r.format !== 1 || !Array.isArray(r.checks) || !['assets', 'metadata', 'baseline', 'review'].includes(r.kind) || byKind.has(r.kind))
            throw Error('Invalid or duplicate report');
        const required = { assets: ['build_manifest', 'files', 'backend', 'public_key', 'secrets'], metadata: ['columns', 'constraints', 'policies', 'triggers', 'table_grants', 'effective', 'rls', 'buckets', 'function_count'], baseline: ['storage:question-images', 'storage:lesson-images', 'storage:lesson-resources', 'content:courses', 'content:modules', 'content:lessons', 'content:questions', 'resource:questions', 'resource:notes', 'resource:examples', 'resource:resources'], review: ['guard:public.note_mistake_review_help(uuid,uuid)', 'guard:public.submit_mistake_review(uuid,uuid,uuid,integer,text,boolean,bigint,jsonb)'] };
        const contract = read(new URL(r.kind === 'metadata' && r.project_ref === refs.production && r.phase === 'after' ? '../../docs/mm-launch/production-after-contract.json' : '../../docs/mm-launch/metadata-contract.json', import.meta.url));
        if (r.kind === 'metadata') {
            required.metadata.push(...contract.data.functions.flatMap(f => ['definition:', 'owner:', 'acl:'].map(prefix => prefix + f.identity)));
            checks.push(check('contract', r.contract_digest === hash(canonical(contract.data)), 'Reviewed metadata contract identity'));
        }
        checks.push(check('consistent:' + r.kind, typeof r.ready === 'boolean' && r.ready === r.checks.every(c => c.status === 'passing'), 'Input readiness agrees with its checks'));
        checks.push(check('complete:' + r.kind, Object.values(refs).includes(r.project_ref) && required[r.kind].every(id => r.checks.some(c => c.id === id)), 'Required report checks present'));
        byKind.set(r.kind, r);
        checks.push(check('fresh:' + r.kind, fresh({ ...r, captured_at: r.evidence_at || r.captured_at }, maxAge), 'Source evidence age'));
        for (const c of r.checks) {
            if (!['passing', 'failing', 'blocked', 'unverified'].includes(c.status))
                throw Error('Invalid check status');
            checks.push({ ...c, id: r.kind + ':' + c.id });
        }
    }
    for (const k of ['assets', 'metadata', 'baseline', 'review'])
        if (!byKind.has(k))
            checks.push({ id: k, status: 'blocked', detail: 'Required report missing' });
    if (byKind.get('metadata')?.project_ref === refs.production && !(byKind.get('metadata')?.phase === 'after' && byKind.get('review')?.direction === 'rollback'))
        checks.push({ id: 'backend_release_state', status: 'blocked', detail: 'Production change is not verified installed; preparation evidence only' });
    const asset = byKind.get('assets');
    if (asset) {
        checks.push(asset.project_ref === refs.production ? check('release_target', true, 'Retained production project selected') : { id: 'release_target', status: 'blocked', detail: 'Preview evidence cannot authorize official production release' });
        checks.push({ id: 'asset_provenance', status: asset.provenance?.status || 'unverified', detail: 'Build manifest and current input/artifact digests' });
        checks.push(asset.source_commit ? check('candidate', asset.source_commit === candidate, 'Built asset candidate identity') : { id: 'candidate', status: 'blocked', detail: 'No verified build manifest' });
        for (const r of reports)
            checks.push(check('project:' + r.kind, r.project_ref === asset.project_ref, 'Same project across evidence'));
    }
    for (const name of new Set([...gateNames, ...Object.keys(gates || {})])) {
        const g = gates?.[name];
        checks.push(g && ['passing', 'failing', 'blocked', 'unverified'].includes(g.status) && typeof g.evidence === 'string' && g.evidence.trim() ? { id: name, status: g.status, detail: g.evidence } : { id: name, status: 'blocked', detail: 'Evidence missing' });
    }
    return result('readiness', asset?.project_ref || null, checks, { candidate, note: 'Local evidence report, not launch authorization or deployment attestation.' });
}

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { hash, refs } from './core.mjs';
const included = f => f && !f.startsWith('docs/') && f !== 'README.md';
export function inputDigest(cwd = process.cwd()) {
    const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd, encoding: 'utf8' }).split('\0').filter(included).sort();
    return hash(JSON.stringify(files.map(f => {
        if (fs.lstatSync(path.join(cwd, f)).isSymbolicLink())
            throw Error('Symlink build input');
        return [f, hash(fs.readFileSync(path.join(cwd, f)))];
    })));
}
export function candidateDigest(commit, cwd = process.cwd()) {
    if (!/^[a-f0-9]{40}$/.test(commit) || execFileSync('git', ['cat-file', '-t', commit], { cwd, encoding: 'utf8' }).trim() !== 'commit')
        throw Error('Unknown candidate commit');
    const files = execFileSync('git', ['ls-tree', '-r', '-z', '--full-tree', commit], { cwd, encoding: 'utf8' }).split('\0').filter(Boolean).map(row => { const i = row.indexOf('\t'); return { header: row.slice(0, i), name: row.slice(i + 1) }; }).filter(x => included(x.name));
    const entries = files.map(x => {
        const match = /^(100644|100755) blob ([a-f0-9]{40})$/.exec(x.header);
        if (!match)
            throw Error('Unsupported candidate input');
        return [x.name, hash(execFileSync('git', ['cat-file', 'blob', match[2]], { cwd, maxBuffer: 50 * 1024 * 1024 }))];
    });
    entries.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
    return hash(JSON.stringify(entries));
}
export function provenance(dir, digest, cwd = process.cwd()) {
    const file = path.join(dir, 'mm-build-manifest.json');
    try {
        const m = JSON.parse(fs.readFileSync(file, 'utf8'));
        return m.format === 1 && m.artifact_digest === digest && m.input_digest === inputDigest(cwd) && m.input_digest === candidateDigest(m.source_commit, cwd) && Object.values(refs).includes(m.project_ref) ? { status: 'passing', source_commit: m.source_commit, project_ref: m.project_ref } : { status: 'failing' };
    }
    catch {
        return { status: fs.existsSync(file) ? 'failing' : 'unverified' };
    }
}
export function build(target, scan) {
    if (!refs[target])
        throw Error('Invalid target');
    if (target === 'production' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY))
        throw Error('Explicit production build settings required');
    const source_commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), before = inputDigest();
    if (before !== candidateDigest(source_commit))
        throw Error('Commit build inputs before building');
    execFileSync('pnpm', ['build'], { env: { ...process.env, NEXT_PUBLIC_LMS_TARGET: target, CLOUDFLARE_CF_FETCH_ENABLED: 'false', WRANGLER_SEND_METRICS: 'false' }, stdio: 'pipe', maxBuffer: 20 * 1024 * 1024 });
    if (before !== inputDigest())
        throw Error('Build input drift');
    const dir = 'dist/client';
    fs.rmSync(path.join(dir, 'mm-build-manifest.json'), { force: true });
    const r = scan(dir, target);
    if (!r.ready)
        throw Error('Artifact scan failed');
    fs.writeFileSync(path.join(dir, 'mm-build-manifest.json'), JSON.stringify({ format: 1, source_commit, project_ref: refs[target], input_digest: before, artifact_digest: r.artifact_digest }));
    return scan(dir, target);
}
export function candidateIntegrity(commit, cwd = process.cwd()) { if (inputDigest(cwd) !== candidateDigest(commit, cwd))
    return false; for (const f of ['docs/mm-launch/metadata-contract.json', 'docs/mm-launch/production-after-contract.json', 'docs/mm-launch/project-bindings.json', 'docs/mm-acceptance/launch-preparation.json', 'docs/mm-launch/review-conflicts.forward.sql', 'docs/mm-launch/review-conflicts.rollback.sql', 'docs/mm-launch/owner-content.forward.sql', 'docs/mm-launch/owner-content.rollback.sql', 'docs/mm-launch/security-privileges.forward.sql', 'docs/mm-launch/security-privileges.rollback.sql']) {
    const blob = execFileSync('git', ['show', commit + ':' + f], { cwd, maxBuffer: 50 * 1024 * 1024 });
    if (hash(blob) !== hash(fs.readFileSync(path.join(cwd, f))))
        return false;
} return true; }

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { provenance } from './build.mjs';
import { refs, result, check, hash } from './core.mjs';
export function assets(dir, target) {
    if (!refs[target])
        throw Error('Expected target preview or production');
    const chunks = [], entries = [];
    const problems = [];
    function walk(p) {
        for (const e of fs.readdirSync(p, { withFileTypes: true })) {
            const f = path.join(p, e.name);
            if (e.isSymbolicLink())
                throw Error('Symlink in browser artifact');
            if (e.isDirectory()) {
                walk(f);
                continue;
            }
            if (e.name.startsWith('.env'))
                problems.push('Environment file in browser output');
            if (e.name === 'mm-build-manifest.json')
                continue;
            const b = fs.readFileSync(f);
            let decoded = b;
            if (e.name.endsWith('.gz'))
                decoded = zlib.gunzipSync(b, { maxOutputLength: 50 * 1024 * 1024 });
            if (e.name.endsWith('.br'))
                decoded = zlib.brotliDecompressSync(b, { maxOutputLength: 50 * 1024 * 1024 });
            chunks.push(decoded.toString('utf8'));
            entries.push([path.relative(dir, f).split(path.sep).join('/'), hash(b)]);
        }
    }
    walk(dir);
    let expected = false, publicKey = false;
    const foreign = new Set();
    for (const raw of chunks) {
        const s = raw.replaceAll('\\/', '/').replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\x([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
        for (const m of s.matchAll(/([a-z0-9-]+)\.supabase\.co([a-z0-9.-]*)/gi)) {
            if (m[1] === refs[target] && m[2] === '')
                expected = true;
            else
                foreign.add(m[1]);
        }
        if (/sb_secret_[A-Za-z0-9_-]+/.test(s))
            problems.push('Secret key prefix found');
        if (/sb_publishable_[A-Za-z0-9_-]+/.test(s))
            publicKey = true;
        for (const m of s.matchAll(/(?:[A-Za-z0-9_-]{8,})\.([A-Za-z0-9_-]{8,})\.(?:[A-Za-z0-9_-]{8,})/g)) {
            try {
                const payload = JSON.parse(Buffer.from(m[1], 'base64url'));
                if (payload && typeof payload === 'object') {
                    if (payload.role === 'anon' && payload.ref === refs[target])
                        publicKey = true;
                    else
                        problems.push('Nonmatching or non-public JWT found');
                }
            }
            catch { }
        }
    }
    const digest = hash(JSON.stringify(entries.sort())), proof = provenance(dir, digest);
    if (proof.status === 'passing' && proof.project_ref !== refs[target])
        proof.status = 'failing';
    return result('assets', refs[target], [check('build_manifest', proof.status !== 'failing', 'Manifest absent is unverified; present manifest must match committed inputs/artifacts'), check('files', entries.length > 0, 'Browser files scanned: ' + entries.length), check('backend', expected && foreign.size === 0, 'Intended hostname present; unexpected project count: ' + foreign.size), check('public_key', publicKey, 'Publishable/ matching legacy anon key present'), check('secrets', problems.length === 0, 'Exposure findings: ' + problems.length)], { source_commit: proof.source_commit || null, provenance: proof, artifact_digest: digest, note: 'Opaque publishable-key binding and deployment provenance require separate verification. Scanner covers literal/escaped text and gzip/brotli, not arbitrary obfuscation.' });
}

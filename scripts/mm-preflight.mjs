#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assets } from './mm-preflight/assets.mjs';
import { read, result, metadata, baseline, review, report, packageState, snapshot, check } from './mm-preflight/core.mjs';
import { build, candidateIntegrity } from './mm-preflight/build.mjs';
import { captureSQL } from './mm-preflight/sql.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [command, ...args] = process.argv.slice(2), o = {};
try {
    if (fs.realpathSync(process.cwd()) !== fs.realpathSync(root))
        throw Error('Run from repository root');
    for (let i = 0; i < args.length; i += 2) {
        if (!args[i].startsWith('--') || args[i + 1] === undefined)
            throw Error('Flags require values');
        const key = args[i].slice(2);
        if (key in o)
            throw Error('Duplicate flag');
        o[key] = args[i + 1];
    }
    const allowed = { snapshot: ['input', 'kind', 'project-ref', 'out'], build: ['target', 'out'], assets: ['dir', 'target', 'out'], sql: ['kind', 'project-ref', 'fixtures'], metadata: ['input', 'actual', 'expected', 'phase', 'sql-dir', 'out', 'max-age-seconds'], baseline: ['before', 'after', 'approvals', 'out', 'max-age-seconds'], review: ['actual', 'direction', 'sql-dir', 'out', 'max-age-seconds'], report: ['reports', 'gates', 'candidate', 'out', 'max-age-seconds'] };
    if (!allowed[command] || Object.keys(o).some(k => !allowed[command].includes(k)))
        throw Error('Unknown command/flag');
    if (o.out) {
        const output = path.resolve(o.out), inputs = ['actual', 'expected', 'before', 'after', 'approvals', 'gates', 'fixtures'].filter(k => o[k]).map(k => path.resolve(o[k]));
        if (o.reports)
            inputs.push(...o.reports.split(',').map(p => path.resolve(p)));
        if (inputs.includes(output))
            throw Error('Output would overwrite evidence');
        if (['assets', 'build'].includes(command)) {
            const dir = path.resolve(command === 'build' ? 'dist/client' : o.dir);
            if (output === dir || output.startsWith(dir + path.sep))
                throw Error('Output must be outside browser assets');
        }
    }
    let r;
    const age = o['max-age-seconds'] === undefined ? 3600 : Number(o['max-age-seconds']);
    if (!Number.isFinite(age) || age <= 0)
        throw Error('Invalid freshness window');
    const states = () => packageState(o['sql-dir'] || root + '/docs/mm-launch', read(root + '/docs/mm-acceptance/launch-preparation.json').sql_sha256);
    if (command === 'snapshot') {
        let value = read(o.input);
        if (Array.isArray(value) && value.length === 1)
            value = value[0].snapshot;
        if (value?.snapshot)
            value = value.snapshot;
        snapshot(value, o.kind);
        if (value.project_ref !== o['project-ref'])
            throw Error('Wrong project');
        const text = JSON.stringify(value, null, 2) + '\n';
        if (o.out)
            fs.writeFileSync(o.out, text);
        process.stdout.write(text);
        process.exit(0);
    }
    if (command === 'build')
        r = build(o.target, assets);
    else if (command === 'assets')
        r = assets(o.dir, o.target);
    else if (command === 'sql') {
        process.stdout.write(captureSQL(o.kind, o['project-ref'], o.fixtures ? read(o.fixtures) : {}) + '\n');
        process.exit(0);
    }
    else if (command === 'metadata') {
        const actual = read(o.actual), phase = o.phase || 'before';
        const expected = o.expected || root + '/docs/mm-launch/' + (actual.project_ref === 'lmuwsjjrqmmmtmxjvqln' && phase === 'after' ? 'production-after-contract.json' : 'metadata-contract.json');
        r = metadata(actual, read(expected), states(), phase, age);
    }
    else if (command === 'baseline')
        r = baseline(read(o.before), read(o.after), o.approvals ? read(o.approvals) : [], age);
    else if (command === 'review')
        r = review(read(o.actual), states(), o.direction || 'forward', age);
    else if (command === 'report') {
        states();
        r = report((o.reports || '').split(',').filter(Boolean).map(read), o.gates ? read(o.gates) : {}, o.candidate, age);
        let integrity = false;
        try {
            integrity = candidateIntegrity(o.candidate);
        }
        catch { }
        r = result(r.kind, r.project_ref, [...r.checks, check('candidate_inputs', integrity, 'Candidate Git tree and protected metadata/SQL contracts match current files')], { candidate: r.candidate, note: r.note });
    }
    else
        throw Error('Unknown command; use assets, sql, metadata, baseline, review or report');
    const output = JSON.stringify(r, null, 2) + '\n';
    if (o.out)
        fs.writeFileSync(o.out, output);
    process.stdout.write(command === 'report' ? JSON.stringify({ ...r, checks: r.checks.filter(c => c.status !== 'passing'), note: 'Console omits passing checks; --out preserves full evidence. Not launch authorization.' }, null, 2) + '\n' : output);
    process.exitCode = r.checks.some(c => c.status === 'failing') ? 1 : r.ready ? 0 : 2;
}
catch (e) {
    const r = result(command || 'input', null, [{ id: 'input', status: 'failing', detail: 'Invalid input, unreadable evidence, or drifted package. No action performed.' }]);
    process.stdout.write(JSON.stringify(r) + '\n');
    process.exitCode = 1;
}

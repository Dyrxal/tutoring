import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const script = 'scripts/check-mm-local-database.mjs';
const run = args => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });

test('local rehearsal refuses hosted database arguments before launching containers', () => {
    const r = run(['--db-url', 'postgresql://example.invalid/postgres']);
    assert.equal(r.status, 1);
    const result = JSON.parse(r.stdout);
    assert.equal(result.summary.passing, 0);
    assert.match(result.checks[0].detail, /no database URL or external target accepted/);
});

test('local rehearsal refuses to overwrite an existing evidence file', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mm-cli-'));
    try {
        const file = path.join(dir, 'evidence.json'), original = '{"owner":"existing evidence"}\n';
        fs.writeFileSync(file, original);
        const r = run(['--out', file]);
        assert.equal(r.status, 1);
        assert.match(JSON.parse(r.stdout).checks[0].detail, /Use a new output path/);
        assert.equal(fs.readFileSync(file, 'utf8'), original);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('local rehearsal refuses evidence output in browser build artifacts', () => {
    for (const dir of ['dist','public']) {
        const file = path.resolve(dir, 'mm-forbidden-' + process.pid + '.json');
        const r = run(['--out', file]);
        assert.equal(r.status, 1);
        assert.match(JSON.parse(r.stdout).checks[0].detail, /Report must not be public/);
        assert.equal(fs.existsSync(file), false);
    }
});

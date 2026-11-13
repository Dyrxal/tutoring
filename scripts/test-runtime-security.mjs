import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = createRequire(import.meta.url);
const consumers = [
  ['application', root],
  ['Vinext', createRequire(import.meta.resolve('vinext'))],
];

// The plugin vendors executable RSC code: a production-only package audit omits it.
// Fail closed if a plugin changes layout so the bundled runtime needs a new review.
for (const [name, consumer] of consumers) {
  test(`${name} bundles a patched, compatible React server runtime`, () => {
    const plugin = consumer.resolve('@vitejs/plugin-rsc/package.json');
    const directory = path.dirname(plugin);
    const vendor = [
      'vendor/react-server-dom-webpack/package.json',
      'dist/vendor/react-server-dom/package.json',
    ].map(file => path.join(directory, file)).find(existsSync);
    assert.ok(vendor, 'Locate and review the plugin bundled React server runtime');
    const bundled = JSON.parse(readFileSync(vendor, 'utf8'));
    assert.match(bundled.version, /^\d+\.\d+\.\d+$/, 'Use a reviewed stable RSC release');
    const [major, minor, patch] = bundled.version.split('.').map(Number);
    assert.ok(major > 19 || major === 19 && (minor > 2 || minor === 2 && patch >= 9),
      `Bundled RSC ${bundled.version} is below the GHSA-xqc2-xf4c-x3h3 patched floor`);
    const peer = createRequire(plugin);
    for (const dependency of ['react', 'react-dom', 'react-server-dom-webpack']) {
      const installed = JSON.parse(readFileSync(peer.resolve(dependency + '/package.json'), 'utf8'));
      assert.equal(installed.version, bundled.version, `${dependency} must match the bundled RSC runtime`);
    }
  });
}

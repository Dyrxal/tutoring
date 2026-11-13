import assert from 'node:assert/strict';
import test from 'node:test';
import { httpsRedirectUrl } from '../lib/https-redirect.ts';

for (const [name, input, expected] of [
  ['apex sign-in upgrades to HTTPS', 'http://notationeducation.online/', 'https://notationeducation.online/'],
  ['www sign-in upgrades to HTTPS', 'http://www.notationeducation.online/', 'https://www.notationeducation.online/'],
  ['absolute apex DNS name upgrades to canonical HTTPS', 'http://notationeducation.online./', 'https://notationeducation.online/'],
  ['absolute www DNS name upgrades to canonical HTTPS', 'http://www.notationeducation.online./?auth=recovery', 'https://www.notationeducation.online/?auth=recovery'],
  ['recovery callback retains query and fragment', 'http://www.notationeducation.online/?auth=recovery#type=recovery', 'https://www.notationeducation.online/?auth=recovery#type=recovery'],
  ['paths and encoded parameters survive', 'http://notationeducation.online/lesson/one?next=%2Fchapter%3Fa%3D1', 'https://notationeducation.online/lesson/one?next=%2Fchapter%3Fa%3D1'],
  ['nonstandard HTTP port becomes standard HTTPS', 'http://www.notationeducation.online:8080/', 'https://www.notationeducation.online/'],
  ['credentials are excluded from redirect destinations', 'http://name:secret@www.notationeducation.online/', 'https://www.notationeducation.online/'],
  ['secure apex does not loop', 'https://notationeducation.online/', null],
  ['secure www does not loop', 'https://www.notationeducation.online/?auth=recovery', null],
  ['localhost development remains HTTP', 'http://localhost:5173/', null],
  ['loopback Worker tests remain HTTP', 'http://127.0.0.1:8797/', null],
  ['preview address is unaffected', 'http://feat-mm-cloudflare-migration-notation-education-lms.drisyantshrestha.workers.dev/', null],
  ['hostname lookalike cannot redirect', 'http://www.notationeducation.online.attacker.invalid/', null],
  ['userinfo does not disguise another hostname', 'http://notationeducation.online@attacker.invalid/', null],
  ['other protocols are unaffected', 'ftp://www.notationeducation.online/', null],
  ['invalid URL has no redirect', 'not a URL', null],
]) {
  test(name, () => assert.equal(httpsRedirectUrl(input), expected));
}

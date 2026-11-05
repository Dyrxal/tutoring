import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveBackendConfig} from '../lib/backend-config.ts';
const prod='https://lmuwsjjrqmmmtmxjvqln.supabase.co';
const preview='https://lcddnpafrkbwsrhqexqe.supabase.co';
const previewEnv={NEXT_PUBLIC_DESIGN_PREVIEW:'true',NEXT_PUBLIC_PREVIEW_SUPABASE_URL:preview,NEXT_PUBLIC_PREVIEW_SUPABASE_ANON_KEY:'sb_publishable_preview_fixture'};
test('preview selects only the explicit isolated backend',()=>assert.deepEqual(resolveBackendConfig(previewEnv),{target:'preview',url:preview,publicKey:'sb_publishable_preview_fixture'}));
test('missing preview settings fail instead of using production settings',()=>assert.throws(()=>resolveBackendConfig({NEXT_PUBLIC_SUPABASE_URL:prod,NEXT_PUBLIC_SUPABASE_ANON_KEY:'sb_publishable_production_fixture'}),/preview.*configuration/i));
test('production project cannot be used for preview',()=>assert.throws(()=>resolveBackendConfig({...previewEnv,NEXT_PUBLIC_PREVIEW_SUPABASE_URL:prod}),/production.*preview/i));
test('existing preview flag rejects an explicit production target',()=>assert.throws(()=>resolveBackendConfig({...previewEnv,NEXT_PUBLIC_LMS_TARGET:'production'}),/preview.*production/i));
test('production requires explicit configuration and the established production project',()=>{
 assert.throws(()=>resolveBackendConfig({NEXT_PUBLIC_LMS_TARGET:'production'}),/production.*configuration/i);
 assert.throws(()=>resolveBackendConfig({NEXT_PUBLIC_LMS_TARGET:'production',NEXT_PUBLIC_SUPABASE_URL:preview,NEXT_PUBLIC_SUPABASE_ANON_KEY:'sb_publishable_fixture'}),/production project/i);
 assert.equal(resolveBackendConfig({NEXT_PUBLIC_LMS_TARGET:'production',NEXT_PUBLIC_SUPABASE_URL:prod,NEXT_PUBLIC_SUPABASE_ANON_KEY:'sb_publishable_fixture'}).url,prod);
});
test('secret keys and user/service JWTs are rejected before client bundling',()=>{
 for(const key of ['sb_secret_do_not_bundle','header.'+Buffer.from(JSON.stringify({role:'service_role'})).toString('base64url')+'.signature','header.'+Buffer.from(JSON.stringify({role:'authenticated'})).toString('base64url')+'.signature']){
  assert.throws(()=>resolveBackendConfig({...previewEnv,NEXT_PUBLIC_PREVIEW_SUPABASE_ANON_KEY:key}),/publishable|anon/i);
 }
});
test('legacy anon JWT must match selected project',()=>{
 const key=ref=>'header.'+Buffer.from(JSON.stringify({role:'anon',ref})).toString('base64url')+'.signature';
 assert.equal(resolveBackendConfig({...previewEnv,NEXT_PUBLIC_PREVIEW_SUPABASE_ANON_KEY:key('lcddnpafrkbwsrhqexqe')}).target,'preview');
 assert.throws(()=>resolveBackendConfig({...previewEnv,NEXT_PUBLIC_PREVIEW_SUPABASE_ANON_KEY:key('lmuwsjjrqmmmtmxjvqln')}),/match/i);
});
test('invalid targets, URL credentials and non-Supabase/insecure endpoints fail',()=>{
 assert.throws(()=>resolveBackendConfig({...previewEnv,NEXT_PUBLIC_LMS_TARGET:'unknown'}),/target/i);
 for(const url of ['http://lcddnpafrkbwsrhqexqe.supabase.co','https://other.example','https://name:password@lcddnpafrkbwsrhqexqe.supabase.co','https://lcddnpafrkbwsrhqexqe.supabase.co/path'])assert.throws(()=>resolveBackendConfig({...previewEnv,NEXT_PUBLIC_PREVIEW_SUPABASE_URL:url}),/URL/i);
});
test('production environment values cannot override a configured preview',()=>assert.equal(resolveBackendConfig({...previewEnv,NEXT_PUBLIC_SUPABASE_URL:prod,NEXT_PUBLIC_SUPABASE_ANON_KEY:'sb_publishable_live_fixture'}).url,preview));

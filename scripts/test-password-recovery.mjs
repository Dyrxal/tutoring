import ts from 'typescript';import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import test from 'node:test';
const exports={};const file='app/password-recovery.ts';
if(fs.existsSync(file))vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports,URL,URLSearchParams,atob});
const jwt=(sub,sid)=>'header.'+Buffer.from(JSON.stringify({sub,session_id:sid})).toString('base64url')+'.signature';
const session=(id='A',sid='session-A')=>({access_token:jwt(id,sid),user:{id},expires_at:2000000000});
const entry={requested:true,linkError:false};
test('reset redirect stays on the supplied origin and never adopts a next URL',()=>{
 assert.equal(exports.resetRedirectUrl('https://preview.example/path?next=https://other.example'),'https://preview.example/?auth=recovery');
 assert.equal(exports.resetRedirectUrl('http://127.0.0.1:8787'),'http://127.0.0.1:8787/?auth=recovery');
 assert.throws(()=>exports.resetRedirectUrl('http://remote.example'));
});
test('recovery intent captures token before SDK consumes the fragment, and recognises expired links',()=>{
 const a=exports.readRecoveryEntry({search:'?auth=recovery',hash:'#type=recovery&access_token=secret'});assert(a.requested);assert.equal(a.token,'secret');assert.equal(a.linkError,false);
 assert(exports.readRecoveryEntry({search:'?auth=recovery',hash:'#error=access_denied&error_code=otp_expired'}).linkError);
 assert.equal(exports.readRecoveryEntry({search:'?auth=other',hash:'#type=signup&access_token=secret'}).requested,false);
});
test('URL marker alone and cached unverified sessions cannot authorise a password change',()=>{
 const s=session();assert.equal(exports.canRecover(s,{id:'A'},entry,null,null),false);
 assert.equal(exports.canRecover(s,null,{...entry,token:s.access_token},null,null),false);
 assert.equal(exports.canRecover(s,{id:'B'},{...entry,token:s.access_token},null,null),false);
 assert.equal(exports.canRecover(null,{id:'A'},entry,null,null),false);
});
test('verified callback, SDK event and tab proof survive reload but never cross accounts or sessions',()=>{
 const s=session(),key=exports.recoveryIdentity(s),now=1900000000000;
 assert.equal(exports.canRecover(s,{id:'A'},{...entry,token:s.access_token},null,null,now),true);
 assert.equal(exports.canRecover(s,{id:'A'},entry,key,null,now),true);
 const proof=JSON.stringify({key,expiresAt:now+60000});assert.equal(exports.canRecover(s,{id:'A'},entry,null,proof,now),true);
 assert.equal(exports.canRecover(session('B','session-B'),{id:'B'},entry,key,proof,now),false);
 assert.equal(exports.canRecover(session('A','new-session'),{id:'A'},entry,key,proof,now),false);
 assert.equal(exports.canRecover(s,{id:'A'},entry,null,proof,now+60001),false);
 assert.equal(exports.canRecover(s,{id:'A'},{...entry,linkError:true},key,proof,now),false);
});

function exitHarness(client){
 const source=fs.readFileSync('app/PasswordRecovery.tsx','utf8'),start=source.indexOf(' async function exit('),end=source.indexOf(' async function updatePassword(',start),state={error:'',status:'ready',closed:[]};
 const context={client,alive:{current:true},generation:{current:1},owner:{current:'A'},finishing:{current:false},exitLock:{current:false},passwordChanged:{current:false},recoveryIdentity:s=>s?.identity||null,clearProof:()=>{},setBusy:()=>{},setPassword:()=>{},setConfirm:()=>{},setStatus:v=>state.status=v,setError:v=>state.error=v,onClose:message=>state.closed.push(message)};
 vm.runInNewContext(ts.transpileModule(source.slice(start,end)+'\nglobalThis.exit=exit;',{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context);return {context,state,exit:context.exit};
}
test('cancelled recovery never reports an updated password when sign-out fails',async()=>{
 const h=exitHarness({auth:{getSession:async()=>({data:{session:{identity:'A'}}}),signOut:async()=>({error:new Error('Offline')})}});await h.exit();assert.notEqual(h.state.status,'saved');assert(!h.state.error.includes('password was updated'));assert.equal(h.state.closed.length,0);
});
test('a late exit cannot sign out a newly active account after its owner ref is cleared',async()=>{
 let resolve,calls=0,reads=0;const h=exitHarness({auth:{getSession:()=>reads++===0?new Promise(r=>resolve=r):Promise.resolve({data:{session:{identity:'B'}}}),signOut:async()=>{calls++;return {error:null}}}});const pending=h.exit();h.context.owner.current=null;h.context.generation.current++;resolve({data:{session:{identity:'B'}}});await pending;assert.equal(calls,0);
});
test('late exit errors cannot overwrite the new account recovery screen',async()=>{
 let reject;const h=exitHarness({auth:{getSession:()=>new Promise((_,r)=>reject=r),signOut:async()=>({error:null})}});const pending=h.exit();h.context.owner.current=null;h.context.generation.current++;reject(new Error('Old account network failure'));await pending;assert.equal(h.state.error,'');
});
test('callback errors provide fixed guidance without reflecting untrusted provider text',()=>{
 const message=exports.readAuthCallbackError({search:'',hash:'#error=access_denied&error_code=otp_expired&error_description=ATTACKER_TEXT'});
 assert.match(message,/expired|already used/i);assert(!message.includes('ATTACKER_TEXT'));
 const other=exports.readAuthCallbackError({search:'?error=server_error&error_description=ATTACKER_TEXT',hash:''});
 assert.match(other,/sign.in/i);assert(!other.includes('ATTACKER_TEXT'));
});
test('normal links and recovery callbacks do not acquire a sign-in error notice',()=>{
 for(const location of [{search:'',hash:''},{search:'',hash:'#type=signup&access_token=example'},{search:'?auth=recovery',hash:'#error=access_denied&error_code=otp_expired'}])assert.equal(exports.readAuthCallbackError(location),'');
});

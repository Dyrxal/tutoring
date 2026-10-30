import ts from 'typescript';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
const cache = new Map();
function load(file, react) {
 file=path.resolve(file); const key=react?file+':hook':file;
 if(cache.has(key)&&!react)return cache.get(key);
 const exports={};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:name=>name==='react'?react:load(path.resolve(path.dirname(file),name+'.ts')),console,window:globalThis.window});
 if(!react)cache.set(key,exports);return exports;
}
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve}};
const tick=async()=>{for(let n=0;n<12;n++)await Promise.resolve()};
function client(id='a') {
 const calls=[],listeners=new Set();let actor=id;
 return {calls,auth:{getSession:async()=>({data:{session:actor?{user:{id:actor}}:null},error:null}),onAuthStateChange:fn=>{listeners.add(fn);return {data:{subscription:{unsubscribe:()=>listeners.delete(fn)}}}}},rpc(name,args){const d=deferred();calls.push({name,args,...d});return d.promise},switch(id){actor=id;for(const fn of listeners)fn('SIGNED_IN',id?{user:{id}}:null)}};
}
function storage(entries={}){const values=new Map(Object.entries(entries)),writes=[];return {getItem:k=>values.get(k)??null,setItem(k,v){writes.push([k,v]);values.set(k,v)},writes}}
function harness(initial) {
 const slots=[];let index=0,effects=[],result,props=initial,dirty=false;
 const react={useRef(value){const i=index++;return slots[i]??= {current:value}},useState(value){const i=index++;slots[i]??={value:typeof value==='function'?value():value};return [slots[i].value,v=>{slots[i].value=typeof v==='function'?v(slots[i].value):v;dirty=true}]},useEffect(fn,deps){const i=index++;const prev=slots[i];if(!prev||deps.some((d,j)=>d!==prev.deps[j])){effects.push(()=>{prev?.cleanup?.();slots[i]={deps,cleanup:fn()}})}}};
 const {useStudentTheme}=load('app/use-student-theme.ts',react);
 function Render(next=props){props=next;index=0;dirty=false;result=useStudentTheme(...props);const pending=effects;effects=[];for(const fn of pending)fn();return result}
 return {render:Render,get value(){if(dirty)Render();return result},unmount(){for(const slot of slots)slot?.cleanup?.()}};
}
test('normalization is strict and Midnight scope is student-only and limited to four screens',()=>{
 const api=load('app/student-theme.ts');
 for(const [input,want] of [['midnight','midnight'],['light','light'],['light-version',null],[null,null],['dark',null],['MIDNIGHT',null],[{},null]])assert.equal(api.normalizeStudentTheme(input),want);
 for(const page of ['dashboard','courses','progress','account'])assert.equal(api.isStudentThemeScreen('midnight','student',page),true);
 for(const page of ['course','lesson','settings'])assert.equal(api.isStudentThemeScreen('midnight','student',page),false);
 assert.equal(api.isStudentThemeScreen('midnight','tutor','account'),false);assert.equal(api.isStudentThemeScreen('light','student','account'),false);
});
test('initial load gates rendering, database preference wins, preview never reads real legacy keys',async()=>{
 const db=client(),store=storage({'notation-theme:a':'light'});globalThis.window={localStorage:store};
 const h=harness([db,'a',true]);assert.equal(h.render().loading,true);await tick();assert.equal(db.calls[0].name,'get_student_theme');db.calls[0].resolve({data:{theme:'midnight'},error:null});await tick();assert.equal(h.value.theme,'midnight');assert.equal(h.value.loading,false);assert.equal(db.calls.length,1);h.unmount();
 const p=harness([null,'a',true]);assert.equal(p.render().theme,'light');await p.value.changeTheme('midnight');assert.equal(p.value.theme,'midnight');assert.equal(store.writes.length,0);p.unmount();
});
test('failed save reverts, retry persists only after confirmation, loads cannot overwrite a selection',async()=>{
 const db=client(),h=harness([db,'a',true]);h.render();await tick();
 const saving=h.value.changeTheme('midnight');await tick();assert.equal(h.value.theme,'midnight');assert.equal(h.value.saving,true);
 db.calls[0].resolve({data:{theme:'light'},error:null});await tick();assert.equal(h.value.theme,'midnight');
 db.calls[1].resolve({data:null,error:{message:'offline'}});await saving;assert.equal(h.value.theme,'light');assert.match(h.value.error,/save/i);
 const retry=h.value.changeTheme('midnight');await tick();db.calls[2].resolve({data:{theme:'midnight'},error:null});await retry;assert.equal(h.value.theme,'midnight');assert.equal(h.value.error,'');h.unmount();
});
test('queued saves are serial and last selection wins even when earlier selection fails',async()=>{
 const db=client(),h=harness([db,'a',true]);h.render();await tick();db.calls[0].resolve({data:{theme:'light'},error:null});await tick();
 const first=h.value.changeTheme('midnight');const last=h.value.changeTheme('light');await tick();assert.equal(db.calls.length,2);
 db.calls[1].resolve({data:null,error:{message:'offline'}});await tick();assert.equal(h.value.theme,'light');assert.equal(db.calls.length,3);db.calls[2].resolve({data:{theme:'light'},error:null});await Promise.all([first,last]);assert.equal(h.value.theme,'light');assert.equal(h.value.error,'');h.unmount();
});
test('actor render reset, A to B to A, auth events and unmount discard stale work immediately',async()=>{
 const db=client(),h=harness([db,'a',true]);h.render();await tick();
 db.switch('b');assert.equal(h.value.theme,'light');assert.equal(h.value.loading,false);
 assert.equal(h.render([db,'b',true]).loading,true);await tick();db.switch('a');h.render([db,'a',true]);await tick();
 db.calls[2].resolve({data:{theme:'light'},error:null});db.calls[0].resolve({data:{theme:'midnight'},error:null});db.calls[1].resolve({data:{theme:'midnight'},error:null});await tick();assert.equal(h.value.theme,'light');
 const pending=h.value.changeTheme('midnight');await tick();h.unmount();db.calls[3].resolve({data:{theme:'midnight'},error:null});await pending;
});
test('legacy choice migrates only for its owner and null database profile, with no cache writes on failure',async()=>{
 const store=storage({'notation-theme:a':'light-version','notation-theme:b':'midnight'});globalThis.window={localStorage:store};
 const db=client(),h=harness([db,'a',true]);h.render();await tick();db.calls[0].resolve({data:{theme:null},error:null});await tick();assert.equal(db.calls[1].args.p_theme,'light');assert.equal(store.writes.length,0);db.calls[1].resolve({data:null,error:{message:'offline'}});await tick();assert.equal(h.value.theme,'light');assert.match(h.value.error,/save/i);assert.equal(store.writes.length,0);h.unmount();
});
test('missing migration, invalid response and offline reads fail gracefully without saving',async()=>{
 for(const response of [{data:null,error:{code:'PGRST202'}},{data:{theme:'unknown'},error:null}]){const db=client(),h=harness([db,'a',true]);h.render();await tick();db.calls[0].resolve(response);await tick();assert.equal(h.value.theme,'light');assert.equal(h.value.loading,false);assert.match(h.value.error,/load/i);assert.equal(db.calls.length,1);h.unmount()}
});
test('same-render A to B to A auth transitions recover with a fresh generation',async()=>{
 const db=client(),h=harness([db,'a',true]);h.render();await tick();db.switch('b');db.switch('a');await tick();
 assert.equal(db.calls.length,2);db.calls[1].resolve({data:{theme:'light'},error:null});db.calls[0].resolve({data:{theme:'midnight'},error:null});await tick();assert.equal(h.value.theme,'light');assert.equal(h.value.loading,false);h.unmount();
});
test('client replacement, disabled role and preview boundaries reset synchronously',async()=>{
 const a=client(),b=client(),h=harness([a,'a',true]);h.render();await tick();a.calls[0].resolve({data:{theme:'midnight'},error:null});await tick();assert.equal(h.value.theme,'midnight');
 assert.equal(h.render([b,'a',true]).theme,'light');assert.equal(h.value.loading,true);await tick();
 h.render([b,'a',false]);assert.equal(h.value.theme,'light');assert.equal(h.value.loading,false);b.calls[0].resolve({data:{theme:'midnight'},error:null});await tick();assert.equal(h.value.theme,'light');await h.value.changeTheme('midnight');assert.equal(b.calls.length,1);h.unmount();
});
test('recognized legacy migrates once after confirmation and unknown legacy never saves',async()=>{
 for(const [legacy,expected] of [['midnight','midnight'],['light','light'],['light-version','light'],['unknown',null]]){
  const store=storage({'notation-theme:a':legacy,'notation-theme:b':'midnight'});globalThis.window={localStorage:store};const db=client(),h=harness([db,'a',true]);h.render();await tick();db.calls[0].resolve({data:{theme:null},error:null});await tick();
  if(expected){assert.equal(db.calls[1].args.p_theme,expected);assert.equal(store.writes.length,0);db.calls[1].resolve({data:{theme:expected},error:null});await tick();assert.equal(h.value.theme,expected);assert.equal(store.writes.length,1);assert.equal(store.writes[0][0],'notation-theme:a');const reload=h.value.reload();await tick();db.calls[2].resolve({data:{theme:expected},error:null});await reload;assert.equal(db.calls.length,3)}else assert.equal(db.calls.length,1);
  h.unmount();
 }
});
test('unexpected session owner prevents every read, write and legacy migration',async()=>{
 const db=client('b'),store=storage({'notation-theme:a':'midnight'});globalThis.window={localStorage:store};const h=harness([db,'a',true]);h.render();await tick();await h.value.changeTheme('midnight');assert.equal(db.calls.length,0);assert.equal(store.writes.length,0);assert.equal(h.value.theme,'light');h.unmount();
});
test('reload during save waits for the write and cannot accept an earlier read',async()=>{
 const db=client(),h=harness([db,'a',true]);h.render();await tick();db.calls[0].resolve({data:{theme:'light'},error:null});await tick();const save=h.value.changeTheme('midnight');await tick();const reload=h.value.reload();await tick();assert.equal(db.calls.length,2);db.calls[1].resolve({data:{theme:'midnight'},error:null});await save;await tick();assert.equal(db.calls.length,3);db.calls[2].resolve({data:{theme:'midnight'},error:null});await reload;assert.equal(h.value.theme,'midnight');assert.equal(h.value.saving,false);assert.equal(h.value.loading,false);h.unmount();
});
test('migration keeps profile grants and policies unchanged and exposes self/student RPCs only',()=>{
 const sql=fs.readFileSync('supabase/migrations/20261029_student_theme.sql','utf8');
 assert.match(sql,/student_theme text default null/);assert.match(sql,/student_theme is null or student_theme in \('light', 'midnight'\)/);
 assert.equal((sql.match(/security definer set search_path = ''/g)||[]).length,2);assert.equal((sql.match(/actor uuid := auth.uid\(\)/g)||[]).length,2);assert.equal((sql.match(/p.id = actor and p.role = 'student'/g)||[]).length,2);
 assert.match(sql,/revoke all on function public.get_student_theme\(\) from public, anon/);assert.match(sql,/revoke all on function public.save_student_theme\(text\) from public, anon/);
 assert.match(sql,/grant execute on function public.get_student_theme\(\) to authenticated/);assert.match(sql,/grant execute on function public.save_student_theme\(text\) to authenticated/);
 assert.doesNotMatch(sql,/\bgrant\s+(update|all|select)|\b(create|drop) policy|\b(delete from|drop table|truncate)\b/i);assert.doesNotMatch(sql,/p_student_id/);
});
test('save failure restores a previously confirmed Midnight choice and unmounted writes never touch cache',async()=>{
 const store=storage();globalThis.window={localStorage:store};const db=client(),h=harness([db,'a',true]);h.render();await tick();db.calls[0].resolve({data:{theme:'midnight'},error:null});await tick();
 const change=h.value.changeTheme('light');await tick();db.calls[1].resolve({data:null,error:{message:'offline'}});await change;assert.equal(h.value.theme,'midnight');assert.equal(store.writes.length,0);
 const pending=h.value.changeTheme('light');await tick();h.unmount();db.calls[2].resolve({data:{theme:'light'},error:null});await pending;assert.equal(store.writes.length,0);
});
test('sign-out cancels queued writes before they can run under another account',async()=>{
 const store=storage();globalThis.window={localStorage:store};const db=client(),h=harness([db,'a',true]);h.render();await tick();db.calls[0].resolve({data:{theme:'light'},error:null});await tick();const first=h.value.changeTheme('midnight');const second=h.value.changeTheme('light');await tick();db.switch(null);db.calls[1].resolve({data:{theme:'midnight'},error:null});await Promise.all([first,second]);assert.equal(db.calls.length,2);assert.equal(store.writes.length,0);assert.equal(h.value.theme,'light');assert.equal(h.value.saving,false);h.unmount();
});
test('session transport failures show load feedback and remain retryable without auth events',async()=>{
 const db=client(),normal=db.auth.getSession;db.auth.getSession=async()=>({data:{session:null},error:{message:'offline'}});const h=harness([db,'a',true]);h.render();await tick();assert.match(h.value.error,/load/i);assert.equal(h.value.loading,false);assert.equal(db.calls.length,0);
 db.auth.getSession=normal;const retry=h.value.reload();await tick();assert.equal(db.calls.length,1);db.calls[0].resolve({data:{theme:'midnight'},error:null});await retry;assert.equal(h.value.theme,'midnight');assert.equal(h.value.error,'');h.unmount();
});
test('session transport errors and throws on save revert with feedback and permit immediate retry',async()=>{
 for(const throws of [false,true]){
  const db=client(),normal=db.auth.getSession,h=harness([db,'a',true]);h.render();await tick();db.calls[0].resolve({data:{theme:'midnight'},error:null});await tick();db.auth.getSession=async()=>{if(throws)throw new Error('offline');return {data:{session:null},error:{message:'offline'}}};await h.value.changeTheme('light');assert.equal(h.value.theme,'midnight');assert.match(h.value.error,/save/i);assert.equal(h.value.saving,false);
  db.auth.getSession=normal;const retry=h.value.changeTheme('light');await tick();assert.equal(db.calls.length,2);db.calls[1].resolve({data:{theme:'light'},error:null});await retry;assert.equal(h.value.theme,'light');assert.equal(h.value.error,'');h.unmount();
 }
});
test('replacing the client for one actor serializes the next choice after its old in-flight save',async()=>{
 const first=client(),second=client(),h=harness([first,'a',true]);h.render();await tick();first.calls[0].resolve({data:{theme:'light'},error:null});await tick();const old=h.value.changeTheme('midnight');await tick();assert.equal(first.calls[1].name,'save_student_theme');h.render([second,'a',true]);const next=h.value.changeTheme('light');await tick();assert.equal(second.calls.length,0,'new client must wait for actor old write');first.calls[1].resolve({data:{theme:'midnight'},error:null});await old;await tick();assert.equal(second.calls.length,1);assert.equal(second.calls[0].name,'save_student_theme');second.calls[0].resolve({data:{theme:'light'},error:null});await next;assert.equal(h.value.theme,'light');assert.equal(h.value.saving,false);h.unmount();
});

import ts from 'typescript';import fs from 'node:fs';import vm from 'node:vm';import path from 'node:path';import {createRequire} from 'node:module';import assert from 'node:assert/strict';import test from 'node:test';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
const require=createRequire(import.meta.url),cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports,require:name=>{if(name==='@/components/ui/button')return {Button:({variant,...props})=>React.createElement('button',props)};if(name.startsWith('.')){const base=path.resolve(path.dirname(file),name);return load(fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx')}return require(name)}});cache.set(file,exports);return exports}
const api=load('app/next-tasks.ts'),ui=load('app/NextTasks.tsx');
const lesson=(id,position,questionCount=21)=>({id,title:`Subchapter ${id}`,position,questions:Array.from({length:questionCount},(_,i)=>({id:`${id}-q${i}`}))});
const courses=[{id:'y9',title:'Year 9',modules:[{id:'ch2',title:'Chapter 2',position:1,lessons:[lesson('c',0)]},{id:'ch1',title:'Chapter 1',position:0,lessons:[lesson('b',2),lesson('intro',0,0),lesson('a',1)]}]},{id:'y10',title:'Year 10',modules:[{id:'ch10',title:'Chapter 1',position:0,lessons:[lesson('intro10',0,0),lesson('d',1),lesson('e',2)]}]}];
const extra=(id,lesson_id,overrides={})=>({id,student_id:'s',lesson_id,assigned_by:'t',assigned_at:'2026-10-12T01:00:00Z',sort_order:0,removed_at:null,removed_by:null,...overrides});

test('automatic task follows chapter/lesson order, skips overviews and advances on completion only',()=>{
 const original=JSON.stringify(courses);assert.deepEqual(Array.from(api.practiceTasks(courses),t=>t.lesson.id),['a','b','c','d','e']);
 assert.equal(api.automaticNextTask(courses,[]).lesson.id,'a');assert.equal(api.automaticNextTask(courses,['a'],'a').lesson.id,'b');assert.equal(api.automaticNextTask(courses,['a','b'],'b').lesson.id,'c');
 assert.equal(api.automaticNextTask(courses,[],'b').lesson.id,'a'); // Access/attempting later content is not completion.
 assert.equal(api.automaticNextTask(courses,['a','b','c'],'c').lesson.id,'d');assert.equal(api.automaticNextTask(courses,['a','b','c','d','e']),undefined);assert.equal(JSON.stringify(courses),original);
});
test('last-used enrolled course is preferred even for an overview, and foreign courses cannot be selected',()=>{
 assert.equal(api.automaticNextTask(courses,[],'intro10').lesson.id,'d');assert.equal(api.automaticNextTask([courses[0]],[],'d').lesson.id,'a');assert.equal(api.automaticNextTask([],[],'a'),undefined);
});
test('extras isolate students/enrolments and deduplicate active rows; completion is derived, never written',()=>{
 const rows=[extra('1','a'),extra('2','b',{sort_order:1}),extra('3','c',{removed_at:'2026-10-12T03:00:00Z'}),extra('4','d'),extra('5','c',{student_id:'other'}),extra('6','a')],before=JSON.stringify(rows);
 const items=api.extraTaskItems(rows,'s',[courses[0]],['b'],'a');assert.deepEqual(Array.from(items,t=>t.task.lesson.id),['a','b']);assert.equal(items[0].isAutomatic,true);assert.equal(items[1].completed,true);assert.equal(items.filter(t=>!t.completed&&!t.isAutomatic).length,0);assert.equal(JSON.stringify(rows),before);
 const advanced=api.extraTaskItems(rows,'s',[courses[0]],['a'],'b');assert.equal(advanced.find(t=>t.task.lesson.id==='a').completed,true);assert.equal(advanced.find(t=>t.task.lesson.id==='b').isAutomatic,true);
});
test('no arbitrary cap on tutor extras and repeated merge preserves removed/completed assignment history',()=>{
 const many={id:'many',title:'Many',modules:[{id:'m',title:'Chapter',position:0,lessons:Array.from({length:120},(_,i)=>lesson(`l${i}`,i))}]},rows=Array.from({length:120},(_,i)=>extra(`t${i}`,`l${i}`,{sort_order:i}));assert.equal(api.extraTaskItems(rows,'s',[many],[]).length,120);
 const removed={...rows[0],removed_at:'2026-10-12T05:00:00Z'};const merged=api.mergeExtraTasks(rows,[removed]);assert.equal(merged.length,120);assert.equal(api.mergeExtraTasks(merged,[removed]).length,120);assert.equal(api.extraTaskItems(merged,'s',[many],[]).length,119);assert.equal(rows[0].removed_at,null);
});
test('extra task fetch paginates, constrains student and exposes setup failures without affecting derivation',async()=>{
 const calls=[],client={from:table=>{assert.equal(table,'student_lesson_tasks');const chain={select:()=>chain,eq:(key,value)=>{calls.push([key,value]);return chain},order:()=>chain,range:async offset=>({data:offset===0?Array.from({length:500},(_,i)=>extra(String(i),'a')):[extra('last','b')],error:null})};return chain}};
 assert.equal((await api.fetchExtraTasks(client,'s')).length,501);assert.deepEqual(calls,[['student_id','s'],['student_id','s']]);
 const missing={from:()=>{const chain={select:()=>chain,eq:()=>chain,order:()=>chain,range:async()=>({data:null,error:{code:'PGRST205'}})};return chain}};await assert.rejects(api.fetchExtraTasks(missing,'s'),/one-time database setup/);assert.equal(api.automaticNextTask(courses,[]).lesson.id,'a');
});
test('uncertain save retries reuse IDs, retain expected tutor and never return unconfirmed success',async()=>{
 const calls=[],items=[{id:'stable1',lesson_id:'a',sort_order:0},{id:'stable2',lesson_id:'b',sort_order:1}],client={rpc:async(name,args)=>{calls.push(JSON.stringify({name,args}));if(calls.length===1)return {data:null,error:{message:'Connection lost'}};return {data:[extra('stable1','a'),extra('stable2','b')],error:null}}};
 await assert.rejects(api.addExtraTasks(client,'t','s',items),/Connection lost/);assert.equal((await api.addExtraTasks(client,'t','s',items)).length,2);assert.equal(calls[0],calls[1]);assert(calls[0].includes('p_tutor_id'));assert(calls[0].includes('p_student_id'));
 const removeCalls=[],remover={rpc:async(name,args)=>{removeCalls.push({name,args});return {data:extra('stable1','a',{removed_at:'now'}),error:null}}};await api.removeExtraTask(remover,'t','stable1');await api.removeExtraTask(remover,'t','stable1');assert.deepEqual(removeCalls[0],removeCalls[1]);assert.equal(removeCalls[0].name,'remove_student_lesson_task');
});
test('student and tutor summaries render distinct next tasks, empty shells and accessible controls',()=>{
 const render=(Component,props)=>renderToStaticMarkup(React.createElement(Component,props));const common={client:null,studentId:'s',courses,completed:['a'],lastLessonId:'a'};
 const student=render(ui.StudentNextTasks,{...common,onOpen:()=>{}});assert(student.includes('Your next task'));assert(student.includes('Subchapter b'));assert(!student.includes('Subchapter a'));assert(student.includes('updates automatically'));assert(!student.includes('Manage extra tasks'));
 const tutor=render(ui.TutorStudentTasks,{...common,tutorId:'t'});assert(tutor.includes('Manage extra tasks'));assert(tutor.includes('aria-expanded="false"'));assert(tutor.includes('student-tasks-s'));
 const shell=render(ui.StudentNextTasks,{...common,courses:[{id:'shell',title:'Shell',modules:[]}],onOpen:()=>{}});assert(shell.includes('when your tutor adds questions'));assert(!shell.includes('completed all'));
});
test('migration and UI enforce tutor-only writes, enrolment, retry safety, account guards and preservation',()=>{
 const sql=fs.readFileSync('supabase/migrations/20261012_next_tasks.sql','utf8'),uiSource=fs.readFileSync('app/NextTasks.tsx','utf8'),page=fs.readFileSync('app/page.tsx','utf8');
 assert.equal(sql,fs.readFileSync('public/setup/20261012_next_tasks.sql','utf8'));assert(sql.includes('enable row level security'));assert(sql.includes('student_id=auth.uid()'));assert(sql.includes('e.student_id=auth.uid()'));assert(sql.includes('e.student_id=p_student_id'));assert(sql.includes('actor is distinct from p_tutor_id'));assert(sql.includes('auth.uid() is distinct from p_tutor_id'));assert(sql.includes('not public.is_tutor()'));assert(sql.includes('where removed_at is null'));assert(sql.includes('where id=p_student_id and role=\'student\' for update'));assert(sql.includes('An uncertain-save retry returns its original row'));
 assert(!/\b(delete from|drop table|truncate)\b/i.test(sql));assert(!/\b(insert into|update|delete from) public\.(questions|lessons|lesson_progress|practice_attempts|enrolments)\b/i.test(sql));assert(!/create policy[^;]+for (insert|update|all)/i.test(sql));assert(sql.includes('revoke all on public.student_lesson_tasks from public,anon,authenticated'));assert(sql.includes('grant select on public.student_lesson_tasks to authenticated'));
 assert(uiSource.includes('session?.user.id!==actorId'));assert(uiSource.includes('revision.current!==generation'));assert(uiSource.includes('pending.current=selected.map'));assert(uiSource.includes('lock.current=true'));assert(uiSource.indexOf('await addExtraTasks')<uiSource.indexOf('setRows(v=>mergeExtraTasks'));
 assert(page.includes('<StudentNextTasks key={userId}'));assert(page.includes('TutorStudentTasks key={`${userId}:${s.id}`}'));assert(page.includes('e.student_id===s.id&&e.course_id===c.id'));assert(page.includes('r.student_id===s.id&&r.completed_at'));
});

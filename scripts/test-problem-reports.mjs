import ts from 'typescript';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {webcrypto} from 'node:crypto';
const require=createRequire(import.meta.url),cache=new Map();
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file);
 const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports,require:name=>{
  if(name==='@/components/ui/button')return {Button:({variant,...props})=>React.createElement('button',props)};
  if(name==='./MathText')return {__esModule:true,default:({text})=>React.createElement('span',null,text)};
  if(name.startsWith('.')){const base=path.resolve(path.dirname(file),name);return load(fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx')}
  return require(name);
 }});cache.set(file,exports);return exports;
}
const api=load('app/problem-reports.ts');
const report={id:'ticket',student_id:'student',course_id:'year9',lesson_id:'lesson',question_id:'question',category:'formatting',description:'Fraction is clipped',status:'new',created_at:'2026-10-12T00:00:00Z',updated_at:'2026-10-12T00:00:00Z',context:{student_name:'Student A',course_title:'Year 9 maths',lesson_title:'Fractions',question_prompt:'Calculate 1/2 + 3/4.'}};

function decisionClient(){let ticket={...report};const events=new Map(),calls=[];let historyFailure=false;
 return {events,calls,setHistoryFailure:value=>historyFailure=value,client:{rpc:async(name,args)=>{assert.equal(name,'manage_problem_report');calls.push(JSON.stringify(args));if(!events.has(args.p_action_id)){assert.equal(ticket.status,args.p_expected_status);events.set(args.p_action_id,{id:args.p_action_id,report_id:ticket.id,actor_id:'tutor',actor_name:'Tutor',from_status:ticket.status,to_status:args.p_status,internal_note:args.p_internal_note,created_at:`2026-10-13T00:0${events.size}:00Z`});ticket={...ticket,status:args.p_status,updated_at:`2026-10-13T00:0${events.size}:00Z`}}return {data:ticket,error:null}},from:table=>{assert.equal(table,'problem_report_history');const chain={select:()=>chain,eq:()=>chain,order:()=>chain,range:async()=>historyFailure?{data:null,error:{message:'History temporarily unavailable'}}:{data:[...events.values()],error:null}};return chain}}};
}

test('accepted and resolved decisions save different private notes; history and latest note persist after reopening',async()=>{
 const store=decisionClient(),accepted={id:'a',reportId:'ticket',expectedStatus:'new',status:'accepted',note:'Investigate the diagram\nKeep the original question.'},resolved={id:'b',reportId:'ticket',expectedStatus:'accepted',status:'resolved',note:'Corrected the fraction display.'};
 const first=await api.saveReportDecision(store.client,accepted);assert.equal(first.report.status,'accepted');assert.equal(first.history[0].internal_note,accepted.note);assert(!('internal_note' in first.report));
 const second=await api.saveReportDecision(store.client,resolved);assert.equal(second.history.length,2);assert.equal(api.latestTutorNote(second.history).internal_note,resolved.note);assert.equal(second.history.find(event=>event.id==='a').internal_note,accepted.note);
 const reopened=await api.fetchReportHistory(store.client,'ticket');assert.equal(api.latestTutorNote(reopened).internal_note,resolved.note);
 await api.saveReportDecision(store.client,{id:'c',reportId:'ticket',expectedStatus:'resolved',status:'new',note:''});assert.equal(api.latestTutorNote(await api.fetchReportHistory(store.client,'ticket')).internal_note,resolved.note);assert.equal(store.events.size,3);
});

test('uncertain note confirmation retries the original action without duplicate history or false success',async()=>{
 const store=decisionClient(),action={id:'stable-note',reportId:'ticket',expectedStatus:'new',status:'accepted',note:'I will investigate.'};store.setHistoryFailure(true);await assert.rejects(api.saveReportDecision(store.client,action),/History temporarily unavailable/);assert.equal(store.events.size,1);store.setHistoryFailure(false);const saved=await api.saveReportDecision(store.client,action);assert.equal(saved.history.length,1);assert.equal(store.calls[0],store.calls[1]);
 const missingNote={rpc:async()=>({data:{...report,status:'resolved'},error:null}),from:()=>{const chain={select:()=>chain,eq:()=>chain,order:()=>chain,range:async()=>({data:[{id:'missing',report_id:'ticket',from_status:'new',to_status:'resolved',internal_note:''}],error:null})};return chain}};await assert.rejects(api.saveReportDecision(missingNote,{id:'missing',reportId:'ticket',expectedStatus:'new',status:'resolved',note:'A note to retain'}),/note could not be confirmed/);
});

test('ticket view retains identity, loads saved notes automatically and clears drafts only after verified history',()=>{
 const source=fs.readFileSync('app/ReportedProblems.tsx','utf8');assert(source.includes('key={report.id}'));assert(!source.includes('key={`${report.id}:${report.updated_at}`}'));assert(source.includes('Most recent saved internal tutor note'));assert(source.includes('if(historyVersion.current!==report.updated_at)void historyRefresh()'));assert(source.indexOf('await saveReportDecision')<source.indexOf('setNote("")'));assert(source.includes('setHistory(saved.history)'));assert(source.includes('View updated report'));assert(source.includes('Leaving it empty preserves previous notes'));
});

function ticketHarness(save){const state={note:'Keep this tutor note',history:null,saving:false,error:'',saved:[]},context={client:{},report:{...report},note:state.note,action:{current:null},inFlight:{current:false},alive:{current:true},historyRequest:{current:0},historyVersion:{current:null},crypto:webcrypto,reportStatuses:api.reportStatuses,saveReportDecision:save,setSaving:value=>state.saving=value,setError:value=>state.error=value,setNotice:value=>state.notice=value,setHistory:value=>state.history=value,setHistoryLoading:()=>{},setHistoryError:()=>{},setNote:value=>{state.note=value;context.note=value},onSaved:(saved,hasNote)=>{state.saved.push({saved,hasNote});context.report=saved}};
 const source=fs.readFileSync('app/ReportedProblems.tsx','utf8'),start=source.indexOf(' async function changeStatus('),end=source.indexOf('\n return <article',start),code=ts.transpileModule(source.slice(start,end)+'\nglobalThis.change=changeStatus;',{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;vm.runInNewContext(code,context);return {state,context,change:context.change};}

test('ticket keeps its draft until verified saving succeeds and ignores duplicate clicks or late responses',async()=>{
 let resolve;const calls=[],h=ticketHarness(async(_,action)=>{calls.push(action);return new Promise(r=>resolve=r)});const pending=h.change('accepted');await h.change('resolved');assert.equal(calls.length,1);assert.equal(h.state.note,'Keep this tutor note');assert.equal(h.state.saved.length,0);assert.equal(h.state.saving,true);resolve({report:{...report,status:'accepted',updated_at:'2026-10-13'},history:[{internal_note: 'Keep this tutor note'}]});await pending;assert.equal(h.state.note,'');assert.equal(h.state.history[0].internal_note,'Keep this tutor note');assert.equal(h.state.saved[0].hasNote,true);
 let finish;const late=ticketHarness(async()=>new Promise(r=>finish=r));const saving=late.change('resolved');late.context.alive.current=false;finish({report:{...report,status:'resolved'},history:[]});await saving;assert.equal(late.state.saved.length,0);assert.equal(late.state.note,'Keep this tutor note');
});

test('failed note confirmation retains draft and retries the original action with its original ID',async()=>{
 let fail=true;const calls=[],h=ticketHarness(async(_,action)=>{calls.push(JSON.stringify(action));if(fail){fail=false;throw new Error('History read failed')}return {report:{...report,status:'accepted'},history:[{internal_note:action.note}]}});await h.change('accepted');assert.equal(h.state.note,'Keep this tutor note');assert.equal(h.state.saved.length,0);assert(h.state.error);await h.change('resolved');assert.equal(calls[0],calls[1]);assert.equal(h.state.saved[0].saved.status,'accepted');assert.equal(h.state.history[0].internal_note,'Keep this tutor note');
});

test('validates reports before making a request and sends context IDs without trusting student identity or dates',async()=>{
 assert(api.validateReport('bogus','text'));assert(api.validateReport('other','  '));assert(api.validateReport('other','x'.repeat(4001)));assert.equal(api.validateReport('other','Valid'),undefined);
 const calls=[],client={rpc:async(name,args)=>{calls.push({name,args});return {data:report,error:null}}};
 const saved=await api.submitProblemReport(client,{id:'stable-id',lessonId:'lesson',questionId:'question',category:'formatting',description:'  Fraction is clipped  '});
 assert.equal(saved,report);assert.equal(calls[0].name,'submit_problem_report');assert.equal(calls[0].args.p_description,'Fraction is clipped');assert.equal(calls[0].args.p_id,'stable-id');assert(!('student_id' in calls[0].args));assert(!('created_at' in calls[0].args));
 await assert.rejects(api.submitProblemReport(client,{category:'other',description:'  '}));assert.equal(calls.length,1);
});

test('uncertain submission and tutor action retries keep stable IDs and payloads; failed saves never return success',async()=>{
 const calls=[],seen=new Map();let fail=true;
 const client={rpc:async(name,args)=>{calls.push(JSON.stringify({name,args}));const id=args.p_id||args.p_action_id;if(!seen.has(id))seen.set(id,{...report,status:args.p_status||'new'});if(fail){fail=false;return {data:null,error:{message:'Network response lost'}}}return {data:seen.get(id),error:null}}};
 const submission={id:'report-retry',lessonId:'lesson',questionId:null,category:'other',description:'Video cannot play'};
 await assert.rejects(api.submitProblemReport(client,submission),/Network response lost/);await api.submitProblemReport(client,submission);assert.equal(calls[0],calls[1]);assert.equal(seen.size,1);
 fail=true;const action={id:'action-retry',reportId:'ticket',expectedStatus:'accepted',status:'resolved',note:'Fixed the image'};
 await assert.rejects(api.manageProblemReport(client,action));assert.equal((await api.manageProblemReport(client,action)).status,'resolved');assert.equal(calls[2],calls[3]);assert.equal(seen.size,2);
 const missing={rpc:async()=>({data:null,error:{code:'PGRST202'}})};await assert.rejects(api.submitProblemReport(missing,submission),/not available yet/);
});

test('search/filter preserves full history, combines filters and handles lesson-level reports',()=>{
 const rows=[report,{...report,id:'resolved',status:'resolved',category:'incorrect_answer',description:'Answer key wrong'}, {...report,id:'ignored',status:'ignored',course_id:'year10',question_id:null,context:{student_name:'Student B',course_title:'Year 10 maths',lesson_title:'Surds'}}];
 const all={status:'all',category:'all',courseId:'all',search:''};assert.equal(api.filterReports(rows,all).length,3);
 assert.equal(api.filterReports(rows,{...all,status:'resolved'})[0].id,'resolved');assert.equal(api.filterReports(rows,{...all,search:'student b surds'})[0].id,'ignored');assert.equal(api.filterReports(rows,{...all,courseId:'year10',category:'incorrect_answer'}).length,0);
 assert.equal(api.filterReports(rows,{...all,search:'fraction clipped',category:'formatting',status:'new'}).length,1);assert.equal(rows.length,3);
});

test('report and action history loading paginate beyond Supabase row limits and fail visibly',async()=>{
 const tables=[];const client={from:table=>{tables.push(table);const chain={select:()=>chain,eq:(field,value)=>{assert.equal(field,'report_id');assert.equal(value,'ticket');return chain},order:()=>chain,range:async(offset)=>({data:offset===0?Array.from({length:500},(_,i)=>({...report,id:String(i)})):[report],error:null})};return chain}};
 assert.equal((await api.fetchProblemReports(client)).length,501);assert.equal((await api.fetchReportHistory(client,'ticket')).length,501);assert(tables.includes('problem_report_history'));
 const missing={from:()=>{const chain={select:()=>chain,order:()=>chain,range:async()=>({data:null,error:{code:'42P01'}})};return chain}};await assert.rejects(api.fetchProblemReports(missing),/one-time Supabase/);
});

test('form and dashboard provide keyboard-friendly labels, history filters and no student-entered context',()=>{
 const Form=load('app/ReportProblemButton.tsx').default,Dashboard=load('app/ReportedProblems.tsx').default;
 const form=renderToStaticMarkup(React.createElement(Form,{client:{},lessonId:'lesson',questionId:'question',contextLabel:'Fractions · Question 1'}));
 assert(form.includes('aria-haspopup="dialog"'));assert(form.includes('<dialog'));assert(form.includes('aria-labelledby='));assert(form.includes('required=""'));assert(form.includes('maxLength="4000"'));assert(!form.includes('name="student_id"'));
 const dashboard=renderToStaticMarkup(React.createElement(Dashboard,{client:{},onOpen:()=>{}}));for(const label of ['Reported problems','All statuses / history','Accepted','Resolved','Ignored','All categories','All courses'])assert(dashboard.includes(label));
});

test('migration and integration retain authority boundaries and keep writes separate from learning records',()=>{
 const sql=fs.readFileSync('supabase/migrations/20261012_problem_reports.sql','utf8'),form=fs.readFileSync('app/ReportProblemButton.tsx','utf8'),dashboard=fs.readFileSync('app/ReportedProblems.tsx','utf8'),page=fs.readFileSync('app/page.tsx','utf8');
 assert(sql.includes('student_id=auth.uid() or public.is_tutor()'));assert(sql.includes('using(public.is_tutor())'));assert(sql.includes("role='student'"));assert(sql.includes('e.student_id=actor and e.course_id=c.id'));assert(sql.includes('q.lesson_id=l.id'));
 assert(sql.includes('for update'));assert(sql.includes('ticket.status is distinct from p_expected_status'));assert(sql.includes('on conflict(id) do nothing'));assert(sql.includes('event.actor_id is distinct from actor'));assert(sql.includes("set search_path=''"));
 assert(!/\b(drop|truncate|delete)\s+(?:table|from)/i.test(sql));assert(!/update\s+public\.(questions|lessons|lesson_progress|practice_attempts)/i.test(sql));assert(!/create policy[^;]+for (insert|update|all)/i.test(sql));
 assert(form.indexOf('await submitProblemReport')<form.indexOf('setSuccess(true)'));assert(form.includes('if(inFlight.current||success)return'));assert(form.includes('submission.current||'));assert(form.includes('if(mounted.current)'));assert(dashboard.includes('action.current||'));assert(dashboard.includes('Internal tutor note'));assert(dashboard.includes("['new','Reopen']"));
 assert(page.includes('key={`${userId}:${lesson.id}`}'));assert(page.includes('key={`${userId}:${q.id}`}'));assert(page.includes('page==="Reported Problems"&&isTutor&&db'));
 const returns=sql.match(/return to_jsonb\([^)]*\)/g);assert.equal(returns.length,4);assert(returns.every(text=>!text.includes('event')),'Private notes must never be returned by student RPC');
});

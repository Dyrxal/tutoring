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
 const exports={};const output=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(output,{exports,require:name=>{
  if(name==='@/components/ui/button')return {Button:({variant,...props})=>React.createElement('button',props)};
  if(name==='./MathText')return {__esModule:true,default:({text})=>React.createElement('span',null,text),MathHelp:()=>null,MathTools:()=>null};
  if(name.startsWith('.')){const base=path.resolve(path.dirname(file),name);return load(fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx')}
  return require(name);
 }});cache.set(file,exports);return exports;
}
const {resolveLessonFlow,configuredHelpChoices}=load('app/lesson-template.ts');
const {lesson1AId}=load('app/lesson1a-support.ts');
const {pilot1AQuestions}=load('app/year9-1a-practice.ts');
const {savePracticeAttempt}=load('app/save-practice-attempt.ts');
const page=fs.readFileSync('app/page.tsx','utf8');
const {chapter1TemplateRollout,chapter1TemplateSections}=load('app/chapter1-template-rollout.ts');
const {year9TemplateRollout,year9TemplateSections}=load('app/year9-template-rollout.ts');
const {year10TemplateRollout,year10TemplateSections}=load('app/year10-template-rollout.ts');

test('Year 10 identifies renamed courses by saved IDs, preserves content, scopes all 99 sections and rejects ambiguity',()=>{
 const targets=year10TemplateSections.map(s=>({id:`y10-${s.code}`,module_id:'renamed-module',title:'Tutor renamed lesson',worked_example:'Existing example',questions:s.questions.map(q=>({...q,id:q.seed_id})),lesson_flow:{recall:{prompt:'Tutor recall',solution:'Keep'},review:{prompt:'Common mistakes',solution:'Existing mistake'}}}));
 const course={id:'year10',modules:[{id:'renamed-module',lessons:targets}]},year9=chapterFixture().courses[0],courses=[year9,course];
 const before=JSON.stringify(courses),result=year10TemplateRollout(courses);
 assert.equal(result.courseId,'year10');assert.equal(year10TemplateSections.length,99);assert.equal(result.flows.size,99);assert.equal(JSON.stringify(courses),before);assert.equal(result.identificationIssue,undefined);
 const Template=load('app/LessonPracticeTemplate.tsx').default;
 for(const target of targets){
  const flow=result.flows.get(target.id);assert.equal(target.questions.length,21);assert(flow.template.help_links[0].label);assert.equal(flow.common_mistakes,target.lesson_flow.review);
  assert(result.reports.find(r=>r.id===target.id).gaps.includes('Remember it'));
  const props={config:flow.template,questions:target.questions,help:{},workedExampleAvailable:true,tutor:false,answered:7,coreCount:8,firstUnansweredId:target.questions[7].id,showSuggested:true,completed:false,canComplete:false,hasNext:true,onSuggested:()=>{},onComplete:async()=>{},onNext:()=>{}};
  const children=target.questions.map((q,i)=>React.createElement('div',{key:q.id},`QUESTION-${i+1}-END`));
  const html=renderToStaticMarkup(React.createElement(Template,props,children));
  assert.equal((html.match(/QUESTION-\d+-END/g)||[]).length,21);assert(html.indexOf('CORE QUESTIONS')<html.indexOf('QUESTION-1-END'));assert(html.indexOf('SUGGESTED PRACTICE')<html.indexOf('QUESTION-9-END'));assert(html.includes('<button disabled="">Mark complete</button>'));
  assert(!renderToStaticMarkup(React.createElement(Template,{...props,answered:8,canComplete:true},children)).includes('<button disabled="">Mark complete</button>'));
 }
 assert.equal(year10TemplateRollout([year9]).flows.size,0);
 assert.equal(year10TemplateRollout([course,{...course,id:'ambiguous-copy'}]).flows.size,0);
 const saved={version:1,help_links:[],reasoning_prompts:{}};targets[0].lesson_flow={template:saved};targets[1].questions.pop();targets[2].questions=[];targets[3].lesson_flow={template:{...saved,enabled:false}};
 const repeat=year10TemplateRollout(courses);assert.equal(repeat.flows.get(targets[0].id).template,saved);for(const target of targets.slice(1,4))assert(!repeat.flows.has(target.id));
 assert(!/void add(?:All)?Year10/.test(page),'Year 10 imports must not run on login');
});

test('whole Year 9 rollout recognises all 97 source sections without changing database content or Year 10',()=>{
 const targets=year9TemplateSections.map(section=>({id:section.code,module_id:section.code.match(/^\d+/)[0],title:'Renamed by tutor',worked_example:'Existing topic example',questions:section.questions.map((q,i)=>({...q,id:`${section.code}-${i}`}))}));
 const pilot={id:lesson1AId,module_id:'1',title:'Reference',questions:[]};
 const courses=[{id:'year9',modules:Array.from({length:10},(_,i)=>({id:String(i+1),lessons:[...(i===0?[pilot]:[]),...targets.filter(l=>l.module_id===String(i+1))]}))},{id:'year10',modules:[{id:'other',lessons:targets.map(l=>({...l,id:`other-${l.id}`}))}]}];
 const before=JSON.stringify(courses),result=year9TemplateRollout(courses);
 assert.equal(year9TemplateSections.length,97);assert.equal(result.flows.size,97);assert.equal(result.reports.filter(r=>r.status==='Skipped').length,0);assert.equal(JSON.stringify(courses),before);
 const Template=load('app/LessonPracticeTemplate.tsx').default;
 for(const target of targets){
  assert.equal(target.questions.length,21);
  const flow=result.flows.get(target.id);assert(flow.template.help_links[0].label);assert.equal(flow.template.help_links[0].target,'worked_example');
  assert.equal(result.flows.has(`other-${target.id}`),false);
  const props={config:flow.template,questions:target.questions,help:{},workedExampleAvailable:true,tutor:false,answered:7,coreCount:8,firstUnansweredId:target.questions[7].id,showSuggested:true,completed:false,canComplete:false,hasNext:true,onSuggested:()=>{},onComplete:async()=>{},onNext:()=>{}};
  const children=target.questions.map((q,i)=>React.createElement('div',{key:q.id},`QUESTION-${i+1}-END`));
  const html=renderToStaticMarkup(React.createElement(Template,props,children));
  assert.equal((html.match(/QUESTION-\d+-END/g)||[]).length,21);assert(html.indexOf('CORE QUESTIONS')<html.indexOf('QUESTION-1-END'));assert(html.indexOf('SUGGESTED PRACTICE')<html.indexOf('QUESTION-9-END'));
  assert(html.includes('<button disabled="">Mark complete</button>'));
  assert(!renderToStaticMarkup(React.createElement(Template,{...props,answered:8,canComplete:true},children)).includes('<button disabled="">Mark complete</button>'));
 }
 const untouched={version:1,help_links:[],reasoning_prompts:{}};targets[0].lesson_flow={template:untouched};
 targets[1].questions.pop();targets[2].questions=[];targets[3].questions[1].id=targets[3].questions[0].id;
 const again=year9TemplateRollout(courses);assert.equal(again.flows.get(targets[0].id).template,untouched);
 for(const target of targets.slice(1,4))assert.equal(again.flows.has(target.id),false);
 assert(!/void addChapter\d+Practice\(/.test(page),'Year 9 must not auto-populate skipped lessons');
 assert(!page.includes('void addYear10Chapter1Practice('),'Year 10 imports are now explicit too');
});
const questions=[{id:'q1',prompt:'Calculate −9 + 15.'},{id:'q2',prompt:'Calculate (−7) × (−3).'},...pilot1AQuestions.map((q,i)=>({...q,id:`q${i+3}`}))];

function chapterFixture(){
 const targets=chapter1TemplateSections.map(section=>({id:section.code,module_id:'chapter1',title:`Renamed ${section.code}`,questions:section.questions.map((q,i)=>({...q,id:`${section.code}-${i}`})),notes:'Existing tutor notes',worked_example:'Existing lesson-specific example',video_url:'https://youtu.be/existing',resources:[{title:'Existing PDF',path:'existing.pdf'}],lesson_flow:{guided:{prompt:'Existing guided exercise',solution:'Keep this too'},recall:{prompt:'Existing recall',solution:'Recall answer'},application:{prompt:'Existing challenge',solution:'Challenge answer'},review:{prompt:'Existing reminder',solution:'Remember this'},common_mistakes:{prompt:'Common mistakes',solution:'Existing warning'}}}));
 const pilot={id:lesson1AId,module_id:'chapter1',questions,title:'Renamed pilot'};
 const other={...targets[0],id:'year10-1B',module_id:'year10-chapter1'};
 return {targets,pilot,other,courses:[{id:'year9',modules:[{id:'chapter1',lessons:[pilot,...targets]},{id:'other-chapter',lessons:[{...other,id:'year9-other',module_id:'other-chapter'}]}]},{id:'year10',modules:[{id:'year10-chapter1',lessons:[other]}]}]};
}

test('rollout enables B–K only within the actual pilot module, preserves content and reports missing support',()=>{
 const fixture=chapterFixture(),before=JSON.stringify(fixture.courses);
 const rollout=chapter1TemplateRollout(fixture.courses);
 assert.equal(rollout.courseId,'year9');assert.equal(rollout.flows.size,10);assert.equal(JSON.stringify(fixture.courses),before);
 assert(!rollout.flows.has(lesson1AId));assert(!rollout.flows.has('year10-1B'));assert(!rollout.flows.has('year9-other'));
 for(const target of fixture.targets){
  const flow=rollout.flows.get(target.id);assert.equal(target.questions.length,21);assert.equal(flow.template.version,1);
  assert.equal(flow.guided,target.lesson_flow.guided);assert.equal(flow.recall,target.lesson_flow.recall);assert.equal(flow.common_mistakes,target.lesson_flow.common_mistakes);
  assert(flow.template.help_links.every(link=>!['Signs','Powers','Order of operations'].includes(link.label)));
  assert(Object.keys(flow.template.reasoning_prompts).every(id=>target.questions.slice(0,8).some(q=>q.id===id)));
  const report=rollout.reports.find(r=>r.id===target.id);assert.equal(report.status,'Enabled');assert.deepEqual(Array.from(report.gaps),['Staged hints for 8 core questions']);
 }
 assert.equal(chapter1TemplateRollout([fixture.courses[1]]).flows.size,0);
});

test('rollout skips non-21, duplicate IDs and unrecognised structure without changing saved tutor settings',()=>{
 const fixture=chapterFixture();
 fixture.targets[0].questions.pop();fixture.targets[1].questions[1].id=fixture.targets[1].questions[0].id;
 fixture.targets[2].questions=fixture.targets[2].questions.map((q,i)=>({...q,prompt:`Completely edited question ${i}`}));
 const custom={version:1,enabled:false,help_links:[],reasoning_prompts:{}};fixture.targets[3].lesson_flow.template=custom;
 fixture.targets[4].lesson_flow.template={...custom,enabled:true};fixture.targets[4].lesson_flow.practice_help={};
 const before=JSON.stringify(fixture.courses),rollout=chapter1TemplateRollout(fixture.courses);
 assert.equal(rollout.flows.size,6);assert.equal(JSON.stringify(fixture.courses),before);
 for(const target of fixture.targets.slice(0,4))assert.equal(rollout.reports.find(r=>r.id===target.id).status,'Skipped');
 assert.equal(rollout.flows.get(fixture.targets[4].id),fixture.targets[4].lesson_flow);
});

test('existing hints link by question ID; edited questions lose defaults; common mistakes move without deletion',()=>{
 const fixture=chapterFixture(),target=fixture.targets[0],q=target.questions[0];
 const help={title:'Tutor rounding hint',example:'Different tutor example',steps:['First tutor step','Second tutor step']};
 target.lesson_flow.practice_help={[q.id]:help};delete target.lesson_flow.common_mistakes;
 target.lesson_flow.review={prompt:'Common mistakes',solution:'Existing warning in review'};
 target.questions[2].prompt='Tutor changed this question';
 const flow=chapter1TemplateRollout(fixture.courses).flows.get(target.id);
 assert.equal(flow.practice_help[q.id],help);assert.equal(flow.common_mistakes,target.lesson_flow.review);assert.equal(flow.review,target.lesson_flow.review);
 assert.equal(flow.template.common_mistakes_source,'review');assert.equal(flow.template.reasoning_prompts[target.questions[2].id],undefined);
 const choices=configuredHelpChoices(flow.template,target.questions.slice(0,8).map(q=>q.id),flow.practice_help,true);
 assert.equal(choices[1].target,`question-help-${q.id}`);
 const {LessonFlow}=load('app/LessonFlow.tsx');
 const html=renderToStaticMarkup(React.createElement(LessonFlow,{lesson:{...target,lesson_flow:flow},video:null,practice:null,resources:null}));
 assert.equal((html.match(/Existing warning in review/g)||[]).length,1);assert(html.includes('Existing guided exercise'));
 assert(html.indexOf('Need help?')<html.indexOf('Common mistakes'));assert(html.indexOf('Common mistakes')<html.indexOf('REVIEW AND EXTEND'));
 assert(html.includes('Watch the video, answer all eight core questions'));assert(html.includes('CHALLENGE QUESTION'));
});

test('every rolled-out section renders Q1 and Q9 in their groups, resumes and gates completion at 7/8',()=>{
 const fixture=chapterFixture(),rollout=chapter1TemplateRollout(fixture.courses),Template=load('app/LessonPracticeTemplate.tsx').default;
 for(const target of fixture.targets){
  const config=rollout.flows.get(target.id).template;
  const props={config,questions:target.questions,help:{},workedExampleAvailable:true,tutor:false,answered:7,coreCount:8,firstUnansweredId:target.questions[7].id,showSuggested:true,completed:false,canComplete:false,hasNext:true,onSuggested:()=>{},onComplete:async()=>{},onNext:()=>{}};
  const children=target.questions.map((q,i)=>React.createElement('div',{key:q.id},`QUESTION-${i+1}-END`));
  const html=renderToStaticMarkup(React.createElement(Template,props,children));
  assert.equal((html.match(/QUESTION-\d+-END/g)||[]).length,21);assert(html.indexOf('CORE QUESTIONS')<html.indexOf('QUESTION-1-END'));
  assert(html.indexOf('QUESTION-8-END')<html.indexOf('Mark complete'));assert(html.indexOf('SUGGESTED PRACTICE')<html.indexOf('QUESTION-9-END'));
  assert(html.includes('7/8 core questions answered'));assert(html.includes('<button disabled="">Mark complete</button>'));assert(html.includes('Continue with first unanswered'));
  const complete=renderToStaticMarkup(React.createElement(Template,{...props,answered:8,canComplete:true},children));assert(!complete.includes('<button disabled="">Mark complete</button>'));
 }
});

test('help shortcuts open the actual dropdown and move keyboard focus to the requested example',()=>{
 let focused=false,scrolled=false;const details={open:false};
 const target={tagName:'DIV',closest:()=>details,scrollIntoView:()=>scrolled=true,focus:()=>focused=true};
 const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('app/LessonHelpMenu.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports,require:name=>name==='@/components/ui/button'?{}:require(name),document:{getElementById:id=>id==='existing'?target:null}});
 assert.equal(exports.openHelpTarget('missing'),false);assert.equal(exports.openHelpTarget('existing'),true);assert.equal(details.open,true);assert(focused&&scrolled);
 let summaryFocused=false;target.tagName='DETAILS';target.querySelector=()=>({focus:()=>summaryFocused=true});exports.openHelpTarget('existing');assert(summaryFocused);
});

test('precision-sensitive Chapter 1 short answers and saved retry history retain their intended marking',()=>{
 const {matchesShortAnswer}=load('app/question-types.ts'),{restoreAnswers}=load('app/restore-answers.ts');
 const precision=chapter1TemplateSections[0].questions[2].options;
 assert(precision.exact);assert(matchesShortAnswer('5.00',precision.accepted,precision.exact));assert(!matchesShortAnswer('5',precision.accepted,precision.exact));assert(!matchesShortAnswer('5.0',precision.accepted,precision.exact));
 const q={id:'rounding',options:precision,correct_index:0},attempts=[{student_id:'s',question_id:q.id,response_text:'5',is_correct:false,attempted_at:'2026-01-01',selected_index:1},{student_id:'s',question_id:q.id,response_text:'5.00',is_correct:true,attempted_at:'2026-01-02',selected_index:0},{student_id:'other',question_id:q.id,response_text:'wrong',is_correct:false,attempted_at:'2026-01-03',selected_index:1}];
 const restored=restoreAnswers([q],attempts,'s');assert.equal(restored.shortAnswers[q.id].response,'5.00');assert.equal(restored.shortAnswers[q.id].correct,true);
});

test('1A compatibility config preserves edits and every question; other lessons remain opt-in',()=>{
 const original={id:lesson1AId,questions,lesson_flow:{guided:{prompt:'Common mistakes',solution:'Existing tutor edits'},practice_help:{q6:{title:'Custom powers',example:'Custom example',steps:['Custom step']}}}};
 const before=JSON.stringify(original),resolved=resolveLessonFlow(original);
 assert.equal(JSON.stringify(original),before);assert.equal(resolved.practice_help.q6.example,'Custom example');assert.equal(resolved.common_mistakes.solution,'Existing tutor edits');assert.equal(resolved.template.help_links.length,3);assert.equal(Object.keys(resolved.practice_help).length,4);
 assert.equal(resolveLessonFlow({...original,id:'another'}).template,undefined);
 const configured={version:1,enabled:false,help_links:[],reasoning_prompts:{}};
 assert.equal(resolveLessonFlow({...original,lesson_flow:{template:configured}}).template.enabled,false);
});

test('a different lesson uses its own help links, reminders and common mistakes',()=>{
 const flow={template:{version:1,help_links:[{label:'Equations',target:'question',question_id:'algebra'}],reasoning_prompts:{algebra:'Check by substitution.'}},practice_help:{algebra:{title:'Equation example',example:'Solve x + 2 = 7',steps:['Subtract 2.']}},common_mistakes:{prompt:'Common mistakes',solution:'Keep both sides equal.'},guided:{prompt:'Try this exercise',solution:'Existing guided task'}};
 const resolved=resolveLessonFlow({id:'different',questions:[{id:'algebra',prompt:'Solve x + 4 = 9'}],lesson_flow:flow});
 assert.equal(resolved.template.reasoning_prompts.algebra,'Check by substitution.');assert.equal(resolved.guided.prompt,'Try this exercise');assert.equal(resolved.common_mistakes.solution,'Keep both sides equal.');
 const choices=configuredHelpChoices(resolved.template,['algebra'],resolved.practice_help,false);assert.equal(choices[0].target,'question-help-algebra');
 assert.equal(configuredHelpChoices(resolved.template,[],resolved.practice_help,false)[0].target,undefined);
 assert.equal(configuredHelpChoices(resolved.template,['algebra'],{algebra:{title:'',steps:[]}},false)[0].target,undefined);
});

test('template renders 8/13 groups, local progress and the nearby completion action',()=>{
 const Template=load('app/LessonPracticeTemplate.tsx').default;
 const config=resolveLessonFlow({id:lesson1AId,questions}).template;
 const props={config,questions,help:{},workedExampleAvailable:false,tutor:false,answered:7,coreCount:8,firstUnansweredId:'q8',showSuggested:true,completed:false,canComplete:false,hasNext:true,onSuggested:()=>{},onComplete:async()=>{},onNext:()=>{}};
 const children=questions.map((q,i)=>React.createElement('div',{key:q.id},`QUESTION-${i+1}-END`));
 const html=renderToStaticMarkup(React.createElement(Template,props,children));
 assert.equal((html.match(/QUESTION-\d+-END/g)||[]).length,21);assert(html.indexOf('QUESTION-8-END')<html.indexOf('Mark complete'));assert(html.indexOf('Mark complete')<html.indexOf('SUGGESTED PRACTICE'));assert(html.indexOf('SUGGESTED PRACTICE')<html.indexOf('QUESTION-9-END'));assert(html.includes('7/8 core questions answered'));assert(html.includes('<button disabled="">Mark complete</button>'));
 const legacy=renderToStaticMarkup(React.createElement(Template,{...props,config:undefined},children));assert(!legacy.includes('CORE QUESTIONS'));assert(!legacy.includes('What are you stuck on?'));assert(legacy.includes('Hide extra practice'));
});

test('generic lesson/editor retain guided tasks and keep common mistakes separate',()=>{
 const {LessonFlow,LessonEditor}=load('app/LessonFlow.tsx');
 const flow={template:{version:1,help_links:[],reasoning_prompts:{}},guided:{prompt:'Guided task',solution:'Preserved guided explanation'},common_mistakes:{prompt:'Common mistakes',solution:'Existing mistakes'}};
 const lesson={id:'other',title:'Other lesson',objective:'Learn',notes:'Existing notes',worked_example:'Existing example',video_url:null,lesson_flow:flow};
 const html=renderToStaticMarkup(React.createElement(LessonFlow,{lesson,video:null,practice:null,resources:null}));assert(html.includes('Guided task'));assert(html.includes('Existing mistakes'));assert(html.includes('lesson-worked-example'));
 const editor=renderToStaticMarkup(React.createElement(LessonEditor,{lesson,practiceQuestions:[{id:'q',prompt:'Question'}],onSave:async()=>{},onCancel:()=>{}}));assert(editor.includes('Reasoning reminder'));assert(editor.includes('Help shortcuts'));assert(editor.includes('Preserved guided explanation'));
});

function client(result,existing){return {from:()=>({insert:()=>({select:()=>({single:async()=>result})}),select:()=>({eq:()=>({single:async()=>existing})})})}}
const row={id:'attempt-1',student_id:'student',question_id:'q',selected_index:0,is_correct:true};
test('saving confirms the database result, throws on failure and recovers a duplicate retry',async()=>{
 const saved={...row,response_text:null,attempted_at:'2026-01-01'};
 assert.equal((await savePracticeAttempt(client({data:saved,error:null}),row)).id,row.id);
 await assert.rejects(savePracticeAttempt(client({data:null,error:{message:'offline'}}),row),/offline/);
 assert.equal((await savePracticeAttempt(client({data:null,error:{code:'23505',message:'duplicate'}},{data:saved,error:null}),row)).id,row.id);
 await assert.rejects(savePracticeAttempt(client({data:null,error:{code:'23505',message:'duplicate'}},{data:{...saved,student_id:'other'},error:null}),row));
 const typed={...row,response_text:'5.00'};assert.equal((await savePracticeAttempt(client({data:{...typed,attempted_at:'2026-01-01'},error:null}),typed)).response_text,'5.00');
});

function submissionHarness(save){
 const state={answers:{},shortAnswers:{},attempts:[],saving:{},errors:{}};
 const context={userId:'student',activeStudentId:{current:'student'},pendingSubmissions:{current:new Set()},submissionIds:{current:new Map()},db:{},crypto:webcrypto,savePracticeAttempt:save,
  setAnswers:f=>state.answers=f(state.answers),setShortAnswers:f=>state.shortAnswers=f(state.shortAnswers),setAttemptRecords:f=>state.attempts=f(state.attempts),setAnswerSaving:f=>state.saving=f(state.saving),setAnswerErrors:f=>state.errors=f(state.errors)};
 const start=page.indexOf(' async function submitAnswer('),end=page.indexOf(' async function answer(q:',start);
 const output=ts.transpileModule(page.slice(start,end)+'\nglobalThis.submit=submitAnswer;',{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 vm.runInNewContext(output,context);return {state,context,submit:context.submit};
}

test('feedback/progress wait for confirmed saves; failures stay editable and retry the same ID',async()=>{
 let resolve,seen=[];
 const harness=submissionHarness(async(_,submitted)=>{seen.push(submitted);return new Promise(r=>resolve=r)});
 const pending=harness.submit({id:'q'},0,true);await harness.submit({id:'q'},1,false);
 assert.equal(seen.length,1);assert.equal(harness.state.answers.q,undefined);assert.equal(harness.state.attempts.length,0);assert.equal(harness.state.saving.q,true);
 resolve({...seen[0],attempted_at:'2026-01-01'});await pending;assert.equal(harness.state.answers.q,0);assert.equal(harness.state.attempts.length,1);assert.equal(harness.state.saving.q,false);
 let calls=0,ids=[];
 const retry=submissionHarness(async(_,submitted)=>{ids.push(submitted.id);if(calls++===0)throw new Error('offline');return {...submitted,attempted_at:'2026-01-02'}});
 await retry.submit({id:'q'},1,false,'5.00');assert.equal(retry.state.shortAnswers.q,undefined);assert.equal(retry.state.attempts.length,0);assert(retry.state.errors.q);assert.equal(retry.state.saving.q,false);
 await retry.submit({id:'q'},1,false,'5.00');assert.equal(ids[0],ids[1]);assert.equal(retry.state.shortAnswers.q.response,'5.00');assert.equal(retry.state.shortAnswers.q.correct,false);assert.equal(retry.state.attempts.length,1);
});

test('late saves cannot restore another account’s answer state',async()=>{
 let resolve;const harness=submissionHarness(async(_,submitted)=>new Promise(r=>resolve=()=>r({...submitted,attempted_at:'2026-01-01'})));
 const pending=harness.submit({id:'q'},0,true);harness.context.activeStudentId.current='other';resolve();await pending;assert.equal(harness.state.attempts.length,0);assert.equal(harness.state.answers.q,undefined);
});

test('import routines do not delete questions or rewrite attempts to deduplicate',()=>{
 assert(!page.includes('from("questions").delete()'));assert(!page.includes('from("practice_attempts").update('));assert(!page.includes('exact duplicates removed'));
 assert(!page.includes('void addPilotPractice('));
 const coreExpression=page.match(/const coreAnsweredCount=(.*);/)[1];const count=new Function('lesson','db','attemptRecords','userId','answers','shortAnswers','return '+coreExpression);
 const lesson={questions:questions.map(q=>({id:q.id}))},attempts=questions.slice(0,7).map(q=>({student_id:'student',question_id:q.id,is_correct:false}));attempts.push(attempts[0],{student_id:'other',question_id:'q8'},{student_id:'student',question_id:'q9'});assert.equal(count(lesson,true,attempts,'student',{},{}),7);attempts.push({student_id:'student',question_id:'q8'});assert.equal(count(lesson,true,attempts,'student',{},{}),8);assert(page.includes('coreAnsweredCount===coreQuestionCount'));
});

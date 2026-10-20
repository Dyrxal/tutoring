import ts from 'typescript';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const require=createRequire(import.meta.url),cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports,Intl,Date,require:name=>{if(name.startsWith('.')){const base=path.resolve(path.dirname(file),name);return load(fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx')}return require(name)}});cache.set(file,exports);return exports}
const {buildPracticeActivity,activityDateChanged,activityLevel,shiftActivityDate}=load('app/practice-activity.ts'),Component=load('app/PracticeActivity.tsx').default;
const courses=[{id:'c',title:'Year 9',modules:[{id:'m',title:'Chapter 1',lessons:[{id:'l',title:'1A Integer operations',questions:[{id:'q'},{id:'q2'},{id:'q3'}]}]}]}];
const now=new Date('2026-10-13T01:00:00Z'),attempt=(id,context='lesson',overrides={})=>({id,student_id:'s',question_id:'q',is_correct:false,selected_index:0,attempted_at:'2026-10-13T00:00:00Z',attempt_context:context,...overrides});
const build=(attempts=[],overrides={})=>buildPracticeActivity({studentId:'s',courses,attempts,progress:[],now,...overrides});

test('lesson retries count once per question/day, including legacy and incorrect answers',()=>{
 const result=build([attempt('a'),attempt('b'),attempt('c',undefined,{attempt_context:null}),attempt('d','lesson',{question_id:'q2',is_correct:true}),attempt('e','lesson',{attempted_at:'2026-10-12T00:00:00Z'})]);
 assert.equal(result.days.get('2026-10-13').lessonCount,2);assert.equal(result.recentResponses,3);assert.equal(result.recentActiveDays,2);
});
test('each saved review response counts, even on the same question/day after lesson practice',()=>{
 const result=build([attempt('a'),attempt('b','scheduled_review'),attempt('c','early_practice'),attempt('d','review_retry'),attempt('e','review_retry')]);const day=result.days.get('2026-10-13');assert.equal(day.count,5);assert.equal(day.lessonCount,1);assert.equal(day.reviewCount,4);assert.equal(day.topics.length,1);
});
test('duplicate submission IDs count only once without mutating attempts or progress',()=>{
 const rows=[attempt('a','review_retry'),attempt('a','review_retry'),attempt('b','review_retry')],before=JSON.stringify(rows);assert.equal(build(rows).recentResponses,2);assert.equal(JSON.stringify(rows),before);
});
test('foreign students, unavailable content, invalid timestamps and unknown contexts are excluded',()=>{
 const rows=[attempt('a','lesson',{student_id:'other'}),attempt('b','scheduled_review',{question_id:'unassigned'}),attempt('c','scheduled_review',{attempted_at:'invalid'}),attempt('d','unrecognised'),attempt('e')];assert.equal(build(rows).recentResponses,1);assert.equal(build(rows,{courses:[]}).recentResponses,0);
});
test('eight Monday-first calendar columns hide future dates and cross month boundaries correctly',()=>{
 const result=build();assert.equal(result.start,'2026-08-24');assert.equal(result.columns.length,8);assert.equal(result.columns[7][0].date,'2026-10-12');assert.equal(result.columns[7][1].date,'2026-10-13');assert.equal(result.columns[7][2],null);assert.equal(result.days.size,51);assert.equal(shiftActivityDate('2026-10-01',-1),'2026-09-30');
});
test('activity uses student timezone at midnight, with DST and an invalid-zone fallback',()=>{
 const rows=[attempt('a','lesson',{attempted_at:'2026-10-12T13:30:00Z'})];assert.equal(build(rows).days.get('2026-10-13').count,1);assert.equal(build(rows,{timezone:'UTC'}).days.get('2026-10-12').count,1);assert.equal(build(rows,{timezone:'not-valid'}).timezone,'Australia/Melbourne');
 const boundary=build([attempt('b','lesson',{attempted_at:'2026-10-03T13:59:59Z'}),attempt('c','lesson',{attempted_at:'2026-10-03T14:00:00Z'})]);assert.equal(boundary.days.get('2026-10-03').count,1);assert.equal(boundary.days.get('2026-10-04').count,1);
});
test('heatmap refresh guard changes only when the student local date changes',()=>{
 assert.equal(activityDateChanged('2026-10-13','Australia/Melbourne',new Date('2026-10-13T00:00:00Z')),false);
 assert.equal(activityDateChanged('2026-10-13','Australia/Melbourne',new Date('2026-10-13T13:00:00Z')),true);
 assert.equal(activityDateChanged('2026-10-13','UTC',new Date('2026-10-13T23:59:59Z')),false);
 assert.equal(activityDateChanged('2026-10-13','UTC',new Date('2026-10-14T00:00:00Z')),true);
 assert.equal(activityDateChanged('2026-10-13','invalid',new Date('2026-10-13T00:00:00Z')),false);
});
test('four-week totals and weekly summaries keep activity separate from completions',()=>{
 const rows=[attempt('a','scheduled_review',{attempted_at:'2026-09-15T00:00:00Z'}),attempt('b','scheduled_review',{attempted_at:'2026-09-16T00:00:00Z'}),attempt('c','lesson',{attempted_at:'2026-10-11T00:00:00Z'}),attempt('d','lesson',{attempted_at:'2026-10-12T00:00:00Z'})];
 const progress=[{student_id:'s',lesson_id:'l',completed_at:'2026-10-12T00:00:00Z'},{student_id:'s',lesson_id:'l',completed_at:'2026-10-12T00:00:00Z'},{student_id:'other',lesson_id:'l',completed_at:'2026-10-12T00:00:00Z'},{student_id:'s',lesson_id:'unavailable',completed_at:'2026-10-12T00:00:00Z'}];const result=build(rows,{progress});assert.equal(result.recentResponses,3);assert.equal(result.weekResponses,1);assert.equal(result.weekLessons,1);assert.equal(build([attempt('review','scheduled_review')]).weekLessons,0);
});
test('green density thresholds include every agreed bucket',()=>assert.deepEqual([0,1,4,5,9,10,19,20,100].map(activityLevel),[0,1,1,2,2,3,3,4,4]));
test('rendered heat map exposes day buttons, text legend, totals and counting explanation',()=>{
 const html=renderToStaticMarkup(React.createElement(Component,{studentId:'s',courses,attempts:[],progress:[]}));assert(html.includes('Your practice activity'));assert(html.includes('aria-label="Daily practice responses"'));assert(html.includes('aria-pressed='));assert(html.includes('aria-live="polite"'));assert(html.includes('No saved practice responses on this day'));assert(html.includes('Lessons completed this week'));assert(html.includes('Every saved response in Practise my mistakes counts'));assert(html.includes('aria-hidden="true"'));assert(!html.includes('streak'));
});
test('loading and failure states never present an empty heat map as confirmed inactivity',()=>{
 const props={studentId:'s',courses,attempts:[],progress:[]};const loading=renderToStaticMarkup(React.createElement(Component,{...props,loading:true})),error=renderToStaticMarkup(React.createElement(Component,{...props,error:'database unavailable',onRetry:()=>{}}));assert(loading.includes('Loading saved practice activity'));assert(!loading.includes('0 practice responses'));assert(error.includes('Retry loading activity'));assert(!error.includes('0 practice responses'));
});

import ts from 'typescript';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

const require=createRequire(import.meta.url),cache=new Map();
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file);
 const exports={},source=fs.readFileSync(file,'utf8');
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(js,{exports,Intl,Date,require:name=>{
  if(name.startsWith('.')){const base=path.resolve(path.dirname(file),name);return load(fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx')}
  return require(name);
 }});
 cache.set(file,exports);return exports;
}
function loadBankSource(source){
 const exports={},js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 vm.runInNewContext(js,{exports,require});return exports;
}

const {chapter4Practice}=load('app/year9-ch4-practice.ts');
const {default:LinearGraph}=load('app/LinearGraph.tsx');
const {restoreAnswers}=load('app/restore-answers.ts');
const {multipleChoiceOptions}=load('app/question-types.ts');
const {savePracticeAttempt}=load('app/save-practice-attempt.ts');

test('Year 9 4A stays at 21 questions with three graph questions replacing the final optional items',()=>{
 assert.equal(chapter4Practice['4A'].length,21);
 assert.equal(chapter4Practice['4A'].filter(q=>!Array.isArray(q.options)&&q.options.kind==='graph_choice').length,3);
 assert.deepEqual(JSON.parse(JSON.stringify(chapter4Practice['4A'].slice(18).map(q=>q.prompt))),[
  'A table gives x = 0, 1, 2, 3 and y = 1, 3, 5, 7. Which labelled graph represents the same relation?',
  'Read the value of y when x = 2 from the graph.',
  'Which table matches the straight-line graph?'
 ]);
 for(const [section,questions] of Object.entries(chapter4Practice)){
  const graphs=questions.filter(q=>!Array.isArray(q.options)&&q.options.kind==='graph_choice');
  assert.equal(graphs.length,section==='4A'?3:0,section);
  assert.equal(questions.length,21,section);
 }
});

test('all other section question data and the original 4A questions remain byte-for-byte equivalent as data',()=>{
 const original=loadBankSource(execFileSync('git',['show','HEAD:app/year9-ch4-practice.ts'],{encoding:'utf8'})).chapter4Practice;
 for(const section of Object.keys(original)){
  const current=section==='4A'?chapter4Practice[section].slice(0,18):chapter4Practice[section];
  const prior=section==='4A'?original[section].slice(0,18):original[section];
  assert.equal(JSON.stringify(current),JSON.stringify(prior),section);
 }
 assert.equal(chapter4Practice['4A'].slice(18).some(q=>['Points in a table lie on a straight line. Which feature confirms the relation is linear?','A line goes through (0, 2) and (4, 2). Which statement is true?','The points (1, 2), (3, 8) and (5, k) lie on one straight line. Find k.'].includes(q.prompt)),false);
 assert.deepEqual(JSON.parse(JSON.stringify(chapter4Practice['4A'].slice(18).map(q=>q.seed_id))),['4c000004-0000-4000-8000-650000000022','4c000004-0000-4000-8000-650000000023','4c000004-0000-4000-8000-650000000024']);
});

test('graph questions have checked answer keys and line data matching each task',()=>{
 const graphs=chapter4Practice['4A'].filter(q=>!Array.isArray(q.options)&&q.options.kind==='graph_choice');
 const [tableToGraph,readValue,graphToTable]=graphs;
 assert.equal(tableToGraph.correct_index,0);
 const [a,b,c,d]=tableToGraph.options.graph.series;
 const slope=([x1,y1],[x2,y2])=>(y2-y1)/(x2-x1),intercept=([x,y],m)=>y-m*x;
 assert.equal(slope(a.points[0],a.points[1]),2);assert.equal(intercept(a.points[0],2),1);
 assert.deepEqual(JSON.parse(JSON.stringify([b,c,d].map(s=>[slope(s.points[0],s.points[1]),intercept(s.points[0],slope(s.points[0],s.points[1]))]))),[[1,1],[2,-1],[-1,5]]);
 assert.equal(readValue.correct_index,1);
 const [p0,p1]=readValue.options.graph.series[0].points;
 assert.equal(p0[1]+(2-p0[0])*slope(p0,p1),4);
 assert.equal(graphToTable.correct_index,0);
 assert.deepEqual(JSON.parse(JSON.stringify(graphToTable.options.graph.series[0].points)),[[0,4],[2,2],[4,0]]);
 assert.equal(multipleChoiceOptions(graphToTable.options)[graphToTable.correct_index],'x: 0, 2, 4; y: 4, 2, 0');
});

test('graph rendering exposes axes, accessible description, plotted-point text and keyboard disclosure',()=>{
 const question=chapter4Practice['4A'].find(q=>!Array.isArray(q.options)&&q.options.kind==='graph_choice');
 const html=renderToStaticMarkup(React.createElement(LinearGraph,{graph:question.options.graph}));
 assert(html.includes('role="img"'));assert(html.includes('aria-labelledby='));assert(html.includes('<desc'));
 assert(html.includes('linear-graph-axis'));assert(html.includes('linear-graph-grid'));
 assert(html.includes('Read the plotted points'));assert(html.includes('<summary'));
 assert(html.includes('<figcaption>'));
 const two=renderToStaticMarkup(React.createElement(React.Fragment,null,React.createElement(LinearGraph,{graph:question.options.graph}),React.createElement(LinearGraph,{graph:question.options.graph})));
 const ids=[...two.matchAll(/id="(linear-graph-[^"]+-title)"/g)].map(match=>match[1]);assert.equal(ids.length,2);assert.notEqual(ids[0],ids[1]);
});

test('saved graph-choice attempt selection restores after reload for its own student',async()=>{
 const question=chapter4Practice['4A'].find(q=>!Array.isArray(q.options)&&q.options.kind==='graph_choice');
 const saved=[],client={from:table=>({insert:row=>{assert.equal(table,'practice_attempts');saved.push(row);return {select:()=>({single:async()=>({data:row,error:null})})}}})};
 const persisted=await savePracticeAttempt(client,{id:'attempt-1',student_id:'student-1',question_id:question.seed_id,selected_index:question.correct_index,is_correct:true});
 const questions=[{id:question.seed_id,options:question.options}],attempts=[
  {...persisted,attempted_at:'2026-10-20T01:00:00Z',attempt_context:'lesson'},
  {student_id:'other-student',question_id:question.seed_id,selected_index:2,is_correct:false,attempted_at:'2026-10-20T02:00:00Z',attempt_context:'lesson'}
 ];
 assert.equal(saved[0].selected_index,question.correct_index);assert.equal(saved[0].is_correct,true);
 assert.deepEqual(JSON.parse(JSON.stringify(restoreAnswers(questions,attempts,'student-1').answers)),{[question.seed_id]:question.correct_index});
});

test('practice attempt save failure remains visible to the existing error path',async()=>{
 const client={from:()=>({insert:()=>({select:()=>({single:async()=>({data:null,error:{message:'write unavailable'}})})})})};
 await assert.rejects(()=>savePracticeAttempt(client,{id:'attempt-fail',student_id:'student-1',question_id:'q',selected_index:0,is_correct:false}),/write unavailable/);
});

test('graph figure stays fluid and keyboard disclosure has a visible focus style at mobile widths',()=>{
 const css=fs.readFileSync('app/globals.css','utf8');
 assert(css.includes('.linear-graph{width:100%;max-width:620px;min-width:0;'));
 assert.match(css,/@media\(max-width:600px\)\{\.linear-graph/);
 assert.match(css,/\.linear-graph-data summary:focus-visible\{outline:/);
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import {createRequire} from 'node:module';
import path from 'node:path';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const require=createRequire(import.meta.url),cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const exports={};cache.set(file,exports);vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText,{exports,Intl,Date,require:name=>{if(name.startsWith('.')){const base=path.resolve(path.dirname(file),name);return load(fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx')}return require(name)}});return exports}
const render=(name,props)=>{const api=load('app/MidnightScreens.tsx');return renderToStaticMarkup(React.createElement(api[name],props))};
test('Midnight courses use the supplied course data and preserve an empty enrollment state',()=>{
 const html=render('MidnightCourses',{courses:[{id:'c',title:'A tutor-renamed course',description:'Existing description'}],percent:()=>37,onOpen:()=>{}});
 assert(html.includes('A tutor-renamed course'));assert(html.includes('Existing description'));assert(html.includes('37%'));assert(html.includes('Open course'));
 const empty=render('MidnightCourses',{courses:[],percent:()=>0,onOpen:()=>{}});assert(empty.includes('No courses'));assert(!empty.includes('Year 9 maths'));
});
test('appearance exposes both choices and truthful loading and failure recovery',()=>{
 const base={theme:'midnight',loading:false,saving:false,error:'Offline',changeTheme:async()=>{},reload:async()=>{}};
 const html=render('StudentAppearance',{state:base,preview:false});assert(html.includes('Midnight Study'));assert(html.includes('Classic light'));assert(html.includes('role="alert"'));assert(html.includes('Offline'));assert(html.includes('Retry'));
 const loading=render('StudentAppearance',{state:{...base,loading:true,error:''},preview:false});assert(loading.includes('disabled'));assert(loading.includes('Loading'));
});
test('Midnight account retains supplied profile editor, activity and sign-out controls',()=>{
 const html=render('MidnightAccount',{profile:{full_name:'Real profile name',year_level:'Year 10',avatar_key:'cat'},editor:React.createElement('button',null,'Save profile'),appearance:React.createElement('p',null,'Appearance control'),activity:React.createElement('p',null,'Existing practice history'),signOut:React.createElement('button',null,'Sign out')});
 for(const text of ['Real profile name','Year 10','Save profile','Appearance control','Existing practice history','Sign out'])assert(html.includes(text));
});
test('Midnight Progress retains exact lesson counts alongside rounded percentages',()=>{
 const html=render('MidnightProgress',{activity:{studentId:'s',courses:[],attempts:[],progress:[]},courses:[{id:'c',title:'Real course'}],percent:()=>4,completion:()=>({done:1,total:25}),onOpen:()=>{}});
 assert(html.includes('1 of 25 lessons completed'));assert(html.includes('4%'));assert(html.includes('Real course'));
});

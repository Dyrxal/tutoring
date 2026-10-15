import assert from 'node:assert/strict';
import {chapter3Practice} from '../app/year9-ch3-practice.ts';
import {matchesShortAnswer} from '../app/question-types.ts';
import {fetchAllQuestions} from '../app/load-questions.ts';
import katex from 'katex';
const ids=new Set();
for(const [code,questions] of Object.entries(chapter3Practice)){
 assert.equal(questions.length,21,code);
 assert.equal(new Set(questions.map(q=>q.prompt)).size,21);
 for(const q of questions){
  assert(!ids.has(q.seed_id));ids.add(q.seed_id);
  assert(q.explanation.trim());
  const options=q.options;
  if(Array.isArray(options)){assert.equal(options.length,4);assert.equal(new Set(options).size,4);assert(options[q.correct_index]);}
  else{
   for(const answer of options.accepted){
    assert(matchesShortAnswer(answer,options.accepted,options.exact));
    if(options.exact&&/^\d+\.\d*0$/.test(answer))assert(!matchesShortAnswer(String(Number(answer)),options.accepted,true),'Required zeros must be retained');
    if(options.exact&&/^0\d{2}$/.test(answer))assert(!matchesShortAnswer(String(Number(answer)),options.accepted,true),'Bearings require three digits');
   }
   assert(!matchesShortAnswer('not an answer',options.accepted,options.exact));
  }
  for(const text of [q.prompt,q.explanation,...(Array.isArray(options)?options:options.accepted)])for(const m of text.matchAll(/\$([^$]+)\$/g))katex.renderToString(m[1],{throwOnError:true});
 }
}
// A course larger than the API's row limit must keep the final question and order.
const rows=Array.from({length:1208},(_,i)=>({id:String(i),position:i%21}));
const calls=[];const query={select(){return this},order(){return this},async range(a,b){calls.push([a,b]);return {data:rows.slice(a,b+1),error:null}}};
const complete=await fetchAllQuestions({from(){return query}});
assert.deepEqual(complete.data,rows);assert.deepEqual(calls,[[0,499],[500,999],[1000,1499]]);
let count=0;const broken={...query,async range(){return ++count===1?{data:rows.slice(0,500),error:null}:{data:null,error:{message:'blocked'}}}};
assert.equal((await fetchAllQuestions({from(){return broken}})).data,null,'Never treat partial results as complete');
console.log('210 questions, answer validation, TeX and multi-page loading checks passed.');

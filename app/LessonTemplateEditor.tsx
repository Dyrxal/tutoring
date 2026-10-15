"use client";
import {Button} from "@/components/ui/button";
import type {Flow,HelpLink,LessonTemplateConfig,PracticeHelp} from "./lesson-template";

export default function LessonTemplateEditor({flow,questions,onChange}:{flow:Flow;questions:{id:string;prompt:string}[];onChange:(flow:Flow)=>void}){
 const config:LessonTemplateConfig=flow.template||{version:1,help_links:[],reasoning_prompts:{}};
 const enabled=!!flow.template&&config.enabled!==false;
 const setConfig=(patch:Partial<LessonTemplateConfig>)=>onChange({...flow,template:{...config,...patch}});
 const changeLink=(index:number,patch:Partial<HelpLink>)=>setConfig({help_links:config.help_links.map((link,i)=>i===index?{...link,...patch}:link)});
 const setHelp=(id:string,patch:Partial<PracticeHelp>)=>onChange({...flow,practice_help:{...flow.practice_help,[id]:{title:"",example:"",steps:[],...flow.practice_help?.[id],...patch}}});
 return <>
  <fieldset><legend>Practice layout</legend><label><input type="checkbox" checked={enabled} onChange={e=>setConfig({enabled:e.target.checked})}/> Use structured practice (8 core questions, then 13 suggested)</label></fieldset>
  {enabled&&<>
   <fieldset>
    <legend>Help shortcuts</legend><p>Link to an existing example. Question examples must be among the eight core questions.</p>
    {config.help_links.map((link,i)=><div className="template-shortcut-editor" key={i}>
     <label>Label<input value={link.label} onChange={e=>changeLink(i,{label:e.target.value})}/></label>
     <label>Example<select value={link.target==="worked_example"?"worked_example":link.question_id||""} onChange={e=>changeLink(i,e.target.value==="worked_example"?{target:"worked_example",question_id:undefined}:{target:"question",question_id:e.target.value})}>
      <option value="">Choose an existing example</option><option value="worked_example">Lesson worked example</option>
      {questions.slice(0,8).map(q=><option key={q.id} value={q.id}>{q.prompt}</option>)}
     </select></label>
     <Button type="button" variant="outline" onClick={()=>setConfig({help_links:config.help_links.filter((_,j)=>j!==i)})}>Remove shortcut</Button>
    </div>)}
    <Button type="button" variant="outline" onClick={()=>setConfig({help_links:[...config.help_links,{label:"",target:"question"}]})}>Add shortcut</Button>
   </fieldset>
   {questions.map(q=>{const help=flow.practice_help?.[q.id]||{title:"",example:"",steps:[]};return <details className="template-question-editor" key={q.id}>
    <summary>Question support: {q.prompt}</summary>
    <label>Reasoning reminder (optional)<input value={config.reasoning_prompts[q.id]||""} onChange={e=>setConfig({reasoning_prompts:{...config.reasoning_prompts,[q.id]:e.target.value}})}/></label>
    <p>Use a different example. Leave the title empty to hide help.</p>
    <label>Help title<input value={help.title} onChange={e=>setHelp(q.id,{title:e.target.value})}/></label>
    <label>Example<textarea value={help.example} onChange={e=>setHelp(q.id,{example:e.target.value})}/></label>
    <label>Steps (one per line)<textarea rows={4} value={help.steps.join("\n")} onChange={e=>setHelp(q.id,{steps:e.target.value.split("\n")})}/></label>
   </details>})}
  </>}
 </>;
}

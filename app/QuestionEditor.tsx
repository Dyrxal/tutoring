"use client";
import {useEffect,useState} from "react";
import {Button} from "@/components/ui/button";
import MathText,{MathHelp,MathTools} from "./MathText";
import {isShortAnswer,type QuestionOptions} from "./question-types";

export type QuestionValues={prompt:string;options:QuestionOptions;correct_index:number;explanation:string};
export type EditableQuestion=QuestionValues&{id:string;image_path?:string|null;image_alt?:string};

export default function QuestionEditor({question,onSave,onCancel}:{question?:EditableQuestion;onSave:(values:QuestionValues,file:File|null,alt:string,remove:boolean)=>Promise<boolean>;onCancel:()=>void}){
 const [prompt,setPrompt]=useState(question?.prompt||""),[kind,setKind]=useState<"multiple_choice"|"short_answer">(question&&isShortAnswer(question.options)?"short_answer":"multiple_choice"),[options,setOptions]=useState<string[]>(question&&Array.isArray(question.options)?question.options:["","","",""]),[accepted,setAccepted]=useState(question&&isShortAnswer(question.options)?question.options.accepted.join("\n"):""),[correct,setCorrect]=useState(question?.correct_index??0),[explanation,setExplanation]=useState(question?.explanation||"");
 const [exact,setExact]=useState(question&&isShortAnswer(question.options)?!!question.options.exact:false);
 const [file,setFile]=useState<File|null>(null),[alt,setAlt]=useState(question?.image_alt||""),[remove,setRemove]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const [preview,setPreview]=useState<string|null>(null);
 useEffect(()=>{if(!file){setPreview(null);return}const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url)},[file]);
 const insert=(value:string,set:(value:string)=>void,snippet:string)=>set(value+(value&&!value.endsWith(" ")?" ":"")+snippet);
 async function submit(e:React.FormEvent){e.preventDefault();setError("");const variants=accepted.split("\n").map(x=>x.trim()).filter(Boolean);if(!prompt.trim()||kind==="multiple_choice"&&options.some(o=>!o.trim())||kind==="short_answer"&&!variants.length){setError(kind==="short_answer"?"Add at least one accepted answer.":"Add the question and all four answer options.");return}if(file&&(!["image/png","image/jpeg","image/webp"].includes(file.type)||!/(\.png|\.jpe?g|\.webp)$/i.test(file.name)||file.size>8*1024*1024)){setError("Choose a PNG, JPEG or WebP image under 8 MB.");return}if((file||question?.image_path&&!remove)&&!alt.trim()){setError("Describe the diagram for students using a screen reader.");return}
  const values:QuestionValues={prompt:prompt.trim(),options:kind==="short_answer"?{kind:"short_answer",accepted:variants,exact}:options.map(x=>x.trim()),correct_index:kind==="short_answer"?0:correct,explanation:explanation.trim()};
  setBusy(true);try{const ok=await onSave(values,file,alt.trim(),remove);if(!ok)setError("Could not save this question. Check the message above and try again.")}catch{setError("Could not save this question. Try again.")}finally{setBusy(false)}
 }
 return <form className="question-form" onSubmit={submit}>
  <div className="question-form-head"><h3>{question?"Edit question":"New question"}</h3><p>Write the prompt, choose the correct answer and add an explanation students see after answering.</p></div>
  <label>Question<textarea rows={3} value={prompt} onChange={e=>setPrompt(e.target.value)} required/></label><MathTools onInsert={s=>insert(prompt,setPrompt,s)}/>
  <div className="math-preview"><strong>Question preview</strong><MathText text={prompt||"Your question will appear here."}/></div>
  <label>Answer format<select value={kind} onChange={e=>setKind(e.target.value as "multiple_choice"|"short_answer")}><option value="multiple_choice">Multiple choice</option><option value="short_answer">Short answer</option></select></label>
  {kind==="multiple_choice"?<div className="question-options-editor"><span className="form-legend">Answers · choose the correct one</span>{options.map((option,i)=><div className="answer-edit" key={i}><label className="correct-choice"><input type="radio" name={`correct-${question?.id||"new"}`} checked={correct===i} onChange={()=>setCorrect(i)} aria-label={`Option ${"ABCD"[i]} is correct`}/><span>{"ABCD"[i]}</span></label><label className="answer-input"><span className="sr-only">Option {"ABCD"[i]}</span><input value={option} onChange={e=>setOptions(prev=>prev.map((x,j)=>i===j?e.target.value:x))} required/>{option.includes("$")&&<span className="answer-preview"><MathText text={option}/></span>}</label></div>)}</div>:<><label>Accepted answers<textarea rows={3} value={accepted} onChange={e=>setAccepted(e.target.value)} placeholder={"-7\n-7 degrees"} required/><small className="muted">One accepted answer per line. Plain numbers and equivalent fractions are compared unless exact form is required.</small></label><label className="exact-answer"><input type="checkbox" checked={exact} onChange={e=>setExact(e.target.checked)}/> Require exact written form (for example, 5.00)</label></>}
  <label>Explanation<textarea rows={3} value={explanation} onChange={e=>setExplanation(e.target.value)} placeholder="Explain why the correct answer works."/></label><MathTools onInsert={s=>insert(explanation,setExplanation,s)}/>
  <div className="math-preview"><strong>Explanation preview</strong><MathText text={explanation||"Your explanation will appear here."}/></div>
  <MathHelp/>
  <fieldset className="question-media"><legend>Diagram or image (optional)</legend><label>Upload image<input type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" onChange={e=>{setFile(e.target.files?.[0]||null);setRemove(false)}}/></label>{preview&&<img src={preview} alt="Selected diagram preview"/>}{question?.image_path&&!preview&&<p className="muted">This question already has an image. Choose a file to replace it.</p>}{(file||question?.image_path&&!remove)&&<label>Image description<input value={alt} onChange={e=>setAlt(e.target.value)} placeholder="e.g. A right triangle with sides 3 cm and 4 cm"/></label>}{question?.image_path&&<label className="remove-image"><input type="checkbox" checked={remove} onChange={e=>{setRemove(e.target.checked);if(e.target.checked)setFile(null)}}/> Remove existing image</label>}</fieldset>
  {error&&<p role="alert" className="image-error">{error}</p>}
  <div className="buttons"><Button type="submit" disabled={busy}>{busy?"Saving…":"Save question"}</Button><Button type="button" variant="outline" disabled={busy} onClick={onCancel}>Cancel</Button></div>
 </form>;
}

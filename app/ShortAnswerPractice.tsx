"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import MathText from "./MathText";
import {isShortAnswer,type QuestionOptions} from "./question-types";

export default function ShortAnswerPractice({q,result,tutor,onAnswer,onRetry}:{q:{id:string;options:QuestionOptions;explanation:string};result?:{response:string;correct:boolean};tutor:boolean;onAnswer:(response:string)=>Promise<void>;onRetry:()=>void}){
 const [response,setResponse]=useState(""),[busy,setBusy]=useState(false);
 if(!isShortAnswer(q.options))return null;
 const accepted=q.options.accepted;
 return <>
  {!tutor&&!result&&<form className="short-answer-form" onSubmit={async e=>{e.preventDefault();if(!response.trim()||busy)return;setBusy(true);try{await onAnswer(response.trim())}finally{setBusy(false)}}}><label htmlFor={`response-${q.id}`}>Your answer</label><div><input id={`response-${q.id}`} value={response} disabled={busy} onChange={e=>setResponse(e.target.value)} placeholder="Type your answer" autoComplete="off" required/><Button type="submit" disabled={busy||!response.trim()}>{busy?"Saving…":"Check answer"}</Button></div></form>}
  {result&&<div className={`feedback ${result.correct?"right":"wrong"}`} role="status"><strong>{result.correct?"Correct":"Not quite"}</strong><p>Your answer: <MathText text={result.response}/></p><p>Accepted answer: <MathText text={accepted[0]}/></p>{q.explanation&&<p><MathText text={q.explanation}/></p>}</div>}
  {tutor&&<div className="feedback right"><strong>Teaching key: <MathText text={accepted.join(" · ")}/></strong>{q.explanation&&<p><MathText text={q.explanation}/></p>}</div>}
  {result&&!tutor&&<button className="retry-question" onClick={()=>{setResponse("");onRetry()}}>Try again</button>}
 </>;
}

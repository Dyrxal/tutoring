"use client";
import {useState} from "react";
import MathText from "./MathText";
import {Button} from "@/components/ui/button";
import type {PracticeHelp} from "./lesson-template";

export default function QuestionHelp({help,id,onUseHelp}:{help:PracticeHelp;id?:string;onUseHelp?:()=>void}){
 const [revealed,setRevealed]=useState(0);
 if(!help.title||!help.steps.length)return null;
 return <details id={id} className="question-help" onToggle={e=>{if(e.currentTarget.open)onUseHelp?.();else setRevealed(0)}}>
  <summary>Need a hint? {help.title}</summary>
  <div className="question-help-content">
   <p className="question-help-note">A different example—try each step before revealing the next.</p>
   <p><MathText text={help.example}/></p>
   <ol aria-live="polite">{help.steps.slice(0,revealed).map((step,i)=><li key={i}><MathText text={step}/></li>)}</ol>
   {revealed<help.steps.length?<Button variant="outline" onClick={()=>setRevealed(n=>n+1)}>{revealed===0?"Show first step":"Show next step"}</Button>:<p className="question-help-note">Now apply the same method to the question above.</p>}
  </div>
 </details>;
}

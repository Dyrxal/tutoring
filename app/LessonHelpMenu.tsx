"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";

export type HelpChoice={label:string;target?:string};
export function openHelpTarget(id:string){
 const target=document.getElementById(id);
 if(!target)return false;
 const details=target.tagName==="DETAILS"?target as HTMLDetailsElement:target.closest("details");
 if(details)details.open=true;
 target.scrollIntoView({block:"start"});
 const focusTarget=target.tagName==="DETAILS"?target.querySelector<HTMLElement>("summary"):target;
 focusTarget?.focus({preventScroll:true});
 return true;
}

export default function LessonHelpMenu({choices}:{choices:HelpChoice[]}){
 const [message,setMessage]=useState("");
 const missing=choices.filter(choice=>!choice.target).map(choice=>choice.label);
 return <nav className="lesson-help-menu" aria-label="Find a worked example">
  <p>What are you stuck on?</p>
  <div>{choices.map(({label,target},i)=><Button key={i} variant="outline" disabled={!target} onClick={()=>{setMessage(openHelpTarget(target!)?"":"This example is unavailable. Your tutor can check the lesson help.")}}>{label}</Button>)}</div>
  {missing.length>0&&<p className="help-unavailable">No suitable existing example available for: {missing.join(", ")}. Ask your tutor.</p>}
  {message&&<p className="help-unavailable" role="status">{message}</p>}
 </nav>;
}

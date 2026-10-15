"use client";
import type {ReactNode} from "react";
import {Button} from "@/components/ui/button";
import PracticeGroups from "./PracticeGroups";
import CoreCompletion from "./CoreCompletion";
import LessonHelpMenu from "./LessonHelpMenu";
import {configuredHelpChoices,type LessonTemplateConfig,type PracticeHelp} from "./lesson-template";

type Props={config?:LessonTemplateConfig;questions:{id:string}[];help:Record<string,PracticeHelp>;workedExampleAvailable:boolean;tutor:boolean;answered:number;coreCount:number;firstUnansweredId?:string;showSuggested:boolean;completed:boolean;canComplete:boolean;hasNext:boolean;onSuggested:(show:boolean)=>void;onComplete:()=>Promise<void>;onNext:()=>void;children:ReactNode};
export default function LessonPracticeTemplate({config,questions,help,workedExampleAvailable,tutor,answered,coreCount,firstUnansweredId,showSuggested,completed,canComplete,hasNext,onSuggested,onComplete,onNext,children}:Props){
 const enabled=config?.version===1&&config.enabled!==false;
 const suggestedCount=Math.max(0,questions.length-8);
 const jump=(id:string)=>{const target=document.getElementById(id);target?.scrollIntoView({block:"start"});target?.focus({preventScroll:true})};
 const continuePractising=()=>{onSuggested(true);requestAnimationFrame(()=>jump("suggested-practice"))};
 const oldFooter=!tutor&&suggestedCount>0?<div className="more-practice"><p>{showSuggested?"Keep practising or move to the next lesson when ready.":"Need more practice? Try more varied questions at your own pace."}</p><Button variant="outline" onClick={()=>onSuggested(!showSuggested)}>{showSuggested?"Hide extra practice":`Practise more · ${suggestedCount} questions`}</Button></div>:null;
 return <>
  {enabled&&config.help_links.length>0&&<LessonHelpMenu choices={configuredHelpChoices(config,questions.slice(0,8).map(q=>q.id),help,workedExampleAvailable)}/>}
  {enabled&&!tutor&&firstUnansweredId&&<button className="core-resume-link" onClick={()=>jump(`practice-question-${firstUnansweredId}`)}>Continue with first unanswered core question</button>}
  <PracticeGroups active={enabled} suggestedFooter={oldFooter}
   coreProgress={!tutor&&<p className="core-local-progress" aria-live="polite">{answered}/{coreCount} core questions answered</p>}
   suggestedControl={!tutor&&suggestedCount>0&&<Button variant="outline" aria-expanded={showSuggested} aria-controls="suggested-question-list" onClick={()=>onSuggested(!showSuggested)}>{showSuggested?"Hide suggested practice":`Show suggested practice · ${suggestedCount}`}</Button>}
   coreFooter={!tutor&&<CoreCompletion answered={answered} total={coreCount} canComplete={canComplete} completed={completed} hasNext={hasNext} onComplete={onComplete} onPractice={continuePractising} onNext={onNext}/>}
  >{children}</PracticeGroups>
 </>;
}

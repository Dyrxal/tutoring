"use client";
import {Children,type ReactNode} from "react";

// Presentation only: question IDs, order, marking and completion stay untouched.
export default function PracticeGroups({active,children,suggestedFooter,coreFooter,suggestedControl,coreProgress}:{active:boolean;children:ReactNode;suggestedFooter:ReactNode;coreFooter?:ReactNode;suggestedControl?:ReactNode;coreProgress?:ReactNode}){
 if(!active)return <>{children}{suggestedFooter}</>;
 const questions=Children.toArray(children);
 return <div className="practice-groups">
  <section className="practice-group practice-group-core" aria-labelledby="core-practice-heading">
   <header className="practice-group-header"><h3 id="core-practice-heading">CORE QUESTIONS (1–8)</h3><span className="practice-group-badge">Required</span></header>
   {coreProgress}
   <p className="practice-group-description">Complete these eight questions to finish the lesson.</p>
   {questions.slice(0,8)}
   {coreFooter}
  </section>
  <section id="suggested-practice" tabIndex={-1} className="practice-group practice-group-suggested" aria-labelledby="suggested-practice-heading">
   <header className="practice-group-header"><h3 id="suggested-practice-heading">SUGGESTED PRACTICE (9–21)</h3><span className="practice-group-badge">Optional</span>{suggestedControl}</header>
   <p className="practice-group-description">Build confidence with 13 more questions. These are not required for lesson completion.</p>
   <div id="suggested-question-list">{questions.slice(8)}</div>{!suggestedControl&&suggestedFooter}
  </section>
 </div>;
}

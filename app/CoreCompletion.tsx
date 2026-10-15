"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";

/** A nearby stopping point; the parent's existing completion handler owns progress. */
export default function CoreCompletion({answered,total,canComplete,completed,hasNext,onComplete,onPractice,onNext}:{answered:number;total:number;canComplete:boolean;completed:boolean;hasNext:boolean;onComplete:()=>Promise<void>;onPractice:()=>void;onNext:()=>void}){
 const [saving,setSaving]=useState(false);
 const remaining=Math.max(0,total-answered);
 return <div className="core-completion">
  <p className="core-completion-status" role="status">{completed?"Lesson complete. Keep practising or move to the next lesson.":canComplete?`All ${total} core questions answered. You can mark this lesson complete.`:`Answer ${remaining} more core question${remaining===1?"":"s"} to unlock completion.`}</p>
  <div className="core-completion-actions">
   <Button disabled={!canComplete||completed||saving} onClick={async()=>{setSaving(true);try{await onComplete()}finally{setSaving(false)}}}>{completed?"Completed ✓":saving?"Saving…":"Mark complete"}</Button>
   <Button variant="outline" onClick={onPractice}>Continue practising</Button>
   <Button variant="outline" disabled={!hasNext||saving} onClick={onNext}>Next lesson</Button>
  </div>
  <p className="core-completion-hint">Suggested practice is optional.</p>
 </div>;
}

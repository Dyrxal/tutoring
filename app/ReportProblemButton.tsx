"use client";
import {useEffect,useId,useRef,useState} from "react";
import type {SupabaseClient} from "@supabase/supabase-js";
import {Flag} from "lucide-react";
import {Button} from "@/components/ui/button";
import {reportCategories,submitProblemReport,validateReport,type ReportCategory,type ReportSubmission} from "./problem-reports";

export default function ReportProblemButton({client,lessonId,questionId=null,contextLabel}:{client:SupabaseClient;lessonId:string;questionId?:string|null;contextLabel:string}){
 const id=useId(),dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null),mounted=useRef(true),inFlight=useRef(false),submission=useRef<ReportSubmission|null>(null);
 const [open,setOpen]=useState(false),[category,setCategory]=useState(""),[description,setDescription]=useState(""),[saving,setSaving]=useState(false),[error,setError]=useState(""),[success,setSuccess]=useState(false),[locked,setLocked]=useState(false);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false}},[]);
 useEffect(()=>{if(open&&!dialog.current?.open)dialog.current?.showModal();else if(!open&&dialog.current?.open)dialog.current.close()},[open]);
 const close=()=>{setOpen(false);trigger.current?.focus()};
 const show=()=>{if(success){setSuccess(false);setCategory("");setDescription("");setLocked(false);submission.current=null}setOpen(true)};
 async function submit(){
  if(inFlight.current||success)return;
  const invalid=validateReport(category,description);if(invalid){setError(invalid);return}
  const row=submission.current||{id:crypto.randomUUID(),lessonId,questionId,category:category as ReportCategory,description:description.trim()};
  submission.current=row;inFlight.current=true;setSaving(true);setLocked(true);setError("");
  try{await submitProblemReport(client,row);if(mounted.current)setSuccess(true)}
  catch(e){if(mounted.current)setError(e instanceof Error?e.message:"The report could not be saved. Please retry.")}
  finally{inFlight.current=false;if(mounted.current)setSaving(false)}
 }
 return <>
  <button ref={trigger} type="button" className="report-problem-trigger" onClick={show} aria-haspopup="dialog" aria-label={`Report a problem: ${contextLabel}`}><Flag size={14} aria-hidden="true"/> Report a problem</button>
  <dialog ref={dialog} className="report-dialog" aria-labelledby={`${id}-title`} aria-describedby={`${id}-context`} onCancel={close} onClose={()=>setOpen(false)}>
   <h2 id={`${id}-title`}>Report a problem</h2><p id={`${id}-context`} className="muted">{contextLabel}</p>
   {success?<><p role="status" className="report-confirmation">Your report was saved and sent to your tutor. Thank you for helping improve the lesson.</p><Button onClick={close}>Done</Button></>:<form onSubmit={e=>{e.preventDefault();void submit()}}>
    <p className="muted">Your tutor will receive the relevant lesson and question details automatically.</p>
    <label htmlFor={`${id}-category`}>Category</label><select id={`${id}-category`} required autoFocus disabled={locked} value={category} onChange={e=>setCategory(e.target.value)}><option value="">Choose a category</option>{Object.entries(reportCategories).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select>
    <label htmlFor={`${id}-description`}>What went wrong?</label><textarea id={`${id}-description`} required maxLength={4000} rows={5} disabled={locked} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe what you expected and what happened."/>
    <small>{description.length}/4000 characters</small>
    {error&&<p className="report-error" role="alert">{error}</p>}
    {locked&&!saving&&error&&<p className="muted">Your original report is kept ready to retry, so it cannot be submitted twice.</p>}
    <div className="report-actions"><Button type="button" variant="outline" onClick={close}>{saving?"Close":"Cancel"}</Button><Button type="submit" disabled={saving}>{saving?"Submitting…":locked?"Retry submission":"Submit report"}</Button></div>
   </form>}
  </dialog>
 </>;
}

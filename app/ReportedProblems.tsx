"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import type {SupabaseClient} from "@supabase/supabase-js";
import {Button} from "@/components/ui/button";
import MathText from "./MathText";
import {fetchProblemReports,fetchReportHistory,filterReports,saveReportDecision,latestTutorNote,reportCategories,reportStatuses,type ProblemReport,type ReportHistory,type ReportStatus,type ReportAction} from "./problem-reports";

const date=(value:string)=>new Date(value).toLocaleString("en-AU",{dateStyle:"medium",timeStyle:"short"});
export default function ReportedProblems({client,onOpen}:{client:SupabaseClient;onOpen:(report:ProblemReport)=>void}){
 const [reports,setReports]=useState<ProblemReport[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[status,setStatus]=useState("new"),[category,setCategory]=useState("all"),[courseId,setCourseId]=useState("all"),[search,setSearch]=useState("");
 const [confirmation,setConfirmation]=useState<{id:string;status:ReportStatus;hasNote:boolean}|null>(null);
 const alive=useRef(true),loadId=useRef(0);
 async function refresh(){const id=++loadId.current;setLoading(true);setError("");try{const rows=await fetchProblemReports(client);if(alive.current&&id===loadId.current)setReports(rows)}catch(e){if(alive.current&&id===loadId.current)setError(e instanceof Error?e.message:"Could not load reports.")}finally{if(alive.current&&id===loadId.current)setLoading(false)}}
 useEffect(()=>{alive.current=true;void refresh();return()=>{alive.current=false;loadId.current++}},[client]);
 const shown=useMemo(()=>filterReports(reports,{status,category,courseId,search}),[reports,status,category,courseId,search]);
 const courses=[...new Map(reports.filter(r=>r.course_id).map(r=>[r.course_id!,r.context.course_title||"Course"])).entries()];
 return <section className="reported-problems">
  <div className="report-page-heading"><div><span className="eyebrow">TUTOR WORKSPACE</span><h1>Reported problems</h1><p className="muted">Review student reports. Accepted means under investigation; resolved and ignored reports stay in history.</p></div><Button variant="outline" disabled={loading} onClick={()=>void refresh()}>Refresh</Button></div>
  <div className="report-summary">{Object.entries(reportStatuses).map(([value,label])=><button type="button" key={value} aria-pressed={status===value} onClick={()=>setStatus(value)}><strong>{reports.filter(r=>r.status===value).length}</strong><span>{label}</span></button>)}</div>
  <div className="report-filters">
   <label>Search reports<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Description, student or lesson"/></label>
   <label>Status<select value={status} onChange={e=>setStatus(e.target.value)}><option value="all">All statuses / history</option>{Object.entries(reportStatuses).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
   <label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option value="all">All categories</option>{Object.entries(reportCategories).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
   <label>Course<select value={courseId} onChange={e=>setCourseId(e.target.value)}><option value="all">All courses</option>{courses.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
  </div>
  {confirmation&&<div className="report-save-confirmation" role="status"><span>Report {reportStatuses[confirmation.status].toLowerCase()}.{confirmation.hasNote?" Internal tutor note saved in history.":" Decision saved in history."}</span><Button variant="outline" onClick={()=>{setStatus(confirmation.status);requestAnimationFrame(()=>requestAnimationFrame(()=>{const target=document.getElementById(`problem-report-${confirmation.id}`);target?.scrollIntoView({block:"center"});target?.focus({preventScroll:true})}))}}>View updated report</Button><button type="button" className="text-button" onClick={()=>setConfirmation(null)}>Dismiss</button></div>}
  {loading&&<p role="status">Loading reports…</p>}{error&&<p role="alert" className="report-error">{error}</p>}
  {!loading&&!error&&<p className="muted" role="status">{shown.length} report{shown.length===1?"":"s"}{!shown.length?" match these filters.":" shown."}</p>}
  {!error&&shown.map(report=><Ticket key={report.id} client={client} report={report} onOpen={()=>onOpen(report)} onSaved={(saved,hasNote)=>{setReports(rows=>rows.map(row=>row.id===saved.id?saved:row));setConfirmation({id:saved.id,status:saved.status,hasNote})}}/>)}
 </section>;
}

export function Ticket({client,report,onOpen,onSaved}:{client:SupabaseClient;report:ProblemReport;onOpen:()=>void;onSaved:(report:ProblemReport,hasNote:boolean)=>void}){
 const [note,setNote]=useState(""),[saving,setSaving]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState(""),[history,setHistory]=useState<ReportHistory[]|null>(null),[historyError,setHistoryError]=useState(""),[historyLoading,setHistoryLoading]=useState(false);
 const action=useRef<ReportAction|null>(null),inFlight=useRef(false),alive=useRef(true),historyRequest=useRef(0),historyVersion=useRef<string|null>(null);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false}},[]);
 async function historyRefresh(){const request=++historyRequest.current;setHistoryLoading(true);setHistoryError("");try{const rows=await fetchReportHistory(client,report.id);if(alive.current&&request===historyRequest.current){setHistory(rows);historyVersion.current=report.updated_at}}catch(e){if(alive.current&&request===historyRequest.current)setHistoryError(e instanceof Error?e.message:"Could not load history.")}finally{if(alive.current&&request===historyRequest.current)setHistoryLoading(false)}}
 useEffect(()=>{if(historyVersion.current!==report.updated_at)void historyRefresh()},[client,report.id,report.updated_at]);
 const savedNote=history?latestTutorNote(history):undefined;
 async function changeStatus(next:ReportStatus){
  if(inFlight.current)return;
  const pending=action.current||{id:crypto.randomUUID(),reportId:report.id,expectedStatus:report.status,status:next,note:note.trim()};
  action.current=pending;inFlight.current=true;setSaving(true);setError("");setNotice("");
  try{const saved=await saveReportDecision(client,pending);if(!alive.current)return;historyRequest.current++;historyVersion.current=saved.report.updated_at;setHistory(saved.history);setHistoryLoading(false);setHistoryError("");action.current=null;onSaved(saved.report,!!pending.note);setNote("");setNotice(`Report ${reportStatuses[saved.report.status].toLowerCase()}.${pending.note?" Internal tutor note saved.":" Decision saved in history."}`)}
  catch(e){if(alive.current)setError(e instanceof Error?e.message:"Could not save this action. Retry it.")}
  finally{inFlight.current=false;if(alive.current)setSaving(false)}
 }
 return <article className="report-ticket" id={`problem-report-${report.id}`} tabIndex={-1}>
  <div className="report-ticket-heading"><h2>{reportCategories[report.category]}</h2><span className={`report-status report-status-${report.status}`}>{reportStatuses[report.status]}</span></div>
  <p className="report-description">{report.description}</p>
  <dl className="report-context"><div><dt>Student</dt><dd>{report.context.student_name||"Former student"}</dd></div><div><dt>Submitted</dt><dd>{date(report.created_at)}</dd></div><div><dt>Course</dt><dd>{report.context.course_title||"Former course"}</dd></div><div><dt>Lesson</dt><dd>{report.context.lesson_title||"Former lesson"}</dd></div></dl>
  {report.context.question_prompt&&<div className="report-question"><strong>Reported question</strong><MathText text={report.context.question_prompt}/></div>}
  <div className="report-actions">{report.lesson_id&&<Button variant="outline" onClick={onOpen}>Open {report.question_id?"question":"lesson"}</Button>}<small>Ticket {report.id.slice(0,8)}</small></div>
  {savedNote&&<div className="report-saved-note"><strong>Most recent saved internal tutor note</strong><p className="report-description">{savedNote.internal_note}</p><small>{savedNote.actor_name} · {date(savedNote.created_at)} · {reportStatuses[savedNote.to_status]}</small></div>}
  {historyLoading&&history===null&&<p className="muted" role="status">Loading saved tutor notes…</p>}
  {historyError&&<p className="report-error" role="alert">Saved notes could not be loaded. {historyError} <button type="button" onClick={()=>void historyRefresh()}>Retry loading notes</button></p>}
  <label className="report-note">Internal tutor note (optional)<textarea value={note} maxLength={4000} rows={2} disabled={saving||!!action.current} onChange={e=>setNote(e.target.value)} placeholder="Explain the decision. Students cannot see this note."/></label>
  <p className="report-note-hint">This note saves with Accept, Resolve, Ignore or Reopen. Leaving it empty preserves previous notes in history.</p>
  {error?<><p className="report-error" role="alert">{error}</p><Button disabled={saving} onClick={()=>void changeStatus(action.current!.status)}>{saving?"Saving…":"Retry original action"}</Button><p className="muted">If another tutor changed the report, refresh the list to review their decision.</p></>:<div className="report-actions">{([['accepted','Accept'],['resolved','Resolve'],['ignored','Ignore'],['new','Reopen']] as const).filter(([value])=>value!==report.status).map(([value,label])=><Button key={value} variant={value==="accepted"?"default":"outline"} disabled={saving} onClick={()=>void changeStatus(value)}>{saving?"Saving…":label}</Button>)}</div>}
  {notice&&<p role="status">{notice}</p>}
  <details className="report-history" onToggle={e=>{if(e.currentTarget.open&&history===null&&!historyLoading)void historyRefresh()}}><summary>Action history</summary>
   {historyLoading&&<p role="status">Loading history…</p>}{historyError&&<p role="alert">{historyError} <button type="button" onClick={()=>void historyRefresh()}>Retry history</button></p>}
   {history&&<ol>{history.map(event=><li key={event.id}><strong>{event.from_status?`${reportStatuses[event.from_status]} → ${reportStatuses[event.to_status]}`:"Report submitted"}</strong><span>{event.actor_name} · {date(event.created_at)}</span>{event.internal_note&&<p className="report-description">{event.internal_note}</p>}</li>)}</ol>}
  </details>
 </article>;
}

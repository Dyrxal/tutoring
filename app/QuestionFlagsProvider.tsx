"use client";
import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from "react";
import type {SupabaseClient} from "@supabase/supabase-js";
import {Flag} from "lucide-react";
import {fetchQuestionFlags,mergeFlag,saveFlagAction,type QuestionFlag,type FlagAction} from "./question-flags";

type FlagsContext={rows:QuestionFlag[];loading:boolean;loadError:string;busy:Record<string,boolean>;errors:Record<string,string>;toggle:(questionId:string)=>Promise<void>};
const Context=createContext<FlagsContext|null>(null);
export default function QuestionFlagsProvider({client,enabled,studentId,lessonId,children}:{client:SupabaseClient|null;enabled:boolean;studentId:string;lessonId:string;children:ReactNode}){
 const [rows,setRows]=useState<QuestionFlag[]>([]),[loading,setLoading]=useState(enabled),[loadError,setLoadError]=useState(""),[busy,setBusy]=useState<Record<string,boolean>>({}),[errors,setErrors]=useState<Record<string,string>>({});
 const contextKey=`${studentId}:${lessonId}`,activeContext=useRef(contextKey);activeContext.current=contextKey;
 const alive=useRef(true),loadId=useRef(0),locks=useRef(new Set<string>()),pending=useRef(new Map<string,FlagAction>());
 async function refresh(){if(!client||!enabled)return;const id=++loadId.current,requestedContext=contextKey;setLoading(true);setLoadError("");try{const saved=await fetchQuestionFlags(client,lessonId,studentId);if(alive.current&&id===loadId.current&&activeContext.current===requestedContext)setRows(saved)}catch(e){if(alive.current&&id===loadId.current&&activeContext.current===requestedContext)setLoadError(e instanceof Error?e.message:"Could not load your flags.")}finally{if(alive.current&&id===loadId.current&&activeContext.current===requestedContext)setLoading(false)}}
 useEffect(()=>{alive.current=true;setRows([]);setLoadError("");if(enabled)void refresh();const subscription=client?.auth.onAuthStateChange((_event,session)=>{if(session?.user.id!==studentId){alive.current=false;loadId.current++}}).data.subscription;return()=>{alive.current=false;loadId.current++;subscription?.unsubscribe()}},[client,enabled,studentId,lessonId]);
 async function toggle(questionId:string){
  if(!client||loading||loadError||locks.current.has(questionId))return;
  const requestedContext=contextKey;
  const existing=rows.find(row=>row.question_id===questionId&&row.status==="outstanding");
  const action=pending.current.get(questionId)||(existing?{kind:"withdraw" as const,id:existing.id,studentId}:{kind:"flag" as const,id:crypto.randomUUID(),questionId,studentId});
  pending.current.set(questionId,action);locks.current.add(questionId);setBusy(v=>({...v,[questionId]:true}));setErrors(v=>({...v,[questionId]:""}));
  try{const saved=await saveFlagAction(client,action);if(!alive.current||activeContext.current!==requestedContext)return;pending.current.delete(questionId);setRows(v=>mergeFlag(v,saved))}
  catch(e){if(alive.current&&activeContext.current===requestedContext)setErrors(v=>({...v,[questionId]:e instanceof Error?e.message:"Could not save. Retry your flag."}))}
  finally{locks.current.delete(questionId);if(alive.current&&activeContext.current===requestedContext)setBusy(v=>({...v,[questionId]:false}))}
 }
 if(!enabled)return <>{children}</>;
 return <Context.Provider value={{rows,loading,loadError,busy,errors,toggle}}><div className="question-flag-note"><p>Stuck? Use <strong>Ask my tutor</strong> on a question to add it to your tutor’s review list. You can keep practising.</p><button type="button" className="text-button" disabled={loading} onClick={()=>void refresh()}>Refresh my flags</button></div>{loadError&&<p className="report-error" role="alert">{loadError} <button type="button" onClick={()=>void refresh()}>Retry loading</button></p>}{children}</Context.Provider>;
}

export function FlagQuestionButton({questionId,questionNumber}:{questionId:string;questionNumber:number}){
 const context=useContext(Context);if(!context)return null;
 const {rows,loading,loadError,busy,errors,toggle}=context;
 const active=rows.some(row=>row.question_id===questionId&&row.status==="outstanding"),error=errors[questionId],saving=busy[questionId];
 return <div className="question-flag-control">
  <button type="button" className={`question-flag-button ${active?"flagged":""}`} aria-pressed={active} aria-label={error?`Retry saving flag for question ${questionNumber}`:active?`Remove flag for question ${questionNumber}`:`Ask my tutor about question ${questionNumber}`} disabled={loading||!!loadError||saving} onClick={()=>void toggle(questionId)}><Flag size={15} fill={active?"currentColor":"none"} aria-hidden="true"/>{saving?"Saving flag…":error?"Retry flag change":active?"Flagged for tutor review ✓":"Ask my tutor"}</button>
  <span className="sr-only" role="status">{!saving&&!error&&(active?"This question is flagged for your tutor.":"This question has no active flag.")}</span>
  {active&&!error&&<small>Click again to remove.</small>}{error&&<p className="report-error" role="alert">{error}</p>}
 </div>;
}

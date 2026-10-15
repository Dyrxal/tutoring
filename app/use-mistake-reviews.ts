"use client";
import {useEffect,useRef,useState} from "react";
import type {SupabaseClient} from "@supabase/supabase-js";
import {initialiseReviews,fetchReviewSchedules,fetchAllReviewSettings,mergeReviewSchedule,reviewFallbackTimezone,ReviewError,type ReviewSchedule,type ReviewSettings} from "./mistake-review";

export function useMistakeReviews(client:SupabaseClient|null,actorId:string,studentId:string,initialise:boolean){
 const [rows,setRows]=useState<ReviewSchedule[]>([]),[settings,setSettings]=useState<ReviewSettings[]>([]),[timezone,setTimezone]=useState(reviewFallbackTimezone),[error,setError]=useState(""),[errorDetails,setErrorDetails]=useState(""),[loading,setLoading]=useState(!!client),[now,setNow]=useState(()=>new Date()),alive=useRef(false),generation=useRef(0);
 async function reload(){if(!client||!alive.current)return false;const request=++generation.current;setLoading(true);setError("");setErrorDetails("");
  try{const zone=initialise?(await initialiseReviews(client,studentId,Intl.DateTimeFormat().resolvedOptions().timeZone||reviewFallbackTimezone)).timezone:null;
   const [saved,config]=await Promise.all([fetchReviewSchedules(client,studentId),fetchAllReviewSettings(client)]);
   if(!alive.current||generation.current!==request)return false;setRows(saved);setSettings(config);setTimezone(zone||saved[0]?.timezone||config[0]?.fallback_timezone||reviewFallbackTimezone);setNow(new Date());return true;
  }catch(e){if(alive.current&&generation.current===request){setError((e as Error).message);setErrorDetails(e instanceof ReviewError?e.detail:"")}return false}
  finally{if(alive.current&&generation.current===request)setLoading(false)}
 }
 useEffect(()=>{alive.current=true;setRows([]);setSettings([]);setError("");void reload();const subscription=client?.auth.onAuthStateChange((_event,session)=>{if(session?.user.id!==actorId){alive.current=false;generation.current++}}).data.subscription;const clock=setInterval(()=>{if(alive.current)setNow(new Date())},60000);return()=>{alive.current=false;generation.current++;subscription?.unsubscribe();clearInterval(clock)}},[client,actorId,studentId,initialise]);
 return {rows,settings,setSettings,timezone,error,errorDetails,setError,loading,now,alive,generation,reload,merge:(row:ReviewSchedule)=>setRows(previous=>mergeReviewSchedule(previous,row))};
}

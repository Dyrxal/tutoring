import type {SupabaseClient} from "@supabase/supabase-js";

/** Fetch a stable, complete question set, optionally limited to a student's lessons. */
export async function fetchAllQuestions(client:SupabaseClient,lessonIds?:string[]){
 const data:any[]=[];
 if(lessonIds&&lessonIds.length===0)return {data,error:null};
 for(let from=0;;from+=500){
  let query=client.from("questions").select("*");
  if(lessonIds)query=query.in("lesson_id",lessonIds);
  const result=await query.order("position").order("id").range(from,from+499);
  if(result.error)return {data:null,error:result.error};
  data.push(...(result.data||[]));
  if((result.data||[]).length<500)return {data,error:null};
 }
}

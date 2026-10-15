import type {SupabaseClient} from "@supabase/supabase-js";

/** Fetch every question in stable order, rather than Supabase's first page only. */
export async function fetchAllQuestions(client:SupabaseClient){
 const data:any[]=[];
 for(let from=0;;from+=500){
  const result=await client.from("questions").select("*").order("position").order("id").range(from,from+499);
  if(result.error)return {data:null,error:result.error};
  data.push(...(result.data||[]));
  if((result.data||[]).length<500)return {data,error:null};
 }
}

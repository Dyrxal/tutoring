import type {SupabaseClient} from "@supabase/supabase-js";

export type AttemptSubmission={id:string;student_id:string;question_id:string;selected_index:number;is_correct:boolean;response_text?:string};

/** Reuse a submission ID after a network failure so retrying cannot double-save it. */
export async function savePracticeAttempt(client:SupabaseClient,row:AttemptSubmission){
 const result=await client.from("practice_attempts").insert(row).select("*").single();
 if(!result.error&&result.data)return result.data;
 if(result.error?.code==="23505"){
  const existing=await client.from("practice_attempts").select("*").eq("id",row.id).single();
  if(!existing.error&&existing.data&&existing.data.student_id===row.student_id&&existing.data.question_id===row.question_id&&existing.data.selected_index===row.selected_index&&(existing.data.response_text??null)===(row.response_text??null)&&existing.data.is_correct===row.is_correct)return existing.data;
 }
 throw new Error(result.error?.message||"The answer could not be saved.");
}

import type {SupabaseClient} from "@supabase/supabase-js";
export type QuestionFlag={id:string;student_id:string|null;course_id:string|null;lesson_id:string|null;question_id:string|null;status:"outstanding"|"reviewed"|"withdrawn";created_at:string;closed_at:string|null;reviewed_by:string|null;reviewer_name:string|null;context:{student_name?:string;course_title?:string;lesson_title?:string;chapter_title?:string;question_prompt?:string;question_number?:number}};
export type FlagAction={kind:"flag";id:string;questionId:string;studentId:string}|{kind:"withdraw";id:string;studentId:string};
function flagError(error:{code?:string;message?:string}|null){return (error?.code&&["PGRST202","PGRST205","42P01","42883"].includes(error.code)||error?.message?.includes("This trial is available only"))?"Question flags need their one-time database setup. Run 20261013_question_flags_all_lessons.sql to enable Year 9 and Year 10 flags.":error?.message||"The flag could not be saved. Please retry."}
export async function fetchQuestionFlags(client:SupabaseClient,lessonId?:string,studentId?:string){
 const rows:QuestionFlag[]=[];
 for(let offset=0;;offset+=500){let query=client.from("question_flags").select("*");if(lessonId)query=query.eq("lesson_id",lessonId);if(studentId)query=query.eq("student_id",studentId);const {data,error}=await query.order("created_at",{ascending:false}).order("id").range(offset,offset+499);if(error)throw new Error(flagError(error));rows.push(...(data||[]));if((data||[]).length<500)return rows}
}
export async function saveFlagAction(client:SupabaseClient,action:FlagAction){
 let {data,error}=action.kind==="flag"?await client.rpc("flag_question",{p_id:action.id,p_question_id:action.questionId,p_student_id:action.studentId}):await client.rpc("withdraw_question_flag",{p_id:action.id,p_student_id:action.studentId});
 // Keep the installed 1A trial working while the expansion SQL is pending.
 if(action.kind==="flag"&&error?.code==="PGRST202")({data,error}=await client.rpc("flag_question_1a",{p_id:action.id,p_question_id:action.questionId,p_student_id:action.studentId}));
 if(error||!data)throw new Error(flagError(error));return data as QuestionFlag;
}
export async function reviewQuestionFlag(client:SupabaseClient,id:string){const {data,error}=await client.rpc("review_question_flag",{p_id:id});if(error||!data)throw new Error(flagError(error));return data as QuestionFlag}
export function mergeFlag(rows:QuestionFlag[],saved:QuestionFlag){return [saved,...rows.filter(row=>row.id!==saved.id)]}
export type FlagAttempt={student_id:string;question_id:string;selected_index:number;is_correct:boolean;response_text?:string|null;attempted_at:string;id?:string};
export function flagPracticeContext(flag:QuestionFlag,attempts:FlagAttempt[]){const rows=attempts.filter(a=>a.student_id===flag.student_id&&a.question_id===flag.question_id).sort((a,b)=>b.attempted_at.localeCompare(a.attempted_at)||(b.id||"").localeCompare(a.id||""));return {count:rows.length,latest:rows[0],status:rows.length?(rows[0].is_correct?"Correct":"Incorrect"):"Unanswered"}}

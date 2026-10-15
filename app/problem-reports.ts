import type {SupabaseClient} from "@supabase/supabase-js";

export const reportCategories={incorrect_answer:"Incorrect answer",unclear_wording:"Unclear wording",formatting:"Formatting",other:"Other"} as const;
export const reportStatuses={new:"New",accepted:"Accepted",resolved:"Resolved",ignored:"Ignored"} as const;
export type ReportCategory=keyof typeof reportCategories;
export type ReportStatus=keyof typeof reportStatuses;
export type ProblemReport={id:string;student_id:string|null;course_id:string|null;lesson_id:string|null;question_id:string|null;category:ReportCategory;description:string;status:ReportStatus;created_at:string;updated_at:string;context:{student_name?:string;course_title?:string;lesson_title?:string;question_prompt?:string|null}};
export type ReportHistory={id:string;report_id:string;actor_id:string|null;actor_name:string;from_status:ReportStatus|null;to_status:ReportStatus;internal_note:string;created_at:string};
export type ReportSubmission={id:string;lessonId:string;questionId:string|null;category:ReportCategory;description:string};
export type ReportAction={id:string;reportId:string;expectedStatus:ReportStatus;status:ReportStatus;note:string};

export function reportError(error:{code?:string;message?:string}|null,student=false){
 if(error?.code&&["PGRST202","PGRST205","42P01","42883"].includes(error.code))return student?"Reporting is not available yet. Your tutor needs to finish setting it up. Your text has been kept.":"Reported Problems needs its one-time Supabase database setup. Run 20261012_problem_reports.sql from the project’s supabase/migrations folder, then refresh.";
 return error?.message||"The report could not be saved. Your text has been kept; please retry.";
}
export function validateReport(category:string,description:string){
 if(!Object.prototype.hasOwnProperty.call(reportCategories,category))return "Choose a category.";
 if(!description.trim())return "Describe the problem before submitting.";
 if(description.trim().length>4000)return "Keep your description within 4000 characters.";
 return undefined;
}
export async function submitProblemReport(client:SupabaseClient,row:ReportSubmission){
 const invalid=validateReport(row.category,row.description);if(invalid)throw new Error(invalid);
 const {data,error}=await client.rpc("submit_problem_report",{p_id:row.id,p_lesson_id:row.lessonId,p_question_id:row.questionId,p_category:row.category,p_description:row.description.trim()});
 if(error||!data)throw new Error(reportError(error,true));return data as ProblemReport;
}
export async function manageProblemReport(client:SupabaseClient,action:ReportAction){
 const {data,error}=await client.rpc("manage_problem_report",{p_action_id:action.id,p_report_id:action.reportId,p_expected_status:action.expectedStatus,p_status:action.status,p_internal_note:action.note});
 if(error||!data)throw new Error(reportError(error));return data as ProblemReport;
}
async function allRows(client:SupabaseClient,table:string,reportId?:string){
 const rows:unknown[]=[];
 for(let offset=0;;offset+=500){
  let query=client.from(table).select("*");if(reportId)query=query.eq("report_id",reportId);
  const {data,error}=await query.order("created_at",{ascending:false}).order("id").range(offset,offset+499);
  if(error)throw new Error(reportError(error));rows.push(...(data||[]));if((data||[]).length<500)return rows;
 }
}
export async function fetchProblemReports(client:SupabaseClient){return await allRows(client,"problem_reports") as ProblemReport[]}
export async function fetchReportHistory(client:SupabaseClient,reportId:string){return await allRows(client,"problem_report_history",reportId) as ReportHistory[]}
/** Verify the tutor-only history before confirming a decision or clearing its draft. */
export async function saveReportDecision(client:SupabaseClient,action:ReportAction){
 const report=await manageProblemReport(client,action);
 const history=await fetchReportHistory(client,action.reportId);
 const event=history.find(row=>row.id===action.id);
 if(!event||event.report_id!==action.reportId||event.from_status!==action.expectedStatus||event.to_status!==action.status||event.internal_note!==action.note.trim()){
  throw new Error("The status was saved, but the tutor note could not be confirmed in history. Your draft has been kept. Retry the original action; if this continues, reapply 20261012_problem_reports.sql.");
 }
 return {report,history};
}
export function latestTutorNote(history:ReportHistory[]){
 return [...history].filter(event=>event.internal_note.trim()).sort((a,b)=>b.created_at.localeCompare(a.created_at)||b.id.localeCompare(a.id))[0];
}
export function filterReports(reports:ProblemReport[],filters:{status:string;category:string;courseId:string;search:string}){
 const terms=filters.search.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
 return reports.filter(r=>(filters.status==="all"||r.status===filters.status)&&(filters.category==="all"||r.category===filters.category)&&(filters.courseId==="all"||r.course_id===filters.courseId)&&terms.every(term=>[r.description,r.context.student_name,r.context.course_title,r.context.lesson_title,r.context.question_prompt,reportCategories[r.category],r.id].join(" ").toLocaleLowerCase().includes(term)));
}

import type {SupabaseClient} from "@supabase/supabase-js";
import type {QuestionOptions} from "./question-types";
import type {Flow} from "./lesson-template";
export {lesson1AId as reviewPilotLessonId} from "./lesson1a-support";
export const reviewIntervals=[1,3,7,14,30,60];
export const reviewFallbackTimezone="Australia/Melbourne";
export type ReviewContext="lesson"|"scheduled_review"|"early_practice"|"review_retry";
export type ReviewAttempt={id:string;student_id:string;question_id:string;selected_index:number;is_correct:boolean;response_text?:string|null;attempted_at:string;attempt_context?:ReviewContext;review_help_used?:boolean;review_local_date?:string|null;review_outcome?:{stage:number;next_due:string;revision:number;timezone:string}|null};
export type ReviewSchedule={student_id:string;question_id:string;timezone:string;stage:number;next_due:string;last_scheduled_date:string|null;help_used_on?:string|null;revision:number;created_at:string;updated_at:string};
export type ReviewSettings={lesson_id:string;intervals:number[];fallback_timezone:string};
export type ReviewQuestion={id:string;prompt:string;options:QuestionOptions;correct_index:number;explanation:string;image_path?:string|null;image_alt?:string};
export type ReviewLesson={id:string;title:string;questions:ReviewQuestion[];notes:string;worked_example:string;video_url:string|null;notes_image_path?:string|null;notes_image_alt?:string;example_image_path?:string|null;example_image_alt?:string;lesson_flow?:Flow|null};
export type ReviewEntry={courseId:string;courseTitle:string;chapterId:string;chapterTitle:string;lesson:ReviewLesson};
export type ReviewSubmission={id:string;studentId:string;questionId:string;selectedIndex:number|null;responseText:string|null;helpUsed:boolean;revision:number;questionState:Pick<ReviewQuestion,"prompt"|"options"|"correct_index"|"explanation">};
export type ReviewResult={attempt:ReviewAttempt;schedule:ReviewSchedule};

export const isLessonAttempt=(attempt:{attempt_context?:string|null})=>!attempt.attempt_context||attempt.attempt_context==="lesson";
export const contextLabel=(context?:string)=>context==="scheduled_review"?"Scheduled review":context==="early_practice"?"Early practice":context==="review_retry"?"Same-day retry":"Lesson practice";
export function localReviewDate(zone=reviewFallbackTimezone,now=new Date()):string{
 try{const parts=new Intl.DateTimeFormat("en-CA",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(now);return `${parts.find(p=>p.type==="year")!.value}-${parts.find(p=>p.type==="month")!.value}-${parts.find(p=>p.type==="day")!.value}`}catch{return localReviewDate(reviewFallbackTimezone,now)}
}
export function reviewDateLabel(date:string){return new Intl.DateTimeFormat("en-AU",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(`${date}T12:00:00Z`))}
export function reviewQueue(rows:ReviewSchedule[],studentId:string,questionIds:string[],zone=reviewFallbackTimezone,now=new Date()){
 const owned=new Map<string,ReviewSchedule>(),allowed=new Set(questionIds),today=localReviewDate(zone,now);
 for(const row of rows){if(row.student_id!==studentId||!allowed.has(row.question_id))continue;const previous=owned.get(row.question_id);if(!previous||row.revision>previous.revision)owned.set(row.question_id,row)}
 const ordered=[...owned.values()].sort((a,b)=>a.next_due.localeCompare(b.next_due)||questionIds.indexOf(a.question_id)-questionIds.indexOf(b.question_id));
 return {due:ordered.filter(row=>row.next_due<=today),future:ordered.filter(row=>row.next_due>today),today};
}
export function mergeReviewSchedule(rows:ReviewSchedule[],saved:ReviewSchedule){const previous=rows.find(row=>row.student_id===saved.student_id&&row.question_id===saved.question_id);if(previous&&previous.revision>saved.revision)return rows;return [...rows.filter(row=>row.student_id!==saved.student_id||row.question_id!==saved.question_id),saved]}

export class ReviewError extends Error {code:string;detail:string;constructor(error:{code?:string;message?:string}|null){const setup=error?.code&&["PGRST202","PGRST205","42P01","42883","42703"].includes(error.code);super(setup?"Spaced review needs its one-time database setup: 20261013_mistake_review_all_lessons.sql.":error?.message||"The review could not be saved. Please retry.");this.code=error?.code||"";this.detail=[error?.code,error?.message].filter(Boolean).join(": ")}}
export async function initialiseReviews(client:SupabaseClient,studentId:string,timezone:string){const {data,error}=await client.rpc("initialise_mistake_reviews",{p_student_id:studentId,p_timezone:timezone});if(error||!data)throw new ReviewError(error);return data as {timezone:string;today:string;intervals:number[]}}
export async function fetchReviewSchedules(client:SupabaseClient,studentId:string){const rows:ReviewSchedule[]=[];for(let offset=0;;offset+=500){const {data,error}=await client.from("mistake_review_schedules").select("*").eq("student_id",studentId).order("next_due").order("question_id").range(offset,offset+499);if(error)throw new ReviewError(error);rows.push(...(data||[]));if((data||[]).length<500)return rows}}
export async function fetchReviewSettings(client:SupabaseClient,lessonId:string){const {data,error}=await client.from("mistake_review_settings").select("*").eq("lesson_id",lessonId).single();if(error||!data)throw new ReviewError(error);return data as ReviewSettings}
/** RLS returns settings only for content the current account can read. */
export async function fetchAllReviewSettings(client:SupabaseClient){const rows:ReviewSettings[]=[];for(let offset=0;;offset+=500){const {data,error}=await client.from("mistake_review_settings").select("*").order("lesson_id").range(offset,offset+499);if(error)throw new ReviewError(error);rows.push(...(data||[]));if((data||[]).length<500)return rows}}
export function availableReviewEntries(entries:ReviewEntry[],settings:ReviewSettings[]){const enabled=new Set(settings.map(row=>row.lesson_id));return entries.filter(entry=>enabled.has(entry.lesson.id)&&entry.lesson.questions.length>0)}
export function reviewEntryQuestions(entries:ReviewEntry[]){return new Map(entries.flatMap(entry=>entry.lesson.questions.map(question=>[question.id,{question,entry}] as const)))}
export function filterFutureReviews(rows:ReviewSchedule[],entries:ReviewEntry[],courseId="all",chapterKey="all"){const allowed=new Set(entries.filter(entry=>(courseId==="all"||entry.courseId===courseId)&&(chapterKey==="all"||`${entry.courseId}:${entry.chapterId}`===chapterKey)).flatMap(entry=>entry.lesson.questions.map(q=>q.id)));return rows.filter(row=>allowed.has(row.question_id))}
export async function saveReview(client:SupabaseClient,action:ReviewSubmission){const {data,error}=await client.rpc("submit_mistake_review",{p_id:action.id,p_student_id:action.studentId,p_question_id:action.questionId,p_selected_index:action.selectedIndex,p_response_text:action.responseText,p_help_used:action.helpUsed,p_revision:action.revision,p_question_state:action.questionState});if(error||!data?.attempt||!data?.schedule)throw new ReviewError(error);return data as ReviewResult}
export async function noteReviewHelp(client:SupabaseClient,studentId:string,questionId:string){const {data,error}=await client.rpc("note_mistake_review_help",{p_student_id:studentId,p_question_id:questionId});if(error||!data)throw new ReviewError(error);return data as ReviewSchedule}
export async function saveReviewSettings(client:SupabaseClient,tutorId:string,intervals:number[],lessonId?:string){if(intervals.length!==6||intervals[0]!==1||intervals.some((value,index)=>!Number.isInteger(value)||value<1||value>365||index>0&&value<=intervals[index-1]))throw new Error("Use six increasing day intervals, starting at 1 and ending at no more than 365.");const {data,error}=await client.rpc("configure_mistake_review",{p_tutor_id:tutorId,p_intervals:intervals,...(lessonId?{p_lesson_id:lessonId}:{})});if(error||!data)throw new ReviewError(error);return data as ReviewSettings}
export function reviewSummary(rows:ReviewSchedule[],attempts:ReviewAttempt[],studentId:string,questionIds:string[],timezone=reviewFallbackTimezone,now=new Date()){
 const queue=reviewQueue(rows,studentId,questionIds,timezone,now),ids=new Set(questionIds),history=attempts.filter(attempt=>attempt.student_id===studentId&&ids.has(attempt.question_id)&&!isLessonAttempt(attempt)),scheduled=history.filter(attempt=>attempt.attempt_context==="scheduled_review"),mistakeDates=new Map<string,Set<string>>();
 for(const attempt of scheduled){if(attempt.is_correct||!attempt.review_local_date)continue;const dates=mistakeDates.get(attempt.question_id)||new Set<string>();dates.add(attempt.review_local_date);mistakeDates.set(attempt.question_id,dates)}
 return {...queue,history,scheduled,accuracy:scheduled.length?Math.round(100*scheduled.filter(attempt=>attempt.is_correct).length/scheduled.length):null,repeated:[...mistakeDates].filter(([,dates])=>dates.size>1).map(([questionId,dates])=>({questionId,dates:dates.size}))};
}

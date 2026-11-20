import type {SupabaseClient} from "@supabase/supabase-js";

// Tasks reference the existing lesson catalogue. Completion is never stored twice.
export type TaskLesson={id:string;title:string;position:number;questions:{id:string}[]};
export type TaskCourse={id:string;title:string;modules:{id:string;title:string;position:number;lessons:TaskLesson[]}[]};
export type LessonTask={course:TaskCourse;chapter:TaskCourse["modules"][number];lesson:TaskLesson};
export type QuestionScope="lesson"|"core"|"all";
export type TaskAttempt={student_id:string;question_id:string;attempt_context?:string|null};
export type ExtraTask={id:string;student_id:string;lesson_id:string;assigned_by:string|null;assigned_at:string;sort_order:number;removed_at:string|null;removed_by:string|null;question_scope?:QuestionScope;due_date?:string|null};
export type TaskSelection={id:string;lesson_id:string;sort_order:number;question_scope?:QuestionScope;due_date?:string|null};

export function practiceTasks(courses:TaskCourse[]):LessonTask[]{
 return courses.flatMap(course=>[...course.modules].sort((a,b)=>a.position-b.position||a.id.localeCompare(b.id)).flatMap(chapter=>[...chapter.lessons].sort((a,b)=>a.position-b.position||a.id.localeCompare(b.id)).filter(lesson=>lesson.questions.length>0).map(lesson=>({course,chapter,lesson}))));
}
export function automaticNextTask(courses:TaskCourse[],completed:string[],lastLessonId?:string|null):LessonTask|undefined{
 const tasks=practiceTasks(courses),done=new Set(completed),preferred=courses.find(course=>course.modules.some(chapter=>chapter.lessons.some(lesson=>lesson.id===lastLessonId)))?.id;
 // Resume the last-used course, taking its first unfinished practice lesson in order.
 return tasks.find(t=>t.course.id===preferred&&!done.has(t.lesson.id))||tasks.find(t=>!done.has(t.lesson.id));
}
export function questionRequirement(lesson:TaskLesson,scope:QuestionScope,studentId:string,attempts:TaskAttempt[]){
 const required=scope==="all"?lesson.questions:lesson.questions.slice(0,8);
 const answered=new Set(attempts.filter(attempt=>attempt.student_id===studentId&&(attempt.attempt_context??"lesson")==="lesson").map(attempt=>attempt.question_id));
 const answeredCount=required.filter(question=>answered.has(question.id)).length;
 return {requiredCount:required.length,answeredCount,completed:required.length>0&&answeredCount===required.length};
}
export function requirementLabel(scope?:QuestionScope){
 return scope==="all"?"All core + optional questions":scope==="core"?"All core questions":"Complete the lesson";
}
export function taskDeadline(date:string|null|undefined,timezone="Australia/Sydney",now=new Date()){
 if(!date)return "No deadline";
 let today:string;
 try{today=new Intl.DateTimeFormat("en-CA",{timeZone:timezone,year:"numeric",month:"2-digit",day:"2-digit"}).format(now)}
 catch{today=new Intl.DateTimeFormat("en-CA",{timeZone:"Australia/Sydney",year:"numeric",month:"2-digit",day:"2-digit"}).format(now)}
 const formatted=new Intl.DateTimeFormat("en-AU",{timeZone:"UTC",day:"numeric",month:"short",year:"numeric"}).format(new Date(date+"T12:00:00Z"));
 return date<today?"Overdue · "+formatted:date===today?"Due today · "+formatted:"Due "+formatted;
}
export function extraTaskItems(rows:ExtraTask[],studentId:string,courses:TaskCourse[],completed:string[],automaticId?:string,attempts:TaskAttempt[]=[]){
 const catalogue=new Map(practiceTasks(courses).map(task=>[task.lesson.id,task])),done=new Set(completed),seen=new Set<string>();
 return [...rows].sort((a,b)=>a.assigned_at.localeCompare(b.assigned_at)||a.sort_order-b.sort_order||a.id.localeCompare(b.id)).flatMap(row=>{
  const task=catalogue.get(row.lesson_id);
  if(row.student_id!==studentId||row.removed_at||!task||seen.has(row.lesson_id))return [];
  seen.add(row.lesson_id);
  const progress=questionRequirement(task.lesson,row.question_scope??"lesson",studentId,attempts);
  return [{row,task,...progress,completed:!row.question_scope||row.question_scope==="lesson"?done.has(row.lesson_id):progress.completed,isAutomatic:row.lesson_id===automaticId}];
 });
}
export function taskSaveError(error:{code?:string;message?:string}|null):string{
 return error?.code&&["PGRST202","PGRST205","42P01","42883"].includes(error.code)?"Tutor-added tasks need their one-time database setup. Run 20261012_next_tasks.sql in Supabase SQL Editor.":error?.message||"Tasks could not be saved. Please retry.";
}
export async function fetchExtraTasks(client:SupabaseClient,studentId:string){
 const rows:ExtraTask[]=[];
 for(let offset=0;;offset+=500){const {data,error}=await client.from("student_lesson_tasks").select("*").eq("student_id",studentId).order("assigned_at").order("sort_order").order("id").range(offset,offset+499);if(error)throw new Error(taskSaveError(error));rows.push(...(data||[]));if((data||[]).length<500)return rows;}
}
export async function addExtraTasks(client:SupabaseClient,tutorId:string,studentId:string,items:TaskSelection[]){
 const {data,error}=await client.rpc("assign_student_lesson_tasks",{p_tutor_id:tutorId,p_student_id:studentId,p_items:items});
 if(error||!Array.isArray(data))throw new Error(taskSaveError(error));
 const saved=data as ExtraTask[];
 if(items.some(item=>item.question_scope&&!saved.some(row=>row.student_id===studentId&&row.lesson_id===item.lesson_id&&row.question_scope===item.question_scope&&(row.due_date??null)===(item.due_date??null)))){
  throw new Error("The assignment requirements were not confirmed. Reload tasks and try again.");
 }
 return saved;
}
export async function removeExtraTask(client:SupabaseClient,tutorId:string,id:string){
 const {data,error}=await client.rpc("remove_student_lesson_task",{p_tutor_id:tutorId,p_id:id});
 if(error||!data)throw new Error(taskSaveError(error));return data as ExtraTask;
}
export function mergeExtraTasks(rows:ExtraTask[],saved:ExtraTask[]){const byId=new Map(rows.map(row=>[row.id,row]));for(const row of saved)byId.set(row.id,row);return [...byId.values()];}

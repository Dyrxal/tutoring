import type {SupabaseClient} from "@supabase/supabase-js";

// Tasks reference the existing lesson catalogue. Completion is never stored twice.
export type TaskLesson={id:string;title:string;position:number;questions:{id:string}[]};
export type TaskCourse={id:string;title:string;modules:{id:string;title:string;position:number;lessons:TaskLesson[]}[]};
export type LessonTask={course:TaskCourse;chapter:TaskCourse["modules"][number];lesson:TaskLesson};
export type ExtraTask={id:string;student_id:string;lesson_id:string;assigned_by:string|null;assigned_at:string;sort_order:number;removed_at:string|null;removed_by:string|null};
export type TaskSelection={id:string;lesson_id:string;sort_order:number};

export function practiceTasks(courses:TaskCourse[]):LessonTask[]{
 return courses.flatMap(course=>[...course.modules].sort((a,b)=>a.position-b.position||a.id.localeCompare(b.id)).flatMap(chapter=>[...chapter.lessons].sort((a,b)=>a.position-b.position||a.id.localeCompare(b.id)).filter(lesson=>lesson.questions.length>0).map(lesson=>({course,chapter,lesson}))));
}
export function automaticNextTask(courses:TaskCourse[],completed:string[],lastLessonId?:string|null):LessonTask|undefined{
 const tasks=practiceTasks(courses),done=new Set(completed),preferred=courses.find(course=>course.modules.some(chapter=>chapter.lessons.some(lesson=>lesson.id===lastLessonId)))?.id;
 // Resume the last-used course, taking its first unfinished practice lesson in order.
 return tasks.find(t=>t.course.id===preferred&&!done.has(t.lesson.id))||tasks.find(t=>!done.has(t.lesson.id));
}
export function extraTaskItems(rows:ExtraTask[],studentId:string,courses:TaskCourse[],completed:string[],automaticId?:string){
 const catalogue=new Map(practiceTasks(courses).map(task=>[task.lesson.id,task])),done=new Set(completed),seen=new Set<string>();
 return [...rows].sort((a,b)=>a.assigned_at.localeCompare(b.assigned_at)||a.sort_order-b.sort_order||a.id.localeCompare(b.id)).flatMap(row=>{
  const task=catalogue.get(row.lesson_id);
  if(row.student_id!==studentId||row.removed_at||!task||seen.has(row.lesson_id))return [];
  seen.add(row.lesson_id);
  return [{row,task,completed:done.has(row.lesson_id),isAutomatic:row.lesson_id===automaticId}];
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
 if(error||!Array.isArray(data))throw new Error(taskSaveError(error));return data as ExtraTask[];
}
export async function removeExtraTask(client:SupabaseClient,tutorId:string,id:string){
 const {data,error}=await client.rpc("remove_student_lesson_task",{p_tutor_id:tutorId,p_id:id});
 if(error||!data)throw new Error(taskSaveError(error));return data as ExtraTask;
}
export function mergeExtraTasks(rows:ExtraTask[],saved:ExtraTask[]){const byId=new Map(rows.map(row=>[row.id,row]));for(const row of saved)byId.set(row.id,row);return [...byId.values()];}

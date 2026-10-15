"use client";
import {useEffect,useRef,useState} from "react";
import type {SupabaseClient} from "@supabase/supabase-js";
import {ChevronRight,Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {automaticNextTask,practiceTasks,extraTaskItems,fetchExtraTasks,addExtraTasks,removeExtraTask,mergeExtraTasks,type TaskCourse,type LessonTask,type ExtraTask,type TaskSelection} from "./next-tasks";

type Shared={client:SupabaseClient|null;studentId:string;courses:TaskCourse[];completed:string[];lastLessonId?:string|null};
function useExtraTasks(client:SupabaseClient|null,studentId:string,actorId:string){
 const [rows,setRows]=useState<ExtraTask[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(!!client),alive=useRef(false),revision=useRef(0);
 async function reload(){if(!client||!alive.current)return;const generation=++revision.current;setLoading(true);setError("");try{const data=await fetchExtraTasks(client,studentId);if(alive.current&&revision.current===generation)setRows(data)}catch(e){if(alive.current&&revision.current===generation)setError((e as Error).message)}finally{if(alive.current&&revision.current===generation)setLoading(false)}}
 useEffect(()=>{alive.current=true;setRows([]);setError("");setLoading(!!client);void reload();
  const subscription=client?.auth.onAuthStateChange((_event,session)=>{if(session?.user.id!==actorId){alive.current=false;revision.current++}}).data.subscription;
  return()=>{alive.current=false;revision.current++;subscription?.unsubscribe()};
 },[client,studentId,actorId]);
 return {rows,setRows,error,setError,loading,alive,revision,reload};
}
function TaskTitle({task}:{task:LessonTask}){return <div className="next-task-copy"><h3>{task.lesson.title}</h3><p>{task.course.title} · {task.chapter.title}</p></div>}
export function StudentNextTasks({client,studentId,courses,completed,lastLessonId,onOpen}:Shared&{onOpen:(task:LessonTask)=>void}){
 const {rows,error,loading,reload}=useExtraTasks(client,studentId,studentId),automatic=automaticNextTask(courses,completed,lastLessonId),all=extraTaskItems(rows,studentId,courses,completed,automatic?.lesson.id),extras=all.filter(item=>!item.completed&&!item.isAutomatic),automaticAssigned=all.some(item=>item.isAutomatic),hasPractice=practiceTasks(courses).length>0;
 return <section className="next-tasks"><h2>Your next task</h2>{automatic?<div className="next-task-primary"><div><span className="eyebrow">NEXT SUBCHAPTER{automaticAssigned?" · TUTOR ASSIGNED":""}</span><TaskTitle task={automatic}/><p className="muted">Work through the core questions, then complete the lesson. Your next task updates automatically.</p></div><Button onClick={()=>onOpen(automatic)}>Continue <ChevronRight size={17}/></Button></div>:<div className="empty">{hasPractice?"You’ve completed all available practice subchapters in your courses.":courses.length?"Practice tasks will appear when your tutor adds questions to a lesson.":"Choose your year level in Account to access your course and next task."}</div>}
  {extras.length>0&&<div className="next-task-extras"><h3>Also assigned by your tutor <span className="muted">({extras.length})</span></h3><p className="muted">Work on these alongside your next subchapter. Completed tasks clear automatically.</p>{extras.map(({row,task})=><div className="next-task-row" key={row.id}><TaskTitle task={task}/><Button variant="outline" onClick={()=>onOpen(task)}>Open <ChevronRight size={16}/></Button></div>)}</div>}
  {loading&&<p className="muted" role="status">Checking tutor-added tasks…</p>}{error&&<div><p className="muted" role="status">Extra tutor tasks could not be loaded. Your automatic next task is still available.</p><Button variant="outline" onClick={()=>void reload()}>Retry loading extra tasks</Button></div>}
 </section>;
}

export function TutorStudentTasks(props:Shared&{tutorId:string}){
 const [open,setOpen]=useState(false),automatic=automaticNextTask(props.courses,props.completed,props.lastLessonId);
 return <div className="tutor-student-tasks"><div className="next-task-row"><div><strong>Next task</strong><p className="muted">{automatic?.lesson.title||(practiceTasks(props.courses).length?"All practice subchapters completed":props.courses.length?"Add practice questions to start":"Enrol in a course to start")}</p></div><Button variant="outline" aria-expanded={open} aria-controls={`student-tasks-${props.studentId}`} onClick={()=>setOpen(!open)}>{open?"Close tasks":"Manage extra tasks"}</Button></div>{open&&<TutorExtraTaskEditor {...props}/>}</div>;
}
function TutorExtraTaskEditor({client,studentId,tutorId,courses,completed,lastLessonId}:Shared&{tutorId:string}){
 const {rows,setRows,error,setError,loading,alive,revision,reload}=useExtraTasks(client,studentId,tutorId),[courseId,setCourseId]=useState(""),[chapterId,setChapterId]=useState(""),[selected,setSelected]=useState<string[]>([]),[saving,setSaving]=useState(false),[notice,setNotice]=useState(""),pending=useRef<TaskSelection[]|null>(null),lock=useRef(false);
 const automatic=automaticNextTask(courses,completed,lastLessonId),items=extraTaskItems(rows,studentId,courses,completed,automatic?.lesson.id),done=new Set(completed),assigned=new Set(items.map(item=>item.task.lesson.id)),available=practiceTasks(courses).filter(task=>!done.has(task.lesson.id)&&!assigned.has(task.lesson.id)),shown=available.filter(task=>(!courseId||task.course.id===courseId)&&(!chapterId||task.chapter.id===chapterId)),chapters=courses.filter(course=>!courseId||course.id===courseId).flatMap(course=>course.modules.map(chapter=>({course,chapter}))),active=items.filter(item=>!item.completed),finished=items.filter(item=>item.completed);
 function changeSelection(ids:string[]){pending.current=null;setSelected(ids);setNotice("")}
 async function save(){if(!client||lock.current||!selected.length)return;lock.current=true;setSaving(true);setError("");setNotice("");const generation=revision.current;
  const selection=pending.current||(pending.current=selected.map((lesson_id,sort_order)=>({id:crypto.randomUUID(),lesson_id,sort_order})));
  try{const saved=await addExtraTasks(client,tutorId,studentId,selection);if(!alive.current||revision.current!==generation)return;setRows(v=>mergeExtraTasks(v,saved));pending.current=null;setSelected([]);setNotice("Extra subchapters saved. They will appear on the student’s dashboard.")}
  catch(e){if(alive.current&&revision.current===generation)setError((e as Error).message)}finally{lock.current=false;if(alive.current&&revision.current===generation)setSaving(false)}
 }
 async function remove(id:string){if(!client||lock.current)return;lock.current=true;setSaving(true);setError("");setNotice("");const generation=revision.current;
  try{const saved=await removeExtraTask(client,tutorId,id);if(!alive.current||revision.current!==generation)return;setRows(v=>mergeExtraTasks(v,[saved]));setNotice("Extra task removed. Lesson progress has been preserved.")}
  catch(e){if(alive.current&&revision.current===generation)setError((e as Error).message)}finally{lock.current=false;if(alive.current&&revision.current===generation)setSaving(false)}
 }
 return <div className="extra-task-editor" id={`student-tasks-${studentId}`}><p className="muted">The next unfinished practice subchapter is automatic. Add any number of extra subchapters from this student’s enrolled courses; completing a lesson clears its task.</p>
  {loading?<p role="status">Loading tasks…</p>:<>
   {active.length>0&&<div><h4>Tutor-added tasks ({active.length})</h4>{active.map(({row,task,isAutomatic})=><div className="next-task-row" key={row.id}><TaskTitle task={task}/><div>{isAutomatic&&<span className="muted">Also the automatic next task </span>}<Button variant="outline" disabled={saving} onClick={()=>remove(row.id)}>Remove extra task</Button></div></div>)}</div>}
   {finished.length>0&&<details className="completed-tasks"><summary>Completed tutor-added tasks ({finished.length})</summary>{finished.map(({row,task})=><div className="next-task-row" key={row.id}><TaskTitle task={task}/><span>Completed</span></div>)}</details>}
   <div className="task-filters"><label>Course<select value={courseId} disabled={saving} onChange={e=>{setCourseId(e.target.value);setChapterId("")}}><option value="">All enrolled courses</option>{courses.map(course=><option key={course.id} value={course.id}>{course.title}</option>)}</select></label><label>Chapter<select value={chapterId} disabled={saving} onChange={e=>setChapterId(e.target.value)}><option value="">All chapters</option>{chapters.map(({course,chapter})=><option key={chapter.id} value={chapter.id}>{courses.length>1?`${course.title} · `:""}{chapter.title}</option>)}</select></label></div>
   <fieldset className="task-options" disabled={saving||!!error}><legend>Add extra subchapters</legend>{shown.length>0?<><div className="task-select-actions"><button type="button" onClick={()=>changeSelection([...new Set([...selected,...shown.map(t=>t.lesson.id)])])}>Select all shown</button><button type="button" onClick={()=>changeSelection([])}>Clear selection</button></div>{shown.map(task=><label className="task-option" key={task.lesson.id}><input type="checkbox" checked={selected.includes(task.lesson.id)} onChange={e=>changeSelection(e.target.checked?[...selected,task.lesson.id]:selected.filter(id=>id!==task.lesson.id))}/><span><strong>{task.lesson.title}</strong><small>{task.course.title} · {task.chapter.title}</small></span></label>)}</>:<p className="muted">No unassigned, unfinished practice subchapters match these filters.</p>}</fieldset>
   <div className="next-task-row"><span className="muted">{selected.length} selected across all filters</span><Button disabled={!client||saving||!selected.length} onClick={save}><Plus size={16}/>{saving?"Saving…":error&&pending.current?"Retry saving":"Add selected subchapters"}</Button></div>
  </>}
  {error&&<div className="report-error" role="alert"><p>{error}</p>{error.includes("one-time database setup")&&<a href="/setup/20261012_next_tasks.sql" download>Download next-task setup SQL</a>}<Button variant="outline" disabled={saving} onClick={()=>pending.current?void save():void reload()}>{pending.current?"Retry saving":"Reload tasks"}</Button></div>}{notice&&<p className="task-success" role="status">{notice}</p>}
 </div>;
}

"use client";
import {useEffect,useRef,useState} from "react";
import type {SupabaseClient} from "@supabase/supabase-js";
import {ChevronRight,Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {automaticNextTask,practiceTasks,extraTaskItems,fetchExtraTasks,addExtraTasks,removeExtraTask,mergeExtraTasks,questionRequirement,requirementLabel,taskDeadline,type TaskAttempt,type QuestionScope,type TaskCourse,type LessonTask,type ExtraTask,type TaskSelection} from "./next-tasks";

type Shared={client:SupabaseClient|null;studentId:string;courses:TaskCourse[];completed:string[];lastLessonId?:string|null;attempts?:TaskAttempt[];progressReady?:boolean;timezone?:string};
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
export function StudentNextTasks({client,studentId,courses,completed,lastLessonId,onOpen,showAutomatic=true,attempts=[],progressReady=true,timezone="Australia/Sydney"}:Shared&{showAutomatic?:boolean;onOpen:(task:LessonTask)=>void}){
 const {rows,error,loading,reload}=useExtraTasks(client,studentId,studentId),automatic=automaticNextTask(courses,completed,lastLessonId),all=extraTaskItems(rows,studentId,courses,completed,automatic?.lesson.id,attempts),extras=all.filter(item=>!item.completed&&(!showAutomatic||!item.isAutomatic)),automaticAssigned=all.some(item=>item.isAutomatic),hasPractice=practiceTasks(courses).length>0;
 if(!showAutomatic)return <AssignedTasksCard items={extras} loading={loading||!progressReady} timezone={timezone} error={error} onRetry={()=>void reload()} onOpen={onOpen}/>;
 return <section className="next-tasks"><h2>Your next task</h2>{automatic?<div className="next-task-primary"><div><span className="eyebrow">NEXT SUBCHAPTER{automaticAssigned?" · TUTOR ASSIGNED":""}</span><TaskTitle task={automatic}/><p className="muted">Work through the core questions, then complete the lesson. Your next task updates automatically.</p></div><Button onClick={()=>onOpen(automatic)}>Continue <ChevronRight size={17}/></Button></div>:<div className="empty">{hasPractice?"You’ve completed all available practice subchapters in your courses.":courses.length?"Practice tasks will appear when your tutor adds questions to a lesson.":"Choose your year level in Account to access your course and next task."}</div>}
  {extras.length>0&&<div className="next-task-extras"><h3>Also assigned by your tutor <span className="muted">({extras.length})</span></h3><p className="muted">Work on these alongside your next subchapter. Completed tasks clear automatically.</p>{extras.map(({row,task})=><div className="next-task-row" key={row.id}><TaskTitle task={task}/><Button variant="outline" onClick={()=>onOpen(task)}>Open <ChevronRight size={16}/></Button></div>)}</div>}
  {loading&&<p className="muted" role="status">Checking tutor-added tasks…</p>}{error&&<div><p className="muted" role="status">Extra tutor tasks could not be loaded. Your automatic next task is still available.</p><Button variant="outline" onClick={()=>void reload()}>Retry loading extra tasks</Button></div>}
 </section>;
}

function AssignedTasksCard({items,loading,error,onRetry,onOpen,timezone}:{
 items:ReturnType<typeof extraTaskItems>;loading:boolean;error:string;timezone:string;
 onRetry:()=>void;onOpen:(task:LessonTask)=>void;
}){
 const card=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const section=document.querySelector(".student-dashboard-continue");
  if(!section||!card.current)return;
  const observer=new ResizeObserver(entries=>{
   const height=entries[0].target.getBoundingClientRect().height+"px";
   if(card.current){card.current.style.height=height;card.current.style.minHeight=height}
  });
  const observeCard=()=>{
   observer.disconnect();
   const reference=section.querySelector(".student-dashboard-lesson-card, .student-dashboard-empty");
   if(reference)observer.observe(reference);
  };
  const changes=new MutationObserver(observeCard);
  changes.observe(section,{childList:true});
  observeCard();
  return()=>{observer.disconnect();changes.disconnect()};
 },[]);
 return <section className="student-dashboard-assigned" aria-labelledby="assigned-tasks-heading">
  <div className="dashboard-section-heading"><div><h2 id="assigned-tasks-heading">Assigned tasks</h2><p>Tasks your tutor has chosen for you.</p></div></div>
  <div ref={card} className="student-dashboard-lesson-card assigned-tasks-card">
   {loading?<p className="dashboard-lesson-description" role="status">Loading assigned tasks…</p>
    :error?<div><p role="alert">Your assigned tasks could not be loaded.</p><Button variant="outline" onClick={onRetry}>Try again</Button></div>
    :items.length?<ul className="assigned-tasks-list">{items.map(({row,task,answeredCount,requiredCount})=><li key={row.id}>
     <div className="dashboard-lesson-copy"><span className="dashboard-course-context">{task.course.title} · {task.chapter.title}</span><h3>{task.lesson.title}</h3><p className="dashboard-lesson-description">{requirementLabel(row.question_scope)}</p><p className="assignment-details">{taskDeadline(row.due_date,timezone)}{row.question_scope&&row.question_scope!=="lesson"&&<> · {answeredCount} of {requiredCount} answered</>}</p></div>
     <Button className="dashboard-continue-button" onClick={()=>onOpen(task)}>Open task <ChevronRight size={17}/></Button>
    </li>)}</ul>
    :<div className="dashboard-lesson-copy"><h3>No tasks assigned yet</h3><p className="dashboard-lesson-description">Tasks will appear here when your tutor assigns them.</p></div>}
  </div>
 </section>;
}

export function TutorStudentTasks(props:Shared&{tutorId:string}){
 const [open,setOpen]=useState(false),automatic=automaticNextTask(props.courses,props.completed,props.lastLessonId);
 return <div className="tutor-student-tasks"><div className="next-task-row"><div><strong>Next task</strong><p className="muted">{automatic?.lesson.title||(practiceTasks(props.courses).length?"All practice subchapters completed":props.courses.length?"Add practice questions to start":"Enrol in a course to start")}</p></div><Button variant="outline" aria-expanded={open} aria-controls={`student-tasks-${props.studentId}`} onClick={()=>setOpen(!open)}>{open?"Close tasks":"Manage extra tasks"}</Button></div>{open&&<TutorExtraTaskEditor {...props}/>}</div>;
}
function TutorExtraTaskEditor({client,studentId,tutorId,courses,completed,lastLessonId,attempts=[],timezone="Australia/Sydney"}:Shared&{tutorId:string}){
 const {rows,setRows,error,setError,loading,alive,revision,reload}=useExtraTasks(client,studentId,tutorId),[courseId,setCourseId]=useState(""),[chapterId,setChapterId]=useState(""),[selected,setSelected]=useState<string[]>([]),[questionScopes,setQuestionScopes]=useState<Record<string,QuestionScope>>({}),[dueDate,setDueDate]=useState(""),[saving,setSaving]=useState(false),[notice,setNotice]=useState(""),pending=useRef<TaskSelection[]|null>(null),lock=useRef(false);
 const automatic=automaticNextTask(courses,completed,lastLessonId),items=extraTaskItems(rows,studentId,courses,completed,automatic?.lesson.id,attempts),assigned=new Set(items.map(item=>item.task.lesson.id)),available=practiceTasks(courses).filter(task=>!questionRequirement(task.lesson,"all",studentId,attempts).completed&&!assigned.has(task.lesson.id)),shown=available.filter(task=>(!courseId||task.course.id===courseId)&&(!chapterId||task.chapter.id===chapterId)),chapters=courses.filter(course=>!courseId||course.id===courseId).flatMap(course=>course.modules.map(chapter=>({course,chapter}))),active=items.filter(item=>!item.completed),finished=items.filter(item=>item.completed);
 const chapterGroups=chapters.map(({course,chapter})=>({course,chapter,tasks:shown.filter(task=>task.course.id===course.id&&task.chapter.id===chapter.id)})).filter(group=>group.tasks.length>0);
 function selectedScope(lessonId:string):QuestionScope{
  if(questionScopes[lessonId])return questionScopes[lessonId];
  const lesson=practiceTasks(courses).find(task=>task.lesson.id===lessonId)?.lesson;
  return lesson&&questionRequirement(lesson,"core",studentId,attempts).completed?"all":"core";
 }
 function changeSelection(ids:string[]){pending.current=null;setSelected(ids);setNotice("")}
 async function save(){if(!client||lock.current||!selected.length)return;lock.current=true;setSaving(true);setError("");setNotice("");const generation=revision.current;
  const selection=pending.current||(pending.current=selected.map((lesson_id,sort_order)=>({id:crypto.randomUUID(),lesson_id,sort_order,question_scope:selectedScope(lesson_id),due_date:dueDate||null})));
  try{const saved=await addExtraTasks(client,tutorId,studentId,selection);if(!alive.current||revision.current!==generation)return;setRows(v=>mergeExtraTasks(v,saved));pending.current=null;setSelected([]);setQuestionScopes({});setNotice("Extra subchapters saved. They will appear on the student’s dashboard.")}
  catch(e){if(alive.current&&revision.current===generation)setError((e as Error).message)}finally{lock.current=false;if(alive.current&&revision.current===generation)setSaving(false)}
 }
 async function remove(id:string){if(!client||lock.current)return;lock.current=true;setSaving(true);setError("");setNotice("");const generation=revision.current;
  try{const saved=await removeExtraTask(client,tutorId,id);if(!alive.current||revision.current!==generation)return;setRows(v=>mergeExtraTasks(v,[saved]));setNotice("Extra task removed. Lesson progress has been preserved.")}
  catch(e){if(alive.current&&revision.current===generation)setError((e as Error).message)}finally{lock.current=false;if(alive.current&&revision.current===generation)setSaving(false)}
 }
 return <div className="extra-task-editor" id={`student-tasks-${studentId}`}><p className="muted">The next unfinished practice subchapter is automatic. Choose practice lessons, the questions to complete and a due date. Tasks clear when the student has answered every required question.</p>
  {loading?<p role="status">Loading tasks…</p>:<>
   {active.length>0&&<div><h4>Tutor-added tasks ({active.length})</h4>{active.map(({row,task,isAutomatic})=><div className="next-task-row" key={row.id}><div><TaskTitle task={task}/><p className="muted">{requirementLabel(row.question_scope)} · {taskDeadline(row.due_date,timezone)}</p></div><div>{isAutomatic&&<span className="muted">Also the automatic next task </span>}<Button variant="outline" disabled={saving} onClick={()=>remove(row.id)}>Remove extra task</Button></div></div>)}</div>}
   {finished.length>0&&<details className="completed-tasks"><summary>Completed tutor-added tasks ({finished.length})</summary>{finished.map(({row,task})=><div className="next-task-row" key={row.id}><TaskTitle task={task}/><span>Completed</span></div>)}</details>}
   <div className="task-filters task-assignment-filters"><label>Course<select value={courseId} disabled={saving} onChange={e=>{setCourseId(e.target.value);setChapterId("")}}><option value="">All enrolled courses</option>{courses.map(course=><option key={course.id} value={course.id}>{course.title}</option>)}</select></label><label>Chapter<select value={chapterId} disabled={saving} onChange={e=>setChapterId(e.target.value)}><option value="">All chapters</option>{chapters.map(({course,chapter})=><option key={chapter.id} value={chapter.id}>{courses.length>1?`${course.title} · `:""}{chapter.title}</option>)}</select></label><label>Due date (optional)<input type="date" value={dueDate} disabled={saving||!!pending.current} onChange={event=>{setDueDate(event.target.value);setNotice("")}}/></label></div>
   <fieldset className="task-options" disabled={saving||!!error}><legend>Add extra subchapters</legend>{shown.length>0?<><div className="task-select-actions"><button type="button" onClick={()=>changeSelection([...new Set([...selected,...shown.map(t=>t.lesson.id)])])}>Select all matching</button><button type="button" onClick={()=>changeSelection([])}>Clear selection</button></div>{chapterGroups.map(({course,chapter,tasks})=><details className="task-chapter" key={`${course.id}:${chapter.id}`}>
    <summary><ChevronRight size={16} aria-hidden="true"/><span className="task-chapter-title"><strong>{chapter.title}</strong><small>{course.title}</small></span><span className="task-chapter-count">{tasks.filter(task=>selected.includes(task.lesson.id)).length} of {tasks.length} selected</span></summary>
    <div className="task-chapter-options">{tasks.map(task=>{
    const chosen=selected.includes(task.lesson.id);
    const coreAnswered=questionRequirement(task.lesson,"core",studentId,attempts).completed;
    const scope=selectedScope(task.lesson.id);
    const scopeId=`task-scope-${studentId}-${task.lesson.id}`;
    return <div className="task-option-group" key={task.lesson.id}>
     <label className="task-option"><input type="checkbox" checked={chosen} onChange={event=>changeSelection(event.target.checked?[...selected,task.lesson.id]:selected.filter(id=>id!==task.lesson.id))}/><span><strong>{task.lesson.title}</strong></span></label>
     {chosen&&<div className="task-requirement">
      <label htmlFor={scopeId}>Questions to complete</label>
      <select id={scopeId} value={scope} disabled={saving||!!pending.current} onChange={event=>{pending.current=null;setQuestionScopes(values=>({...values,[task.lesson.id]:event.target.value as QuestionScope}));setNotice("")}}>
       <option value="core" disabled={coreAnswered}>{coreAnswered?"All core questions (already answered)":"All core questions"}</option>
       <option value="all">All core + optional questions</option>
      </select>
     </div>}
    </div>;
   })}</div></details>)}</>:<p className="muted">No unassigned, unfinished practice subchapters match these filters.</p>}</fieldset>
   <div className="next-task-row"><span className="muted">{selected.length} selected across all filters</span><Button disabled={!client||saving||!selected.length} onClick={save}><Plus size={16}/>{saving?"Saving…":error&&pending.current?"Retry saving":"Add selected subchapters"}</Button></div>
  </>}
  {error&&<div className="report-error" role="alert"><p>{error}</p>{error.includes("one-time database setup")&&<a href="/setup/20261012_next_tasks.sql" download>Download next-task setup SQL</a>}<Button variant="outline" disabled={saving} onClick={()=>pending.current?void save():void reload()}>{pending.current?"Retry saving":"Reload tasks"}</Button></div>}{notice&&<p className="task-success" role="status">{notice}</p>}
 </div>;
}

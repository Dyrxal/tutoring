"use client";
import {useMemo,useState,type ReactNode} from "react";
import {Search,ArrowLeft,Check,Clock3,ChevronDown,AlertCircle,Target,Users,Activity,BookOpen,CalendarDays} from "lucide-react";
import {Progress} from "@/components/ui/progress";
import MathText from "./MathText";
import {StudentAvatar} from "./StudentAvatar";
import {isShortAnswer,type QuestionOptions} from "./question-types";
import type {SupabaseClient} from "@supabase/supabase-js";
import TutorMistakeReview from "./TutorMistakeReview";
import PracticeActivity from "./PracticeActivity";
import {isLessonAttempt,type ReviewAttempt,type ReviewEntry} from "./mistake-review";

type Question={id:string;prompt:string;options:QuestionOptions;correct_index:number;position?:number;explanation?:string};
type Lesson={id:string;title:string;position:number;questions:Question[];due_date?:string|null;expected_completion_date?:string|null};
type Module={id:string;title:string;position:number;lessons:Lesson[]};
type Course={id:string;title:string;modules:Module[]};
type Student={id:string;full_name:string;email:string;role:string;year_level?:string|null;avatar_key?:string|null;review_timezone?:string|null};
type Enrollment={student_id:string;course_id:string};
type ProgressRecord={student_id:string;lesson_id:string;completed_at?:string|null;last_accessed_at?:string|null};
type Attempt=ReviewAttempt;

// Leave unset until the tutor has enough cohort history to choose a threshold.
// A future configurable completion gap can be applied here without changing stored progress.
const ATTENTION_COHORT_GAP_POINTS:number|null=null;
const CORE_COUNT=8,OPTIONAL_COUNT=13;
const dateLabel=(value?:string|null)=>value?new Date(value).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"}):"No activity yet";
const questionAnswer=(question:Question,attempt?:Attempt)=>{
 if(!attempt)return "Not attempted";
 if(attempt.response_text)return attempt.response_text;
 if(Array.isArray(question.options))return question.options[attempt.selected_index]||"Answer unavailable";
 return attempt.selected_index===0?"Correct response (text not stored for this attempt)":"Incorrect response (text not stored for this attempt)";
};
const correctAnswer=(question:Question)=>Array.isArray(question.options)?question.options[question.correct_index]:isShortAnswer(question.options)?question.options.accepted.join(" · "):"—";

export default function TutorAnalytics({students,courses,enrolments,progressRecords,attempts:allAttempts,client=null,tutorId="",onOpenQuestion}:{students:Student[];courses:Course[];enrolments:Enrollment[];progressRecords:ProgressRecord[];attempts:Attempt[];client?:SupabaseClient|null;tutorId?:string;onOpenQuestion?:(context:{course_id:string;lesson_id:string;question_id:string})=>void}){
 const attempts=useMemo(()=>allAttempts.filter(isLessonAttempt),[allAttempts]);
 const [query,setQuery]=useState(""),[yearFilter,setYearFilter]=useState("all"),[courseFilter,setCourseFilter]=useState("all"),[chapterFilter,setChapterFilter]=useState("all"),[statusFilter,setStatusFilter]=useState("all"),[selectedId,setSelectedId]=useState<string|null>(null);
 const studentRows=useMemo(()=>students.filter(s=>s.role==="student").map(student=>{
  const assignedCourses=courses.filter(c=>enrolments.some(e=>e.student_id===student.id&&e.course_id===c.id));
  const assignedLessons=assignedCourses.flatMap(course=>course.modules.flatMap(chapter=>chapter.lessons.map(lesson=>({course,chapter,lesson}))));
  const lessonRows=assignedLessons.map(({course,chapter,lesson})=>{
   const questions=[...lesson.questions].sort((a,b)=>(a.position??0)-(b.position??0));
   const questionIds=new Set(questions.map(q=>q.id));
   const lessonAttempts=attempts.filter(a=>a.student_id===student.id&&questionIds.has(a.question_id));
   const completedQuestions=new Set(lessonAttempts.map(a=>a.question_id)).size;
   const progress=progressRecords.find(p=>p.student_id===student.id&&p.lesson_id===lesson.id);
   const lastActivity=[progress?.last_accessed_at,progress?.completed_at,...lessonAttempts.map(a=>a.attempted_at)].filter(Boolean).sort().at(-1)||null;
   return {course,chapter,lesson,questions,lessonAttempts,completedQuestions,progress,lastActivity,accuracy:lessonAttempts.length?100*lessonAttempts.filter(a=>a.is_correct).length/lessonAttempts.length:null};
  });
  const completeCount=lessonRows.filter(row=>!!row.progress?.completed_at).length;
  const completion=lessonRows.length?100*completeCount/lessonRows.length:0;
  const studentAttempts=attempts.filter(a=>a.student_id===student.id&&assignedLessons.some(x=>x.lesson.questions.some(q=>q.id===a.question_id)));
  const accuracy=studentAttempts.length?100*studentAttempts.filter(a=>a.is_correct).length/studentAttempts.length:null;
  const deadlineMissed=lessonRows.some(row=>!row.progress?.completed_at&&(()=>{const due=row.lesson.due_date||row.lesson.expected_completion_date;return !!due&&new Date(due).getTime()<Date.now()})());
  return {student,assignedCourses,assignedLessons,lessonRows,completeCount,completion,studentAttempts,accuracy,deadlineMissed};
 }),[students,courses,enrolments,progressRecords,attempts]);
 const attentionIds=useMemo(()=>{
  if(ATTENTION_COHORT_GAP_POINTS===null)return new Set(studentRows.filter(row=>row.deadlineMissed).map(row=>row.student.id));
  const groups=new Map<string,typeof studentRows>();
  for(const row of studentRows){const key=row.assignedCourses.map(c=>c.id).sort().join("|");groups.set(key,[...(groups.get(key)||[]),row]);}
  return new Set(studentRows.filter(row=>{
   if(row.deadlineMissed)return true;
   const key=row.assignedCourses.map(c=>c.id).sort().join("|");
   const peers=(groups.get(key)||[]).filter(peer=>peer.student.id!==row.student.id);
   if(!peers.length||!row.assignedLessons.length)return false;
   const peerAverage=peers.reduce((sum,peer)=>sum+peer.completion,0)/peers.length;
   return peerAverage-row.completion>=ATTENTION_COHORT_GAP_POINTS;
  }).map(row=>row.student.id));
 },[studentRows]);
 const statusOf=(row:typeof studentRows[number])=>{
  if(attentionIds.has(row.student.id))return "Needs attention";
  if(!row.assignedLessons.length)return "Unassigned";
  return row.completeCount===row.assignedLessons.length?"Complete":"Incomplete";
 };
 const yearOptions=[...new Set(studentRows.map(r=>r.student.year_level).filter(Boolean))] as string[];
 const courseOptions=courses.filter(c=>studentRows.some(r=>r.assignedCourses.some(ac=>ac.id===c.id)));
 const chapterOptions=courses.filter(c=>courseFilter==="all"||c.id===courseFilter).flatMap(c=>c.modules.filter(m=>studentRows.some(r=>r.assignedCourses.some(ac=>ac.id===c.id))).map(m=>({id:`${c.id}:${m.id}`,title:m.title,courseId:c.id})));
 const filtered=studentRows.filter(row=>{
  const name=`${row.student.full_name||""} ${row.student.email||""}`.toLowerCase();
  return (!query||name.includes(query.toLowerCase()))&&
   (yearFilter==="all"||row.student.year_level===yearFilter)&&
   (courseFilter==="all"||row.assignedCourses.some(c=>c.id===courseFilter))&&
   (chapterFilter==="all"||row.lessonRows.some(l=>`${l.course.id}:${l.chapter.id}`===chapterFilter))&&
   (statusFilter==="all"||statusOf(row)===statusFilter);
 });
 const selected=studentRows.find(r=>r.student.id===selectedId);
 const assignedAttemptRows=filtered.flatMap(row=>row.lessonRows.flatMap(l=>l.lessonAttempts.map(attempt=>({attempt,question:l.questions.find(q=>q.id===attempt.question_id),lesson:l.lesson,course:l.course,chapter:l.chapter})))).filter(row=>!!row.question);
 const totalAttempts=assignedAttemptRows.length;
 const accuracyByStudent=filtered.filter(r=>r.accuracy!==null);
 const avgStudentAccuracy=accuracyByStudent.length?accuracyByStudent.reduce((sum,r)=>sum+(r.accuracy||0),0)/accuracyByStudent.length:null;
 const lessonRates=new Map<string,{course:string;chapter:string;lesson:string;correct:number;total:number}>();
 for(const row of filtered)for(const lesson of row.lessonRows){if(!lesson.lessonAttempts.length)continue;const key=lesson.lesson.id;const rate=lessonRates.get(key)||{course:lesson.course.title,chapter:lesson.chapter.title,lesson:lesson.lesson.title,correct:0,total:0};rate.correct+=lesson.lessonAttempts.filter(a=>a.is_correct).length;rate.total+=lesson.lessonAttempts.length;lessonRates.set(key,rate);}
 const averageLessonAccuracy=lessonRates.size?[...lessonRates.values()].reduce((sum,r)=>sum+100*r.correct/r.total,0)/lessonRates.size:null;
 const missedMap=new Map<string,{question:Question;lesson:string;course:string;chapter:string;wrong:number;total:number}>();
 for(const row of assignedAttemptRows){const prior=missedMap.get(row.question!.id)||{question:row.question!,lesson:row.lesson.title,course:row.course.title,chapter:row.chapter.title,wrong:0,total:0};prior.total++;if(!row.attempt.is_correct)prior.wrong++;missedMap.set(row.question!.id,prior);}
 const missed=[...missedMap.values()].filter(item=>item.total>0).map(item=>({...item,rate:100*item.wrong/item.total})).sort((a,b)=>b.rate-a.rate||b.total-a.total).slice(0,5);
 const completedStudents=filtered.filter(r=>r.assignedLessons.length>0&&r.completeCount===r.assignedLessons.length).length;
 const incompleteStudents=filtered.filter(r=>r.assignedLessons.length>r.completeCount).length;
 const incompleteLessons=filtered.reduce((sum,r)=>sum+r.assignedLessons.length-r.completeCount,0);

 if(selected){
  const row=selected;
  return <>
   <button className="back" onClick={()=>setSelectedId(null)}><ArrowLeft size={16}/> All students</button>
   <div className="analytics-profile-head"><StudentAvatar avatarKey={row.student.avatar_key} name={row.student.full_name||row.student.email} size="lg"/><div><span className="eyebrow">STUDENT PROFILE</span><h1>{row.student.full_name||"Name not set"}</h1><p>{row.student.email} · {row.student.year_level||"Year level not set"}</p></div><span className={`status-pill ${statusOf(row)==="Complete"?"good":statusOf(row)==="Needs attention"?"attention":"pending"}`}>{statusOf(row)}</span></div>
   <div className="analytics-profile-meta"><div><span>Year level</span><strong>{row.student.year_level||"Not set"}</strong></div><div><span>Assigned courses</span><strong>{row.assignedCourses.length||"None"}</strong></div><div><span>Assigned lessons completed</span><strong>{row.completeCount} / {row.assignedLessons.length}</strong></div><div><span>Question accuracy</span><strong>{row.accuracy===null?"No attempts":`${Math.round(row.accuracy)}%`}</strong></div></div>
   <PracticeActivity key={row.student.id} studentId={row.student.id} courses={row.assignedCourses} attempts={allAttempts} progress={progressRecords} timezone={row.student.review_timezone} title="Practice activity"/>
   {client&&row.assignedLessons.some(item=>item.lesson.questions.length>0)&&<TutorMistakeReview key={`${tutorId}:${row.student.id}`} client={client} tutorId={tutorId} studentId={row.student.id} studentTimezone={row.student.review_timezone} entries={row.assignedLessons.map(item=>({courseId:item.course.id,courseTitle:item.course.title,chapterId:item.chapter.id,chapterTitle:item.chapter.title,lesson:{...item.lesson,notes:"",worked_example:"",video_url:null,questions:item.lesson.questions.map(q=>({...q,explanation:q.explanation||""}))}}))} attempts={allAttempts} onOpenQuestion={onOpenQuestion}/>}
   {row.assignedCourses.length===0?<div className="empty">No courses are assigned to this student yet.</div>:row.assignedCourses.map(course=><section className="analytics-course" key={course.id}>
    <div className="section-head"><div><span className="eyebrow">ASSIGNED COURSE</span><h2>{course.title}</h2></div><span>{row.lessonRows.filter(l=>l.course.id===course.id&&l.progress?.completed_at).length} / {row.lessonRows.filter(l=>l.course.id===course.id).length} lessons complete</span></div>
    {course.modules.map(chapter=><div className="analytics-chapter" key={chapter.id}><h3>{chapter.title}</h3>{row.lessonRows.filter(l=>l.course.id===course.id&&l.chapter.id===chapter.id).map(l=>{
     const latestByQuestion=new Map<string,Attempt>();for(const a of [...l.lessonAttempts].sort((a,b)=>String(a.attempted_at).localeCompare(String(b.attempted_at))))latestByQuestion.set(a.question_id,a);
     const coreDone=new Set(l.questions.slice(0,CORE_COUNT).filter(q=>latestByQuestion.has(q.id)).map(q=>q.id)).size;
     const optionalDone=new Set(l.questions.slice(CORE_COUNT,CORE_COUNT+OPTIONAL_COUNT).filter(q=>latestByQuestion.has(q.id)).map(q=>q.id)).size;
     return <details className="analytics-lesson" key={l.lesson.id}><summary><span><strong>{l.lesson.title}</strong><small>{l.progress?.completed_at?"Completed":"Not completed"} · Core {coreDone} / {CORE_COUNT} · Optional {optionalDone} / {OPTIONAL_COUNT}</small></span><span className="analytics-lesson-metrics"><b>{l.accuracy===null?"—":`${Math.round(l.accuracy)}%`}</b><small>{l.lessonAttempts.length} attempts</small></span><ChevronDown size={17}/></summary><div className="analytics-lesson-body"><div className="analytics-line"><span>Lesson status</span><strong>{l.progress?.completed_at?`Completed ${dateLabel(l.progress.completed_at)}`:"Not completed"}</strong></div><div className="analytics-line"><span>Last activity</span><strong>{dateLabel(l.lastActivity)}</strong></div><div className="analytics-line"><span>Questions answered</span><strong>{l.completedQuestions} / {l.questions.length}</strong></div>
      {l.questions.map((question,index)=>{const qAttempts=l.lessonAttempts.filter(a=>a.question_id===question.id).sort((a,b)=>String(b.attempted_at).localeCompare(String(a.attempted_at)));const latest=qAttempts[0];return <div className="analytics-question" key={question.id}><div className="analytics-question-head"><span>Q{index+1}</span><MathText text={question.prompt}/><b className={latest?(latest.is_correct?"answer-correct":"answer-wrong"):"answer-unseen"}>{latest?(latest.is_correct?"Correct":"Incorrect"):"Not attempted"}</b></div><div className="analytics-question-facts"><span>Attempts: <strong>{qAttempts.length}</strong></span><span>Most recent answer: <strong><MathText text={questionAnswer(question,latest)}/></strong></span><span>Correct answer: <strong><MathText text={correctAnswer(question)}/></strong></span></div></div>})}
     </div></details>;
    })}</div>)}
   </section>)}
  </>;
 }

 return <>
  <div className="analytics-heading"><div><span className="eyebrow">TUTOR WORKSPACE</span><h1>Tutor Analytics</h1><p>Review assigned progress, accuracy and question attempts.</p></div></div>
  <div className="analytics-stats">
   <Metric icon={<Users size={19}/>} label="Students completing assigned lessons" value={`${completedStudents} / ${filtered.filter(r=>r.assignedLessons.length>0).length}`} detail="All assigned lessons marked complete"/>
   <Metric icon={<Clock3 size={19}/>} label="Students with incomplete lessons" value={incompleteStudents} detail={`${incompleteLessons} assigned lessons remain incomplete`}/>
   <Metric icon={<Target size={19}/>} label="Average accuracy by student" value={avgStudentAccuracy===null?"—":`${Math.round(avgStudentAccuracy)}%`} detail={`${accuracyByStudent.length} students with attempts`}/>
   <Metric icon={<Activity size={19}/>} label="Average accuracy by lesson" value={averageLessonAccuracy===null?"—":`${Math.round(averageLessonAccuracy)}%`} detail={`${lessonRates.size} lessons with attempts`}/>
   <Metric icon={<BookOpen size={19}/>} label="Total question attempts" value={totalAttempts} detail="Attempts on currently assigned content"/>
   <Metric icon={<AlertCircle size={19}/>} label="Needs attention" value={attentionIds.size||"—"} detail={attentionIds.size?"Past-due or below configured cohort threshold":"No deadlines or cohort threshold configured"}/>
  </div>
  {missed.length>0&&<section className="analytics-missed"><div className="section-head"><div><span className="eyebrow">QUESTION REVIEW</span><h2>Most commonly missed</h2></div><span>Ranked by incorrect attempt rate</span></div><div className="missed-list">{missed.map(item=><div className="missed-row" key={item.question.id}><div><strong><MathText text={item.question.prompt}/></strong><small>{item.course} · {item.chapter} · {item.lesson}</small></div><span className="missed-rate">{Math.round(item.rate)}% incorrect<small>{item.wrong} of {item.total} attempts</small></span></div>)}</div></section>}
  <section className="analytics-students"><div className="section-head"><div><span className="eyebrow">STUDENT LIST</span><h2>Students</h2></div><span>{filtered.length} shown</span></div>
   <div className="analytics-filters"><label className="analytics-search"><Search size={18}/><input aria-label="Search students" placeholder="Search by name or email" value={query} onChange={e=>setQuery(e.target.value)}/></label>
    <select aria-label="Filter by year level" value={yearFilter} onChange={e=>setYearFilter(e.target.value)}><option value="all">All year levels</option>{yearOptions.map(year=><option key={year}>{year}</option>)}</select>
    <select aria-label="Filter by assigned course" value={courseFilter} onChange={e=>{setCourseFilter(e.target.value);setChapterFilter("all")}}><option value="all">All assigned courses</option>{courseOptions.map(course=><option value={course.id} key={course.id}>{course.title}</option>)}</select>
    <select aria-label="Filter by chapter or content" value={chapterFilter} onChange={e=>setChapterFilter(e.target.value)}><option value="all">All chapters</option>{chapterOptions.map(chapter=><option value={chapter.id} key={chapter.id}>{chapter.title}</option>)}</select>
    <select aria-label="Filter by progress status" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="all">All progress</option><option>Complete</option><option>Incomplete</option><option>Needs attention</option><option>Unassigned</option></select>
   </div>
   {filtered.length===0?<div className="empty">No students match these filters.</div>:<div className="analytics-table-wrap"><table className="analytics-table"><thead><tr><th>Student</th><th>Year</th><th>Assigned course / content</th><th>Lessons</th><th>Accuracy</th><th>Attempts</th><th>Status</th><th></th></tr></thead><tbody>{filtered.map(row=><tr key={row.student.id}><td data-label="Student"><div className="analytics-student-cell"><StudentAvatar avatarKey={row.student.avatar_key} name={row.student.full_name||row.student.email} size="sm"/><span><strong>{row.student.full_name||row.student.email}</strong><small>{row.student.email}</small></span></div></td><td data-label="Year level">{row.student.year_level||"—"}</td><td data-label="Assigned course / content">{row.assignedCourses.length?row.assignedCourses.map(c=><span className="assigned-chip" key={c.id}>{c.title}<small>{row.lessonRows.filter(l=>l.course.id===c.id).map(l=>l.chapter.title).filter((v,i,a)=>a.indexOf(v)===i).join(", ")}</small></span>):"No course"}</td><td data-label="Lessons"><div className="table-progress"><span>{row.completeCount} / {row.assignedLessons.length}</span><Progress value={row.completion}/></div></td><td data-label="Accuracy">{row.accuracy===null?"—":`${Math.round(row.accuracy)}%`}</td><td data-label="Attempts">{row.studentAttempts.length}</td><td data-label="Progress status"><span className={`status-pill ${statusOf(row)==="Complete"?"good":statusOf(row)==="Needs attention"?"attention":statusOf(row)==="Unassigned"?"neutral":"pending"}`}>{statusOf(row)}</span></td><td data-label="Profile"><button className="profile-link" onClick={()=>setSelectedId(row.student.id)}>View profile</button></td></tr>)}</tbody></table></div>}
  </section>
  <p className="analytics-note">Lesson accuracy includes lesson practice attempts and retries. Spaced reviews are shown separately in student profiles.</p>
 </>;
}
function Metric({icon,label,value,detail}:{icon:ReactNode;label:string;value:string|number;detail:string}){return <div className="analytics-metric"><span className="metric-icon">{icon}</span><span className="metric-label">{label}</span><strong>{value}</strong><small>{detail}</small></div>}

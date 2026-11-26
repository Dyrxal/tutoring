"use client";
import {useState} from "react";
import type {SupabaseClient} from "@supabase/supabase-js";
import {Button} from "@/components/ui/button";
import {StudentAvatar} from "./StudentAvatar";
import {TutorStudentTasks} from "./NextTasks";
import type {TaskCourse,TaskAttempt} from "./next-tasks";

type Props={students:any[];courses:TaskCourse[];enrolments:any[];records:any[];attemptRecords:TaskAttempt[];db:SupabaseClient|null;userId:string;enrol:(student:string,course:string)=>void};
const lessons=(course:TaskCourse)=>course.modules.flatMap(chapter=>chapter.lessons);
export function StudentsSection({students,courses,enrolments,records,attemptRecords,db,userId,enrol}:Props){
 return <>{students.filter(s=>s.role==="student").map(s=><div className="student-card" key={s.id}><div className="student-name"><StudentAvatar avatarKey={s.avatar_key} name={s.full_name||s.email}/><div><strong>{s.full_name||s.email}</strong><small>{s.email}</small></div></div>{courses.map(c=>{const enrolled=enrolments.some(e=>e.student_id===s.id&&e.course_id===c.id);const done=records.filter(r=>r.student_id===s.id&&r.completed_at&&lessons(c).some(l=>l.id===r.lesson_id)).length;return <div className="student-course" key={c.id}><span>{c.title}</span>{enrolled?<span>{done} / {lessons(c).length} lessons complete</span>:<Button variant="outline" onClick={()=>enrol(s.id,c.id)}>Enrol</Button>}</div>})}<TutorStudentTasks key={`${userId}:${s.id}`} client={db} tutorId={userId} studentId={s.id} attempts={attemptRecords} timezone={s.review_timezone||"Australia/Sydney"} courses={courses.filter(c=>enrolments.some(e=>e.student_id===s.id&&e.course_id===c.id))} completed={records.filter(r=>r.student_id===s.id&&r.completed_at).map(r=>r.lesson_id)} lastLessonId={records.filter(r=>r.student_id===s.id).sort((a,b)=>String(b.last_accessed_at).localeCompare(String(a.last_accessed_at)))[0]?.lesson_id}/></div>)}{!students.some(s=>s.role==="student")&&<div className="empty">Students appear after they create an account.</div>}</>;
}

// Only rendered by the preview-only ?students=sample link. No real student records are used.
const sampleStudents=[{id:"sample-alex",role:"student",full_name:"Alex Taylor",email:"alex@example.test",avatar_key:"book"},{id:"sample-sam",role:"student",full_name:"Sam Morgan",email:"sam@example.test",avatar_key:"star"}];
const sampleCourses:TaskCourse[]=[9,10].map(year=>({id:`sample-year-${year}`,title:`Year ${year} maths - VIC`,modules:[{id:`sample-chapter-${year}`,title:year===9?"Chapter 1: Reviewing number and financial mathematics":"Chapter 1: Linear relations",position:0,lessons:Array.from({length:year===9?108:109},(_,i)=>({id:`sample-${year}-${i}`,title:year===9&&i===0?"1A Integer operations":year===9&&i===4?"1E Ratios, rates and best buys":`Practice subchapter ${i+1}`,position:i,questions:[{id:`sample-question-${year}-${i}`}]}))}]}));
const sampleRecords=Array.from({length:4},(_,i)=>({student_id:"sample-alex",lesson_id:`sample-9-${i}`,completed_at:"2026-11-01T00:00:00Z",last_accessed_at:`2026-11-0${i+1}T00:00:00Z`}));
export function SampleStudentsSection(){
 const [enrolments,setEnrolments]=useState([{student_id:"sample-alex",course_id:"sample-year-9"},{student_id:"sample-alex",course_id:"sample-year-10"},{student_id:"sample-sam",course_id:"sample-year-9"}]);
 return <StudentsSection students={sampleStudents} courses={sampleCourses} enrolments={enrolments} records={sampleRecords} attemptRecords={[]} db={null} userId="sample-tutor" enrol={(student_id,course_id)=>setEnrolments(rows=>rows.some(row=>row.student_id===student_id&&row.course_id===course_id)?rows:[...rows,{student_id,course_id}])}/>;
}

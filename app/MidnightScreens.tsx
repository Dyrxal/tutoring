"use client";
import NotationMark from "./NotationMark";
import {useId,type ComponentProps,type ReactNode} from "react";
import {BookOpen,ChevronRight} from "lucide-react";
import {StudentAvatar} from "./StudentAvatar";
import PracticeActivity from "./PracticeActivity";

type CourseSummary={id:string;title:string;description?:string};
type Theme="light"|"midnight";
type AppearanceState={theme:Theme;loading:boolean;saving:boolean;error:string;changeTheme:(value:Theme)=>Promise<void>;reload:()=>Promise<void>};

export function MidnightHeading({title,description}:{title:string;description:string}){
 return <header className="midnight-heading"><h1>{title}</h1><p>{description}</p></header>;
}

export function MidnightCourses({courses,percent,onOpen}:{courses:CourseSummary[];percent:(id:string)=>number;onOpen:(id:string)=>void}){
 return <><header className="midnight-course-banner"><h1>Your courses</h1><p>Your enrolled learning paths.</p></header><div className="midnight-course-list">{courses.map((course,index)=><article className="midnight-course" key={course.id}>
  <div className={`midnight-course-art art-${index%2}`} aria-hidden="true"/>
  <div className="midnight-course-copy"><h2>{course.title}</h2><p>{course.description}</p></div>
  <div className="midnight-course-action"><label htmlFor={`course-progress-${course.id}`}><strong>{percent(course.id)}%</strong> complete</label><progress id={`course-progress-${course.id}`} max={100} value={percent(course.id)}/><button className="midnight-primary" onClick={()=>onOpen(course.id)}>Open course <ChevronRight size={18} aria-hidden="true"/></button></div>
 </article>)}{!courses.length&&<div className="midnight-empty"><BookOpen aria-hidden="true"/><h2>No courses yet</h2><p>Your enrolled courses will appear here. Ask your tutor if you are expecting access.</p></div>}</div><p className="midnight-course-foot">Courses assigned by your tutor.</p></>;
}

export function MidnightProgress({activity,courses,percent,completion,onOpen}:{activity:ComponentProps<typeof PracticeActivity>;courses:CourseSummary[];percent:(id:string)=>number;completion:(id:string)=>{done:number;total:number};onOpen:(id:string)=>void}){
 return <><MidnightHeading title="Your progress" description="Track your practice activity and completed lessons across your courses."/><PracticeActivity {...activity} variant="midnight" title="Practice activity"/><section className="midnight-course-completion" aria-labelledby="completion-heading"><h2 id="completion-heading">Course completion</h2><p>Your enrolled courses and overall progress.</p>{courses.map(course=><button key={course.id} className="midnight-completion-row" onClick={()=>onOpen(course.id)}><BookOpen size={24} aria-hidden="true"/><strong>{course.title}<small>{completion(course.id).done} of {completion(course.id).total} lessons completed</small></strong><progress max={100} value={percent(course.id)} aria-label={`${course.title} completion`}/><span>{percent(course.id)}%</span><ChevronRight size={18} aria-hidden="true"/></button>)}{!courses.length&&<p>No enrolled courses yet.</p>}</section></>;
}

export function StudentAppearance({state,preview=false}:{state:AppearanceState;preview?:boolean}){
 const id=useId();
 return <section className="student-appearance" aria-labelledby={`${id}-heading`} aria-busy={state.loading||state.saving}><h2 id={`${id}-heading`}>Appearance</h2><p>Choose the view that feels right for you.</p>
  <div className={`appearance-preview preview-${state.theme}`} aria-hidden="true"><div className="appearance-preview-nav"><b><NotationMark/></b><i/><i/><i/><i/></div><div className="appearance-preview-content"><i/><div><i/><i/></div><div><i/><i/></div></div></div>
  <label htmlFor={`${id}-theme`}>Colour scheme</label><select id={`${id}-theme`} value={state.theme} disabled={state.loading||state.saving} aria-describedby={`${id}-scope`} onChange={event=>void state.changeTheme(event.target.value as Theme)}><option value="light">Classic light</option><option value="midnight">Midnight Study</option></select>
  <p id={`${id}-scope`} className="appearance-note">Available on Dashboard, Courses, Progress and Account.</p>
  {preview&&<p className="appearance-note">Preview only. Your choice lasts while this preview is open.</p>}
  {(state.loading||state.saving)&&<p role="status">{state.loading?"Loading your appearance…":"Saving appearance…"}</p>}
  {state.error&&<div role="alert" className="appearance-error"><p>{state.error}</p><button type="button" disabled={state.loading||state.saving} onClick={()=>void state.reload()}>Retry loading appearance</button></div>}
 </section>;
}

export function MidnightAccount({profile,editor,appearance,signOut}:{profile?:{full_name?:string;email?:string;year_level?:string;avatar_key?:string};editor:ReactNode;appearance:ReactNode;signOut:ReactNode}){
 return <><MidnightHeading title="Your account" description="Make your study space feel like yours."/><div className="midnight-account-grid"><div className="midnight-account-main"><div className="midnight-identity"><StudentAvatar avatarKey={profile?.avatar_key} name={profile?.full_name||profile?.email} size="lg"/><div><h2>{profile?.full_name||profile?.email||"Your profile"}</h2><p>{profile?.year_level||"Student"}</p></div></div>{editor}</div><aside className="midnight-account-aside">{appearance}<div className="midnight-signout">{signOut}</div></aside></div></>;
}

"use client";
import {useEffect,useId,useMemo,useState,type KeyboardEvent} from "react";
import {buildPracticeActivity,activityColours,activityLevel,type ActivityCourse,type ActivityProgress} from "./practice-activity";
import {reviewDateLabel,type ReviewAttempt} from "./mistake-review";

export default function PracticeActivity({studentId,courses,attempts,progress,timezone,loading=false,error="",onRetry,title="Your practice activity"}:{studentId:string;courses:ActivityCourse[];attempts:ReviewAttempt[];progress:ActivityProgress[];timezone?:string|null;loading?:boolean;error?:string;onRetry?:()=>void;title?:string}){
 const id=useId(),[now,setNow]=useState(()=>new Date()),[selected,setSelected]=useState<string|null>(null);
 // Refresh the date across midnight even when the page remains open.
 useEffect(()=>{const tick=()=>setNow(new Date());const timer=window.setInterval(tick,60000);window.addEventListener("focus",tick);return()=>{window.clearInterval(timer);window.removeEventListener("focus",tick)}},[]);
 const activity=useMemo(()=>buildPracticeActivity({studentId,courses,attempts,progress,timezone,now}),[studentId,courses,attempts,progress,timezone,now]);
 const day=activity.days.get(selected||activity.today),activeDate=day?.date||activity.today;
 const dateLabel=(date:string)=>new Intl.DateTimeFormat("en-AU",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(`${date}T12:00:00Z`));
 function move(event:KeyboardEvent<HTMLButtonElement>,date:string){const offset={ArrowLeft:-7,ArrowRight:7,ArrowUp:-1,ArrowDown:1}[event.key];if(offset===undefined)return;event.preventDefault();const dates=[...activity.days.keys()],index=dates.indexOf(date);if(event.key==="ArrowUp"&&index%7===0||event.key==="ArrowDown"&&index%7===6)return;const target=dates[index+offset];if(target)document.getElementById(`${id}-${target}`)?.focus()}
 return <section className="practice-activity" aria-labelledby={`${id}-heading`} aria-busy={loading}>
  <div className="activity-heading"><div><span className="eyebrow">PRACTICE ACTIVITY</span><h2 id={`${id}-heading`}>{title}</h2></div><span className="activity-period">Last eight weeks</span></div>
  {loading?<p role="status">Loading saved practice activity…</p>:error?<div role="alert"><p>Practice activity could not be loaded. Your saved work is kept.</p>{onRetry&&<button className="text-button" onClick={onRetry}>Retry loading activity</button>}</div>:<>
   <p className="activity-summary"><strong>{activity.recentResponses} practice response{activity.recentResponses===1?"":"s"}</strong> across <strong>{activity.recentActiveDays} day{activity.recentActiveDays===1?"":"s"}</strong> in the last four weeks.</p>
   <p className="activity-caption" id={`${id}-instructions`}>{reviewDateLabel(activity.start)} – {reviewDateLabel(activity.today)}. Each square is one day. Select a day to see your work.</p>
   <div className="activity-calendar" role="group" aria-label="Daily practice responses" aria-describedby={`${id}-instructions`}>
    <div className="activity-day-labels" aria-hidden="true">{["M","T","W","T","F","S","S"].map((label,index)=><span key={index}>{label}</span>)}</div>
    <div className="activity-weeks">{activity.columns.map((week,index)=><div className="activity-week" key={index}>{week.map((cell,weekday)=>cell?<button type="button" id={`${id}-${cell.date}`} key={cell.date} className={`activity-square${cell.date===activity.today?" today":""}`} style={{background:activityColours[activityLevel(cell.count)]}} aria-label={`${dateLabel(cell.date)}: ${cell.count} practice responses${cell.date===activity.today?", today":""}`} aria-pressed={activeDate===cell.date} aria-controls={`${id}-detail`} title={`${dateLabel(cell.date)} · ${cell.count} practice responses`} onClick={()=>setSelected(cell.date)} onKeyDown={event=>move(event,cell.date)}/>:<span key={`future-${weekday}`} className="activity-square activity-future" aria-hidden="true"/>)}</div>)}</div>
   </div>
   <div className="activity-legend" aria-label="Daily count colour key"><span>Less</span>{activityColours.map((colour,index)=><span className="activity-legend-item" key={colour}><i style={{background:colour}} aria-hidden="true"/><span>{["0","1–4","5–9","10–19","20+"][index]}</span></span>)}<span>More</span></div>
   <div className="activity-day-detail" id={`${id}-detail`} aria-live="polite" aria-atomic="true"><strong>{reviewDateLabel(activeDate)}{activeDate===activity.today?" · Today":""}</strong><p>{day?.count?`${day.count} practice responses · ${day.lessonCount} lesson questions · ${day.reviewCount} review responses`:"No saved practice responses on this day."}</p>{!!day?.topics.length&&<ul>{day.topics.map((topic,index)=><li key={index}><strong>{topic.lesson}</strong><span>{topic.course} · {topic.chapter}</span></li>)}</ul>}</div>
   <div className="activity-totals"><div><strong>{activity.weekResponses}</strong><span>Practice responses this week</span></div><div><strong>{activity.weekLessons}</strong><span>Lessons completed this week</span></div></div>
   {activity.recentResponses===0&&<p className="activity-caption">Your saved practice will appear here as you work through lessons and reviews.</p>}
   <details className="activity-counting"><summary>What counts?</summary><p>Lesson questions count once per day, including core and suggested practice. Every saved response in Practise my mistakes counts, including repeated reviews that day. Correct and incorrect answers both count. Failed saves and duplicate requests do not count.</p><p>This shows practice activity; course progress shows lesson completion. Dates use {activity.timezone}.</p></details>
  </>}
 </section>;
}

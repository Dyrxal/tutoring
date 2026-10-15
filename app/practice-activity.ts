import {isLessonAttempt,localReviewDate,reviewFallbackTimezone,type ReviewAttempt} from "./mistake-review";

export type ActivityCourse={id:string;title:string;modules:{id:string;title:string;lessons:{id:string;title:string;questions:{id:string}[]}[]}[]};
export type ActivityProgress={student_id:string;lesson_id:string;completed_at?:string|null};
export type ActivityTopic={course:string;chapter:string;lesson:string};
export type ActivityDay={date:string;lessonCount:number;reviewCount:number;count:number;topics:ActivityTopic[]};
export const activityColours=["#F1F5F3","#DCFCE7","#86EFAC","#22C55E","#15803D"];
export function activityLevel(count:number){return count===0?0:count<5?1:count<10?2:count<20?3:4}
// Calendar arithmetic is performed in UTC on date-only values. Displayed dates
// are computed in the student's persisted review timezone, including DST.
export function shiftActivityDate(date:string,days:number){const value=new Date(`${date}T12:00:00Z`);value.setUTCDate(value.getUTCDate()+days);return value.toISOString().slice(0,10)}
export function buildPracticeActivity({studentId,courses,attempts,progress,timezone,now=new Date()}:{studentId:string;courses:ActivityCourse[];attempts:ReviewAttempt[];progress:ActivityProgress[];timezone?:string|null;now?:Date}){
 let zone=timezone||reviewFallbackTimezone;try{new Intl.DateTimeFormat("en-AU",{timeZone:zone})}catch{zone=reviewFallbackTimezone}
 const formatter=new Intl.DateTimeFormat("en-CA",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit"});
 const dateInZone=(date:Date)=>{const parts=formatter.formatToParts(date);return `${parts.find(p=>p.type==="year")!.value}-${parts.find(p=>p.type==="month")!.value}-${parts.find(p=>p.type==="day")!.value}`};
 const today=localReviewDate(zone,now),weekday=(new Date(`${today}T12:00:00Z`).getUTCDay()+6)%7;
 const weekStart=shiftActivityDate(today,-weekday),start=shiftActivityDate(weekStart,-49),recentStart=shiftActivityDate(today,-27);
 const questionTopics=new Map<string,ActivityTopic>(),lessonIds=new Set<string>();
 for(const course of courses)for(const chapter of course.modules)for(const lesson of chapter.lessons){lessonIds.add(lesson.id);for(const question of lesson.questions)questionTopics.set(question.id,{course:course.title,chapter:chapter.title,lesson:lesson.title})}
 const days=new Map<string,ActivityDay>(),lessonKeys=new Set<string>(),savedIds=new Set<string>();
 for(let i=0;i<56;i++){const date=shiftActivityDate(start,i);if(date<=today)days.set(date,{date,lessonCount:0,reviewCount:0,count:0,topics:[]})}
 for(const attempt of attempts){
  if(attempt.student_id!==studentId||!attempt.id||savedIds.has(attempt.id)||!questionTopics.has(attempt.question_id)||!Number.isFinite(Date.parse(attempt.attempted_at)))continue;
  savedIds.add(attempt.id);
  const date=dateInZone(new Date(attempt.attempted_at)),day=days.get(date);if(!day)continue;
  if(isLessonAttempt(attempt)){const key=`${date}:${attempt.question_id}`;if(lessonKeys.has(key))continue;lessonKeys.add(key);day.lessonCount++}
  else if(["scheduled_review","early_practice","review_retry"].includes(attempt.attempt_context||""))day.reviewCount++;
  else continue;
  day.count++;const topic=questionTopics.get(attempt.question_id)!;
  if(!day.topics.some(t=>t.course===topic.course&&t.chapter===topic.chapter&&t.lesson===topic.lesson))day.topics.push(topic);
 }
 const recent=[...days.values()].filter(day=>day.date>=recentStart),thisWeek=recent.filter(day=>day.date>=weekStart),completedLessons=new Set<string>();
 for(const record of progress){if(record.student_id!==studentId||!lessonIds.has(record.lesson_id)||!record.completed_at||!Number.isFinite(Date.parse(record.completed_at)))continue;const date=dateInZone(new Date(record.completed_at));if(date>=weekStart&&date<=today)completedLessons.add(record.lesson_id)}
 return {today,start,weekStart,timezone:zone,days,columns:Array.from({length:8},(_,week)=>Array.from({length:7},(_,day)=>{const date=shiftActivityDate(start,week*7+day);return days.get(date)||null})),recentResponses:recent.reduce((total,day)=>total+day.count,0),recentActiveDays:recent.filter(day=>day.count>0).length,weekResponses:thisWeek.reduce((total,day)=>total+day.count,0),weekLessons:completedLessons.size};
}

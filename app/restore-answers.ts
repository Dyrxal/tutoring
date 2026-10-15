import {isShortAnswer,type QuestionOptions} from "./question-types";
import {isLessonAttempt} from "./mistake-review";

type Question={id:string;options:QuestionOptions};
type Attempt={student_id:string;question_id:string;attempted_at:string;selected_index?:number|null;response_text?:string|null;is_correct:boolean;attempt_context?:string};

/** Restore only this student's latest attempt. Never invent missing legacy responses. */
export function restoreAnswers(questions:Question[],attempts:Attempt[],studentId:string){
 const latest=new Map<string,Attempt>();
 for(const attempt of attempts){
  if(attempt.student_id!==studentId||!isLessonAttempt(attempt))continue;
  const previous=latest.get(attempt.question_id);
  if(!previous||attempt.attempted_at>=previous.attempted_at)latest.set(attempt.question_id,attempt);
 }
 const answers:Record<string,number>={};
 const shortAnswers:Record<string,{response:string;correct:boolean}>={};
 for(const question of questions){
  const attempt=latest.get(question.id);
  if(!attempt)continue;
  if(Array.isArray(question.options)){
   const index=attempt.selected_index;
   if(typeof index==="number"&&Number.isInteger(index)&&index>=0&&index<question.options.length)answers[question.id]=index;
  }else if(isShortAnswer(question.options)&&typeof attempt.response_text==="string"&&attempt.response_text.trim()){
   shortAnswers[question.id]={response:attempt.response_text,correct:attempt.is_correct};
  }
 }
 return {answers,shortAnswers};
}

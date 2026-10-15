import {lesson1AId,defaultPracticeHelp} from "./lesson1a-support";

export type Activity={prompt:string;solution:string};
export type PracticeHelp={title:string;example:string;steps:string[]};
export type HelpLink={label:string;target:"worked_example"|"question";question_id?:string};
export type LessonTemplateConfig={version:1;enabled?:boolean;help_links:HelpLink[];reasoning_prompts:Record<string,string>;guided_is_common_mistakes?:boolean;common_mistakes_source?:"guided"|"recall"|"application"|"review"};
export type Flow={recall?:Activity;guided?:Activity;application?:Activity;review?:Activity;common_mistakes?:Activity;practice_help?:Record<string,PracticeHelp>;template?:LessonTemplateConfig};
type TemplateLesson={id:string;lesson_flow?:Flow|null;questions:{id:string;prompt:string}[]};

/** Existing lessons opt in via lesson_flow.template; only the original 1A pilot has a compatibility default. */
export function resolveLessonFlow(lesson:TemplateLesson):Flow{
 const flow={...lesson.lesson_flow};
 if(flow.template?.version===1||lesson.id!==lesson1AId)return flow;
 const help={...flow.practice_help};
 for(const q of lesson.questions){if(!Object.prototype.hasOwnProperty.call(help,q.id)){const original=defaultPracticeHelp(q);if(original)help[q.id]=original}}
 const powers=lesson.questions.slice(0,8).find(q=>/powers?|exponents?/i.test(help[q.id]?.title||""));
 const order=lesson.questions.slice(0,8).find(q=>/order of operations/i.test(help[q.id]?.title||""));
 const reasoning:Record<string,string>={};
 for(const q of lesson.questions){if(/^Calculate\s+\(?[−-]?\d+\)?\s*[+−\-×÷]\s*\(?[−-]?\d+\)?[.?]?$/i.test(q.prompt.replace(/^(?:CORE QUESTIONS|SUGGESTED PRACTICE)\s*\([^\n]*\)\s*\n?/i,"").trim()))reasoning[q.id]="Predict the sign, then calculate."}
 return {...flow,practice_help:help,common_mistakes:flow.common_mistakes||flow.guided,template:{version:1,guided_is_common_mistakes:true,reasoning_prompts:reasoning,help_links:[{label:"Signs",target:"worked_example"},{label:"Powers",target:"question",question_id:powers?.id},{label:"Order of operations",target:"question",question_id:order?.id}]}};
}

export function hasPracticeHelp(help?:PracticeHelp){return !!help?.title?.trim()&&!!help.steps?.some(step=>step.trim())}

export function configuredHelpChoices(config:LessonTemplateConfig,coreQuestionIds:string[],help:Record<string,PracticeHelp>,workedExampleAvailable:boolean){
 return config.help_links.map(link=>({label:link.label,target:link.target==="worked_example"?(workedExampleAvailable?"lesson-worked-example":undefined):link.question_id&&coreQuestionIds.includes(link.question_id)&&hasPracticeHelp(help[link.question_id])?`question-help-${link.question_id}`:undefined}));
}

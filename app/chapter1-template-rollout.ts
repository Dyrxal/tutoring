import {lesson1AId} from "./lesson1a-support";
import {hasPracticeHelp,type Activity,type Flow,type HelpLink} from "./lesson-template";
import {pilot1BQuestions} from "./year9-1b-practice";
import {pilot1CQuestions} from "./year9-1c-practice";
import {pilot1DQuestions} from "./year9-1d-practice";
import {pilot1EQuestions} from "./year9-1e-practice";
import {pilot1FQuestions} from "./year9-1f-practice";
import {pilot1GQuestions} from "./year9-1g-practice";
import {pilot1HQuestions} from "./year9-1h-practice";
import {pilot1IQuestions} from "./year9-1i-practice";
import {pilot1JQuestions} from "./year9-1j-practice";
import {pilot1KQuestions} from "./year9-1k-practice";

type Question={id:string;prompt:string};
type Lesson={id:string;module_id:string;title:string;questions:Question[];lesson_flow?:Flow|null;worked_example?:string;example_image_path?:string|null};
export type Course={id:string;modules:{id:string;lessons:Lesson[]}[]};
export type RolloutReport={id:string;title:string;section?:string;status:"Enabled"|"Skipped";reason?:string;gaps:string[]};
export type Section={code:string;questions:{prompt:string}[];exampleLabel:string;reminders:Record<number,string>;commonMistakes?:Activity};

// Bounded rollout metadata, not new learning content. Match the existing source
// questions only within the original pilot's module; lesson/course renames work.
// Reminders bind to unchanged prompts, never to an arbitrary question position.
export const chapter1TemplateSections:Section[]=[
 {code:"1B",questions:pilot1BQuestions,exampleLabel:"Rounding and significant figures",reminders:{1:"Find the requested place, then check the next digit.",3:"Keep every requested decimal place in your written answer.",4:"Start counting at the first non-zero digit.",7:"Round the factors before multiplying."},commonMistakes:{prompt:"Common slips are counting leading zeros as significant figures and rounding digits repeatedly.",solution:"Start counting significant figures at the first non-zero digit. To round, keep the last required digit and look only at the next digit. Preserve trailing zeros when the question asks for a fixed number of decimal places or significant figures."}},
 {code:"1C",questions:pilot1CQuestions,exampleLabel:"Rational numbers and fractions",reminders:{2:"Consider whether the decimal terminates or repeats.",3:"Divide the numerator and denominator by the same factor.",8:"Use a common representation to compare the values."},commonMistakes:{prompt:"A decimal that repeats forever can still be rational, and an equivalent fraction must keep the same value.",solution:"A terminating or recurring decimal is rational. When simplifying or making an equivalent fraction, divide or multiply the numerator and denominator by the same non-zero number. For addition or comparison, use a common denominator or another shared representation."}},
 {code:"1D",questions:pilot1DQuestions,exampleLabel:"Fraction operations",reminders:{3:"Match denominators before adding.",5:"Check whether the fractional part makes another whole.",6:"Look for common factors before multiplying.",8:"Identify the divisor before taking its reciprocal."},commonMistakes:{prompt:"The most common fraction-operation slips are adding denominators and dividing by the wrong fraction.",solution:"For addition and subtraction, first use a common denominator; do not add the denominators. For division, keep the first fraction, change division to multiplication, and take the reciprocal of the second fraction. Simplify the result when possible."}},
 {code:"1E",questions:pilot1EQuestions,exampleLabel:"Ratios, rates and best buys",reminders:{1:"Keep the quantities in the stated order.",3:"Convert both quantities to the same units first.",5:"Count all the ratio parts before sharing the total.",8:"Compare prices for the same quantity."},commonMistakes:{prompt:"Ratio and best-buy answers can go wrong when the order, units or comparison quantity changes partway through.",solution:"Keep ratio terms in the order given and scale every term by the same factor. Convert quantities to matching units before calculating a rate. For best buys, compare the cost for the same quantity and include the relevant units in your result."}},
 {code:"1F",questions:pilot1FQuestions,exampleLabel:"Percentages and money",reminders:{5:"Use the same units and identify the whole.",7:"Check which group the question asks you to count.",8:"Identify the amount representing 100%."},commonMistakes:{prompt:"A frequent percentage mistake is using the wrong amount as the whole or confusing a discount with the sale price.",solution:"Identify the amount that represents 100% before calculating. A discount is the amount taken off; the sale price is the original price minus that discount. Convert percentages carefully, and keep money amounts in consistent units."}},
 {code:"1G",questions:pilot1GQuestions,exampleLabel:"Percentage change",reminders:{3:"Distinguish the increase from the new total.",5:"Compare the change with the original amount.",6:"Use the original amount as the percentage base.",7:"Identify the multiplier linking the original and final amounts."},commonMistakes:{prompt:"Percentage change is often calculated using the final amount as the base, or successive changes are added as if they use the same base.",solution:"Calculate the change as final amount minus original amount, then divide by the original amount. For repeated percentage changes, apply each multiplier to the updated amount; do not simply add the percentages."}},
 {code:"1H",questions:pilot1HQuestions,exampleLabel:"Profits and discounts",reminders:{3:"Identify the cost price before calculating percentage profit.",5:"Decide whether you need the saving or the sale price.",7:"Identify what percentage of the marked price remains.",8:"Calculate the loss before expressing it as a percentage."},commonMistakes:{prompt:"Profit, loss and discount questions can be mixed up by using the wrong starting price or reporting the change instead of the final price.",solution:"Profit or loss is the difference between the selling price and cost price. Calculate percentage profit or loss using the cost price as the base. For a discount, find the reduction from the marked price, then subtract it if the question asks for the sale price."}},
 {code:"1I",questions:pilot1IQuestions,exampleLabel:"Income and deductions",reminders:{3:"Check how many pay periods are in a year.",5:"Calculate each pay category separately, then combine them.",7:"Separate fixed pay from commission.",8:"Distinguish income before and after deductions."},commonMistakes:{prompt:"Income calculations often mix pay periods or confuse gross income with take-home income.",solution:"Convert weekly, fortnightly, monthly and annual amounts using the correct number of periods. Add each income component once, then subtract the stated deductions to find net income. Check whether a rate applies to all income or only to the amount specified in the question."}},
 {code:"1J",questions:pilot1JQuestions,exampleLabel:"Simple interest",reminders:{4:"Match the rate's time period to the time used.",6:"Convert months to years before using an annual rate.",7:"Check whether the question asks for interest or final balance.",8:"Find the interest earned per year first."},commonMistakes:{prompt:"Simple interest is sometimes calculated on a changing balance, or the interest amount is mistaken for the final balance.",solution:"Simple interest is calculated on the original principal each period. Match the time units to the quoted rate, then distinguish interest earned from the total balance: add the interest to the principal only when the balance is requested."}},
 {code:"1K",questions:pilot1KQuestions,exampleLabel:"Compound interest",reminders:{2:"Count the compounding periods.",4:"Identify the balance at the start of this year.",7:"Distinguish the final balance from the interest earned.",8:"Work backwards through the growth multipliers."},commonMistakes:{prompt:"Compound-interest errors include using simple interest, counting the wrong number of periods, and reporting the balance when asked for interest.",solution:"Apply the growth multiplier to the current balance once for each compounding period. Use the number of periods as the exponent. The final balance includes the original principal; subtract the principal to find the interest earned. When reversing growth, divide by the multiplier for each period."}},
];

export function practicePrompt(prompt:string){return prompt.replace(/^(?:CORE QUESTIONS|SUGGESTED PRACTICE|OPTIONAL PRACTICE)\s*\([^\n]*\)\s*\n?/i,"").trim()}

function identifySection(lesson:Lesson,sections:Section[]):Section|undefined{
 const core=new Set(lesson.questions.slice(0,8).map(q=>practicePrompt(q.prompt)));
 const suggested=new Set(lesson.questions.slice(8).map(q=>practicePrompt(q.prompt)));
 // Require several matches in BOTH groups, and an unambiguous section. A
 // heavily edited/unrecognised set is reported for tutor review, not guessed.
 const matches=sections.filter(section=>section.questions.slice(0,8).filter(q=>core.has(practicePrompt(q.prompt))).length>=4&&section.questions.slice(8).filter(q=>suggested.has(practicePrompt(q.prompt))).length>=4);
 return matches.length===1?matches[0]:undefined;
}

function configuredFlow(lesson:Lesson,section:Section):Flow{
 const current=lesson.lesson_flow||{};
 // Existing tutor mistake text takes precedence. Add the requested defaults
 // only when a subchapter has no saved common-mistake text.
 if(current.template?.version===1){
  if(current.common_mistakes?.prompt||current.common_mistakes?.solution)return current;
  const source=current.template.common_mistakes_source;
  const sourceActivity=source?current[source]:undefined;
  if(sourceActivity?.prompt||sourceActivity?.solution)return {...current,common_mistakes:sourceActivity};
  return {...current,common_mistakes:commonMistakesForSection(section)};
 }
 const flow:Flow={...current};
 let mistakesSource:NonNullable<Flow["template"]>["common_mistakes_source"];
 if(!Object.prototype.hasOwnProperty.call(flow,"common_mistakes")){
  for(const key of ["guided","recall","application","review"] as const){
   if(/^common mistakes\s*:?$/i.test(flow[key]?.prompt?.trim()||"")){flow.common_mistakes=flow[key];mistakesSource=key;break}
  }
 }
 if(!flow.common_mistakes?.prompt&&!flow.common_mistakes?.solution)flow.common_mistakes=commonMistakesForSection(section);
 const help_links:HelpLink[]=[];
 if(lesson.worked_example?.trim()||lesson.example_image_path)help_links.push({label:section.exampleLabel,target:"worked_example"});
 for(const q of lesson.questions.slice(0,8)){
  const help=flow.practice_help?.[q.id];
  if(hasPracticeHelp(help))help_links.push({label:help!.title,target:"question",question_id:q.id});
 }
 const reasoning_prompts:Record<string,string>={};
 for(const [number,reminder] of Object.entries(section.reminders)){
  const original=section.questions[Number(number)-1];
  const q=lesson.questions.slice(0,8).find(q=>practicePrompt(q.prompt)===original.prompt);
  if(q)reasoning_prompts[q.id]=reminder;
 }
 flow.template={version:1,help_links,reasoning_prompts,...(mistakesSource?{common_mistakes_source:mistakesSource}:{})};
 return flow;
}

function commonMistakesForSection(section:Section):Activity{
 if(section.commonMistakes)return section.commonMistakes;
 const checks=Object.values(section.reminders).filter(Boolean).slice(0,3);
 if(checks.length){
  return {
   prompt:`In ${section.exampleLabel.toLowerCase()}, a common slip is missing one of the key checks for the method.`,
   solution:`Before submitting, check: ${checks.join(" Also, ")}`,
  };
 }
 return {
  prompt:`In ${section.exampleLabel.toLowerCase()}, a common mistake is using a familiar method before checking exactly what the question asks.`,
  solution:"Identify the required quantity, show the key step, and check that the final answer has the right sign, units and form for the question.",
 };
}

function supportGaps(lesson:Lesson,flow:Flow):string[]{
 const gaps:string[]=[];
 if(!lesson.worked_example?.trim()&&!lesson.example_image_path)gaps.push("Lesson worked example");
 if(!flow.common_mistakes?.prompt&&!flow.common_mistakes?.solution)gaps.push("Common mistakes");
 for(const [key,label] of [["recall","Quick recall"],["application","Challenge question"],["review","Remember it"]] as const){
  if(!flow[key]?.prompt||flow.template?.common_mistakes_source===key)gaps.push(label);
 }
 const hints=lesson.questions.slice(0,8).filter(q=>!hasPracticeHelp(flow.practice_help?.[q.id])).length;
 if(hints)gaps.push(`Staged hints for ${hints} core question${hints===1?"":"s"}`);
 return gaps;
}

/** Read-through defaults: no database writes, new rows, or attempt mutations.
 * The existing tutor editor persists the resolved flow on an explicit save.
 * Only siblings of the real 1A pilot are considered; Year 10 is out of scope.
 */
export function chapter1TemplateRollout(courses:Course[]){
 return templateRollout(courses,chapter1TemplateSections,"chapter");
}

export function templateRollout(courses:Course[],sections:Section[],scope:"chapter"|"course"){
 const course=courses.find(c=>c.modules.some(m=>m.lessons.some(l=>l.id===lesson1AId)));
 const module=course?.modules.find(m=>m.lessons.some(l=>l.id===lesson1AId));
 return rolloutCourse(module?{...course!,modules:scope==="chapter"?[module]:course!.modules}:undefined,sections,lesson1AId);
}

export function rolloutCourse(course:Course|undefined,sections:Section[],excludeLessonId?:string){
 const flows=new Map<string,Flow>(),reports:RolloutReport[]=[];
 for(const lesson of course?.modules.flatMap(m=>m.lessons)||[]){
  if(lesson.id===excludeLessonId)continue;
  const section=identifySection(lesson,sections);
  const report:RolloutReport={id:lesson.id,title:lesson.title,section:section?.code,status:"Skipped",gaps:[]};
  if(section&&(lesson.lesson_flow?.template?.enabled===false||lesson.questions.length!==21||new Set(lesson.questions.map(q=>q.id)).size!==21)){
   const flow=lesson.lesson_flow||{};
   if(!flow.common_mistakes?.prompt&&!flow.common_mistakes?.solution)flows.set(lesson.id,{...flow,common_mistakes:commonMistakesForSection(section)});
  }
  if(lesson.questions.length!==21||new Set(lesson.questions.map(q=>q.id)).size!==21){report.reason=`Expected 21 distinct questions; found ${lesson.questions.length}.`}
  else if(!section){report.reason="Existing core/suggested question structure could not be identified reliably."}
  else if(lesson.lesson_flow?.template?.enabled===false){report.reason="Structured practice was disabled in this lesson's saved configuration."}
  else{const flow=configuredFlow(lesson,section);flows.set(lesson.id,flow);report.status="Enabled";report.gaps=supportGaps(lesson,flow)}
  reports.push(report);
 }
 return {courseId:course?.id,flows,reports};
}

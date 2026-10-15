import {pilot1AQuestions} from "./year9-1a-practice";

export const lesson1AId="1313fc50-2b9a-405d-a64a-7f385a1db1b8";
import type {PracticeHelp} from "./lesson-template";
const examples:PracticeHelp[]=[
 {title:"Finding an LCM",example:"Find the LCM of 6 and 8.",steps:["List multiples: 6, 12, 18, 24… and 8, 16, 24…","Choose the first shared multiple: 24. LCM uses multiples, not factors."]},
 {title:"Powers and negative signs",example:"Compare (−3)² and −3².",steps:["With brackets, the whole −3 is squared: (−3) × (−3) = 9.","Without brackets, square 3 first, then apply the minus: −3² = −9."]},
 {title:"Square roots and cube roots",example:"Calculate ∛(−8) + √25.",steps:["A cube root asks which number multiplied by itself three times gives −8: −2.","√25 is the non-negative square root: 5. Add the results: −2 + 5 = 3."]},
 {title:"Order of operations",example:"Calculate 10 − 3 × (−2 + 4)².",steps:["Brackets first: −2 + 4 = 2. Then powers: 2² = 4.","Multiply before subtracting: 3 × 4 = 12. Finally, 10 − 12 = −2."]},
];

/** Pilot defaults match the original prompts; edited questions never inherit unrelated help.
 * Tutor overrides are stored in the existing lesson_flow JSON, keyed by question ID. */
export function defaultPracticeHelp(question:{prompt:string}):PracticeHelp|undefined{
 const index=pilot1AQuestions.slice(2,6).findIndex(q=>q.prompt===question.prompt);
 return index<0?undefined:examples[index];
}

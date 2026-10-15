import {templateRollout,chapter1TemplateSections,type Course,type Section} from "./chapter1-template-rollout";
import {textbookChapters} from "./textbook-outline";
import {chapter2Practice} from "./year9-ch2-practice";
import {chapter3Practice} from "./year9-ch3-practice";
import {chapter4Practice} from "./year9-ch4-practice";
import {chapter5Practice} from "./year9-ch5-practice";
import {chapter6Practice} from "./year9-ch6-practice";
import {chapter7Practice} from "./year9-ch7-practice";
import {chapter8Practice} from "./year9-ch8-practice";
import {chapter8FurtherPractice} from "./year9-ch8-fk-practice";
import {chapter9Practice} from "./year9-ch9-practice";
import {chapter10Practice} from "./year9-ch10-practice";

// Registry metadata only. Source questions identify the saved group structure;
// they are never inserted, replaced or used instead of database questions.
const banks={...chapter2Practice,...chapter3Practice,...chapter4Practice,...chapter5Practice,...chapter6Practice,...chapter7Practice,...chapter8Practice,...chapter8FurtherPractice,...chapter9Practice,...chapter10Practice};
// These brief cues bind only to the unchanged original prompt. Tutor-saved
// configuration always wins; edited questions never acquire positional hints.
const reminders:Record<string,Record<number,string>>={
 "2G":{6:"Check what happens to the inequality when dividing by a negative number."},
 "3A":{8:"Convert the lengths to the same units first."},
 "3F":{1:"Check that your calculator uses degrees."},
 "3J":{5:"Measure bearings clockwise from north."},
 "4B":{1:"At the y-intercept, x is zero."},
 "4J":{7:"Check which input values make sense in this situation."},
 "7D":{6:"Match corresponding vertices in the stated order."},
 "8B":{3:"Expand both brackets; remember the middle term."},
 "8H":{5:"Factor first, then cancel common factors—not separate terms."},
 "9B":{2:"Count the overlap only once."},
 "9G":{2:"Put the values in order before finding the median."},
 "10B":{4:"Check both positive and negative possibilities."},
 "10D":{2:"Check whether each solution makes sense for a length."},
};
export const year9TemplateSections:Section[]=[...chapter1TemplateSections,...Object.entries(banks).map(([code,questions])=>{
 const match=/^(\d+)([A-Z])$/.exec(code)!;
 const section=textbookChapters[Number(match[1])-1].sections[match[2].charCodeAt(0)-65];
 return {code,questions,exampleLabel:section.name,reminders:reminders[code]||{}};
})];

export function year9TemplateRollout(courses:Course[]){
 return templateRollout(courses,year9TemplateSections,"course");
}

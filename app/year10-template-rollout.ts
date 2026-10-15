import {rolloutCourse,type Course,type Section} from "./chapter1-template-rollout";
import {year10Chapter1Practice} from "./year10-ch1-practice";
import {year10Chapter2Practice} from "./year10-ch2-practice";
import {year10Chapter3Practice} from "./year10-ch3-practice";
import {year10Chapter45Practice} from "./year10-ch45-practice";
import {year10Chapter67Practice} from "./year10-ch67-practice";
import {year10Chapter810Practice} from "./year10-ch8-10-practice";

// Metadata for existing banks, never replacement learning content. Stable seed
// IDs locate the course even after tutors rename it; ambiguous courses fail closed.
const banks={...year10Chapter1Practice,...year10Chapter2Practice,...year10Chapter3Practice,...year10Chapter45Practice,...year10Chapter67Practice,...year10Chapter810Practice};
const labels=[
 "Algebra|Multiplying and dividing algebraic fractions|Adding and subtracting algebraic fractions|Linear equations|Inequalities|Linear graphs|Equations of lines|Midpoint and distance|Parallel and perpendicular lines|Substitution|Elimination|Simultaneous equation applications|Graphing inequalities",
 "Angles|Congruence|Quadrilateral properties|Similarity and scale|Triangle similarity|Chords|Central and circumference angles|Cyclic quadrilaterals|Tangents|Circle geometry",
 "Rational numbers and surds|Adding and subtracting surds|Multiplying surds|Rationalising denominators|Index laws|Negative indices|Scientific notation|Fractional indices|Exponential equations|Exponential graphs|Growth and decay|Compound interest|Simple and compound interest",
 "Trigonometric ratios|Finding angles|Elevation and depression|Bearings|Three-dimensional trigonometry|Sine rule|Cosine rule|Triangle area|Unit circle|Trigonometric graphs",
 "Expanding expressions|Common factors|Monic trinomials|Non-monic trinomials|Perfect squares|Quadratic equations|Quadratic applications|Completing the square|Quadratic formula",
 "Length and perimeter|Pythagoras’ theorem|Area|Prism surface area|Pyramid surface area|Prism volume|Pyramid volume|Spheres|Measurement bounds",
 "Parabolas|Turning-point form|Factorised form|Completing the square|Quadratic formula|Quadratic modelling|Graph intersections|Circles|Hyperbolas|Graph translations",
 "Probability and sample spaces|Set notation|Addition rule|Conditional probability|Two-step outcomes|Tree diagrams|Independent events",
 "Data and sampling|Frequency displays|Centre and spread|Box plots|Standard deviation|Time series|Scatter plots|Lines of best fit|Regression",
 "Logarithms|Logarithm laws|Exponential equations|Polynomials|Polynomial expansion|Polynomial division|Remainder theorem|Polynomial equations|Polynomial graphs",
].map(chapter=>chapter.split("|"));
const reminders:Record<string,Record<number,string>>={
 "1A":{1:"Combine coefficients of like terms."},
 "1B":{1:"Cancel common factors, not separate terms."},
 "1C":{1:"Use a common denominator before adding."},
 "1H":{1:"Average the x-coordinates and y-coordinates separately."},
 "2B":{2:"Match vertices in the stated order."},
 "3B":{1:"Combine only surds with the same radical part."},
 "3D":{1:"Multiply numerator and denominator by the same expression."},
 "4B":{2:"Use degree mode and round only the final result."},
 "5G":{2:"Check that your solutions give positive dimensions."},
 "6C":{1:"Square the length conversion factor for area."},
 "7E":{1:"Keep the signs attached to the coefficients."},
 "8D":{2:"Use the group after the condition as your denominator."},
 "9C":{2:"Check the data are ordered before finding the median."},
 "10I":{2:"Use brackets when substituting a negative value."},
};
export const year10TemplateSections:Section[]=Object.entries(banks).map(([code,questions])=>{
 const match=/^(\d+)([A-Z])$/.exec(code)!;
 return {code,questions,exampleLabel:labels[Number(match[1])-1][match[2].charCodeAt(0)-65],reminders:reminders[code]||{}};
});
const seedIds=new Set(Object.values(banks).flatMap(questions=>questions.map(q=>q.seed_id)));
export function year10TemplateRollout(courses:Course[]){
 const matches=courses.filter(course=>new Set(course.modules.flatMap(m=>m.lessons.flatMap(l=>l.questions.filter(q=>seedIds.has(q.id)).map(q=>q.id)))).size>=8);
 const result=rolloutCourse(matches.length===1?matches[0]:undefined,year10TemplateSections);
 return {...result,identificationIssue:matches.length===1?undefined:matches.length>1?"Multiple courses contain Year 10 seed questions; no automatic layout was applied.":"The Year 10 course could not be identified from its saved question IDs; no automatic layout was applied."};
}

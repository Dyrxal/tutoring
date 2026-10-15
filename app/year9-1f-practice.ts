// Original practice based on 1F, Percentages and money, in Essential Mathematics Year 9.
// First eight questions are core; the next thirteen are optional.
import type {QuestionValues} from "./QuestionEditor";

export const pilot1FQuestions:QuestionValues[] = [
  // Core: conversions, percentages of a whole, and finding the whole.
  {prompt:"Write 0.37 as a percentage.",options:["0.37%","3.7%","37%","370%"],correct_index:2,explanation:"Multiply the decimal by 100: 0.37 × 100% = 37%."},
  {prompt:"Write 6.5% as a decimal.",options:["0.0065","0.065","0.65","6.5"],correct_index:1,explanation:"Divide by 100: 6.5% = 6.5 ÷ 100 = 0.065."},
  {prompt:"Write 3/8 as a percentage.",options:["0.375%","3.8%","37.5%","38%"],correct_index:2,explanation:"3 ÷ 8 = 0.375, and 0.375 × 100% = 37.5%. Keep the exact value rather than rounding to 38%."},
  {prompt:"Express 12.5% as a fraction in simplest form.",options:["1/8","1/4","12/5","125/100"],correct_index:0,explanation:"12.5% = 12.5/100 = 0.125 = 1/8. A percent is a number out of 100."},
  {prompt:"45 cm is what percentage of 1.5 m?",options:["3%","30%","33 1/3%","300%"],correct_index:1,explanation:"Convert 1.5 m to 150 cm. Then (45 ÷ 150) × 100% = 30%. Both quantities must use the same units."},
  {prompt:"Find 18% of $250.",options:["$4.50","$18","$45","$232"],correct_index:2,explanation:"18% of $250 means 0.18 × $250 = $45. The $232 option subtracts that amount instead."},
  {prompt:"A group has 35 students. If 40% bring lunch from home, how many do not bring lunch from home?",options:["14","21","25","40"],correct_index:1,explanation:"The remaining 60% do not bring lunch: 0.60 × 35 = 21 students. Fourteen is the number who do bring lunch."},
  {prompt:"Seven per cent of a savings goal is $21. What is the entire goal?",options:{kind:"short_answer",accepted:["300","$300","300.00","$300.00"]},correct_index:0,explanation:"If 7% is $21, then 1% is $3 and 100% is $300. Equivalently, $21 ÷ 0.07 = $300."},

  // Optional: beyond 100%, fractional percents, reverse and nested contexts, reasoning.
  {prompt:"Write 1.25 as a percentage.",options:["1.25%","12.5%","125%","1250%"],correct_index:2,explanation:"Multiply 1.25 by 100 to get 125%. A percentage can be more than 100%."},
  {prompt:"Write 250% as a fraction in simplest form.",options:["1/4","2/5","5/2","25/100"],correct_index:2,explanation:"250% = 250/100 = 5/2 after dividing the numerator and denominator by 50."},
  {prompt:"Express 2 1/2% as a simplified fraction. Enter a fraction, not a decimal.",options:{kind:"short_answer",accepted:["1/40"],exact:true},correct_index:0,explanation:"2 1/2% = 2.5/100 = 25/1000 = 1/40. Writing 2.5/100 without simplifying does not meet the requested form."},
  {prompt:"Which percentage is equivalent to 0.625?",options:["6.25%","62.5%","625%","62 1/5%"],correct_index:1,explanation:"0.625 × 100% = 62.5%. The last option is 62.2%, not 62.5%."},
  {prompt:"A box contains 240 g of nuts. The amount in a small 80 g packet is what percentage of the box's amount?",options:["33 1/3%","50%","200%","300%"],correct_index:0,explanation:"The small packet has 80 out of 240 g: (80 ÷ 240) × 100% = 33 1/3%. Reversing the comparison would give 300%."},
  {prompt:"A walk is 64 km long. How far is 12.5% of the walk?",options:["4 km","8 km","12.5 km","51.5 km"],correct_index:1,explanation:"12.5% = 1/8, so one eighth of 64 km is 8 km."},
  {prompt:"Seven eighths of 48 tickets have sold. How many tickets is that?",options:["6","36","42","56"],correct_index:2,explanation:"Seven eighths is 87.5%. Divide 48 by 8 to get 6 tickets per eighth, then multiply by 7 to get 42."},
  {prompt:"125% of an unknown amount is $50. What is the original amount?",options:{kind:"short_answer",accepted:["40","$40","40.00","$40.00"]},correct_index:0,explanation:"125% means 1.25 times the original amount. Divide $50 by 1.25 to find $40, which is smaller than $50."},
  {prompt:"A reservoir holds 72 L after 8 L of water was used. What percentage of its original water volume was used?",options:["10%","11 1/9%","12.5%","80%"],correct_index:0,explanation:"Originally the reservoir held 72 + 8 = 80 L. The used portion was 8/80 × 100% = 10%. Dividing by the remaining 72 L would use the wrong whole."},
  {prompt:"Thirty per cent of a 200-member club enter a competition. Twenty per cent of those entrants need a bus seat. How many bus seats are needed?",options:["12","20","40","60"],correct_index:0,explanation:"Thirty per cent of 200 is 60 entrants. Twenty per cent of those 60 is 12; the second percentage applies to entrants, not to all members."},
  {prompt:"If 20% of x equals 5% of y, how does y compare with x?",options:["y = x/4","y = x","y = 4x","y = 25x"],correct_index:2,explanation:"0.20x = 0.05y. Dividing both sides by 0.05 gives y = 4x."},
  {prompt:"Compare 90% of 80 with 80% of 90. Which is larger?",options:["90% of 80","80% of 90","They are equal at 72","They are equal at 90"],correct_index:2,explanation:"0.9 × 80 = 72 and 0.8 × 90 = 72. Multiplication gives the same result in either order."},
  {prompt:"A community garden assigns 28% of its plots to herbs, 0.30 of its plots to vegetables, and 1/4 to fruit. What percentage of plots remain unassigned? Enter your answer with the % symbol.",options:{kind:"short_answer",accepted:["17%"],exact:true},correct_index:0,explanation:"Convert to percentages: 0.30 is 30% and 1/4 is 25%. The assigned plots total 28% + 30% + 25% = 83%, leaving 17%."},
];

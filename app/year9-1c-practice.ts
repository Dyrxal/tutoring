// Original practice informed by the skills and question styles in 1C Rational
// numbers. Eight core items, then thirteen optional fluency/reasoning items.
import type {QuestionValues} from "./QuestionEditor";

export const pilot1CQuestions:QuestionValues[] = [
  // Core: classification, forms, conversion and comparison.
  {prompt:"Which number is irrational?",options:["0.125","−7","√5","4/11"],correct_index:2,explanation:"√5 cannot be written as a fraction of integers. The terminating decimal, integer and fraction can all be written as fractions."},
  {prompt:"The decimal 0.272727… continues with the pattern 27 forever. Is it rational or irrational?",options:["Rational, because it repeats","Irrational, because it never ends","Irrational, because it is less than 1","Neither, because it is a decimal"],correct_index:0,explanation:"A repeating decimal can be expressed as a fraction, so it is rational. A decimal can continue forever and still be rational."},
  {prompt:"Simplify 42/70 fully.",options:["21/35","6/10","3/5","2/3"],correct_index:2,explanation:"The highest common factor of 42 and 70 is 14. Dividing both by 14 gives 3/5, which cannot be simplified further."},
  {prompt:"Complete the equivalent fractions: 3/8 = □/40. What belongs in the box?",options:["8","12","15","35"],correct_index:2,explanation:"Multiply the denominator 8 by 5 to get 40, and multiply the numerator 3 by the same 5 to get 15."},
  {prompt:"Write 23/6 as a mixed number.",options:["2 5/6","3 5/6","3 1/6","4 1/6"],correct_index:1,explanation:"23 ÷ 6 is 3 remainder 5, so 23/6 = 3 5/6."},
  {prompt:"Write 2 3/7 as an improper fraction.",options:["5/7","14/7","17/7","21/7"],correct_index:2,explanation:"Two whole groups of sevenths make 14/7; add 3/7 to obtain 17/7."},
  {prompt:"Write 7/20 as a terminating decimal.",options:["0.07","0.14","0.35","0.70"],correct_index:2,explanation:"7/20 = 35/100 = 0.35. Equivalently, 7 ÷ 20 = 0.35."},
  {prompt:"Which is larger: 5/8 or 7/12?",options:["5/8","7/12","They are equal","There is not enough information"],correct_index:0,explanation:"Use denominator 24: 5/8 = 15/24 and 7/12 = 14/24. Therefore 5/8 is larger."},

  // Optional: change the representation, sign, application or reasoning step.
  {prompt:"Which statement about 0 is correct?",options:["It is irrational","It is rational because 0 = 0/1","It is not a real number","It is only rational when written as a decimal"],correct_index:1,explanation:"Zero is an integer and a real number. It is rational because it can be written as a fraction of integers, such as 0/1."},
  {prompt:"Which pair contains one rational number and one irrational number?",options:["√49 and √7","√9 and 3/4","π and √2","0.3 and −4"],correct_index:0,explanation:"√49 = 7, which is rational; √7 is irrational. The other pairs contain either two rational or two irrational numbers."},
  {prompt:"Which notation shows that the digits 12 repeat forever?",options:["0.12","0.1200","0.121212…","0.12 × 12"],correct_index:2,explanation:"The ellipsis following repeated copies of 12 indicates 0.121212… continues with the same pattern indefinitely. 0.12 terminates."},
  {prompt:"Simplify −36/54 fully, keeping the negative sign.",options:{kind:"short_answer",accepted:["-2/3","−2/3"]},correct_index:0,explanation:"Divide 36 and 54 by their highest common factor, 18. The result is −2/3. The negative sign applies to the fraction as a whole."},
  {prompt:"Write 0.0725 as a fraction in simplest form.",options:["29/400","29/40","725/1000","7/25"],correct_index:0,explanation:"0.0725 = 725/10000. Divide top and bottom by 25 to get 29/400."},
  {prompt:"Write 2.45 as an improper fraction in simplest form.",options:{kind:"short_answer",accepted:["49/20"]},correct_index:0,explanation:"2.45 = 245/100 = 49/20. The numerator is greater than the denominator, so this is an improper fraction."},
  {prompt:"Write 0.4444… (the 4 repeats forever) as a fraction in simplest form.",options:["4/10","4/9","1/4","44/100"],correct_index:1,explanation:"Let x = 0.4444… . Then 10x − x = 4.4444… − 0.4444… = 4, so 9x = 4 and x = 4/9."},
  {prompt:"Write 0.121212… (the pair 12 repeats forever) as a fraction in simplest form.",options:["12/100","2/11","4/33","12/10"],correct_index:2,explanation:"Let x = 0.121212… . Then 100x − x = 12, so x = 12/99 = 4/33. A two-digit repeat needs a factor of 99."},
  {prompt:"Which fraction lies strictly between 2/5 and 1/2?",options:["3/10","9/20","11/20","3/5"],correct_index:1,explanation:"In twentieths, 2/5 = 8/20 and 1/2 = 10/20. The fraction 9/20 lies strictly between them."},
  {prompt:"Place 3/8, 4/9 and 5/12 in descending order (largest first).",options:["3/8, 5/12, 4/9","4/9, 5/12, 3/8","5/12, 4/9, 3/8","4/9, 3/8, 5/12"],correct_index:1,explanation:"Use denominator 72: 3/8 = 27/72, 4/9 = 32/72 and 5/12 = 30/72. So the order is 4/9, 5/12, 3/8."},
  {prompt:"A basketball player makes 18 of 60 free throws. What fraction of the attempts were successful, in simplest form?",options:["3/10","9/20","18/42","10/3"],correct_index:0,explanation:"Successful attempts divided by all attempts is 18/60. Divide numerator and denominator by 6 to obtain 3/10."},
  {prompt:"x is an integer and 2 < x/5 < 3. List every possible value of x in increasing order, separated by commas.",options:{kind:"short_answer",accepted:["11, 12, 13, 14","11,12,13,14"]},correct_index:0,explanation:"Multiply the inequality by positive 5: 10 < x < 15. The possible integers are 11, 12, 13 and 14; the endpoints are excluded."},
  {prompt:"Can a fraction in simplest form have both its numerator and denominator odd?",options:["Yes, for example 5/7","No, both odd numbers share a factor of 2","No, odd numbers always share a factor of 3","Only when numerator equals denominator"],correct_index:0,explanation:"Both numbers being odd does not mean they share a factor. The highest common factor of 5 and 7 is 1, so 5/7 is already in simplest form."},
];

// Original 1D practice based on the section's skills and question styles:
// eight core questions followed by thirteen optional fluency/reasoning items.
import type {QuestionValues} from "./QuestionEditor";

export const pilot1DQuestions:QuestionValues[] = [
  // Core: common denominators, operations, mixed numbers and reciprocals.
  {prompt:"What is the lowest common denominator for 1/6 and 5/8?",options:["8","14","24","48"],correct_index:2,explanation:"The smallest number divisible by both 6 and 8 is 24. A denominator of 48 works, but is not the lowest common denominator."},
  {prompt:"Calculate 3/11 + 5/11. Give the answer in simplest form.",options:["8/22","8/11","15/11","3/16"],correct_index:1,explanation:"The denominators already match. Add the numerators and retain 11: 3/11 + 5/11 = 8/11."},
  {prompt:"Calculate 2/9 + 1/6. Give the answer in simplest form.",options:["3/15","3/9","7/18","5/18"],correct_index:2,explanation:"The lowest common denominator is 18. Convert to 4/18 + 3/18 = 7/18."},
  {prompt:"Calculate 5/6 − 1/4. Give the answer in simplest form.",options:["4/2","1/2","7/12","3/8"],correct_index:2,explanation:"Write both in twelfths: 10/12 − 3/12 = 7/12."},
  {prompt:"Calculate 1 3/4 + 2 5/8. Write your answer as a mixed number.",options:{kind:"short_answer",accepted:["4 3/8"]},correct_index:0,explanation:"1 3/4 = 1 6/8. Add 1 6/8 + 2 5/8 = 3 11/8 = 4 3/8."},
  {prompt:"Calculate 3/8 × 4/9. Give the answer in simplest form.",options:["12/72","1/6","7/17","3/2"],correct_index:1,explanation:"Cancel 3 with 9 and 4 with 8 before multiplying: (1 × 1)/(2 × 3) = 1/6."},
  {prompt:"What is the reciprocal of 7/12?",options:["−7/12","5/12","12/7","7/5"],correct_index:2,explanation:"Swap the numerator and denominator. (7/12) × (12/7) = 1, so 12/7 is the reciprocal."},
  {prompt:"Calculate 5/6 ÷ 10/9. Give the answer in simplest form.",options:["1/2","3/4","4/3","25/27"],correct_index:1,explanation:"Multiply by the reciprocal of 10/9: (5/6) × (9/10) = 45/60 = 3/4."},

  // Optional: new result forms, borrowing, order, error analysis and context.
  {prompt:"Calculate 4/5 + 3/4. Give your answer as an improper fraction in simplest form.",options:["7/9","7/20","31/20","31/40"],correct_index:2,explanation:"Use twentieths: 16/20 + 15/20 = 31/20. The result is greater than 1."},
  {prompt:"Calculate 3 1/8 − 1 5/6. Write your answer as a mixed number in simplest form.",options:{kind:"short_answer",accepted:["1 7/24"]},correct_index:0,explanation:"Convert to improper fractions: 25/8 − 11/6 = 75/24 − 44/24 = 31/24 = 1 7/24. Simply subtracting 1/8 − 5/6 from the fractional parts would mishandle borrowing."},
  {prompt:"Calculate 1/3 − 5/6. Give the answer in simplest form.",options:["−1/2","1/2","−4/3","4/6"],correct_index:0,explanation:"1/3 = 2/6; 2/6 − 5/6 = −3/6 = −1/2. The result is negative because 5/6 is larger."},
  {prompt:"Calculate 9 × 2/3.",options:["2/27","6","9/3","18"],correct_index:1,explanation:"Treat 9 as 9/1: (9 × 2)/3 = 18/3 = 6."},
  {prompt:"Find 3/5 of 40.",options:["8","15","24","200/3"],correct_index:2,explanation:"In this context, 'of' means multiplication: (3/5) × 40 = 3 × 8 = 24."},
  {prompt:"Calculate 1 1/2 × 2 2/3.",options:["3 1/6","4","4 1/6","6"],correct_index:1,explanation:"Convert to improper fractions: (3/2) × (8/3) = 4 after cancelling the 3s and dividing 8 by 2."},
  {prompt:"Calculate 3/4 ÷ 6. Give the answer in simplest form.",options:["1/8","1/2","9/2","18/4"],correct_index:0,explanation:"Dividing by 6 means multiplying by 1/6: (3/4) × (1/6) = 3/24 = 1/8."},
  {prompt:"Calculate 7 ÷ 2/3. Write your answer as an improper fraction.",options:["2/21","14/3","21/2","7/6"],correct_index:2,explanation:"7 ÷ 2/3 = 7 × 3/2 = 21/2. Dividing by a fraction smaller than 1 makes the result larger than 7."},
  {prompt:"Calculate 2 1/4 ÷ 3/8.",options:["3/8","3/2","6","24"],correct_index:2,explanation:"2 1/4 = 9/4. Multiply by the reciprocal of 3/8: (9/4) × (8/3) = 6."},
  {prompt:"A student claims 2/5 + 1/4 = 3/9. Which response identifies the mistake and gives the correct result?",options:["Add the denominators too; the answer is 3/9","Use a common denominator; the answer is 13/20","Multiply the fractions; the answer is 2/20","Subtract the numerators; the answer is 1/20"],correct_index:1,explanation:"You cannot add unlike denominators. Rewrite 2/5 = 8/20 and 1/4 = 5/20, then add to get 13/20."},
  {prompt:"Calculate 2/3 + 1/2 × 3/4. Give the answer as an improper fraction in simplest form.",options:{kind:"short_answer",accepted:["25/24"]},correct_index:0,explanation:"Multiply first: (1/2) × (3/4) = 3/8. Then 2/3 + 3/8 = 16/24 + 9/24 = 25/24."},
  {prompt:"A recipe uses 3/4 of a 2 2/3 L jug of milk. How many litres does it use?",options:["1/2 L","1 1/3 L","2 L","3 5/12 L"],correct_index:2,explanation:"3/4 of 2 2/3 L is (3/4) × (8/3) L = 2 L."},
  {prompt:"A project needs 10 1/2 m³ of gravel. A truck carries 2 1/4 m³ per trip. What is the minimum number of trips?",options:["4","4 2/3","5","6"],correct_index:2,explanation:"(21/2) ÷ (9/4) = (21/2) × (4/9) = 14/3 = 4 2/3 loads. A truck cannot make two-thirds of a complete delivery trip, so five trips are needed."},
];

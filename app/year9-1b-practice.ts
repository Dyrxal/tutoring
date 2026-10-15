// Original 1B practice. The first eight questions form the core set; the
// remaining thirteen provide optional, varied fluency and reasoning practice.
// Imported into Supabase once, then editable by tutors in the lesson editor.
import type {QuestionValues} from "./QuestionEditor";

export const pilot1BQuestions:QuestionValues[] = [
  // Core: one distinct idea or rounding pitfall per question.
  {prompt:"Round 18.673 to one decimal place.",options:["18.6","18.7","18.67","19"],correct_index:1,explanation:"Keep the tenths digit 6. The next digit is 7, so round the tenths up to 7: 18.7."},
  {prompt:"Round 0.04673 to three decimal places.",options:["0.046","0.047","0.05","0.0467"],correct_index:1,explanation:"Three decimal places reach the 6 in 0.04673. The next digit is 7, so 0.046 rounds to 0.047."},
  {prompt:"Round 4.9956 to two decimal places. Include any needed zero.",options:{kind:"short_answer",accepted:["5.00"],exact:true},correct_index:0,explanation:"The third decimal digit is 5, so the hundredths round up. Carry through the 9s: 4.9956 becomes 5.00 to two decimal places, not 5 or 5.0."},
  {prompt:"How many significant figures does 0.005070 have?",options:["2","3","4","6"],correct_index:2,explanation:"The leading zeros only locate the decimal point. From the first 5 onward, 5, 0, 7 and the final 0 are significant: four figures."},
  {prompt:"Round 38 746 to two significant figures.",options:["38 000","39 000","38 700","40 000"],correct_index:1,explanation:"The first two significant digits are 3 and 8. The next digit is 7, so 38 rounds to 39 thousands: 39 000."},
  {prompt:"Round 0.003856 to two significant figures.",options:["0.0038","0.0039","0.0040","0.039"],correct_index:1,explanation:"Skip the leading zeros. The first two significant digits are 3 and 8; the next digit is 5, so the result is 0.0039."},
  {prompt:"Estimate 58 × 412 by rounding each factor to one significant figure first.",options:["2 400","3 000","24 000","30 000"],correct_index:2,explanation:"58 ≈ 60 and 412 ≈ 400 to one significant figure. Then 60 × 400 = 24 000."},
  {prompt:"A measurement is 0.00482 g. Which is its value to two significant figures?",options:["0.00 g","0.0048 g","0.005 g","0.00482 g"],correct_index:1,explanation:"The first non-zero digit is 4, followed by 8. The next digit is 2, so the measurement is 0.0048 g. Two decimal places would lose all useful information."},

  // Optional fluency: different size, representation, context or reasoning.
  {prompt:"Round 73.241 to the nearest whole number.",options:["73","73.2","74","70"],correct_index:0,explanation:"The tenths digit is 2, which is below 5. Keep the whole-number part: 73."},
  {prompt:"Round 7.999 to two decimal places. Keep both decimal places.",options:{kind:"short_answer",accepted:["8.00"],exact:true},correct_index:0,explanation:"The third decimal digit rounds the hundredths 9 up, carrying across the tenths and units. Written to two decimal places, the answer is 8.00."},
  {prompt:"Write 2 ÷ 7 as a decimal rounded to three decimal places.",options:["0.285","0.286","0.287","0.29"],correct_index:1,explanation:"2 ÷ 7 = 0.285714… . The fourth decimal digit is 7, so 0.285 rounds up to 0.286."},
  {prompt:"How many significant figures are shown in 20.040?",options:["2","3","4","5"],correct_index:3,explanation:"Start at 2. The zeros between non-zero digits and the final zero after the decimal point count: 2, 0, 0, 4, 0 are five significant figures."},
  {prompt:"Round 406 820 to three significant figures.",options:["406 000","407 000","406 800","410 000"],correct_index:1,explanation:"The first three significant digits are 4, 0 and 6. The next digit is 8, so round the 6 up: 407 000."},
  {prompt:"Round 9.965 to three significant figures, using the usual school rounding rule.",options:["9.96","9.97","10.0","10"],correct_index:1,explanation:"The first three significant digits are 9, 9 and 6. The next digit is 5, so the hundredths digit becomes 7: 9.97."},
  {prompt:"Round 0.0996 to two significant figures. Preserve the number of significant figures.",options:["0.099","0.10","0.1","0.100"],correct_index:1,explanation:"The first two significant digits are 9 and 9. The next digit is 6, so rounding carries to 0.10; the final zero shows two significant figures."},
  {prompt:"Estimate 0.047 × 19 by rounding each factor to one significant figure.",options:["0.01","0.1","1","10"],correct_index:2,explanation:"0.047 ≈ 0.05 and 19 ≈ 20. Then 0.05 × 20 = 1."},
  {prompt:"Estimate 295 + 61 × 4.7 by rounding each number to one significant figure. Follow the order of operations.",options:["570","600","1 700","1 800"],correct_index:1,explanation:"295 ≈ 300, 61 ≈ 60, and 4.7 ≈ 5. Multiply first: 300 + 60 × 5 = 600."},
  {prompt:"A runner records 12.64 s and another records 12.58 s. First round each time to one decimal place. What difference remains?",options:["0 s","0.1 s","0.06 s","0.2 s"],correct_index:0,explanation:"12.64 s rounds to 12.6 s and 12.58 s also rounds to 12.6 s, so the difference is 0 s."},
  {prompt:"A water tank reading is 0.0027 L. Which form best preserves two significant figures?",options:["0.00 L","0.003 L","0.0027 L","0.00270 L"],correct_index:2,explanation:"The digits 2 and 7 are the two significant figures. 0.0027 L preserves both; the other values either lose a digit or add a third significant figure."},
  {prompt:"A road length is 6.48 km. Round it to the nearest hundred metres and give the answer in kilometres.",options:{kind:"short_answer",accepted:["6.5","6.5 km"]},correct_index:0,explanation:"One hundred metres is 0.1 km. Rounding 6.48 km to the nearest 0.1 km gives 6.5 km."},
  {prompt:"A student rounds 2.748 to one decimal place and gets 2.8 by rounding the last digit repeatedly. What is the correct rounded value?",options:["2.7","2.8","2.75","3"],correct_index:0,explanation:"Look only at the digit immediately after the required tenths place. That digit is 4, so leave the 7: 2.7. Do not round the later digits one by one."},
];

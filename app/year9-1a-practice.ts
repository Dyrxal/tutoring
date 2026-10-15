// Original questions for the 1A pilot. Import once into Supabase; lesson pages
// always read questions from the database, so tutors can edit them afterward.
type PracticeQuestion = {prompt:string;options:[string,string,string,string];correct_index:number;explanation:string};

export const pilot1AQuestions:PracticeQuestion[] = [
  // Core questions 3–8 follow the two existing starter questions.
  {prompt:"Calculate 4 − (−11).",options:["−15","−7","7","15"],correct_index:3,explanation:"Subtracting a negative is adding: 4 + 11 = 15."},
  {prompt:"Calculate −42 ÷ 6.",options:["−7","−6","6","7"],correct_index:0,explanation:"A negative divided by a positive is negative. 42 ÷ 6 = 7, so the result is −7."},
  {prompt:"What is the lowest common multiple (LCM) of 9 and 15?",options:["3","15","30","45"],correct_index:3,explanation:"Multiples of 9 include 9, 18, 27, 36, 45; multiples of 15 include 15, 30, 45. The first shared multiple is 45."},
  {prompt:"Calculate (−5)² − (−5²).",options:["−50","0","25","50"],correct_index:3,explanation:"(−5)² = 25 because the negative is inside the brackets. −5² = −25 because the power acts on 5 first. Hence 25 − (−25) = 50."},
  {prompt:"Calculate ∛(−27) + √64.",options:["−11","−5","5","11"],correct_index:2,explanation:"∛(−27) = −3 and √64 = 8, so the sum is 5."},
  {prompt:"Calculate 6 − 2 × (−3 + 5)².",options:["−2","2","14","22"],correct_index:0,explanation:"The bracket is 2; square it to get 4, multiply by 2 to get 8, then 6 − 8 = −2."},

  // Optional fluency: each item changes the skill, sign pattern or representation.
  {prompt:"Which of these numbers is an integer?",options:["7/2","−8","0.4","√2"],correct_index:1,explanation:"Integers are whole numbers including negatives and zero. −8 is an integer; the other choices are not."},
  {prompt:"Calculate −17 + 9.",options:["−26","−8","8","26"],correct_index:1,explanation:"The signs differ; 17 − 9 = 8, and the larger absolute value belongs to −17, so the result is −8."},
  {prompt:"Calculate 8 × (−6).",options:["−48","−14","14","48"],correct_index:0,explanation:"A positive times a negative is negative. 8 × 6 = 48, so the result is −48."},
  {prompt:"Calculate (−54) ÷ (−9).",options:["−9","−6","6","9"],correct_index:2,explanation:"Two negative signs make a positive quotient, and 54 ÷ 9 = 6."},
  {prompt:"What is the highest common factor (HCF) of 42 and 56?",options:["7","14","28","112"],correct_index:1,explanation:"42 = 3 × 14 and 56 = 4 × 14. Their largest shared factor is 14."},
  {prompt:"Which number is prime?",options:["1","21","31","39"],correct_index:2,explanation:"31 has exactly two positive factors: 1 and 31. The number 1 is not prime; 21 and 39 have other factors."},
  {prompt:"If x² = 36, what are all possible real values of x?",options:["6 only","−6 only","−6 and 6","0 and 6"],correct_index:2,explanation:"Both 6 × 6 and (−6) × (−6) equal 36, so x can be −6 or 6."},
  {prompt:"Calculate (−2)⁴ − (−2)³.",options:["−24","−8","8","24"],correct_index:3,explanation:"(−2)⁴ = 16 and (−2)³ = −8. Thus 16 − (−8) = 24."},
  {prompt:"If a = −2 and b = 7, calculate a² − 3b.",options:["−25","−17","−11","17"],correct_index:1,explanation:"Substitute carefully: (−2)² − 3 × 7 = 4 − 21 = −17."},
  {prompt:"Calculate 24 ÷ (−4) × 3.",options:["−18","−2","2","18"],correct_index:0,explanation:"Division and multiplication have equal priority, so work left to right: 24 ÷ (−4) = −6, then −6 × 3 = −18."},
  {prompt:"Where must brackets go to make 8 − 2 × 3 + 5 = 23?",options:["(8 − 2) × 3 + 5","8 − (2 × 3) + 5","8 − 2 × (3 + 5)","(8 − 2) × (3 + 5)"],correct_index:0,explanation:"(8 − 2) × 3 + 5 = 6 × 3 + 5 = 23. Evaluate the other placements to see why they change the result."},
  {prompt:"The temperature starts at −6°C, rises 11°C, then falls 4°C. What is the final temperature?",options:["−21°C","−1°C","1°C","9°C"],correct_index:2,explanation:"Start at −6, rise to 5, then fall to 1°C."},
  {prompt:"Which expression has no real-number result?",options:["∛(−27)","√(−36)","(−6)²","−√36"],correct_index:1,explanation:"A real number squared cannot be negative, so √(−36) is not real. Negative numbers do have real cube roots."},
];

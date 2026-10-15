import type {QuestionValues} from "./QuestionEditor";

// The first option is the key in source; rotate it so students do not see a pattern.
let index=0;
const m=(prompt:string,key:string,a:string,b:string,c:string,explanation:string):QuestionValues=>{
 const n=index++%4, options=[a,b,c]; options.splice(n,0,key);
 return {prompt,options,correct_index:n,explanation};
};
const s=(prompt:string,accepted:string[],explanation:string):QuestionValues=>({prompt,options:{kind:"short_answer",accepted,exact:true},correct_index:0,explanation});
const R=String.raw;

// 8F: monic trinomials, signed factor pairs, HCF first, non-factorable cases and checking.
export const practice8F:QuestionValues[]=[
 m("For x² + 9x + 14, which pair must be found?","Numbers with sum 9 and product 14","Numbers with sum 14 and product 9","Numbers with difference 9 and product 14","Numbers with sum 9 and product −14","The constants in (x + p)(x + q) add to 9 and multiply to 14."),
 m("Factorise x² + 11x + 24.","(x + 3)(x + 8)","(x + 4)(x + 6)","(x − 3)(x − 8)","(x + 2)(x + 12)","3 + 8 = 11 and 3 × 8 = 24."),
 m("Factorise x² + x − 30.","(x + 6)(x − 5)","(x − 6)(x + 5)","(x + 6)(x + 5)","(x − 10)(x + 3)","6 and −5 have product −30 and sum 1."),
 m("Factorise x² − 11x + 28.","(x − 7)(x − 4)","(x + 7)(x + 4)","(x − 14)(x + 2)","(x − 7)(x + 4)","Both numbers are negative because their product is positive and sum is −11."),
 m("Factorise x² − 2x − 35.","(x − 7)(x + 5)","(x + 7)(x − 5)","(x − 7)(x − 5)","(x − 35)(x + 1)","−7 × 5 = −35 and −7 + 5 = −2."),
 m("Factorise 3x² + 15x + 18 completely.","3(x + 2)(x + 3)","(3x + 2)(x + 9)","3(x² + 5x + 6)","3(x − 2)(x − 3)","Remove the HCF 3, then factor x² + 5x + 6."),
 m("Which expansion verifies x² − 4x − 21 = (x − 7)(x + 3)?","x² + 3x − 7x − 21","x² − 3x − 7x − 21","x² + 3x + 7x − 21","x² − 4x + 21","Distribute both bracket terms; the middle products combine to −4x."),
 m("Which trinomial is a perfect square?","x² − 12x + 36","x² − 12x − 36","x² − 6x + 36","x² + 12x − 36","It is (x − 6)², since −6 − 6 = −12 and (−6)² = 36."),
 s("What two integers add to −3 and multiply to −40? Enter them in ascending order, separated by a comma.",["-8, 5","−8, 5","-8,5","−8,5"],"−8 × 5 = −40 and −8 + 5 = −3."),
 m("A learner chooses −6 and 4 for x² − 2x − 24. Is the factorisation (x − 6)(x + 4) valid?","Yes; the sum is −2 and the product is −24","No; the sum is 2","No; the product is 24","No; the leading coefficient becomes −1","Both conditions are met; expanding gives x² − 2x − 24."),
 m("What value of k makes x² + kx + 18 = (x + 3)(x + 6)?","9","18","3","108","The middle coefficient is the sum of the bracket constants, 3 + 6."),
 m("Which factorisation of x² − 16x + 64 is complete?","(x − 8)²","(x + 8)²","(x − 4)(x − 16)","x(x − 16) + 64","−8 + (−8) = −16 and their product is 64."),
 m("Which expression cannot be factorised as (x + p)(x + q) with integers p and q?","x² + 4x + 7","x² + 4x + 3","x² − 4x − 5","x² + 4x − 12","No integer pair has sum 4 and product 7."),
 m("A rectangular garden has area x² + 10x + 21 m². One side is x + 3 m. What is the other?","x + 7 m","x + 21 m","x + 10 m","x − 7 m","Factor the area as (x + 3)(x + 7)."),
 m("Complete x² − 9x + 20 = (x − 5)(x − ___).","4","5","9","20","The second constant is 4: −5 − 4 = −9 and (−5)(−4) = 20."),
 m("Factorise −2x² + 14x − 24 completely.","−2(x − 3)(x − 4)","−2(x + 3)(x + 4)","2(x − 3)(x − 4)","−2(x² − 7x + 12)","Remove −2, then find two numbers with sum −7 and product 12."),
 m("Which statement about (x + 4)(x − 9) and (x − 9)(x + 4) is true?","Both equal x² − 5x − 36","Only the first equals x² − 5x − 36","Their middle terms have opposite signs","One has constant +36","Multiplication is commutative; factor order does not affect the expansion."),
 s("A monic trinomial has constant −21 and factors (x − 3)(x + 7). Enter its coefficient of x.",["4"],"The cross terms are 7x − 3x, so the coefficient is 4."),
 m("A student uses 2 and 9 to factor x² + 5x + 18. What condition did they miss?","Their sum must be 5","Their product must be 18","The leading coefficient must be 2","Both numbers must be negative","2 × 9 = 18 but 2 + 9 = 11. No integer pair gives both 5 and 18."),
 m("For x² − 13x + 36, which factor pair gives the negative middle term?","−9 and −4","9 and 4","−12 and −3","−18 and 2","The pair must multiply to 36 and add to −13."),
 s("Write x² + 2x − 48 as two linear factors. Use the form (x + a)(x − b) with positive integers a and b.",["(x + 8)(x - 6)","(x+8)(x-6)","(x + 8)(x − 6)","(x+8)(x−6)"],"8 and −6 add to 2 and multiply to −48."),
];

// 8G: non-monic ax²+bx+c, splitting the middle term, grouping and HCF.
export const practice8G:QuestionValues[]=[
 m("To split the middle term in 2x² + 7x + 3, what product and sum are needed?","Product 6, sum 7","Product 3, sum 7","Product 7, sum 6","Product 2, sum 3","The two split coefficients multiply to a × c = 2 × 3 and add to b = 7."),
 m("Which split of 7x works for 2x² + 7x + 3?","6x + x","5x + 2x","8x − x","9x − 2x","6 and 1 add to 7 and multiply to 6, enabling grouping."),
 m("Factorise 2x² + 7x + 3.","(2x + 1)(x + 3)","(2x + 3)(x + 1)","(2x − 1)(x − 3)","(x + 1)(x + 6)","Group 2x² + 6x + x + 3 = 2x(x + 3) + (x + 3)."),
 m("Factorise 3x² + 14x + 8.","(3x + 2)(x + 4)","(3x + 4)(x + 2)","(3x − 2)(x − 4)","(x + 2)(x + 12)","The cross terms are 12x and 2x, totalling 14x."),
 m("Factorise 4x² − 4x − 3.","(2x + 1)(2x − 3)","(2x − 1)(2x + 3)","(4x + 3)(x − 1)","(2x − 3)²","Split −4x as −6x + 2x and group."),
 m("Factorise 6x² − 11x + 3.","(3x − 1)(2x − 3)","(3x + 1)(2x + 3)","(6x − 3)(x − 1)","(3x − 3)(2x − 1)","The cross products −9x and −2x add to −11x."),
 m("Factorise 8x² + 2x − 3.","(4x + 3)(2x − 1)","(4x − 3)(2x + 1)","(8x − 3)(x + 1)","(2x + 3)(4x + 1)","The cross products −4x and 6x sum to 2x."),
 m("Factorise 10x² + 9x + 2.","(5x + 2)(2x + 1)","(5x + 1)(2x + 2)","(10x + 1)(x + 2)","(5x − 2)(2x − 1)","The cross products 5x and 4x total 9x."),
 s("For 3x² + 13x + 4, what two numbers split the 13x term? Enter in ascending order, separated by a comma.",["1, 12","1,12"],"1 + 12 = 13 and 1 × 12 = 3 × 4 = 12."),
 m("Which grouping completes 3x² + 13x + 4 = 3x² + 12x + x + 4?","3x(x + 4) + (x + 4)","3x(x + 4) + x(x + 4)","3x(x + 4) + (x − 4)","3x(x + 12) + (x + 4)","Each pair has the same binomial x + 4."),
 m("Factorise 5x² − 7x − 6.","(5x + 3)(x − 2)","(5x − 3)(x + 2)","(5x − 2)(x + 3)","(x − 6)(5x + 1)","The cross terms −10x and +3x give −7x."),
 m("Factorise 2x² − 9x − 5.","(2x + 1)(x − 5)","(2x − 1)(x + 5)","(2x − 5)(x + 1)","(x − 5)(x + 2)","The cross terms −10x and +x give −9x."),
 m("Factorise 12x² + 16x + 5.","(6x + 5)(2x + 1)","(6x + 1)(2x + 5)","(12x + 5)(x + 1)","(3x + 5)(4x + 1)","The cross terms 6x and 10x add to 16x."),
 m("Factorise 6x² + 11x − 10.","(3x − 2)(2x + 5)","(3x + 2)(2x − 5)","(6x − 5)(x + 2)","(3x + 5)(2x − 2)","The cross terms 15x and −4x make 11x."),
 m("Factorise 4x² + 20x + 16 completely.","4(x + 1)(x + 4)","(4x + 4)(x + 4)","4(x² + 5x + 4)","4(x − 1)(x − 4)","Remove HCF 4 first, then factor x² + 5x + 4."),
 m("Factorise −3x² + 8x + 3 completely.","−(3x + 1)(x − 3)","−(3x − 1)(x + 3)","(3x + 1)(x − 3)","−3(x + 1)(x − 3)","Take out −1 to get 3x² − 8x − 3 = (3x + 1)(x − 3)."),
 m("A rectangle has area 6x² + 19x + 10 cm². Which side pair is possible?","(3x + 2) cm and (2x + 5) cm","(3x + 5) cm and (2x + 2) cm","(6x + 2) cm and (x + 5) cm","(3x − 2) cm and (2x − 5) cm","Expanding the first pair gives 6x² + 15x + 4x + 10."),
 m("A learner splits 5x in 6x² + 5x − 6 into 2x + 3x. Why does grouping fail?","2 × 3 is not 6 × (−6)","2 + 3 is not 5","The leading coefficient is not 1","The constant must be positive","The split numbers must add to 5 and multiply to −36."),
 m("For (2x − 3)(4x + 1), what is the middle coefficient?","−10","−11","10","−2","The cross products are 2x and −12x, giving −10x."),
 m("Does reversing the two valid split terms change the final factorisation?","No; grouping can be rearranged to reveal the same factors","Yes; it changes the constant sign","Yes; it changes the roots","Only when a = 1","Addition and factor multiplication are commutative; choose pairings that share a bracket."),
 s("Factorise 6x² − x − 12. Enter two brackets, with (3x + 4) first.",["(3x + 4)(2x - 3)","(3x+4)(2x-3)","(3x + 4)(2x − 3)","(3x+4)(2x−3)"],"The cross terms −9x and 8x combine to −x, with constant −12."),
];

// 8H: common-factor cancellation, restrictions, reciprocal division and combined factorisation.
export const practice8H:QuestionValues[]=[
 m(R`Which cancellation is valid for $\frac{x+5}{x}$, with x ≠ 0?`,"None; x is a term, not a factor of the whole numerator","Cancel x to leave 5","Cancel the plus sign to get 1 + 5","Cancel x and 5 to get 1","A factor must multiply the entire numerator and denominator before it can cancel."),
 m(R`Simplify $\frac{9x}{12}$.`,R`$\frac{3x}{4}$`,R`$\frac{3}{4}$`,R`$\frac{9x}{3}$`,R`$\frac{3x}{12}$`,"Cancel the numerical HCF 3; x remains in the numerator."),
 m(R`Simplify $\frac{5(x+2)}{15(x+2)}$, where x ≠ −2.`,R`$\frac{1}{3}$`,R`$\frac{x+2}{3}$`,"3",R`$\frac{5}{15(x+2)}$`,"Cancel the shared bracket, then reduce 5/15."),
 m(R`Simplify $\frac{4x+12}{8}$.`,R`$\frac{x+3}{2}$`,R`$\frac{x+12}{2}$`,R`$x+3$`,R`$\frac{x+3}{8}$`,"Factor 4(x + 3) from the numerator before cancelling 4 with 8."),
 m(R`Simplify $\frac{x^2-25}{x+5}$, where x ≠ −5.`,"x − 5","x + 5","x² − 5","x − 25","Use x² − 25 = (x − 5)(x + 5) and cancel the common factor."),
 m(R`Simplify $\frac{12x(x-1)}{18x(x+4)}$, where x ≠ 0.`,R`$\frac{2(x-1)}{3(x+4)}$`,R`$\frac{2}{3}$`,R`$\frac{2(x+4)}{3(x-1)}$`,R`$\frac{12(x-1)}{18x(x+4)}$`,"Cancel x and divide 12 and 18 by 6; the different brackets remain."),
 m(R`Simplify $\frac{3x}{5}\times\frac{10}{9x}$, where x ≠ 0.`,R`$\frac{2}{3}$`,R`$\frac{30x}{45}$`,R`$\frac{6x}{9}$`,R`$\frac{3}{2}$`,"Cancel x, reduce 10/5 to 2 and 3/9 to 1/3."),
 m(R`Rewrite $\frac{x+1}{4}\div\frac{x+1}{6}$ as multiplication (x ≠ −1).`,R`$\frac{x+1}{4}\times\frac{6}{x+1}$`,R`$\frac{x+1}{4}\times\frac{x+1}{6}$`,R`$\frac{4}{x+1}\times\frac{6}{x+1}$`,R`$\frac{x+1}{6}\times\frac{x+1}{4}$`,"Keep the first fraction and multiply by the reciprocal of the second."),
 m(R`Simplify $\frac{8-2x}{12-3x}$, where x ≠ 4.`,R`$\frac{2}{3}$`,R`$\frac{8}{12}-\frac{2x}{3x}$`,R`$\frac{2x}{3x}$`,R`$\frac{8-2x}{9x}$`,"Factor as 2(4 − x)/[3(4 − x)] before cancelling."),
 m(R`Simplify $\frac{(x-3)^2}{5(x-3)}$, where x ≠ 3.`,R`$\frac{x-3}{5}$`,R`$\frac{1}{5}$`,R`$\frac{(x-3)^2}{5}$`,"5(x − 3)","One copy of x − 3 cancels; one remains."),
 m(R`Simplify $\frac{2(x+4)}{3(x-1)}\times\frac{9(x-1)}{5(x+4)}$ where defined.`,R`$\frac{6}{5}$`,R`$\frac{18(x+4)}{15(x-1)}$`,R`$\frac{2}{15}$`,R`$\frac{5}{6}$`,"Cancel both common brackets; 2 × 9/(3 × 5) = 6/5."),
 m(R`Simplify $\frac{x^2-9}{x-3}$, where x ≠ 3.`,"x + 3","x − 3","x² + 3","1","Factor the difference of squares into (x − 3)(x + 3)."),
 m(R`Simplify $\frac{2x}{x+7}\div\frac{4x}{3(x+7)}$, where defined.`,R`$\frac{3}{2}$`,R`$\frac{1}{6}$`,R`$\frac{8x^2}{3(x+7)^2}$`,R`$\frac{2}{3}$`,"Multiply by 3(x + 7)/(4x), then cancel x and x + 7."),
 m(R`Why is $\frac{x+6}{x}$ not equal to 6 when x ≠ 0?`,"The numerator is a sum; x cannot cancel across addition","x is always 1","Six is a factor of x","The expression is undefined for every x","It equals 1 + 6/x, not 6 in general."),
 m(R`Simplify $\frac{x^2+7x+12}{x+3}$, where x ≠ −3.`,"x + 4","x + 3","x + 7","x + 12","Factor the numerator as (x + 3)(x + 4)."),
 m(R`Simplify $\frac{7-2x}{2x-7}$, where x ≠ 7/2.`,"−1","1","2x − 7","7 − 2x","7 − 2x = −(2x − 7), so the ratio is −1."),
 m(R`Simplify $\frac{x^2-16}{x^2+6x+8}\times\frac{x+2}{x-4}$ where defined.`,"1","x + 4","x − 4",R`$\frac{x+2}{x+4}$`,"Factor (x − 4)(x + 4) and (x + 2)(x + 4); every factor cancels."),
 m(R`Which original value is excluded from $\frac{x^2-4}{x-2}$ even after simplification?`,"x = 2","x = −2","x = 0","No values","The original denominator x − 2 is zero at x = 2; cancellation cannot restore it."),
 s(R`For x = 2, evaluate $\frac{3x+9}{x+3}$. Enter the number.`,["3"],"3x + 9 = 3(x + 3), so the ratio is 3 when x ≠ −3."),
 m(R`Simplify $\frac{x^2-4x}{x}\times\frac{3}{x-4}$, where x ≠ 0,4.`,"3","3x","x − 4",R`$\frac{3}{x}$`,"Factor x(x − 4); both factors cancel with denominators."),
 m(R`Simplify $\frac{6(x+2)}{5(x-4)}\div\frac{9(x+2)}{10(x-4)}$ where defined.`,R`$\frac{4}{3}$`,R`$\frac{3}{4}$`,R`$\frac{27}{50}$`,R`$\frac{2}{3}$`,"Use the reciprocal; bracket factors cancel and 6 × 10/(5 × 9) = 4/3."),
];

// 8I: LCD with constants and variables, binomial numerators, missing fractions and reasoning.
export const practice8I:QuestionValues[]=[
 m(R`What is the lowest common denominator of $\frac{x}{6}$ and $\frac{5x}{8}$?`,"24","48","14","6","The least common multiple of 6 and 8 is 24."),
 m(R`Rewrite $\frac{3x}{4}$ with denominator 12.`,R`$\frac{9x}{12}$`,R`$\frac{3x}{12}$`,R`$\frac{12x}{12}$`,R`$\frac{6x}{12}$`,"Multiply numerator and denominator by 3."),
 m(R`Simplify $\frac{x}{3}+\frac{x}{6}$.`,R`$\frac{x}{2}$`,R`$\frac{2x}{9}$`,R`$\frac{x}{9}$`,R`$\frac{2x}{6}$`,"Write x/3 as 2x/6; the total 3x/6 reduces to x/2."),
 m(R`Simplify $\frac{5y}{8}-\frac{y}{4}$.`,R`$\frac{3y}{8}$`,R`$\frac{4y}{4}$`,R`$\frac{y}{8}$`,R`$\frac{4y}{8}$`,"Convert y/4 to 2y/8, then subtract."),
 m(R`Simplify $\frac{2a}{5}+\frac{a}{3}$.`,R`$\frac{11a}{15}$`,R`$\frac{3a}{8}$`,R`$\frac{7a}{15}$`,R`$\frac{11a}{8}$`,"Use LCD 15: 6a/15 + 5a/15 = 11a/15."),
 m(R`Simplify $\frac{x+1}{2}+\frac{x-1}{4}$.`,R`$\frac{3x+1}{4}$`,R`$\frac{2x}{6}$`,R`$\frac{3x-1}{4}$`,R`$\frac{2x+1}{4}$`,"Use denominator 4: [2(x + 1) + (x − 1)]/4 = (3x + 1)/4."),
 m(R`Simplify $\frac{4}{x}-\frac{3}{2x}$, x ≠ 0.`,R`$\frac{5}{2x}$`,R`$\frac{1}{2x}$`,R`$\frac{1}{x}$`,R`$\frac{5}{x}$`,"Use LCD 2x and subtract 8 − 3 in the numerator."),
 m(R`Simplify $\frac{3}{x}+\frac{2}{x^2}$, x ≠ 0.`,R`$\frac{3x+2}{x^2}$`,R`$\frac{5}{x^2}$`,R`$\frac{3+2x}{x^2}$`,R`$\frac{5}{x^3}$`,"Rewrite 3/x as 3x/x² before combining."),
 m(R`Which denominator is best for $\frac{7}{6x}-\frac{1}{4x}$?`,"12x","24x²","10x","2x","The numeric LCM is 12 and both denominators already contain x."),
 m(R`Simplify $\frac{2x-3}{6}+\frac{x+1}{3}$.`,R`$\frac{4x-1}{6}$`,R`$\frac{3x-2}{9}$`,R`$\frac{4x+1}{6}$`,R`$\frac{3x-1}{6}$`,"Add [2x − 3 + 2(x + 1)]/6 and collect like terms."),
 m(R`Find the missing fraction: $\frac{x}{4}+\square=\frac{3x}{8}$.`,R`$\frac{x}{8}$`,R`$\frac{2x}{8}$`,R`$\frac{x}{4}$`,R`$\frac{3x}{4}$`,"x/4 = 2x/8, leaving x/8."),
 m(R`Simplify $\frac{5}{3x}-\frac{1}{2x}$, x ≠ 0.`,R`$\frac{7}{6x}$`,R`$\frac{4}{x}$`,R`$\frac{7}{5x}$`,R`$\frac{2}{6x}$`,"Convert to 10/(6x) − 3/(6x)."),
 m(R`A walker travels d km at 4 km/h and returns d km at 6 km/h. Total time?`,R`$\frac{5d}{12}$ hours`,R`$\frac{d}{10}$ hours`,R`$\frac{2d}{5}$ hours`,R`$\frac{d}{24}$ hours`,"Time = distance/speed, so d/4 + d/6 = (3d + 2d)/12."),
 m(R`Simplify $\frac{2}{x^2}-\frac{5}{x}$, x ≠ 0.`,R`$\frac{2-5x}{x^2}$`,R`$\frac{-3}{x^2}$`,R`$\frac{2x-5}{x^2}$`,R`$\frac{2-5}{x^3}$`,"Rewrite 5/x as 5x/x²; subtract the entire numerator."),
 m(R`What is wrong with $\frac{x+2}{3}+\frac{x-1}{4}=\frac{2x+1}{7}$?`,"Denominators must be made equal before numerators are added","The numerators should be multiplied","The answer must contain x²","The denominator should be 1","Adding denominators is not the fraction-addition rule; use LCD 12."),
 m(R`Simplify $\frac{3x+2}{4}-\frac{x-3}{6}$.`,R`$\frac{7x+12}{12}$`,R`$\frac{7x-6}{12}$`,R`$\frac{2x+5}{10}$`,R`$\frac{7x}{12}$`,"[3(3x + 2) − 2(x − 3)]/12 = (7x + 12)/12."),
 m(R`Simplify $\frac{4}{3x}+\frac{5}{6x^2}$, x ≠ 0.`,R`$\frac{8x+5}{6x^2}$`,R`$\frac{9}{9x^3}$`,R`$\frac{4x+5}{6x^2}$`,R`$\frac{8+5x}{6x^2}$`,"The LCD is 6x², giving 8x/(6x²) + 5/(6x²)."),
 m(R`Which is the simplified result of $\frac{x+4}{5}+\frac{2x-1}{10}$?`,R`$\frac{4x+7}{10}$`,R`$\frac{3x+3}{15}$`,R`$\frac{4x+9}{10}$`,R`$\frac{2x+3}{10}$`,"Double the first numerator, then add: 2x + 8 + 2x − 1 = 4x + 7."),
 m(R`A learner uses denominator 30 rather than 15 for $\frac{x}{3}+\frac{x}{5}$. Which is true?`,`It can work, but 15 needs less simplifying`,`It makes the sum mathematically invalid`,`30 is the lowest common denominator`,`The numerator must be 2x`,"30 is common to both denominators but is not the lowest."),
 s(R`If x = 12, evaluate $\frac{x}{4}+\frac{x}{6}$. Enter the number.`,["5"],"12/4 + 12/6 = 3 + 2 = 5; equivalently 5x/12 = 5."),
 m(R`Simplify $\frac{x}{2}-\frac{3}{x}$, x ≠ 0.`,R`$\frac{x^2-6}{2x}$`,R`$\frac{x-6}{2x}$`,R`$\frac{x^2-3}{2x}$`,R`$\frac{x-3}{2-x}$`,"Use LCD 2x: x/2 = x²/(2x), and 3/x = 6/(2x)."),
];

// 8J: subtraction over LCDs, distinct/repeated binomial denominators, reverse signs and factorisation.
export const practice8J:QuestionValues[]=[
 m(R`Expand $-3(x+4)$.`,"−3x − 12","−3x + 12","3x − 12","−3x − 4","The negative multiplier applies to both terms in the bracket."),
 m(R`What is the LCD of $\frac{2}{x-3}$ and $\frac{5}{x+2}$?`,"(x − 3)(x + 2)","2(x − 3)(x + 2)","x² − 1","x − 3 + x + 2","The two distinct binomial denominators both need to appear as factors."),
 m(R`Simplify $\frac{x+1}{2}-\frac{x+3}{5}$.`,R`$\frac{3x-1}{10}$`,R`$\frac{3x+11}{10}$`,R`$\frac{3x+1}{10}$`,R`$\frac{x-2}{7}$`,"[5(x + 1) − 2(x + 3)]/10 = (3x − 1)/10."),
 m(R`Simplify $\frac{2x-1}{3}-\frac{x+2}{4}$.`,R`$\frac{5x-10}{12}$`,R`$\frac{5x+2}{12}$`,R`$\frac{5x-2}{12}$`,R`$\frac{x-3}{7}$`,"[4(2x − 1) − 3(x + 2)]/12 = (5x − 10)/12."),
 m(R`Simplify $\frac{3}{x+1}+\frac{2}{x-2}$, where defined.`,R`$\frac{5x-4}{(x+1)(x-2)}$`,R`$\frac{5}{2x-1}$`,R`$\frac{5x+4}{(x+1)(x-2)}$`,R`$\frac{x-4}{(x+1)(x-2)}$`,"The numerator is 3(x − 2) + 2(x + 1) = 5x − 4."),
 m(R`Simplify $\frac{5}{x-4}-\frac{2}{x+3}$, where defined.`,R`$\frac{3x+23}{(x-4)(x+3)}$`,R`$\frac{3x+7}{(x-4)(x+3)}$`,R`$\frac{7x+7}{(x-4)(x+3)}$`,R`$\frac{3}{2x-1}$`,"5(x + 3) − 2(x − 4) = 3x + 23."),
 m(R`What is the LCD of $\frac{1}{(x+2)^2}$ and $\frac{3}{x+2}$?`,"(x + 2)²","2(x + 2)²","(x + 2)³","x + 2","The squared denominator already contains the needed single factor."),
 m(R`Simplify $\frac{4}{(x-1)^2}-\frac{3}{x-1}$, x ≠ 1.`,R`$\frac{7-3x}{(x-1)^2}$`,R`$\frac{1}{x-1}$`,R`$\frac{4-3x}{(x-1)^2}$`,R`$\frac{3x+1}{(x-1)^2}$`,"Use the squared denominator: 4 − 3(x − 1) = 7 − 3x."),
 m(R`Which numerator follows from $\frac{x-2}{3}-\frac{2x+1}{4}$ using denominator 12?`,"4(x − 2) − 3(2x + 1)","4(x − 2) − 3(2x) + 1","3(x − 2) − 4(2x + 1)","4(x − 2) + 3(2x + 1)","Subtract the whole second numerator after scaling; keep brackets until distributing."),
 m(R`Simplify $\frac{2}{3-x}+\frac{5}{x-3}$, x ≠ 3.`,R`$\frac{3}{x-3}$`,R`$\frac{7}{x-3}$`,R`$\frac{-3}{x-3}$`,"0","Because 3 − x = −(x − 3), the first fraction is −2/(x − 3)."),
 m(R`Simplify $\frac{1}{x+5}+\frac{2}{(x+5)^2}$, x ≠ −5.`,R`$\frac{x+7}{(x+5)^2}$`,R`$\frac{3}{(x+5)^2}$`,R`$\frac{x+3}{(x+5)^2}$`,R`$\frac{3}{x+5}$`,"The first numerator becomes x + 5; add 2 to get x + 7."),
 m(R`Simplify $\frac{3}{x-2}-\frac{3}{2-x}$, x ≠ 2.`,R`$\frac{6}{x-2}$`,`0`,R`$\frac{3}{x-2}$`,R`$\frac{-6}{x-2}$`,"Since 2 − x = −(x − 2), subtracting 3/(2 − x) adds 3/(x − 2)."),
 m(R`Simplify $\frac{2}{x^2-9}+\frac{1}{x+3}$, where defined.`,R`$\frac{x-1}{(x-3)(x+3)}$`,R`$\frac{x+5}{(x-3)(x+3)}$`,R`$\frac{3}{x^2-9}$`,R`$\frac{x-5}{(x-3)(x+3)}$`,"Factor x² − 9; numerator 2 + (x − 3) = x − 1."),
 m(R`Simplify $\frac{4}{2x+6}-\frac{1}{x+3}$, x ≠ −3.`,R`$\frac{1}{x+3}$`,R`$\frac{3}{x+3}$`,R`$\frac{2}{x+3}$`,`0`,"First reduce 4/[2(x + 3)] to 2/(x + 3), then subtract one copy."),
 m(R`Simplify $\frac{x}{x+2}-\frac{2}{x-1}$, where defined.`,R`$\frac{x^2-3x-4}{(x+2)(x-1)}$`,R`$\frac{x^2+x+4}{(x+2)(x-1)}$`,R`$\frac{x^2-x-4}{(x+2)(x-1)}$`,R`$\frac{x-2}{2x+1}$`,"The numerator is x(x − 1) − 2(x + 2) = x² − 3x − 4."),
 m(R`What is the mistake in $\frac{x+2}{4}-\frac{x-1}{3}=\frac{3x+6-4x-4}{12}$?`,"The −4 multiplier should turn −1 into +4","The denominator must be 7","The first numerator should be multiplied by 4","The x terms should add to 7x","The numerator is 3(x + 2) − 4(x − 1) = 3x + 6 − 4x + 4."),
 m(R`Simplify $\frac{3}{(x+1)(x+4)}+\frac{2}{(x+4)(x+5)}$ where defined.`,R`$\frac{5x+17}{(x+1)(x+4)(x+5)}$`,R`$\frac{5}{(x+1)(x+4)(x+5)}$`,R`$\frac{5x+13}{(x+1)(x+4)(x+5)}$`,R`$\frac{5x+17}{(x+4)^2}$`,"LCD includes each distinct factor once; numerator 3(x + 5) + 2(x + 1) = 5x + 17."),
 m(R`Simplify $\frac{2}{x^2-4}-\frac{1}{x+2}$, where defined.`,R`$\frac{4-x}{(x-2)(x+2)}$`,R`$\frac{x}{(x-2)(x+2)}$`,R`$\frac{2-x}{(x-2)(x+2)}$`,R`$\frac{1}{x-2}$`,"Use (x − 2)(x + 2); subtract (x − 2) from 2 to get 4 − x."),
 m(R`For $\frac{1}{x-4}-\frac{1}{4-x}$, what value is excluded?`,"x = 4","x = −4","x = 0","No value","Both original denominators vanish at x = 4."),
 s(R`At x = 5, evaluate $\frac{2}{x-1}+\frac{3}{x+1}$. Enter the simplest answer.`,["1","1/1"],"At x = 5, the terms are 2/4 and 3/6, each 1/2; their sum is 1."),
 m(R`Simplify $\frac{1}{x^2+x}-\frac{1}{x^2-x}$, where defined.`,R`$\frac{-2}{x(x+1)(x-1)}$`,R`$\frac{2}{x(x+1)(x-1)}$`,`0`,R`$\frac{-2x}{(x+1)(x-1)}$`,"Factor denominators as x(x + 1) and x(x − 1); numerator (x − 1) − (x + 1) = −2."),
];

// 8K: clear every denominator, solve and check, include algebraic denominators and error analysis.
export const practice8K:QuestionValues[]=[
 m(R`What is the LCD of $\frac{x}{4}+\frac{x}{6}=5$?`,"12","24","10","2","The least common multiple of 4 and 6 is 12."),
 m(R`After multiplying every term of $\frac{x}{4}+\frac{x}{6}=5$ by 12, which equation results?`,`3x + 2x = 60`,`3x + 2x = 5`,`12x + 12x = 60`,`4x + 6x = 60`,"12 × x/4 = 3x, 12 × x/6 = 2x, and 12 × 5 = 60."),
 s(R`Solve $\frac{x}{4}+\frac{x}{6}=5$. Enter x.`,["12"],"Clearing denominator 12 gives 3x + 2x = 60, hence x = 12."),
 m(R`Solve $\frac{2x}{3}-\frac{x}{6}=5$.`,`x = 10`,`x = 5`,`x = 6`,`x = 30`,"Multiply by 6: 4x − x = 30, so x = 10."),
 m(R`Solve $\frac{x+2}{3}+\frac{x-1}{2}=4$.`,`x = 23/5`,`x = 4`,`x = 5`,`x = −23/5`,"Multiply by 6: 2(x + 2) + 3(x − 1) = 24, so 5x + 1 = 24 and x = 23/5."),
 m(R`Solve $\frac{x-3}{4}-\frac{x+1}{6}=1$.`,`x = 23`,`x = 17`,`x = 11`,`x = −23`,"Multiply by 12: 3(x − 3) − 2(x + 1) = 12, giving x − 11 = 12."),
 m(R`Solve $\frac{3}{2x}=\frac{1}{4}$, x ≠ 0.`,`x = 6`,`x = 3/2`,`x = 12`,`x = 2/3`,"Cross-multiplication gives 12 = 2x, so x = 6."),
 m(R`Solve $\frac{2}{x+1}=\frac{3}{x+5}$, x ≠ −1,−5.`,`x = 7`,`x = −7`,`x = 4`,`x = 1`,"2(x + 5) = 3(x + 1), hence 2x + 10 = 3x + 3 and x = 7."),
 m(R`When clearing denominators in $\frac{x}{3}+2=\frac{x}{4}$, what does the 2 become?`,`24 after multiplying by 12`,`2 after multiplying by 12`,`6 after multiplying by 3`,`8 after multiplying by 4`,"Every term must be multiplied by the LCD 12, including the whole-number term."),
 m(R`Solve $\frac{x}{3}+2=\frac{x}{4}$.`,`x = −24`,`x = 24`,`x = −12`,`x = 12`,"Multiplying by 12 gives 4x + 24 = 3x, so x = −24."),
 m(R`Solve $\frac{5}{2x}-\frac{1}{3x}=1$, x ≠ 0.`,"x = 13/6","x = 11/6","x = 13","x = 6/13","Multiply by 6x: 15 − 2 = 6x, so x = 13/6."),
 m(R`Solve $\frac{4}{x-2}=\frac{2}{x+1}$, x ≠ 2,−1.`,`x = −4`,`x = 4`,`x = 0`,`x = 2`,"4(x + 1) = 2(x − 2) gives 2x = −8; −4 is permitted."),
 m(R`Why is x = 3 invalid for $\frac{x+1}{x-3}=2$, even if it appears during working?`,`It makes the original denominator zero`,`It makes the numerator zero`,`Two cannot be a solution`,`It makes both sides negative`,"Check each candidate in the original equation; division by zero is undefined."),
 m(R`Solve $\frac{2x+1}{x-1}=3$, x ≠ 1.`,`x = 4`,`x = 2`,`x = −4`,`x = 1`,"2x + 1 = 3(x − 1); then x = 4, which is allowed."),
 m(R`A number and half that number total 18. Which equation models this?`,R`$x+\frac{x}{2}=18$`,R`$\frac{x}{2}=18$`,R`$x+2x=18$`,R`$\frac{2}{x}+x=18$`,"The number is x and half of it is x/2; add both amounts."),
 s("Solve: one number and half of it total 18. Enter the number.",["12"],"x + x/2 = 18; multiplying by 2 gives 3x = 36, so x = 12."),
 m(R`Solve $\frac{1}{x-1}-\frac{1}{x+2}=\frac{3}{10}$, x ≠ 1,−2.`,`x = 3 or x = −4`,`x = 3 only`,`x = −4 only`,`x = 1 or x = −2`,"The left side is 3/[(x − 1)(x + 2)], so the product equals 10; x² + x − 12 = 0 has roots 3 and −4."),
 m(R`A learner multiplies $\frac{x-2}{5}-\frac{x+1}{3}=2$ by 15 but obtains 3(x − 2) − (x + 1) = 30. What was missed?`,`The second numerator needs a factor 5`,`The right side needs a factor 5`,`The first numerator needs a factor 5`,`The minus sign should become plus`,"15/3 = 5, so the second fraction becomes 5(x + 1)."),
 m(R`Solve $\frac{x-2}{5}-\frac{x+1}{3}=2$.`,`x = −41/2`,`x = 41/2`,`x = −20`,`x = 20`,"Multiply by 15: 3(x − 2) − 5(x + 1) = 30; −2x − 11 = 30, so x = −41/2."),
 m(R`For $\frac{2}{x}=\frac{x}{8}$, which solutions satisfy the original equation?`,`x = −4 and x = 4`,`x = 4 only`,`x = 0 and x = 4`,`x = −8 and x = 8`,"Multiply by 8x (x ≠ 0): x² = 16; both ±4 are allowed."),
 m(R`Solve $\frac{x+4}{3}=\frac{2x-1}{5}$.`,`x = 23`,`x = −23`,`x = 17`,`x = 7`,"5(x + 4) = 3(2x − 1), so 5x + 20 = 6x − 3 and x = 23."),
];

export const chapter8FurtherPractice={"8F":practice8F,"8G":practice8G,"8H":practice8H,"8I":practice8I,"8J":practice8J,"8K":practice8K} as const;

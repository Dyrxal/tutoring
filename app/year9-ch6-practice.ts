import type {QuestionValues} from "./QuestionEditor";

// In each section, positions 0–7 are core and 8–20 are optional.
// 6F's first two entries identify the pre-existing rows, which the importer retains.
let keyIndex=0;
const m=(prompt:string,key:string,a:string,b:string,c:string,explanation:string):QuestionValues=>{
 const correct_index=keyIndex++%4,options=[a,b,c];options.splice(correct_index,0,key);
 return {prompt,options,correct_index,explanation};
};
const s=(prompt:string,accepted:string[],explanation:string):QuestionValues=>({prompt,options:{kind:"short_answer",accepted,exact:true},correct_index:0,explanation});
const R=String.raw;

// 6A: base/index, expanded and index form, signed and fractional powers, primes and contexts.
export const practice6A:QuestionValues[]=[
 m("In 7⁴, which number is the base?","7","4","28","2401","The base is the repeated factor; the index 4 tells how many copies of 7 multiply."),
 m("What does (pq)³ mean in expanded form?","(pq) × (pq) × (pq)","p × q × 3","p × p × p × q","p × q × p × q × p","The entire bracket pq is the repeated factor, written three times."),
 m("Which is the expansion of 4a²b³?","4 × a × a × b × b × b","4 × 4 × a × a × b × b × b","4 × a × a × a × b × b","(4ab)⁵","The coefficient 4 appears once; a appears twice and b three times."),
 m("Evaluate (−4)³.","−64","64","−12","−81","Three negative factors give a negative product: (−4)(−4)(−4) = −64."),
 m("Evaluate (3/5)².","9/25","6/10","3/25","9/5","Square numerator and denominator: (3 × 3)/(5 × 5) = 9/25."),
 m("Write 9 × t × t × t × t in index form.","9t⁴","(9t)⁴","9⁴t","36t","There are four factors of t; the 9 occurs only once."),
 m("Which is the prime factorisation of 84 in index form?","2² × 3 × 7","2 × 3² × 7","4 × 3 × 7","2² × 21","84 = 2 × 2 × 3 × 7, all prime factors."),
 m("If a = −3, what is a² + 2a?","3","−15","−3","15","Substitute a = −3: (−3)² + 2(−3) = 9 − 6 = 3."),
 m("What is the index in (−2x)⁵?","5","−2","x","−2x","The whole bracket is the base; 5 counts how many copies are multiplied."),
 m("Evaluate −(−6)².","−36","36","−12","12","Square the bracketed −6 to get 36, then apply the minus outside."),
 m("Which expression equals −25?","−5²","(−5)²","(−5)⁴","5²","Without brackets, the power acts on 5 before the leading minus."),
 m("What is the index form of 2 × 2 × x × x × x × y?","2²x³y","2³x²y","(2xy)⁶","4x²y³","Group identical factors; 2 appears twice, x three times, y once."),
 s("Find n if 4ⁿ = 1024. Enter the whole-number index.",["5"],"4 × 4 × 4 × 4 × 4 = 1024, so n = 5."),
 m("An insect colony starts with 3 members and doubles after each day. How many are there after four days?","48","24","16","81","Four doublings give 3 × 2⁴ = 48; the starting 3 is not another doubling."),
 m("Which is the HCF of 72 = 2³ × 3² and 90 = 2 × 3² × 5?","18","6","36","360","Take each shared prime to its smaller index: 2 × 3² = 18."),
 m("Which is the LCM of 12 = 2² × 3 and 45 = 3² × 5?","180","60","90","540","Use each prime at its larger index: 2² × 3² × 5 = 180."),
 m("Evaluate (−2/3)³.","−8/27","8/27","−6/9","−8/9","Cube both −2 and 3; an odd number of negative factors stays negative."),
 m("Which expression is the prime factor form of 150?","2 × 3 × 5²","2 × 3² × 5","6 × 5²","2 × 3 × 5³","150 = 2 × 75 = 2 × 3 × 25 = 2 × 3 × 5²."),
 m("A student writes (5x)³ = 5x³. What did the repeated-factor expansion omit?","There must be three factors of 5 as well as three factors of x","The index must become 6","Only x should be repeated","The product must become 15x","(5x)(5x)(5x) contains 5³, so it equals 125x³."),
 s("A display shows 1, 3, 9, 27, ... . If the first term is term 0, what is term 5?",["243"],"Each step triples. Term 5 is 3⁵ = 243."),
 m("Which statement about a¹ is always true?","a¹ = a","a¹ = 1","a¹ = 0","a¹ = a + 1","One copy of the base a is simply a."),
];

// 6B: laws 1 and 2, implicit indices, coefficients, multiple bases, missing exponents and errors.
export const practice6B:QuestionValues[]=[
 m("Simplify 5³ × 5⁴ in index form.","5⁷","25⁷","5¹²","5¹","For the same base under multiplication, add indices 3 + 4."),
 m("Simplify x⁹ ÷ x⁵.","x⁴","x¹⁴","x⁴⁵","1/x⁴","Cancel five matching factors of x, leaving x⁴, for x ≠ 0."),
 m("Simplify y × y⁶.","y⁷","y⁶","y⁸","2y⁶","A lone y has index 1; add 1 + 6."),
 m("Simplify 4a³ × 3a².","12a⁵","7a⁵","12a⁶","12a","Multiply coefficients and add exponents of the shared base a."),
 m("Simplify x⁴y² × x³y.","x⁷y³","x¹²y²","x⁷y²","x⁷y","Group x factors and y factors separately, remembering y = y¹."),
 m(R`Simplify $\frac{18b^7}{6b^3}$, for b ≠ 0.`,"3b⁴","12b⁴","3b¹⁰","3b³","Divide 18 by 6 and subtract the b indices: 7 − 3 = 4."),
 m(R`Simplify $\frac{2m^4n^2\times3m^2n}{6m^3n}$, where m,n ≠ 0.`,"m³n²","m⁶n³","m³n","6m³n²","The numeric factor is 1; m has 4 + 2 − 3 = 3 and n has 2 + 1 − 1 = 2."),
 m("Which expression cannot be combined by merely adding the indices?","2³ × 3⁴","a² × a⁵","(−4)² × (−4)³","p × p⁶","The bases 2 and 3 differ; the same-base law does not apply."),
 s("Find n in 7ⁿ × 7³ = 7¹¹. Enter n.",["8"],"Add the powers: n + 3 = 11, so n = 8."),
 m("Which quotient simplifies to t⁵?","t⁸ ÷ t³","t⁸ ÷ t⁵","t³ ÷ t⁸","t² ÷ t³","Subtract denominator index from numerator index: 8 − 3 = 5."),
 m("Evaluate 11⁹ ÷ 11⁷ without calculating 11⁹.","121","11","22","11¹⁶","The quotient is 11² = 121."),
 m("Simplify 6p²q⁵ × 2pq².","12p³q⁷","8p³q⁷","12p²q¹⁰","12p³q³","6 × 2 = 12; p indices total 3 and q indices total 7."),
 m(R`Simplify $\frac{15a^6c^4}{25a^2c}$.`,R`$\frac{3a^4c^3}{5}$`,R`$\frac{5a^4c^3}{3}$`,R`$\frac{3a^8c^4}{5}$`,R`$\frac{3a^4c^4}{5}$`,"Reduce 15/25 to 3/5, then subtract 2 from 6 and 1 from 4."),
 m("A student writes 2x⁵ × 4x² = 6x⁷. Which part is wrong?","The coefficients must multiply to 8","The x exponents must multiply to 10","The result should have x³","Both coefficients and indices must add","The indices add, but numerical coefficients multiply: 8x⁷."),
 m("Simplify a⁶ ÷ a² × a³, working left to right.","a⁷","a¹","a⁵","a¹¹","Division and multiplication share precedence: a⁶ ÷ a² = a⁴, then × a³ = a⁷."),
 m("Find k if (3x²)(kx⁴) = 21x⁶.","7","18","3","21","The x powers already add to 6; 3k = 21 gives k = 7."),
 m("Simplify (−2)⁶ ÷ (−2)⁴.","4","−4","(−2)¹⁰","1/4","The common base is (−2); subtract indices to get (−2)² = 4."),
 m("Which expression equals 3⁴ × 5⁴?","15⁴","15⁸","8⁴","3⁸ × 5⁸","The factors have the same power, so they may be grouped as (3 × 5)⁴."),
 m("A learner simplifies a⁷ ÷ a as a⁷. What did they forget?","The denominator a has index 1","The denominator has index 0","The quotient has index 8","Division requires adding indices","Subtract 1: a⁷ ÷ a¹ = a⁶."),
 s("If x ≠ 0, simplify x⁴ × x³ ÷ x⁶. Enter the remaining power as a plain expression.",["x"],"Add the numerator indices to 7, then subtract 6 to obtain x¹ = x."),
 m("Suppose u = 2x² and v = 5x³. Simplify uv.","10x⁵","7x⁵","10x⁶","10x","Multiply 2 × 5 and add the powers of x: 2 + 3 = 5."),
];

// 6C: power of a power, zero with bracket/sign scope, mixed laws and conceptual counterexamples.
export const practice6C:QuestionValues[]=[
 m("Simplify (a⁴)³.","a¹²","a⁷","a⁶⁴","3a⁴","A power raised to a power multiplies indices: 4 × 3 = 12."),
 m("Simplify 5(x³)².","5x⁶","25x⁶","5x⁵","10x⁶","The outer square applies to x³, not to the coefficient 5 outside the brackets."),
 m("Evaluate (−9)⁰.","1","−1","0","−9","Every non-zero base raised to 0 equals 1."),
 m("Evaluate −(4y)⁰ for y ≠ 0.","−1","1","−4","0","The bracket is raised to 0 first, giving 1; the leading minus remains."),
 m("Evaluate 7t⁰ − (7t)⁰ for t ≠ 0.","6","0","7","−1","7t⁰ = 7 × 1, while the whole bracket (7t)⁰ = 1."),
 m("Simplify (m²)³ × m⁴.","m¹⁰","m²⁴","m⁹","m¹⁴","The bracket gives m⁶; multiplying by m⁴ adds indices to 10."),
 m(R`Simplify $\frac{(p^3)^4}{p^7}$, p ≠ 0.`,"p⁵","p¹²","p¹¹","p¹⁹","First multiply 3 × 4 to get p¹², then subtract 7."),
 m("Which statement about 0⁰ follows from the zero-power law taught here?","It is not covered; the rule assumes a non-zero base","It must be 1","It must be 0","It is always −1","The law a⁰ = 1 explicitly requires a ≠ 0."),
 m("Simplify ((r²)³)⁴.","r²⁴","r⁹","r¹⁴","r⁴⁸","Nested powers multiply: 2 × 3 × 4 = 24."),
 m("A student writes (b⁶)² = b⁸. What is the correction?","b¹²; multiply the indices","b³; divide the indices","b³⁶; square the index only","b⁶; the outer index disappears","The second power repeats b⁶ twice, giving b^(6 + 6) = b¹²."),
 m("Which expression equals 1 for all non-zero x?","(3x²)⁰","3x⁰","(0x)⁰","x⁰ − 1","The non-zero bracket 3x² raised to zero equals 1."),
 m("Simplify (2³)⁴ ÷ 2⁹.","2³","2¹³","2²¹","2⁵","The numerator is 2¹²; subtract denominator index 9."),
 m("A colony follows N = 7 × 3ᵗ. What is N at t = 0?","7","0","1","21","3⁰ = 1, so the initial count is 7 × 1."),
 s("Find the positive whole number n if (2ⁿ)³ = 2¹⁸.",["6"],"The powers multiply, so 3n = 18 and n = 6."),
 m("Rewrite 16³ using base 2.","2¹²","2⁷","2⁶⁴","2⁸","16 = 2⁴, hence (2⁴)³ = 2¹²."),
 m("Simplify (q⁴)⁰ for q ≠ 0.","1","q⁴","0","q⁰⁴","The entire non-zero bracket is raised to zero."),
 m("Simplify 2(h⁰)³ + 4, for h ≠ 0.","6","10","4","2","h⁰ = 1; 2 × 1³ + 4 = 6."),
 m("How many ordered positive-integer pairs (m,n) satisfy (aᵐ)ⁿ = a¹²?","6","3","12","5","m × n = 12; ordered pairs are (1,12),(2,6),(3,4) and their reverses."),
 m("Which simplification of (x³)² × (x²)³ is correct?","x¹²","x⁶","x³⁶","x⁵","Each bracket becomes x⁶, then multiplication adds the indices."),
 m("A student says (2x)⁰ = 2 because only x has zero power. Why is this wrong?","The brackets put 2x together under the zero power","The coefficient becomes 0","Zero powers are never 1","x⁰ = 2","The base is the entire bracket 2x, which is non-zero, so the result is 1."),
 m(R`Simplify $\frac{(x^2)^5\,x^3}{x^{13}}$, x ≠ 0.`,"1","x²","x¹⁸","0","The numerator has x¹⁰ × x³ = x¹³; x¹³/x¹³ = x⁰ = 1."),
];

// 6D: distributing powers over products and quotients, signs, outside factors and false laws.
export const practice6D:QuestionValues[]=[
 m("Expand (3x)².","9x²","3x²","6x²","9x","Both 3 and x are squared: 3²x² = 9x²."),
 m("Simplify (−2y)³.","−8y³","8y³","−6y³","−8y","Cube the negative coefficient and y; an odd power retains the negative sign."),
 m("Simplify 4(a²b)³.","4a⁶b³","64a⁶b³","4a⁵b³","12a⁶b³","The 4 sits outside the brackets; within them, (a²)³ = a⁶ and b³ remains."),
 m(R`Simplify $\left(\frac{x}{5}\right)^2$.`,R`$\frac{x^2}{25}$`,R`$\frac{x^2}{5}$`,R`$\frac{2x}{10}$`,R`$\frac{x}{25}$`,"Square numerator and denominator separately."),
 m(R`Simplify $\left(\frac{2m}{3n}\right)^3$.`,R`$\frac{8m^3}{27n^3}$`,R`$\frac{6m^3}{9n^3}$`,R`$\frac{8m}{27n}$`,R`$\frac{8m^3}{3n^3}$`,"Raise 2m and 3n to the third power, including their coefficients."),
 m("Simplify (−3p²q)².","9p⁴q²","−9p⁴q²","9p²q","6p⁴q²","The negative squared becomes positive, (p²)² = p⁴, and q² remains."),
 m(R`Simplify $\left(\frac{a^2b}{c}\right)^3\left(\frac{c}{a}\right)^2$.`,R`$\frac{a^4b^3}{c}$`,R`$\frac{a^8b^3}{c^5}$`,R`$\frac{a^4b^3}{c^5}$`,R`$\frac{a^6b^3}{c^3}$`,"First obtain a⁶b³/c³ and c²/a²; cancel to a⁴b³/c."),
 m("Does (u + v)² = u² + v² hold for all u and v?","No; the middle term 2uv is missing","Yes; every bracketed term is squared separately","Yes, but only when u = v","No; the result is u² − v²","Squaring a sum means multiplying (u + v)(u + v), which includes 2uv."),
 m("Simplify −(4h)².","−16h²","16h²","−8h²","−4h²","The leading minus is outside the squared bracket: −(16h²)."),
 m("Which equals (−5z)⁴?","625z⁴","−625z⁴","20z⁴","625z","The even power makes the negative factor positive; 5⁴ = 625."),
 m(R`Evaluate $\left(\frac{3}{4}\right)^2$.`,"9/16","6/8","3/16","9/4","Square 3 and 4 separately."),
 m("A learner writes 6(r³)² = 36r⁶. What is the error?","The 6 is outside the brackets and should remain 6","The r exponents should add to 5","The whole expression equals 6r⁹","There is no error","Only r³ is squared; 6(r³)² = 6r⁶."),
 m(R`Simplify $\left(\frac{-3x^2}{2y}\right)^2$.`,R`$\frac{9x^4}{4y^2}$`,R`$-\frac{9x^4}{4y^2}$`,R`$\frac{6x^4}{4y^2}$`,R`$\frac{9x^2}{4y}$`,"Square both the numerator and denominator; the negative sign disappears."),
 m("Simplify (2a²b³)³ × a.","8a⁷b⁹","8a⁶b⁹","6a⁷b⁹","8a⁹b⁷","Cubing produces 8a⁶b⁹, then multiplying by a adds one to its index."),
 m(R`Simplify $\frac{(6x)^2}{(3x)^2}$, x ≠ 0.`,"4","2","9","4x²","The x² factors cancel and 36/9 = 4; equivalently square 6/3."),
 s("For a > 0, solve (2a)³ = 216. Enter a.",["3"],"2a = ∛216 = 6, so a = 3."),
 m("A sensor rule is N = (t/3)². Which expression removes the brackets correctly?","N = t²/9","N = t²/3","N = 2t/6","N = t/9","Square both numerator t and denominator 3."),
 m("Which statement about (−ab)² and −(ab)² is correct?","They are generally opposites: a²b² and −a²b²","They are always equal","Both equal −a²b²","The first equals −a²b², the second a²b²","The negative is squared only when it is inside the brackets."),
 m(R`Simplify $\left(\frac{4p^2}{q^3}\right)^2\div\left(\frac{2p}{q}\right)^2$.`,R`$\frac{4p^2}{q^4}$`,R`$\frac{8p^2}{q^4}$`,R`$\frac{4p^4}{q^2}$`,R`$\frac{2p^2}{q^4}$`,"First fraction is 16p⁴/q⁶, second is 4p²/q²; their quotient is 4p²/q⁴."),
 m("Evaluate 8³/4³ by grouping before cubing.","8","2","64","512","(8/4)³ = 2³ = 8."),
 m("Which is a counterexample to (a − b)² = a² − b²?","a = 4, b = 1 gives 9 on the left and 15 on the right","a = 4, b = 0 gives 16 on both sides","a = 0, b = 0 gives 0 on both sides","a = 1, b = 0 gives 1 on both sides","One unequal example disproves the claimed identity for all values."),
];

// 6E: reciprocals, moving factors across the fraction bar, signed bases and exponent reasoning.
export const practice6E:QuestionValues[]=[
 m("Write 7⁻² using a positive index.","1/49","−49","−1/49","49","A negative power takes the reciprocal: 7⁻² = 1/7²."),
 m("Express x⁻⁴ with positive indices, x ≠ 0.","1/x⁴","−x⁴","x⁴","−1/x⁴","The minus in an index means reciprocal, not a negative value."),
 m("Express 5a⁻³b² with positive indices.",R`$\frac{5b^2}{a^3}$`,R`$-\frac{5b^2}{a^3}$`,"5a³b²",R`$\frac{b^2}{5a^3}$`,"Move only the a⁻³ factor to the denominator; 5 and b² remain above."),
 m(R`Express $\frac{1}{t^{-5}}$ with positive indices, t ≠ 0.`,"t⁵","1/t⁵","−t⁵","5t","The reciprocal of t⁻⁵ is t⁵."),
 m(R`Express $\frac{m^{-2}}{n^{-3}}$ with positive indices.`,R`$\frac{n^3}{m^2}$`,R`$\frac{m^2}{n^3}$`,R`$-\frac{n^3}{m^2}$`,R`$\frac{1}{m^2n^3}$`,"m⁻² belongs below, while dividing by n⁻³ brings n³ above."),
 m("Evaluate (−4)⁻².","1/16","−1/16","16","−16","Take the reciprocal of (−4)² = 16."),
 m("Evaluate (2/5)⁻².","25/4","4/25","−25/4","10/4","Invert the fraction to 5/2 and square it."),
 s("Find x if 3ˣ = 1/81. Enter x.",["-4","−4"],"81 = 3⁴, so its reciprocal is 3⁻⁴."),
 m("Which distinction is correct?","−3⁻² = −1/9, but (−3)⁻² = 1/9","Both equal −1/9","Both equal 1/9","−3⁻² = −9, but (−3)⁻² = 9","Brackets decide whether the negative sign is part of the squared base."),
 m("Express 12p²q⁻³/r⁻² with positive indices.",R`$\frac{12p^2r^2}{q^3}$`,R`$\frac{12p^2}{q^3r^2}$`,"12p²q³r²",R`$\frac{r^2}{12p^2q^3}$`,"Move q⁻³ down and r⁻² from the denominator up."),
 m("Evaluate 2⁻³ + 2⁻².","3/8","1/5","2/5","1/8","The fractions are 1/8 and 1/4; their sum is 3/8."),
 m("What is the reciprocal of (3/7)⁻¹?","3/7","7/3","−7/3","−3/7","(3/7)⁻¹ = 7/3, whose reciprocal is 3/7."),
 m(R`A student writes $4y^{-2}=\frac{1}{4y^2}$. What is the correction?`,R`$\frac{4}{y^2}$`,R`$-\frac{4}{y^2}$`,R`$\frac{1}{16y^2}$`,"4y²","Only y has the negative index. The coefficient 4 remains in the numerator."),
 m(R`Express $\frac{9}{2x^{-2}}$ with positive indices.`,R`$\frac{9x^2}{2}$`,R`$\frac{9}{2x^2}$`,R`$\frac{18}{x^2}$`,R`$\frac{9x}{2}$`,"The reciprocal factor 1/x⁻² is x², while 9/2 stays."),
 m("Evaluate (−2/3)⁻³.","−27/8","27/8","−8/27","8/27","Invert to −3/2, then cube numerator and denominator."),
 m("If (1/4)ˣ = 64, find x.","−3","3","−4","4","1/4 = 4⁻¹ and 64 = 4³, so −x = 3."),
 m("Which equation expresses 1/25 using a negative index?","5⁻²","25²","(−5)²","−5⁻²","5² = 25, and a negative second power takes its reciprocal."),
 m("A quantity is proportional to d⁻². If d triples, what happens to that quantity?","It becomes one ninth","It becomes three times as large","It becomes one third","It becomes nine times as large","(3d)⁻²/d⁻² = 3⁻² = 1/9."),
 m("Simplify (5⁻²)⁻¹.","25","1/25","−25","5⁻³","Multiply the powers −2 × −1 = 2, giving 5²."),
 m(R`Simplify $\frac{a^{-2}b^3}{a^{-5}b^{-1}}$ using positive indices.`,"a³b⁴",R`$\frac{b^2}{a^7}$`,"a⁻⁷b²","a⁷b⁴","Subtract indices: a^(−2 − (−5)) = a³ and b^(3 − (−1)) = b⁴."),
 m("Solve 2ˣ⁺¹ = 1/8 for x.","−4","−3","2","4","1/8 = 2⁻³, so x + 1 = −3 and x = −4."),
];

// 6F: standard form, decimal conversion, units, arithmetic and normalization.
export const practice6F:QuestionValues[]=[
 // The first two prompts match existing 6F rows exactly. Their IDs, options and edits are retained.
 m("Write 42,000,000 in scientific notation.","4.2 × 10⁷","4.2 × 10⁶","42 × 10⁷","0.42 × 10⁷","Move the decimal seven places left: 4.2 × 10⁷."),
 m("Write 0.00036 in scientific notation.","3.6 × 10⁻⁴","3.6 × 10⁻³","36 × 10⁻⁴","3.6 × 10⁴","Move the decimal four places right to reach 3.6, so use 10⁻⁴."),
 m("Which expression is in scientific notation?","7.04 × 10⁻³","70.4 × 10⁻⁴","0.704 × 10⁻²","12 × 10⁻³","The coefficient must be at least 1 and less than 10 in magnitude."),
 s("Write 9.15 × 10⁵ in ordinary decimal form. Enter the number without spaces.",["915000","915,000"],"A positive fifth power moves the decimal five places right."),
 m("Write 6.2 × 10⁻⁵ in decimal form.","0.000062","0.00062","0.0000062","620000","Move the decimal five places left and supply leading zeros."),
 m("Write −0.0000874 in scientific notation.","−8.74 × 10⁻⁵","−8.74 × 10⁵","−0.874 × 10⁻⁴","−8.74 × 10⁻⁴","The coefficient is −8.74 and the original magnitude is less than 1."),
 m("A stopwatch reads 380 microseconds. Write the time in seconds in scientific notation.","3.8 × 10⁻⁴ s","3.8 × 10⁻⁶ s","3.8 × 10⁻³ s","3.8 × 10⁴ s","One microsecond is 10⁻⁶ s, so 380 × 10⁻⁶ = 3.8 × 10⁻⁴ s."),
 m("Normalize 56 × 10⁴ into scientific notation.","5.6 × 10⁵","5.6 × 10⁴","56 × 10⁵","0.56 × 10⁶","Dividing the coefficient by 10 requires raising the power of 10 by one."),
 m("Write 3.07 × 10² in ordinary decimal form.","307","30.7","3070","0.0307","Move two places right; the zero in 3.07 is significant."),
 m("Write 0.000000091 in scientific notation.","9.1 × 10⁻⁸","9.1 × 10⁻⁷","0.91 × 10⁻⁷","9.1 × 10⁸","The first non-zero digit is at the eighth decimal place."),
 m("Which is greatest?","2.3 × 10⁶","9.1 × 10⁵","1.8 × 10⁶","2.05 × 10⁶","Compare after matching powers of ten: 2.3 million is largest."),
 m("A length is 0.0048 m. Express it in millimetres.","4.8 mm","0.48 mm","48 mm","4800 mm","Multiply metres by 1000: 0.0048 × 1000 = 4.8."),
 m("A trip is 2.6 × 10⁴ seconds. What is the same time in milliseconds, in scientific notation?","2.6 × 10⁷ ms","2.6 × 10¹ ms","2.6 × 10⁻¹ ms","2.6 × 10⁶ ms","Each second is 10³ ms, so add 3 to the exponent."),
 m("Compute (4 × 10³)(2 × 10⁻⁵), in scientific notation.","8 × 10⁻²","8 × 10⁻¹⁵","6 × 10⁻²","8 × 10²","Multiply coefficients 4 × 2 and add indices 3 + (−5) = −2."),
 m("Compute (9 × 10⁸) ÷ (3 × 10²), in scientific notation.","3 × 10⁶","3 × 10⁴","6 × 10⁶","3 × 10¹⁰","Divide coefficients and subtract exponents: 8 − 2 = 6."),
 m("Two measurements are 4.2 × 10⁵ m and 7 × 10⁴ m. What is their sum in scientific notation?","4.9 × 10⁵ m","11.2 × 10⁹ m","4.9 × 10⁹ m","1.12 × 10⁵ m","Rewrite 7 × 10⁴ as 0.7 × 10⁵, then add 4.2 + 0.7."),
 m("Normalize 0.048 × 10⁹.","4.8 × 10⁷","4.8 × 10⁹","4.8 × 10¹¹","0.48 × 10⁸","The coefficient grows by 100 to 4.8, so the exponent decreases by 2."),
 m("A sample has mass 4.5 × 10⁻³ g. Give its mass in milligrams.","4.5 mg","0.0045 mg","4500 mg","45 mg","One gram is 1000 mg; adding 3 to the exponent gives 4.5 × 10⁰ mg."),
 m("A student reads 5.2E−4 on a calculator. What does it mean?","5.2 × 10⁻⁴","5.2 × 10⁴","5.2 − 4","(5.2)⁻⁴","E−4 is calculator notation for multiplying by 10⁻⁴."),
 m("A device receives 6 × 10⁸ bytes and sends 2.5 × 10⁸ bytes. What is the difference?","3.5 × 10⁸ bytes","3.5 × 10⁰ bytes","8.5 × 10⁸ bytes","3.5 × 10¹⁶ bytes","The powers of ten already match; subtract 2.5 from 6."),
 m("What is wrong with 34 × 10⁻² as a final scientific-notation answer?","Its coefficient 34 is outside the interval from 1 to less than 10","A negative exponent is forbidden","The value is negative","It cannot be converted to decimal form","The equivalent normalized expression is 3.4 × 10⁻¹."),
];

// 6G: significant zeros, precision, rounding carry, calculator notation and multi-step estimates.
export const practice6G:QuestionValues[]=[
 m("How many significant figures are in 0.004072?","4","3","5","7","Ignore leading zeros; count 4, 0, 7 and 2."),
 m("How many significant figures are in 5.030 × 10⁴?","4","3","5","6","The coefficient 5.030 shows four significant figures; its internal and final decimal zeros count."),
 m("Which has exactly three significant figures?","0.0705","0.007050","7.050","7050.0","In 0.0705, the digits 7, 0 and 5 count; leading zeros do not."),
 m("Write 76342 in scientific notation to three significant figures.","7.63 × 10⁴","7.64 × 10⁴","76.3 × 10³","7.63 × 10⁵","The first three digits are 7,6,3 and the next digit 4 does not round them up."),
 m("Write 0.0004986 in scientific notation to two significant figures.","5.0 × 10⁻⁴","4.9 × 10⁻⁴","5 × 10⁻⁴","5.0 × 10⁻⁵","4.986 × 10⁻⁴ rounds to 5.0 × 10⁻⁴; the zero shows two significant figures."),
 m("Round 3.996 × 10⁶ to three significant figures.","4.00 × 10⁶","4 × 10⁶","3.99 × 10⁶","4.00 × 10⁷","Rounding 3.996 carries through to 4.00; both zeros preserve three significant figures."),
 m("A calculator displays 2.47E−5. Which number does this represent?","2.47 × 10⁻⁵","2.47 × 10⁵","2.47 − 5","(2.47)⁻⁵","E−5 means multiply by ten to the power −5."),
 m("Compute (3.2 × 10⁴)(2.5 × 10³). Give the result to two significant figures.","8.0 × 10⁷","8 × 10⁷","8.0 × 10¹²","5.7 × 10⁷","The exact product is 8 × 10⁷; write 8.0 to show two significant figures."),
 m("How many significant figures does 0.02060 contain?","4","3","5","2","Start at 2 and count 2,0,6,0. The final decimal zero counts."),
 s("Round 6.784 to two decimal places. Enter the decimal with both required places.",["6.78"],"The third decimal is 4, so the hundredths stay at 8: 6.78."),
 s("Round 4.999 to two decimal places. Include both decimal places.",["5.00"],"The thousandths force a carry through the decimal digits; 5.00 shows two decimal places."),
 m("Round 0.0009475 to three significant figures in scientific notation.","9.48 × 10⁻⁴","9.47 × 10⁻⁴","0.948 × 10⁻³","9.48 × 10⁻³","0.0009475 = 9.475 × 10⁻⁴; the next digit 5 rounds 7 up to 8."),
 m("Which notation clearly records three significant figures for exactly 5000?","5.00 × 10³","5 × 10³","5.0 × 10³","5000 with no qualification","The coefficient 5.00 explicitly shows three significant digits."),
 m("A measured length is 0.03040 m. Which digits are significant?","3, 0, 4, 0","0, 0, 3, 0","3 and 4 only","Every digit including the first zero","Leading zeros set the decimal place; the zeros after 3 count."),
 m("Find (6.4 × 10⁶) ÷ (8 × 10²) in scientific notation to two significant figures.","8.0 × 10³","8 × 10³","8.0 × 10⁴","0.80 × 10⁴","6.4/8 × 10⁴ = 0.8 × 10⁴ = 8.0 × 10³ to two significant figures."),
 m("A wire has mass 0.00067894 kg. Express it in scientific notation to four significant figures.","6.789 × 10⁻⁴ kg","6.790 × 10⁻⁴ kg","6.7894 × 10⁻⁴ kg","6.789 × 10⁴ kg","The first four digits 6,7,8,9 remain; the next digit 4 does not increase them."),
 m("A number is written as 9.995 × 10³. Round it to three significant figures.","1.00 × 10⁴","9.99 × 10³","10 × 10³","1 × 10⁴","The rounding carry changes the exponent; 1.00 preserves three significant figures."),
 m("A learner enters 1.83E6 and reads it as 1.83⁶. What is the correct interpretation?","1.83 × 10⁶","(1.83)⁶","1.83 × 6","1.83 + 10⁶","Calculator E notation marks a power of ten, not a power of the coefficient."),
 m("An estimate of 2.46 × 10⁵ is multiplied by 12. What is the product to three significant figures?","2.95 × 10⁶","2.952 × 10⁶","2.95 × 10⁵","2.94 × 10⁶","The product is 2,952,000 = 2.952 × 10⁶, rounded to three significant figures."),
 m("Arrange from largest to smallest: A = 2.41 × 10⁶, B = 24.2 × 10⁵, C = 0.239 × 10⁷.","B, A, C","A, B, C","C, A, B","B, C, A","Normalize: A = 2.41, B = 2.42, C = 2.39, all multiplied by 10⁶."),
 m("Why can 4.00 × 10⁶ convey different precision from 4 × 10⁶?","It displays three significant figures instead of one","The two numbers have different numerical values","It has three decimal places in the full number","Its exponent is larger","The trailing zeros in 4.00 record measurement precision, even though the numerical value matches."),
];

// 6H: roots, rational versus irrational values, fractional-power laws and exact lengths.
export const practice6H:QuestionValues[]=[
 m("Which root is represented by 11¹ᐟ²?","√11","∛11","11²","1/√11","An index of 1/2 means square root."),
 m("Which root is represented by 7¹ᐟ³?","∛7","√7","7³","1/7³","An index of 1/3 means cube root."),
 m("Evaluate 121¹ᐟ².","11","60.5","±11","14,641","The principal square root of 121 is 11."),
 s("Evaluate 343¹ᐟ³. Enter the exact value.",["7"],"7³ = 343, so its cube root is 7."),
 m("Which of these is a surd?","√13","√49","∛125","√(1/16)","√13 is irrational; the other three evaluate to rational numbers."),
 m("Write √19 using a fractional index.","19¹ᐟ²","19²","19¹ᐟ³","1/19²","A square root is power 1/2."),
 m("Simplify a¹ᐟ² × a³ᐟ² for a > 0.","a²","a³ᐟ⁴","a³ᐟ²","a¹ᐟ⁴","Add the exponents of matching bases: 1/2 + 3/2 = 2."),
 m("Evaluate 27²ᐟ³.","9","3","18","729","Take the cube root of 27 (3), then square it to get 9."),
 m("Evaluate 16³ᐟ⁴.","8","4","12","64","The fourth root of 16 is 2; cube it to get 8."),
 m("Evaluate 64⁻¹ᐟ³.","1/4","4","−4","−1/4","The cube root of 64 is 4; the negative exponent takes its reciprocal."),
 m("For x > 0, simplify x⁵ᐟ⁶ ÷ x¹ᐟ³.","x¹ᐟ²","x⁴ᐟ³","x⁵ᐟ¹⁸","x¹ᐟ³","Subtract exponents: 5/6 − 1/3 = 3/6 = 1/2."),
 m("Simplify (y²)¹ᐟ⁴ for y > 0.","y¹ᐟ²","y¹ᐟ⁴","y⁸","y³ᐟ⁴","Multiply exponents 2 × 1/4 = 1/2."),
 m("Which statement about √36 and √37 is correct?","√36 is rational; √37 is a surd","Both are surds","Both are rational","√36 is a surd; √37 is rational","√36 = 6, while 37 is not a perfect square."),
 m("A right triangle has perpendicular sides 3 cm and 8 cm. What is its exact hypotenuse?","√73 cm","11 cm","√11 cm","73 cm","Pythagoras gives c² = 3² + 8² = 73, so c = √73 cm."),
 m("Evaluate (25/64)¹ᐟ².","5/8","25/8","5/64","±5/8","The principal square root of numerator 25 is 5 and of denominator 64 is 8."),
 m("A student types 16^1/2 without grouping and gets 8. Which result did the calculator take?","(16¹)/2","16¹ᐟ²","(16/2)¹","2¹⁶","The calculator treated the exponent as 1 and then divided by 2; enter 16^(1/2)."),
 m("For a ≥ 0, simplify √(a²).","a","−a","a²","2a","The principal square root is non-negative; with a ≥ 0, √(a²) = a."),
 m("Which equality explains why 5¹ᐟ³ is the cube root of 5?","(5¹ᐟ³)³ = 5","(5¹ᐟ³)² = 5","5¹ᐟ³ = 5/3","5¹ᐟ³ × 5¹ᐟ³ = 5","Multiplying exponents 1/3 × 3 gives 1."),
 m("Evaluate 32²ᐟ⁵ without a calculator.","4","8","16","64","The fifth root of 32 is 2; square it to get 4."),
 m("Why is √(4/9) rational, even though it has a root sign?","It equals 2/3, a fraction of integers","Every square root is rational","It is a non-repeating decimal","It equals 4/3","Both 4 and 9 are perfect squares; the principal root is 2/3."),
 m("Simplify a²ᐟ³ × a⁻²ᐟ³ for a > 0.","1","a⁴ᐟ³","a⁰ᐟ³ = 0","a⁻⁴ᐟ⁹","The exponents add to zero; any non-zero a raised to zero is 1."),
];

// 6I: like surds, products/quotients, simplest radical form, distribution and error reasoning.
export const practice6I:QuestionValues[]=[
 m("Simplify 4√7 + 3√7.","7√7","7√14","12√7","√49","These are like surds, so add coefficients and keep √7."),
 m("Simplify 2√11 − 6√11.","−4√11","4√11","−4√22","−8√11","Subtract coefficients 2 − 6 while retaining the same surd."),
 m("Which pair are like surds before further simplification?","3√5 and −√5","√5 and √7","√8 and √2","√3 and ∛3","Like surds have exactly the same root expression; √8 can first be simplified."),
 m("Simplify 5√2 + 3√3 + √2.","6√2 + 3√3","6√5","9√2 + 3√3","5√2 + 4√3","Only the √2 terms combine, giving (5 + 1)√2."),
 m("Simplify √5 × √6.","√30","√11","30","6√5","Multiply radicands under one square root: √(5 × 6)."),
 m("Simplify √42 ÷ √7.","√6","√35","6","√49","For positive radicands, divide inside one root: √(42/7) = √6."),
 m("Simplify √45 to simplest surd form.","3√5","9√5","5√3","√40","45 = 9 × 5, so √45 = 3√5."),
 m("Simplify √20 + 2√5.","4√5","3√5","√25","2√25","√20 = 2√5, giving 2√5 + 2√5 = 4√5."),
 m("Simplify √2 + √3.","It stays √2 + √3","√5","2√5","√6","Unlike surds cannot be combined by addition."),
 m("Simplify 8√6 − 3√6 + √6.","6√6","4√6","6√18","12√6","Combine coefficients 8 − 3 + 1 = 6."),
 m("Simplify 3√2 × 4√7.","12√14","7√9","12√9","24√7","Multiply coefficients 3 × 4 and radicands 2 × 7."),
 m("Simplify 18√15 ÷ 6√3.","3√5","3√12","12√5","3√45","Divide coefficients 18/6 = 3 and radicands 15/3 = 5."),
 m("Simplify √12 − √3.","√3","√9","3","2√3","√12 = 2√3, then subtract √3 to leave √3."),
 m("Simplify 2√5(√3 + 4).","2√15 + 8√5","2√15 + 8","2√8 + 8√5","10√3 + 8√5","Distribute 2√5 to both terms: √5√3 = √15."),
 m("Simplify √10(√10 − √2).","10 − 2√5","10 − √8","10 − √12","10 − 2√10","The product √10√10 = 10 and √20 = 2√5."),
 m("A student writes √8 + √18 = √26. What is the correct simplified sum?","5√2","√26","2√26","6√2","√8 = 2√2 and √18 = 3√2; addition does not combine radicands."),
 m("Which is the exact perimeter of an equilateral triangle with side √11 cm?","3√11 cm","√33 cm","11 cm","33 cm","Add three equal side lengths: √11 + √11 + √11 = 3√11."),
 m("Simplify (√13)².","13","√26","169","2√13","A square root multiplied by itself returns its radicand."),
 m("Simplify √75 − 2√3.","3√3","5√3","√73","13√3","√75 = 5√3 because 75 = 25 × 3; subtract 2√3."),
 s("Simplify (3√2 − 1)(3√2 + 1). Enter the exact number.",["17"],"Use difference of squares: (3√2)² − 1² = 18 − 1."),
 m("A student claims √a × √b = √(a + b). What is the mistake?","Multiplication puts ab, not a + b, under one root","Only subtraction can combine square roots","The correct result is always a + b","Roots cannot be multiplied","For example, √4 × √9 = 6, while √(4 + 9) = √13."),
];

export const chapter6Practice={"6A":practice6A,"6B":practice6B,"6C":practice6C,"6D":practice6D,"6E":practice6E,"6F":practice6F,"6G":practice6G,"6H":practice6H,"6I":practice6I};

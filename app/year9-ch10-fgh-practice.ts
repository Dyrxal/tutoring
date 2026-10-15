import type {QuestionValues} from "./QuestionEditor";

// Each section has eight core questions followed by thirteen optional questions.
let choice=0;
const m=(prompt:string,key:string,a:string,b:string,c:string,explanation:string):QuestionValues=>{
 const correct_index=choice++%4,options=[a,b,c];options.splice(correct_index,0,key);
 return {prompt,options,correct_index,explanation};
};
const s=(prompt:string,accepted:string[],explanation:string):QuestionValues=>({prompt,options:{kind:"short_answer",accepted,exact:true},correct_index:0,explanation});
const R=String.raw;

// 10F: coefficients, tables, vertex/axis/intercepts, dilation, reflection and inverse reasoning.
export const practice10F:QuestionValues[]=[
 m("For y = 3x², find y when x = −2.","12","−12","6","36","Square −2 first to get 4, then multiply by 3."),
 m("The graph of y = −4x² opens in which direction?","Downward, with a maximum","Upward, with a minimum","Downward, with a minimum","Upward, with a maximum","A negative coefficient reflects the parabola in the x-axis, so its vertex is a maximum."),
 m("What is the turning point of y = 0.7x²?","(0, 0)","(0, 0.7)","(0.7, 0)","(−0.7, 0)","Every graph y = ax² with a ≠ 0 has its vertex at the origin."),
 m("Give the axis of symmetry of y = −2x².","x = 0","y = 0","x = −2","y = −2","The graph is mirrored across the y-axis, whose equation is x = 0."),
 m("Compared with y = x², how does y = 0.4x² appear?","Wider and upright","Narrower and upright","Wider and inverted","The same width and upright","Since 0 < 0.4 < 1, each y-value is scaled down and the graph appears wider."),
 m("Which rule is the reflection of y = 5x² in the x-axis?","y = −5x²","y = 5(−x)²","y = x² − 5","y = −x² + 5","An x-axis reflection changes every y-value's sign, replacing 5 by −5."),
 m("For y = −2x², which y-values correspond to x = −1, 0, 1 in that order?","−2, 0, −2","2, 0, 2","−2, −2, 0","2, 0, −2","Opposite x-values have the same square, so both ends give −2 and the centre gives 0."),
 s("A parabola y = ax² passes through (2, 12). Find a.",["3"],"Substitute the point: 12 = a(2)² = 4a, so a = 3."),
 m("Which is narrower than y = −x² and still opens down?","y = −2.5x²","y = −0.25x²","y = 2.5x²","y = 0.25x²","A negative coefficient keeps it inverted; magnitude greater than 1 makes it narrower."),
 m("Which of these graphs is widest?","y = 0.2x²","y = −0.6x²","y = 1.5x²","y = −3x²","The smallest nonzero magnitude of a makes the widest parabola: 0.2."),
 m("For y = −0.5x², what are its x- and y-intercepts?","Both are (0, 0)","x-intercepts are (−0.5, 0) and (0.5, 0)","There is no y-intercept","The y-intercept is (0, −0.5)","At x = 0 the output is 0; −0.5x² = 0 only when x = 0."),
 s("The point (−3, −18) lies on y = ax². Find a.",["-2","−2"],"−18 = 9a, so a = −2. The sign tells us the graph opens down."),
 m("Reflect y = −3x² in the x-axis, then scale all y-values by one third. What is the final rule?","y = x²","y = −x²","y = 3x²","y = −9x²","Reflection gives 3x²; multiplying its y-values by one third gives x²."),
 m("A student says y = −0.3x² is narrower than y = −x² because −0.3 is smaller than −1. What did they overlook?","Width depends on |a|, and 0.3 < 1 makes it wider","A negative a makes the graph upright","The vertex moves to (0, −0.3)","The graphs are the same width","The sign controls orientation; the magnitude controls width."),
 m("Reflect y = 2x² in the y-axis. Which rule results?","y = 2x²","y = −2x²","y = 2x² + 2","y = 2(x − 2)²","Replacing x by −x leaves x² unchanged, so the graph maps onto itself."),
 s("For y = 0.75x², find the y-value when x = 4. Enter a number.",["12"],"0.75 × 4² = 0.75 × 16 = 12."),
 m("A table for y = ax² has y = −6 at x = 1. What is y at x = −2?","−24","24","−12","−6","At x = 1, a = −6; at x = −2, y = −6 × 4 = −24."),
 m("A parabola y = ax² passes through (−2, 3). Which rule fits?",R`$y=\frac{3}{4}x^2$`,R`$y=\frac{3}{2}x^2$`,R`$y=-\frac{3}{4}x^2$`,"y = 3x²","Substitute the point: 3 = a(−2)² = 4a, so a = 3/4."),
 m("Does reflecting y = ax² in the x-axis before scaling its y-values by a positive factor b change the final rule?","No; both orders give y = −abx²","Yes; only reflection first gives y = −abx²","Yes; the vertex shifts by b","No; both orders give y = abx²","Negating and multiplying by positive b commute: −b(ax²) = b(−ax²)."),
 m("A symmetric cable is modelled by y = 0.08x², where its lowest point is at the origin. How high is it at x = 5 m?","2 m","0.4 m","5.08 m","20 m","Substitute x = 5: y = 0.08 × 25 = 2 m."),
 m("Why is y = 0 not a wider parabola than y = 0.2x²?","y = 0 is a straight line, because its x² coefficient is zero","Its width is infinite but it still has a vertex","It opens downward","Its turning point is (0, 0.2)","For a = 0 the quadratic term disappears, so the graph is the horizontal x-axis."),
];

// 10G: signed horizontal/vertical shifts, turning-point form, intercepts, orientation and reversals.
export const practice10G:QuestionValues[]=[
 m("How does y = x² − 5 move y = x²?","5 units down","5 units right","5 units left","5 units up","Subtracting 5 changes every y-value by −5, a vertical shift."),
 m("How does y = (x + 4)² move y = x²?","4 units left","4 units right","4 units up","4 units down","The bracket is x − (−4), so the vertex moves to x = −4."),
 m("What is the turning point of y = (x − 3)² + 2?","(3, 2)","(−3, 2)","(3, −2)","(0, 2)","In y = (x − h)² + k, the vertex is (h, k)."),
 m("Give the axis of symmetry of y = −(x + 2)² − 1.","x = −2","x = 2","y = −1","x = 0","The squared bracket vanishes at x = −2; the vertical axis passes through that x-value."),
 m("Find the y-intercept of y = (x − 4)² − 3.","(0, 13)","(0, −3)","(4, −3)","(0, 16)","Put x = 0: (−4)² − 3 = 13."),
 m("Does y = −(x − 1)² + 6 have a maximum or minimum, and where?","Maximum at (1, 6)","Minimum at (1, 6)","Maximum at (−1, 6)","Minimum at (1, −6)","The negative coefficient opens down; its turning point is (1, 6)."),
 m("Which rule moves y = x² two units right and three units down?","y = (x − 2)² − 3","y = (x + 2)² − 3","y = (x − 2)² + 3","y = x² − 2x − 3","Right means x − 2 inside; down means subtract 3 outside."),
 s("Find y at x = 0 for y = −(x + 3)² + 4. Enter the number.",["-5","−5"],"At x = 0, y = −3² + 4 = −9 + 4 = −5."),
 m("What happens to the point (−1, 2) under a shift three right and two down?","(2, 0)","(−4, 0)","(2, 4)","(−3, −1)","Add 3 to x and subtract 2 from y: (−1 + 3, 2 − 2)."),
 m("Which rule has turning point (−2, 5) and opens upward without changing width?","y = (x + 2)² + 5","y = (x − 2)² + 5","y = −(x + 2)² + 5","y = (x + 5)² − 2","For (h, k) = (−2, 5), write (x + 2)² + 5 with positive unit coefficient."),
 m("How many x-intercepts does y = (x − 2)² + 1 have?","None","One at x = 2","Two at x = 1 and 3","One at x = 0","Its minimum value is 1, so the curve stays above the x-axis."),
 s("For y = −(x − 5)² + 2, find the y-coordinate of the turning point.",["2"],"The square is zero at x = 5, giving vertex (5, 2)."),
 m("Which form shows a graph shifted one left, two up, and reflected in the x-axis before those shifts?","y = −(x + 1)² + 2","y = −(x − 1)² + 2","y = (x + 1)² + 2","y = −(x + 1)² − 2","The minus in front reflects the base graph; x + 1 shifts left, and +2 shifts up."),
 m("A student reads (x + 6)² as a shift six right. What correction is needed?","It shifts six left because the square is zero at x = −6","It shifts six up","It shifts six down","There is no shift","Set the bracket to zero to locate the new vertex: x = −6."),
 m("Rewrite y = 7 − (x − 2)² in turning point form and identify its vertex.","y = −(x − 2)² + 7; vertex (2, 7)","y = (x − 2)² + 7; vertex (2, 7)","y = −(x + 2)² + 7; vertex (−2, 7)","y = −(x − 2)² − 7; vertex (2, −7)","Move the terms into the usual order; the negative remains on the squared bracket."),
 m("What is the y-intercept of y = a(x − h)² + k?","(0, ah² + k)","(h, k)","(0, a + h + k)","(0, k)","Substitute x = 0: a(−h)² + k = ah² + k."),
 s("For y = (x − 4)² − 7, what is y when x = 6? Enter a number.",["-3","−3"],"(6 − 4)² − 7 = 4 − 7 = −3."),
 m("Which transformation changes the position of the vertex but keeps the graph's shape?","A translation","A vertical dilation by factor 3","Reflection in the x-axis","Replacing x² by x³","A translation shifts each point equally, preserving shape and width."),
 m("Why do y = (3 − x)² and y = (x − 3)² have the same graph?","Their bracketed expressions differ only by a sign, which squaring removes","One is reflected in the x-axis","Their vertices are (−3, 0) and (3, 0)","One is a line","3 − x = −(x − 3), and (−u)² = u²."),
 m("A parabola has form y = (x − h)² + k, vertex (−3, −2), and passes through (0, 7). Which rule fits?","y = (x + 3)² − 2","y = (x − 3)² − 2","y = (x + 3)² + 2","y = −(x + 3)² − 2","The vertex gives h = −3, k = −2; at x = 0 the rule gives 9 − 2 = 7."),
 m("A drone's height relative to a reference line follows y = −(x − 4)² + 9. What is its greatest height, and when?","9 at x = 4","9 at x = 0","4 at x = 9","It has no maximum","The inverted parabola peaks at its vertex (4, 9)."),
];

// 10H: factors and null-factor law, intercepts, midpoint/vertex, sketch features and models.
export const practice10H:QuestionValues[]=[
 m("For y = (x − 3)(x + 2), what are the x-intercepts?","(3, 0) and (−2, 0)","(−3, 0) and (2, 0)","(3, −2)","(0, −6)","At an x-intercept y = 0; either factor can be zero, giving x = 3 or −2."),
 m("Find the y-intercept of y = 2(x − 1)(x + 3).","(0, −6)","(0, 6)","(−1, 0)","(0, −3)","Set x = 0: 2(−1)(3) = −6."),
 m("A parabola has x-intercepts −4 and 2. What is its axis of symmetry?","x = −1","x = 1","x = −2","y = −1","The axis lies midway between the roots: (−4 + 2)/2 = −1."),
 s("For y = (x − 1)(x − 5), find the y-value at its turning point.",["-4","−4"],"The midpoint of roots 1 and 5 is x = 3; y(3) = 2(−2) = −4."),
 m("Factorise y = x² − 7x.","y = x(x − 7)","y = (x − 7)²","y = x(x + 7)","y = x²(1 − 7)","Both terms contain x. Taking it out leaves x − 7."),
 m("How many distinct x-intercepts does y = (x + 3)² have?","One, at (−3, 0)","None","Two, at (−3, 0) and (3, 0)","One, at (3, 0)","The repeated factor is zero only at x = −3, where the graph touches the x-axis."),
 m("Where is the y-intercept of y = x² − 2x − 15?","(0, −15)","(−15, 0)","(0, 15)","(2, −15)","Set x = 0; all x terms vanish and y = −15."),
 m("For y = −(x + 1)(x − 5), which sketch features are correct?","Roots −1 and 5; axis x = 2; opens down","Roots 1 and −5; axis x = −2; opens down","Roots −1 and 5; axis x = 2; opens up","Roots −1 and 5; axis x = 0; opens down","The factors give roots −1 and 5; midpoint 2, and the negative leading coefficient opens down."),
 m("Why may a parabola y = (x − 2)² + 4 have no x-intercepts?","Its minimum y-value is 4, above the x-axis","Every parabola has exactly two x-intercepts","It is a straight line","It has no y-intercept","The square is nonnegative; adding 4 keeps y positive."),
 s("Find the axis x-value for a parabola with roots x = −5 and x = 3. Enter a number.",["-1","−1"],"Average the intercepts: (−5 + 3)/2 = −1."),
 m("What factorisation helps sketch y = x² + x − 20?","y = (x + 5)(x − 4)","y = (x − 5)(x + 4)","y = (x + 10)(x − 2)","y = (x + 5)(x + 4)","5 and −4 multiply to −20 and add to 1."),
 m("For y = (x + 5)(x − 4), what is its turning point?","(−0.5, −20.25)","(0.5, −20.25)","(−0.5, 20.25)","(−5, 4)","The roots −5 and 4 average to −0.5; substitution gives (4.5)(−4.5) = −20.25."),
 m("If y = −2(x − 1)(x − 7), what is the maximum y-value?","18","−18","12","32","The roots 1 and 7 have midpoint x = 4. Then y = −2(3)(−3) = 18."),
 s("For y = x(x + 9), give the two x-intercepts as x-values, smaller first, separated by a comma.",["-9, 0","−9, 0","-9,0","−9,0"],"Set each factor to zero: x + 9 = 0 or x = 0, giving −9 and 0."),
 m("A learner sets x − 4 = 8 or x + 1 = 8 from (x − 4)(x + 1) = 8. What is wrong?","The Null Factor Law works only after the product equals zero","The factors must each equal 4","The equation has no squared term","The roots are always 4 and −1","A product of 8 does not force either factor to equal 8; first rearrange to zero."),
 m("A bridge arch is modelled by y = 0.2x(20 − x), with x in metres. What is its horizontal span at water level?","20 m","10 m","4 m","40 m","At water level y = 0, so x = 0 or x = 20; the span between them is 20 m."),
 s("For y = 0.2x(20 − x), what is the maximum height in metres? Enter a number.",["20"],"The midpoint of x-intercepts 0 and 20 is x = 10; y = 0.2 × 10 × 10 = 20 m."),
 m("The roots of a parabola are x = −2 and x = 6, and its y-intercept is −24. Which rule fits?","y = 2(x + 2)(x − 6)","y = (x + 2)(x − 6)","y = −2(x + 2)(x − 6)","y = 2(x − 2)(x + 6)","Write a(x + 2)(x − 6). At x = 0, −12a = −24, so a = 2."),
 m("A sketch has x-intercepts −3 and 5 and opens up. Where must the turning point lie?","On x = 1 below the x-axis","On x = 1 above the x-axis","On x = −1 below the x-axis","At (1, 0)","The midpoint is x = 1. An upward parabola crossing twice has a minimum below zero."),
 m("A graph of y = (x − 4)² touches the x-axis. Why is its intercept also the turning point?","The two roots coincide at 4, so the axis and minimum are at (4, 0)","The graph has roots −4 and 4","Its y-intercept is also 0","Every parabola's vertex is on the x-axis","A repeated root is the only place the graph reaches y = 0, its minimum."),
 m("Which information is sufficient to determine the coefficient a of y = a(x + 1)(x − 4)?","A further point on the graph with x neither −1 nor 4","Only the two x-intercepts","Only the axis x = 1.5","The fact that it is a parabola","The roots fix the factors but not the vertical scale; a non-root point supplies a value for a."),
];

export const chapter10FGHPractice={"10F":practice10F,"10G":practice10G,"10H":practice10H} as const;

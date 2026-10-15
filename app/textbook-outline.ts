// Chapter and section labels follow the supplied Essential Mathematics Year 9
// (third edition, 2020) contents. All practice and explanations below are original.
export const textbookCourseTitle = "Year 9 maths - Vic maths";
export const textbookCourseDescription = "Build your Year 9 maths skills through clear explanations, worked examples and practice. The chapters follow Essential Mathematics for the Australian Curriculum Year 9 as a learning guide.";

const outline = [
  ["Reviewing number and financial mathematics", "Integer operations|Decimals and significant figures|Rational numbers|Operations with fractions|Ratios, rates and best buys|Percentages and money|Percentage increase and decrease|Profits and discounts|Income and taxation|Simple interest|Compound interest"],
  ["Linear and simultaneous equations", "Algebraic expressions|Simplifying algebraic expressions|Expanding algebraic expressions|Solving linear equations|Equations with brackets and pronumerals on both sides|Solving word problems|Inequalities|Using formulas|Simultaneous equations using substitution|Simultaneous equations using elimination|Applications of simultaneous equations"],
  ["Pythagoras’ theorem and trigonometry", "Pythagoras’ theorem|Finding the length of the shorter sides|Applying Pythagoras’ theorem|Pythagoras in three dimensions|Trigonometric ratios|Finding side lengths|Solving for the denominator|Finding an angle|Applying trigonometry|Bearings"],
  ["Linear relations", "Introduction to linear relations|Graphing straight lines using intercepts|Lines with one intercept|Gradient|Gradient and direct proportion|Gradient–intercept form|Finding the equation of a line|Midpoint and length of a line segment|Perpendicular and parallel lines|Linear modelling|Graphical solutions to simultaneous equations"],
  ["Measurement", "Length and perimeter|Circumference and perimeter of a sector|Area|Composite shapes|Surface area of prisms and pyramids|Surface area of a cylinder|Volume of a prism|Volume of a cylinder"],
  ["Indices and surds", "Index notation|Index laws 1 and 2|Index law 3 and the zero power|Index laws 4 and 5|Negative indices|Scientific notation|Scientific notation using significant figures|Fractional indices and surds|Simple operations with surds"],
  ["Geometry", "Angles and triangles|Parallel lines|Quadrilaterals and other polygons|Congruent triangles|Using congruence in proof|Enlargement and similar figures|Similar triangles|Proving and applying similar triangles"],
  ["Algebraic techniques", "Expanding binomial products|Perfect squares and difference of perfect squares|Factorising algebraic expressions|Factorising the difference of perfect squares|Factorising by grouping|Factorising quadratic trinomials|Factorising trinomials of the form ax² + bx + c|Simplifying algebraic fractions: Multiplication and division|Simplifying algebraic fractions: Addition and subtraction|Further simplification of algebraic fractions|Equations with algebraic fractions"],
  ["Probability and statistics", "Review of probability|Venn diagrams and two-way tables|Using set notation|Using arrays for two-step experiments|Tree diagrams|Experimental probability|Summarising data: Measures of centre|Stem-and-leaf plots|Grouped data|Measures of spread|Box plots"],
  ["Introduction to quadratic equations and graphs", "Quadratic equations|Solving ax² + bx = 0 and x² = d|Solving x² + bx + c = 0|Applications of quadratic equations|The parabola|Sketching y = ax² with dilations and reflections|Sketching translations of y = x²|Sketching parabolas using intercept form"],
] as const;

export const textbookChapters = outline.map(([title, sections], index) => ({
  title: `Chapter ${index + 1}: ${title}`,
  sections: sections.split("|").map((name, section) => ({
    title: `${index + 1}${String.fromCharCode(65 + section)} ${name}`,
    name,
  })),
}));

type StarterQuestion = {prompt:string;options:[string,string,string,string];correct_index:number;explanation:string};
type Starter = {notes:string;worked_example:string;questions:StarterQuestion[]};

// A small original practice sample in one section per chapter. The remaining
// sections are intentionally empty so tutors can add their own videos and tasks.
export const starterSections:Record<string,Starter> = {
 "1A": {notes:"When adding integers with different signs, subtract their absolute values and keep the sign of the number with the larger absolute value. Multiplying two negative numbers gives a positive result.",worked_example:"−8 + 13 = 5. Since 13 has the larger absolute value, the result is positive. Also, (−4) × (−6) = 24.",questions:[
  {prompt:"Calculate −9 + 15.",options:["−24","−6","6","24"],correct_index:2,explanation:"The signs differ. Subtract 9 from 15 and keep the positive sign: 6."},
  {prompt:"Calculate (−7) × (−3).",options:["−21","21","−10","10"],correct_index:1,explanation:"Two negative factors produce a positive product: 7 × 3 = 21."}
 ]},
 "2D": {notes:"To solve a linear equation, undo operations in reverse order while doing the same thing to both sides.",worked_example:"For 3x + 4 = 19, subtract 4 to get 3x = 15, then divide by 3 to get x = 5.",questions:[
  {prompt:"Solve 4x + 7 = 27.",options:["4","5","6","7"],correct_index:1,explanation:"Subtract 7 to get 4x = 20, then divide by 4: x = 5."},
  {prompt:"Solve 5x − 9 = 11.",options:["2","3","4","5"],correct_index:2,explanation:"Add 9 to get 5x = 20, so x = 4."}
 ]},
 "3A": {notes:"In a right-angled triangle, the square of the longest side equals the sum of the squares of the other two sides: c² = a² + b².",worked_example:"With shorter sides 6 cm and 8 cm, c² = 36 + 64 = 100, so c = 10 cm.",questions:[
  {prompt:"A right-angled triangle has shorter sides 5 cm and 12 cm. Find its longest side.",options:["11 cm","13 cm","17 cm","169 cm"],correct_index:1,explanation:"c² = 5² + 12² = 169, hence c = 13 cm."},
  {prompt:"The shorter sides are 9 cm and 12 cm. What is the hypotenuse?",options:["15 cm","21 cm","225 cm","3 cm"],correct_index:0,explanation:"9² + 12² = 225, so the hypotenuse is √225 = 15 cm."}
 ]},
 "4D": {notes:"Gradient measures the change in y divided by the change in x. A positive gradient rises as x increases; a negative gradient falls.",worked_example:"For points (1, 3) and (4, 9), the gradient is (9 − 3) ÷ (4 − 1) = 2.",questions:[
  {prompt:"Find the gradient of the line through (1, 2) and (5, 10).",options:["1/2","2","4","8"],correct_index:1,explanation:"Change in y is 8 and change in x is 4, so gradient = 8 ÷ 4 = 2."},
  {prompt:"What is the gradient of y = −3x + 4?",options:["−4","−3","3","4"],correct_index:1,explanation:"In y = mx + c, the coefficient of x is the gradient m."}
 ]},
 "5C": {notes:"Area measures the space inside a flat shape. For a triangle, use half the base times the perpendicular height; for a parallelogram, use base times perpendicular height.",worked_example:"A triangle with base 10 cm and perpendicular height 6 cm has area ½ × 10 × 6 = 30 cm².",questions:[
  {prompt:"A triangle has base 12 cm and perpendicular height 7 cm. Find its area.",options:["19 cm²","42 cm²","84 cm²","168 cm²"],correct_index:1,explanation:"Area = ½ × 12 × 7 = 42 cm²."},
  {prompt:"A parallelogram has base 9 m and perpendicular height 4 m. Find its area.",options:["13 m²","18 m²","36 m²","72 m²"],correct_index:2,explanation:"Area = base × perpendicular height = 9 × 4 = 36 m²."}
 ]},
 "6F": {notes:"Scientific notation writes a non-zero number as a number from 1 to less than 10 multiplied by a power of 10. Positive powers represent large values; negative powers represent small values.",worked_example:"6,300,000 = 6.3 × 10⁶, because the decimal moves six places left to reach 6.3.",questions:[
  {prompt:"Write 42,000,000 in scientific notation.",options:["4.2 × 10⁶","4.2 × 10⁷","42 × 10⁷","0.42 × 10⁷"],correct_index:1,explanation:"Move the decimal seven places left: 4.2 × 10⁷."},
  {prompt:"Write 0.00036 in scientific notation.",options:["3.6 × 10⁻³","3.6 × 10⁻⁴","36 × 10⁻⁴","3.6 × 10⁴"],correct_index:1,explanation:"Move the decimal four places right to reach 3.6, so use 10⁻⁴."}
 ]},
 "7F": {notes:"Similar figures have matching angles and corresponding lengths in a constant ratio. The scale factor is new length divided by original length.",worked_example:"If a side grows from 4 cm to 10 cm, the enlargement scale factor is 10 ÷ 4 = 2.5.",questions:[
  {prompt:"A corresponding side changes from 3 cm to 12 cm. What is the enlargement scale factor?",options:["1/4","3","4","9"],correct_index:2,explanation:"Scale factor = 12 ÷ 3 = 4."},
  {prompt:"A side of 5 cm is enlarged by a factor of 1.5. What is its new length?",options:["3.5 cm","6 cm","7.5 cm","8.5 cm"],correct_index:2,explanation:"Multiply the original length by the scale factor: 5 × 1.5 = 7.5 cm."}
 ]},
 "8A": {notes:"Expand two binomials by multiplying every term in the first bracket by every term in the second, then collect like terms.",worked_example:"(x + 2)(x + 4) = x² + 4x + 2x + 8 = x² + 6x + 8.",questions:[
  {prompt:"Expand (x + 3)(x + 5).",options:["x² + 8x + 15","x² + 15x + 8","x² + 8x + 8","x² + 2x + 15"],correct_index:0,explanation:"The cross terms add to 8x, and the constant product is 15."},
  {prompt:"Expand (x − 2)(x + 6).",options:["x² + 8x − 12","x² + 4x − 12","x² − 4x − 12","x² + 4x + 12"],correct_index:1,explanation:"x² + 6x − 2x − 12 = x² + 4x − 12."}
 ]},
 "9E": {notes:"A tree diagram tracks outcomes in order. Multiply probabilities along a branch, then add the probabilities of different branches when more than one path meets the question.",worked_example:"For two fair coin tosses, P(heads then heads) = ½ × ½ = ¼.",questions:[
  {prompt:"A fair coin is tossed twice. What is the probability of two heads?",options:["1/8","1/4","1/2","3/4"],correct_index:1,explanation:"Multiply the probabilities along the heads–heads branch: ½ × ½ = ¼."},
  {prompt:"A bag has 3 red and 2 blue counters. A counter is replaced after the first draw. What is P(red then red)?",options:["3/10","6/20","9/25","3/5"],correct_index:2,explanation:"With replacement the probability of red stays 3/5: (3/5) × (3/5) = 9/25."}
 ]},
 "10A": {notes:"A quadratic equation contains a variable squared as its highest power. Solving it means finding all values that make the equation true.",worked_example:"(x − 2)(x − 4) = 0 has solutions x = 2 or x = 4, since either bracket can equal zero.",questions:[
  {prompt:"Which equation is quadratic?",options:["3x + 2 = 0","x² − 5x + 6 = 0","1/x = 2","x³ − 1 = 0"],correct_index:1,explanation:"Its highest power of x is 2, so it is quadratic."},
  {prompt:"Solve (x − 2)(x − 5) = 0.",options:["x = 2 only","x = 5 only","x = 2 or x = 5","x = −2 or x = −5"],correct_index:2,explanation:"A product is zero if either factor is zero: x − 2 = 0 or x − 5 = 0."}
 ]},
};

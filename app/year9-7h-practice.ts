import type {QuestionValues} from "./QuestionEditor";

// Ordered as eight core questions followed by thirteen optional questions.
// Skills progress from similarity tests and correspondence to proofs and applications.
let optionIndex=0;
const mc=(prompt:string,key:string,a:string,b:string,c:string,explanation:string):QuestionValues=>{
 const correct_index=optionIndex++%4,options=[a,b,c];
 options.splice(correct_index,0,key);
 return {prompt,options,correct_index,explanation};
};
const sa=(prompt:string,accepted:string[],explanation:string):QuestionValues=>({
 prompt,options:{kind:"short_answer",accepted,exact:false},correct_index:0,explanation,
});

export const practice7H:QuestionValues[]=[
 // Core 1–8
 mc("In triangles ABC and PQR, ∠A = ∠P and ∠B = ∠Q. Which test proves the triangles similar?","AAA","SSS","SAS","RHS","Two equal angle pairs force the third pair to be equal, so AAA proves similarity."),
 mc("∠A = ∠Y, ∠B = ∠X and ∠C = ∠Z. Which statement lists the matching vertices in the correct order?","ΔABC ∼ ΔYXZ","ΔABC ∼ ΔXYZ","ΔABC ∼ ΔZXY","ΔACB ∼ ΔYXZ","Match each vertex in order: A↔Y, B↔X and C↔Z, so ABC corresponds to YXZ."),
 mc("One triangle has sides 5, 8 and 11 cm; another has sides 7.5, 12 and 16.5 cm. Which test directly confirms similarity from the listed measurements?","SSS; each corresponding side ratio is 1.5","AAA; no angles are listed","RHS; no right angle is given","No test; similar triangles must have equal side lengths","Each corresponding side ratio is 1.5: 7.5/5 = 12/8 = 16.5/11, so SSS applies."),
 mc("Two triangles have side pairs 6 cm and 9 cm, and 8 cm and 12 cm. The angles included between those pairs are equal. Which test proves similarity?","SAS","SSS","AAA","RHS","Both side ratios are 9/6 = 12/8 = 1.5, and the equal angle is included between the sides."),
 sa("A corresponding side grows from 7.2 cm to 12 cm. Find the scale factor from the smaller triangle to the larger. Enter a fraction or decimal.",["5/3","1.6666666667"],"Divide the larger length by the smaller: 12 ÷ 7.2 = 5/3."),
 sa("Similar triangles have corresponding sides 4 cm and 10 cm. A second side of the smaller triangle is 6.8 cm. Find its matching length in the larger triangle.",["17","17 cm","17.0 cm"],"The enlargement factor is 10/4 = 2.5. Multiply 6.8 by 2.5 to get 17 cm."),
 sa("Triangles LMN and STU are similar in that order. LM = 6 cm, ST = 9 cm and LN = 8 cm. Find SU.",["12","12 cm","12.0 cm"],"L↔S and N↔U, so LN corresponds to SU. The scale factor is 9/6 = 1.5; 8 × 1.5 = 12 cm."),
 sa("A 1.2 m stick casts a 0.9 m shadow. At the same time, a tree casts a 15 m shadow. Estimate the tree’s height.",["20","20 m","20.0 m"],"The vertical objects and ground make right angles, and the sun gives the same acute angle, so the triangles are similar. The factor is 15/0.9; the height is 1.2 × 15/0.9 = 20 m."),

 // Optional 9–21
 mc("In triangle ABC, D lies on AB, E lies on AC and DE ∥ BC. Which angle equals ∠ADE?","∠ABC","∠ACB","∠AED","∠ADC","AD lies on AB and DE is parallel to BC, so ∠ADE and ∠ABC are corresponding angles."),
 sa("In triangle ABC, D lies on AB, E lies on AC and DE ∥ BC. If AD = 6 cm, AB = 15 cm and AE = 8 cm, find AC.",["20","20 cm","20.0 cm"],"The triangles ADE and ABC are similar. AD/AB = AE/AC, so 6/15 = 8/AC and AC = 20 cm."),
 mc("Straight lines AC and BD cross at O. What is the reason ∠AOB equals ∠COD?","They are vertically opposite angles","They are alternate interior angles","They are corresponding sides","They are angles in an isosceles triangle","The two angles face each other where the straight lines intersect, so they are vertically opposite and equal."),
 mc("In the same crossing-lines diagram, AB ∥ CD. Which similarity statement follows for the triangles on the left and right of O?","ΔAOB ∼ ΔCOD","ΔAOB ∼ ΔDOC","ΔAOB ∼ ΔCDO","ΔAOB ∼ ΔOCD","A↔C by alternate angles, B↔D by alternate angles, and O↔O by vertically opposite angles. Thus AOB matches COD by AAA."),
 mc("In right triangle PQR, ∠Q = 90°. S lies on PR and QS ⟂ PR. Which statement is true?","ΔPQS ∼ ΔQRS","ΔPQS ∼ ΔQSR","ΔPQS is congruent to ΔQRS","The two smaller triangles cannot be similar","Both smaller triangles have a right angle at S, and their other acute angles match by the complementary angles in the original right triangle."),
 sa("Two cables form similar right triangles with a vertical pole. A 5 m cable reaches 3 m up the pole. A second cable reaches 12 m up the same pole at the same angle. Find the second cable’s length.",["20","20 m","20.0 m"],"The vertical scale factor is 12/3 = 4. The cable length is the corresponding hypotenuse, so 5 × 4 = 20 m."),
 sa("A surveyor models a river crossing with two similar triangles. A 8 m baseline in the near-bank triangle corresponds to a 28 m baseline in the larger triangle. A 3 m perpendicular segment in the smaller triangle corresponds to the river width. Estimate the width.",["10.5","10.5 m"],"The scale factor is 28/8 = 3.5. Apply it to the corresponding perpendicular segment: 3 × 3.5 = 10.5 m."),
 mc("If ΔABC ∼ ΔPQR in that order, which side corresponds to AC?","PR","PQ","QR","Cannot be determined","The written order pairs A↔P, B↔Q and C↔R, so AC corresponds to PR."),
 sa("Triangles XYZ and UVW are similar in that order. XY = 2x + 3, UV = 15, YZ = 8 and VW = 20. Find x.",["1.5","3/2"],"YZ corresponds to VW, giving scale factor 20/8 = 2.5. Therefore XY = UV/2.5 = 6, so 2x + 3 = 6 and x = 1.5."),
 mc("Two triangles have all corresponding angles equal, but one side is 4 cm and its matching side is 10 cm. Which conclusion is justified?","They are similar, but not congruent","They are congruent by AAA","Their corresponding sides must be equal","Their areas must be equal","AAA proves the same shape, not the same size. The different corresponding lengths rule out congruence."),
 mc("Two triangles have equal included angles. The side pairs around those angles are 4 cm and 9 cm in one triangle, and 6 cm and 12 cm in the other. Does SAS prove they are similar?","No; the side ratios differ","Yes; the included angles match","Yes; any two side pairs are enough","No; equal angles prevent similarity","For SAS similarity, both side ratios must match. Here 6/4 = 1.5 but 12/9 ≈ 1.33."),
 sa("A 1.6 m student stands 2.4 m from a mirror on level ground. A tower’s base is 18 m from the mirror. The student sees the tower top in the mirror, creating similar right triangles. Estimate the tower’s height.",["12","12 m","12.0 m"],"The height-to-distance ratios match: h/18 = 1.6/2.4 = 2/3. Thus h = 12 m."),
 mc("Triangle ABC is right-angled at A. AD is perpendicular to hypotenuse BC, meeting it at D. After proving ΔABD ∼ ΔCAD, which relationship follows?","AD² = BD × DC","AD = BD + DC","AB² = BD × DC","AD/BD = AB/DC","The similarity pairs AD with CD and BD with AD. Hence AD/BD = CD/AD, so AD² = BD × CD."),
];

if(practice7H.length!==21)throw new Error("7H practice must contain 21 questions");

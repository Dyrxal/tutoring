-- One-time shuffle of the starter checks. Only affects the original unanswered template questions.
WITH selected AS (
 SELECT q.id,q.options,((row_number() over(order by q.prompt)-1) % 4)::int AS slot
 FROM public.questions q JOIN public.lessons l ON l.id=q.lesson_id JOIN public.modules m ON m.id=l.module_id
 WHERE m.course_id='3f85b4a0-e9bc-407e-bcbf-53d03ee354eb' AND q.correct_index=0
 AND q.prompt IN (SELECT value FROM jsonb_array_elements_text('["√48 simplifies to…", "What is 4⁻²?", "Expand (x+1)(x+7).", "Factorise x²−49.", "Simplify (x²−1)/(x−1), x≠1.", "Solve −3x>12.", "Which pair solves x+y=7 and x−y=1?", "In C=12+5h, what does 5 mean?", "What is the vertex of y=(x−4)²−2?", "Solve x²−9=0.", "Which is cheaper per litre: 2 L for $5 or 3 L for $6?", "A $60 item discounted 15% costs…", "At 10% compound interest for two years, $100 becomes…", "Area of a triangle with base 10 cm and height 6 cm is…", "Closed cube of edge 3 cm has surface area…", "A 4×3×2 cm prism has volume…", "A right triangle with legs 9 and 12 has hypotenuse…", "Which ratio is opposite/adjacent?", "Similar shapes always have…", "At 1:100, 5 cm represents…", "Which condition guarantees triangle similarity?", "Best graph for counts of preferred sports?", "Median of 2,4,9,11,20 is…", "If Q1=6 and Q3=14, IQR is…", "If |A|=12, |B|=9 and |A∩B|=4, |A∪B| is…", "7 successes in 20 trials gives experimental probability…"]'::jsonb))
), rotated AS (
 SELECT id,slot,CASE slot
 WHEN 1 THEN jsonb_build_array(options->1,options->0,options->2,options->3)
 WHEN 2 THEN jsonb_build_array(options->1,options->2,options->0,options->3)
 WHEN 3 THEN jsonb_build_array(options->1,options->2,options->3,options->0)
 ELSE options END AS choices FROM selected
) UPDATE public.questions q SET options=r.choices,correct_index=r.slot FROM rotated r WHERE q.id=r.id;

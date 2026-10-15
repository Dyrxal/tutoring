-- Optional demonstration course. Run once after schema.sql.
with c as (insert into public.courses(title,description) values ('Mathematical Methods 3/4','A clear path through key VCE Mathematical Methods concepts.') returning id),
m as (insert into public.modules(course_id,title,position) select id,'Differentiation',0 from c returning id)
insert into public.lessons(module_id,title,objective,notes,worked_example,position) select m.id,v.title,v.objective,v.notes,v.example,v.pos from m cross join (values
('Introduction to Differentiation','Understand the derivative as the gradient of a curve at a point.','Differentiation describes how quickly a function changes. The derivative f′(x) gives the tangent gradient.','For f(x) = x², f′(x) = 2x, so f′(2) = 4.',0),
('Power Rule','Differentiate polynomial terms using the power rule.','For f(x) = xⁿ, the derivative is f′(x) = nxⁿ⁻¹.','For f(x) = 3x⁴ − 2x² + 7, f′(x) = 12x³ − 4x.',1),
('Chain Rule','Differentiate a function inside another function.','Differentiate the outside, then multiply by the derivative of the inside.','For y = (3x + 1)⁴, y′ = 12(3x + 1)³.',2)
) as v(title,objective,notes,example,pos);
insert into public.questions(lesson_id,prompt,options,correct_index,explanation,position)
select l.id,v.prompt,v.options::jsonb,v.correct,v.explanation,v.pos from public.lessons l join public.modules m on m.id=l.module_id join public.courses c on c.id=m.course_id cross join lateral (values
('Introduction to Differentiation','What does f′(3) represent?','["Area under the curve","Gradient of the tangent at x = 3","Value of f(3)","The x-intercept"]',1,'The derivative at a point is the instantaneous gradient there.',0),
('Introduction to Differentiation','If f′(x) < 0, the function is…','["Increasing","Constant","Decreasing","Undefined"]',2,'A negative gradient means the function decreases.',1),
('Power Rule','What is the derivative of 5x³?','["5x²","15x²","15x³","3x²"]',1,'Multiply 5 by 3, then reduce the exponent.',0),
('Power Rule','What is the derivative of the constant 8?','["8","1","0","8x"]',2,'A constant does not change with x.',1),
('Chain Rule','Differentiate (2x + 5)³.','["3(2x + 5)²","6(2x + 5)²","6(2x + 5)³","2(2x + 5)²"]',1,'The outside contributes 3(2x + 5)² and the inside contributes 2.',0),
('Chain Rule','In y = (x² + 1)⁵, what is the inside function?','["x² + 1","5","(x² + 1)⁵","x"]',0,'The expression inside the fifth power is x² + 1.',1)
) as v(lesson,prompt,options,correct,explanation,pos) where c.title='Mathematical Methods 3/4' and l.title=v.lesson;

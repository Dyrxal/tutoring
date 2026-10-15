"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import {createClient} from "@supabase/supabase-js";
import {BookOpen,LayoutDashboard,BarChart3,Users,Layers3,UserRound,ChevronRight,ChevronDown,ArrowLeft,Plus,Check,Play,FileText,Menu,Flag} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import PdfViewer from "./PdfViewer";
import QuestionImage from "./QuestionImage";
import QuestionEditor,{type QuestionValues} from "./QuestionEditor";
import MathText from "./MathText";
import QuestionHelp from "./QuestionHelp";
import LessonPracticeTemplate from "./LessonPracticeTemplate";
import {resolveLessonFlow,hasPracticeHelp} from "./lesson-template";
import {practicePrompt} from "./chapter1-template-rollout";
import {year9TemplateRollout} from "./year9-template-rollout";
import {year10TemplateRollout} from "./year10-template-rollout";
import Chapter1RolloutStatus from "./Chapter1RolloutStatus";
import {restoreAnswers} from "./restore-answers";
import {savePracticeAttempt} from "./save-practice-attempt";
import TutorAnalytics from "./TutorAnalytics";
import PracticeActivity from "./PracticeActivity";
import ReportProblemButton from "./ReportProblemButton";
import ReportedProblems from "./ReportedProblems";
import QuestionFlagsProvider,{FlagQuestionButton} from "./QuestionFlagsProvider";
import FlaggedQuestions from "./FlaggedQuestions";
import {StudentNextTasks,TutorStudentTasks} from "./NextTasks";
import MistakeReview from "./MistakeReview";
import ShortAnswerPractice from "./ShortAnswerPractice";
import {lessonVideoEmbed as embed} from "./media-urls";
import {isLessonAttempt,type ReviewAttempt} from "./mistake-review";
import {StudentAvatar,studentAvatars} from "./StudentAvatar";
import {LessonFlow,LessonEditor,type Flow,type ImageEdit} from "./LessonFlow";
import {textbookChapters,textbookCourseTitle,textbookCourseDescription,starterSections} from "./textbook-outline";
import {pilot1AQuestions} from "./year9-1a-practice";
import {pilot1BQuestions} from "./year9-1b-practice";
import {pilot1CQuestions} from "./year9-1c-practice";
import {pilot1DQuestions} from "./year9-1d-practice";
import {pilot1EQuestions} from "./year9-1e-practice";
import {pilot1FQuestions} from "./year9-1f-practice";
import {pilot1GQuestions} from "./year9-1g-practice";
import {pilot1HQuestions} from "./year9-1h-practice";
import {pilot1IQuestions} from "./year9-1i-practice";
import {pilot1JQuestions} from "./year9-1j-practice";
import {pilot1KQuestions} from "./year9-1k-practice";
import {chapter10Practice} from "./year9-ch10-practice";
import {chapter4Practice} from "./year9-ch4-practice";
import {chapter5Practice} from "./year9-ch5-practice";
import {fetchAllQuestions} from "./load-questions";
import {chapter3Practice} from "./year9-ch3-practice";
import {chapter2Practice} from "./year9-ch2-practice";
import {chapter2Fixups} from "./year9-ch2-fixups";
import {chapter6Practice} from "./year9-ch6-practice";
import {chapter7Practice} from "./year9-ch7-practice";
import {chapter8Practice as chapter8EarlyPractice} from "./year9-ch8-practice";
import {chapter8FurtherPractice} from "./year9-ch8-fk-practice";
import {chapter9Practice} from "./year9-ch9-practice";
import {year10Chapter1Practice} from "./year10-ch1-practice";
import {year10Chapter2Practice} from "./year10-ch2-practice";
import {year10Chapter3Practice} from "./year10-ch3-practice";
import {year10Chapter45Practice} from "./year10-ch45-practice";
import {year10Chapter67Practice} from "./year10-ch67-practice";
import {year10Chapter810Practice} from "./year10-ch8-10-practice";
import {previousYear10SeedRows} from "./year10-ch1-previous-rows";
import {isShortAnswer,matchesShortAnswer,type QuestionOptions} from "./question-types";

type Q={id:string;prompt:string;options:QuestionOptions;correct_index:number;explanation:string;image_path?:string|null;image_alt?:string};
type Lesson={id:string;module_id:string;title:string;objective:string;notes:string;worked_example:string;video_url:string|null;lesson_flow?:Flow|null;notes_image_path?:string|null;notes_image_alt?:string;example_image_path?:string|null;example_image_alt?:string;resources:{title:string;url?:string;path?:string}[];position:number;questions:Q[]};
type Module={id:string;course_id:string;title:string;position:number;lessons:Lesson[]};
type Course={id:string;title:string;description:string;modules:Module[]};
function stableQuestionData(value:unknown):string{return Array.isArray(value)?`[${value.map(stableQuestionData).join(",")}]`:value&&typeof value==="object"?`{${Object.entries(value as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>`${JSON.stringify(key)}:${stableQuestionData(item)}`).join(",")}}`:JSON.stringify(value)??"undefined"}
function isPreviousYear10Seed(q:Q):boolean{const previous=previousYear10SeedRows[q.id];return !!previous&&q.prompt===previous.prompt&&stableQuestionData(q.options)===stableQuestionData(previous.options)&&q.correct_index===previous.correct_index&&q.explanation===previous.explanation}
function courseYear(title:string):string|null{const match=title.match(/^year\s*(7|8|9|10|11|12)(?=\s|-|$)/i);return match?`Year ${match[1]}`:null}
// These are public Supabase client settings, not a password or service-role key.
// The hosted client build does not receive runtime environment variables.
const url=process.env.NEXT_PUBLIC_SUPABASE_URL||"https://lmuwsjjrqmmmtmxjvqln.supabase.co";
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"sb_publishable_JD3-Cfc_cDvOkuEDs-v_UA_sWBjXbCy";
const db=url&&key?createClient(url,key):null;
async function fetchAllAttempts(client:NonNullable<typeof db>){const rows:any[]=[];for(let from=0;;from+=500){const result=await client.from("practice_attempts").select("*").order("attempted_at").order("id").range(from,from+499);if(result.error)return {data:null,error:result.error};rows.push(...(result.data||[]));if((result.data||[]).length<500)return {data:rows,error:null}}}
const chapter8Practice={...chapter8EarlyPractice,...chapter8FurtherPractice};
const chapter9ImportLocks=new Set<string>();
const chapter7ImportLocks=new Set<string>();
const sample=(id:string,title:string,objective:string,notes:string,worked_example:string,questions:Q[],position:number):Lesson=>({id,module_id:"differentiation",title,objective,notes,worked_example,video_url:null,resources:[],position,questions});
const demo:Course[]=[{id:"methods",title:"Mathematical Methods 3/4",description:"A clear path through key VCE Mathematical Methods concepts.",modules:[{id:"differentiation",course_id:"methods",title:"Differentiation",position:0,lessons:[
 sample("introduction","Introduction to Differentiation","Understand the derivative as the gradient of a curve at a point.","Differentiation describes how quickly a function changes. The derivative f′(x) gives the gradient of the tangent at x. Positive derivatives mean a function is increasing; negative derivatives mean it is decreasing.","If f(x) = x², then f′(x) = 2x. At x = 2, the tangent gradient is f′(2) = 4.",[{id:"q1",prompt:"What does f′(3) represent?",options:["Area under the curve","Gradient of the tangent at x = 3","Value of f(3)","The x-intercept"],correct_index:1,explanation:"The derivative at a point is the instantaneous gradient there."},{id:"q2",prompt:"If f′(x) < 0, the function is…",options:["Increasing","Constant","Decreasing","Undefined"],correct_index:2,explanation:"A negative gradient means the function decreases as x increases."}],0),
 sample("power","Power Rule","Differentiate polynomial terms using the power rule.","For f(x) = xⁿ, the derivative is f′(x) = nxⁿ⁻¹. Multiply by the exponent, then reduce the exponent by one. Constants differentiate to zero.","If f(x) = 3x⁴ − 2x² + 7, then f′(x) = 12x³ − 4x.",[{id:"q3",prompt:"What is the derivative of 5x³?",options:["5x²","15x²","15x³","3x²"],correct_index:1,explanation:"Multiply 5 by 3 and reduce the exponent to 2."},{id:"q4",prompt:"What is the derivative of the constant 8?",options:["8","1","0","8x"],correct_index:2,explanation:"A constant has no change with x."}],1),
 sample("chain","Chain Rule","Differentiate a function inside another function.","Differentiate the outside function, leaving the inside in place, then multiply by the derivative of the inside. If y = [g(x)]ⁿ, then y′ = n[g(x)]ⁿ⁻¹g′(x).","For y = (3x + 1)⁴, differentiate the outside to get 4(3x + 1)³, then multiply by the inside derivative 3. Thus y′ = 12(3x + 1)³.",[{id:"q5",prompt:"Differentiate (2x + 5)³.",options:["3(2x + 5)²","6(2x + 5)²","6(2x + 5)³","2(2x + 5)²"],correct_index:1,explanation:"The outside contributes 3(2x + 5)² and the inside contributes 2."},{id:"q6",prompt:"In y = (x² + 1)⁵, what is the inside function?",options:["x² + 1","5","(x² + 1)⁵","x"],correct_index:0,explanation:"The expression inside the fifth power is x² + 1."}],2)
]}]}];
const lessons=(c:Course)=>c.modules.flatMap(m=>m.lessons);
export default function Home(){
 const pendingSubmissions=useRef(new Set<string>());
 const submissionIds=useRef(new Map<string,string>());
 const [answerSaving,setAnswerSaving]=useState<Record<string,boolean>>({});
 const [answerErrors,setAnswerErrors]=useState<Record<string,string>>({});
 const chapter3Started=useRef(new Set<string>());
 const chapter2Started=useRef(new Set<string>());
 const chapter6Started=useRef(new Set<string>());
 const chapter7Started=useRef(new Set<string>());
 const chapter8Started=useRef(new Set<string>());
 const chapter9Started=useRef(new Set<string>());
 const chapter10Started=useRef(new Set<string>());
 const year10Chapter1Started=useRef(new Set<string>());
 const year10Ch23Started=useRef(new Set<string>());
 const year10Ch45Started=useRef(new Set<string>());
 const year10Ch67Started=useRef(new Set<string>());
 const year10Ch810Started=useRef(new Set<string>());
 const year10Ch810BulkStarted=useRef(false);
 const chapter4Started=useRef(new Set<string>());
 const chapter5Started=useRef(new Set<string>());
 const [session,setSession]=useState<any>(null),[role,setRole]=useState("student"),[page,setPage]=useState("Dashboard"),[courses,setCourses]=useState<Course[]>(db?[]:demo),[students,setStudents]=useState<any[]>([]),[enrolments,setEnrolments]=useState<any[]>([]),[records,setRecords]=useState<any[]>([]),[attemptRecords,setAttemptRecords]=useState<any[]>([]),[completed,setCompleted]=useState<string[]>([]),[last,setLast]=useState<string|null>(null),[answers,setAnswers]=useState<Record<string,number>>({}),[shortAnswers,setShortAnswers]=useState<Record<string,{response:string;correct:boolean}>>({}),[showMorePractice,setShowMorePractice]=useState(false),[courseId,setCourseId]=useState<string|null>(null),[lessonId,setLessonId]=useState<string|null>(null),[expanded,setExpanded]=useState<string|null>("differentiation"),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[signup,setSignup]=useState(false),[signupName,setSignupName]=useState(""),[signupYear,setSignupYear]=useState(""),[signupAvatar,setSignupAvatar]=useState("book"),[message,setMessage]=useState(""),[mobile,setMobile]=useState(false),[viewing,setViewing]=useState<{title:string;path:string}|null>(null),[editingLesson,setEditingLesson]=useState(false),[questionEditor,setQuestionEditor]=useState<string|null>(null),[importing,setImporting]=useState(""),[confirmOldCourseRemoval,setConfirmOldCourseRemoval]=useState(false);
 const [reviewAttemptRecords,setReviewAttemptRecords]=useState<ReviewAttempt[]>([]);
 const [activityOwner,setActivityOwner]=useState<string|null>(null),[activityLoadError,setActivityLoadError]=useState("");
 const preview=!db,userId=session?.user?.id||"preview-student",isTutor=role==="tutor";
 const activeStudentId=useRef(userId);activeStudentId.current=userId;
 const visible=courses.filter(c=>isTutor||preview||enrolments.some(e=>e.student_id===userId&&e.course_id===c.id));

 const course=courses.find(c=>c.id===courseId),lesson=course&&lessons(course).find(l=>l.id===lessonId),module=course?.modules.find(m=>m.id===lesson?.module_id),ordered=course?lessons(course):[],index=ordered.findIndex(l=>l.id===lessonId);
 const year9Rollout=useMemo(()=>year9TemplateRollout(courses),[courses]);
 const year10Rollout=useMemo(()=>year10TemplateRollout(courses),[courses]);
 const flagCourseIds=new Set([year9Rollout.courseId,year10Rollout.courseId].filter(Boolean));
 const reviewEntries=visible.flatMap(course=>course.modules.flatMap(chapter=>chapter.lessons.filter(lesson=>lesson.questions.length>0).map(lesson=>({courseId:course.id,courseTitle:course.title,chapterId:chapter.id,chapterTitle:chapter.title,lesson:{...lesson,lesson_flow:resolveLessonFlow({...lesson,lesson_flow:year9Rollout.flows.get(lesson.id)||year10Rollout.flows.get(lesson.id)||lesson.lesson_flow})}}))));
 const lessonFlow=lesson?resolveLessonFlow({...lesson,lesson_flow:year9Rollout.flows.get(lesson.id)||year10Rollout.flows.get(lesson.id)||lesson.lesson_flow}):{};
 const structuredPractice=lessonFlow.template?.version===1&&lessonFlow.template.enabled!==false;
 const coreQuestionCount=lesson?(structuredPractice?8:Math.min(8,lesson.questions.length)):0;
 const coreAnsweredCount=lesson?lesson.questions.slice(0,8).filter(q=>db?attemptRecords.some(a=>a.student_id===userId&&a.question_id===q.id):answers[q.id]!==undefined||shortAnswers[q.id]!==undefined).length:0;
 const canCompleteCore=coreQuestionCount>0&&coreAnsweredCount===coreQuestionCount;
 const practiceName=structuredPractice?"core":"standard";
 const firstUnansweredCore=lesson?.questions.slice(0,8).find(q=>db?!attemptRecords.some(a=>a.student_id===userId&&a.question_id===q.id):answers[q.id]===undefined&&shortAnswers[q.id]===undefined);
 const questionHelp=(q:Q)=>lessonFlow.practice_help?.[q.id];
 const pct=(c:Course)=>lessons(c).length?Math.round(100*lessons(c).filter(l=>completed.includes(l.id)).length/lessons(c).length):0;
 // Tutors may rename the course. Identify it by its chapter and lesson structure,
 // then fall back to historical titles while setup is still in progress.
 const textbookCourse=courses.find(c=>c.modules.some(m=>m.title===textbookChapters[0].title&&m.lessons.some(l=>l.title==="1A Integer operations")))||courses.find(c=>c.title===textbookCourseTitle||c.title==="Year 9 Mathematics · Textbook sequence");
 const year10Course=courses.find(c=>c.modules.some(m=>m.title==="Chapter 1: Linear relations"&&m.lessons.some(l=>l.title==="1A Review of algebra")));
 const year10Chapter1Module=year10Course?.modules.find(m=>m.title==="Chapter 1: Linear relations");
 const year10Chapter1Targets=Object.keys(year10Chapter1Practice).map(code=>({code,lesson:year10Chapter1Module?.lessons.find(l=>l.title.startsWith(`${code} `))}));
 const year10Chapter1Signature=year10Chapter1Targets.map(({code,lesson})=>`${code}:${lesson?.id||""}:${lesson?.questions.length??-1}`).join("|");
 const year10Chapter2Targets=Object.keys(year10Chapter2Practice).map(code=>({code,lesson:year10Course?.modules.find(m=>m.title==="Chapter 2: Geometry")?.lessons.find(l=>l.title.startsWith(`${code} `))}));
 const year10Chapter3Targets=Object.keys(year10Chapter3Practice).map(code=>({code,lesson:year10Course?.modules.find(m=>m.title==="Chapter 3: Indices and surds")?.lessons.find(l=>l.title.startsWith(`${code} `))}));
 const year10Ch23Targets=[...year10Chapter2Targets,...year10Chapter3Targets];
 const year10Ch23Signature=year10Ch23Targets.map(({code,lesson})=>`${code}:${lesson?.id||""}:${lesson?.questions.length??-1}`).join("|");
 const year10Chapter45Targets=Object.keys(year10Chapter45Practice).map(code=>({code,lesson:year10Course?.modules.find(m=>m.title===(code.startsWith("4")?"Chapter 4: Trigonometry":"Chapter 5: Quadratic expressions and equations"))?.lessons.find(l=>l.title.startsWith(`${code} `))}));
 const year10Ch45Signature=year10Chapter45Targets.map(({code,lesson})=>`${code}:${lesson?.id||""}:${lesson?.questions.length??-1}`).join("|");
 const year10Chapter67Targets=Object.keys(year10Chapter67Practice).map(code=>({code,lesson:year10Course?.modules.find(m=>m.title===(code.startsWith("6")?"Chapter 6: Measurement":"Chapter 7: Parabolas and other graphs"))?.lessons.find(l=>l.title.startsWith(`${code} `))}));
 const year10Ch67Signature=year10Chapter67Targets.map(({code,lesson})=>`${code}:${lesson?.id||""}:${lesson?.questions.length??-1}`).join("|");
 const year10Chapter810Targets=Object.keys(year10Chapter810Practice).map(code=>({code,lesson:year10Course?.modules.find(m=>m.title===(code.startsWith("8")?"Chapter 8: Probability":code.startsWith("9")?"Chapter 9: Statistics":"Chapter 10: Logarithms and polynomials"))?.lessons.find(l=>l.title.startsWith(`${code} `))}));
 const year10Ch810Signature=year10Chapter810Targets.map(({code,lesson})=>`${code}:${lesson?.id||""}:${lesson?.questions.length??-1}`).join("|");
 const pilot1ALesson=textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title==="1A Integer operations");
 const pilot1AReady=!!pilot1ALesson&&pilot1AQuestions.every(q=>pilot1ALesson.questions.some(saved=>saved.prompt===q.prompt));
 const pilot1BLesson=textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title==="1B Decimals and significant figures");
 const pilot1BReady=!!pilot1BLesson&&pilot1BQuestions.every(q=>pilot1BLesson.questions.some(saved=>saved.prompt===q.prompt));
 const pilot1CLesson=textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title==="1C Rational numbers");
 const pilot1CReady=!!pilot1CLesson&&pilot1CQuestions.every(q=>pilot1CLesson.questions.some(saved=>saved.prompt===q.prompt));
 const pilot1DLesson=textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title==="1D Operations with fractions");
 const pilot1DReady=!!pilot1DLesson&&pilot1DQuestions.every(q=>pilot1DLesson.questions.some(saved=>saved.prompt===q.prompt));
 const pilot1ELesson=textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title==="1E Ratios, rates and best buys");
 const pilot1EReady=!!pilot1ELesson&&pilot1EQuestions.every(q=>pilot1ELesson.questions.some(saved=>saved.prompt===q.prompt));
 const pilot1FLesson=textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title==="1F Percentages and money");
 const pilot1FReady=!!pilot1FLesson&&pilot1FQuestions.every(q=>pilot1FLesson.questions.some(saved=>saved.prompt===q.prompt));
 const pilot1GLesson=textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title==="1G Percentage increase and decrease");
 const pilot1GReady=!!pilot1GLesson&&pilot1GQuestions.every(q=>pilot1GLesson.questions.some(saved=>saved.prompt===q.prompt));
 const pilot1HLesson=textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title==="1H Profits and discounts");
 const pilot1HReady=!!pilot1HLesson&&pilot1HQuestions.every(q=>pilot1HLesson.questions.some(saved=>saved.prompt===q.prompt));
 const pilot1ILesson=textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title==="1I Income and taxation");
 const pilot1IReady=!!pilot1ILesson&&pilot1IQuestions.every(q=>pilot1ILesson.questions.some(saved=>saved.prompt===q.prompt));
 const pilot1JLesson=textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title==="1J Simple interest");
 const pilot1JReady=!!pilot1JLesson&&pilot1JQuestions.every(q=>pilot1JLesson.questions.some(saved=>saved.prompt===q.prompt));
 const pilot1KLesson=textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title==="1K Compound interest");
 const pilot1KReady=!!pilot1KLesson&&pilot1KQuestions.every(q=>pilot1KLesson.questions.some(saved=>saved.prompt===q.prompt));
 const chapter10Targets=(Object.keys(chapter10Practice) as (keyof typeof chapter10Practice)[]).map(code=>({code,lesson:textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title.startsWith(`${code} `))}));
 const chapter4Targets=(Object.keys(chapter4Practice) as (keyof typeof chapter4Practice)[]).map(code=>({code,lesson:textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title.startsWith(`${code} `))}));
 const chapter4Signature=chapter4Targets.map(({code,lesson})=>`${code}:${lesson?.id||""}:${lesson?.questions.length??-1}`).join("|");
 const chapter5Targets=(Object.keys(chapter5Practice) as (keyof typeof chapter5Practice)[]).map(code=>({code,lesson:textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title.startsWith(`${code} `))}));
 const chapter5Signature=chapter5Targets.map(({code,lesson})=>`${code}:${lesson?.id||""}:${lesson?.questions.length??-1}`).join("|");
 const chapter6Targets=(Object.keys(chapter6Practice) as (keyof typeof chapter6Practice)[]).map(code=>({code,lesson:textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title.startsWith(`${code} `))}));
 const chapter6Signature=chapter6Targets.map(({code,lesson})=>`${code}:${lesson?.id||""}:${lesson?.questions.length??-1}`).join("|");
 const chapter7Targets=(Object.keys(chapter7Practice) as (keyof typeof chapter7Practice)[]).map(code=>({code,lesson:textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title.startsWith(`${code} `))}));
 const chapter7Signature=chapter7Targets.map(({code,lesson})=>`${code}:${lesson?.id||""}:${lesson?.questions.length??-1}`).join("|");
 const chapter3Targets=Object.keys(chapter3Practice).map(code=>({code,lesson:textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title.startsWith(`${code} `))}));
 const chapter3Signature=chapter3Targets.map(({code,lesson})=>`${code}:${lesson?.id||""}:${lesson?.questions.length??-1}`).join("|");
 const chapter2Targets=Object.keys(chapter2Practice).map(code=>({code,lesson:textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title.startsWith(`${code} `))}));
 const chapter2Signature=chapter2Targets.map(({code,lesson})=>`${code}:${lesson?.id||""}:${lesson?.questions.length??-1}`).join("|");
 const chapter10Signature=chapter10Targets.map(({code,lesson})=>`${code}:${lesson?.id||""}:${lesson?.questions.length??-1}`).join("|");
 const chapter8Targets=(Object.keys(chapter8Practice) as (keyof typeof chapter8Practice)[]).map(code=>({code,lesson:textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title.startsWith(`${code} `))}));
 const chapter8Signature=chapter8Targets.map(({code,lesson})=>`${code}:${lesson?.id||""}:${lesson?.questions.length??-1}`).join("|");
 const chapter9Targets=(Object.keys(chapter9Practice) as (keyof typeof chapter9Practice)[]).map(code=>({code,lesson:textbookCourse?.modules.flatMap(m=>m.lessons).find(l=>l.title.startsWith(`${code} `))}));
 const chapter9Signature=chapter9Targets.map(({code,lesson})=>`${code}:${lesson?.id||""}:${lesson?.questions.length??-1}`).join("|");
 const textbookReady=!!textbookCourse&&textbookCourse.modules.length===textbookChapters.length&&textbookChapters.every(chapter=>textbookCourse.modules.some(m=>m.title===chapter.title&&m.lessons.length>=chapter.sections.length+1));
 const openCourse=(id:string)=>{setCourseId(id);setLessonId(null);setPage("Course");setExpanded(courses.find(c=>c.id===id)?.modules[0]?.id||null)};
 function openFlaggedQuestion(flag:{course_id:string|null;lesson_id:string|null;question_id:string|null}){const c=courses.find(c=>c.id===flag.course_id),l=c&&lessons(c).find(l=>l.id===flag.lesson_id);if(!c||!l){setMessage("This question is no longer available. The flag history is kept.");return}void openLesson(c,l);if(flag.question_id)requestAnimationFrame(()=>requestAnimationFrame(()=>{setShowMorePractice(true);requestAnimationFrame(()=>{const target=document.getElementById(`practice-question-${flag.question_id}`);target?.scrollIntoView({block:"center"});target?.focus({preventScroll:true})})}))}
 async function openLesson(c:Course,l:Lesson){if(db&&!isTutor){const saved=restoreAnswers(l.questions,attemptRecords,userId);setAnswers(saved.answers);setShortAnswers(saved.shortAnswers)}setCourseId(c.id);setLessonId(l.id);setLast(l.id);setEditingLesson(false);setQuestionEditor(null);setShowMorePractice(false);setPage("Lesson");if(db&&!isTutor){const {error}=await db.from("lesson_progress").upsert({student_id:userId,lesson_id:l.id,last_accessed_at:new Date().toISOString()},{onConflict:"student_id,lesson_id"});if(error)setMessage(error.message)}}
 async function load(){if(!db)return;const requestedStudentId=userId;setActivityLoadError("");const [cs,ms,ls,qs,ps,es,ss,ats]=await Promise.all([db.from("courses").select("*").order("created_at"),db.from("modules").select("*").order("position"),db.from("lessons").select("*").order("position"),fetchAllQuestions(db!),db.from("lesson_progress").select("*"),db.from("enrolments").select("*"),db.from("profiles").select("*"),fetchAllAttempts(db!)]);if(activeStudentId.current!==requestedStudentId)return;const error=[cs,ms,ls,qs,ps,es,ss,ats].find(r=>r.error)?.error;if(error){setActivityLoadError(error.message);setMessage(error.message);return}setActivityOwner(requestedStudentId);setCourses((cs.data||[]).map((c:any)=>({...c,modules:(ms.data||[]).filter((m:any)=>m.course_id===c.id).map((m:any)=>({...m,lessons:(ls.data||[]).filter((l:any)=>l.module_id===m.id).map((l:any)=>({...l,resources:l.resources||[],questions:(qs.data||[]).filter((q:any)=>q.lesson_id===l.id)}))}))})));setStudents(ss.data||[]);setEnrolments(es.data||[]);setRecords(ps.data||[]);setAttemptRecords((ats.data||[]).filter(isLessonAttempt));setReviewAttemptRecords((ats.data||[]).filter(a=>!isLessonAttempt(a)));const saved=restoreAnswers(qs.data||[],ats.data||[],userId);setAnswers(saved.answers);setShortAnswers(saved.shortAnswers);setCompleted((ps.data||[]).filter((p:any)=>p.student_id===userId&&p.completed_at).map((p:any)=>p.lesson_id));setLast((ps.data||[]).filter((p:any)=>p.student_id===userId).sort((a:any,b:any)=>String(b.last_accessed_at).localeCompare(String(a.last_accessed_at)))[0]?.lesson_id||null)}
 useEffect(()=>{if(!db)return;db.auth.getSession().then(({data})=>setSession(data.session));const {data:{subscription}}=db.auth.onAuthStateChange((_event,s)=>setSession(s));return()=>subscription.unsubscribe()},[]);
 useEffect(()=>{setActivityOwner(null);setActivityLoadError("");setAnswerSaving({});setAnswerErrors({});setAnswers({});setShortAnswers({});setAttemptRecords([]);setReviewAttemptRecords([]);setCompleted([]);setRole("student");if(!db||!session)return;db.from("profiles").select("role").eq("id",session.user.id).single().then(({data})=>{if(activeStudentId.current===userId)setRole(data?.role||"student")});load()},[session?.user?.id]);
 // Year 9 layout rollout never imports or replaces questions on login.
 // Incomplete sets remain untouched; deliberate imports remain in Content.
 // Year 10 also uses read-through layout defaults. Content imports are explicit.
 useEffect(()=>{const context=(document as any).modelContext;if(!context?.registerTool)return;const controller=new AbortController();Promise.resolve(context.registerTool({name:"open_enrolled_course",title:"Open course",description:"Open a course that is available to the current user.",inputSchema:{type:"object",properties:{courseId:{type:"string"}},required:["courseId"],additionalProperties:false},annotations:{readOnlyHint:true},execute(input:any){if(typeof input?.courseId!=="string"||!visible.some(c=>c.id===input.courseId))throw new Error("Course is unavailable");openCourse(input.courseId);return {opened:true,courseId:input.courseId}}},{signal:controller.signal})).catch(()=>{});return()=>controller.abort()},[visible]);
 async function signIn(e:React.FormEvent){e.preventDefault();if(!db)return;setMessage("");const r=signup?await db.auth.signUp({email,password,options:{data:{full_name:signupName.trim(),year_level:signupYear||null,avatar_key:signupAvatar}}}):await db.auth.signInWithPassword({email,password});setMessage(r.error?.message||(signup?"Check your email to confirm your account.":""))}
 async function save(table:string,data:any,id?:string){if(preview)return;const r=id?await db!.from(table).update(data).eq("id",id):await db!.from(table).insert(data);if(r.error)setMessage(r.error.message);else await load()}
 function updateDemo(change:(cs:Course[])=>Course[]){setCourses(cs=>change(cs))}
 async function addCourse(){const title=prompt("Course title")?.trim();if(!title)return;const description=prompt("Short description")||"";if(preview)updateDemo(cs=>[...cs,{id:crypto.randomUUID(),title,description,modules:[]}]);else await save("courses",{title,description})}
 async function editCourse(c:Course){const title=prompt("Course title",c.title);if(!title)return;const description=prompt("Description",c.description);if(description===null)return;if(preview)updateDemo(cs=>cs.map(x=>x.id===c.id?{...x,title,description}:x));else await save("courses",{title,description},c.id)}
 async function renameYear9Course(){if(!db||!isTutor||!textbookCourse)return;const {error}=await db.from("courses").update({title:textbookCourseTitle,description:textbookCourseDescription}).eq("id",textbookCourse.id);if(error){setMessage(error.message);return}await load();setMessage("Year 9 course renamed. Your chapters and lessons are unchanged.")}
 async function removeOldYear9Course(){const old=courses.find(c=>c.title==="Year 9 maths");if(!db||!isTutor||!textbookCourse||!old)return;const lessonIds=new Set(lessons(old).map(l=>l.id));const studentIds=new Set(students.filter(s=>s.role==="student").map(s=>s.id));if(enrolments.some(e=>e.course_id===old.id&&studentIds.has(e.student_id))||records.some(r=>lessonIds.has(r.lesson_id)&&studentIds.has(r.student_id))){setMessage("The older course has student enrolments or progress. Review these before removing it.");return}const {error}=await db.from("courses").delete().eq("id",old.id);if(error){setMessage(error.message);return}setCourseId(null);setPage("Courses");await load();setMessage("Older Year 9 maths course removed.")}
 async function addModule(c:Course){const title=prompt("Module title")?.trim();if(!title)return;if(preview)updateDemo(cs=>cs.map(x=>x.id===c.id?{...x,modules:[...x.modules,{id:crypto.randomUUID(),course_id:x.id,title,position:x.modules.length,lessons:[]}]}:x));else await save("modules",{course_id:c.id,title,position:c.modules.length})}
 async function editModule(m:Module){const title=prompt("Module title",m.title)?.trim();if(!title)return;if(preview)updateDemo(cs=>cs.map(c=>({...c,modules:c.modules.map(x=>x.id===m.id?{...x,title}:x)})));else await save("modules",{title},m.id)}
 async function addLesson(m:Module){const title=prompt("Lesson title")?.trim();if(!title)return;const objective=prompt("Learning objective")||"";if(preview)updateDemo(cs=>cs.map(c=>({...c,modules:c.modules.map(x=>x.id===m.id?{...x,lessons:[...x.lessons,{id:crypto.randomUUID(),module_id:m.id,title,objective,notes:"",worked_example:"",video_url:null,resources:[],position:x.lessons.length,questions:[]}]}:x)})));else await save("lessons",{module_id:m.id,title,objective,position:m.lessons.length})}
 async function createTextbookCourse(){
  if(!db||!isTutor||importing)return;
  setMessage("");setImporting("Preparing textbook course…");
  try{
   const existing=await db.from("courses").select("id").in("title",[textbookCourseTitle,"Year 9 Mathematics · Textbook sequence"]).limit(1).maybeSingle();
   if(existing.error)throw existing.error;
   let courseId=existing.data?.id;
   if(!courseId){const created=await db.from("courses").insert({title:textbookCourseTitle,description:textbookCourseDescription}).select("id").single();if(created.error||!created.data)throw created.error||new Error("Could not create the course.");courseId=created.data.id}
   for(const [chapterIndex,chapter] of textbookChapters.entries()){
    setImporting(`Setting up chapter ${chapterIndex+1} of ${textbookChapters.length}…`);
    const currentModule=await db.from("modules").select("id").eq("course_id",courseId).eq("title",chapter.title).limit(1).maybeSingle();
    if(currentModule.error)throw currentModule.error;
    let moduleId=currentModule.data?.id;
    if(!moduleId){const created=await db.from("modules").insert({course_id:courseId,title:chapter.title,position:chapterIndex}).select("id").single();if(created.error||!created.data)throw created.error||new Error(`Could not add ${chapter.title}.`);moduleId=created.data.id}
    const currentLessons=await db.from("lessons").select("id,title").eq("module_id",moduleId);
    if(currentLessons.error)throw currentLessons.error;
    const known=new Map((currentLessons.data||[]).map(l=>[l.title,l.id]));
    const wanted=[{title:`Chapter ${chapterIndex+1} overview`,objective:`See how the ideas in Chapter ${chapterIndex+1} fit together before starting the sections.`,position:0},...chapter.sections.map((section,i)=>({title:section.title,objective:`Learn and practise ${section.name.toLowerCase()}.`,position:i+1}))];
    const missing=wanted.filter(l=>!known.has(l.title)).map(l=>{const code=l.title.split(" ")[0];const sample=starterSections[code];return {module_id:moduleId,...l,notes:sample?.notes||"",worked_example:sample?.worked_example||""}});
    if(missing.length){const inserted=await db.from("lessons").insert(missing).select("id,title");if(inserted.error)throw inserted.error;for(const l of inserted.data||[])known.set(l.title,l.id)}
    for(const section of chapter.sections){const code=section.title.split(" ")[0],sample=starterSections[code],lessonId=known.get(section.title);if(!sample||!lessonId)continue;
     const currentQuestions=await db.from("questions").select("id").eq("lesson_id",lessonId).limit(1);
     if(currentQuestions.error)throw currentQuestions.error;
     if(!currentQuestions.data?.length){const added=await db.from("questions").insert(sample.questions.map((q,i)=>({lesson_id:lessonId,...q,position:i})));if(added.error)throw added.error}
    }
   }
   await load();setMessage("Year 9 course ready. Open it from Content to add chapter and section videos.");
  }catch(error){setMessage(`Could not finish the textbook course: ${error instanceof Error?error.message:"Please try again."} Use the same button to resume without replacing content.`);await load()}
  finally{setImporting("")}
 }
 async function addPilotPractice(code:"1A"|"1B"|"1C"|"1D"|"1E"|"1F"|"1G"|"1H"|"1I"|"1J"|"1K"){
  const target=code==="1A"?pilot1ALesson:code==="1B"?pilot1BLesson:code==="1C"?pilot1CLesson:code==="1D"?pilot1DLesson:code==="1E"?pilot1ELesson:code==="1F"?pilot1FLesson:code==="1G"?pilot1GLesson:code==="1H"?pilot1HLesson:code==="1I"?pilot1ILesson:code==="1J"?pilot1JLesson:pilot1KLesson;
  const questions=code==="1A"?pilot1AQuestions:code==="1B"?pilot1BQuestions:code==="1C"?pilot1CQuestions:code==="1D"?pilot1DQuestions:code==="1E"?pilot1EQuestions:code==="1F"?pilot1FQuestions:code==="1G"?pilot1GQuestions:code==="1H"?pilot1HQuestions:code==="1I"?pilot1IQuestions:code==="1J"?pilot1JQuestions:pilot1KQuestions;
  if(!db||!isTutor||!target||importing)return;
  setMessage("");setImporting(`Adding original ${code} questions…`);
  try{
   const current=await db.from("questions").select("prompt,position").eq("lesson_id",target.id);
   if(current.error)throw current.error;
   const known=new Set((current.data||[]).map(q=>q.prompt));
   const missing=questions.filter(q=>!known.has(q.prompt));
   if(missing.length){
    const start=Math.max(-1,...(current.data||[]).map(q=>q.position))+1;
    const added=await db.from("questions").insert(missing.map((q,i)=>({...q,lesson_id:target.id,position:start+i})));
    if(added.error)throw added.error;
   }
   await load();setMessage(`${code} practice ready: ${missing.length} original questions added. Open ${code} to review and edit them.`);
  }catch(error){setMessage(`Could not add all ${code} questions: ${error instanceof Error?error.message:"Please retry."}`);await load()}
  finally{setImporting("")}
 }
 async function addChapter10Practice(code:keyof typeof chapter10Practice){
  const target=chapter10Targets.find(item=>item.code===code)?.lesson;
  if(!db||!isTutor||!target||importing)return;
  setMessage("");setImporting(`Adding original ${code} questions…`);
  try{
   const current=await db.from("questions").select("prompt,position").eq("lesson_id",target.id);
   if(current.error)throw current.error;
   const known=new Set((current.data||[]).map(q=>q.prompt));
   const missing=chapter10Practice[code].filter(q=>!known.has(q.prompt)).slice(0,Math.max(0,chapter10Practice[code].length-(current.data||[]).length));
   if(missing.length){
    const start=Math.max(-1,...(current.data||[]).map(q=>q.position))+1;
    const added=await db.from("questions").insert(missing.map((q,i)=>({...q,lesson_id:target.id,position:start+i})));
    if(added.error)throw added.error;
   }
   await load();setMessage(`${code} practice ready: ${missing.length} questions added.`);
  }catch(error){setMessage(`Could not finish ${code}: ${error instanceof Error?error.message:"Please retry."}`);await load()}
  finally{setImporting("")}
 }
 async function addYear10Chapter1Practice(code:keyof typeof year10Chapter1Practice){
  const target=year10Chapter1Targets.find(item=>item.code===code)?.lesson;
  if(!db||!isTutor||!target||importing)return;
  setMessage("");setImporting(`Adding original ${code} practice…`);
  try{
   const current=await db.from("questions").select("id,prompt,options,correct_index,explanation,position").eq("lesson_id",target.id).order("position");
   if(current.error)throw current.error;
   const saved=current.data||[],knownIds=new Set(saved.map(q=>q.id)),knownPrompts=new Set(saved.map(q=>q.prompt));
   const missing=year10Chapter1Practice[code].filter(q=>!knownIds.has(q.seed_id)&&!knownPrompts.has(q.prompt)).slice(0,Math.max(0,21-saved.length));
   let safelyUpdated=0;
   for(const row of saved){
    const previous=previousYear10SeedRows[row.id],next=year10Chapter1Practice[code].find(q=>q.seed_id===row.id);
    if(!previous||!next)continue;
    if(row.prompt!==previous.prompt||stableQuestionData(row.options)!==stableQuestionData(previous.options)||row.correct_index!==previous.correct_index||row.explanation!==previous.explanation)continue;
    const updated=await db.from("questions").update({prompt:next.prompt,options:next.options,correct_index:next.correct_index,explanation:next.explanation}).eq("id",row.id).eq("lesson_id",target.id).select("id");
    if(updated.error)throw updated.error;
    safelyUpdated+=updated.data?.length||0;
   }
   if(missing.length){
    const start=Math.max(-1,...saved.map(q=>q.position))+1;
    const inserted=await db.from("questions").insert(missing.map((q,i)=>({id:q.seed_id,lesson_id:target.id,prompt:q.prompt,options:q.options,correct_index:q.correct_index,explanation:q.explanation,position:start+i})));
    if(inserted.error)throw inserted.error;
   }
   await load();setMessage(`${code} practice ready: ${missing.length} questions added; ${safelyUpdated} untouched starter questions updated. Tutor edits and progress were kept.`);
  }catch(error){setMessage(`Could not finish ${code}: ${error instanceof Error?error.message:"Please try again."}`);await load()}
  finally{setImporting("")}
 }
 async function addYear10Ch23Practice(code:string){
  const target=year10Chapter2Targets.find(item=>item.code===code)?.lesson||year10Chapter3Targets.find(item=>item.code===code)?.lesson;
  const bank=year10Chapter2Practice[code]||year10Chapter3Practice[code];
  if(!db||!isTutor||!target||!bank||importing)return;
  setMessage("");setImporting(`Adding original ${code} practice…`);
  try{
   const current=await db.from("questions").select("id,prompt,position").eq("lesson_id",target.id).order("position");
   if(current.error)throw current.error;
   const saved=current.data||[],knownIds=new Set(saved.map(q=>q.id)),knownPrompts=new Set(saved.map(q=>q.prompt));
   const missing=bank.filter(q=>!knownIds.has(q.seed_id)&&!knownPrompts.has(q.prompt)).slice(0,Math.max(0,21-saved.length));
   if(missing.length){
    const start=Math.max(-1,...saved.map(q=>q.position))+1;
    const inserted=await db.from("questions").insert(missing.map((q,i)=>{const {seed_id,...values}=q;return {...values,id:seed_id,lesson_id:target.id,position:start+i}}));
    if(inserted.error)throw inserted.error;
   }
   await load();setMessage(`${code} practice ready: ${missing.length} questions added. Existing content, tutor edits and progress were kept.`);
  }catch(error){setMessage(`Could not finish ${code}: ${error instanceof Error?error.message:"Please retry."}`);await load()}
  finally{setImporting("")}
 }
 async function addYear10Ch45Practice(code:string){
  const target=year10Chapter45Targets.find(item=>item.code===code)?.lesson;
  const bank=year10Chapter45Practice[code];
  if(!db||!isTutor||!target||!bank||importing)return;
  setMessage("");setImporting(`Adding original ${code} practice…`);
  try{
   const current=await db.from("questions").select("id,prompt,position").eq("lesson_id",target.id).order("position");
   if(current.error)throw current.error;
   const saved=current.data||[],knownIds=new Set(saved.map(q=>q.id)),knownPrompts=new Set(saved.map(q=>q.prompt));
   const missing=bank.filter(q=>!knownIds.has(q.seed_id)&&!knownPrompts.has(q.prompt)).slice(0,Math.max(0,21-saved.length));
   if(missing.length){
    const start=Math.max(-1,...saved.map(q=>q.position))+1;
    const inserted=await db.from("questions").insert(missing.map((q,i)=>{const {seed_id,...values}=q;return {...values,id:seed_id,lesson_id:target.id,position:start+i}}));
    if(inserted.error)throw inserted.error;
   }
   await load();setMessage(`${code} practice ready: ${missing.length} questions added. Existing content, tutor edits and progress were kept.`);
  }catch(error){setMessage(`Could not finish ${code}: ${error instanceof Error?error.message:"Please retry."}`);await load()}
  finally{setImporting("")}
 }
 async function addYear10Ch67Practice(code:string){
  const target=year10Chapter67Targets.find(item=>item.code===code)?.lesson;
  const bank=year10Chapter67Practice[code];
  if(!db||!isTutor||!target||!bank||importing)return;
  setMessage("");setImporting(`Adding original ${code} practice…`);
  try{
   const current=await db.from("questions").select("id,prompt,position").eq("lesson_id",target.id).order("position");
   if(current.error)throw current.error;
   const saved=current.data||[],knownIds=new Set(saved.map(q=>q.id)),knownPrompts=new Set(saved.map(q=>q.prompt));
   const missing=bank.filter(q=>!knownIds.has(q.seed_id)&&!knownPrompts.has(q.prompt)).slice(0,Math.max(0,21-saved.length));
   if(missing.length){
    const start=Math.max(-1,...saved.map(q=>q.position))+1;
    const inserted=await db.from("questions").insert(missing.map((q,i)=>{const {seed_id,...values}=q;return {...values,id:seed_id,lesson_id:target.id,position:start+i}}));
    if(inserted.error)throw inserted.error;
   }
   await load();setMessage(`${code} practice ready: ${missing.length} questions added. Existing content, tutor edits and progress were kept.`);
  }catch(error){setMessage(`Could not finish ${code}: ${error instanceof Error?error.message:"Please retry."}`);await load()}
  finally{setImporting("")}
 }
 async function addYear10Ch810Practice(code:string){
  const target=year10Chapter810Targets.find(item=>item.code===code)?.lesson;
  const bank=year10Chapter810Practice[code];
  if(!db||!isTutor||!target||!bank||importing)return;
  setMessage("");setImporting(`Adding original ${code} practice…`);
  try{
   const current=await db.from("questions").select("id,prompt,position").eq("lesson_id",target.id).order("position");
   if(current.error)throw current.error;
   const saved=current.data||[],knownIds=new Set(saved.map(q=>q.id)),knownPrompts=new Set(saved.map(q=>q.prompt));
   const missing=bank.filter(q=>!knownIds.has(q.seed_id)&&!knownPrompts.has(q.prompt)).slice(0,Math.max(0,21-saved.length));
   if(missing.length){
    const start=Math.max(-1,...saved.map(q=>q.position))+1;
    const inserted=await db.from("questions").insert(missing.map((q,i)=>{const {seed_id,...values}=q;return {...values,id:seed_id,lesson_id:target.id,position:start+i}}));
    if(inserted.error)throw inserted.error;
   }
   await load();setMessage(`${code} practice ready: ${missing.length} questions added. Existing lesson content and progress were kept.`);
  }catch(error){setMessage(`Could not finish ${code}: ${error instanceof Error?error.message:"Please retry."}`);await load()}
  finally{setImporting("")}
 }
 async function addAllYear10Ch810Practice(){
  if(!db||!isTutor||importing)return;
  const targets=year10Chapter810Targets.filter((item):item is typeof item&{lesson:Lesson}=>!!item.lesson);
  if(targets.length!==25)return;
  setMessage("");setImporting("Adding Year 10 Chapters 8–10 practice…");
  try{
   const lessonIds=targets.map(({lesson})=>lesson.id);
   const current=await db.from("questions").select("id,lesson_id,prompt,position").in("lesson_id",lessonIds).order("position");
   if(current.error)throw current.error;
   const byLesson=new Map<string,typeof current.data>();
   for(const row of current.data||[]){const rows=byLesson.get(row.lesson_id)||[];rows.push(row);byLesson.set(row.lesson_id,rows)}
   let added=0;
   for(const {code,lesson} of targets){
    const bank=year10Chapter810Practice[code],saved=byLesson.get(lesson.id)||[];
    const knownIds=new Set(saved.map(q=>q.id)),knownPrompts=new Set(saved.map(q=>q.prompt));
    const missing=bank.filter(q=>!knownIds.has(q.seed_id)&&!knownPrompts.has(q.prompt)).slice(0,Math.max(0,21-saved.length));
    if(!missing.length)continue;
    const start=Math.max(-1,...saved.map(q=>q.position))+1;
    const inserted=await db.from("questions").insert(missing.map((q,i)=>{const {seed_id,...values}=q;return {...values,id:seed_id,lesson_id:lesson.id,position:start+i}}));
    if(inserted.error)throw inserted.error;
    added+=missing.length;
   }
   await load();setMessage(`Year 10 Chapters 8–10 ready: ${added} questions added across 25 sections. Existing content, tutor edits and progress were kept.`);
  }catch(error){setMessage(`Could not finish Year 10 Chapters 8–10: ${String((error as {message?:unknown})?.message??error)}`);await load()}
  finally{setImporting("")}
 }
 async function addChapter8Practice(code:keyof typeof chapter8Practice){
  const target=chapter8Targets.find(item=>item.code===code)?.lesson;
  if(!db||!isTutor||!target||importing)return;
  setMessage("");setImporting(`Adding original ${code} questions…`);
  try{
   const current=await db.from("questions").select("prompt,position").eq("lesson_id",target.id);
   if(current.error)throw current.error;
   const known=new Set((current.data||[]).map(q=>q.prompt));
   const missing=chapter8Practice[code].filter(q=>!known.has(q.prompt)).slice(0,Math.max(0,chapter8Practice[code].length-(current.data||[]).length));
   if(missing.length){
    const start=Math.max(-1,...(current.data||[]).map(q=>q.position))+1;
    const added=await db.from("questions").insert(missing.map((q,i)=>({...q,lesson_id:target.id,position:start+i})));
    if(added.error)throw added.error;
   }
   await load();setMessage(`${code} practice ready: ${missing.length} questions added.`);
  }catch(error){setMessage(`Could not finish ${code}: ${error instanceof Error?error.message:"Please retry."}`);await load()}
  finally{setImporting("")}
 }
 async function addChapter7Practice(code:keyof typeof chapter7Practice){
  const target=chapter7Targets.find(item=>item.code===code)?.lesson;
  if(!db||!isTutor||!target||importing||chapter7ImportLocks.has(target.id))return;
  chapter7ImportLocks.add(target.id);
  setMessage("");setImporting(`Adding original ${code} questions…`);
  try{
   const current=await db.from("questions").select("id,prompt,position").eq("lesson_id",target.id).order("position");
   if(current.error)throw current.error;
   const saved=current.data||[];
   // Imported duplicates remain untouched: deleting a question can cascade-delete attempts.
   const known=new Set(saved.map(q=>q.prompt));
   const missing=chapter7Practice[code].filter(q=>!known.has(q.prompt)).slice(0,Math.max(0,21-saved.length));
   if(missing.length){
    const start=Math.max(-1,...saved.map(q=>q.position))+1;
    const added=await db.from("questions").insert(missing.map((q,i)=>({...q,lesson_id:target.id,position:start+i})));
    if(added.error)throw added.error;
   }
   await load();setMessage(`${code} practice ready: ${missing.length} questions added. Existing questions, attempts and tutor work were kept.`);
  }catch(error){setMessage(`Could not finish ${code}: ${error instanceof Error?error.message:"Please retry."}`);await load()}
  finally{chapter7ImportLocks.delete(target.id);setImporting("")}
 }
 async function addChapter4Practice(code:keyof typeof chapter4Practice){
  const target=chapter4Targets.find(item=>item.code===code)?.lesson;
  const bank=chapter4Practice[code];
  if(!db||!isTutor||!target||!bank||importing)return;
  setMessage("");setImporting(`Adding original ${code} questions…`);
  try{
   const current=await db.from("questions").select("id,prompt,position").eq("lesson_id",target.id);
   if(current.error)throw current.error;
   const saved=current.data||[],knownIds=new Set(saved.map(q=>q.id)),knownPrompts=new Set(saved.map(q=>q.prompt));
   // Prompt matching preserves 4D's two existing starters and every tutor edit.
   const missing=bank.filter(q=>!knownIds.has(q.seed_id)&&!knownPrompts.has(q.prompt)).slice(0,Math.max(0,21-saved.length));
   if(missing.length){
    const start=Math.max(-1,...saved.map(q=>q.position))+1;
    const inserted=await db.from("questions").insert(missing.map((q,i)=>({id:q.seed_id,lesson_id:target.id,prompt:q.prompt,options:q.options,correct_index:q.correct_index,explanation:q.explanation,position:start+i})));
    if(inserted.error)throw inserted.error;
   }
   await load();setMessage(`${code} practice ready: ${missing.length} questions added. Existing content, tutor changes and progress were kept.`);
  }catch(error){setMessage(`Could not finish ${code}: ${error instanceof Error?error.message:"Please retry."}`);await load()}
  finally{setImporting("")}
 }
 async function addChapter5Practice(code:keyof typeof chapter5Practice){
  const target=chapter5Targets.find(item=>item.code===code)?.lesson;
  const bank=chapter5Practice[code];
  if(!db||!isTutor||!target||!bank||importing)return;
  setMessage("");setImporting(`Adding original ${code} questions…`);
  try{
   const current=await db.from("questions").select("id,prompt,position").eq("lesson_id",target.id);
   if(current.error)throw current.error;
   const saved=current.data||[],knownIds=new Set(saved.map(q=>q.id)),knownPrompts=new Set(saved.map(q=>q.prompt));
   // Prompt matching preserves the two 5C starters and any tutor-edited row.
   const missing=bank.filter(q=>!knownIds.has(q.seed_id)&&!knownPrompts.has(q.prompt)).slice(0,Math.max(0,bank.length-saved.length));
   if(missing.length){
    const start=Math.max(-1,...saved.map(q=>q.position))+1;
    const inserted=await db.from("questions").insert(missing.map((q,i)=>({id:q.seed_id,lesson_id:target.id,prompt:q.prompt,options:q.options,correct_index:q.correct_index,explanation:q.explanation,position:start+i})));
    if(inserted.error)throw inserted.error;
   }
   await load();setMessage(`${code} practice ready: ${missing.length} questions added. Existing content, tutor changes and progress were kept.`);
  }catch(error){setMessage(`Could not finish ${code}: ${error instanceof Error?error.message:"Please retry."}`);await load()}
  finally{setImporting("")}
 }
 async function addChapter3Practice(code:string){
  const target=chapter3Targets.find(item=>item.code===code)?.lesson;
  if(!db||!isTutor||!target||importing)return;
  setMessage("");setImporting(`Adding ${code} practice…`);
  const warnings:string[]=[];
  try{
   const current=await db.from("questions").select("id,prompt,position").eq("lesson_id",target.id);
   if(current.error)throw current.error;
   const saved=current.data||[],ids=new Set(saved.map(q=>q.id)),prompts=new Set(saved.map(q=>q.prompt));
   // The two legacy 3A starters retain their IDs, positions, answers and tutor edits.
   const bank=code==="3A"&&saved.length>=2?chapter3Practice[code].slice(2):chapter3Practice[code];
   const missing=bank.filter(q=>!ids.has(q.seed_id)&&!prompts.has(q.prompt)).slice(0,Math.max(0,21-saved.length));
   if(missing.length){
    const start=Math.max(-1,...saved.map(q=>q.position))+1;
    const added=await db.from("questions").insert(missing.map(({seed_id,diagram,...values},i)=>({...values,id:seed_id,lesson_id:target.id,position:start+i})));
    if(added.error)throw added.error;
    for(const q of missing){if(!q.diagram)continue;
     const response=await fetch(q.diagram.asset);
     if(!response.ok){warnings.push("A diagram could not be opened.");continue}
     const path=`${q.seed_id}/chapter3-v1.png`;
     const uploaded=await db.storage.from("question-images").upload(path,await response.blob(),{contentType:"image/png",upsert:false});
     if(uploaded.error){warnings.push(uploaded.error.message);continue}
     const linked=await db.from("questions").update({image_path:path,image_alt:q.diagram.alt}).eq("id",q.seed_id).eq("prompt",q.prompt).is("image_path",null);
     if(linked.error)warnings.push(linked.error.message);
    }
   }
   await load();setMessage(`${code}: ${missing.length} questions added. Existing content and progress kept.${warnings.length?" Diagram upload needs attention: "+warnings.join("; "):""}`);
  }catch(error){setMessage(`Could not finish ${code}: ${error instanceof Error?error.message:"Please retry."}`);await load()}
  finally{setImporting("")}
 }
 async function addChapter2Practice(code:string){
  const target=chapter2Targets.find(item=>item.code===code)?.lesson;
  const bank=chapter2Practice[code];
  if(!db||!isTutor||!target||!bank||importing)return;
  setMessage("");setImporting(`Adding ${code} practice…`);
  try{
   const current=await db.from("questions").select("id,prompt,options,correct_index,explanation,position").eq("lesson_id",target.id);
   if(current.error)throw current.error;
   const saved=current.data||[];
   // Repair only importer-authored rows that still match their complete old
   // values. IDs and positions stay fixed, so attempts/progress remain linked;
   // rows a tutor has edited are deliberately left alone.
   const repaired=new Set<string>();
   for(const fix of chapter2Fixups.filter(item=>item.code===code)){
    const row=saved.find(q=>q.position===fix.index&&q.prompt===fix.before.prompt&&JSON.stringify(q.options)===JSON.stringify(fix.before.options)&&q.correct_index===fix.before.correct_index&&q.explanation===fix.before.explanation);
    if(!row)continue;
    const {error}=await db.from("questions").update(fix.after).eq("id",row.id);
    if(error)throw error;
    repaired.add(fix.after.prompt);
   }
   const known=new Set(saved.map(q=>q.prompt));
   for(const prompt of repaired)known.add(prompt);
   const planned=code==="2D"&&saved.length>=2?bank.slice(2):bank;
   const missing=planned.filter(q=>!known.has(q.prompt)).slice(0,Math.max(0,21-saved.length));
   if(missing.length){
    const start=Math.max(-1,...saved.map(q=>q.position))+1;
    const added=await db.from("questions").insert(missing.map((q,i)=>({...q,lesson_id:target.id,position:start+i})));
    if(added.error)throw added.error;
   }
   await load();setMessage(`${code} practice ready: ${missing.length} questions added, ${repaired.size} display fixes applied. Existing starters, tutor changes and progress were kept.`);
  }catch(error){setMessage(`Could not finish ${code}: ${error instanceof Error?error.message:"Please retry."}`);await load()}
  finally{setImporting("")}
 }
 async function addChapter9Practice(code:keyof typeof chapter9Practice){
  const target=chapter9Targets.find(item=>item.code===code)?.lesson;
  if(!db||!isTutor||!target||importing||chapter9ImportLocks.has(target.id))return;
  chapter9ImportLocks.add(target.id);
  setMessage("");setImporting(`Adding original ${code} questions…`);
  try{
   const current=await db.from("questions").select("id,prompt,position").eq("lesson_id",target.id).order("position");
   if(current.error)throw current.error;
   const saved=current.data||[];
   // Imported duplicates remain untouched: deleting a question can cascade-delete attempts.
   const known=new Set(saved.map(q=>q.prompt));
   const missing=chapter9Practice[code].filter(q=>!known.has(q.prompt)).slice(0,Math.max(0,21-saved.length));
   if(missing.length){
    const start=Math.max(-1,...saved.map(q=>q.position))+1;
    const added=await db.from("questions").insert(missing.map((q,i)=>({...q,lesson_id:target.id,position:start+i})));
    if(added.error)throw added.error;
   }
   await load();setMessage(`${code} practice ready: ${missing.length} questions added. Existing questions, attempts and tutor work were kept.`);
  }catch(error){setMessage(`Could not finish ${code}: ${error instanceof Error?error.message:"Please retry."}`);await load()}
  finally{chapter9ImportLocks.delete(target.id);setImporting("")}
 }
 async function addChapter6Practice(code:keyof typeof chapter6Practice){
  const target=chapter6Targets.find(item=>item.code===code)?.lesson;
  if(!db||!isTutor||!target||importing)return;
  setMessage("");setImporting(`Adding original ${code} questions…`);
  try{
   const current=await db.from("questions").select("prompt,position").eq("lesson_id",target.id);
   if(current.error)throw current.error;
   const known=new Set((current.data||[]).map(q=>q.prompt));
   const missing=chapter6Practice[code].filter(q=>!known.has(q.prompt)).slice(0,Math.max(0,21-(current.data||[]).length));
   if(missing.length){
    const start=Math.max(-1,...(current.data||[]).map(q=>q.position))+1;
    const added=await db.from("questions").insert(missing.map((q,i)=>({...q,lesson_id:target.id,position:start+i})));
    if(added.error)throw added.error;
   }
   await load();setMessage(`${code} practice ready: ${missing.length} questions added. Existing questions and tutor edits were kept.`);
  }catch(error){setMessage(`Could not finish ${code}: ${error instanceof Error?error.message:"Please retry."}`);await load()}
  finally{setImporting("")}
 }
 async function saveQuestion(l:Lesson,old:Q|null,values:QuestionValues,file:File|null,alt:string,remove:boolean){
  if(preview){if(file){setMessage("Image uploads require Supabase.");return false}const q={...values,id:old?.id||crypto.randomUUID()};updateDemo(cs=>cs.map(c=>({...c,modules:c.modules.map(m=>({...m,lessons:m.lessons.map(x=>x.id===l.id?{...x,questions:old?x.questions.map(item=>item.id===old.id?{...item,...values,image_path:remove?null:item.image_path,image_alt:remove?"":alt}:item):[...x.questions,q]}:x)}))})));setQuestionEditor(null);return true}
  let id=old?.id;
  if(old){const {error}=await db!.from("questions").update({...values,...(!file&&old.image_path&&!remove?{image_alt:alt}:{})}).eq("id",old.id);if(error){setMessage(error.message);return false}}
  else{const {data,error}=await db!.from("questions").insert({lesson_id:l.id,...values,position:l.questions.length}).select("id").single();if(error||!data){setMessage(error?.message||"Could not create question.");return false}id=data.id}
  if(file){const uploaded=await uploadQuestionImage({...values,id:id!,image_path:old?.image_path},file,alt);if(!uploaded){setMessage("Question text saved, but the image upload failed. Reopen this question to retry.");await load();setQuestionEditor(null);return true}}
  else if(remove&&old?.image_path)await removeQuestionImage(old);
  await load();setQuestionEditor(null);setMessage("Question saved.");return true;
 }
 async function uploadQuestionImage(q:Q,file:File,alt:string){if(!db){setMessage("Connect Supabase to upload diagrams.");return false}const types:{[key:string]:string}={"image/png":"png","image/jpeg":"jpg","image/webp":"webp"};if(!types[file.type]||!file.name.toLowerCase().match(/\.(png|jpe?g|webp)$/)){setMessage("Choose a PNG, JPEG or WebP image.");return false}if(file.size>8*1024*1024){setMessage("Question images must be 8 MB or smaller.");return false}const path=`${q.id}/${crypto.randomUUID()}.${types[file.type]}`;const uploaded=await db.storage.from("question-images").upload(path,file,{contentType:file.type,upsert:false});if(uploaded.error){setMessage(uploaded.error.message);return false}const saved=await db.from("questions").update({image_path:path,image_alt:alt}).eq("id",q.id);if(saved.error){await db.storage.from("question-images").remove([path]);setMessage(saved.error.message);return false}if(q.image_path)await db.storage.from("question-images").remove([q.image_path]);await load();setMessage("Diagram saved.");return true}
 async function updateQuestionAlt(q:Q,alt:string){if(!db)return false;const {error}=await db.from("questions").update({image_alt:alt}).eq("id",q.id);if(error){setMessage(error.message);return false}await load();return true}
 async function removeQuestionImage(q:Q){if(!db||!q.image_path)return false;const {error}=await db.from("questions").update({image_path:null,image_alt:""}).eq("id",q.id);if(error){setMessage(error.message);return false}await db.storage.from("question-images").remove([q.image_path]);await load();setMessage("Diagram removed.");return true}
 async function saveLessonImage(l:Lesson,kind:"notes"|"example",change:ImageEdit){if(!db)return !change.file;const pathKey=`${kind}_image_path` as const,altKey=`${kind}_image_alt` as const,oldPath=l[pathKey];if(change.file){const extension=change.file.type==="image/png"?"png":change.file.type==="image/jpeg"?"jpg":"webp";const path=`${l.id}/${kind}-${crypto.randomUUID()}.${extension}`;const uploaded=await db.storage.from("lesson-images").upload(path,change.file,{contentType:change.file.type,upsert:false});if(uploaded.error){setMessage(uploaded.error.message);return false}const saved=await db.from("lessons").update({[pathKey]:path,[altKey]:change.alt.trim()}).eq("id",l.id);if(saved.error){await db.storage.from("lesson-images").remove([path]);setMessage(saved.error.message);return false}if(oldPath)await db.storage.from("lesson-images").remove([oldPath]);return true}if(change.remove&&oldPath){const {error}=await db.from("lessons").update({[pathKey]:null,[altKey]:""}).eq("id",l.id);if(error){setMessage(error.message);return false}await db.storage.from("lesson-images").remove([oldPath]);return true}if(oldPath&&change.alt.trim()!==l[altKey]){const {error}=await db.from("lessons").update({[altKey]:change.alt.trim()}).eq("id",l.id);if(error){setMessage(error.message);return false}}return true}
 async function saveVideo(l:Lesson,url:string|null){if(url&&!embed(url)){setMessage("Use a valid YouTube or Vimeo video URL.");return false}if(preview){updateDemo(cs=>cs.map(c=>({...c,modules:c.modules.map(m=>({...m,lessons:m.lessons.map(x=>x.id===l.id?{...x,video_url:url}:x)}))})));return true}const {error}=await db!.from("lessons").update({video_url:url}).eq("id",l.id);if(error){setMessage(error.message);return false}await load();setMessage(url?"Video link saved.":"Video removed.");return true}
 async function uploadResource(l:Lesson,file:File){if(!db){setMessage("Connect Supabase to upload documents.");return}if(file.type!=="application/pdf"||!file.name.toLowerCase().endsWith(".pdf")){setMessage("Upload a PDF for in-portal viewing. Export other documents to PDF first.");return}if(file.size>20*1024*1024){setMessage("Files must be 20 MB or smaller.");return}setMessage("Uploading document…");const name=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");const path=`${l.id}/${crypto.randomUUID()}-${name}`;const result=await db.storage.from("lesson-resources").upload(path,file,{contentType:file.type,upsert:false});if(result.error){setMessage(result.error.message);return}const resources=[...l.resources,{title:file.name,path}];const saved=await db.from("lessons").update({resources}).eq("id",l.id);if(saved.error){await db.storage.from("lesson-resources").remove([path]);setMessage(saved.error.message);return}setMessage("Document uploaded.");await load()}
 function openResource(r:{title:string;url?:string;path?:string}){if(!r.path){setMessage("This external link cannot be protected inside the portal. Re-upload it as a PDF.");return}if(!r.path.toLowerCase().endsWith(".pdf")){setMessage("This file cannot be previewed. Upload a PDF version.");return}if(!db){setMessage("Connect Supabase to view documents.");return}setViewing({title:r.title,path:r.path})}
 async function submitAnswer(q:Q,selectedIndex:number,correct:boolean,response?:string){
  const studentId=userId,lock=`${studentId}:${q.id}`;
  if(pendingSubmissions.current.has(lock))return;
  pendingSubmissions.current.add(lock);setAnswerSaving(v=>({...v,[q.id]:true}));setAnswerErrors(v=>({...v,[q.id]:""}));
  const submissionKey=`${lock}:${JSON.stringify([selectedIndex,response??null])}`;
  try{
   let saved:any;
   if(db){
    const id=submissionIds.current.get(submissionKey)||crypto.randomUUID();submissionIds.current.set(submissionKey,id);
    saved=await savePracticeAttempt(db,{id,student_id:studentId,question_id:q.id,selected_index:selectedIndex,is_correct:correct,...(response===undefined?{}:{response_text:response})});
   }
   if(activeStudentId.current!==studentId)return;
   if(saved)setAttemptRecords(rows=>rows.some(a=>a.id===saved.id)?rows:[...rows,saved]);
   if(response===undefined)setAnswers(v=>({...v,[q.id]:selectedIndex}));
   else setShortAnswers(v=>({...v,[q.id]:{response,correct}}));
   submissionIds.current.delete(submissionKey);
  }catch(error){if(activeStudentId.current===studentId)setAnswerErrors(v=>({...v,[q.id]:`Your answer was not confirmed as saved. ${error instanceof Error?error.message:"Please try again."}`}))}
  finally{pendingSubmissions.current.delete(lock);if(activeStudentId.current===studentId)setAnswerSaving(v=>({...v,[q.id]:false}))}
 }
 async function answer(q:Q,i:number){await submitAnswer(q,i,i===q.correct_index)}
 async function answerShort(q:Q,response:string){if(!isShortAnswer(q.options))return;const correct=matchesShortAnswer(response,q.options.accepted,q.options.exact);await submitAnswer(q,correct?0:1,correct,response.trim())}
 async function saveStudentProfile(values:{full_name:string;year_level:string;avatar_key:string}){if(!db||!userId||userId==="preview-student")return;const profile=students.find(s=>s.id===userId);if(!profile||!("year_level" in profile)||!("avatar_key" in profile)){setMessage("Student profile choices need the one-time LMS analytics update in Supabase first.");return}const {error}=await db.from("profiles").update({full_name:values.full_name.trim(),year_level:values.year_level||null,avatar_key:values.avatar_key}).eq("id",userId);if(error){setMessage(error.message);return}await load();if(values.year_level){const {data:mine}=await db.from("enrolments").select("course_id").eq("student_id",userId);const courseIds=(mine||[]).map((row:any)=>row.course_id);const {data:enrolledCourses}=courseIds.length?await db.from("courses").select("id,title").in("id",courseIds):{data:[]};const matching=(enrolledCourses||[]).filter((c:any)=>courseYear(c.title)===values.year_level);if(matching.length===1){setMessage(`Profile saved. You’re enrolled in ${matching[0].title}. Any previous course enrolments and progress are kept.`);return}}setMessage(values.year_level?`Profile saved. A matching ${values.year_level} course will be added automatically when exactly one is available. Any previous course enrolments and progress are kept.`:"Profile saved. Your existing course enrolments and progress are kept.")}
 async function complete(){if(!lesson||isTutor)return;if(!canCompleteCore){setMessage(coreQuestionCount?`Answer all ${coreQuestionCount} ${practiceName} practice questions before marking this lesson complete.`:"This lesson needs standard practice questions before it can be completed.");return}const studentId=userId,completedLessonId=lesson.id;if(db){const timestamp=new Date().toISOString();const {data,error}=await db.from("lesson_progress").upsert({student_id:studentId,lesson_id:completedLessonId,completed_at:timestamp,last_accessed_at:timestamp},{onConflict:"student_id,lesson_id"}).select().single();if(activeStudentId.current!==studentId)return;if(error){setMessage(error.message);return}setRecords(rows=>[...rows.filter(row=>row.student_id!==studentId||row.lesson_id!==completedLessonId),data])}setCompleted(x=>[...new Set([...x,completedLessonId])]);setMessage("Lesson complete.")}
 async function enrol(student:string,course:string){await save("enrolments",{student_id:student,course_id:course})}
 const nav=isTutor?[["Dashboard",LayoutDashboard],["Courses",BookOpen],["Tutor Analytics",BarChart3],["Reported Problems",Flag],["Students",Users],["Content",Layers3],["Account",UserRound]]:[["Dashboard",LayoutDashboard],["Courses",BookOpen],["Progress",BarChart3],["Account",UserRound]];
 if(db&&!session)return <div className="auth"><div className="brand"><b>a.</b> arc learning</div><form className="auth-card" onSubmit={signIn}><span className="eyebrow">WELCOME</span><h1>{signup?"Create an account":"Sign in to learn"}</h1><p>Lessons, practice and progress in one place.</p>{signup&&<><label>Full name<input value={signupName} onChange={e=>setSignupName(e.target.value)} required autoComplete="name"/></label><label>Year level<select value={signupYear} onChange={e=>setSignupYear(e.target.value)} required><option value="">Choose year level</option>{[7,8,9,10,11,12].map(year=><option key={year}>Year {year}</option>)}</select></label><StudentAvatarChooser value={signupAvatar} onChange={setSignupAvatar}/></>}<label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)}/></label><Button className="w-full">{signup?"Create account":"Sign in"}</Button><button type="button" className="text-button" onClick={()=>setSignup(!signup)}>{signup?"Already have an account? Sign in":"New here? Create an account"}</button>{message&&<p role="alert" className="notice">{message}</p>}</form></div>;
 return <div className="shell"><aside className={`sidebar ${mobile?"open":""}`}><div className="brand"><b>a.</b> arc learning</div><span className="side-label">{isTutor?"TUTOR WORKSPACE":"LEARNING SPACE"}</span><nav>{nav.map(([name,Icon]:any)=><button key={name} className={page===name||name==="Courses"&&["Course","Lesson"].includes(page)?"active":""} onClick={()=>{setPage(name);setMobile(false)}}><Icon size={19}/>{name}</button>)}</nav><div className="side-foot"><span className="avatar">{isTutor?"T":"S"}</span><div><strong>{session?.user?.email?.split("@")[0]||"Preview account"}</strong><small>{isTutor?"Tutor":"Student"}</small></div></div></aside><div className="workspace"><header className="topbar"><button className="mobile-menu" onClick={()=>setMobile(!mobile)} aria-label="Toggle menu"><Menu size={22}/></button><span>{page==="Lesson"?`${course?.title} / ${lesson?.title}`:page==="Course"?course?.title:page}</span>{preview&&<div className="top-right"><span className="preview-badge">Preview mode</span><button onClick={()=>{setRole(isTutor?"student":"tutor");setPage("Dashboard")}}>View as {isTutor?"student":"tutor"}</button></div>}</header><main className="content">{message&&<div className="notice" role="alert">{message}<button onClick={()=>setMessage("")}>Dismiss</button></div>}
 {page==="Dashboard"&&!isTutor&&<><Heading eyebrow="YOUR LEARNING" title="Welcome back" description="Pick up where you left off."/><StudentNextTasks key={userId} client={db} studentId={userId} courses={visible} completed={completed} lastLessonId={last} onOpen={task=>{const c=visible.find(c=>c.id===task.course.id),l=c&&lessons(c).find(l=>l.id===task.lesson.id);if(c&&l)void openLesson(c,l)}}/>{reviewEntries.length>0&&<MistakeReview onRefreshContent={load} key={userId} client={db} studentId={userId} entries={reviewEntries} onOpenLesson={entry=>{const c=visible.find(course=>course.id===entry.courseId),l=c&&lessons(c).find(lesson=>lesson.id===entry.lesson.id);if(c&&l)void openLesson(c,l)}} onSaved={result=>setReviewAttemptRecords(rows=>rows.some(row=>row.id===result.attempt.id)?rows:[...rows,result.attempt])}/>}<section><h2>My courses</h2><div className="cards">{visible.map(c=><CourseCard key={c.id} c={c} pct={pct(c)} open={()=>openCourse(c.id)}/>)}</div></section></>}
 {page==="Dashboard"&&isTutor&&<><Heading eyebrow="TUTOR WORKSPACE" title="Overview" description="Manage lessons and follow student progress."/><div className="stats"><div><strong>{courses.length}</strong><span>Courses</span></div><div><strong>{students.filter(s=>enrolments.some(e=>e.student_id===s.id)).length}</strong><span>Enrolled students</span></div><div><strong>{courses.reduce((n,c)=>n+lessons(c).length,0)}</strong><span>Lessons</span></div></div>{db&&<FlaggedQuestions key={userId} actorId={userId} client={db} students={students} courses={courses} attempts={attemptRecords} onOpen={openFlaggedQuestion} onRefreshPractice={load}/>}<section><div className="report-dashboard-link"><div><h2>Reported problems</h2><p>Review new student reports and access their full history.</p></div><Button variant="outline" onClick={()=>setPage("Reported Problems")}>Open reports</Button></div></section><section><div className="report-dashboard-link"><div><h2>Student tasks</h2><p>The next subchapter is automatic. Add extra practice from each student’s enrolled courses.</p></div><Button variant="outline" onClick={()=>setPage("Students")}>Manage student tasks</Button></div></section><section><div className="section-head"><h2>Courses</h2><Button onClick={addCourse}><Plus size={16}/> New course</Button></div><div className="cards">{courses.map(c=><CourseCard key={c.id} c={c} pct={pct(c)} open={()=>openCourse(c.id)} admin/>)}</div></section></>}
 {page==="Courses"&&<>{isTutor&&year10Rollout.identificationIssue&&<p className="muted">{year10Rollout.identificationIssue}</p>}<Heading eyebrow={isTutor?"COURSE LIBRARY":"MY COURSES"} title="Courses" description={isTutor?"Create and organise your teaching content.":"Your enrolled learning paths."}/>{isTutor&&<Button onClick={addCourse}><Plus size={16}/> New course</Button>}<div className="cards spaced">{visible.map(c=><CourseCard key={c.id} c={c} pct={pct(c)} open={()=>openCourse(c.id)} admin={isTutor}/>)}</div></>}
 {page==="Course"&&course&&<><button className="back" onClick={()=>setPage("Courses")}><ArrowLeft size={16}/> Courses</button><div className="course-head"><Heading eyebrow="COURSE" title={course.title} description={course.description}/><div className="course-progress"><Progress value={pct(course)}/><span>{pct(course)}% complete</span></div>{isTutor&&<div className="buttons"><Button variant="outline" onClick={()=>editCourse(course)}>Edit course</Button><Button onClick={()=>addModule(course)}><Plus size={16}/> Add module</Button></div>}</div>{isTutor&&year9Rollout.courseId===course.id&&<Chapter1RolloutStatus label="Year 9" reports={year9Rollout.reports} onOpen={id=>{const target=lessons(course).find(l=>l.id===id);if(target)void openLesson(course,target)}}/>}{isTutor&&year10Rollout.courseId===course.id&&<Chapter1RolloutStatus label="Year 10" reports={year10Rollout.reports} onOpen={id=>{const target=lessons(course).find(l=>l.id===id);if(target)void openLesson(course,target)}}/>}<section><h2>Modules</h2><div className="modules">{course.modules.map((m,i)=><div className="module" key={m.id}><div className="module-header"><button className="module-top" onClick={()=>setExpanded(expanded===m.id?null:m.id)} aria-expanded={expanded===m.id}><span className="module-no">{String(i+1).padStart(2,"0")}</span><span><strong>{m.title}</strong><small>{m.lessons.length} lessons · {m.lessons.filter(l=>completed.includes(l.id)).length} complete</small></span>{expanded===m.id?<ChevronDown size={18}/>:<ChevronRight size={18}/>}</button>{isTutor&&<button className="module-edit" onClick={()=>editModule(m)}>Edit</button>}</div>{expanded===m.id&&<div className="module-lessons">{m.lessons.map((l,j)=><button key={l.id} className="lesson-row" onClick={()=>openLesson(course,l)}><span className={`status ${completed.includes(l.id)?"done":""}`}>{completed.includes(l.id)?<Check size={15}/>:String(j+1).padStart(2,"0")}</span><span>{l.title}</span><small>{isTutor?(l.video_url?"Video added":"Add video"):completed.includes(l.id)?"Completed":last===l.id?"In progress":"Lesson"}</small><ChevronRight size={16}/></button>)}{isTutor&&<button className="add-row" onClick={()=>addLesson(m)}><Plus size={16}/> Add lesson</button>}</div>}</div>)}</div>{!course.modules.length&&<div className="empty">Add a module to begin this course.</div>}</section></>}
 {page==="Lesson"&&course&&lesson&&<><button className="back" onClick={()=>openCourse(course.id)}><ArrowLeft size={16}/> {course.title}</button><div className="lesson-layout"><article><div className="lesson-heading"><Heading eyebrow={`${module?.title.toUpperCase()} · LESSON ${index+1} OF ${ordered.length}`} title={lesson.title} description={lesson.objective}/>{!isTutor&&db&&session&&visible.some(c=>c.id===course.id)&&<ReportProblemButton key={`${userId}:${lesson.id}`} client={db} lessonId={lesson.id} contextLabel={lesson.title}/>} {isTutor&&<Button variant="outline" onClick={()=>setEditingLesson(!editingLesson)}>{editingLesson?"Close editor":"Edit lesson"}</Button>}</div>
 {editingLesson&&isTutor&&<LessonEditor key={lesson.id} lesson={{...lesson,lesson_flow:lessonFlow}} practiceQuestions={lesson.questions} onCancel={()=>setEditingLesson(false)} onSave={async (values,images)=>{if(preview){if(images.notes.file||images.example.file){setMessage("Image uploads require Supabase.");return}updateDemo(cs=>cs.map(c=>({...c,modules:c.modules.map(m=>({...m,lessons:m.lessons.map(x=>x.id===lesson.id?{...x,...values}:x)}))})));setEditingLesson(false)}else{const {error}=await db!.from("lessons").update(values).eq("id",lesson.id);if(error){setMessage(error.message);return}for(const kind of ["notes","example"] as const){if(!await saveLessonImage(lesson,kind,images[kind])){await load();setMessage("Lesson text saved, but an image could not be saved. Retry in the editor.");return}}await load();setEditingLesson(false);setMessage("Lesson saved.")}}}/>}
<LessonFlow lesson={{...lesson,lesson_flow:lessonFlow}} video={lesson.video_url?embed(lesson.video_url):null} notesImage={lesson.notes_image_path?<QuestionImage client={db} bucket="lesson-images" path={lesson.notes_image_path} alt={lesson.notes_image_alt||""} tutor={false}/>:null} exampleImage={lesson.example_image_path?<QuestionImage client={db} bucket="lesson-images" path={lesson.example_image_path} alt={lesson.example_image_alt||""} tutor={false}/>:null} canEditVideo={isTutor} onSaveVideo={url=>saveVideo(lesson,url)} questionCount={isTutor?lesson.questions.length:coreQuestionCount} answeredCount={isTutor?0:coreAnsweredCount} practice={<> <div className="section-head">{isTutor&&<Button variant="outline" onClick={()=>setQuestionEditor(questionEditor==="new"?null:"new")}><Plus size={16}/> Add question</Button>}</div>{isTutor&&questionEditor==="new"&&<QuestionEditor onSave={(values,file,alt,remove)=>saveQuestion(lesson,null,values,file,alt,remove)} onCancel={()=>setQuestionEditor(null)}/>} <QuestionFlagsProvider key={`${userId}:${lesson.id}`} studentId={userId} lessonId={lesson.id} client={db} enabled={!isTutor&&!!db&&!!session&&flagCourseIds.has(course.id)&&visible.some(c=>c.id===course.id)}><LessonPracticeTemplate config={lessonFlow.template} questions={lesson.questions} help={lessonFlow.practice_help||{}} workedExampleAvailable={!!(lesson.worked_example||lesson.example_image_path)} tutor={isTutor} answered={coreAnsweredCount} coreCount={coreQuestionCount} firstUnansweredId={firstUnansweredCore?.id} showSuggested={showMorePractice} completed={completed.includes(lesson.id)} canComplete={canCompleteCore} hasNext={index<ordered.length-1} onSuggested={setShowMorePractice} onComplete={complete} onNext={()=>{void openLesson(course,ordered[index+1])}}>{lesson.questions.slice(0,isTutor||showMorePractice?undefined:8).map((q,n)=><div className="question" key={q.id} id={`practice-question-${q.id}`} tabIndex={-1}><span className="eyebrow">QUESTION {n+1}</span>{!isTutor&&db&&session&&visible.some(c=>c.id===course.id)&&<ReportProblemButton key={`${userId}:${q.id}`} client={db} lessonId={lesson.id} questionId={q.id} contextLabel={`${lesson.title} · Question ${n+1}`}/>}{isTutor&&<button className="question-edit" onClick={()=>setQuestionEditor(questionEditor===q.id?null:q.id)}>Edit question</button>}<h3><MathText text={structuredPractice?practicePrompt(q.prompt):q.prompt}/></h3>{structuredPractice&&lessonFlow.template?.reasoning_prompts[q.id]&&<p className="sign-reasoning-hint"><MathText text={lessonFlow.template.reasoning_prompts[q.id]}/></p>}{structuredPractice&&hasPracticeHelp(questionHelp(q))&&<QuestionHelp key={q.id} id={`question-help-${q.id}`} help={questionHelp(q)!}/>}<QuestionImage key={`${q.id}-${q.image_path||"empty"}`} client={db} path={q.image_path||null} alt={q.image_alt||""} tutor={false} onUpload={(file,alt)=>uploadQuestionImage(q,file,alt)} onAlt={alt=>updateQuestionAlt(q,alt)} onRemove={()=>removeQuestionImage(q)}/><>{Array.isArray(q.options)?<><div className="options">{q.options.map((o,i)=><button key={i} disabled={answers[q.id]!==undefined||isTutor||!!answerSaving[q.id]} className={answers[q.id]!==undefined&&i===q.correct_index?"correct":answers[q.id]===i?"incorrect":""} onClick={()=>answer(q,i)}><span>{"ABCD"[i]}</span><MathText text={o}/></button>)}</div>{answers[q.id]!==undefined&&<div className={`feedback ${answers[q.id]===q.correct_index?"right":"wrong"}`}><strong>{answers[q.id]===q.correct_index?"Correct":"Not quite"}</strong><p>Answer: {"ABCD"[q.correct_index]}. <MathText text={q.explanation}/></p></div>}{isTutor&&<div className="feedback right"><strong>Teaching key: {"ABCD"[q.correct_index]}</strong><p><MathText text={q.explanation}/></p></div>}</>:<ShortAnswerPractice q={q} result={shortAnswers[q.id]} tutor={isTutor} onAnswer={response=>answerShort(q,response)} onRetry={()=>setShortAnswers(a=>{const next={...a};delete next[q.id];return next})}/>}</>{isTutor&&questionEditor===q.id&&<QuestionEditor key={q.id} question={q} onSave={(values,file,alt,remove)=>saveQuestion(lesson,q,values,file,alt,remove)} onCancel={()=>setQuestionEditor(null)}/>} {answerSaving[q.id]&&<p className="answer-save-status" role="status">Saving answer…</p>}{answerErrors[q.id]&&<p className="answer-save-error" role="alert">{answerErrors[q.id]}</p>} {Array.isArray(q.options)&&answers[q.id]!==undefined&&!isTutor&&<button className="retry-question" onClick={()=>setAnswers(a=>{const next={...a};delete next[q.id];return next})}>Try again</button>}{!isTutor&&flagCourseIds.has(course.id)&&<FlagQuestionButton questionId={q.id} questionNumber={n+1}/>}</div>)}</LessonPracticeTemplate></QuestionFlagsProvider>{!lesson.questions.length&&<p className="muted">Your tutor can add practice questions here.</p>}</>} resources={lesson.resources.length||isTutor?<><div className="section-head">{isTutor&&<div className="resource-controls"><label className="upload-label">Upload PDF<input type="file" accept=".pdf,application/pdf" onChange={e=>{const f=e.target.files?.[0];if(f)uploadResource(lesson,f);e.target.value=""}} /></label></div>}</div>{lesson.resources.map((r,i)=><button type="button" key={i} onClick={()=>openResource(r)} className="resource"><FileText size={18}/>{r.title}<span>{r.path?.toLowerCase().endsWith(".pdf")?"View here":"PDF required"}</span></button>)}{!lesson.resources.length&&<p className="muted">No resources for this lesson.</p>}</>:null}/>
 <div className="lesson-actions"><Button variant="outline" disabled={index<=0} onClick={()=>openLesson(course,ordered[index-1])}>Previous lesson</Button><Button variant="outline" disabled={completed.includes(lesson.id)||isTutor||!canCompleteCore} title={!canCompleteCore&&!isTutor?`Answer all ${coreQuestionCount} ${practiceName} questions to unlock completion.`:undefined} onClick={complete}>{completed.includes(lesson.id)?"Completed ✓":"Mark complete"}</Button><Button disabled={index>=ordered.length-1} onClick={()=>openLesson(course,ordered[index+1])}>Next lesson <ChevronRight size={16}/></Button></div>{!isTutor&&!completed.includes(lesson.id)&&<p className="completion-requirement" role="status">{coreQuestionCount===0?`A tutor must add ${practiceName} practice questions before this lesson can be completed.`:canCompleteCore?`All ${practiceName} questions answered. You can mark this lesson complete.`:`Answer ${coreQuestionCount-coreAnsweredCount} more ${practiceName} question${coreQuestionCount-coreAnsweredCount===1?"":"s"} to unlock completion.`}</p>}</article><aside className="lesson-aside"><div className="sticky"><span className="eyebrow">YOUR PROGRESS</span><h3>{module?.title}</h3><Progress value={module?.lessons.length?Math.round(100*module.lessons.filter(l=>completed.includes(l.id)).length/module.lessons.length):0}/><p>{module?.lessons.filter(l=>completed.includes(l.id)).length} of {module?.lessons.length} lessons complete</p><div className="outline">{module?.lessons.map((l,i)=><button key={l.id} className={l.id===lesson.id?"selected":""} onClick={()=>openLesson(course,l)}><span>{completed.includes(l.id)?"✓":i+1}</span>{l.title}</button>)}</div></div></aside></div></>}
 {page==="Progress"&&<><Heading eyebrow="YOUR LEARNING" title="Progress" description="Your practice activity and completed lessons across all courses."/><PracticeActivity key={userId} studentId={userId} courses={visible} attempts={[...attemptRecords,...reviewAttemptRecords]} progress={records} timezone={students.find(s=>s.id===userId)?.review_timezone} loading={!!db&&activityOwner!==userId&&!activityLoadError} error={activityLoadError} onRetry={()=>void load()}/>{visible.map(c=><div className="progress-card" key={c.id}><div><h3>{c.title}</h3><p>{lessons(c).filter(l=>completed.includes(l.id)).length} of {lessons(c).length} lessons completed</p></div><strong>{pct(c)}%</strong><Progress value={pct(c)}/><Button variant="outline" onClick={()=>openCourse(c.id)}>View course</Button></div>)}</>}
 {page==="Reported Problems"&&isTutor&&db&&<ReportedProblems key={userId} client={db} onOpen={report=>{const targetCourse=courses.find(c=>c.id===report.course_id);const targetLesson=targetCourse&&lessons(targetCourse).find(l=>l.id===report.lesson_id);if(!targetCourse||!targetLesson){setMessage("The reported content is no longer available. The ticket history is preserved.");return}void openLesson(targetCourse,targetLesson);if(report.question_id)requestAnimationFrame(()=>requestAnimationFrame(()=>{const target=document.getElementById(`practice-question-${report.question_id}`);if(target){setShowMorePractice(true);requestAnimationFrame(()=>{const shown=document.getElementById(`practice-question-${report.question_id}`);shown?.scrollIntoView({block:"center"});shown?.focus({preventScroll:true})})}}))}}/>}
 {page==="Tutor Analytics"&&isTutor&&<TutorAnalytics students={students} courses={courses} enrolments={enrolments} progressRecords={records} attempts={[...attemptRecords,...reviewAttemptRecords]} client={db} tutorId={userId} onOpenQuestion={openFlaggedQuestion}/>}
 {page==="Students"&&isTutor&&<><Heading eyebrow="PEOPLE" title="Students" description="Enrol students, review progress and add extra subchapter tasks."/>{students.filter(s=>s.role==="student").map(s=><div className="student-card" key={s.id}><div className="student-name"><StudentAvatar avatarKey={s.avatar_key} name={s.full_name||s.email}/><div><strong>{s.full_name||s.email}</strong><small>{s.email}</small></div></div>{courses.map(c=>{const enrolled=enrolments.some(e=>e.student_id===s.id&&e.course_id===c.id);const done=records.filter(r=>r.student_id===s.id&&r.completed_at&&lessons(c).some(l=>l.id===r.lesson_id)).length;return <div className="student-course" key={c.id}><span>{c.title}</span>{enrolled?<span>{done} / {lessons(c).length} lessons complete</span>:<Button variant="outline" onClick={()=>enrol(s.id,c.id)}>Enrol</Button>}</div>})}<TutorStudentTasks key={`${userId}:${s.id}`} client={db} tutorId={userId} studentId={s.id} courses={courses.filter(c=>enrolments.some(e=>e.student_id===s.id&&e.course_id===c.id))} completed={records.filter(r=>r.student_id===s.id&&r.completed_at).map(r=>r.lesson_id)} lastLessonId={records.filter(r=>r.student_id===s.id).sort((a,b)=>String(b.last_accessed_at).localeCompare(String(a.last_accessed_at)))[0]?.lesson_id}/></div>)}{!students.some(s=>s.role==="student")&&<div className="empty">Students appear after they create an account.</div>}</>}
 {page==="Content"&&<><Heading eyebrow="COURSE CONTENT" title="Content" description="Open a course to edit lessons and questions."/><div className="textbook-setup"><div><span className="eyebrow">YEAR 9 MATHEMATICS</span><h2>Year 9 maths pathway</h2><p>Build maths skills across 10 chapters and 98 sections. Each chapter has an overview lesson; add videos and further practice as you teach.</p>{importing&&<p role="status" className="import-status">{importing}</p>}</div>{textbookReady&&textbookCourse?<Button variant="outline" onClick={()=>openCourse(textbookCourse.id)}>Open Year 9 course</Button>:<Button disabled={!!importing||preview} onClick={createTextbookCourse}>{importing?"Setting up…":textbookCourse?"Finish course setup":"Create Year 9 course"}</Button>}</div>{textbookCourse&&textbookCourse.title==="Year 9 Mathematics · Textbook sequence"&&<div className="course-maintenance"><p>Update the chapter-based course title and description to focus on Year 9 maths skills.</p><Button variant="outline" onClick={renameYear9Course}>Rename to {textbookCourseTitle}</Button></div>}{textbookCourse&&courses.some(c=>c.title==="Year 9 maths")&&<div className="course-maintenance"><p>The older “Year 9 maths” course is separate from the chapter-based course. Removing it will permanently remove its 10 modules and 37 lessons.</p><Button variant="outline" onClick={()=>setConfirmOldCourseRemoval(true)}>Remove older course</Button></div>}{pilot1ALesson&&!pilot1AReady&&<div className="course-maintenance"><p>Try the 1A pilot: eight core questions followed by optional varied practice. These original questions will be saved to the lesson for you to review and edit.</p><Button variant="outline" disabled={!!importing} onClick={()=>addPilotPractice("1A")}>Add 1A practice</Button></div>}{pilot1BLesson&&!pilot1BReady&&<div className="course-maintenance"><p>1B Decimals and significant figures: eight core questions, then 13 optional questions testing varied rounding, accuracy and estimation skills. Add them to review and edit in the lesson.</p><Button variant="outline" disabled={!!importing} onClick={()=>addPilotPractice("1B")}>Add 1B practice</Button></div>}{pilot1CLesson&&!pilot1CReady&&<div className="course-maintenance"><p>1C Rational numbers: eight core questions, then 13 optional questions covering number types, fractions, decimals and comparisons. Add them to review and edit in the lesson.</p><Button variant="outline" disabled={!!importing} onClick={()=>addPilotPractice("1C")}>Add 1C practice</Button></div>}{pilot1DLesson&&!pilot1DReady&&<div className="course-maintenance"><p>1D Operations with fractions: eight core questions, then 13 optional questions covering fraction arithmetic, mixed numbers and problem solving. Add them to review and edit in the lesson.</p><Button variant="outline" disabled={!!importing} onClick={()=>addPilotPractice("1D")}>Add 1D practice</Button></div>}{pilot1ELesson&&!pilot1EReady&&<div className="course-maintenance"><p>1E Ratios, rates and best buys: eight core questions, then 13 optional questions covering ratios, rates, value comparisons and reasoning. Add them to review and edit in the lesson.</p><Button variant="outline" disabled={!!importing} onClick={()=>addPilotPractice("1E")}>Add 1E practice</Button></div>}{pilot1FLesson&&!pilot1FReady&&<div className="course-maintenance"><p>1F Percentages and money: eight core questions, then 13 optional questions covering conversions, percentages, original amounts and reasoning. Add them to review and edit in the lesson.</p><Button variant="outline" disabled={!!importing} onClick={()=>addPilotPractice("1F")}>Add 1F practice</Button></div>}{pilot1GLesson&&!pilot1GReady&&<div className="course-maintenance"><p>1G Percentage increase and decrease: eight core questions, then 13 optional questions covering multipliers, changes, error, original values and repeated changes. Add them to review and edit in the lesson.</p><Button variant="outline" disabled={!!importing} onClick={()=>addPilotPractice("1G")}>Add 1G practice</Button></div>}{pilot1HLesson&&!pilot1HReady&&<div className="course-maintenance"><p>1H Profits and discounts: eight core questions, then 13 optional questions covering profit, loss, mark-ups, discounts and multi-step reasoning. Add them to review and edit in the lesson.</p><Button variant="outline" disabled={!!importing} onClick={()=>addPilotPractice("1H")}>Add 1H practice</Button></div>}{pilot1ILesson&&!pilot1IReady&&<div className="course-maintenance"><p>1I Income and taxation: eight core questions, then 13 optional questions covering wages, salaries, overtime, commission, net income and illustrative tax systems. Add them to review and edit in the lesson.</p><Button variant="outline" disabled={!!importing} onClick={()=>addPilotPractice("1I")}>Add 1I practice</Button></div>}{pilot1JLesson&&!pilot1JReady&&<div className="course-maintenance"><p>1J Simple interest: eight core questions, then 13 optional questions covering principal, rate, time, total balance and comparisons. Add them to review and edit in the lesson.</p><Button variant="outline" disabled={!!importing} onClick={()=>addPilotPractice("1J")}>Add 1J practice</Button></div>}{pilot1KLesson&&!pilot1KReady&&<div className="course-maintenance"><p>1K Compound interest: eight core questions, then 13 optional questions covering repeated growth, reverse calculations, depreciation and comparisons. Add them to review and edit in the lesson.</p><Button variant="outline" disabled={!!importing} onClick={()=>addPilotPractice("1K")}>Add 1K practice</Button></div>}{chapter5Targets.filter(({code,lesson})=>lesson&&lesson.questions.length<chapter5Practice[code].length).map(({code})=><div className="course-maintenance" key={code}><p>{code} Measurement practice: eight core questions followed by 13 optional questions. Existing questions, tutor edits and progress are preserved.</p><Button variant="outline" disabled={!!importing} onClick={()=>addChapter5Practice(code)}>Add {code} practice</Button></div>)}{chapter4Targets.filter(({lesson})=>lesson&&lesson.questions.length<21).map(({code})=><div className="course-maintenance" key={code}><p>{code} Linear relations practice: eight core questions followed by 13 optional questions. Existing questions, tutor edits and progress are preserved.</p><Button variant="outline" disabled={!!importing} onClick={()=>addChapter4Practice(code)}>Add {code} practice</Button></div>)}{chapter3Targets.filter(({lesson})=>lesson&&lesson.questions.length<21).map(({code})=><div className="course-maintenance" key={code}><p>{code}: eight core questions and 13 optional questions. Existing content and progress are kept.</p><Button variant="outline" disabled={!!importing} onClick={()=>addChapter3Practice(code)}>Add {code} practice</Button></div>)}{chapter6Targets.filter(({code,lesson})=>lesson&&lesson.questions.length<chapter6Practice[code].length).map(({code})=><div className="course-maintenance" key={code}><p>{code} Chapter 6 practice: eight core questions and 13 optional questions. Existing questions and tutor edits are kept.</p><Button variant="outline" disabled={!!importing} onClick={()=>addChapter6Practice(code)}>Add {code} practice</Button></div>)}{chapter7Targets.filter(({code,lesson})=>lesson&&lesson.questions.length<chapter7Practice[code].length).map(({code})=><div className="course-maintenance" key={code}><p>{code} Chapter 7 practice: eight core questions and 13 optional questions. Existing questions and tutor edits are kept.</p><Button variant="outline" disabled={!!importing} onClick={()=>addChapter7Practice(code)}>Add {code} practice</Button></div>)}{chapter8Targets.filter(({code,lesson})=>lesson&&lesson.questions.length<chapter8Practice[code].length).map(({code})=><div className="course-maintenance" key={code}><p>{code} Chapter 8 practice: eight core questions and 13 optional questions. Existing questions and tutor edits are kept.</p><Button variant="outline" disabled={!!importing} onClick={()=>addChapter8Practice(code)}>Add {code} practice</Button></div>)}{chapter9Targets.filter(({code,lesson})=>lesson&&lesson.questions.length<chapter9Practice[code].length).map(({code})=><div className="course-maintenance" key={code}><p>{code} Probability and statistics practice: eight core questions and 13 optional questions. Existing questions and tutor edits are kept.</p><Button variant="outline" disabled={!!importing} onClick={()=>addChapter9Practice(code)}>Add {code} practice</Button></div>)}{year10Chapter67Targets.filter(({lesson})=>lesson&&lesson.questions.length<21).map(({code})=><div className="course-maintenance" key={`year10-ch67-${code}`}><p>{code} textbook practice: eight core questions followed by 13 optional fluency, application and reasoning questions. Existing questions and tutor edits are kept.</p><Button variant="outline" disabled={!!importing} onClick={()=>addYear10Ch67Practice(code)}>Add {code} practice</Button></div>)}{year10Chapter45Targets.filter(({lesson})=>lesson&&lesson.questions.length<21).map(({code})=><div className="course-maintenance" key={`year10-ch45-${code}`}><p>{code} textbook practice: eight core questions then 13 optional fluency, application and reasoning questions. Existing questions and tutor edits are kept.</p><Button variant="outline" disabled={!!importing} onClick={()=>addYear10Ch45Practice(code)}>Add {code} practice</Button></div>)}{year10Ch23Targets.filter(({lesson})=>lesson&&lesson.questions.length<21).map(({code})=><div className="course-maintenance" key={`year10-${code}`}><p>{code} textbook practice: eight core questions followed by 13 optional fluency, application and reasoning questions. Existing questions and tutor edits are kept.</p><Button variant="outline" disabled={!!importing} onClick={()=>addYear10Ch23Practice(code)}>Add {code} practice</Button></div>)}{chapter10Targets.filter(({code,lesson})=>lesson&&lesson.questions.length<chapter10Practice[code].length).map(({code})=><div className="course-maintenance" key={code}><p>{code} Chapter 10 practice: eight core questions and 13 optional questions. Existing questions and tutor edits are kept.</p><Button variant="outline" disabled={!!importing} onClick={()=>addChapter10Practice(code)}>Add {code} practice</Button></div>)}<Button onClick={addCourse}><Plus size={16}/> New course</Button><div className="content-list spaced">{courses.map(c=><button key={c.id} onClick={()=>openCourse(c.id)}><BookOpen size={20}/><strong>{c.title}</strong><span>{c.modules.length} modules · {lessons(c).length} lessons</span><ChevronRight size={17}/></button>)}</div>{confirmOldCourseRemoval&&<div className="course-removal-confirm" role="alertdialog" aria-modal="true" aria-labelledby="remove-course-title"><div><h2 id="remove-course-title">Remove the older course?</h2><p>This permanently deletes “Year 9 maths” and its lessons. The chapter-based “{textbookCourse?.title||textbookCourseTitle}” course stays available.</p><div className="buttons"><Button variant="outline" onClick={()=>setConfirmOldCourseRemoval(false)}>Cancel</Button><Button onClick={async()=>{setConfirmOldCourseRemoval(false);await removeOldYear9Course()}}>Delete older course</Button></div></div></div>}</>}
 {page==="Account"&&<><Heading eyebrow="ACCOUNT" title="Your account"/><div className="account-card">{isTutor?<span className="avatar">T</span>:<StudentAvatar avatarKey={students.find(s=>s.id===userId)?.avatar_key} name={students.find(s=>s.id===userId)?.full_name||session?.user?.email}/>}<div><strong>{students.find(s=>s.id===userId)?.full_name||session?.user?.email||"Preview account"}</strong><p>{isTutor?"Tutor":students.find(s=>s.id===userId)?.year_level||"Student"}</p></div></div>{!isTutor&&<StudentProfileEditor key={students.find(s=>s.id===userId)?.id||"student-profile"} profile={students.find(s=>s.id===userId)} onSave={saveStudentProfile}/ >}{!isTutor&&<PracticeActivity key={userId} studentId={userId} courses={visible} attempts={[...attemptRecords,...reviewAttemptRecords]} progress={records} timezone={students.find(s=>s.id===userId)?.review_timezone} loading={!!db&&activityOwner!==userId&&!activityLoadError} error={activityLoadError} onRetry={()=>void load()}/>}{db?<Button variant="outline" onClick={()=>db.auth.signOut()}>Sign out</Button>:<p className="muted">Preview changes last only while this page is open. Connect Supabase for real accounts and saved progress.</p>}</>}
 </main></div>{viewing&&db&&<PdfViewer client={db} path={viewing.path} title={viewing.title} onClose={()=>setViewing(null)}/>}</div>
}
function Heading({eyebrow,title,description}:{eyebrow:string;title:string;description?:string}){return <div className="heading"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description&&<p>{description}</p>}</div>}
function StudentAvatarChooser({value,onChange}:{value:string;onChange:(value:string)=>void}){return <fieldset className="avatar-choice-field"><legend>Choose an avatar</legend><div className="avatar-choices">{studentAvatars.map(({key,label})=><button type="button" key={key} className={value===key?"selected":""} aria-pressed={value===key} onClick={()=>onChange(key)}><StudentAvatar avatarKey={key} name={label}/><span>{label}</span></button>)}</div></fieldset>}
function StudentProfileEditor({profile,onSave}:{profile:any;onSave:(values:{full_name:string;year_level:string;avatar_key:string})=>Promise<void>}){const [name,setName]=useState(profile?.full_name||""),[year,setYear]=useState(profile?.year_level||""),[avatar,setAvatar]=useState(profile?.avatar_key||"book"),[saving,setSaving]=useState(false);const ready=!!profile&&"year_level" in profile&&"avatar_key" in profile;return <section className="student-profile-editor"><div><span className="eyebrow">STUDENT PROFILE</span><h2>Profile details</h2><p>Choose a recognisable avatar and keep your year level up to date.</p></div><label>Full name<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name"/></label><label>Year level<select value={year} onChange={e=>setYear(e.target.value)}><option value="">Choose year level</option>{[7,8,9,10,11,12].map(n=><option key={n}>Year {n}</option>)}</select></label><StudentAvatarChooser value={avatar} onChange={setAvatar}/>{!ready&&<p className="migration-hint">Profile choices will save after the one-time LMS analytics update is applied in Supabase.</p>}<Button disabled={saving||!ready||!name.trim()} onClick={async()=>{setSaving(true);try{await onSave({full_name:name,year_level:year,avatar_key:avatar})}finally{setSaving(false)}}}>{saving?"Saving…":"Save profile"}</Button></section>}
function CourseCard({c,pct,open,admin=false}:{c:Course;pct:number;open:()=>void;admin?:boolean}){return <div className="course-card"><div className="symbol"><BookOpen size={23}/></div><span className="eyebrow">{admin?"COURSE":"MY COURSE"}</span><h3>{c.title}</h3><p>{c.description}</p><div className="card-end">{!admin&&<><div className="progress-label"><span>Progress</span><strong>{pct}%</strong></div><Progress value={pct}/></>}<button onClick={open}>{admin?"Manage course":"Continue course"}<ChevronRight size={17}/></button></div></div>}

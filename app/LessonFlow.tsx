"use client";
import {useEffect,useState} from "react";
import {BookOpen,Play,Check,FileText} from "lucide-react";
import {Button} from "@/components/ui/button";
import MathText,{MathHelp,MathTools} from "./MathText";
import {resolveLessonFlow,type Activity,type Flow} from "./lesson-template";
import LessonTemplateEditor from "./LessonTemplateEditor";
export type {Activity,Flow} from "./lesson-template";

export type LessonContent={id:string;title:string;objective:string;notes:string;worked_example:string;video_url:string|null;lesson_flow?:Flow|null;notes_image_path?:string|null;notes_image_alt?:string;example_image_path?:string|null;example_image_alt?:string};
export type ImageEdit={file:File|null;alt:string;remove:boolean};

function VideoSlot({lesson,video,canEdit,onSave}:{lesson:LessonContent;video:string|null;canEdit:boolean;onSave?:(url:string|null)=>Promise<boolean>}){
 const [url,setUrl]=useState(lesson.video_url||"");
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState("");
 const submit=async(next:string|null)=>{if(!onSave)return;setSaving(true);setError("");try{const ok=await onSave(next);if(!ok)setError("Could not save the video link. Please try again.");else setUrl(next||"")}finally{setSaving(false)}};
 return <section className="learning-card video-slot"><div className="video-slot-heading"><span className="eyebrow">VIDEO EXPLANATION</span>{video&&<span className="video-ready">Video added</span>}</div>
  {video?<div className="video"><iframe src={video} title={`${lesson.title} video`} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"/></div>:<div className="video-slot-empty"><Play size={19}/><span>{canEdit?"Add your video when it is ready.":"Your tutor will add a video explanation here."}</span></div>}
  {canEdit&&<form className="video-url-form" onSubmit={e=>{e.preventDefault();const value=url.trim();if(!value){setError("Paste a YouTube or Vimeo link.");return}try{const host=new URL(value).hostname.toLowerCase();if(!["youtube.com","www.youtube.com","m.youtube.com","youtu.be","www.youtu.be","youtube-nocookie.com","www.youtube-nocookie.com","vimeo.com","www.vimeo.com"].includes(host))throw new Error();}catch{setError("Use a YouTube or Vimeo video URL.");return}submit(value)}}><label htmlFor={`video-url-${lesson.id}`}>YouTube video URL</label><div className="video-input-row"><input id={`video-url-${lesson.id}`} type="url" placeholder="https://www.youtube.com/watch?v=…" value={url} onChange={e=>setUrl(e.target.value)} /><Button type="submit" disabled={saving}>{saving?"Saving…":"Save link"}</Button></div>{lesson.video_url&&<button type="button" className="text-button" disabled={saving} onClick={()=>submit(null)}>Remove video</button>}{error&&<p role="alert" className="video-error">{error}</p>}</form>}
 </section>
}

function Reveal({label,activity,tip}:{label:string;activity?:Activity;tip:string}){
 const [shown,setShown]=useState(false);
 if(!activity?.prompt)return null;
 return <section className="learning-card activity-card"><span className="eyebrow">{label}</span><h2><MathText text={activity.prompt}/></h2><p className="learning-hint">{tip}</p><Button variant="outline" onClick={()=>setShown(!shown)} aria-expanded={shown}>{shown?"Hide explanation":"Show explanation"}</Button>{shown&&<div className="activity-solution"><strong>Explanation</strong><p><MathText text={activity.solution||"Your tutor will add an explanation."}/></p></div>}</section>
}

export function LessonFlow({lesson,video,practice,resources,notesImage,exampleImage,canEditVideo=false,onSaveVideo,answeredCount=0,questionCount=0}:{lesson:LessonContent;video:string|null;practice:React.ReactNode;resources:React.ReactNode;notesImage?:React.ReactNode;exampleImage?:React.ReactNode;canEditVideo?:boolean;onSaveVideo?:(url:string|null)=>Promise<boolean>;answeredCount?:number;questionCount?:number}){
 const flow=lesson.lesson_flow||{};
 const structured=flow.template?.version===1&&flow.template.enabled!==false;
 const commonMistakes=flow.common_mistakes;
 const guidedVisible=!flow.template?.guided_is_common_mistakes&&flow.template?.common_mistakes_source!=="guided";
 const reviewActivity=(key:"recall"|"application"|"review")=>flow.template?.common_mistakes_source===key?undefined:flow[key];
 return <div key={lesson.id} className="learning-path">
  <div className="learning-intro"><span className="eyebrow">LEARNING GOAL</span><p><MathText text={lesson.objective||"Understand and practise this lesson's key idea."}/></p><div className="learning-route">Watch the explanation <span>→</span> Answer the questions <span>→</span> Review your answers</div></div>
  <VideoSlot key={lesson.id} lesson={lesson} video={video} canEdit={canEditVideo} onSave={onSaveVideo}/>
  <section className="learning-card practice-set"><span className="eyebrow">PRACTICE QUESTIONS</span><h2>Now try it yourself</h2><p className="learning-hint">{structured?"Watch the video, answer all eight core questions, then complete the lesson. Suggested practice is optional.":"Work out each answer before submitting. You will see an explanation after you answer."}</p>
   {(lesson.notes||lesson.worked_example||notesImage||exampleImage||(guidedVisible&&flow.guided?.prompt))&&<details className="practice-support" open={!video||undefined}><summary>Need help? Review the key ideas and worked example</summary><div className="practice-support-content">{(lesson.notes||notesImage)&&<div><h3><BookOpen size={18}/> Key ideas</h3>{lesson.notes&&<p className="lesson-text"><MathText text={lesson.notes}/></p>}{notesImage}</div>}{(lesson.worked_example||exampleImage)&&<div id={structured?"lesson-worked-example":undefined} tabIndex={structured?-1:undefined}><h3>Worked example</h3>{lesson.worked_example&&<p className="lesson-text"><MathText text={lesson.worked_example}/></p>}{exampleImage}</div>}{guidedVisible&&flow.guided?.prompt&&<Reveal label="YOUR TURN" activity={flow.guided} tip="Work through the steps yourself before revealing the explanation."/>}</div></details>}
   {(commonMistakes?.prompt||commonMistakes?.solution)&&<details className="practice-support common-mistakes"><summary>Common mistakes</summary><div className="practice-support-content">{commonMistakes.prompt&&!/^common mistakes\s*$/i.test(commonMistakes.prompt.trim())&&<p className="lesson-text"><MathText text={commonMistakes.prompt}/></p>}{commonMistakes.solution&&<p className="lesson-text"><MathText text={commonMistakes.solution}/></p>}</div></details>}
   {questionCount>0&&(!structured||canEditVideo)&&<p className="question-count" aria-live="polite">{answeredCount} of {questionCount} {structured&&!canEditVideo?"core questions":"questions"} answered</p>}{practice}
  </section>
  {(reviewActivity("recall")?.prompt||reviewActivity("application")?.prompt||reviewActivity("review")?.prompt)&&<div className="learning-followup"><span className="eyebrow">REVIEW AND EXTEND</span><Reveal label="QUICK RECALL" activity={reviewActivity("recall")} tip="Try to answer from memory before you reveal the explanation."/><Reveal label={structured?"CHALLENGE QUESTION":"APPLY THE IDEA"} activity={reviewActivity("application")} tip="Show your working on paper before checking the explanation."/><Reveal label="REMEMBER IT" activity={reviewActivity("review")} tip="Return to this prompt in a few days and try it again without your notes."/></div>}
  {resources&&<section className="learning-card"><span className="eyebrow">REFERENCE MATERIAL</span><h2><FileText size={20}/> Resources</h2>{resources}</section>}
  <div className="completion-note"><Check size={17}/><span>{structured?"Answer all eight Core Questions to unlock lesson completion. Suggested Practice is optional.":"Answer every standard question in “Now try it yourself” to unlock lesson completion. Optional practice is not required."}</span></div>
 </div>
}

function ImageField({title,value,hasImage,onChange}:{title:string;value:ImageEdit;hasImage:boolean;onChange:(next:ImageEdit)=>void}){
 const [preview,setPreview]=useState<string|null>(null);
 useEffect(()=>{if(!value.file){setPreview(null);return}const url=URL.createObjectURL(value.file);setPreview(url);return()=>URL.revokeObjectURL(url)},[value.file]);
 return <fieldset className="lesson-image-field"><legend>{title} image (optional)</legend><label>Upload PNG, JPEG or WebP<input type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" onChange={e=>onChange({...value,file:e.target.files?.[0]||null,remove:false})}/></label>{preview&&<img src={preview} alt="Selected image preview"/>}{hasImage&&!preview&&<p className="muted">This section already has an image. Choose a file to replace it.</p>}{(value.file||hasImage&&!value.remove)&&<label>Image description<input value={value.alt} onChange={e=>onChange({...value,alt:e.target.value})} placeholder="Describe the mathematical information in the diagram"/></label>}{hasImage&&<label className="remove-image"><input type="checkbox" checked={value.remove} onChange={e=>onChange({...value,remove:e.target.checked,file:e.target.checked?null:value.file})}/> Remove existing image</label>}</fieldset>;
}

export function LessonEditor({lesson,onSave,onCancel,practiceQuestions=[]}:{lesson:LessonContent;practiceQuestions?:{id:string;prompt:string}[];onSave:(v:Partial<LessonContent>,images:{notes:ImageEdit;example:ImageEdit})=>Promise<void>;onCancel:()=>void}){
 const [draft,setDraft]=useState(()=>({...lesson,lesson_flow:resolveLessonFlow({...lesson,questions:practiceQuestions})}));
 const [notesImage,setNotesImage]=useState<ImageEdit>({file:null,alt:lesson.notes_image_alt||"",remove:false}),[exampleImage,setExampleImage]=useState<ImageEdit>({file:null,alt:lesson.example_image_alt||"",remove:false}),[error,setError]=useState("");
 const [saving,setSaving]=useState(false);
 const set=(key:keyof LessonContent,value:string)=>setDraft(v=>({...v,[key]:value}));
 const setActivity=(key:"recall"|"guided"|"application"|"review"|"common_mistakes",part:keyof Activity,value:string)=>setDraft(v=>({...v,lesson_flow:{...v.lesson_flow,[key]:{...v.lesson_flow?.[key],[part]:value}}}));
 const field=(label:string,key:keyof LessonContent,multiline=false)=><div className="math-field" key={label}><label>{label}{multiline?<textarea value={String(draft[key]||"")} onChange={e=>set(key,e.target.value)} rows={5}/>:<input value={String(draft[key]||"")} onChange={e=>set(key,e.target.value)}/>}</label>{key!=="video_url"&&key!=="title"&&<><MathTools onInsert={snippet=>set(key,String(draft[key]||"")+(draft[key]?" ":"")+snippet)}/><div className="math-preview"><strong>Preview</strong><MathText text={String(draft[key]||"Your content will appear here.")}/></div></>}</div>;
 const activityField=(key:"recall"|"guided"|"application"|"review"|"common_mistakes",part:keyof Activity,label:string,rows:number)=><div className="math-field"><label>{label}<textarea rows={rows} value={draft.lesson_flow?.[key]?.[part]||""} onChange={e=>setActivity(key,part,e.target.value)}/></label><MathTools onInsert={snippet=>setActivity(key,part,(draft.lesson_flow?.[key]?.[part]||"")+snippet)}/><div className="math-preview"><strong>Preview</strong><MathText text={draft.lesson_flow?.[key]?.[part]||"Your content will appear here."}/></div></div>;
 return <form className="lesson-editor" onSubmit={async e=>{e.preventDefault();setError("");const template=draft.lesson_flow.template;if(template?.version===1&&template.enabled!==false){if(practiceQuestions.length!==21){setError("Structured practice needs 21 existing questions: 8 core and 13 suggested. Add the missing questions or disable this layout before saving.");return}if(template.help_links.some(link=>!link.label.trim()||(link.target==="question"&&!practiceQuestions.slice(0,8).some(q=>q.id===link.question_id)))){setError("Give each help shortcut a label and choose an existing core-question example, or remove the shortcut.");return}}for(const [image,hasImage] of [[notesImage,!!lesson.notes_image_path],[exampleImage,!!lesson.example_image_path]] as const){if(image.file&&(!["image/png","image/jpeg","image/webp"].includes(image.file.type)||!/(\.png|\.jpe?g|\.webp)$/i.test(image.file.name)||image.file.size>8*1024*1024)){setError("Choose a PNG, JPEG or WebP image under 8 MB.");return}if((image.file||hasImage&&!image.remove)&&!image.alt.trim()){setError("Describe each diagram for students using a screen reader.");return}}setSaving(true);try{await onSave({title:draft.title,objective:draft.objective,notes:draft.notes,worked_example:draft.worked_example,video_url:draft.video_url||null,lesson_flow:draft.lesson_flow}, {notes:notesImage,example:exampleImage})}finally{setSaving(false)}}}>
  <h2>Edit lesson</h2><p>Add a video explaining the main ideas, then add practice questions below the lesson. Notes and worked examples give students help when they need it.</p>
  {field("Lesson title","title")}{field("Learning goal","objective")}{field("YouTube or Vimeo URL (optional)","video_url")}{field("Key ideas and notes","notes",true)}{field("Worked example, including steps","worked_example",true)}
  <ImageField title="Notes" value={notesImage} hasImage={!!lesson.notes_image_path} onChange={setNotesImage}/><ImageField title="Worked example" value={exampleImage} hasImage={!!lesson.example_image_path} onChange={setExampleImage}/>
  <MathHelp/>
  {([['recall','Quick recall'],['guided','Your turn'],['common_mistakes','Common mistakes'],['application',draft.lesson_flow.template?.version===1?'Challenge question':'Apply the idea'],['review','Remember it']] as const).filter(([key])=>key!==draft.lesson_flow.template?.common_mistakes_source&&(key!=="guided"||!draft.lesson_flow.template?.guided_is_common_mistakes)).map(([key,label])=><fieldset key={key}><legend>{label}</legend>{activityField(key,'prompt','Prompt',2)}{activityField(key,'solution','Explanation',3)}</fieldset>)}
  <LessonTemplateEditor flow={draft.lesson_flow} questions={practiceQuestions} onChange={flow=>setDraft(v=>({...v,lesson_flow:flow}))}/>
  {error&&<p className="image-error" role="alert">{error}</p>}
  <div className="buttons"><Button type="submit" disabled={saving}>{saving?"Saving…":"Save lesson"}</Button><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></div>
 </form>
}

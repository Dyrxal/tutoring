"use client";
import {useRef,useState} from "react";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function NewCourseButton({onCreate}:{onCreate:(values:{title:string;description:string})=>Promise<void>}){
 const dialog=useRef<HTMLDialogElement>(null),inFlight=useRef(false);
 const [saving,setSaving]=useState(false),[error,setError]=useState("");
 return <>
  <Button onClick={()=>{setError("");dialog.current?.showModal()}} aria-haspopup="dialog"><Plus size={16}/> New course</Button>
  <dialog ref={dialog} className="report-dialog course-create-dialog" aria-labelledby="new-course-title" onCancel={event=>{if(inFlight.current)event.preventDefault()}} onClose={()=>dialog.current?.querySelector("form")?.reset()}>
   <h2 id="new-course-title">New course</h2><p className="muted">Give your course a name and a short description.</p>
   <form onSubmit={async event=>{
    event.preventDefault();if(inFlight.current)return;
    const data=new FormData(event.currentTarget),title=String(data.get("title")||"").trim(),description=String(data.get("description")||"").trim();
    if(!title){setError("Enter a course title.");return}
    inFlight.current=true;setSaving(true);setError("");
    try{await onCreate({title,description});dialog.current?.close()}
    catch(error){setError(error instanceof Error?error.message:"The course could not be created. Please try again.")}
    finally{inFlight.current=false;setSaving(false)}
   }}>
    <label htmlFor="new-course-name">Course title</label><input id="new-course-name" name="title" required autoFocus disabled={saving} placeholder="e.g. Year 9 Mathematics"/>
    <label htmlFor="new-course-description">Description (optional)</label><textarea id="new-course-description" name="description" rows={4} disabled={saving} placeholder="What will students learn?"/>
    {error&&<p className="report-error" role="alert">{error}</p>}
    <div className="report-actions"><Button type="button" variant="outline" disabled={saving} onClick={()=>dialog.current?.close()}>Cancel</Button><Button type="submit" disabled={saving}>{saving?"Creating…":"Create course"}</Button></div>
   </form>
  </dialog>
 </>;
}

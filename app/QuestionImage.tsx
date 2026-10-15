"use client";
import {useEffect,useState} from "react";
import type {SupabaseClient} from "@supabase/supabase-js";
import {ImagePlus} from "lucide-react";
import {Button} from "@/components/ui/button";

type Props={client:SupabaseClient|null;path:string|null;alt:string;tutor:boolean;bucket?:string;onUpload?:(file:File,alt:string)=>Promise<boolean>;onAlt?:(alt:string)=>Promise<boolean>;onRemove?:()=>Promise<boolean>};

export default function QuestionImage({client,path,alt,tutor,bucket="question-images",onUpload,onAlt,onRemove}:Props){
 const [imageUrl,setImageUrl]=useState<string|null>(null),[error,setError]=useState(""),[file,setFile]=useState<File|null>(null),[description,setDescription]=useState(alt),[busy,setBusy]=useState(false);
 useEffect(()=>{setDescription(alt);setFile(null)},[alt,path]);
 useEffect(()=>{let disposed=false,objectUrl:string|null=null;setImageUrl(null);if(!path||!client)return;client.storage.from(bucket).download(path).then(({data,error})=>{if(disposed)return;if(error||!data){setError("This diagram could not be opened.");return}objectUrl=URL.createObjectURL(data);setImageUrl(objectUrl);setError("")});return()=>{disposed=true;if(objectUrl)URL.revokeObjectURL(objectUrl)}},[client,path,bucket]);
 async function run(action:()=>Promise<boolean>){setBusy(true);setError("");try{const ok=await action();if(!ok)setError("Could not save the diagram. Try again.");else setFile(null)}finally{setBusy(false)}}
 return <div className="question-visual">
  {imageUrl&&<figure><img src={imageUrl} alt={alt||"Question diagram"}/>{alt&&<figcaption>{alt}</figcaption>}</figure>}
  {path&&!imageUrl&&!error&&<p className="muted">Opening diagram…</p>}
  {tutor&&<div className="question-image-editor"><label className="upload-label"><ImagePlus size={16}/>{path?"Replace diagram":"Add diagram"}<input type="file" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp" onChange={e=>setFile(e.target.files?.[0]||null)}/></label>
   {(file||path)&&<><label className="image-alt-label">Describe the diagram for students using a screen reader<input value={description} maxLength={240} placeholder="e.g. Right triangle with sides 3 cm and 4 cm" onChange={e=>setDescription(e.target.value)}/></label><div className="image-actions">{file&&onUpload&&<Button disabled={busy||!description.trim()} onClick={()=>run(()=>onUpload(file,description.trim()))}>{busy?"Saving…":"Upload diagram"}</Button>}{path&&!file&&description.trim()!==alt&&onAlt&&<Button disabled={busy||!description.trim()} variant="outline" onClick={()=>run(()=>onAlt(description.trim()))}>Save description</Button>}{path&&onRemove&&<Button disabled={busy} variant="outline" onClick={()=>run(onRemove)}>Remove diagram</Button>}</div></>}
  </div>}
  {error&&<p className="image-error" role="alert">{error}</p>}
 </div>
}

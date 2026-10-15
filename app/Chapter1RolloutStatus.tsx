"use client";
import type {RolloutReport} from "./chapter1-template-rollout";

export default function Chapter1RolloutStatus({reports,onOpen,label="Year 9"}:{reports:RolloutReport[];onOpen:(id:string)=>void;label?:string}){
 if(!reports.length)return null;
 const enabled=reports.filter(r=>r.status==="Enabled").length;
 return <details className="practice-support rollout-status">
  <summary>{label} lesson layout · {enabled}/{reports.length} lessons enabled</summary>
  <div className="practice-support-content">
   <p>Missing teaching support is listed below. Existing content and saved tutor settings are kept. Use Edit lesson to adjust the layout, help or review activities.</p>
   <ul>{reports.map(report=><li key={report.id}>
    <button type="button" className="text-button" onClick={()=>onOpen(report.id)}>{report.title}</button>
    <span>{report.status}{report.reason?` — ${report.reason}`:""}</span>
    {report.gaps.length>0&&<small>Support to add: {report.gaps.join("; ")}.</small>}
   </li>)}</ul>
  </div>
 </details>;
}

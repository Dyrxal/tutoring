type Props={letter:string;option:string;disabled:boolean;className?:string;onSelect:()=>void};

function parseRows(option:string){
 return option.split(";").map(part=>{
  const separator=part.indexOf(":");
  if(separator<0)return null;
  return {label:part.slice(0,separator).trim(),values:part.slice(separator+1).split(",").map(value=>value.trim())};
 });
}

function ValueTableGrid({option,label}:{option:string;label:string}){
 const rows=parseRows(option);
 return <span className="value-table-grid" role="table" aria-label={label}>
  {rows.map((row,index)=>row&&<span className="value-table-row" role="row" key={`${row.label}-${index}`} style={{gridTemplateColumns:`42px repeat(${row.values.length}, minmax(0, 1fr))`}}>
   <span className="value-table-cell value-table-row-label" role="cell">{row.label}</span>
   {row.values.map((value,column)=><span className="value-table-cell" role="cell" key={`${row.label}-${column}`}>{value}</span>)}
  </span>)}
 </span>;
}

export function ValueTableDisplay({option}:{option:string}){
 return <div className="value-table-display">
  <span className="value-table-display-heading">Table of values</span>
  <ValueTableGrid option={option} label="Values for x and y"/>
 </div>;
}

export default function ValueTableChoice({letter,option,disabled,className="",onSelect}:Props){
 const rows=parseRows(option);
 const accessibleValues=rows.map(row=>row?`${row.label} values ${row.values.join(", ")}`:"").join("; ");
 return <button type="button" disabled={disabled} className={`value-table-choice ${className}`} aria-label={`Option ${letter}: ${accessibleValues}`} onClick={onSelect}>
  <span className="value-table-choice-heading"><span className="value-table-choice-letter" aria-hidden="true">{letter}</span><span>Table of values</span></span>
  <ValueTableGrid option={option} label={`Option ${letter} values`}/>
 </button>;
}

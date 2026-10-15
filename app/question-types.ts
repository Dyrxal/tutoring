/** Stored in the existing questions.options JSONB column. Existing arrays stay MCQ. */
export type ShortAnswerOptions={kind:"short_answer";accepted:string[];exact?:boolean};
export type QuestionOptions=string[]|ShortAnswerOptions;

export function isShortAnswer(options:QuestionOptions):options is ShortAnswerOptions{
 return !Array.isArray(options)&&options?.kind==="short_answer"&&Array.isArray(options.accepted);
}

const normalise=(value:string)=>value.trim().replace(/[−–]/g,"-").replace(/\s+/g," ").toLowerCase();

/** Plain-number equivalence covers 0.5 and 1/2; other answers use accepted variants. */
function numeric(value:string){
 const cleaned=normalise(value).replace(/,/g,"");
 const fraction=cleaned.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
 if(fraction&&Number(fraction[2])!==0)return Number(fraction[1])/Number(fraction[2]);
 if(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(cleaned))return Number(cleaned);
 return null;
}

export function matchesShortAnswer(response:string,accepted:string[],exact=false){
 const answer=normalise(response);
 if(!answer)return false;
 return accepted.some(candidate=>{
  if(answer===normalise(candidate))return true;
  if(exact)return false;
  const value=numeric(response),expected=numeric(candidate);
  return value!==null&&expected!==null&&Math.abs(value-expected)<=1e-9*Math.max(1,Math.abs(expected));
 });
}

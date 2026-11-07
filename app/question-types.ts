/** Stored in the existing questions.options JSONB column. Existing arrays stay MCQ. */
export type ShortAnswerOptions={kind:"short_answer";accepted:string[];exact?:boolean};
export type LinearGraphSeries={label:string;points:[number,number][];style?:"solid"|"dashed"|"dotted"|"dash_dot"};
export type LinearGraphSpec={title:string;description:string;caption:string;xLabel:string;yLabel:string;xMin:number;xMax:number;xStep:number;yMin:number;yMax:number;yStep:number;series:LinearGraphSeries[]};
export type GraphChoiceOptions={kind:"graph_choice";choices:string[];graph:LinearGraphSpec};
export type QuestionOptions=string[]|ShortAnswerOptions|GraphChoiceOptions;

export function isShortAnswer(options:QuestionOptions):options is ShortAnswerOptions{
 return !Array.isArray(options)&&options?.kind==="short_answer"&&Array.isArray(options.accepted);
}

export function isGraphChoice(options:QuestionOptions):options is GraphChoiceOptions{
 return !Array.isArray(options)&&options?.kind==="graph_choice"&&Array.isArray(options.choices)&&options.choices.length===4&&!!options.graph&&Array.isArray(options.graph.series);
}

export function multipleChoiceOptions(options:QuestionOptions):string[]|null{
 return Array.isArray(options)?options:isGraphChoice(options)?options.choices:null;
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

"use client";
import katex from "katex";
import "katex/dist/katex.min.css";
import {readRadical} from "./radical-format";

/** Render Unicode roots using KaTeX's scalable radical and full vinculum. */
function plainWithMath(value:string,key:string):React.ReactNode[]{
 const result:React.ReactNode[]=[];let start=0;
 for(let i=0;i<value.length;i++){
  const root=readRadical(value,i);if(!root)continue;
  if(i>start)result.push(...plainWithFractions(value.slice(start,i),`${key}-t${start}`));
  const html=katex.renderToString(root.tex,{throwOnError:false,trust:false,output:"htmlAndMathml"});
  result.push(<span key={`${key}-r${i}`} className="auto-radical" dangerouslySetInnerHTML={{__html:html}}/>);
  start=root.end;i=root.end-1;
 }
 if(start<value.length)result.push(...plainWithFractions(value.slice(start),`${key}-t${start}`));
 return result;
}

/** Render ordinary numeric fractions as stacked maths without changing stored answers. */
function plainWithFractions(value:string,key:string):React.ReactNode[]{
 const result:React.ReactNode[]=[];
 // Leave paths and chained slash expressions alone. Support numeric fractions,
 // variable-over-number forms (x/4), and fractional coefficients (3/2x).
 const fraction=/(?<![\w./])([−-]?\d+|[A-Za-z])[ \t]*\/[ \t]*(\d+)([A-Za-z])?(?![\w/])/g;
 let start=0,match:RegExpExecArray|null;
 while((match=fraction.exec(value))!==null){
  if(match.index>start)result.push(<span key={`${key}-t${start}`}>{value.slice(start,match.index)}</span>);
  const numerator=match[1].replace("−","-");
  const suffix=match[3]||"";
  const html=katex.renderToString(`\\frac{${numerator}}{${match[2]}}${suffix}`,{throwOnError:false,trust:false,output:"htmlAndMathml"});
  result.push(<span key={`${key}-f${match.index}`} className="auto-fraction" dangerouslySetInnerHTML={{__html:html}}/>);
  start=fraction.lastIndex;
 }
 if(start<value.length)result.push(<span key={`${key}-t${start}`}>{value.slice(start)}</span>);
 return result;
}

/** Plain text with optional $inline$ and $$display$$ TeX. No arbitrary HTML. */
export default function MathText({text,className=""}:{text:string;className?:string}){
 const parts:React.ReactNode[]=[];
 // A dollar sign followed by a digit is a price (e.g. $6.40), not an
 // opening TeX delimiter. Requiring a non-space opening also avoids
 // treating separate prices in one sentence as an equation.
 const pattern=/(?<!\\)(\$\$([\s\S]+?)\$\$|\$(?![\d\s])([^$\n]+?)\$)/g;
 let start=0,match:RegExpExecArray|null;
 while((match=pattern.exec(text))!==null){
  if(match.index>start)parts.push(...plainWithMath(text.slice(start,match.index),`t${start}`));
  const display=match[2]!==undefined,source=display?match[2]:match[3];
  const html=katex.renderToString(source,{displayMode:display,throwOnError:false,trust:false,output:"htmlAndMathml",strict:"ignore"});
  parts.push(display?<span key={`m${match.index}`} className="math-display" dangerouslySetInnerHTML={{__html:html}}/>:<span key={`m${match.index}`} dangerouslySetInnerHTML={{__html:html}}/>);
  start=pattern.lastIndex;
 }
 if(start<text.length)parts.push(...plainWithMath(text.slice(start),`t${start}`));
 return <span className={`math-text ${className}`}>{parts}</span>;
}

export function MathHelp(){return <p className="math-help">Use <code>$x^2$</code> for inline maths or <code>{'$$\\frac{3}{4}$$'}</code> for a separate equation. The preview below shows how students will see it.</p>}

export function MathTools({onInsert}:{onInsert:(snippet:string)=>void}){
 return <div className="math-tools" aria-label="Insert maths notation"><button type="button" onClick={()=>onInsert("$x^2$")}>x²</button><button type="button" onClick={()=>onInsert("$\\frac{a}{b}$")}>Fraction</button><button type="button" onClick={()=>onInsert("$\\sqrt{x}$")}>√</button><button type="button" onClick={()=>onInsert("$$\\frac{a}{b} = c$$")}>Equation line</button></div>;
}

import MathText from "./MathText";
import {ValueTableDisplay} from "./ValueTableChoice";

export default function LinearRelationTablePrompt({prompt}:{prompt:string}){
 const match=prompt.match(/^A table gives x = (.+?) and y = (.+?)\.\s*(.+)$/);
 if(!match)return <h3><MathText text={prompt}/></h3>;
 const [,xValues,yValues,question]=match;
 return <div className="linear-relation-table-prompt">
  <h3><MathText text="A table gives:"/></h3>
  <ValueTableDisplay option={`x: ${xValues}; y: ${yValues}`}/>
  <h3><MathText text={question}/></h3>
 </div>;
}

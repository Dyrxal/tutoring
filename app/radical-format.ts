const superscripts:Record<string,string>={"⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9","⁻":"-","⁺":"+"};
export type Radical={end:number;tex:string};

/** Only consume the radicand: following operators, units and prose stay outside. */
export function readRadical(text:string,start:number):Radical|null{
 const symbol=text[start];
 if(!"√∛∜".includes(symbol)||!symbol)return null;
 let cursor=start+1;
 while(text[cursor]===" "||text[cursor]==="\t")cursor++;
 let value:string,end:number;
 const close:Record<string,string>={"(":")","[":"]","{":"}"};
 if(close[text[cursor]]){
  const stack=[close[text[cursor]]];let i=cursor+1;
  for(;i<text.length&&stack.length;i++){
   if(close[text[i]])stack.push(close[text[i]]);
   else if(")]}".includes(text[i])){
    if(text[i]!==stack.pop())return null;
   }
  }
  if(stack.length)return null;
  value=text.slice(cursor+1,i-1);end=i;
  // Do not turn prose inside brackets into maths or allow TeX commands.
  if(!value.trim()||!/^[\dA-Za-z\s.()+−\-×÷*/^=,√∛∜⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺\[\]{}]+$/.test(value))return null;
 }else if("√∛∜".includes(text[cursor]||" ")){
  const nested=readRadical(text,cursor);if(!nested)return null;
  value=text.slice(cursor,nested.end);end=nested.end;
 }else{
  const atom=text.slice(cursor).match(/^(?:\d+(?:\.\d+)?|[A-Za-z](?![A-Za-z]))(?:[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+|\^[−-]?\d+)?/);
  if(!atom)return null;
  value=atom[0];end=cursor+value.length;
 }
 const index=symbol==="∛"?"[3]":symbol==="∜"?"[4]":"";
 return {end,tex:`\\sqrt${index}{${radicandToTex(value)}}`};
}

function radicandToTex(value:string):string{
 let tex="",plain="";
 const flush=()=>{tex+=plain.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g,s=>`^{${[...s].map(c=>superscripts[c]).join("")}}`).replace(/−/g,"-").replace(/×/g,"\\times ").replace(/÷/g,"\\div ");plain=""};
 for(let i=0;i<value.length;){
  const root=readRadical(value,i);
  if(root){flush();tex+=root.tex;i=root.end}else{plain+=value[i];i++}
 }
 flush();return tex;
}

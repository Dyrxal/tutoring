"use client";
import {useId} from "react";
import type {LinearGraphSeries,LinearGraphSpec} from "./question-types";

const width=560,height=320,margin={top:24,right:42,bottom:46,left:56};
const styles:[string,string][]=[["#237a48",""],["#416fc4","8 5"],["#b34f16","2 5"],["#8059b2","10 4 2 4"]];
const numberLabel=(value:number)=>Number.isInteger(value)?String(value):String(Number(value.toFixed(2)));
const dash=(series:LinearGraphSeries,index:number)=>series.style?({solid:"",dashed:"8 5",dotted:"2 5",dash_dot:"10 4 2 4"}[series.style]):styles[index%styles.length][1];

export default function LinearGraph({graph}:{graph:LinearGraphSpec}){
 const id=`linear-graph-${useId().replace(/[^a-zA-Z0-9_-]/g,"")}`;
 const plotWidth=width-margin.left-margin.right,plotHeight=height-margin.top-margin.bottom;
 const x=(value:number)=>margin.left+(value-graph.xMin)/(graph.xMax-graph.xMin)*plotWidth;
 const y=(value:number)=>margin.top+(graph.yMax-value)/(graph.yMax-graph.yMin)*plotHeight;
 const tickValues=(min:number,max:number,step:number)=>{
  if(!Number.isFinite(step)||step<=0)return [];
  const count=Math.min(100,Math.floor((max-min)/step+1e-8));
  return Array.from({length:count+1},(_,i)=>Number((min+i*step).toFixed(8)));
 };
 const xTicks=tickValues(graph.xMin,graph.xMax,graph.xStep),yTicks=tickValues(graph.yMin,graph.yMax,graph.yStep);
 const axisX=graph.xMin<=0&&graph.xMax>=0?x(0):margin.left;
 const axisY=graph.yMin<=0&&graph.yMax>=0?y(0):margin.top+plotHeight;
 return <figure className="linear-graph">
  <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title ${id}-description`}>
   <title id={`${id}-title`}>{graph.title}</title><desc id={`${id}-description`}>{graph.description}</desc>
   {xTicks.map(tick=><g key={`x-${tick}`}><line x1={x(tick)} y1={margin.top} x2={x(tick)} y2={margin.top+plotHeight} className="linear-graph-grid"/><text x={x(tick)} y={axisY+18} textAnchor="middle" className="linear-graph-tick">{numberLabel(tick)}</text></g>)}
   {yTicks.map(tick=><g key={`y-${tick}`}><line x1={margin.left} y1={y(tick)} x2={margin.left+plotWidth} y2={y(tick)} className="linear-graph-grid"/><text x={axisX-9} y={y(tick)+4} textAnchor="end" className="linear-graph-tick">{numberLabel(tick)}</text></g>)}
   <line x1={axisX} y1={margin.top} x2={axisX} y2={margin.top+plotHeight} className="linear-graph-axis"/>
   <line x1={margin.left} y1={axisY} x2={margin.left+plotWidth} y2={axisY} className="linear-graph-axis"/>
   {graph.series.map((series,index)=>{
    const points=series.points.filter(point=>point.every(Number.isFinite));
    const path=points.map((point,i)=>`${i?"L":"M"}${x(point[0]).toFixed(2)},${y(point[1]).toFixed(2)}`).join(" ");
    const end=points[points.length-1];
    return <g key={`${series.label}-${index}`}>
     <path d={path} fill="none" stroke={styles[index%styles.length][0]} strokeDasharray={dash(series,index)} strokeWidth="3" strokeLinecap="round"/>
     {points.map((point,i)=><circle key={i} cx={x(point[0])} cy={y(point[1])} r="3.5" fill="white" stroke={styles[index%styles.length][0]} strokeWidth="2"/>)}
     {end&&<text x={Math.min(width-22,x(end[0])+7)} y={Math.max(margin.top+11,Math.min(height-margin.bottom-2,y(end[1])-7))} className="linear-graph-series-label" fill={styles[index%styles.length][0]}>{series.label}</text>}
    </g>;
   })}
   <text x={margin.left+plotWidth/2} y={height-8} textAnchor="middle" className="linear-graph-label">{graph.xLabel}</text>
   <text transform={`translate(15 ${margin.top+plotHeight/2}) rotate(-90)`} textAnchor="middle" className="linear-graph-label">{graph.yLabel}</text>
  </svg>
  <figcaption>{graph.caption}</figcaption>
  <details className="linear-graph-data"><summary>Read the plotted points</summary><ul>{graph.series.map((series,index)=><li key={`${series.label}-${index}`}><strong>{series.label}:</strong> {series.points.map(([px,py])=>`(${numberLabel(px)}, ${numberLabel(py)})`).join("; ")}</li>)}</ul></details>
 </figure>;
}

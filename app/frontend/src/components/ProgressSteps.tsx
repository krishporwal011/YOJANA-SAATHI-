"use client";
import React from "react";
type StepKey = "profile" | "confirm" | "results" | "documents";
interface Props { current: StepKey; inHero?: boolean; }
const STEPS = [
 {key:"profile",title:"Profile",subtitle:"Tell us about yourself"},
 {key:"confirm",title:"Confirm",subtitle:"Review your details"},
 {key:"results",title:"Results",subtitle:"See matching schemes"},
 {key:"documents",title:"Documents",subtitle:"Steps & documents"},
] as const;
export const ProgressSteps: React.FC<Props> = ({current}) => {
 const currentIndex = STEPS.findIndex(s=>s.key===current);
 return <nav className="stepper" aria-label="Application progress">
   {STEPS.map((s,i)=><React.Fragment key={s.key}>
     <div className={`step ${i===currentIndex?"active":""} ${i<currentIndex?"done":""}`}>
       <div className="step-number">{i<currentIndex?"✓":String(i+1).padStart(2,"0")}</div>
       <div><strong>{s.title}</strong><span>{s.subtitle}</span></div>
     </div>
     {i<STEPS.length-1 && <div className={`step-line ${i<currentIndex?"done":""}`}/>} 
   </React.Fragment>)}
 </nav>;
};
export default ProgressSteps;

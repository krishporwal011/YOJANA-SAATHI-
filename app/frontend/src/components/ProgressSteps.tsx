"use client";

import React from "react";

type StepKey = "profile" | "confirm" | "results" | "documents";

interface Props {
  current: StepKey;
  inHero?: boolean;
}

const STEPS: { key: StepKey; title: string; subtitle: string }[] = [
  { key: "profile", title: "Profile", subtitle: "Tell us about yourself" },
  { key: "confirm", title: "Confirm", subtitle: "Review your details" },
  { key: "results", title: "Results", subtitle: "See matching schemes" },
  { key: "documents", title: "Documents", subtitle: "Steps & documents" },
];

export const ProgressSteps: React.FC<Props> = ({ current, inHero = false }) => {
  return (
    <nav className="max-w-[1200px] mx-auto px-4 md:px-0 mb-6">
      <div className={`relative p-2 flex flex-col md:flex-row items-stretch gap-3`}>
        {/* subtle connector line for desktop */}
        <div className="hidden md:block absolute left-10 right-10 top-1/2 h-[2px] bg-slate-200/20 -z-0" />
        {STEPS.map((s, idx) => {
          const active = s.key === current;
          return (
            <div key={s.key} className={`flex-1 flex items-start gap-3 p-3 rounded-md relative ${active ? "bg-white shadow-sm border border-slate-200 z-10" : "bg-transparent"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${active ? "bg-yojana-navy text-white shadow" : "bg-white text-slate-700 border border-slate-200"}`}>{idx + 1}</div>
              <div>
                <div className={`text-sm ${active ? (inHero ? "text-white font-semibold" : "text-slate-900 font-semibold") : (inHero ? "text-yojana-light/90" : "text-slate-600")}`}>{s.title}</div>
                <div className={`text-xs ${inHero ? 'text-yojana-light/70' : 'text-slate-500'}`}>{s.subtitle}</div>
              </div>
              {active && (
                <div className="hidden md:block absolute -bottom-3 left-4 right-4 h-2 bg-gradient-to-r from-yojana-navy to-yojana-accent rounded-b-md" />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default ProgressSteps;

"use client";

import React from "react";

type StepKey = "profile" | "confirm" | "results" | "documents";

interface Props {
  current: StepKey;
}

const STEPS: { key: StepKey; title: string; subtitle: string }[] = [
  { key: "profile", title: "Profile", subtitle: "Tell us about yourself" },
  { key: "confirm", title: "Confirm", subtitle: "Review your details" },
  { key: "results", title: "Results", subtitle: "See matching schemes" },
  { key: "documents", title: "Documents", subtitle: "Steps & documents" },
];

export const ProgressSteps: React.FC<Props> = ({ current }) => {
  return (
    <nav className="max-w-[1200px] mx-auto px-4 md:px-0 mb-6">
      <div className="bg-yojana-light rounded-lg p-4 flex flex-col md:flex-row items-stretch gap-3">
        {STEPS.map((s, idx) => {
          const active = s.key === current;
          return (
            <div key={s.key} className={`flex-1 flex items-start gap-3 p-3 rounded-md ${active ? "bg-white shadow-sm border border-slate-200" : "bg-transparent"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${active ? "bg-yojana-navy text-white" : "bg-white text-slate-700 border border-slate-200"}`}>{idx + 1}</div>
              <div>
                <div className={`text-sm ${active ? "text-slate-900 font-semibold" : "text-slate-600"}`}>{s.title}</div>
                <div className="text-xs text-slate-500">{s.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default ProgressSteps;

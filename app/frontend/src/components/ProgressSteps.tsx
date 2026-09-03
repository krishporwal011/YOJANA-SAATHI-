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

export const ProgressSteps: React.FC<Props> = ({
  current,
  inHero = false,
}) => {
  return (
    <nav className="max-w-[1200px] mx-auto px-4 md:px-0 mb-6">
      <div className="relative p-2 flex flex-col md:flex-row items-stretch gap-3">

        {STEPS.map((s, idx) => {
          const active = s.key === current;

          return (
            <div
              key={s.key}
              className="flex-1 flex items-start gap-3 p-3 relative bg-transparent"
            >
              {/* Step number */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  active
                    ? "bg-yojana-navy text-white shadow"
                    : "bg-transparent text-white border-2 border-slate-500"
                }`}
              >
                {idx + 1}
              </div>

              {/* Step text */}
              <div>
                <div
                  className={`text-sm ${
                    active
                      ? "text-white font-semibold"
                      : "text-white/90"
                  }`}
                >
                  {s.title}
                </div>

                <div
                  className={`text-xs ${
                    inHero
                      ? "text-yojana-light/70"
                      : "text-slate-300"
                  }`}
                >
                  {s.subtitle}
                </div>
              </div>

              {/* Active step underline ONLY */}
              {active && (
                <div className="hidden md:block absolute -bottom-3 left-4 right-4 h-[3px] bg-gradient-to-r from-yojana-navy to-yojana-accent rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default ProgressSteps;
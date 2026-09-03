"use client";

import React from "react";

export type SchemeStatus = "MATCH" | "NEEDS_VERIFICATION" | "NOT_MATCHED";

export interface Scheme {
  id: string;
  name: string;
  ministry: string;
  status: SchemeStatus;
  short_description: string;
  why: string[];
  documents?: { name: string; required: boolean }[];
  application_url?: string;
}

interface Props {
  scheme: Scheme;
  onViewDocuments: (s: Scheme) => void;
}

const statusColor = (s: SchemeStatus) => {
  if (s === "MATCH") return "bg-emerald-100 text-emerald-800";
  if (s === "NEEDS_VERIFICATION") return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
};

export const SchemeCard: React.FC<Props> = ({ scheme, onViewDocuments }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-full min-h-[300px]">
      <div className="flex items-start justify-between gap-3">
        <div className="pr-2">
          <div className="text-base font-semibold text-slate-900">{scheme.name}</div>
          <div className="text-xs text-slate-400 mt-1">{scheme.ministry}</div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusColor(scheme.status)}`}>{scheme.status.replaceAll("_", " ")}</div>
      </div>

      <p className="text-sm text-slate-600 mt-3">{scheme.short_description}</p>

      <div className="mt-3 text-sm text-slate-700 flex-1">
        <div className="font-semibold text-slate-800 mb-2">Why this result?</div>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {scheme.why.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex items-center justify-start gap-3">
        <button onClick={() => onViewDocuments(scheme)} className="px-3.5 py-2 rounded-md border border-slate-300 text-slate-700 text-sm bg-white">View documents</button>
        <a href={scheme.application_url || "#"} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-md bg-yojana-navy text-white text-sm">Apply on portal</a>
      </div>
    </div>
  );
};

export default SchemeCard;

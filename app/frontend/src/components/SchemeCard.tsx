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
  if (s === "MATCH") return "bg-yojana-success/20 text-yojana-success";
  if (s === "NEEDS_VERIFICATION") return "bg-yojana-warn/20 text-yojana-warn";
  return "bg-yojana-danger/20 text-yojana-danger";
};

export const SchemeCard: React.FC<Props> = ({ scheme, onViewDocuments }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[320px]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 pr-2">
          <div className="w-10 h-10 rounded-full bg-yojana-light flex items-center justify-center border border-yojana-navy/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#0B3B7A" strokeWidth="0.5" fill="transparent"/></svg>
          </div>
          <div>
            <div className="text-base font-semibold text-slate-900">{scheme.name}</div>
            <div className="text-xs text-slate-400 mt-1">{scheme.ministry}</div>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${statusColor(scheme.status)}`}>{scheme.status.replaceAll("_", " ")}</div>
      </div>

      <p className="text-sm text-slate-600 mt-4">{scheme.short_description}</p>

      <div className="mt-4 text-sm text-slate-700 flex-1">
        <div className="font-semibold text-slate-800 mb-2">Why this result?</div>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {scheme.why.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <button onClick={() => onViewDocuments(scheme)} className="px-3.5 py-2 rounded-md border border-slate-200 text-slate-700 text-sm bg-white">View documents</button>
        <a href={scheme.application_url || "#"} target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-md bg-gradient-to-r from-yojana-navy to-yojana-accent text-white text-sm shadow-sm hover:brightness-105">Apply on portal</a>
      </div>
    </div>
  );
};

export default SchemeCard;

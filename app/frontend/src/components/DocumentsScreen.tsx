"use client";

import React from "react";
import { Scheme } from "./SchemeCard";

interface Props {
  scheme: Scheme;
  onBack: () => void;
}

export const DocumentsScreen: React.FC<Props> = ({ scheme, onBack }) => {
  return (
    <div className="w-[85%] max-w-[1100px] mx-auto bg-white border border-slate-200 rounded-2xl shadow p-8">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold">{scheme.name}</h3>
          <div className="text-sm text-slate-600">{scheme.ministry}</div>
        </div>
        <div className="text-sm text-slate-500">Status: <span className="font-semibold">{scheme.status.replaceAll("_", " ")}</span></div>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold">Required documents</h4>
        <ul className="mt-3 space-y-3">
          {scheme.documents?.map((d, i) => (
            <li key={i} className="flex items-center justify-between border p-3 rounded-md">
              <div>
                <div className="font-medium">{d.name}</div>
                <div className="text-xs text-slate-500">{d.required ? "Required" : "Optional"}</div>
              </div>
              <div className={`text-sm font-semibold ${d.required ? "text-amber-600" : "text-emerald-600"}`}>{d.required ? "Missing" : "Available"}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold">Roadmap</h4>
        <ol className="mt-2 list-decimal pl-5 space-y-1 text-sm text-slate-700">
          <li>Get your income certificate</li>
          <li>Keep your required documents ready</li>
          <li>Review the scheme information</li>
          <li>Apply on the official portal</li>
        </ol>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button onClick={onBack} className="px-3 py-2 rounded-md border">Back to results</button>
        <div className="text-right">
          <a href={scheme.application_url || "#"} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-yojana-navy text-white rounded-md">Apply on official portal</a>
          <div className="text-xs text-slate-500 mt-2">Yojana Saathi does not submit applications on your behalf. You will be redirected to the official government portal.</div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsScreen;

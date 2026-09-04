"use client";

import React from "react";
import { Scheme } from "./SchemeCard";
import BackButton from "./BackButton";
import { FileCheck2, ExternalLink } from "lucide-react";

interface Props {
  scheme: Scheme;
  onBack: () => void;
}

export const DocumentsScreen: React.FC<Props> = ({ scheme, onBack }) => {
  return (
    <div className="w-[85%] max-w-[1100px] mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl p-8 my-6">
      <div className="mb-4">
        <BackButton onClick={onBack} label="Back to Results" />
      </div>

      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">{scheme.name}</h3>
          <div className="text-xs text-slate-500 mt-0.5">{scheme.ministry}</div>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
          Status: {scheme.status.replaceAll("_", " ")}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
          <FileCheck2 className="w-4 h-4 text-blue-600" />
          <span>Required Document Checklist for Application</span>
        </h4>
        <ul className="space-y-2.5">
          {scheme.documents?.map((d, i) => (
            <li key={i} className="flex items-center justify-between border border-slate-200 p-3.5 rounded-xl bg-slate-50">
              <div>
                <div className="font-bold text-xs text-slate-800 capitalize">{d.name}</div>
                <div className="text-[11px] text-slate-500">{d.required ? "Mandatory for government verification" : "Optional supporting document"}</div>
              </div>
              <div className={`text-xs font-bold ${d.required ? "text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md" : "text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md"}`}>
                {d.required ? "Needed" : "Available"}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 p-5 bg-blue-50/60 border border-blue-100 rounded-2xl">
        <h4 className="font-bold text-xs text-blue-900 mb-2">Application Roadmap</h4>
        <ol className="list-decimal pl-5 space-y-1.5 text-xs text-blue-950 leading-relaxed font-medium">
          <li>Ensure all mandatory documents listed above are ready.</li>
          <li>Click the button below to visit the official government portal.</li>
          <li>Submit your application directly on the official portal.</li>
        </ol>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <BackButton onClick={onBack} label="Back to Results" />
        
        <div className="text-right">
          <a
            href={scheme.application_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-gradient-to-r from-navy to-blue text-white rounded-xl text-xs font-bold shadow hover:brightness-110 transition inline-flex items-center gap-1.5"
          >
            <span>Apply on Official Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <div className="text-[10px] text-slate-400 mt-2">
            Yojana Saathi does not collect fees or submit applications directly. You will open the official portal.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsScreen;

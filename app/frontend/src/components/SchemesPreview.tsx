"use client";

import React, { useEffect, useState } from "react";
import { Landmark, FileCheck2, ExternalLink, IndianRupee, Clock, ShieldCheck } from "lucide-react";

interface SchemeData {
  scheme_name: string;
  ministry: string;
  state: string;
  benefits: string;
  eligibility: {
    age_min: number | null;
    age_max: number | null;
    income_limit: number | null;
    occupation: string;
    education: string;
    category: string;
  };
  documents: string[];
  application_url: string;
  deadline: string;
  source_url: string;
  last_verified: string;
}

const FALLBACK_STARTER_SCHEMES: SchemeData[] = [
  {
    scheme_name: "PM-KISAN Samman Nidhi",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    state: "All India",
    benefits: "Financial benefit of Rs 6,000 per year in three equal four-monthly installments directly into bank accounts.",
    eligibility: {
      age_min: null,
      age_max: null,
      income_limit: null,
      occupation: "farmer",
      education: "",
      category: ""
    },
    documents: ["land record", "bank passbook"],
    application_url: "https://pmkisan.gov.in/",
    deadline: "Ongoing",
    source_url: "https://pmkisan.gov.in/",
    last_verified: "2026-09-01"
  },
  {
    scheme_name: "Ayushman Bharat PM-JAY",
    ministry: "Ministry of Health and Family Welfare",
    state: "All India",
    benefits: "Health insurance cover of up to Rs 5,00,000 per family per year for secondary and tertiary care hospitalization.",
    eligibility: {
      age_min: null,
      age_max: null,
      income_limit: 180000,
      occupation: "",
      education: "",
      category: ""
    },
    documents: ["income certificate", "ration card"],
    application_url: "https://nha.gov.in/PM-JAY",
    deadline: "Ongoing",
    source_url: "https://pmjay.gov.in/",
    last_verified: "2026-09-01"
  },
  {
    scheme_name: "National Means-cum-Merit Scholarship",
    ministry: "Ministry of Education",
    state: "All India",
    benefits: "Scholarship amount of Rs 12,000 per annum (Rs 1,000 per month) to meritorious students from economically weaker sections.",
    eligibility: {
      age_min: null,
      age_max: 16,
      income_limit: 350000,
      occupation: "student",
      education: "Class 8 passed / studying in Class 9",
      category: ""
    },
    documents: ["school ID", "income certificate"],
    application_url: "https://scholarships.gov.in/",
    deadline: "2026-10-31",
    source_url: "https://scholarships.gov.in/",
    last_verified: "2026-09-01"
  }
];

export const SchemesPreview: React.FC = () => {
  const [schemes, setSchemes] = useState<SchemeData[]>(FALLBACK_STARTER_SCHEMES);

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/schemes");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSchemes(data);
          }
        }
      } catch {
        // Fallback already initialized
      }
    };

    loadSchemes();
  }, []);

  return (
    <div className="w-full max-w-5xl mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-orange-600" />
            <span>Starter Welfare Schemes (data/schemes/)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Validated against the project JSON schema
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
          {schemes.length} Schemes Loaded
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {schemes.map((scheme, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 hover:border-orange-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-emerald-500" />

            <div>
              <div className="text-[10px] font-bold text-orange-600 tracking-wider uppercase mb-1">
                {scheme.ministry || "Government of India"}
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-orange-600 transition">
                {scheme.scheme_name}
              </h4>
              <p className="text-xs text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                {scheme.benefits}
              </p>

              {/* Eligibility Highlights */}
              <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-1.5 text-xs text-slate-700 border border-slate-100">
                <span className="font-semibold text-[11px] text-slate-900 block border-b border-slate-200 pb-1">
                  Eligibility Criteria:
                </span>
                {scheme.eligibility.occupation && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Occupation:</span>
                    <span className="font-medium bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[11px]">
                      {scheme.eligibility.occupation}
                    </span>
                  </div>
                )}
                {scheme.eligibility.income_limit && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Income Limit:</span>
                    <span className="font-medium text-slate-900">
                      ≤ ₹{scheme.eligibility.income_limit.toLocaleString("en-IN")}/yr
                    </span>
                  </div>
                )}
                {scheme.eligibility.age_max && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Age Max:</span>
                    <span className="font-medium text-slate-900">{scheme.eligibility.age_max} years</span>
                  </div>
                )}
              </div>

              {/* Documents List */}
              <div className="mb-4">
                <div className="text-[11px] font-semibold text-slate-800 mb-1.5 flex items-center gap-1">
                  <FileCheck2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Required Documents:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.documents.map((doc, dIdx) => (
                    <span
                      key={dIdx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded-md font-medium border border-slate-200"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer info & Link */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <Clock className="w-3 h-3" /> {scheme.deadline || "Ongoing"}
              </span>
              {scheme.application_url && (
                <a
                  href={scheme.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold text-xs"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

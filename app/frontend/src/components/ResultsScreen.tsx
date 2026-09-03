"use client";

import React from "react";
import SchemeCard, { Scheme } from "./SchemeCard";

interface ResultsProps {
  onBack: () => void;
  onViewDocuments: (s: Scheme) => void;
}

const MOCK_SCHEMES: Scheme[] = [
  {
    id: "sch-1",
    name: "PM-KISAN Samman Nidhi",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "MATCH",
    short_description: "Direct income support to eligible farmer families.",
    why: ["Occupation: Farmer — matches", "Income: ₹1,80,000/year", "You meet the available criteria for this scheme."],
    documents: [
      { name: "Aadhaar", required: true },
      { name: "Land ownership proof", required: true },
    ],
    application_url: "https://pmkisan.gov.in/",
  },
  {
    id: "sch-2",
    name: "Ayushman Bharat PM-JAY",
    ministry: "Ministry of Health and Family Welfare",
    status: "NEEDS_VERIFICATION",
    short_description: "Health coverage for economically vulnerable families.",
    why: ["Income: ₹1,80,000/year", "Income certificate is required for verification."],
    documents: [
      { name: "Income Certificate", required: true },
      { name: "Aadhaar", required: true },
    ],
    application_url: "https://pmjay.gov.in/",
  },
  {
    id: "sch-3",
    name: "National Means-cum-Merit Scholarship",
    ministry: "Ministry of Education",
    status: "NOT_MATCHED",
    short_description: "Scholarship for meritorious students from low-income families.",
    why: ["Age requirement: maximum 16 years", "Citizen age: 45", "Therefore the age criterion is not met."],
    documents: [
      { name: "Birth certificate", required: true },
    ],
    application_url: "https://scholarships.gov.in/",
  },
];

export const ResultsScreen: React.FC<ResultsProps> = ({ onBack, onViewDocuments }) => {
  return (
    <div className="w-[85%] max-w-[1200px] mx-auto bg-white border border-slate-100 rounded-2xl shadow p-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold">Results</h3>
          <p className="text-sm text-slate-500">We found these government schemes based on your profile.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm text-slate-600">Back</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_SCHEMES.map((s) => (
          <SchemeCard key={s.id} scheme={s} onViewDocuments={onViewDocuments} />
        ))}
      </div>
    </div>
  );
};

export default ResultsScreen;

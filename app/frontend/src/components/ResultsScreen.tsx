"use client";

import React from "react";
import SchemeCard, { Scheme } from "./SchemeCard";
import { UserProfileData } from "./ProfileForm";

interface ResultsProps {
  profile: UserProfileData;
  onBack: () => void;
  onViewDocuments: (s: Scheme) => void;
}

const ALL_SCHEMES: Scheme[] = [
  {
    id: "sch-1",
    name: "PM-KISAN Samman Nidhi",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "MATCH",
    short_description: "Direct income support to eligible farmer families.",
    why: [],
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
    short_description:
      "Health coverage for economically vulnerable families.",
    why: [],
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
    status: "MATCH",
    short_description:
      "Scholarship for meritorious students from low-income families.",
    why: [],
    documents: [
      { name: "Birth certificate", required: true },
      { name: "School ID", required: true },
    ],
    application_url: "https://scholarships.gov.in/",
  },
];

function calculateResults(profile: UserProfileData): Scheme[] {
  const results: Scheme[] = [];

  const occupation = profile.occupation?.toLowerCase().trim() || "";
  const education = profile.education?.toLowerCase().trim() || "";

  // PM-KISAN
  if (occupation.includes("farmer")) {
    results.push({
      ...ALL_SCHEMES[0],
      status: "MATCH",
      why: [
        "Occupation: Farmer — matches",
        `Income: ₹${Number(profile.income).toLocaleString("en-IN")}/year`,
        "You meet the available criteria for this scheme.",
      ],
    });
  }

  // Ayushman Bharat
  if (Number(profile.income) <= 180000) {
    results.push({
      ...ALL_SCHEMES[1],
      status: "NEEDS_VERIFICATION",
      why: [
        `Income: ₹${Number(profile.income).toLocaleString("en-IN")}/year`,
        "Income certificate is required for verification.",
      ],
    });
  }

  // Scholarship
  if (
    Number(profile.age) <= 16 &&
    occupation.includes("student")
  ) {
    results.push({
      ...ALL_SCHEMES[2],
      status: "MATCH",
      why: [
        `Age: ${profile.age} — within the scheme limit`,
        "Occupation: Student — matches",
        "You meet the available criteria for this scheme.",
      ],
    });
  }

  return results;
}

export const ResultsScreen: React.FC<ResultsProps> = ({
  profile,
  onBack,
  onViewDocuments,
}) => {
  const matchedSchemes = calculateResults(profile);

  const otherSchemes = ALL_SCHEMES.filter(
    (scheme) => !matchedSchemes.some((match) => match.id === scheme.id)
  );

  return (
    <div className="w-[85%] max-w-[1200px] mx-auto bg-white border border-slate-100 rounded-2xl shadow p-8">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            Results
          </h3>

          <p className="text-sm text-slate-500">
            Schemes based on the information you provided.
          </p>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
        >
          ← Back
        </button>
      </div>

      {/* Matching results */}
      {matchedSchemes.length > 0 ? (
        <>
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            Schemes relevant to you
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matchedSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                onViewDocuments={onViewDocuments}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 border border-slate-200 rounded-xl bg-slate-50">
          <div className="text-4xl mb-3">🔍</div>

          <h4 className="text-xl font-semibold text-slate-900">
            No matching schemes found
          </h4>

          <p className="text-sm text-slate-500 mt-2">
            We couldn't find a scheme matching all the information
            you provided.
          </p>
        </div>
      )}

      {/* Other schemes */}
      {otherSchemes.length > 0 && (
        <div className="mt-10">
          <h4 className="text-lg font-semibold text-slate-900 mb-2">
            Other government schemes
          </h4>

          <p className="text-sm text-slate-500 mb-5">
            These schemes may not match your current profile, but you
            can explore them for more information.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={{
                  ...scheme,
                  status: "NOT_MATCHED",
                  why: [
                    "This scheme does not match all of your current profile details.",
                  ],
                }}
                onViewDocuments={onViewDocuments}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsScreen;
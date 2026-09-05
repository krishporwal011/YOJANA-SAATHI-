"use client";

import React, { useState, useEffect } from "react";
import SchemeCard, { Scheme, SchemeStatus } from "./SchemeCard";
import { UserProfileData } from "./ProfileForm";
import BackButton from "./BackButton";

interface ResultsProps {
  profile: UserProfileData;
  onBack: () => void;
  onViewDocuments: (s: Scheme) => void;
}

interface CriterionResult {
  criterion: string;
  passed: boolean;
  details: string;
}

interface SchemeEligibilityResult {
  scheme_id: string;
  scheme_name: string;
  status: string;
  criteria_results: CriterionResult[];
  reason?: string | null;
  missing_documents: string[];
}

interface EligibilityApiResponse {
  success: boolean;
  message?: string;
  results: SchemeEligibilityResult[];
}

interface SchemeMetadata {
  id: string;
  scheme_name: string;
  ministry?: string;
  benefits?: string;
  documents?: string[];
  application_url?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const ResultsScreen: React.FC<ResultsProps> = ({
  profile,
  onBack,
  onViewDocuments,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchedSchemes, setMatchedSchemes] = useState<Scheme[]>([]);
  const [otherSchemes, setOtherSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const payload = {
          age: profile.age === "" ? null : Number(profile.age),
          income: profile.income === "" ? null : Number(profile.income),
          state: profile.state || "",
          occupation: profile.occupation || "",
          category: profile.category || "",
          education: profile.education || "",
        };

        // Call authoritative backend eligibility check API
        const eligibilityRes = await fetch(`${API_BASE_URL}/api/eligibility/check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!eligibilityRes.ok) {
          throw new Error("Eligibility API response failed");
        }

        const eligibilityData: EligibilityApiResponse = await eligibilityRes.json();

        if (!eligibilityData.success || !Array.isArray(eligibilityData.results)) {
          throw new Error("Invalid response format from eligibility API");
        }

        // Fetch scheme metadata from existing GET /api/schemes endpoint for visual details
        let schemesMetadata: SchemeMetadata[] = [];
        try {
          const metaRes = await fetch(`${API_BASE_URL}/api/schemes`);
          if (metaRes.ok) {
            schemesMetadata = await metaRes.json();
          }
        } catch {
          // Optional metadata fetch fallback
        }

        const metaMap = new Map<string, SchemeMetadata>();
        if (Array.isArray(schemesMetadata)) {
          schemesMetadata.forEach((m) => {
            if (m.id) metaMap.set(m.id, m);
            if (m.scheme_name) metaMap.set(m.scheme_name, m);
          });
        }

        const matched: Scheme[] = [];
        const other: Scheme[] = [];

        eligibilityData.results.forEach((item) => {
          const meta = metaMap.get(item.scheme_id) || metaMap.get(item.scheme_name);

          // Build why explanations directly from backend criteria_results and reason
          const why: string[] = [];
          if (Array.isArray(item.criteria_results) && item.criteria_results.length > 0) {
            item.criteria_results.forEach((cr) => {
              if (cr.details) why.push(cr.details);
            });
          }
          if (item.reason && !why.includes(item.reason)) {
            why.push(item.reason);
          }
          if (why.length === 0) {
            why.push("Evaluated deterministically by backend eligibility engine.");
          }

          // Build document list from metadata and backend missing_documents
          const rawDocsList: string[] = meta?.documents || [];
          const missingDocsLower = (item.missing_documents || []).map((d) => d.toLowerCase());

          let docsObjList: { name: string; required: boolean }[] = [];
          if (rawDocsList.length > 0) {
            docsObjList = rawDocsList.map((docName) => ({
              name: docName,
              required: missingDocsLower.includes(docName.toLowerCase()) || true,
            }));
          } else if (item.missing_documents && item.missing_documents.length > 0) {
            docsObjList = item.missing_documents.map((docName) => ({
              name: docName,
              required: true,
            }));
          }

          // Format status string
          const normalizedStatus = (item.status || "NOT MATCHED").toUpperCase().trim();
          let uiStatus: SchemeStatus = "NOT_MATCHED";
          if (normalizedStatus === "MATCH") {
            uiStatus = "MATCH";
          } else if (normalizedStatus === "NEEDS VERIFICATION" || normalizedStatus === "NEEDS_VERIFICATION") {
            uiStatus = "NEEDS_VERIFICATION";
          } else {
            uiStatus = "NOT_MATCHED";
          }

          const schemeObj: Scheme = {
            id: item.scheme_id,
            name: item.scheme_name,
            ministry: meta?.ministry || "Government of India",
            status: uiStatus,
            short_description: meta?.benefits || "Official government welfare scheme.",
            why,
            documents: docsObjList.length > 0 ? docsObjList : undefined,
            application_url: meta?.application_url || "https://india.gov.in/",
          };

          if (uiStatus === "MATCH" || uiStatus === "NEEDS_VERIFICATION") {
            matched.push(schemeObj);
          } else {
            other.push(schemeObj);
          }
        });

        if (isMounted) {
          setMatchedSchemes(matched);
          setOtherSchemes(other);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setError("Unable to calculate eligibility right now. Please try again.");
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [profile]);

  if (loading) {
    return (
      <div className="w-[90%] max-w-[1200px] mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl p-12 my-6 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
        <h4 className="text-lg font-bold text-slate-800">Calculating Scheme Eligibility...</h4>
        <p className="text-xs text-slate-500 mt-1">
          Evaluating citizen profile against official eligibility rules in backend engine.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[90%] max-w-[1200px] mx-auto bg-white border border-red-200 rounded-2xl shadow-xl p-8 my-6 text-center">
        <div className="flex items-center gap-3 mb-6">
          <BackButton onClick={onBack} label="Back to Confirm" />
        </div>
        <div className="py-8 bg-red-50 rounded-xl border border-red-100 max-w-lg mx-auto">
          <div className="text-3xl mb-2">⚠️</div>
          <h4 className="text-base font-bold text-red-900 mb-1">Eligibility Engine Unavailable</h4>
          <p className="text-xs text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] max-w-[1200px] mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl p-8 my-6">

      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <BackButton onClick={onBack} label="Back to Confirm" />
            <h3 className="text-2xl font-bold text-slate-900">
              Deterministic Eligibility Results
            </h3>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Evaluated for <strong>{profile.name || "Citizen"}</strong> ({profile.occupation ? profile.occupation.replace(/_/g, " ") : "N/A"}, Age: {profile.age || "N/A"}, Income: ₹{profile.income ? Number(profile.income).toLocaleString("en-IN") : "0"}/yr)
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full">
            {matchedSchemes.length} Relevant Schemes Evaluated
          </span>
        </div>
      </div>

      {/* Matching results */}
      {matchedSchemes.length > 0 ? (
        <>
          <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span>Schemes Relevant to Your Profile</span>
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
            No matching schemes found for this exact profile
          </h4>

          <p className="text-sm text-slate-500 mt-2">
            Try adjusting your profile information or explore general schemes below.
          </p>
        </div>
      )}

      {/* Other schemes */}
      {otherSchemes.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-100">
          <h4 className="text-base font-bold text-slate-700 mb-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />
            <span>Other Government Schemes</span>
          </h4>

          <p className="text-xs text-slate-500 mb-5">
            These schemes did not meet all specific criteria for your current profile, but remain open for general exploration.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherSchemes.slice(0, 6).map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={{
                  ...scheme,
                  status: "NOT_MATCHED"
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

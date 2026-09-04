"use client";

import React from "react";
import SchemeCard, { Scheme } from "./SchemeCard";
import { UserProfileData } from "./ProfileForm";
import BackButton from "./BackButton";

interface ResultsProps {
  profile: UserProfileData;
  onBack: () => void;
  onViewDocuments: (s: Scheme) => void;
}

const ALL_SCHEMES_LIST: (Scheme & { minAge?: number; maxAge?: number; maxIncome?: number; targetOccs?: string[] })[] = [
  // Farmers
  {
    id: "sch-1",
    name: "PM-KISAN Samman Nidhi",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "MATCH",
    short_description: "Direct financial benefit of ₹6,000/yr for farmer families.",
    why: [],
    documents: [{ name: "Land record", required: true }, { name: "Aadhaar card", required: true }, { name: "Bank passbook", required: true }],
    application_url: "https://pmkisan.gov.in/",
    targetOccs: ["farmer"]
  },
  {
    id: "sch-4",
    name: "Kisan Credit Card (KCC) Scheme",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "MATCH",
    short_description: "Timely credit at subsidized interest rate (4% p.a.) for farmers.",
    why: [],
    documents: [{ name: "Land record", required: true }, { name: "Aadhaar card", required: true }],
    application_url: "https://pmkisan.gov.in/KCC.aspx",
    minAge: 18, maxAge: 75,
    targetOccs: ["farmer"]
  },
  {
    id: "sch-5",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "NEEDS_VERIFICATION",
    short_description: "Comprehensive crop insurance against natural crop loss.",
    why: [],
    documents: [{ name: "Sowing certificate", required: true }, { name: "Land record", required: true }],
    application_url: "https://pmfby.gov.in/",
    minAge: 18,
    targetOccs: ["farmer"]
  },
  {
    id: "sch-6",
    name: "PM-KUSUM (Solar Pump Scheme)",
    ministry: "Ministry of New & Renewable Energy",
    status: "NEEDS_VERIFICATION",
    short_description: "Up to 60% subsidy for setting up solar agriculture pumps.",
    why: [],
    documents: [{ name: "Land possession proof", required: true }, { name: "Aadhaar card", required: true }],
    application_url: "https://pmkusum.mnre.gov.in/",
    minAge: 18,
    targetOccs: ["farmer"]
  },
  {
    id: "sch-7",
    name: "Soil Health Card Scheme",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    status: "MATCH",
    short_description: "Free soil testing and customized crop nutrient recommendations.",
    why: [],
    documents: [{ name: "Land record", required: true }],
    application_url: "https://soilhealth.dac.gov.in/",
    targetOccs: ["farmer"]
  },

  // Health / General
  {
    id: "sch-2",
    name: "Ayushman Bharat PM-JAY",
    ministry: "Ministry of Health & Family Welfare",
    status: "NEEDS_VERIFICATION",
    short_description: "Free health insurance cover up to ₹5,00,000 per family per year.",
    why: [],
    documents: [{ name: "Income Certificate", required: true }, { name: "Ration card", required: true }],
    application_url: "https://nha.gov.in/PM-JAY",
    maxIncome: 180000
  },

  // Students
  {
    id: "sch-3",
    name: "National Means-cum-Merit Scholarship",
    ministry: "Ministry of Education",
    status: "MATCH",
    short_description: "Scholarship of ₹12,000/yr for meritorious low-income students.",
    why: [],
    documents: [{ name: "School ID", required: true }, { name: "Income certificate", required: true }],
    application_url: "https://scholarships.gov.in/",
    maxAge: 16, maxIncome: 350000,
    targetOccs: ["student"]
  },
  {
    id: "sch-8",
    name: "PM YASASVI Scholarship Scheme",
    ministry: "Ministry of Social Justice and Empowerment",
    status: "MATCH",
    short_description: "Scholarship grant up to ₹1,25,000/yr for meritorious students.",
    why: [],
    documents: [{ name: "Mark sheet", required: true }, { name: "Income certificate", required: true }],
    application_url: "https://yet.nta.ac.in/",
    maxAge: 18, maxIncome: 250000,
    targetOccs: ["student"]
  },
  {
    id: "sch-9",
    name: "Central Sector Scholarship for College Students",
    ministry: "Ministry of Education",
    status: "MATCH",
    short_description: "Financial grant for higher education college/university students.",
    why: [],
    documents: [{ name: "12th mark sheet", required: true }, { name: "College ID", required: true }],
    application_url: "https://scholarships.gov.in/",
    minAge: 17, maxAge: 25, maxIncome: 450000,
    targetOccs: ["student"]
  },
  {
    id: "sch-10",
    name: "Post-Matric Scholarship Scheme",
    ministry: "Ministry of Social Justice & Empowerment",
    status: "MATCH",
    short_description: "Tuition fee reimbursement and allowance for post-secondary education.",
    why: [],
    documents: [{ name: "10th mark sheet", required: true }, { name: "Admission proof", required: true }],
    application_url: "https://scholarships.gov.in/",
    minAge: 15, maxAge: 30, maxIncome: 250000,
    targetOccs: ["student"]
  },

  // Artisans
  {
    id: "sch-12",
    name: "PM Vishwakarma Yojana",
    ministry: "Ministry of MSME",
    status: "MATCH",
    short_description: "Collateral-free credit up to ₹3 Lakh at 5% interest and tool kit incentive.",
    why: [],
    documents: [{ name: "Aadhaar card", required: true }, { name: "Skill verification certificate", required: true }],
    application_url: "https://pmvishwakarma.gov.in/",
    minAge: 18,
    targetOccs: ["artisan"]
  },
  {
    id: "sch-13",
    name: "PMEGP Employment Generation Programme",
    ministry: "Ministry of MSME",
    status: "MATCH",
    short_description: "Up to 35% margin money subsidy on enterprise projects up to ₹50 Lakh.",
    why: [],
    documents: [{ name: "Project report", required: true }, { name: "Aadhaar card", required: true }],
    application_url: "https://www.kviconline.gov.in/pmegpeportal/",
    minAge: 18,
    targetOccs: ["artisan", "self_employed", "unemployed"]
  },
  {
    id: "sch-14",
    name: "Pradhan Mantri Mudra Yojana (Shishu & Kishore)",
    ministry: "Ministry of Finance",
    status: "MATCH",
    short_description: "Collateral-free micro loans up to ₹5 Lakh for artisans and entrepreneurs.",
    why: [],
    documents: [{ name: "Business proposal", required: true }, { name: "Bank statement", required: true }],
    application_url: "https://www.mudra.org.in/",
    minAge: 18, maxAge: 65,
    targetOccs: ["artisan", "self_employed"]
  },

  // Daily Wage Workers
  {
    id: "sch-16",
    name: "MGNREGA (Rural Employment Guarantee)",
    ministry: "Ministry of Rural Development",
    status: "MATCH",
    short_description: "Guarantees 100 days of wage employment in a year for rural workers.",
    why: [],
    documents: [{ name: "Job Card application", required: true }, { name: "Aadhaar card", required: true }],
    application_url: "https://nrega.nic.in/",
    minAge: 18,
    targetOccs: ["daily_wage_worker", "unemployed"]
  },
  {
    id: "sch-17",
    name: "Pradhan Mantri Shram Yogi Maandhan (PM-SYM)",
    ministry: "Ministry of Labour and Employment",
    status: "MATCH",
    short_description: "Assured monthly pension of ₹3,000 after 60 years of age for workers.",
    why: [],
    documents: [{ name: "e-Shram card", required: true }, { name: "Bank passbook", required: true }],
    application_url: "https://maandhan.in/",
    minAge: 18, maxAge: 40, maxIncome: 180000,
    targetOccs: ["daily_wage_worker"]
  },

  // Self Employed
  {
    id: "sch-20",
    name: "PM SVANidhi (Street Vendor Loan Scheme)",
    ministry: "Ministry of Housing & Urban Affairs",
    status: "NEEDS_VERIFICATION",
    short_description: "Collateral-free working capital loan up to ₹50,000 with 7% interest subsidy.",
    why: [],
    documents: [{ name: "Vending Certificate", required: true }, { name: "Aadhaar card", required: true }],
    application_url: "https://pmsvanidhi.mohua.gov.in/",
    minAge: 18,
    targetOccs: ["self_employed"]
  },
  {
    id: "sch-21",
    name: "Stand-Up India Scheme for Entrepreneurs",
    ministry: "Ministry of Finance",
    status: "NEEDS_VERIFICATION",
    short_description: "Bank loans between ₹10 Lakh and ₹1 Crore for greenfield micro enterprises.",
    why: [],
    documents: [{ name: "Project plan", required: true }, { name: "PAN card", required: true }],
    application_url: "https://www.standupmitra.in/",
    minAge: 18,
    targetOccs: ["self_employed"]
  },

  // Salaried Employees
  {
    id: "sch-24",
    name: "Atal Pension Yojana (APY)",
    ministry: "Ministry of Finance",
    status: "MATCH",
    short_description: "Guaranteed pension between ₹1,000 and ₹5,000/month after 60 years.",
    why: [],
    documents: [{ name: "Savings bank account", required: true }, { name: "Aadhaar card", required: true }],
    application_url: "https://www.npscra.nsdl.co.in/",
    minAge: 18, maxAge: 40,
    targetOccs: ["salaried_employee", "self_employed"]
  },
  {
    id: "sch-25",
    name: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    ministry: "Ministry of Finance",
    status: "MATCH",
    short_description: "Life insurance cover of ₹2,00,000 for just ₹436 annual premium.",
    why: [],
    documents: [{ name: "Bank passbook with auto-debit", required: true }],
    application_url: "https://www.jansuraksha.gov.in/",
    minAge: 18, maxAge: 50,
    targetOccs: ["salaried_employee", "daily_wage_worker"]
  },

  // Unemployed
  {
    id: "sch-27",
    name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
    ministry: "Ministry of Skill Development & Entrepreneurship",
    status: "MATCH",
    short_description: "Free industry skill training, certification, and placement assistance.",
    why: [],
    documents: [{ name: "Aadhaar card", required: true }, { name: "Bank passbook", required: true }],
    application_url: "https://www.pmkvyofficial.org/",
    minAge: 15, maxAge: 45,
    targetOccs: ["unemployed"]
  },
  {
    id: "sch-28",
    name: "PM-DAKSH Skill Development Scheme",
    ministry: "Ministry of Social Justice & Empowerment",
    status: "MATCH",
    short_description: "Free skill training with monthly stipend of up to ₹1,500/month.",
    why: [],
    documents: [{ name: "Income certificate", required: true }, { name: "Aadhaar card", required: true }],
    application_url: "https://pmdaksh.dosje.gov.in/",
    minAge: 18, maxAge: 45, maxIncome: 300000,
    targetOccs: ["unemployed"]
  },
  {
    id: "sch-30",
    name: "National Career Service (NCS) Job Portal",
    ministry: "Ministry of Labour and Employment",
    status: "MATCH",
    short_description: "Free nationwide job matching, career counseling, and vocational guidance.",
    why: [],
    documents: [{ name: "Aadhaar card", required: true }, { name: "Qualification resume", required: true }],
    application_url: "https://www.ncs.gov.in/",
    minAge: 18, maxAge: 60,
    targetOccs: ["unemployed"]
  }
];

function calculateResults(profile: UserProfileData): { matched: Scheme[]; other: Scheme[] } {
  const matched: Scheme[] = [];
  const other: Scheme[] = [];

  const userOcc = (profile.occupation || "").toLowerCase().trim();
  const userAge = Number(profile.age) || null;
  const userIncome = Number(profile.income) || null;

  ALL_SCHEMES_LIST.forEach((s) => {
    const reasons: string[] = [];
    let isMatch = true;

    // Check Occupation
    if (s.targetOccs && s.targetOccs.length > 0) {
      const occMatch = s.targetOccs.some((t) => userOcc.includes(t));
      if (!occMatch) {
        isMatch = false;
        reasons.push(`Occupation '${profile.occupation}' does not match scheme target (${s.targetOccs.join(", ")})`);
      } else {
        reasons.push(`Occupation '${profile.occupation || "N/A"}' matches criteria.`);
      }
    }

    // Check Age
    if (s.minAge && userAge && userAge < s.minAge) {
      isMatch = false;
      reasons.push(`Age ${userAge} is below minimum required age of ${s.minAge}.`);
    }
    if (s.maxAge && userAge && userAge > s.maxAge) {
      isMatch = false;
      reasons.push(`Age ${userAge} exceeds maximum age limit of ${s.maxAge}.`);
    }

    // Check Income
    if (s.maxIncome && userIncome && userIncome > s.maxIncome) {
      isMatch = false;
      reasons.push(`Income ₹${userIncome.toLocaleString("en-IN")}/yr exceeds limit of ₹${s.maxIncome.toLocaleString("en-IN")}/yr.`);
    } else if (s.maxIncome && userIncome) {
      reasons.push(`Income ₹${userIncome.toLocaleString("en-IN")}/yr is within limit of ₹${s.maxIncome.toLocaleString("en-IN")}/yr.`);
    }

    const item: Scheme = {
      id: s.id,
      name: s.name,
      ministry: s.ministry,
      status: isMatch ? (s.status || "MATCH") : "NOT_MATCHED",
      short_description: s.short_description,
      why: reasons.length > 0 ? reasons : ["You meet the criteria evaluated for this scheme."],
      documents: s.documents,
      application_url: s.application_url
    };

    if (isMatch) {
      matched.push(item);
    } else {
      other.push(item);
    }
  });

  return { matched, other };
}

export const ResultsScreen: React.FC<ResultsProps> = ({
  profile,
  onBack,
  onViewDocuments,
}) => {
  const { matched: matchedSchemes, other: otherSchemes } = calculateResults(profile);

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


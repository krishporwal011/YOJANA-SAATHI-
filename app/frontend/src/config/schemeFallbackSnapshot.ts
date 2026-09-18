/**
 * FALLBACK COLD-START SCHEME SNAPSHOT
 *
 * NOTE: The authoritative canonical source of truth for all scheme data and rules
 * is the backend (GET /api/schemes and POST /api/eligibility/check).
 *
 * This snapshot is used STRICTLY as a read-only fallback context for the AI Chatbot
 * during Render cold starts or network timeouts so citizens still receive helpful,
 * accurate scheme guidance rather than a blank error.
 *
 * It is NEVER used for deterministic eligibility evaluation.
 */

export interface FallbackSchemeRecord {
  id: string;
  scheme_name: string;
  ministry?: string;
  state?: string;
  benefits?: string;
  eligibility?: {
    age_min?: number | null;
    age_max?: number | null;
    income_limit?: number | null;
    occupation?: string;
    education?: string;
    category?: string;
  };
  documents?: string[];
  application_url?: string;
  deadline?: string;
  source_url?: string;
  last_verified?: string;
}

export const FALLBACK_COLD_START_SCHEME_SNAPSHOT: FallbackSchemeRecord[] = [
  {
    "id": "SCH-001",
    "scheme_name": "PM-KISAN Samman Nidhi",
    "ministry": "Ministry of Agriculture and Farmers Welfare",
    "state": "All India",
    "benefits": "Financial benefit of Rs 6,000 per year in three equal four-monthly installments directly into the bank accounts of eligible farmer families.",
    "eligibility": {
      "age_min": null,
      "age_max": null,
      "income_limit": null,
      "occupation": "farmer",
      "education": "",
      "category": ""
    },
    "documents": [
      "land record",
      "bank passbook"
    ],
    "application_url": "https://pmkisan.gov.in/",
    "deadline": "Ongoing",
    "source_url": "https://pmkisan.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-002",
    "scheme_name": "Ayushman Bharat PM-JAY",
    "ministry": "Ministry of Health and Family Welfare",
    "state": "All India",
    "benefits": "Health insurance cover of up to Rs 5,00,000 per family per year for secondary and tertiary care hospitalization across public and private empaneled hospitals.",
    "eligibility": {
      "age_min": null,
      "age_max": null,
      "income_limit": 180000,
      "occupation": "",
      "education": "",
      "category": ""
    },
    "documents": [
      "income certificate",
      "ration card"
    ],
    "application_url": "https://nha.gov.in/PM-JAY",
    "deadline": "Ongoing",
    "source_url": "https://pmjay.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-003",
    "scheme_name": "National Means-cum-Merit Scholarship",
    "ministry": "Ministry of Education",
    "state": "All India",
    "benefits": "Scholarship amount of Rs 12,000 per annum (Rs 1,000 per month) to meritorious students belonging to economically weaker sections to reduce dropouts at class 8.",
    "eligibility": {
      "age_min": null,
      "age_max": 16,
      "income_limit": 350000,
      "occupation": "student",
      "education": "Class 8 passed / studying in Class 9",
      "category": ""
    },
    "documents": [
      "school ID",
      "income certificate"
    ],
    "application_url": "https://scholarships.gov.in/",
    "deadline": "2026-10-31",
    "source_url": "https://scholarships.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-004",
    "scheme_name": "Kisan Credit Card (KCC) Scheme",
    "ministry": "Ministry of Agriculture and Farmers Welfare",
    "state": "All India",
    "benefits": "Provides timely credit to farmers at subsidized interest rates (starting at 4% p.a.) for cultivation, harvest, and farm maintenance.",
    "eligibility": {
      "age_min": 18,
      "age_max": 75,
      "income_limit": null,
      "occupation": "farmer",
      "education": "",
      "category": ""
    },
    "documents": [
      "land record",
      "Aadhaar card",
      "PAN card / Form 60",
      "bank account details"
    ],
    "application_url": "https://pmkisan.gov.in/KCC.aspx",
    "deadline": "Ongoing",
    "source_url": "https://myscheme.gov.in/schemes/kcc",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-005",
    "scheme_name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    "ministry": "Ministry of Agriculture and Farmers Welfare",
    "state": "All India",
    "benefits": "Comprehensive crop insurance coverage against non-preventable natural risks from pre-sowing to post-harvest with nominal premium (1.5% to 2%).",
    "eligibility": {
      "age_min": 18,
      "age_max": null,
      "income_limit": null,
      "occupation": "farmer",
      "education": "",
      "category": ""
    },
    "documents": [
      "land record",
      "sowing certificate",
      "bank passbook",
      "Aadhaar card"
    ],
    "application_url": "https://pmfby.gov.in/",
    "deadline": "Seasonal",
    "source_url": "https://pmfby.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-006",
    "scheme_name": "PM-KUSUM (Solar Pump Scheme)",
    "ministry": "Ministry of New and Renewable Energy",
    "state": "All India",
    "benefits": "Up to 60% subsidy for setting up standalone solar pumps and solarization of existing grid-connected agricultural pumps.",
    "eligibility": {
      "age_min": 18,
      "age_max": null,
      "income_limit": null,
      "occupation": "farmer",
      "education": "",
      "category": ""
    },
    "documents": [
      "land possession certificate",
      "Aadhaar card",
      "bank passbook",
      "electricity bill (if grid connected)"
    ],
    "application_url": "https://pmkusum.mnre.gov.in/",
    "deadline": "Ongoing",
    "source_url": "https://pmkusum.mnre.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-007",
    "scheme_name": "Soil Health Card Scheme",
    "ministry": "Ministry of Agriculture and Farmers Welfare",
    "state": "All India",
    "benefits": "Free soil nutrient testing and personalized soil health cards issued every 2 years advising optimal fertilizer usage.",
    "eligibility": {
      "age_min": null,
      "age_max": null,
      "income_limit": null,
      "occupation": "farmer",
      "education": "",
      "category": ""
    },
    "documents": [
      "land record",
      "Aadhaar card"
    ],
    "application_url": "https://soilhealth.dac.gov.in/",
    "deadline": "Ongoing",
    "source_url": "https://soilhealth.dac.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-008",
    "scheme_name": "PM YASASVI Scholarship Scheme",
    "ministry": "Ministry of Social Justice and Empowerment",
    "state": "All India",
    "benefits": "Scholarship grant up to Rs 75,000/yr for Class 9-10 and Rs 1,25,000/yr for Class 11-12 students.",
    "eligibility": {
      "age_min": null,
      "age_max": 18,
      "income_limit": 250000,
      "occupation": "student",
      "education": "Class 8 or 10 passed",
      "category": ""
    },
    "documents": [
      "school mark sheet",
      "income certificate",
      "caste/category certificate",
      "Aadhaar card"
    ],
    "application_url": "https://yet.nta.ac.in/",
    "deadline": "2026-10-15",
    "source_url": "https://yet.nta.ac.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-009",
    "scheme_name": "Central Sector Scheme of Scholarship for College Students",
    "ministry": "Ministry of Education",
    "state": "All India",
    "benefits": "Rs 12,000 per annum for graduation and Rs 20,000 per annum for post-graduation to meritorious college students.",
    "eligibility": {
      "age_min": 17,
      "age_max": 25,
      "income_limit": 450000,
      "occupation": "student",
      "education": "12th pass",
      "category": ""
    },
    "documents": [
      "12th mark sheet",
      "income certificate",
      "college fee receipt",
      "bank passbook"
    ],
    "application_url": "https://scholarships.gov.in/",
    "deadline": "2026-10-31",
    "source_url": "https://scholarships.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-010",
    "scheme_name": "Post-Matric Scholarship Scheme",
    "ministry": "Ministry of Social Justice and Empowerment",
    "state": "All India",
    "benefits": "Complete tuition fee reimbursement and maintenance allowance for post-secondary education.",
    "eligibility": {
      "age_min": 15,
      "age_max": 30,
      "income_limit": 250000,
      "occupation": "student",
      "education": "10th pass",
      "category": ""
    },
    "documents": [
      "10th mark sheet",
      "income certificate",
      "institution admission proof",
      "Aadhaar card"
    ],
    "application_url": "https://scholarships.gov.in/",
    "deadline": "2026-11-15",
    "source_url": "https://scholarships.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-011",
    "scheme_name": "Pre-Matric Scholarship Scheme",
    "ministry": "Ministry of Minority Affairs / Social Justice",
    "state": "All India",
    "benefits": "Financial assistance of up to Rs 3,500/yr for school fee, books, and hostel maintenance allowance.",
    "eligibility": {
      "age_min": 6,
      "age_max": 16,
      "income_limit": 200000,
      "occupation": "student",
      "education": "Class 1 to 10",
      "category": ""
    },
    "documents": [
      "previous year mark sheet",
      "income certificate",
      "school bonafide certificate",
      "bank passbook"
    ],
    "application_url": "https://scholarships.gov.in/",
    "deadline": "2026-10-31",
    "source_url": "https://scholarships.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-012",
    "scheme_name": "PM Vishwakarma Yojana",
    "ministry": "Ministry of Micro, Small and Medium Enterprises",
    "state": "All India",
    "benefits": "Collataral-free credit up to Rs 3,00,000 at 5% interest rate, skill training, tool kit incentive of Rs 15,000, and digital transaction incentives.",
    "eligibility": {
      "age_min": 18,
      "age_max": null,
      "income_limit": null,
      "occupation": "artisan",
      "education": "",
      "category": ""
    },
    "documents": [
      "Aadhaar card",
      "bank passbook",
      "skill / trade verification certificate",
      "ration card"
    ],
    "application_url": "https://pmvishwakarma.gov.in/",
    "deadline": "Ongoing",
    "source_url": "https://pmvishwakarma.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-013",
    "scheme_name": "Prime Minister Employment Generation Programme (PMEGP)",
    "ministry": "Ministry of Micro, Small and Medium Enterprises",
    "state": "All India",
    "benefits": "Bank-financed subsidy scheme providing up to 35% margin money subsidy on micro-enterprise projects up to Rs 50 lakh.",
    "eligibility": {
      "age_min": 18,
      "age_max": null,
      "income_limit": null,
      "occupation": "artisan",
      "education": "8th pass for projects > 10L",
      "category": ""
    },
    "documents": [
      "project report",
      "Aadhaar card",
      "educational qualification certificate",
      "special category certificate"
    ],
    "application_url": "https://www.kviconline.gov.in/pmegpeportal/",
    "deadline": "Ongoing",
    "source_url": "https://www.kviconline.gov.in/pmegpeportal/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-014",
    "scheme_name": "Pradhan Mantri Mudra Yojana (Shishu & Kishore)",
    "ministry": "Ministry of Finance",
    "state": "All India",
    "benefits": "Collateral-free business loans up to Rs 50,000 (Shishu) and up to Rs 5,00,000 (Kishore) for micro-enterprises and artisans.",
    "eligibility": {
      "age_min": 18,
      "age_max": 65,
      "income_limit": null,
      "occupation": "artisan",
      "education": "",
      "category": ""
    },
    "documents": [
      "identity proof",
      "address proof",
      "business proposal / proof of business",
      "bank statement"
    ],
    "application_url": "https://www.mudra.org.in/",
    "deadline": "Ongoing",
    "source_url": "https://www.mudra.org.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-015",
    "scheme_name": "National Handicrafts Development Programme (NHDP)",
    "ministry": "Ministry of Textiles",
    "state": "All India",
    "benefits": "Financial assistance for design development, infrastructure support, technology upgradation, and artisan marketing events.",
    "eligibility": {
      "age_min": 18,
      "age_max": null,
      "income_limit": null,
      "occupation": "artisan",
      "education": "",
      "category": ""
    },
    "documents": [
      "Pehchan artisan card",
      "Aadhaar card",
      "bank passbook"
    ],
    "application_url": "https://handicrafts.nic.in/",
    "deadline": "Ongoing",
    "source_url": "https://handicrafts.nic.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-016",
    "scheme_name": "MGNREGA (Rural Employment Guarantee)",
    "ministry": "Ministry of Rural Development",
    "state": "All India",
    "benefits": "Guarantees at least 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work.",
    "eligibility": {
      "age_min": 18,
      "age_max": null,
      "income_limit": null,
      "occupation": "daily_wage_worker",
      "education": "",
      "category": ""
    },
    "documents": [
      "job card application",
      "Aadhaar card",
      "bank / post office passbook",
      "passport size photograph"
    ],
    "application_url": "https://nrega.nic.in/",
    "deadline": "Ongoing",
    "source_url": "https://nrega.nic.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-017",
    "scheme_name": "Pradhan Mantri Shram Yogi Maandhan (PM-SYM)",
    "ministry": "Ministry of Labour and Employment",
    "state": "All India",
    "benefits": "Assured monthly pension of Rs 3,000 after attaining 60 years of age for unorganized daily wage workers.",
    "eligibility": {
      "age_min": 18,
      "age_max": 40,
      "income_limit": 180000,
      "occupation": "daily_wage_worker",
      "education": "",
      "category": ""
    },
    "documents": [
      "Aadhaar card",
      "savings bank account / Jan Dhan passbook",
      "e-Shram card"
    ],
    "application_url": "https://maandhan.in/",
    "deadline": "Ongoing",
    "source_url": "https://maandhan.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-018",
    "scheme_name": "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    "ministry": "Ministry of Finance",
    "state": "All India",
    "benefits": "Accidental death and disability insurance cover of Rs 2,00,000 for an annual premium of just Rs 20.",
    "eligibility": {
      "age_min": 18,
      "age_max": 70,
      "income_limit": null,
      "occupation": "daily_wage_worker",
      "education": "",
      "category": ""
    },
    "documents": [
      "Aadhaar card",
      "bank passbook with auto-debit consent"
    ],
    "application_url": "https://www.jansuraksha.gov.in/",
    "deadline": "Ongoing",
    "source_url": "https://www.jansuraksha.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-019",
    "scheme_name": "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    "ministry": "Ministry of Finance",
    "state": "All India",
    "benefits": "Life insurance cover of Rs 2,00,000 for death due to any cause at an annual premium of Rs 436.",
    "eligibility": {
      "age_min": 18,
      "age_max": 50,
      "income_limit": null,
      "occupation": "daily_wage_worker",
      "education": "",
      "category": ""
    },
    "documents": [
      "Aadhaar card",
      "savings bank passbook"
    ],
    "application_url": "https://www.jansuraksha.gov.in/",
    "deadline": "Ongoing",
    "source_url": "https://www.jansuraksha.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-020",
    "scheme_name": "PM SVANidhi (Street Vendor Micro-Credit Scheme)",
    "ministry": "Ministry of Housing and Urban Affairs",
    "state": "All India",
    "benefits": "Micro-credit collateral-free working capital loan up to Rs 50,000 with 7% interest subsidy and cashback incentives on digital transactions.",
    "eligibility": {
      "age_min": 18,
      "age_max": null,
      "income_limit": null,
      "occupation": "self_employed",
      "education": "",
      "category": ""
    },
    "documents": [
      "Certificate of Vending / Identity Card",
      "Aadhaar card",
      "bank passbook"
    ],
    "application_url": "https://pmsvanidhi.mohua.gov.in/",
    "deadline": "Ongoing",
    "source_url": "https://pmsvanidhi.mohua.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-021",
    "scheme_name": "Stand-Up India Scheme for Entrepreneurs",
    "ministry": "Ministry of Finance",
    "state": "All India",
    "benefits": "Bank loans between Rs 10 lakh and Rs 1 crore to SC/ST and women entrepreneurs for setting up greenfield self-employed enterprises.",
    "eligibility": {
      "age_min": 18,
      "age_max": null,
      "income_limit": null,
      "occupation": "self_employed",
      "education": "",
      "category": ""
    },
    "documents": [
      "project plan",
      "Aadhaar card",
      "category certificate (SC/ST or Woman entrepreneur)",
      "PAN card"
    ],
    "application_url": "https://www.standupmitra.in/",
    "deadline": "Ongoing",
    "source_url": "https://www.standupmitra.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-022",
    "scheme_name": "Pradhan Mantri Mudra Yojana (Tarun Category)",
    "ministry": "Ministry of Finance",
    "state": "All India",
    "benefits": "Collateral-free business loans between Rs 5,00,000 and Rs 10,00,000 for expanding established self-employed enterprises.",
    "eligibility": {
      "age_min": 18,
      "age_max": 65,
      "income_limit": null,
      "occupation": "self_employed",
      "education": "",
      "category": ""
    },
    "documents": [
      "business registration / GST certificate",
      "last 2 years ITR / financial statements",
      "Aadhaar card",
      "PAN card"
    ],
    "application_url": "https://www.mudra.org.in/",
    "deadline": "Ongoing",
    "source_url": "https://www.mudra.org.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-023",
    "scheme_name": "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
    "ministry": "Ministry of Micro, Small and Medium Enterprises",
    "state": "All India",
    "benefits": "Credit guarantee coverage up to 85% for collateral-free business loans up to Rs 5 crore to self-employed micro & small enterprises.",
    "eligibility": {
      "age_min": 18,
      "age_max": null,
      "income_limit": null,
      "occupation": "self_employed",
      "education": "",
      "category": ""
    },
    "documents": [
      "Udyam registration certificate",
      "project report",
      "bank loan application",
      "Aadhaar card"
    ],
    "application_url": "https://www.cgtmse.in/",
    "deadline": "Ongoing",
    "source_url": "https://www.cgtmse.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-024",
    "scheme_name": "Atal Pension Yojana (APY)",
    "ministry": "Ministry of Finance",
    "state": "All India",
    "benefits": "Guaranteed monthly pension between Rs 1,000 and Rs 5,000 after 60 years of age based on monthly contribution.",
    "eligibility": {
      "age_min": 18,
      "age_max": 40,
      "income_limit": null,
      "occupation": "salaried_employee",
      "education": "",
      "category": ""
    },
    "documents": [
      "savings bank account",
      "Aadhaar card",
      "mobile number"
    ],
    "application_url": "https://www.npscra.nsdl.co.in/scheme-details.php",
    "deadline": "Ongoing",
    "source_url": "https://www.npscra.nsdl.co.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-025",
    "scheme_name": "Pradhan Mantri Jeevan Jyoti Bima Yojana (Salaried)",
    "ministry": "Ministry of Finance",
    "state": "All India",
    "benefits": "Life insurance cover of Rs 2,00,000 for salaried employees at nominal premium automatically debited from bank account.",
    "eligibility": {
      "age_min": 18,
      "age_max": 50,
      "income_limit": null,
      "occupation": "salaried_employee",
      "education": "",
      "category": ""
    },
    "documents": [
      "Aadhaar card",
      "bank passbook with auto-debit facility"
    ],
    "application_url": "https://www.jansuraksha.gov.in/",
    "deadline": "Ongoing",
    "source_url": "https://www.jansuraksha.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-026",
    "scheme_name": "Pradhan Mantri Suraksha Bima Yojana (Salaried)",
    "ministry": "Ministry of Finance",
    "state": "All India",
    "benefits": "Accidental death and full disability cover of Rs 2,00,000 at Rs 20/year for salaried workers.",
    "eligibility": {
      "age_min": 18,
      "age_max": 70,
      "income_limit": null,
      "occupation": "salaried_employee",
      "education": "",
      "category": ""
    },
    "documents": [
      "Aadhaar card",
      "savings bank passbook"
    ],
    "application_url": "https://www.jansuraksha.gov.in/",
    "deadline": "Ongoing",
    "source_url": "https://www.jansuraksha.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-027",
    "scheme_name": "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
    "ministry": "Ministry of Skill Development and Entrepreneurship",
    "state": "All India",
    "benefits": "Free industry-relevant skill training, Government certification, stipend, and job placement assistance.",
    "eligibility": {
      "age_min": 15,
      "age_max": 45,
      "income_limit": null,
      "occupation": "unemployed",
      "education": "",
      "category": ""
    },
    "documents": [
      "Aadhaar card",
      "bank passbook",
      "educational mark sheet (if applicable)"
    ],
    "application_url": "https://www.pmkvyofficial.org/",
    "deadline": "Ongoing",
    "source_url": "https://www.pmkvyofficial.org/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-028",
    "scheme_name": "PM-DAKSH Yojana (Skill Development Scheme)",
    "ministry": "Ministry of Social Justice and Empowerment",
    "state": "All India",
    "benefits": "Skill development training, monthly stipend of up to Rs 1,500/month during training, and placement support.",
    "eligibility": {
      "age_min": 18,
      "age_max": 45,
      "income_limit": 300000,
      "occupation": "unemployed",
      "education": "",
      "category": ""
    },
    "documents": [
      "caste / category certificate",
      "income certificate",
      "Aadhaar card",
      "bank account details"
    ],
    "application_url": "https://pmdaksh.dosje.gov.in/",
    "deadline": "Ongoing",
    "source_url": "https://pmdaksh.dosje.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-029",
    "scheme_name": "Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)",
    "ministry": "Ministry of Rural Development",
    "state": "All India",
    "benefits": "Free residential skill training and placement in wage employment for rural unemployed youth with guaranteed minimum wage.",
    "eligibility": {
      "age_min": 15,
      "age_max": 35,
      "income_limit": null,
      "occupation": "unemployed",
      "education": "",
      "category": ""
    },
    "documents": [
      "BPL card / MGNREGA job card",
      "Aadhaar card",
      "school leaving certificate"
    ],
    "application_url": "https://ddugky.gov.in/",
    "deadline": "Ongoing",
    "source_url": "https://ddugky.gov.in/",
    "last_verified": "2026-09-01"
  },
  {
    "id": "SCH-030",
    "scheme_name": "National Career Service (NCS) Job Portal",
    "ministry": "Ministry of Labour and Employment",
    "state": "All India",
    "benefits": "Free job matching, career counseling, vocational guidance, and skill assessment for job seekers across India.",
    "eligibility": {
      "age_min": 18,
      "age_max": 60,
      "income_limit": null,
      "occupation": "unemployed",
      "education": "",
      "category": ""
    },
    "documents": [
      "resume / qualification certificates",
      "Aadhaar card",
      "mobile number"
    ],
    "application_url": "https://www.ncs.gov.in/",
    "deadline": "Ongoing",
    "source_url": "https://www.ncs.gov.in/",
    "last_verified": "2026-09-01"
  }
];

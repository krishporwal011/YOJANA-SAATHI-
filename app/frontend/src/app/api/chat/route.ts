import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface SchemeInfo {
  scheme_name: string;
  ministry?: string;
  benefits?: string;
  eligibility?: any;
  documents?: string[];
  application_url?: string;
  deadline?: string;
}

function loadVerifiedSchemes(): SchemeInfo[] {
  const fallbackSchemes: SchemeInfo[] = [
    {
      scheme_name: "PM-KISAN Samman Nidhi",
      ministry: "Ministry of Agriculture and Farmers Welfare",
      benefits: "Financial benefit of Rs 6,000 per year in three equal four-monthly installments directly into bank accounts of eligible farmer families.",
      eligibility: { occupation: "farmer", income_limit: null, age_max: null },
      documents: ["land record", "bank passbook", "Aadhaar card"],
      application_url: "https://pmkisan.gov.in/",
      deadline: "Ongoing"
    },
    {
      scheme_name: "Ayushman Bharat PM-JAY",
      ministry: "Ministry of Health and Family Welfare",
      benefits: "Health insurance cover of up to Rs 5,00,000 per family per year for secondary and tertiary care hospitalization.",
      eligibility: { income_limit: 180000, occupation: null, age_max: null },
      documents: ["income certificate", "ration card", "Aadhaar card"],
      application_url: "https://nha.gov.in/PM-JAY",
      deadline: "Ongoing"
    },
    {
      scheme_name: "National Means-cum-Merit Scholarship",
      ministry: "Ministry of Education",
      benefits: "Scholarship amount of Rs 12,000 per annum (Rs 1,000 per month) to meritorious students from economically weaker sections.",
      eligibility: { age_max: 16, occupation: "student", income_limit: 350000 },
      documents: ["school ID", "income certificate", "birth certificate"],
      application_url: "https://scholarships.gov.in/",
      deadline: "2026-10-31"
    }
  ];

  try {
    const possiblePaths = [
      path.join(process.cwd(), "..", "..", "data", "schemes"),
      path.join(process.cwd(), "data", "schemes"),
      path.join(process.cwd(), "..", "data", "schemes")
    ];

    for (const schemesDir of possiblePaths) {
      if (fs.existsSync(schemesDir)) {
        const files = fs.readdirSync(schemesDir).filter(f => f.endsWith(".json"));
        if (files.length > 0) {
          const loaded = files.map(file => {
            const content = fs.readFileSync(path.join(schemesDir, file), "utf-8");
            return JSON.parse(content);
          });
          return loaded;
        }
      }
    }
  } catch (err) {
    console.error("Error reading scheme files for Gemini context:", err);
  }

  return fallbackSchemes;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, userProfile } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const schemesData = loadVerifiedSchemes();

    const systemPrompt = `You are Yojana Saathi AI, an intelligent government scheme assistance chatbot for Indian citizens.
Your job is to help citizens understand government schemes, benefits, eligibility criteria, required documents, and official application steps in simple, clear, and citizen-friendly language.

==================================================
VERIFIED GOVERNMENT SCHEME DATA IN PROJECT:
==================================================
${JSON.stringify(schemesData, null, 2)}
==================================================

CRITICAL RULES & BEHAVIORAL DIRECTIVES:
1. Ground your answers in the verified scheme data above whenever discussing supported schemes.
2. IMPORTANT: You do NOT make final eligibility decisions. The deterministic Yojana Saathi rule engine calculates official eligibility. Always clarify that your answers provide general guidance and that formal verification is done via the Yojana Saathi Eligibility Check.
3. NEVER invent government schemes, eligibility rules, financial benefit amounts, document requirements, deadlines, or official URLs.
4. If a scheme or detail is not present in the verified scheme data, explicitly advise the user that the information should be verified from official government portals (such as india.gov.in or pmkisan.gov.in).
5. Always provide official government portal links (e.g. https://pmkisan.gov.in/, https://nha.gov.in/PM-JAY, https://scholarships.gov.in/) when relevant.
6. Keep answers concise, empathetic, simple, and easy to read. Avoid overly technical jargon.

${userProfile ? `
LOGGED-IN CITIZEN PROFILE CONTEXT (For general guidance reference only):
- Name: ${userProfile.name || 'Ramesh Kumar'}
- State: ${userProfile.state || 'N/A'}
- Income: ₹${userProfile.income ? Number(userProfile.income).toLocaleString('en-IN') : 'N/A'}/year
- Age: ${userProfile.age || 'N/A'}
- Occupation: ${userProfile.occupation || 'N/A'}
- Category: ${userProfile.category || 'N/A'}
- Education: ${userProfile.education || 'N/A'}
Note: Mention that eligibility matching is calculated deterministically by the rule engine.
` : ''}`;

    if (!apiKey) {
      const fallbackReply = generateOfflineFallbackResponse(message, schemesData);
      return NextResponse.json({
        reply: fallbackReply,
        note: "Server Notice: GEMINI_API_KEY is not set in .env.local. Operating in offline verified scheme mode."
      });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const contentsPayload = [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }]
      }
    ];

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: contentsPayload }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", errText);
      const fallbackReply = generateOfflineFallbackResponse(message, schemesData);
      return NextResponse.json({
        reply: fallbackReply,
        warning: "Gemini API returned an error. Operated in verified scheme fallback mode."
      });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      const fallbackReply = generateOfflineFallbackResponse(message, schemesData);
      return NextResponse.json({ reply: fallbackReply });
    }

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("Error in /api/chat route:", error);
    return NextResponse.json(
      { error: "Failed to process AI chat request.", detail: error?.message },
      { status: 500 }
    );
  }
}

function generateOfflineFallbackResponse(userMessage: string, schemes: SchemeInfo[]): string {
  const query = userMessage.toLowerCase();

  if (query.includes("pm-kisan") || query.includes("kisan") || query.includes("farmer")) {
    const s = schemes.find(x => x.scheme_name.includes("PM-KISAN")) || schemes[0];
    return `**PM-KISAN Samman Nidhi**\n\n- **Benefits**: ${s.benefits}\n- **Eligibility**: Farmer families across India.\n- **Required Documents**: Land record, Bank passbook, Aadhaar card.\n- **Official Portal**: [https://pmkisan.gov.in/](https://pmkisan.gov.in/)\n\n*Note: Official eligibility determination is performed by the Yojana Saathi Rule Engine.*`;
  }

  if (query.includes("ayushman") || query.includes("health") || query.includes("pm-jay") || query.includes("pmjay")) {
    const s = schemes.find(x => x.scheme_name.includes("Ayushman")) || schemes[1];
    return `**Ayushman Bharat PM-JAY**\n\n- **Benefits**: ${s.benefits}\n- **Eligibility**: Economically vulnerable families (annual income ≤ ₹1,80,000).\n- **Required Documents**: Income certificate, Ration card, Aadhaar card.\n- **Official Portal**: [https://nha.gov.in/PM-JAY](https://nha.gov.in/PM-JAY)\n\n*Note: Official eligibility determination is performed by the Yojana Saathi Rule Engine.*`;
  }

  if (query.includes("scholarship") || query.includes("student") || query.includes("merit") || query.includes("nmms")) {
    const s = schemes.find(x => x.scheme_name.includes("Scholarship")) || schemes[2];
    return `**National Means-cum-Merit Scholarship**\n\n- **Benefits**: ${s.benefits}\n- **Eligibility**: Meritorious students (age ≤ 16) from low-income families (income ≤ ₹3,50,000/yr).\n- **Required Documents**: School ID, Income certificate, Birth certificate.\n- **Official Portal**: [https://scholarships.gov.in/](https://scholarships.gov.in/)\n\n*Note: Official eligibility determination is performed by the Yojana Saathi Rule Engine.*`;
  }

  return `Hello! I am **Yojana Saathi AI**, your government scheme assistant.\n\nI can help you understand schemes such as **PM-KISAN**, **Ayushman Bharat**, and **National Means-cum-Merit Scholarship**.\n\nYou can ask me:\n- *"What documents are required for PM-KISAN?"*\n- *"What benefits does Ayushman Bharat provide?"*\n- *"Who is eligible for scholarships?"*\n\nFor official eligibility determination, please use the **Check Eligibility Now** tool!`;
}

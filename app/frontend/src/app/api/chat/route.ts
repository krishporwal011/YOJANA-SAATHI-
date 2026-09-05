import { NextResponse } from "next/server";

interface SchemeInfo {
  id?: string;
  scheme_name: string;
  ministry?: string;
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
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function fetchVerifiedSchemesFromBackend(): Promise<SchemeInfo[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/schemes`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.error("Error fetching canonical scheme data from FastAPI backend:", err);
  }

  return [];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, userProfile } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const schemesData = await fetchVerifiedSchemesFromBackend();

    const systemPrompt = `You are Yojana Saathi AI, an intelligent government scheme assistance chatbot for Indian citizens.
Your job is to help citizens understand government schemes, benefits, eligibility criteria, required documents, and official application steps in simple, clear, and citizen-friendly language.

==================================================
VERIFIED GOVERNMENT SCHEME DATA IN PROJECT (${schemesData.length} SCHEMES):
==================================================
${JSON.stringify(schemesData, null, 2)}
==================================================

CRITICAL RULES & BEHAVIORAL DIRECTIVES:
1. Ground your answers in the verified scheme data above whenever discussing supported schemes.
2. IMPORTANT: You do NOT make final eligibility decisions. The deterministic Yojana Saathi rule engine calculates official eligibility. Always clarify that your answers provide general guidance and that formal verification is done via the Yojana Saathi Eligibility Check.
3. NEVER invent government schemes, eligibility rules, financial benefit amounts, document requirements, deadlines, application opening dates, or official URLs.
4. TIME-SENSITIVE / CURRENT OPENING DATES: If the user asks about specific application opening dates, current portal opening status, or dates for specific courses (such as BTech) that are NOT explicitly specified in the verified scheme data above, clearly state: "The verified scheme records available to Yojana Saathi do not contain the specific current opening date." Then direct the user to check the official scheme portal URL provided in the verified data.
5. If a scheme or detail is not present in the verified scheme data, explicitly advise the user that the requested information is not available in the verified dataset and direct them to official government portals (such as india.gov.in, pmkisan.gov.in, or scholarships.gov.in).
6. Always provide official government portal links (e.g. https://pmkisan.gov.in/, https://nha.gov.in/PM-JAY, https://scholarships.gov.in/) when relevant.
7. Keep answers concise, empathetic, simple, and easy to read. Avoid overly technical jargon.

${userProfile ? `
LOGGED-IN CITIZEN PROFILE CONTEXT (For general guidance reference only):
- Name: ${userProfile.name || 'Citizen'}
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

function findMatchingSchemes(userQuery: string, schemes: SchemeInfo[]): { bestMatch?: SchemeInfo; categoryMatches: SchemeInfo[] } {
  const queryLower = userQuery.toLowerCase().trim();
  const cleanQuery = queryLower.replace(/[^a-z0-9\s-]/g, " ");

  // 1. Direct ID match (e.g. "SCH-001", "SCH-002", "sch-001")
  const idMatch = schemes.find(s => s.id && queryLower.includes(s.id.toLowerCase()));
  if (idMatch) return { bestMatch: idMatch, categoryMatches: [idMatch] };

  // 2. Direct scheme name / short alias match (e.g. "PM-KISAN", "PM KISAN", "Ayushman", "NSP")
  for (const s of schemes) {
    if (!s.scheme_name) continue;
    const sNameLower = s.scheme_name.toLowerCase();
    // Check main scheme name or main acronym prefix (like "PM-KISAN", "PM-JAY", "NCS")
    const shortPrefix = sNameLower.split(/\s+/)[0]; // e.g. "pm-kisan"
    const cleanedShortPrefix = shortPrefix.replace(/[^a-z0-9]/g, ""); // e.g. "pmkisan"
    const cleanedQuery = queryLower.replace(/[^a-z0-9]/g, "");

    if (
      queryLower.includes(sNameLower) ||
      (shortPrefix.length >= 3 && queryLower.includes(shortPrefix)) ||
      (cleanedShortPrefix.length >= 4 && cleanedQuery.includes(cleanedShortPrefix))
    ) {
      return { bestMatch: s, categoryMatches: [s] };
    }
  }

  // Stop words to filter out before keyword matching
  const stopWords = new Set([
    "what", "is", "are", "the", "for", "in", "of", "to", "and", "a", "an",
    "tell", "me", "about", "when", "will", "open", "opening", "start", "required",
    "document", "documents", "paper", "papers", "proof", "scheme", "schemes",
    "government", "govt", "details", "info", "information", "can", "i", "get", "how", "apply", "who", "which"
  ]);

  const queryWords = cleanQuery
    .split(/\s+/)
    .filter(w => w.length > 1 && !stopWords.has(w));

  // 3. Keyword scoring across scheme attributes
  let bestMatch: SchemeInfo | undefined;
  let maxScore = 0;
  const categoryMatches: SchemeInfo[] = [];

  for (const s of schemes) {
    let score = 0;
    const sNameLower = (s.scheme_name || "").toLowerCase();
    const ministryLower = (s.ministry || "").toLowerCase();
    const benefitsLower = (s.benefits || "").toLowerCase();
    const occLower = (s.eligibility?.occupation || "").toLowerCase();
    const eduLower = (s.eligibility?.education || "").toLowerCase();
    const catLower = (s.eligibility?.category || "").toLowerCase();

    for (const word of queryWords) {
      if (sNameLower.includes(word)) score += 10;
      if (occLower.includes(word)) score += 8;
      if (eduLower.includes(word)) score += 8;
      if (catLower.includes(word)) score += 6;
      if (ministryLower.includes(word)) score += 5;
      if (benefitsLower.includes(word)) score += 4;
    }

    if (score > 0) {
      categoryMatches.push(s);
      if (score > maxScore) {
        maxScore = score;
        bestMatch = s;
      }
    }
  }

  return { bestMatch: maxScore >= 4 ? bestMatch : undefined, categoryMatches };
}

function generateOfflineFallbackResponse(userMessage: string, schemes: SchemeInfo[]): string {
  if (!schemes || schemes.length === 0) {
    return `Hello! I am **Yojana Saathi AI**, your government scheme assistant.\n\nScheme context is currently unavailable because the backend scheme service is offline. Please start the backend server on port 8000 (\`uvicorn app.backend.api.main:app\`) or verify scheme criteria on official portals like [https://india.gov.in](https://india.gov.in).`;
  }

  const queryLower = userMessage.toLowerCase().trim();
  const isTimeQuestion = /when|opening|open|date|schedule|start|deadline|window|btech/.test(queryLower);
  const isDocQuestion = /document|doc|paper|proof|certificate|require/.test(queryLower);

  const { bestMatch, categoryMatches } = findMatchingSchemes(userMessage, schemes);

  // Scenario A: Matched a specific scheme or best match
  if (bestMatch) {
    const portalUrl = bestMatch.application_url || "https://india.gov.in/";

    // Time-sensitive question about a specific scheme
    if (isTimeQuestion) {
      const deadlineText = bestMatch.deadline ? ` (Verified deadline in records: ${bestMatch.deadline})` : "";
      return `**${bestMatch.scheme_name}**\n\nThe verified scheme records available to Yojana Saathi do not contain the specific current opening date or real-time application window status${deadlineText}.\n\nFor official opening dates and current portal status, please visit the official portal: [${portalUrl}](${portalUrl}).\n\n*Note: Official eligibility verification is performed deterministically by the Yojana Saathi Rule Engine.*`;
    }

    // Document question about a specific scheme
    if (isDocQuestion) {
      const docsList = Array.isArray(bestMatch.documents) && bestMatch.documents.length > 0
        ? bestMatch.documents.map(d => `- ${d}`).join("\n")
        : "- Refer to official portal";
      return `**Required Documents for ${bestMatch.scheme_name}**:\n\n${docsList}\n\nOfficial Portal: [${portalUrl}](${portalUrl})\n\n*Note: Official eligibility verification is performed deterministically by the Yojana Saathi Rule Engine.*`;
    }

    // General query about a specific scheme
    const docsStr = Array.isArray(bestMatch.documents) ? bestMatch.documents.join(", ") : "Refer to official portal";
    return `**${bestMatch.scheme_name}** (${bestMatch.id || ''})\n\n- **Ministry**: ${bestMatch.ministry || "Government of India"}\n- **Benefits**: ${bestMatch.benefits || "N/A"}\n- **Required Documents**: ${docsStr}\n- **Official Portal**: [${portalUrl}](${portalUrl})\n\n*Note: Official eligibility verification is performed deterministically by the Yojana Saathi Rule Engine.*`;
  }

  // Scenario B: Category matches found (e.g. "farmer government schemes" or "student scholarship")
  if (categoryMatches.length > 0) {
    if (isTimeQuestion) {
      const targetScheme = categoryMatches[0];
      const portalUrl = targetScheme.application_url || "https://scholarships.gov.in/";
      return `The verified scheme records available to Yojana Saathi do not contain the specific current opening date for this category/course.\n\nRelevant scheme in records: **${targetScheme.scheme_name}**.\n\nFor official opening dates and real-time portal updates, please check the official portal: [${portalUrl}](${portalUrl}).\n\n*Note: Official eligibility verification is performed deterministically by the Yojana Saathi Rule Engine.*`;
    }

    const schemeList = categoryMatches.slice(0, 4).map(s => 
      `- **${s.scheme_name}** (${s.id || ''}): ${s.benefits || 'Welfare benefit scheme'}`
    ).join("\n");

    return `Here are verified government schemes matching your inquiry from our catalog (${categoryMatches.length} schemes found):\n\n${schemeList}\n\nFor official eligibility determination, please use the **Check Eligibility Now** tool!`;
  }

  // Scenario C: Time-sensitive question with no matched scheme
  if (isTimeQuestion) {
    return `The verified scheme records available to Yojana Saathi do not contain the specific current opening date for that request.\n\nPlease check official government portals like [https://scholarships.gov.in/](https://scholarships.gov.in/) or [https://india.gov.in/](https://india.gov.in/) for live portal updates.`;
  }

  // Scenario D: No match found — Useful clarification prompt
  return `I couldn't find a matching scheme in the verified records for "${userMessage}".\n\nPlease specify the scheme name (e.g. **PM-KISAN**, **Ayushman Bharat**, **SCH-001**) or the benefit/category you are looking for (e.g., farmer support, student scholarship, health insurance).`;
}


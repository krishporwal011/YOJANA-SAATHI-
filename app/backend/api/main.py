import os
import json
import urllib.request
import urllib.parse
from pathlib import Path
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .schemas import LoginRequest, LoginResponse, GoogleLoginRequest, UserProfile, ProfileResponse

app = FastAPI(
    title="Yojana Saathi API",
    description="FastAPI Backend for Yojana Saathi AI - Citizen welfare schemes and profile assistant.",
    version="1.0.0",
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for user profiles (keyed by phone)
PROFILES_DB: Dict[str, UserProfile] = {
    "9000000001": UserProfile(
        name="Ramesh Kumar",
        age=45,
        income=180000.0,
        state="Uttar Pradesh",
        occupation="farmer",
        category="General",
        education="10th pass",
    )
}

DEFAULT_USER_KEY = "9000000001"


class ChatRequest(BaseModel):
    message: str
    user_profile: Optional[Dict[str, Any]] = None


@app.get("/", tags=["Health"])
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "Yojana Saathi API",
        "version": "1.0.0",
    }


@app.post("/api/auth/login", response_model=LoginResponse, tags=["Auth"])
def login(credentials: LoginRequest):
    cleaned_phone = credentials.phone.strip()
    cleaned_otp = credentials.otp.strip()

    if cleaned_phone == "9000000001" and cleaned_otp == "1234":
        return LoginResponse(
            success=True,
            message="Demo login successful!",
            phone=cleaned_phone,
            token="demo-session-token-1234",
        )

    if cleaned_otp == "1234":
        if cleaned_phone not in PROFILES_DB:
            PROFILES_DB[cleaned_phone] = UserProfile(name="")
        return LoginResponse(
            success=True,
            message=f"Logged in successfully with phone {cleaned_phone}.",
            phone=cleaned_phone,
            token=f"demo-token-{cleaned_phone}",
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials. Use demo phone '9000000001' and code '1234'.",
    )


@app.post("/api/auth/google", response_model=LoginResponse, tags=["Auth"])
def google_login(payload: GoogleLoginRequest):
    email = (payload.email or "citizen.google@gmail.com").strip()
    name = (payload.name or "Google Citizen").strip()

    if email not in PROFILES_DB:
        PROFILES_DB[email] = UserProfile(
            name=name,
            age=30,
            income=200000.0,
            state="Delhi (NCT)",
            occupation="other",
            category="General",
            education="Graduate (Bachelor's)",
        )

    return LoginResponse(
        success=True,
        message="Google login successful!",
        phone=email,
        token=f"google-session-token-{email}",
    )


@app.get("/api/profile", response_model=ProfileResponse, tags=["Profile"])
def get_profile(phone: str = DEFAULT_USER_KEY):
    profile = PROFILES_DB.get(phone)
    if not profile:
        profile = UserProfile()
        PROFILES_DB[phone] = profile

    return ProfileResponse(
        success=True,
        message="Profile retrieved successfully.",
        profile=profile,
    )


@app.post("/api/profile", response_model=ProfileResponse, tags=["Profile"])
def update_profile(profile_data: UserProfile, phone: str = DEFAULT_USER_KEY):
    PROFILES_DB[phone] = profile_data
    return ProfileResponse(
        success=True,
        message="Profile updated successfully.",
        profile=profile_data,
    )


@app.get("/api/schemes", tags=["Schemes"])
def list_starter_schemes() -> List[Dict[str, Any]]:
    schemes_dir = Path(__file__).resolve().parents[3] / "data" / "schemes"
    schemes = []

    if schemes_dir.exists():
        for file in sorted(schemes_dir.glob("*.json")):
            try:
                with open(file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    schemes.append(data)
            except Exception as e:
                schemes.append({"error": f"Failed to load {file.name}: {str(e)}"})

    return schemes


@app.post("/api/ai/chat", tags=["AI"])
def ai_chat(req: ChatRequest):
    """
    FastAPI backend endpoint calling Gemini Flash API server-side.
    Uses process environment variable GEMINI_API_KEY securely.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    user_msg = req.message.strip()

    if not user_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # Load schemes for context
    schemes = list_starter_schemes()
    
    system_prompt = (
        "You are Yojana Saathi AI, a government scheme guidance assistant.\n"
        "Help citizens understand government schemes, benefits, eligibility criteria, required documents, and application steps in simple language.\n"
        "Be concise, simple, and citizen-friendly.\n"
        "Never claim a citizen is definitely eligible unless the deterministic eligibility engine has provided that result.\n"
        "Do not invent government schemes, eligibility rules, benefits, application URLs, documents, or deadlines.\n"
        "When discussing a scheme, prefer verified scheme data.\n"
        "Always direct citizens to official government portals.\n\n"
        f"VERIFIED SCHEME DATA: {json.dumps(schemes[:10])}\n"
    )

    if not api_key:
        return {
            "reply": f"Hello! I am **Yojana Saathi AI**.\n\nFor **{user_msg}**, please check official portals like [https://pmkisan.gov.in/](https://pmkisan.gov.in/) or [https://scholarships.gov.in/](https://scholarships.gov.in/).\n\n*(Notice: Server operating in offline verified scheme mode. Set GEMINI_API_KEY to enable live Gemini Flash API).*",
            "offline": True
        }

    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{system_prompt}\nUser Question: {user_msg}"}
                ]
            }
        ]
    }

    try:
        req_data = json.dumps(payload).encode("utf-8")
        request = urllib.request.Request(
            gemini_url,
            data=req_data,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(request, timeout=10) as resp:
            resp_data = json.loads(resp.read().decode("utf-8"))
            reply_text = resp_data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            if not reply_text:
                reply_text = "Thank you for your question. Please verify criteria on the official portal."
            return {"reply": reply_text, "offline": False}
    except Exception as e:
        return {
            "reply": "Sorry, I could not complete the live AI request. Please check your network connection or verify criteria using the Eligibility Check tool.",
            "error": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.backend.api.main:app", host="0.0.0.0", port=8000, reload=True)

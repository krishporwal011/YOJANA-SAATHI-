import os
import json
import urllib.request
import urllib.parse
from pathlib import Path
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, status, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .schemas import LoginRequest, LoginResponse, GoogleLoginRequest, UserProfile, ProfileResponse
from app.backend.eligibility.router import router as eligibility_router
from app.backend.ai.router import router as ai_router

app = FastAPI(
    title="Yojana Saathi API",
    description="FastAPI Backend for Yojana Saathi AI - Citizen welfare schemes and profile assistant.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS configuration
# ---------------------------------------------------------------------------
# Browser -> backend calls (eligibility check, schemes, auth) require the exact
# request Origin to appear in the allowlist. Origin values are compared by exact
# string match, so "https://example.com/" (trailing slash) does NOT match the
# Origin header "https://example.com" and the preflight is rejected with no
# Access-Control-Allow-Origin header. Every configured value is therefore
# normalized before use.

# Known production frontend. Kept as a built-in default so the deployed site
# keeps working even if FRONTEND_URL is missing or misconfigured on Render.
PRODUCTION_FRONTEND_ORIGINS = [
    "https://yojana-saathi-hazel.vercel.app",
]

DEFAULT_LOCAL_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]


def _normalize_origin(value: str) -> str:
    """Trim whitespace/quotes and strip trailing slashes from an origin value."""
    return value.strip().strip('"').strip("'").rstrip("/")


# FRONTEND_URL may hold a single origin or a comma-separated list.
frontend_url_env = os.getenv("FRONTEND_URL", "")
configured_origins = [
    _normalize_origin(origin)
    for origin in frontend_url_env.split(",")
    if _normalize_origin(origin)
]

allowed_origins: List[str] = []
for origin in configured_origins + PRODUCTION_FRONTEND_ORIGINS + DEFAULT_LOCAL_ORIGINS:
    if origin not in allowed_origins:
        allowed_origins.append(origin)

# Optional: allow Vercel preview deployments (https://<branch>-<hash>.vercel.app).
# Disabled by default; set ALLOW_VERCEL_PREVIEW_ORIGINS=true on Render to enable.
allow_origin_regex = (
    r"https://[a-z0-9-]+\.vercel\.app"
    if os.getenv("ALLOW_VERCEL_PREVIEW_ORIGINS", "").strip().lower() in {"1", "true", "yes"}
    else None
)

# NOTE: allow_origins=["*"] is intentionally never used here, because it is
# invalid in combination with allow_credentials=True.
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allow_origin_regex,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
    max_age=600,
)

app.include_router(eligibility_router)
app.include_router(ai_router)



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


@app.head("/", tags=["Health"])
@app.head("/api/health", tags=["Health"])
def health_check_head():
    return Response(status_code=200)



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
                    if isinstance(data, dict):
                        if "id" not in data or not data["id"]:
                            data["id"] = file.stem
                        schemes.append(data)
            except Exception:
                pass

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
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The AI guidance service is temporarily unavailable. Please try again later or use the deterministic Eligibility Check tool."
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.backend.api.main:app", host="0.0.0.0", port=8000, reload=True)
import os
import json
from pathlib import Path
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from .schemas import LoginRequest, LoginResponse, UserProfile, ProfileResponse

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

# In-memory storage for user profiles (keyed by phone or session)
# Pre-seeded with a starter profile for the demo phone: 9000000001
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

# Active demo user session fallback
DEFAULT_USER_KEY = "9000000001"


@app.get("/", tags=["Health"])
@app.get("/api/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify backend status."""
    return {
        "status": "healthy",
        "service": "Yojana Saathi API",
        "version": "1.0.0",
    }


@app.post("/api/auth/login", response_model=LoginResponse, tags=["Auth"])
def login(credentials: LoginRequest):
    """
    Demo login endpoint:
    - Fixed demo phone: 9000000001
    - Fixed demo code: 1234
    """
    cleaned_phone = credentials.phone.strip()
    cleaned_otp = credentials.otp.strip()

    # Demo verification logic
    if cleaned_phone == "9000000001" and cleaned_otp == "1234":
        return LoginResponse(
            success=True,
            message="Demo login successful!",
            phone=cleaned_phone,
            token="demo-session-token-1234",
        )

    # Friendly check for non-demo numbers or wrong OTP
    if cleaned_otp == "1234":
        # Allow other phone numbers for testing flexibility if otp is 1234
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


@app.get("/api/profile", response_model=ProfileResponse, tags=["Profile"])
def get_profile(phone: str = DEFAULT_USER_KEY):
    """
    Retrieve stored profile details:
    - name, age, income, state, occupation, category, education
    """
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
    """
    Save or update citizen profile details:
    - name
    - age
    - income
    - state
    - occupation
    - category
    - education
    """
    PROFILES_DB[phone] = profile_data
    return ProfileResponse(
        success=True,
        message="Profile updated successfully.",
        profile=profile_data,
    )


@app.get("/api/schemes", tags=["Schemes"])
def list_starter_schemes() -> List[Dict[str, Any]]:
    """
    Helper endpoint to read and preview starter schemes from data/schemes/
    """
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.backend.api.main:app", host="0.0.0.0", port=8000, reload=True)

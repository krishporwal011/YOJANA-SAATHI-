from typing import Optional
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    phone: str = Field(..., description="10-digit mobile number, e.g., 9000000001")
    otp: str = Field(..., description="Verification code, e.g., 1234")


class LoginResponse(BaseModel):
    success: bool
    message: str
    phone: Optional[str] = None
    token: Optional[str] = None


class GoogleLoginRequest(BaseModel):
    token: str = Field(..., description="Google ID token or session token")
    email: Optional[str] = Field("citizen.google@gmail.com", description="User Google email")
    name: Optional[str] = Field("Google Citizen", description="User Google name")


class UserProfile(BaseModel):
    name: str = Field("", description="Citizen full name")
    age: Optional[int] = Field(None, description="Citizen age in years")
    income: Optional[float] = Field(None, description="Annual family income in INR")
    state: Optional[str] = Field("", description="State / UT of residence")
    occupation: Optional[str] = Field("", description="Current primary occupation")
    category: Optional[str] = Field("", description="Social category (General, OBC, SC, ST, EWS)")
    education: Optional[str] = Field("", description="Highest education level")


class ProfileResponse(BaseModel):
    success: bool
    message: str
    profile: UserProfile

from typing import Optional, List
from pydantic import BaseModel, Field, field_validator


class CitizenProfileInput(BaseModel):
    age: Optional[int] = Field(None, description="Citizen age in years")
    income: Optional[float] = Field(None, description="Annual family income in INR")
    state: Optional[str] = Field("", description="State / UT of residence")
    occupation: Optional[str] = Field("", description="Current primary occupation")
    category: Optional[str] = Field("", description="Social category (General, OBC, SC, ST, EWS)")
    education: Optional[str] = Field("", description="Highest education level")
    confirmed_documents: Optional[List[str]] = Field(
        default_factory=lambda: ["land record", "bank passbook", "ration card"],
        description="List of confirmed/uploaded documents for verification"
    )

    @field_validator("confirmed_documents", mode="before")
    def default_documents_if_none(cls, v):
        if v is None:
            return ["land record", "bank passbook", "ration card"]
        return v


class CriterionResult(BaseModel):
    criterion: str = Field(..., description="Name of checked criterion (e.g. age_max, income_limit)")
    passed: bool = Field(..., description="True if criterion passed, False otherwise")
    details: str = Field(..., description="Details regarding pass/fail evaluation")


class SchemeEligibilityResult(BaseModel):
    scheme_id: str = Field(..., description="Scheme identifier (e.g. SCH-001)")
    scheme_name: str = Field(..., description="Official scheme name")
    status: str = Field(..., description="Overall status: MATCH, NEEDS VERIFICATION, or NOT MATCHED")
    criteria_results: List[CriterionResult] = Field(default_factory=list, description="Results for each checked criterion")
    reason: Optional[str] = Field(None, description="Reason for NOT MATCHED or NEEDS VERIFICATION")
    missing_documents: List[str] = Field(default_factory=list, description="Missing or unconfirmed documents")


class EligibilityCheckResponse(BaseModel):
    success: bool = True
    message: str = "Eligibility check completed successfully."
    results: List[SchemeEligibilityResult] = Field(default_factory=list)

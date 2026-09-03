from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class RoadmapStep(BaseModel):
    step_number: int = Field(..., description="Ordered step index (1, 2, 3...)")
    title: str = Field(..., description="Short summary of the action step")
    description: str = Field(..., description="Detailed instructions for the citizen")
    action_url: Optional[str] = Field(None, description="Official portal link if applicable")


class DocumentGapResult(BaseModel):
    required_documents: List[str] = Field(default_factory=list, description="Documents required by the scheme")
    confirmed_documents: List[str] = Field(default_factory=list, description="Documents already confirmed by the citizen")
    missing_documents: List[str] = Field(default_factory=list, description="Documents required but not yet confirmed")
    all_documents_present: bool = Field(True, description="True if citizen has all required documents")


class AIExplanationResult(BaseModel):
    scheme_id: str = Field(..., description="Identifier for the scheme (e.g. SCH-001)")
    scheme_name: str = Field(..., description="Official scheme name")
    status: str = Field(..., description="Eligibility status (MATCH, NEEDS VERIFICATION, NOT MATCHED)")
    explanation: str = Field(..., description="Plain-language, factual explanation grounded in scheme data")
    benefits_summary: Optional[str] = Field(None, description="Direct summary of scheme benefits from scheme JSON")
    ministry: Optional[str] = Field(None, description="Administering ministry")
    required_documents: List[str] = Field(default_factory=list, description="All required documents")
    missing_documents: List[str] = Field(default_factory=list, description="Missing or unconfirmed documents")
    roadmap: List[RoadmapStep] = Field(default_factory=list, description="Ordered 2-4 step action roadmap")
    application_url: Optional[str] = Field(None, description="Official application URL")


class AIExplanationRequest(BaseModel):
    scheme_id: str = Field(..., description="Scheme identifier to explain")
    profile: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Citizen profile details")
    eligibility_result: Optional[Dict[str, Any]] = Field(default_factory=dict, description="B's eligibility check result")


class BatchAIExplanationRequest(BaseModel):
    profile: Dict[str, Any] = Field(..., description="Citizen profile details")
    eligibility_results: List[Dict[str, Any]] = Field(..., description="List of B's eligibility check results")


class AIExplanationResponse(BaseModel):
    success: bool = True
    message: str = "AI explanation and roadmap generated successfully."
    guidance: AIExplanationResult


class BatchAIExplanationResponse(BaseModel):
    success: bool = True
    message: str = "AI explanations and roadmaps generated successfully."
    results: List[AIExplanationResult]

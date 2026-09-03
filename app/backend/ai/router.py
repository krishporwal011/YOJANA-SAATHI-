from fastapi import APIRouter, FastAPI
from typing import List, Dict, Any
from .schemas import (
    AIExplanationRequest,
    AIExplanationResponse,
    BatchAIExplanationRequest,
    BatchAIExplanationResponse,
)
from .service import generate_ai_guidance, generate_ai_guidance_for_all

router = APIRouter(prefix="/api/ai", tags=["AI Explanation & Guidance"])


@router.post("/explain", response_model=AIExplanationResponse)
def explain_scheme_endpoint(request: AIExplanationRequest):
    """
    Generate grounded AI explanation, document gap analysis, and action roadmap for a single scheme.
    """
    guidance = generate_ai_guidance(
        profile=request.profile,
        eligibility_result=request.eligibility_result,
        scheme_id=request.scheme_id,
    )
    return AIExplanationResponse(
        success=True,
        message="AI explanation and roadmap generated successfully.",
        guidance=guidance,
    )


@router.post("/explain-all", response_model=BatchAIExplanationResponse)
def explain_all_schemes_endpoint(request: BatchAIExplanationRequest):
    """
    Generate grounded AI explanations and action roadmaps for all evaluated schemes.
    """
    results = generate_ai_guidance_for_all(
        profile=request.profile,
        eligibility_results=request.eligibility_results,
    )
    return BatchAIExplanationResponse(
        success=True,
        message="AI explanations and roadmaps generated successfully.",
        results=results,
    )


# Standalone app instance for local testing
app = FastAPI(
    title="AI Explanation & Guidance API",
    description="Person C: RAG grounding, document gap analysis, explanation, and action roadmap engine.",
    version="1.0.0",
)
app.include_router(router)

from fastapi import APIRouter, FastAPI
from .schemas import CitizenProfileInput, EligibilityCheckResponse
from .engine import check_eligibility_for_all_schemes

router = APIRouter(prefix="/api/eligibility", tags=["Eligibility"])


@router.post("/check", response_model=EligibilityCheckResponse)
@router.post("/", response_model=EligibilityCheckResponse)
def check_eligibility_endpoint(profile: CitizenProfileInput):
    """
    Backend eligibility check endpoint:
    Accepts a citizen profile and evaluates eligibility against the starter schemes.
    """
    results = check_eligibility_for_all_schemes(profile)
    return EligibilityCheckResponse(
        success=True,
        message="Eligibility check completed successfully.",
        results=results,
    )


# Standalone FastAPI app instance for testing and running uvicorn from this package directly
app = FastAPI(
    title="Eligibility Rules Engine API",
    description="Deterministic Eligibility Engine for Yojana Saathi schemes.",
    version="1.0.0",
)
app.include_router(router)

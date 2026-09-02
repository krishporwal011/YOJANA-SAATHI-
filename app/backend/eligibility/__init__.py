"""
Eligibility Engine Package for Yojana Saathi.
Work isolated within app/backend/eligibility.
"""
from .schemas import CitizenProfileInput, SchemeEligibilityResult, EligibilityCheckResponse
from .engine import check_eligibility_for_all_schemes
from .router import router, app

__all__ = [
    "CitizenProfileInput",
    "SchemeEligibilityResult",
    "EligibilityCheckResponse",
    "check_eligibility_for_all_schemes",
    "router",
    "app",
]

"""
YOJANA-SAATHI AI Module (Person C)
- AI explanation grounded in scheme JSON
- RAG grounding (simple JSON lookup)
- Document gap analysis
- Action roadmap generation
"""

from .schemas import (
    RoadmapStep,
    DocumentGapResult,
    AIExplanationResult,
    AIExplanationRequest,
    AIExplanationResponse,
    BatchAIExplanationRequest,
    BatchAIExplanationResponse,
)
from .rag import (
    load_scheme_by_id,
    load_all_schemes,
)
from .document_gap import (
    analyze_document_gaps,
)
from .explanation import (
    generate_grounded_explanation,
)
from .roadmap import (
    generate_action_roadmap,
)
from .service import (
    generate_ai_guidance,
    generate_ai_guidance_for_all,
)
from .router import (
    router,
    app,
)

__all__ = [
    "RoadmapStep",
    "DocumentGapResult",
    "AIExplanationResult",
    "AIExplanationRequest",
    "AIExplanationResponse",
    "BatchAIExplanationRequest",
    "BatchAIExplanationResponse",
    "load_scheme_by_id",
    "load_all_schemes",
    "analyze_document_gaps",
    "generate_grounded_explanation",
    "generate_action_roadmap",
    "generate_ai_guidance",
    "generate_ai_guidance_for_all",
    "router",
    "app",
]

from typing import Dict, Any, Optional, List, Union
from .schemas import (
    AIExplanationResult,
    DocumentGapResult,
    RoadmapStep,
)
from .rag import load_scheme_by_id, load_all_schemes
from .document_gap import analyze_document_gaps
from .explanation import generate_grounded_explanation
from .roadmap import generate_action_roadmap


def _extract_dict(obj: Any) -> Dict[str, Any]:
    """Helper to safely extract dict from Pydantic model or dict."""
    if obj is None:
        return {}
    if hasattr(obj, "model_dump"):
        return obj.model_dump()
    if hasattr(obj, "dict"):
        return obj.dict()
    if isinstance(obj, dict):
        return obj
    return {}


def generate_ai_guidance(
    profile: Union[Dict[str, Any], Any],
    eligibility_result: Union[Dict[str, Any], Any],
    scheme_id: Optional[str] = None
) -> AIExplanationResult:
    """
    Core AI Guidance Service for Person C.
    Takes citizen profile and Person B's eligibility evaluation for a scheme,
    grounds against scheme JSON facts, and returns:
    - plain-language explanation of why matched / needs verification / did not match
    - document gap analysis
    - ordered 2-4 step action roadmap (or empty for NOT MATCHED)
    - direct link to official portal
    """
    prof_dict = _extract_dict(profile)
    res_dict = _extract_dict(eligibility_result)

    target_id = scheme_id or res_dict.get("scheme_id") or "SCH-001"
    
    # 1. RAG Context: Fetch scheme ground truth from JSON
    scheme_data = load_scheme_by_id(target_id) or {}
    scheme_name = (
        scheme_data.get("scheme_name") 
        or res_dict.get("scheme_name") 
        or target_id
    )

    # 2. Authoritative Status from Person B (AI NEVER overrides)
    status = (res_dict.get("status") or "NOT MATCHED").strip().upper()
    criteria_results = res_dict.get("criteria_results") or []
    rule_reason = res_dict.get("reason")

    # 3. Document Gap Analysis
    required_docs = scheme_data.get("documents", [])
    confirmed_docs = prof_dict.get("confirmed_documents", [])
    doc_gap = analyze_document_gaps(required_docs, confirmed_docs)

    # If eligibility result already specified missing documents, incorporate them
    if res_dict.get("missing_documents"):
        for d in res_dict.get("missing_documents", []):
            if d not in doc_gap.missing_documents:
                doc_gap.missing_documents.append(d)

    # 4. Generate Grounded AI Explanation
    explanation_text = generate_grounded_explanation(
        status=status,
        scheme_data=scheme_data,
        criteria_results=criteria_results,
        document_gap=doc_gap,
        profile=prof_dict,
        rule_reason=rule_reason,
    )

    # 5. Generate Ordered Action Roadmap
    roadmap = generate_action_roadmap(
        status=status,
        scheme_data=scheme_data,
        document_gap=doc_gap,
    )

    app_url = scheme_data.get("application_url")

    return AIExplanationResult(
        scheme_id=target_id,
        scheme_name=scheme_name,
        status=status,
        explanation=explanation_text,
        benefits_summary=scheme_data.get("benefits"),
        ministry=scheme_data.get("ministry"),
        required_documents=doc_gap.required_documents,
        missing_documents=doc_gap.missing_documents,
        roadmap=roadmap,
        application_url=app_url if status != "NOT MATCHED" else None,
    )


def generate_ai_guidance_for_all(
    profile: Union[Dict[str, Any], Any],
    eligibility_results: List[Union[Dict[str, Any], Any]]
) -> List[AIExplanationResult]:
    """
    Processes all eligibility results produced by Person B and returns full AI guidance for each.
    """
    guidance_list: List[AIExplanationResult] = []
    for res in eligibility_results:
        guidance = generate_ai_guidance(profile=profile, eligibility_result=res)
        guidance_list.append(guidance)
    return guidance_list

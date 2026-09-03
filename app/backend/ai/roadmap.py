from typing import List, Dict, Any, Optional
from .schemas import RoadmapStep, DocumentGapResult


def generate_action_roadmap(
    status: str,
    scheme_data: Dict[str, Any],
    document_gap: DocumentGapResult
) -> List[RoadmapStep]:
    """
    Generates an ordered 2-4 step action roadmap.
    - If status is MATCH: Document verification -> Submit application on official portal.
    - If status is NEEDS VERIFICATION: Obtain missing document -> Upload/provide document -> Apply on official portal.
    - If status is NOT MATCHED: No application roadmap provided (empty list).
    - The final roadmap step for actionable statuses must direct to the scheme's application_url.
    """
    norm_status = (status or "").strip().upper()

    # Rule: If status is NOT MATCHED, do NOT provide an application roadmap
    if norm_status == "NOT MATCHED":
        return []

    scheme_name = scheme_data.get("scheme_name", "the scheme")
    app_url = scheme_data.get("application_url") or scheme_data.get("source_url") or "https://india.gov.in"
    required_docs = document_gap.required_documents
    missing_docs = document_gap.missing_documents

    roadmap: List[RoadmapStep] = []

    if norm_status == "NEEDS VERIFICATION":
        # Missing document resolution workflow (2-4 steps)
        missing_doc_str = ", ".join(missing_docs) if missing_docs else "income certificate"
        
        # Step 1: Obtain the missing document(s)
        roadmap.append(
            RoadmapStep(
                step_number=1,
                title=f"Obtain Missing Document ({missing_doc_str})",
                description=(
                    f"Procure your official {missing_doc_str} from your local revenue authority, "
                    f"Tehsil/Panchayat office, or state citizen service portal."
                ),
                action_url=None
            )
        )

        # Step 2: Upload / Provide for verification
        roadmap.append(
            RoadmapStep(
                step_number=2,
                title="Upload & Verify Document",
                description=(
                    f"Upload or present your verified {missing_doc_str} along with existing confirmed documents "
                    f"to complete the eligibility verification."
                ),
                action_url=None
            )
        )

        # Step 3: Apply on the official scheme portal
        roadmap.append(
            RoadmapStep(
                step_number=3,
                title=f"Apply on Official {scheme_name} Portal",
                description=(
                    f"Visit the official {scheme_name} government portal to fill out and submit your application."
                ),
                action_url=app_url
            )
        )

        return roadmap

    elif norm_status == "MATCH":
        # Direct matched roadmap (2-3 steps)
        docs_summary = ", ".join(required_docs) if required_docs else "confirmed identity and profile proofs"

        # Step 1: Prepare documents
        roadmap.append(
            RoadmapStep(
                step_number=1,
                title="Prepare Required Documents",
                description=(
                    f"Keep ready your confirmed documents: {docs_summary}. "
                    "Ensure names and account details match your official records."
                ),
                action_url=None
            )
        )

        # Step 2: Apply on official portal
        roadmap.append(
            RoadmapStep(
                step_number=2,
                title=f"Apply on Official {scheme_name} Portal",
                description=(
                    f"Navigate to the official {scheme_name} portal at {app_url} to register or submit your application online."
                ),
                action_url=app_url
            )
        )

        return roadmap

    return []

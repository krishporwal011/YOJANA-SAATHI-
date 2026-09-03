from typing import Dict, Any, Optional, List
from .schemas import DocumentGapResult


def generate_grounded_explanation(
    status: str,
    scheme_data: Dict[str, Any],
    criteria_results: Optional[List[Dict[str, Any]]],
    document_gap: DocumentGapResult,
    profile: Optional[Dict[str, Any]] = None,
    rule_reason: Optional[str] = None,
) -> str:
    """
    Generates a factual, plain-language explanation of eligibility.
    Grounded ONLY in actual scheme JSON data and criteria results from the rule engine.
    Never overrides the engine status.
    """
    scheme_name = scheme_data.get("scheme_name", "the scheme")
    ministry = scheme_data.get("ministry", "")
    benefits = scheme_data.get("benefits", "")
    eligibility_spec = scheme_data.get("eligibility", {})
    
    # Normalize status
    norm_status = (status or "").strip().upper()

    if norm_status == "MATCH":
        # Passed all criteria and all documents verified
        passed_points = []
        if criteria_results:
            for cr in criteria_results:
                crit_name = cr.get("criterion", "")
                details = cr.get("details", "")
                if cr.get("passed", True) and details:
                    passed_points.append(details)

        explanation_parts = [
            f"You are eligible for {scheme_name}."
        ]
        
        if passed_points:
            criteria_summary = "; ".join(passed_points)
            explanation_parts.append(f"All eligibility requirements are satisfied: {criteria_summary}.")
        elif rule_reason:
            explanation_parts.append(f"{rule_reason}.")
        else:
            explanation_parts.append("All profile eligibility criteria and documentation requirements are met.")

        if document_gap.required_documents:
            docs_str = ", ".join(document_gap.required_documents)
            explanation_parts.append(f"All required documents ({docs_str}) are confirmed.")

        if benefits:
            explanation_parts.append(f"Scheme Benefit: {benefits}")

        return " ".join(explanation_parts)

    elif norm_status == "NEEDS VERIFICATION":
        # Criteria passed or conditional, but documents or details need verification
        missing_docs = document_gap.missing_documents
        missing_str = ", ".join(missing_docs) if missing_docs else "income certificate or proof"

        explanation_parts = [
            f"You potentially qualify for {scheme_name}, but verification is required before your application can be finalized."
        ]

        if missing_docs:
            explanation_parts.append(
                f"Your profile matches the basic eligibility criteria, but the following required document(s) are missing or need verification: {missing_str}."
            )
        elif rule_reason:
            explanation_parts.append(f"Verification is needed: {rule_reason}.")
        else:
            explanation_parts.append("Please upload or verify the pending documents to complete your qualification.")

        if benefits:
            explanation_parts.append(f"Scheme Benefit: {benefits}")

        return " ".join(explanation_parts)

    elif norm_status == "NOT MATCHED":
        # One or more hard criteria failed
        failed_details = []
        if criteria_results:
            for cr in criteria_results:
                if not cr.get("passed", True):
                    failed_details.append(cr.get("details", cr.get("criterion", "")))

        explanation_parts = [
            f"You do not match the eligibility criteria for {scheme_name}."
        ]

        if failed_details:
            explanation_parts.append(f"Reason: {'; '.join(failed_details)}.")
        elif rule_reason:
            explanation_parts.append(f"Reason: {rule_reason}.")
        else:
            # Fallback based on eligibility spec
            age_max = eligibility_spec.get("age_max")
            if age_max and profile and profile.get("age") and profile.get("age") > age_max:
                explanation_parts.append(
                    f"Your age ({profile.get('age')} years) exceeds the maximum age limit of {age_max} years."
                )
            else:
                explanation_parts.append("One or more mandatory eligibility requirements were not met.")

        return " ".join(explanation_parts)

    else:
        # Fallback generic explanation maintaining safety
        return f"Eligibility evaluation for {scheme_name}: {norm_status}."

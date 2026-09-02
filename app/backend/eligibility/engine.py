import os
import json
from pathlib import Path
from typing import Dict, List, Any
from .schemas import CitizenProfileInput, CriterionResult, SchemeEligibilityResult


def load_starter_schemes() -> Dict[str, dict]:
    """
    Reads the existing scheme JSON files from data/schemes.
    Does not modify any scheme JSON data.
    """
    # Try locating data/schemes relative to this file location first
    current_path = Path(__file__).resolve()
    # Path hierarchy: .../app/backend/eligibility/engine.py -> parents[3] is project root
    base_dir = current_path.parents[3] if len(current_path.parents) > 3 else Path(os.getcwd())
    schemes_dir = base_dir / "data" / "schemes"

    if not schemes_dir.exists():
        schemes_dir = Path(os.getcwd()) / "data" / "schemes"

    schemes: Dict[str, dict] = {}
    if schemes_dir.exists():
        for file in sorted(schemes_dir.glob("*.json")):
            scheme_id = file.stem  # SCH-001, SCH-002, etc.
            try:
                with open(file, "r", encoding="utf-8") as f:
                    schemes[scheme_id] = json.load(f)
            except Exception:
                pass
    return schemes


def evaluate_scheme(scheme_id: str, scheme_data: dict, profile: CitizenProfileInput) -> SchemeEligibilityResult:
    """
    Evaluates a single scheme using deterministic if/else rules.
    Checks only the eligibility criteria specified for that scheme:
    - age_min / age_max
    - income_limit
    - occupation
    - category
    - education

    Status determination:
    - NOT MATCHED: Any hard eligibility criterion fails.
    - NEEDS VERIFICATION: All criteria pass, but a required document is missing/unconfirmed.
    - MATCH: All criteria pass and no required document is missing/unconfirmed.
    """
    scheme_name = scheme_data.get("scheme_name", scheme_id)
    eligibility_spec = scheme_data.get("eligibility", {})
    required_docs = scheme_data.get("documents", [])

    confirmed_docs_lower = [
        doc.strip().lower() for doc in (profile.confirmed_documents or [])
    ]

    criteria_results: List[CriterionResult] = []
    failed_criteria: List[CriterionResult] = []

    # 1. age_min criterion
    age_min = eligibility_spec.get("age_min")
    if age_min is not None and isinstance(age_min, (int, float)):
        if profile.age is None:
            res = CriterionResult(
                criterion="age_min",
                passed=False,
                details=f"age not specified in profile (minimum required: {age_min})"
            )
        elif profile.age < age_min:
            res = CriterionResult(
                criterion="age_min",
                passed=False,
                details=f"age {profile.age} is below minimum age limit of {age_min}"
            )
        else:
            res = CriterionResult(
                criterion="age_min",
                passed=True,
                details=f"age {profile.age} satisfies minimum age of {age_min}"
            )
        criteria_results.append(res)
        if not res.passed:
            failed_criteria.append(res)

    # 2. age_max criterion
    age_max = eligibility_spec.get("age_max")
    if age_max is not None and isinstance(age_max, (int, float)):
        if profile.age is None:
            res = CriterionResult(
                criterion="age_max",
                passed=False,
                details=f"age not specified in profile (maximum required: {age_max})"
            )
        elif profile.age > age_max:
            res = CriterionResult(
                criterion="age_max",
                passed=False,
                details=f"age {profile.age} is above the age limit"
            )
        else:
            res = CriterionResult(
                criterion="age_max",
                passed=True,
                details=f"age {profile.age} satisfies maximum age limit of {age_max}"
            )
        criteria_results.append(res)
        if not res.passed:
            failed_criteria.append(res)

    # 3. income_limit criterion
    income_limit = eligibility_spec.get("income_limit")
    if income_limit is not None and isinstance(income_limit, (int, float)):
        if profile.income is None:
            res = CriterionResult(
                criterion="income_limit",
                passed=False,
                details=f"income not specified in profile (limit: {income_limit})"
            )
        elif profile.income > income_limit:
            res = CriterionResult(
                criterion="income_limit",
                passed=False,
                details=f"income {profile.income} exceeds limit of {income_limit}"
            )
        else:
            res = CriterionResult(
                criterion="income_limit",
                passed=True,
                details=f"income {profile.income} is within limit of {income_limit}"
            )
        criteria_results.append(res)
        if not res.passed:
            failed_criteria.append(res)

    # 4. occupation criterion
    target_occ = eligibility_spec.get("occupation")
    if target_occ is not None and str(target_occ).strip() != "":
        target_occ_str = str(target_occ).strip().lower()
        prof_occ_str = (profile.occupation or "").strip().lower()
        if not prof_occ_str:
            res = CriterionResult(
                criterion="occupation",
                passed=False,
                details=f"occupation not specified in profile (required: '{target_occ}')"
            )
        elif prof_occ_str != target_occ_str and target_occ_str not in prof_occ_str:
            res = CriterionResult(
                criterion="occupation",
                passed=False,
                details=f"occupation '{profile.occupation}' does not match required occupation '{target_occ}'"
            )
        else:
            res = CriterionResult(
                criterion="occupation",
                passed=True,
                details=f"occupation '{profile.occupation}' matches required occupation '{target_occ}'"
            )
        criteria_results.append(res)
        if not res.passed:
            failed_criteria.append(res)

    # 5. category criterion
    target_cat = eligibility_spec.get("category")
    if target_cat is not None and str(target_cat).strip() != "":
        target_cat_str = str(target_cat).strip().lower()
        prof_cat_str = (profile.category or "").strip().lower()
        if not prof_cat_str:
            res = CriterionResult(
                criterion="category",
                passed=False,
                details=f"category not specified in profile (required: '{target_cat}')"
            )
        elif prof_cat_str != target_cat_str and target_cat_str != "all":
            res = CriterionResult(
                criterion="category",
                passed=False,
                details=f"category '{profile.category}' does not match required category '{target_cat}'"
            )
        else:
            res = CriterionResult(
                criterion="category",
                passed=True,
                details=f"category '{profile.category}' matches required category '{target_cat}'"
            )
        criteria_results.append(res)
        if not res.passed:
            failed_criteria.append(res)

    # 6. education criterion
    target_edu = eligibility_spec.get("education")
    if target_edu is not None and str(target_edu).strip() != "":
        target_edu_str = str(target_edu).strip().lower()
        prof_edu_str = (profile.education or "").strip().lower()
        if not prof_edu_str:
            res = CriterionResult(
                criterion="education",
                passed=False,
                details=f"education not specified in profile (required: '{target_edu}')"
            )
        elif prof_edu_str != target_edu_str and prof_edu_str not in target_edu_str and target_edu_str not in prof_edu_str:
            res = CriterionResult(
                criterion="education",
                passed=False,
                details=f"education '{profile.education}' does not match required education '{target_edu}'"
            )
        else:
            res = CriterionResult(
                criterion="education",
                passed=True,
                details=f"education '{profile.education}' matches required education '{target_edu}'"
            )
        criteria_results.append(res)
        if not res.passed:
            failed_criteria.append(res)

    # Determine overall status & reason
    if failed_criteria:
        primary_failed = failed_criteria[0]
        status = "NOT MATCHED"
        reason = f"because {primary_failed.details}"
        missing_documents = []
    else:
        missing_docs = []
        for req_doc in required_docs:
            if req_doc.strip().lower() not in confirmed_docs_lower:
                missing_docs.append(req_doc)

        if missing_docs:
            status = "NEEDS VERIFICATION"
            missing_str = ", ".join(missing_docs)
            reason = f"because {missing_str} is not confirmed"
            missing_documents = missing_docs
        else:
            status = "MATCH"
            reason = None
            missing_documents = []

    return SchemeEligibilityResult(
        scheme_id=scheme_id,
        scheme_name=scheme_name,
        status=status,
        criteria_results=criteria_results,
        reason=reason,
        missing_documents=missing_documents
    )


def check_eligibility_for_all_schemes(profile: CitizenProfileInput) -> List[SchemeEligibilityResult]:
    """
    Reads starter scheme JSON data and returns eligibility results for all schemes.
    """
    schemes = load_starter_schemes()
    results: List[SchemeEligibilityResult] = []
    for scheme_id, scheme_data in schemes.items():
        result = evaluate_scheme(scheme_id, scheme_data, profile)
        results.append(result)
    return results

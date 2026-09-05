import sys
from pathlib import Path

# Ensure root directory is on python path
root_dir = Path(__file__).resolve().parents[3]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from fastapi.testclient import TestClient
from app.backend.eligibility.schemas import CitizenProfileInput
from app.backend.eligibility.engine import check_eligibility_for_all_schemes
from app.backend.ai.service import generate_ai_guidance, generate_ai_guidance_for_all
from app.backend.ai.rag import load_scheme_by_id, load_all_schemes
from app.backend.ai.document_gap import analyze_document_gaps
from app.backend.ai.router import app as ai_app


def test_rag_and_schemes_loading():
    print("\n--- 1. Testing RAG Simple JSON Lookup ---")
    schemes = load_all_schemes()
    assert schemes is not None, "Loaded schemes collection must not be None"
    assert len(schemes) > 0, f"Expected non-empty schemes dataset, found {len(schemes)}"
    assert "SCH-001" in schemes, "SCH-001 missing from loaded schemes"
    assert "SCH-002" in schemes, "SCH-002 missing from loaded schemes"
    assert "SCH-003" in schemes, "SCH-003 missing from loaded schemes"

    # Verify each loaded scheme contains basic required fields for AI service
    for s_id, s_data in schemes.items():
        assert "scheme_name" in s_data, f"Scheme {s_id} missing 'scheme_name'"
        assert "eligibility" in s_data, f"Scheme {s_id} missing 'eligibility'"
        assert "documents" in s_data, f"Scheme {s_id} missing 'documents'"

    sch1 = load_scheme_by_id("SCH-001")
    assert sch1 is not None
    assert sch1["scheme_name"] == "PM-KISAN Samman Nidhi"
    assert "https://pmkisan.gov.in/" in sch1["application_url"]

    sch2 = load_scheme_by_id("SCH-002")
    assert sch2 is not None
    assert sch2["scheme_name"] == "Ayushman Bharat PM-JAY"

    sch3 = load_scheme_by_id("SCH-003")
    assert sch3 is not None
    assert sch3["scheme_name"] == "National Means-cum-Merit Scholarship"
    assert sch3["eligibility"]["age_max"] == 16

    print("RAG JSON lookup passed successfully!")


def test_document_gap_analysis():
    print("\n--- 2. Testing Document Gap Analysis ---")
    req_docs = ["income certificate", "ration card"]
    confirmed_docs = ["land record", "bank passbook", "ration card"]

    gap = analyze_document_gaps(req_docs, confirmed_docs)
    assert gap.all_documents_present is False
    assert "income certificate" in gap.missing_documents
    assert "ration card" not in gap.missing_documents

    # All present case
    gap2 = analyze_document_gaps(["land record", "bank passbook"], confirmed_docs)
    assert gap2.all_documents_present is True
    assert len(gap2.missing_documents) == 0

    print("Document gap analysis passed successfully!")


def test_three_core_scenarios():
    print("\n--- 3. Testing 3 Core Scheme Scenarios (SCH-001, SCH-002, SCH-003) ---")
    demo_profile = CitizenProfileInput(
        age=45,
        occupation="farmer",
        income=180000,
        state="Uttar Pradesh",
        category="General",
        education="10th pass",
        confirmed_documents=["land record", "bank passbook", "ration card"]
    )

    # Obtain authoritative eligibility from Person B's engine
    eligibility_results = check_eligibility_for_all_schemes(demo_profile)
    b_results_dict = {r.scheme_id: r for r in eligibility_results}

    # ==========================================
    # Test Case 1: SCH-001 PM-KISAN (MATCH)
    # ==========================================
    sch1_b = b_results_dict["SCH-001"]
    sch1_ai = generate_ai_guidance(profile=demo_profile, eligibility_result=sch1_b)

    print("\n[SCH-001 PM-KISAN Output]")
    print(f"Status: {sch1_ai.status}")
    print(f"Explanation: {sch1_ai.explanation}")
    print(f"Required Docs: {sch1_ai.required_documents}")
    print(f"Missing Docs: {sch1_ai.missing_documents}")
    print("Roadmap:")
    for step in sch1_ai.roadmap:
        print(f"  Step {step.step_number}: {step.title} -> {step.action_url}")

    assert sch1_ai.status == "MATCH", f"Expected MATCH, got {sch1_ai.status}"
    assert len(sch1_ai.missing_documents) == 0, "Expected no missing documents for SCH-001"
    assert "PM-KISAN" in sch1_ai.explanation
    assert len(sch1_ai.roadmap) >= 2, "Expected 2-4 step roadmap for MATCH"
    assert sch1_ai.roadmap[-1].action_url == "https://pmkisan.gov.in/", "Last step must direct to official application portal"

    # ====================================================
    # Test Case 2: SCH-002 Ayushman Bharat PM-JAY (NEEDS VERIFICATION)
    # ====================================================
    sch2_b = b_results_dict["SCH-002"]
    sch2_ai = generate_ai_guidance(profile=demo_profile, eligibility_result=sch2_b)

    print("\n[SCH-002 Ayushman Bharat PM-JAY Output]")
    print(f"Status: {sch2_ai.status}")
    print(f"Explanation: {sch2_ai.explanation}")
    print(f"Required Docs: {sch2_ai.required_documents}")
    print(f"Missing Docs: {sch2_ai.missing_documents}")
    print("Roadmap:")
    for step in sch2_ai.roadmap:
        print(f"  Step {step.step_number}: {step.title} -> {step.action_url}")

    assert sch2_ai.status == "NEEDS VERIFICATION", f"Expected NEEDS VERIFICATION, got {sch2_ai.status}"
    assert "income certificate" in sch2_ai.missing_documents, "Missing docs must contain income certificate"
    assert "verification" in sch2_ai.explanation.lower() or "income certificate" in sch2_ai.explanation.lower()
    assert len(sch2_ai.roadmap) == 3, f"Expected 3-step roadmap (get -> upload -> apply), got {len(sch2_ai.roadmap)}"
    assert "obtain" in sch2_ai.roadmap[0].title.lower() or "income certificate" in sch2_ai.roadmap[0].title.lower()
    assert "upload" in sch2_ai.roadmap[1].title.lower() or "verify" in sch2_ai.roadmap[1].title.lower()
    assert sch2_ai.roadmap[-1].action_url == "https://nha.gov.in/PM-JAY", "Last step must direct to PM-JAY portal"

    # ================================================================
    # Test Case 3: SCH-003 National Means-cum-Merit (NOT MATCHED)
    # ================================================================
    sch3_b = b_results_dict["SCH-003"]
    sch3_ai = generate_ai_guidance(profile=demo_profile, eligibility_result=sch3_b)

    print("\n[SCH-003 National Means-cum-Merit Output]")
    print(f"Status: {sch3_ai.status}")
    print(f"Explanation: {sch3_ai.explanation}")
    print(f"Roadmap: {sch3_ai.roadmap}")

    assert sch3_ai.status == "NOT MATCHED", f"Expected NOT MATCHED, got {sch3_ai.status}"
    assert "age" in sch3_ai.explanation.lower() or "limit" in sch3_ai.explanation.lower(), "Explanation must clarify age criterion"
    assert len(sch3_ai.roadmap) == 0, "Must NOT provide an application roadmap for NOT MATCHED"
    assert sch3_ai.application_url is None

    print("\nAll 3 core scenario assertions passed successfully!")


def test_ai_fastapi_endpoints():
    print("\n--- 4. Testing FastAPI AI Endpoints ---")
    client = TestClient(ai_app)

    # Test single explain endpoint
    payload = {
        "scheme_id": "SCH-002",
        "profile": {
            "age": 45,
            "occupation": "farmer",
            "income": 180000,
            "confirmed_documents": ["land record", "bank passbook", "ration card"]
        },
        "eligibility_result": {
            "scheme_id": "SCH-002",
            "scheme_name": "Ayushman Bharat PM-JAY",
            "status": "NEEDS VERIFICATION",
            "reason": "because income certificate is not confirmed",
            "missing_documents": ["income certificate"]
        }
    }

    response = client.post("/api/ai/explain", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert data["success"] is True
    guidance = data["guidance"]
    assert guidance["scheme_id"] == "SCH-002"
    assert guidance["status"] == "NEEDS VERIFICATION"
    assert "income certificate" in guidance["missing_documents"]
    assert len(guidance["roadmap"]) == 3
    assert guidance["roadmap"][-1]["action_url"] == "https://nha.gov.in/PM-JAY"

    print("FastAPI AI endpoint assertions passed successfully!")


if __name__ == "__main__":
    test_rag_and_schemes_loading()
    test_document_gap_analysis()
    test_three_core_scenarios()
    test_ai_fastapi_endpoints()
    print("\n==========================================")
    print("ALL PERSON C AI MODULE TESTS PASSED (100%)")
    print("==========================================")

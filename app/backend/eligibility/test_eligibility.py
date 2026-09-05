import sys
from pathlib import Path

# Ensure root directory is on python path
root_dir = Path(__file__).resolve().parents[3]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from fastapi.testclient import TestClient
from app.backend.eligibility.schemas import CitizenProfileInput
from app.backend.eligibility.engine import check_eligibility_for_all_schemes
from app.backend.eligibility.router import app


def test_demo_profile_direct():
    print("\n--- Testing Direct Engine Execution ---")
    demo_profile = CitizenProfileInput(
        age=45,
        occupation="farmer",
        income=180000,
        state="Uttar Pradesh",
        category="General",
        education="10th pass",
    )

    results = check_eligibility_for_all_schemes(demo_profile)
    results_dict = {r.scheme_id: r for r in results}

    sch1 = results_dict.get("SCH-001")
    sch2 = results_dict.get("SCH-002")
    sch3 = results_dict.get("SCH-003")

    print(f"SCH-001 status: {sch1.status}")
    print(f"SCH-002 status: {sch2.status}, reason: {sch2.reason}, missing_docs: {sch2.missing_documents}")
    print(f"SCH-003 status: {sch3.status}, reason: {sch3.reason}")

    assert sch1 is not None and sch1.status == "MATCH", f"SCH-001 expected MATCH, got {sch1.status}"
    assert sch2 is not None and sch2.status == "NEEDS VERIFICATION", f"SCH-002 expected NEEDS VERIFICATION, got {sch2.status}"
    assert "income certificate" in sch2.missing_documents, "SCH-002 missing documents should contain 'income certificate'"
    assert sch3 is not None and sch3.status == "NOT MATCHED", f"SCH-003 expected NOT MATCHED, got {sch3.status}"
    assert "above the age limit" in sch3.reason, f"SCH-003 expected age limit reason, got {sch3.reason}"

    print("Direct engine assertions passed successfully!")


def test_demo_profile_api_endpoint():
    print("\n--- Testing FastAPI Endpoint Execution ---")
    client = TestClient(app)
    payload = {
        "age": 45,
        "occupation": "farmer",
        "income": 180000,
        "state": "Uttar Pradesh",
        "category": "General",
        "education": "10th pass",
    }

    response = client.post("/api/eligibility/check", json=payload)
    assert response.status_code == 200, f"HTTP status expected 200, got {response.status_code}"
    
    data = response.json()
    assert data.get("success") is True
    
    results = {r["scheme_id"]: r for r in data.get("results", [])}
    
    sch1 = results["SCH-001"]
    sch2 = results["SCH-002"]
    sch3 = results["SCH-003"]

    print(f"Endpoint SCH-001 -> {sch1['scheme_name']}: {sch1['status']}")
    print(f"Endpoint SCH-002 -> {sch2['scheme_name']}: {sch2['status']} ({sch2['reason']})")
    print(f"Endpoint SCH-003 -> {sch3['scheme_name']}: {sch3['status']} ({sch3['reason']})")

    assert sch1["status"] == "MATCH"
    assert sch2["status"] == "NEEDS VERIFICATION"
    assert "income certificate" in sch2["missing_documents"]
    assert sch3["status"] == "NOT MATCHED"
    assert "above the age limit" in sch3["reason"]

    print("API endpoint assertions passed successfully!")


def test_document_normalization():
    print("\n--- Testing Document Normalization & Matching ---")
    from app.backend.eligibility.engine import normalize_document_name, evaluate_scheme
    
    # 1. "bank passbook" satisfying "savings bank passbook"
    doc_req1 = "savings bank passbook"
    confirmed_docs1 = ["land record", "bank passbook"]
    norm_confirmed1 = {normalize_document_name(d) for d in confirmed_docs1}
    assert normalize_document_name(doc_req1) in norm_confirmed1, "'bank passbook' should satisfy 'savings bank passbook'"

    # 2. "bank passbook" satisfying "bank / post office passbook"
    doc_req2 = "bank / post office passbook"
    assert normalize_document_name(doc_req2) in norm_confirmed1, "'bank passbook' should satisfy 'bank / post office passbook'"

    # 3. "caste / category certificate" satisfying "caste/category certificate"
    doc_req3 = "caste/category certificate"
    confirmed_docs3 = ["caste / category certificate", "bank passbook"]
    norm_confirmed3 = {normalize_document_name(d) for d in confirmed_docs3}
    assert normalize_document_name(doc_req3) in norm_confirmed3, "'caste / category certificate' should satisfy 'caste/category certificate'"

    # 4. An actually missing document producing NEEDS VERIFICATION
    dummy_scheme = {
        "scheme_name": "Test Scheme",
        "eligibility": {"age_min": 18},
        "documents": ["land record", "income certificate"]
    }
    profile_missing_doc = CitizenProfileInput(
        age=25,
        confirmed_documents=["land record", "bank passbook"]
    )
    res = evaluate_scheme("TEST-001", dummy_scheme, profile_missing_doc)
    assert res.status == "NEEDS VERIFICATION", f"Expected NEEDS VERIFICATION, got {res.status}"
    assert "income certificate" in res.missing_documents, "missing_documents should contain 'income certificate'"

    print("Document normalization & matching assertions passed successfully!")


def test_occupation_matching():
    print("\n--- Testing Occupation Normalization & Exact Matching ---")
    from app.backend.eligibility.engine import normalize_occupation, evaluate_scheme

    # 1. "farmer" matches scheme occupation "farmer"
    scheme_farmer = {"scheme_name": "Farmer Scheme", "eligibility": {"occupation": "farmer"}, "documents": []}
    prof_farmer = CitizenProfileInput(occupation="farmer")
    res1 = evaluate_scheme("TEST-F1", scheme_farmer, prof_farmer)
    assert res1.status == "MATCH", f"Expected MATCH for 'farmer', got {res1.status}"

    # 2. " Farmer " still matches "farmer"
    prof_farmer_spaces = CitizenProfileInput(occupation=" Farmer ")
    res2 = evaluate_scheme("TEST-F2", scheme_farmer, prof_farmer_spaces)
    assert res2.status == "MATCH", f"Expected MATCH for ' Farmer ', got {res2.status}"

    # 3. "daily wage worker" normalizes to canonical "daily_wage_worker"
    assert normalize_occupation("daily wage worker") == "daily_wage_worker"
    scheme_dww = {"scheme_name": "DWW Scheme", "eligibility": {"occupation": "daily_wage_worker"}, "documents": []}
    prof_dww = CitizenProfileInput(occupation="daily wage worker")
    res3 = evaluate_scheme("TEST-DWW", scheme_dww, prof_dww)
    assert res3.status == "MATCH", f"Expected MATCH for 'daily wage worker', got {res3.status}"

    # 4. Unrelated occupation does NOT match merely because one string contains the other
    prof_unrelated = CitizenProfileInput(occupation="farmer_manager")
    res4 = evaluate_scheme("TEST-F3", scheme_farmer, prof_unrelated)
    assert res4.status == "NOT MATCHED", f"Expected NOT MATCHED for 'farmer_manager', got {res4.status}"

    prof_unrelated2 = CitizenProfileInput(occupation="farm")
    res5 = evaluate_scheme("TEST-F4", scheme_farmer, prof_unrelated2)
    assert res5.status == "NOT MATCHED", f"Expected NOT MATCHED for 'farm', got {res5.status}"

    # 5. Scheme with empty occupation ("") remains eligible for occupation
    scheme_empty_occ = {"scheme_name": "Ayushman Bharat", "eligibility": {"occupation": ""}, "documents": []}
    prof_any = CitizenProfileInput(occupation="anything")
    res6 = evaluate_scheme("TEST-EMP", scheme_empty_occ, prof_any)
    assert res6.status == "MATCH", f"Expected MATCH for scheme with empty occupation, got {res6.status}"

    print("Occupation normalization & exact matching assertions passed successfully!")


if __name__ == "__main__":
    test_demo_profile_direct()
    test_demo_profile_api_endpoint()
    test_document_normalization()
    test_occupation_matching()



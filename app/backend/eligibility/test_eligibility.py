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


def test_income_validation():
    print("\n--- Testing Income Validation ---")
    from pydantic import ValidationError

    # 1. income=None is accepted
    p_none = CitizenProfileInput(income=None)
    assert p_none.income is None, "income=None should be accepted"

    # 2. income=0 is accepted
    p_zero = CitizenProfileInput(income=0)
    assert p_zero.income == 0, "income=0 should be accepted"

    # 3. Normal positive income is accepted
    p_positive = CitizenProfileInput(income=180000.0)
    assert p_positive.income == 180000.0, "positive income should be accepted"

    # 4. Negative income is rejected by Pydantic schema validation
    try:
        CitizenProfileInput(income=-50000)
        assert False, "Negative income should have raised a ValidationError"
    except ValidationError:
        pass

    # 5. FastAPI endpoint returns HTTP 422 for negative income
    client = TestClient(app)
    payload_neg = {"age": 30, "income": -50000, "occupation": "farmer"}
    resp_neg = client.post("/api/eligibility/check", json=payload_neg)
    assert resp_neg.status_code == 422, f"Expected HTTP 422 for negative income, got {resp_neg.status_code}"

    # 6. FastAPI endpoint accepts income=0, income=None, income=180000
    resp_zero = client.post("/api/eligibility/check", json={"income": 0})
    assert resp_zero.status_code == 200, f"Expected HTTP 200 for income=0, got {resp_zero.status_code}"

    resp_none = client.post("/api/eligibility/check", json={"income": None})
    assert resp_none.status_code == 200, f"Expected HTTP 200 for income=None, got {resp_none.status_code}"

    print("Income validation assertions passed successfully!")


def test_malformed_scheme_json_handling():
    print("\n--- Testing Malformed Scheme JSON Safety ---")
    import tempfile
    import json
    from pathlib import Path
    from app.backend.api.main import list_starter_schemes, app as main_app
    from app.backend.eligibility.engine import evaluate_scheme, load_starter_schemes
    from app.backend.ai.rag import load_all_schemes

    # Create temporary directory with valid, broken syntax, and non-dict JSON files
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)

        # 1. Valid Scheme JSON
        with open(tmp_path / "SCH-001.json", "w", encoding="utf-8") as f:
            json.dump({"id": "SCH-001", "scheme_name": "Valid Scheme"}, f)

        # 2. Syntax-error Invalid JSON
        with open(tmp_path / "SCH-BROKEN.json", "w", encoding="utf-8") as f:
            f.write("{invalid_json: true,")

        # 3. Non-dictionary JSON (array)
        with open(tmp_path / "SCH-ARRAY.json", "w", encoding="utf-8") as f:
            f.write("[1, 2, 3]")

        # 4. Non-dictionary JSON (string)
        with open(tmp_path / "SCH-STRING.json", "w", encoding="utf-8") as f:
            f.write('"just a string"')

        # Verify safe loading logic
        schemes_loaded = []
        for file in sorted(tmp_path.glob("*.json")):
            try:
                with open(file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, dict):
                        schemes_loaded.append(data)
            except Exception:
                pass

        assert len(schemes_loaded) == 1, f"Expected 1 valid scheme loaded, got {len(schemes_loaded)}"
        assert schemes_loaded[0]["id"] == "SCH-001"
        assert not any("error" in s for s in schemes_loaded), "No error objects should be appended to scheme list"

        # Verify evaluate_scheme handles non-dict scheme_data safely
        res_nondict = evaluate_scheme("SCH-BAD", [1, 2, 3], CitizenProfileInput())
        assert res_nondict.status == "MATCH", "evaluate_scheme with non-dict scheme_data should fall back safely without crashing"

    # Verify actual GET /api/schemes endpoint returns valid schemes without raw error objects
    client = TestClient(main_app)
    resp = client.get("/api/schemes")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    schemes_data = resp.json()
    assert isinstance(schemes_data, list)
    assert len(schemes_data) >= 30, f"Expected at least 30 valid schemes, got {len(schemes_data)}"
    for item in schemes_data:
        assert isinstance(item, dict), "Every item in GET /api/schemes response must be a dictionary"
        assert "error" not in item, f"Scheme item contained raw error object: {item}"

    print("Malformed scheme JSON safety assertions passed successfully!")


if __name__ == "__main__":
    test_demo_profile_direct()
    test_demo_profile_api_endpoint()
    test_document_normalization()
    test_occupation_matching()
    test_income_validation()
    test_malformed_scheme_json_handling()





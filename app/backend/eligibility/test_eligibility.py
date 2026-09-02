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


if __name__ == "__main__":
    test_demo_profile_direct()
    test_demo_profile_api_endpoint()

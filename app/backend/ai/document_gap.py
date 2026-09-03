from typing import List, Optional
from .schemas import DocumentGapResult


def normalize_doc_name(doc: str) -> str:
    """
    Standardize document name for accurate comparison.
    """
    return doc.strip().lower()


def analyze_document_gaps(
    required_documents: Optional[List[str]],
    confirmed_documents: Optional[List[str]]
) -> DocumentGapResult:
    """
    Performs document gap analysis by comparing the scheme's required documents
    against the citizen's confirmed/uploaded documents.
    """
    req_docs = required_documents or []
    conf_docs = confirmed_documents or []

    # Map normalized names to original casing from citizen input
    confirmed_normalized = {
        normalize_doc_name(d): d for d in conf_docs if d and d.strip()
    }

    missing_docs: List[str] = []
    
    for req in req_docs:
        req_norm = normalize_doc_name(req)
        # Check if required document is confirmed
        if req_norm not in confirmed_normalized:
            missing_docs.append(req)

    all_present = len(missing_docs) == 0

    return DocumentGapResult(
        required_documents=req_docs,
        confirmed_documents=conf_docs,
        missing_documents=missing_docs,
        all_documents_present=all_present
    )

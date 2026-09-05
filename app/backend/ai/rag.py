import os
import json
from pathlib import Path
from typing import Dict, Optional, Any


def get_schemes_directory() -> Path:
    """
    Locate the data/schemes directory reliably across different execution environments.
    """
    current_path = Path(__file__).resolve()
    # app/backend/ai/rag.py -> parents[3] is project root
    base_dir = current_path.parents[3] if len(current_path.parents) > 3 else Path(os.getcwd())
    schemes_dir = base_dir / "data" / "schemes"
    
    if not schemes_dir.exists():
        schemes_dir = Path(os.getcwd()) / "data" / "schemes"
        
    return schemes_dir


def load_scheme_by_id(scheme_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieves scheme context by scheme ID (e.g. 'SCH-001') via simple JSON lookup.
    No vector database is used. Returns exact scheme ground truth.
    """
    schemes_dir = get_schemes_directory()
    if not schemes_dir.exists():
        return None

    # Support looking up by 'SCH-001' or 'SCH-001.json'
    file_name = f"{scheme_id}.json" if not scheme_id.endswith(".json") else scheme_id
    scheme_file = schemes_dir / file_name

    if scheme_file.exists():
        try:
            with open(scheme_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    data["scheme_id"] = scheme_file.stem
                    return data
        except Exception:
            return None

    # Fallback: scan files to match scheme_name if ID wasn't matching filename
    for file in schemes_dir.glob("*.json"):
        if file.stem.lower() == scheme_id.lower():
            try:
                with open(file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, dict):
                        data["scheme_id"] = file.stem
                        return data
            except Exception:
                pass

    return None


def load_all_schemes() -> Dict[str, Dict[str, Any]]:
    """
    Loads all schemes from data/schemes as a dictionary mapping scheme_id to scheme data.
    """
    schemes_dir = get_schemes_directory()
    schemes: Dict[str, Dict[str, Any]] = {}

    if schemes_dir.exists():
        for file in sorted(schemes_dir.glob("*.json")):
            scheme_id = file.stem
            try:
                with open(file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, dict):
                        data["scheme_id"] = scheme_id
                        schemes[scheme_id] = data
            except Exception:
                pass

    return schemes

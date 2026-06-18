# backend/llm/session_state.py

from dataclasses import dataclass, field
from typing import Optional

# All fields the system tracks — ML required + consulting
FIELD_DEFINITIONS = {
    # --- ML Required (must be confirmed before prediction) ---
    "industry":                   {"required_for": "ml", "type": "categorical"},
    "country":                    {"required_for": "ml", "type": "categorical"},
    "year":                       {"required_for": "ml", "type": "numeric"},
    "ai_adoption_level":          {"required_for": "ml", "type": "numeric"},
    "ai_investment_usd":          {"required_for": "ml", "type": "numeric"},
    "automation_rate":            {"required_for": "ml", "type": "numeric"},
    "employee_ai_training_hours": {"required_for": "ml", "type": "numeric"},
    "ai_maturity_score":          {"required_for": "ml", "type": "numeric"},
    "deployment_count":           {"required_for": "ml", "type": "numeric"},

    # --- Consulting Only (can be inferred, not required for ML) ---
    "company_size":               {"required_for": "consulting", "type": "categorical"},
    "employee_count":             {"required_for": "consulting", "type": "numeric"},
    "revenue_range":              {"required_for": "consulting", "type": "categorical"},
    "current_processes":          {"required_for": "consulting", "type": "text"},
    "existing_software":          {"required_for": "consulting", "type": "text"},
    "manual_workflows":           {"required_for": "consulting", "type": "text"},
    "pain_points":                {"required_for": "consulting", "type": "text"},
    "data_availability":          {"required_for": "consulting", "type": "categorical"},
    "data_quality":               {"required_for": "consulting", "type": "categorical"},
    "data_storage":               {"required_for": "consulting", "type": "text"},
    "data_governance":            {"required_for": "consulting", "type": "categorical"},
    "proposed_ai_use_cases":      {"required_for": "consulting", "type": "text"},
    "expected_outcomes":          {"required_for": "consulting", "type": "text"},
    "budget_range":               {"required_for": "consulting", "type": "categorical"},
    "timeline":                   {"required_for": "consulting", "type": "categorical"},
    "vendor_recommendation":      {"required_for": "consulting", "type": "text"},
    "leadership_support":         {"required_for": "consulting", "type": "categorical"},
    "digital_maturity":           {"required_for": "consulting", "type": "categorical"},
    "change_readiness":           {"required_for": "consulting", "type": "categorical"},
}

ML_REQUIRED = [k for k, v in FIELD_DEFINITIONS.items() if v["required_for"] == "ml"]
CONSULTING_REQUIRED = [k for k, v in FIELD_DEFINITIONS.items() if v["required_for"] == "consulting"]


def empty_field():
    return {
        "value":      None,
        "source":     None,
        "confidence": 0,
        "status":     "missing"   # missing | inferred | confirmed
    }


def create_session() -> dict:
    return {
        "fields":            {k: empty_field() for k in FIELD_DEFINITIONS},
        "conversation_turn": 0,
        "ready_for_ml":      False,
        "ready_for_report":  False,
        "ml_results":        None,
        "shap_explanation":  None,
        "consulting_results":None,
        "report_generated":  False,
        "conversation_history": []
    }  


def update_fields(session: dict, extracted: dict) -> dict:
    """
    Merge LLM-extracted fields into session state.
    CEO-confirmed values always win.
    LLM inferences only fill missing fields.
    """
    for field_name, field_data in extracted.items():
        if field_name not in session["fields"]:
            continue

        existing = session["fields"][field_name]
        is_ceo   = field_data.get("source") == "CEO"
        is_missing = existing["status"] == "missing"

        if is_ceo:
            # CEO always overwrites — even previously confirmed values
            session["fields"][field_name] = {
                "value":      field_data["value"],
                "source":     "CEO",
                "confidence": 100,
                "status":     "confirmed"
            }
        elif is_missing:
            # LLM inference only fills empty slots
            session["fields"][field_name] = {
                "value":      field_data["value"],
                "source":     "LLM",
                "confidence": field_data.get("confidence", 50),
                "status":     "inferred"
            }
        # If field already confirmed and source is LLM — ignore

    session["conversation_turn"] += 1
    session = recompute_readiness(session)
    return session


def recompute_readiness(session: dict) -> dict:
    ml_fields = session["fields"]

    session["ready_for_ml"] = all(
        ml_fields[f]["status"] == "confirmed"
        for f in ML_REQUIRED
    )
    
         # FIXED — only need 70% of consulting fields + all ML fields
    consulting_filled = sum(
        1 for f in CONSULTING_REQUIRED
        if session["fields"][f]["status"] in ["confirmed", "inferred"]
    )
    consulting_threshold = int(len(CONSULTING_REQUIRED) * 0.70)

    session["ready_for_report"] = (
        consulting_filled >= consulting_threshold
        and session["ready_for_ml"]
    )

    return session


def get_missing_ml_fields(session: dict) -> list:
    return [
        f for f in ML_REQUIRED
        if session["fields"][f]["status"] != "confirmed"
    ]


def get_missing_consulting_fields(session: dict) -> list:
    return [
        f for f in CONSULTING_REQUIRED
        if session["fields"][f]["status"] == "missing"
    ]


def get_confirmed_ml_values(session: dict) -> dict:
    """Extract confirmed field values for passing to predict.py"""
    return {
        f: session["fields"][f]["value"]
        for f in ML_REQUIRED
        if session["fields"][f]["status"] == "confirmed"
    }


def get_progress_summary(session: dict) -> dict:
    """For frontend progress tracker"""
    ml_confirmed = sum(
        1 for f in ML_REQUIRED
        if session["fields"][f]["status"] == "confirmed"
    )
    consulting_confirmed = sum(
        1 for f in CONSULTING_REQUIRED
        if session["fields"][f]["status"] != "missing"
    )
    return {
        "ml_fields":          {"confirmed": ml_confirmed,     "total": len(ML_REQUIRED)},
        "consulting_fields":  {"confirmed": consulting_confirmed, "total": len(CONSULTING_REQUIRED)},
        "ready_for_ml":       session["ready_for_ml"],
        "ready_for_report":   session["ready_for_report"]
    }
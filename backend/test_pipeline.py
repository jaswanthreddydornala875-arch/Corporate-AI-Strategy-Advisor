# backend/test_pipeline.py
# Run with: python test_pipeline.py
# Tests the full pipeline without frontend or API calls

import json
from llm.session_state import (
    create_session, update_fields, get_confirmed_ml_values,
    get_progress_summary, get_missing_ml_fields
)
from llm.extractor import extract_fields, generate_followup_question
from llm.consultant import run_consulting_pipeline
from llm.report import generate_report, build_report_context
from ml.predict import run_prediction
from ml.preprocess import compute_engineered_features
from ml.explainer import explain_all


# ─────────────────────────────────────────
# STEP 1 — Simulate CEO conversation
# (bypasses LLM extractor for speed)
# ─────────────────────────────────────────

def simulate_confirmed_session() -> dict:
    """
    Manually inject a fully confirmed session
    so we can test ML + consulting pipeline
    without running the full conversation loop.
    """
    session = create_session()

    # Simulate what extractor.py would produce after full conversation
    mock_extracted = {
        # ML required fields — all CEO confirmed
        "industry":                   {"value": "Financial Services", "source": "CEO", "confidence": 100},
        "country":                    {"value": "United States",      "source": "CEO", "confidence": 100},
        "year":                       {"value": 2026,                 "source": "CEO", "confidence": 100},
        "ai_adoption_level":          {"value": 0.45,                 "source": "CEO", "confidence": 100},
        "ai_investment_usd":          {"value": 5000000,              "source": "CEO", "confidence": 100},
        "automation_rate":            {"value": 0.38,                 "source": "CEO", "confidence": 100},
        "employee_ai_training_hours": {"value": 120,                  "source": "CEO", "confidence": 100},
        "ai_maturity_score":          {"value": 0.5,                  "source": "CEO", "confidence": 100},
        "deployment_count":           {"value": 8,                    "source": "CEO", "confidence": 100},

        # Consulting fields — mix of CEO confirmed and LLM inferred
        "company_size":               {"value": "medium",             "source": "CEO", "confidence": 100},
        "employee_count":             {"value": 500,                  "source": "CEO", "confidence": 100},
        "revenue_range":              {"value": "$50M-$200M",         "source": "LLM", "confidence": 65},
        "pain_points":                {"value": "Manual loan approval, slow document processing", "source": "CEO", "confidence": 100},
        "proposed_ai_use_cases":      {"value": "Document intelligence, fraud detection",        "source": "CEO", "confidence": 100},
        "current_processes":          {"value": "SQL databases, manual review workflows",        "source": "CEO", "confidence": 100},
        "existing_software":          {"value": "Salesforce, legacy core banking system",        "source": "CEO", "confidence": 100},
        "manual_workflows":           {"value": "Loan approval, KYC verification",               "source": "CEO", "confidence": 100},
        "data_availability":          {"value": "high",               "source": "CEO", "confidence": 100},
        "data_quality":               {"value": "medium",             "source": "LLM", "confidence": 60},
        "data_storage":               {"value": "SQL + data warehouse","source": "CEO", "confidence": 100},
        "data_governance":            {"value": "moderate",           "source": "LLM", "confidence": 55},
        "budget_range":               {"value": "$5M-$10M",           "source": "CEO", "confidence": 100},
        "timeline":                   {"value": "18 months",          "source": "CEO", "confidence": 100},
        "leadership_support":         {"value": "strong",             "source": "CEO", "confidence": 100},
        "digital_maturity":           {"value": "medium",             "source": "LLM", "confidence": 60},
        "change_readiness":           {"value": "medium",             "source": "LLM", "confidence": 55},
        "vendor_recommendation":      {"value": "GenAI Chatbot for customer support", "source": "CEO", "confidence": 100},
        "expected_outcomes":          {"value": "30% reduction in processing time",   "source": "CEO", "confidence": 100},
    }

    session = update_fields(session, mock_extracted)
    return session


# ─────────────────────────────────────────
# STEP 2 — Run and print each stage
# ─────────────────────────────────────────

def run_test():
    print("\n" + "="*60)
    print("CORPORATE AI STRATEGY ADVISOR — PIPELINE TEST")
    print("="*60)

    # ── Session Setup ──
    print("\n[1] Creating session and injecting mock CEO data...")
    session = simulate_confirmed_session()
    progress = get_progress_summary(session)
    print(f"    ML fields confirmed:         {progress['ml_fields']['confirmed']}/{progress['ml_fields']['total']}")
    print(f"    Consulting fields confirmed: {progress['consulting_fields']['confirmed']}/{progress['consulting_fields']['total']}")
    print(f"    Ready for ML:      {session['ready_for_ml']}")
    print(f"    Ready for report:  {session['ready_for_report']}")

    missing_ml = get_missing_ml_fields(session)
    if missing_ml:
        print(f"\n    ⚠ Missing ML fields: {missing_ml}")
        print("    Cannot proceed — fix mock data above.")
        return

    # ── ML Pipeline ──
    print("\n[2] Running ML prediction pipeline...")
    confirmed = get_confirmed_ml_values(session)
    engineered = compute_engineered_features(confirmed.copy())

    print(f"    Engineered features:")
    print(f"      ai_efficiency_score:       {engineered['ai_efficiency_score']:.4f}")
    print(f"      training_per_deployment:   {engineered['training_per_deployment']:.2f}")
    print(f"      investment_per_deployment: {engineered['investment_per_deployment']:,.2f}")

    ml_results = run_prediction(confirmed)
    session["ml_results"] = ml_results

    print(f"\n    ML Results:")
    print(f"      Productivity Gain:  {ml_results['productivity_gain']}")
    print(f"      Cost Savings:       ${ml_results['cost_savings']:,.2f}")
    print(f"      Revenue Impact:     ${ml_results['revenue_impact']:,.2f}")
    print(f"      ROI:                {ml_results['roi_percentage']}%")
    print(f"      Risk Level:         {ml_results['risk_level']}")

    # ── SHAP ──
    print("\n[3] Running SHAP explainability...")
    shap_explanation = explain_all(confirmed, engineered)
    session["shap_explanation"] = shap_explanation

    for output, drivers in shap_explanation.items():
        print(f"\n    {output.replace('_drivers','').title()} top drivers:")
        for d in drivers:
            sign = "+" if d["direction"] == "positive" else "-"
            print(f"      {sign} {d['label']}: {d['shap_value']:+.4f}")

    # ── Consulting Pipeline ──
    print("\n[4] Running consulting pipeline...")
    print("    (This calls Groq API — may take 5-10 seconds)")
    consulting_results = run_consulting_pipeline(session)
    session["consulting_results"] = consulting_results

    readiness = consulting_results["readiness"]
    print(f"\n    Readiness Scores:")
    print(f"      Overall:  {readiness['overall_readiness']}/100")
    print(f"      Data:     {readiness['data_readiness']['overall']}/100")
    print(f"      Org:      {readiness['org_readiness']['overall']}/100")
    print(f"      Tech:     {readiness['tech_readiness']['overall']}/100")

    biz = consulting_results["business_need"]
    print(f"\n    Business Need:")
    print(f"      AI Justified: {biz['ai_justified']}")
    print(f"      {biz['justification']}")

    vendor = consulting_results["vendor_alignment"]
    if vendor["vendor_provided"]:
        print(f"\n    Vendor Alignment:")
        print(f"      Score:   {vendor.get('alignment_score')}/100")
        print(f"      Verdict: {vendor.get('verdict')}")

    roadmap = consulting_results["roadmap"]
    print(f"\n    Roadmap:")
    print(f"      Quick Win: {roadmap.get('quick_win')}")
    for phase in ["phase_1", "phase_2", "phase_3"]:
        p = roadmap.get(phase, {})
        print(f"      {p.get('title')} — {p.get('duration')}")

    # ── Report Generation ──
    print("\n[5] Generating executive report...")
    print("    (This calls Groq API — may take 10-15 seconds)")
    session["report_generated"] = False
    report = generate_report(session)
    session["report_generated"] = True

    print("\n" + "="*60)
    print("EXECUTIVE REPORT NARRATIVE")
    print("="*60)
    print(report["narrative"])

    # ── Full Context Check ──
    print("\n[6] Verifying report context stored for chatbot...")
    context_present = "report_context" in session and len(session["report_context"]) > 100
    print(f"    Context stored: {context_present}")
    print(f"    Context length: {len(session.get('report_context',''))} characters")

    print("\n" + "="*60)
    print("ALL PIPELINE STAGES PASSED")
    print("="*60)

    # Save full output for web team reference
    output = {
        "ml_results":          ml_results,
        "shap_explanation":    shap_explanation,
        "readiness":           readiness,
        "business_need":       biz,
        "vendor_alignment":    vendor,
        "roadmap":             roadmap,
        "narrative_preview":   report["narrative"][:500] + "..."
    }

    with open("test_output.json", "w") as f:
        json.dump(output, f, indent=2, default=str)

    print("\nFull output saved to test_output.json")
    print("Share this file with the web team — it shows exact JSON structure.\n")


if __name__ == "__main__":
    run_test()
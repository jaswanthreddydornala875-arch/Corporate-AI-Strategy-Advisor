# backend/test_ml_only.py
# Tests ONLY your ML files — no Groq, no LLM, no internet needed
# Run with: python test_ml_only.py

import json
import os
import numpy as np
from ml.preprocess import compute_engineered_features, build_feature_vector, validate_fields
from ml.predict import run_prediction
from ml.explainer import explain_all

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.normpath(os.path.join(BASE_DIR, 'models'))

# ─────────────────────────────────────────
# MOCK INPUT — realistic CEO-confirmed data
# ─────────────────────────────────────────

mock_confirmed = {
    "industry":                   "Financial Services",
    "country":                    "United States",
    "year":                       2026,
    "ai_adoption_level":          0.45,
    "ai_investment_usd":          5000000,
    "automation_rate":            0.38,
    "employee_ai_training_hours": 120,
    "ai_maturity_score":          0.50,
    "deployment_count":           8,
}


def test_validation():
    print("\n[TEST 1] Field Validation")
    print("-" * 40)

    # Should pass
    is_valid, issues = validate_fields(mock_confirmed)
    print(f"  Valid input:   {is_valid}")
    if issues:
        print(f"  Issues: {issues}")
    assert is_valid, f"Validation failed: {issues}"
    print("  ✓ Passed")

    # Should fail — missing field
    bad_input = mock_confirmed.copy()
    del bad_input["deployment_count"]
    is_valid, issues = validate_fields(bad_input)
    print(f"\n  Missing field test: is_valid={is_valid}")
    print(f"  Issues: {issues}")
    assert not is_valid
    print("  ✓ Correctly caught missing field")

    # Should fail — out of range
    bad_range = mock_confirmed.copy()
    bad_range["ai_adoption_level"] = 1.5   # max is 1.0
    is_valid, issues = validate_fields(bad_range)
    print(f"\n  Out of range test: is_valid={is_valid}")
    print(f"  Issues: {issues}")
    assert not is_valid
    print("  ✓ Correctly caught out-of-range value")


def test_preprocessing():
    print("\n[TEST 2] Preprocessing & Feature Engineering")
    print("-" * 40)

    data = compute_engineered_features(mock_confirmed.copy())

    # Check all 3 engineered features exist and are correct
    expected_efficiency = (
        mock_confirmed["ai_adoption_level"] *
        mock_confirmed["automation_rate"] *
        mock_confirmed["ai_maturity_score"]
    )
    expected_training_per = (
        mock_confirmed["employee_ai_training_hours"] /
        mock_confirmed["deployment_count"]
    )
    expected_invest_per = (
        mock_confirmed["ai_investment_usd"] /
        mock_confirmed["deployment_count"]
    )

    print(f"  ai_efficiency_score:       {data['ai_efficiency_score']:.6f}")
    print(f"  Expected:                  {expected_efficiency:.6f}")
    assert abs(data["ai_efficiency_score"] - expected_efficiency) < 1e-9
    print("  ✓ ai_efficiency_score correct")

    print(f"\n  training_per_deployment:   {data['training_per_deployment']:.4f}")
    print(f"  Expected:                  {expected_training_per:.4f}")
    assert abs(data["training_per_deployment"] - expected_training_per) < 1e-9
    print("  ✓ training_per_deployment correct")

    print(f"\n  investment_per_deployment: {data['investment_per_deployment']:,.2f}")
    print(f"  Expected:                  {expected_invest_per:,.2f}")
    assert abs(data["investment_per_deployment"] - expected_invest_per) < 1e-9
    print("  ✓ investment_per_deployment correct")

    # Edge case — deployment_count = 0 (should not divide by zero)
    print("\n  Edge case: deployment_count = 0")
    zero_deploy = mock_confirmed.copy()
    zero_deploy["deployment_count"] = 0
    try:
        data_zero = compute_engineered_features(zero_deploy.copy())
        print(f"  training_per_deployment:   {data_zero['training_per_deployment']}")
        print(f"  investment_per_deployment: {data_zero['investment_per_deployment']}")
        print("  ✓ Zero division handled safely")
    except ZeroDivisionError:
        print("  ✗ FAILED — ZeroDivisionError not handled")
        raise


def test_feature_vector():
    print("\n[TEST 3] Feature Vector Build")
    print("-" * 40)

    import joblib
    feature_columns = joblib.load(os.path.join(MODELS_DIR, 'feature_columns.pkl'))

    vector = build_feature_vector(mock_confirmed.copy())

    print(f"  Feature columns ({len(feature_columns)}): {feature_columns}")
    print(f"  Vector length:   {len(vector)}")
    assert len(vector) == len(feature_columns), \
        f"Length mismatch: vector={len(vector)}, columns={len(feature_columns)}"
    print(f"  Vector values:   {[round(v, 4) if isinstance(v, float) else v for v in vector]}")
    print("  ✓ Vector length matches feature_columns.pkl")

    # Check no None values in vector
    none_found = [feature_columns[i] for i, v in enumerate(vector) if v is None]
    assert not none_found, f"None values in vector at: {none_found}"
    print("  ✓ No None values in vector")


def test_prediction():
    print("\n[TEST 4] ML Prediction")
    print("-" * 40)

    results = run_prediction(mock_confirmed.copy())

    print(f"  Productivity Gain:  {results['productivity_gain']}")
    print(f"  Cost Savings:       ${results['cost_savings']:,.2f}")
    print(f"  Revenue Impact:     ${results['revenue_impact']:,.2f}")
    print(f"  ROI:                {results['roi_percentage']}%")
    print(f"  Risk Level:         {results['risk_level']}")

    # Type checks
    assert isinstance(results["productivity_gain"], float)
    assert isinstance(results["cost_savings"],      float)
    assert isinstance(results["revenue_impact"],    float)
    assert isinstance(results["roi"],               float)
    assert isinstance(results["roi_percentage"],    float)
    assert results["risk_level"] in ["Low", "Medium", "High"]
    print("  ✓ All types correct")

    # ROI business logic check
    expected_roi = (
        results["revenue_impact"] +
        results["cost_savings"] -
        mock_confirmed["ai_investment_usd"]
    ) / mock_confirmed["ai_investment_usd"]
    assert abs(results["roi"] - expected_roi) < 0.001, \
        f"ROI formula wrong: got {results['roi']}, expected {expected_roi}"
    print("  ✓ ROI formula correct")

    # Risk label consistency check
    roi = results["roi"]
    if roi > 0.5:
        expected_risk = "Low"
    elif roi > 0:
        expected_risk = "Medium"
    else:
        expected_risk = "High"
    assert results["risk_level"] == expected_risk, \
        f"Risk label mismatch: got {results['risk_level']}, expected {expected_risk}"
    print("  ✓ Risk label consistent with ROI")

    # Sanity check — suspiciously perfect scores
    if results["roi_percentage"] > 500:
        print(f"\n  ⚠ WARNING: ROI={results['roi_percentage']}% seems very high")
        print("    Check for data leakage in training")

    return results


def test_shap(ml_results):
    print("\n[TEST 5] SHAP Explainability")
    print("-" * 40)

    confirmed = mock_confirmed.copy()
    engineered = compute_engineered_features(confirmed.copy())

    shap_explanation = explain_all(confirmed, engineered)

    for output_name, drivers in shap_explanation.items():
        print(f"\n  {output_name.replace('_drivers','').title()} drivers:")
        assert len(drivers) > 0, f"No drivers returned for {output_name}"
        assert len(drivers) <= 3, f"Expected max 3 drivers, got {len(drivers)}"

        for d in drivers:
            sign = "+" if d["direction"] == "positive" else "-"
            print(f"    {sign} {d['label']:<35} {d['shap_value']:+.6f}")

            # Check structure
            assert "feature"    in d
            assert "label"      in d
            assert "shap_value" in d
            assert "direction"  in d
            assert d["direction"] in ["positive", "negative"]

    print("\n  ✓ All SHAP outputs valid")

    # Sanity check — top driver should have largest absolute shap value
    for output_name, drivers in shap_explanation.items():
        if len(drivers) >= 2:
            assert abs(drivers[0]["shap_value"]) >= abs(drivers[1]["shap_value"]), \
                f"Drivers not sorted by impact in {output_name}"
    print("  ✓ Drivers correctly sorted by impact")

    return shap_explanation


def test_multiple_inputs():
    """
    Run predictions on varied inputs to check
    model behaves sensibly — higher investment
    should generally mean higher revenue impact.
    """
    print("\n[TEST 6] Prediction Sensitivity Check")
    print("-" * 40)
    print("  Varying ai_investment_usd — expect revenue to trend upward\n")

    investments = [500_000, 2_000_000, 5_000_000, 10_000_000, 20_000_000]
    results = []

    for inv in investments:
        test_input = mock_confirmed.copy()
        test_input["ai_investment_usd"] = inv
        pred = run_prediction(test_input)
        results.append((inv, pred["revenue_impact"], pred["roi_percentage"]))
        print(f"  Investment: ${inv:>12,.0f} → "
              f"Revenue: ${pred['revenue_impact']:>12,.2f}  "
              f"ROI: {pred['roi_percentage']:>8.2f}%")

    print("\n  ✓ Sensitivity check complete")
    print("    Review above — does trend make business sense?")

    return results


def save_test_output(ml_results, shap_explanation):
    output = {
        "test_input":       mock_confirmed,
        "ml_results":       ml_results,
        "shap_explanation": shap_explanation
    }
    with open("test_ml_output.json", "w") as f:
        json.dump(output, f, indent=2, default=str)
    print("\n  Output saved to test_ml_output.json")


# ─────────────────────────────────────────
# RUN ALL TESTS
# ─────────────────────────────────────────

if __name__ == "__main__":
    print("\n" + "="*60)
    print("ML PIPELINE TEST — NO LLM REQUIRED")
    print("="*60)

    try:
        test_validation()
        test_preprocessing()
        test_feature_vector()
        ml_results     = test_prediction()
        shap_results   = test_shap(ml_results)
        test_multiple_inputs()
        save_test_output(ml_results, shap_results)

        print("\n" + "="*60)
        print("ALL ML TESTS PASSED")
        print("Your pkl files are loading and predicting correctly.")
        print("Safe to hand off to LLM/backend team.")
        print("="*60 + "\n")

    except AssertionError as e:
        print(f"\n  ✗ TEST FAILED: {e}")
        print("  Fix this before proceeding.\n")
    except FileNotFoundError as e:
        print(f"\n  ✗ FILE NOT FOUND: {e}")
        print("  Make sure all .pkl files are in models/ folder.\n")
    except Exception as e:
        print(f"\n  ✗ UNEXPECTED ERROR: {e}")
        import traceback
        traceback.print_exc()
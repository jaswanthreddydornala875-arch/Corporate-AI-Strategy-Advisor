# backend/ml/explainer.py

import os
import shap
import pandas as pd
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.normpath(os.path.join(BASE_DIR, '..', 'models'))

feature_columns    = joblib.load(os.path.join(MODELS_DIR, 'feature_columns.pkl'))
productivity_model = joblib.load(os.path.join(MODELS_DIR, 'productivity_model.pkl'))
savings_model      = joblib.load(os.path.join(MODELS_DIR, 'savings_model.pkl'))
revenue_model      = joblib.load(os.path.join(MODELS_DIR, 'revenue_model.pkl'))

# CatBoost works with TreeExplainer
prod_explainer    = shap.TreeExplainer(productivity_model)
savings_explainer = shap.TreeExplainer(savings_model)
revenue_explainer = shap.TreeExplainer(revenue_model)

# Human-readable feature names for LLM prompt
FEATURE_LABELS = {
    'industry':                   'Industry',
    'country':                    'Country',
    'year':                       'Year',
    'ai_adoption_level':          'AI Adoption Level',
    'ai_investment_usd':          'AI Investment (USD)',
    'automation_rate':            'Automation Rate',
    'employee_ai_training_hours': 'Employee AI Training Hours',
    'ai_maturity_score':          'AI Maturity Score',
    'deployment_count':           'Number of AI Deployments',
    'ai_efficiency_score':        'AI Efficiency Score',
    'training_per_deployment':    'Training Hours per Deployment',
    'investment_per_deployment':  'Investment per Deployment',
}


def get_top_drivers(X: pd.DataFrame, explainer, n=3) -> list[dict]:
    shap_values = explainer.shap_values(X)
    
    # shap_values is array of shape (1, n_features)
    drivers = []
    for i, col in enumerate(feature_columns):
        drivers.append({
            "feature":       col,
            "label":         FEATURE_LABELS.get(col, col),
            "shap_value":    float(shap_values[0][i]),
            "direction":     "positive" if shap_values[0][i] > 0 else "negative"
        })

    # Sort by absolute impact
    drivers.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
    return drivers[:n]


def explain_all(confirmed_fields: dict, engineered_fields: dict) -> dict:
    """
    Run SHAP on all 3 models.
    Returns top drivers per output for LLM prompt injection.
    """
    X = pd.DataFrame([
        [engineered_fields[col] for col in feature_columns]
    ], columns=feature_columns)

    return {
        "productivity_drivers": get_top_drivers(X, prod_explainer),
        "savings_drivers":      get_top_drivers(X, savings_explainer),
        "revenue_drivers":      get_top_drivers(X, revenue_explainer),
    }


def format_shap_for_prompt(shap_explanation: dict) -> str:
    """
    Converts SHAP output into readable text for LLM prompt.
    """
    lines = []
    for output, drivers in shap_explanation.items():
        output_label = output.replace("_drivers", "").replace("_", " ").title()
        lines.append(f"\n{output_label} key drivers:")
        for d in drivers:
            sign = "+" if d["direction"] == "positive" else "-"
            lines.append(f"  {sign} {d['label']}: {d['shap_value']:+.4f}")
    return "\n".join(lines)
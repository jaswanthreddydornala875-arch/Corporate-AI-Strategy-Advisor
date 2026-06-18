# backend/ml/predict.py

import os
import joblib
import numpy as np
import pandas as pd
from ml.preprocess import build_feature_vector, validate_fields

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.normpath(os.path.join(BASE_DIR, '..', 'models'))

# Load models once at startup — not on every request
productivity_model = joblib.load(os.path.join(MODELS_DIR, 'productivity_model.pkl'))
savings_model      = joblib.load(os.path.join(MODELS_DIR, 'savings_model.pkl'))
revenue_model      = joblib.load(os.path.join(MODELS_DIR, 'revenue_model.pkl'))
feature_columns    = joblib.load(os.path.join(MODELS_DIR, 'feature_columns.pkl'))


def run_prediction(confirmed_fields: dict) -> dict:
    """
    Main prediction function.
    Takes confirmed session state fields.
    Returns all ML outputs + business logic layer results.
    """

    # Step 1 — Validate
    is_valid, issues = validate_fields(confirmed_fields)
    if not is_valid:
        raise ValueError(f"Cannot predict — missing or invalid fields: {issues}")

    # Step 2 — Build feature vector in correct order
    vector = build_feature_vector(confirmed_fields)

    # Step 3 — Wrap in DataFrame with column names
    # CatBoost needs column names to handle categoricals correctly
    X = pd.DataFrame([vector], columns=feature_columns)

    # Step 4 — Run all 3 models
    productivity_gain = float(productivity_model.predict(X)[0])
    cost_savings      = float(savings_model.predict(X)[0])
    revenue_impact    = float(revenue_model.predict(X)[0])
    ai_investment     = confirmed_fields['ai_investment_usd']

    # Step 5 — Business logic layer
    roi = (revenue_impact + cost_savings - ai_investment) / ai_investment

    if roi > 0.5:
        risk = "Low"
    elif roi > 0:
        risk = "Medium"
    else:
        risk = "High"

    return {
        "productivity_gain": round(productivity_gain, 4),
        "cost_savings":      round(cost_savings, 2),
        "revenue_impact":    round(revenue_impact, 2),
        "roi":               round(roi, 4),
        "risk_level":        risk,
        "roi_percentage":    round(roi * 100, 2)
    }
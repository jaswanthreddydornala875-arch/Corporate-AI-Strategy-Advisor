# backend/ml/preprocess.py

import os
import numpy as np
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.normpath(os.path.join(BASE_DIR, '..', 'models'))

# Exact column order the model was trained on
FEATURE_COLUMNS = joblib.load(os.path.join(MODELS_DIR, 'feature_columns.pkl'))

def compute_engineered_features(data: dict) -> dict:
    """
    Compute the 3 engineered features from raw confirmed fields.
    These are never asked from CEO directly — computed server-side.
    """
    adoption   = data['ai_adoption_level']
    automation = data['automation_rate']
    maturity   = data['ai_maturity_score']
    training   = data['employee_ai_training_hours']
    investment = data['ai_investment_usd']
    deployments = data['deployment_count']

    # Avoid division by zero
    deployments_safe = deployments if deployments > 0 else 1

    data['ai_efficiency_score']       = adoption * automation * maturity
    data['training_per_deployment']   = training / deployments_safe
    data['investment_per_deployment'] = investment / deployments_safe

    return data


def build_feature_vector(confirmed_fields: dict) -> list:
    """
    Takes confirmed session state fields,
    computes engineered features,
    returns ordered list matching model's expected input.
    """
    data = compute_engineered_features(confirmed_fields.copy())

    # Build in exact order model expects
    vector = [data[col] for col in FEATURE_COLUMNS]
    return vector


def validate_fields(confirmed_fields: dict) -> tuple[bool, list]:
    """
    Check all required raw fields are present and valid.
    Returns (is_valid, list_of_issues)
    """
    required_raw = [
        'industry', 'country', 'year',
        'ai_adoption_level', 'ai_investment_usd', 'automation_rate',
        'employee_ai_training_hours', 'ai_maturity_score', 'deployment_count'
    ]

    issues = []

    for field in required_raw:
        if field not in confirmed_fields or confirmed_fields[field] is None:
            issues.append(f"{field} is missing")

    # Range checks
    range_checks = {
        'ai_adoption_level':  (0, 1),
        'automation_rate':    (0, 1),
        'ai_maturity_score':  (0, 1),
        'year':               (2015, 2035),
        'deployment_count':   (0, float('inf')),
        'ai_investment_usd':  (0, float('inf')),
        'employee_ai_training_hours': (0, float('inf')),
    }

    for field, (low, high) in range_checks.items():
        if field in confirmed_fields and confirmed_fields[field] is not None:
            val = confirmed_fields[field]
            if not (low <= val <= high):
                issues.append(f"{field} value {val} is out of range [{low}, {high}]")

    return len(issues) == 0, issues
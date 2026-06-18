# backend/llm/consultant.py

import json
from groq import Groq

import os
from dotenv import load_dotenv
load_dotenv()
# Allow using a mock LLM for local testing to avoid external API rate limits
if os.getenv('MOCK_LLM') == '1':
    from llm.mock_client import get_client
    client = get_client()
else:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
# ─────────────────────────────────────────
# SUB-SCORE CALCULATORS
# Each takes session fields and returns 0-100
# ─────────────────────────────────────────

def score_data_readiness(fields: dict) -> dict:
    """
    Factors: data_availability, data_quality, 
             data_storage, data_governance
    """
    scores = {}

    availability_map = {"high": 100, "medium": 60, "low": 20, None: 0}
    quality_map      = {"high": 100, "medium": 60, "low": 20, None: 0}
    governance_map   = {"strong": 100, "moderate": 60, "weak": 20, None: 30}

    scores["data_availability"] = availability_map.get(
        fields.get("data_availability", {}).get("value"), 30
    )
    scores["data_quality"] = quality_map.get(
        fields.get("data_quality", {}).get("value"), 30
    )
    scores["data_governance"] = governance_map.get(
        fields.get("data_governance", {}).get("value"), 30
    )

    # Storage bonus — structured storage = higher readiness
    storage = fields.get("data_storage", {}).get("value", "")
    if storage and any(x in str(storage).lower() for x in ["sql", "warehouse", "cloud"]):
        scores["data_storage"] = 80
    elif storage:
        scores["data_storage"] = 50
    else:
        scores["data_storage"] = 20

    overall = round(sum(scores.values()) / len(scores))
    return {"sub_scores": scores, "overall": overall}


def score_org_readiness(fields: dict) -> dict:
    """
    Factors: leadership_support, digital_maturity,
             change_readiness, employee_count
    """
    scores = {}

    support_map  = {"strong": 100, "moderate": 60, "weak": 20, None: 30}
    maturity_map = {"high": 100, "medium": 60, "low": 20, None: 30}
    change_map   = {"high": 100, "medium": 60, "low": 20, None: 30}

    scores["leadership_support"] = support_map.get(
        fields.get("leadership_support", {}).get("value"), 30
    )
    scores["digital_maturity"] = maturity_map.get(
        fields.get("digital_maturity", {}).get("value"), 30
    )
    scores["change_readiness"] = change_map.get(
        fields.get("change_readiness", {}).get("value"), 30
    )

    # Employee count proxy — larger orgs have more change friction
    emp = fields.get("employee_count", {}).get("value")
    if emp:
        if emp < 100:
            scores["scale_factor"] = 90   # small = agile
        elif emp < 1000:
            scores["scale_factor"] = 70
        elif emp < 10000:
            scores["scale_factor"] = 50
        else:
            scores["scale_factor"] = 35   # large = slow to change
    else:
        scores["scale_factor"] = 50

    overall = round(sum(scores.values()) / len(scores))
    return {"sub_scores": scores, "overall": overall}


def score_technical_readiness(fields: dict) -> dict:
    """
    Factors: ai_maturity_score, automation_rate,
             deployment_count, ai_adoption_level
    All from confirmed ML fields — always available at this point
    """
    scores = {}

    maturity   = fields.get("ai_maturity_score",  {}).get("value", 0) or 0
    automation = fields.get("automation_rate",     {}).get("value", 0) or 0
    adoption   = fields.get("ai_adoption_level",   {}).get("value", 0) or 0
    deploys    = fields.get("deployment_count",    {}).get("value", 0) or 0

    scores["ai_maturity"]   = round(maturity   * 100)
    scores["automation"]    = round(automation * 100)
    scores["adoption"]      = round(adoption   * 100)

    # Deployment count score — normalized, cap at 20 deployments
    scores["deployments"]   = min(round((deploys / 20) * 100), 100)

    overall = round(sum(scores.values()) / len(scores))
    return {"sub_scores": scores, "overall": overall}


def compute_readiness_scores(session: dict) -> dict:
    fields = session["fields"]

    data   = score_data_readiness(fields)
    org    = score_org_readiness(fields)
    tech   = score_technical_readiness(fields)

    overall = round(
        (data["overall"] * 0.35) +
        (org["overall"]  * 0.30) +
        (tech["overall"] * 0.35)
    )

    return {
        "data_readiness":     data,
        "org_readiness":      org,
        "tech_readiness":     tech,
        "overall_readiness":  overall
    }


# ─────────────────────────────────────────
# LLM-POWERED ASSESSMENTS
# ─────────────────────────────────────────

def assess_business_need(session: dict) -> dict:
    """
    LLM determines if AI is actually the right solution
    for the stated pain points and use cases.
    """
    fields = session["fields"]

    pain_points   = fields.get("pain_points",           {}).get("value", "Not specified")
    use_cases     = fields.get("proposed_ai_use_cases", {}).get("value", "Not specified")
    processes     = fields.get("current_processes",     {}).get("value", "Not specified")
    manual        = fields.get("manual_workflows",      {}).get("value", "Not specified")

    prompt = f"""You are a senior AI strategy consultant evaluating 
whether AI is the right solution for a company.

Company Pain Points: {pain_points}
Proposed AI Use Cases: {use_cases}
Current Processes: {processes}
Manual Workflows: {manual}

Evaluate whether AI adoption is genuinely justified.
Consider: Could simpler solutions (process redesign, basic automation) 
solve these problems instead?

Return ONLY valid JSON — no markdown, no explanation:
{{
  "ai_justified": true or false,
  "justification": "2-3 sentence explanation",
  "alternative_if_not": "only if ai_justified=false — what to do instead",
  "highest_impact_use_case": "the single best AI use case for this company",
  "recommended_starting_point": "where they should begin"
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=400
    )

    try:
        return json.loads(response.choices[0].message.content.strip())
    except json.JSONDecodeError:
        return {
            "ai_justified": True,
            "justification": "Assessment inconclusive due to limited information.",
            "highest_impact_use_case": "To be determined",
            "recommended_starting_point": "Begin with a focused pilot program"
        }


def assess_vendor_alignment(session: dict) -> dict:
    """
    Evaluates whether the vendor's recommendation 
    actually fits the company's needs.
    """
    fields = session["fields"]

    vendor     = fields.get("vendor_recommendation", {}).get("value")
    use_cases  = fields.get("proposed_ai_use_cases", {}).get("value", "Not specified")
    pain_points= fields.get("pain_points",           {}).get("value", "Not specified")
    budget     = fields.get("budget_range",          {}).get("value", "Not specified")
    timeline   = fields.get("timeline",              {}).get("value", "Not specified")

    if not vendor:
        return {
            "vendor_provided": False,
            "message": "No vendor recommendation provided — skipping alignment check."
        }

    prompt = f"""You are evaluating whether a vendor's AI recommendation 
fits a company's actual needs.

Vendor Recommendation: {vendor}
Company Pain Points: {pain_points}
Proposed Use Cases: {use_cases}
Budget: {budget}
Timeline: {timeline}

Return ONLY valid JSON:
{{
  "alignment_score": 0-100,
  "verdict": "Recommended" or "Not Recommended" or "Proceed with Caution",
  "reasoning": "2-3 sentences",
  "risks": ["risk 1", "risk 2"],
  "better_alternative": "only if verdict is Not Recommended"
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=400
    )

    try:
        result = json.loads(response.choices[0].message.content.strip())
        result["vendor_provided"] = True
        return result
    except json.JSONDecodeError:
        return {
            "vendor_provided": True,
            "alignment_score": 50,
            "verdict": "Proceed with Caution",
            "reasoning": "Could not fully assess vendor alignment.",
            "risks": []
        }


def generate_roadmap(session: dict, readiness: dict, ml_results: dict) -> dict:
    """
    Generates a phased AI adoption roadmap based on
    readiness scores + ML predictions + company context.
    """
    fields = session["fields"]

    industry   = fields.get("industry",              {}).get("value", "Unknown")
    use_cases  = fields.get("proposed_ai_use_cases", {}).get("value", "Not specified")
    timeline   = fields.get("timeline",              {}).get("value", "12 months")
    budget     = fields.get("budget_range",          {}).get("value", "Not specified")

    overall_readiness = readiness["overall_readiness"]
    risk_level        = ml_results.get("risk_level", "Medium")
    roi               = ml_results.get("roi_percentage", 0)

    prompt = f"""You are a senior AI strategy consultant creating a 
phased adoption roadmap.

Company Context:
- Industry: {industry}
- Proposed Use Cases: {use_cases}
- Timeline: {timeline}
- Budget: {budget}

Readiness Assessment:
- Overall Readiness Score: {overall_readiness}/100
- Data Readiness:  {readiness['data_readiness']['overall']}/100
- Org Readiness:   {readiness['org_readiness']['overall']}/100
- Tech Readiness:  {readiness['tech_readiness']['overall']}/100

ML Predictions:
- Risk Level: {risk_level}
- Projected ROI: {roi}%

Create a 3-phase roadmap. Return ONLY valid JSON:
{{
  "phase_1": {{
    "title": "phase name",
    "duration": "e.g. 0-3 months",
    "focus": "main objective",
    "actions": ["action 1", "action 2", "action 3"],
    "success_metric": "how to measure success"
  }},
  "phase_2": {{
    "title": "phase name",
    "duration": "e.g. 3-9 months",
    "focus": "main objective",
    "actions": ["action 1", "action 2", "action 3"],
    "success_metric": "how to measure success"
  }},
  "phase_3": {{
    "title": "phase name",
    "duration": "e.g. 9-18 months",
    "focus": "main objective",
    "actions": ["action 1", "action 2", "action 3"],
    "success_metric": "how to measure success"
  }},
  "critical_dependencies": ["dependency 1", "dependency 2"],
  "quick_win": "one thing they can do in the next 30 days"
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=800
    )

    try:
        return json.loads(response.choices[0].message.content.strip())
    except json.JSONDecodeError:

        return {
            "quick_win": "Conduct an AI readiness audit across all departments",
            "phase_1": {"title": "Foundation", "duration": "0-3 months", 
                        "focus": "Data and infrastructure preparation",
                        "actions": ["Assess data quality", "Train staff", "Define KPIs"],
                        "success_metric": "Data readiness score above 80"},
            "phase_2": {"title": "Pilot", "duration": "3-9 months",
                        "focus": "Deploy first high-impact use case",
                        "actions": ["Launch document intelligence", "Monitor results", "Iterate"],
                        "success_metric": "30% reduction in processing time"},
            "phase_3": {"title": "Scale", "duration": "9-18 months",
                        "focus": "Expand successful pilots",
                        "actions": ["Roll out fraud detection", "Automate workflows", "Measure ROI"],
                        "success_metric": "Positive ROI achieved"},
            "critical_dependencies": ["Data quality improvement", "Staff training"],
        }

# ─────────────────────────────────────────
# MAIN ENTRY POINT
# ─────────────────────────────────────────

def run_consulting_pipeline(session: dict) -> dict:
    """
    Runs all consulting assessments in sequence.
    Called once when session.ready_for_report = True.
    """
    ml_results = session.get("ml_results", {})

    # 1. Compute rule-based readiness scores
    readiness = compute_readiness_scores(session)

    # 2. LLM assessments
    business_need     = assess_business_need(session)
    vendor_alignment  = assess_vendor_alignment(session)
    roadmap           = generate_roadmap(session, readiness, ml_results)

    return {
        "readiness":         readiness,
        "business_need":     business_need,
        "vendor_alignment":  vendor_alignment,
        "roadmap":           roadmap
    }
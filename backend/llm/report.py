# backend/llm/report.py

import json
from groq import Groq
from ml.explainer import format_shap_for_prompt

import os
from dotenv import load_dotenv
load_dotenv()
# Allow using a mock LLM for local testing to avoid external API rate limits
if os.getenv('MOCK_LLM') == '1':
    from llm.mock_client import get_client
    client = get_client()
else:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def build_report_context(session: dict) -> str:
    """
    Assembles everything into one structured context block
    used by both report generation and post-report chatbot.
    """
    fields     = session["fields"]
    ml         = session["ml_results"]
    consulting = session["consulting_results"]
    shap       = session["shap_explanation"]
    readiness  = consulting["readiness"]
    roadmap    = consulting["roadmap"]
    biz_need   = consulting["business_need"]
    vendor     = consulting["vendor_alignment"]

    def fv(field_name):
        return fields.get(field_name, {}).get("value", "Not specified")

    def fv_currency(field_name):
        val = fv(field_name)
        try:
            return f"${float(val):,.2f}"
        except (ValueError, TypeError):
            return "Not specified"

    def fv_pct(field_name):
        val = fv(field_name)
        try:
            return f"{float(val)*100:.1f}%"
        except (ValueError, TypeError):
            return "Not specified"

    context = f"""
=== COMPANY PROFILE ===
Industry:          {fv('industry')}
Country:           {fv('country')}
Year:              {fv('year')}
Company Size:      {fv('company_size')} ({fv('employee_count')} employees)
Revenue Range:     {fv('revenue_range')}

=== AI PROFILE ===
AI Adoption Level:     {fv('ai_adoption_level')}
AI Investment:         {fv_currency('ai_investment_usd')}
Automation Rate:       {fv_pct('automation_rate')}
AI Maturity Score:     {fv('ai_maturity_score')}
Deployment Count:      {fv('deployment_count')}
Training Hours:        {fv('employee_ai_training_hours')}

=== ML PREDICTIONS ===
Productivity Gain:  {ml['productivity_gain']}
Cost Savings:       ${ml['cost_savings']:,.2f}
Revenue Impact:     ${ml['revenue_impact']:,.2f}
ROI:                {ml['roi_percentage']}%
Risk Level:         {ml['risk_level']}

=== SHAP EXPLANATIONS ===
{format_shap_for_prompt(shap)}

=== READINESS SCORES ===
Overall Readiness:  {readiness['overall_readiness']}/100
Data Readiness:     {readiness['data_readiness']['overall']}/100
  - Availability:   {readiness['data_readiness']['sub_scores'].get('data_availability', 'N/A')}
  - Quality:        {readiness['data_readiness']['sub_scores'].get('data_quality', 'N/A')}
  - Governance:     {readiness['data_readiness']['sub_scores'].get('data_governance', 'N/A')}
  - Storage:        {readiness['data_readiness']['sub_scores'].get('data_storage', 'N/A')}
Org Readiness:      {readiness['org_readiness']['overall']}/100
  - Leadership:     {readiness['org_readiness']['sub_scores'].get('leadership_support', 'N/A')}
  - Digital Mat.:   {readiness['org_readiness']['sub_scores'].get('digital_maturity', 'N/A')}
  - Change Ready:   {readiness['org_readiness']['sub_scores'].get('change_readiness', 'N/A')}
Tech Readiness:     {readiness['tech_readiness']['overall']}/100
  - AI Maturity:    {readiness['tech_readiness']['sub_scores'].get('ai_maturity', 'N/A')}
  - Automation:     {readiness['tech_readiness']['sub_scores'].get('automation', 'N/A')}
  - Adoption:       {readiness['tech_readiness']['sub_scores'].get('adoption', 'N/A')}

=== BUSINESS NEED ASSESSMENT ===
AI Justified:         {biz_need.get('ai_justified')}
Justification:        {biz_need.get('justification')}
Highest Impact Case:  {biz_need.get('highest_impact_use_case')}
Starting Point:       {biz_need.get('recommended_starting_point')}

=== VENDOR ALIGNMENT ===
{json.dumps(vendor, indent=2) if vendor.get('vendor_provided') else 'No vendor recommendation provided.'}

=== ROADMAP ===
Quick Win (30 days): {roadmap.get('quick_win', 'N/A')}
Phase 1: {roadmap.get('phase_1', {}).get('title')} — {roadmap.get('phase_1', {}).get('duration')}
Phase 2: {roadmap.get('phase_2', {}).get('title')} — {roadmap.get('phase_2', {}).get('duration')}
Phase 3: {roadmap.get('phase_3', {}).get('title')} — {roadmap.get('phase_3', {}).get('duration')}
"""
    return context.strip()

    
def generate_report(session: dict) -> dict:
    """
    Generates the final executive report narrative.
    Returns structured report with both raw data and LLM narrative.
    """
    context = build_report_context(session)
    ml      = session["ml_results"]
    consulting = session["consulting_results"]

    system_prompt = """You are a senior AI strategy consultant writing 
an executive report for a CEO. 

Rules:
- Be specific — cite actual numbers from the context
- No generic advice — every recommendation must reference their data
- Professional but readable — this is for a CEO, not a data scientist
- Structure your response in exactly the sections requested
- Do not add sections not asked for"""

    user_prompt = f"""Based on this complete analysis:

{context}

Write an executive report with these exact sections:

1. EXECUTIVE SUMMARY (3 sentences — situation, prediction, recommendation)
2. KEY FINDINGS (4 bullet points — most important insights from ML + readiness)
3. RISK ANALYSIS (explain the {ml['risk_level']} risk level and what drives it)
4. STRATEGIC RECOMMENDATION (top 3 specific actions, each with expected impact)
5. EXECUTIVE VERDICT (1 paragraph — should they proceed with AI adoption now, wait, or pivot?)
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_prompt}
        ],
        temperature=0.3,
        max_tokens=1200
    )

    narrative = response.choices[0].message.content.strip()

    # Store full context in session for post-report chatbot
    session["report_context"] = context
    session["conversation_history"].append({
        "role":    "assistant",
        "content": narrative
    })

    # Return structured report — frontend renders each part separately
    return {
        "narrative":   narrative,
        "ml_results":  ml,
        "readiness":   consulting["readiness"],
        "business_need":    consulting["business_need"],
        "vendor_alignment": consulting["vendor_alignment"],
        "roadmap":     consulting["roadmap"],
        "shap":        session["shap_explanation"]
    }


def stream_followup(question: str, session: dict):
    """
    Post-report chatbot — streams answers grounded in full report context.
    Generator function — used with FastAPI StreamingResponse.
    """
    context = session.get("report_context", "")

    system_prompt = f"""You are a senior AI strategy consultant.
You already generated a complete report for this company.
Answer follow-up questions using ONLY information from the report below.
Be specific. Reference actual numbers and scores.
Never give generic advice.

FULL REPORT CONTEXT:
{context}"""

    # Build message history — full conversation so LLM remembers
    messages = [{"role": "system", "content": system_prompt}]
    messages += session["conversation_history"]
    messages.append({"role": "user", "content": question})

    stream = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        stream=True,
        temperature=0.3,
        max_tokens=600
    )

    # Yield chunks as Server-Sent Events
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield f"data: {delta}\n\n"

    # Signal stream end
    yield "data: [DONE]\n\n"
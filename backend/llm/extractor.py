# backend/llm/extractor.py

import json
from groq import Groq
from llm.session_state import FIELD_DEFINITIONS, get_missing_ml_fields, get_missing_consulting_fields

import os
from dotenv import load_dotenv
load_dotenv()
# Allow using a mock LLM for local testing to avoid external API rate limits
if os.getenv('MOCK_LLM') == '1':
    from llm.mock_client import get_client
    client = get_client()
else:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def build_extraction_prompt(user_message: str, session: dict) -> str:

    # Summarize what's already known
    known_lines = []
    for name, data in session["fields"].items():
        if data["status"] != "missing":
            known_lines.append(
                f"  {name}: {data['value']} "
                f"(status={data['status']}, confidence={data['confidence']})"
            )
    known_summary = "\n".join(known_lines) if known_lines else "Nothing known yet."

    missing_ml   = get_missing_ml_fields(session)
    missing_consult = get_missing_consulting_fields(session)

    system_prompt = f"""You are extracting structured business information 
from a CEO's message. 

ALREADY KNOWN — do NOT re-extract or re-ask:
{known_summary}

STILL MISSING FOR ML PREDICTION:
{missing_ml}

STILL MISSING FOR CONSULTING:
{missing_consult}

RULES:
1. Extract everything the CEO explicitly said OR can be reasonably concluded 
   from their message. Be thorough — extract ALL relevant fields from each 
   message, not just the most obvious one.
2. Never invent values with no basis. If unsure, do not include the field.
3. Mark source as "CEO" if CEO stated it, "LLM" if you inferred it.
4. For LLM inferences, include a confidence score (0-100).
5. Return ONLY valid JSON. No explanation. No markdown.

FIELD SPECIFIC RULES:
- year: extract the planning or strategy year as a number like 2026. 
  If CEO mentions a future timeline or planning horizon, infer the year 
  from context with source="LLM" and confidence=70.
- ai_adoption_level: number between 0 and 1. CEO may say "0.45 out of 1".
- automation_rate: convert percentage to decimal. 38% becomes 0.38.
- employee_ai_training_hours: annual hours per employee as a number.
- deployment_count: total number of AI deployments as a number.
- ai_investment_usd: annual investment in USD as a number. 
  "5 million dollars" becomes 5000000.
- ai_maturity_score: number between 0 and 1.


OUTPUT FORMAT:
{{
  "field_name": {{
    "value": <extracted value>,
    "source": "CEO" or "LLM",
    "confidence": 0-100
  }}
}}

If nothing new can be extracted, return: {{}}
"""

    return system_prompt


def extract_fields(user_message: str, session: dict) -> dict:
    """
    Send CEO message to LLM, get structured field extraction back.
    Returns dict of newly extracted fields.
    """
    system_prompt = build_extraction_prompt(user_message, session)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_message}
        ],
        temperature=0.1,     # very low — factual extraction task
        max_tokens=500
    )

    raw = response.choices[0].message.content.strip()

    try:
        extracted = json.loads(raw)
    except json.JSONDecodeError:
        extracted = {}

    # Debug — print what was extracted each turn
    print(f"\n[EXTRACTOR] Raw LLM output: {raw}")
    print(f"[EXTRACTOR] Extracted fields: {list(extracted.keys())}")

    return extracted


def generate_followup_question(session: dict) -> str:
    missing_ml      = get_missing_ml_fields(session)
    missing_consult = get_missing_consulting_fields(session)

    # Skip revenue_range — not critical, don't keep asking
    SKIP_FIELDS = ["revenue_range"]
    missing_consult = [f for f in missing_consult if f not in SKIP_FIELDS]

    priority_field = missing_ml[0] if missing_ml else (
        missing_consult[0] if missing_consult else None
    )

    if not priority_field:
        return "I think I have everything I need. Let me generate your report."

    known_context = {
        name: data["value"]
        for name, data in session["fields"].items()
        if data["status"] != "missing"
    }

    prompt = f"""You are a senior AI strategy consultant conducting 
a discovery session with a CEO.

What you already know about their company:
{json.dumps(known_context, indent=2)}

You need to learn: "{priority_field}"

Ask ONE natural, conversational question to gather this information.
- Sound like a consultant, not a form
- Reference what you already know to make it flow naturally  
- Keep it to 1-2 sentences maximum
- Do not mention the field name literally
- Do NOT ask about revenue or company size if already known"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=100
    )

    return response.choices[0].message.content.strip()
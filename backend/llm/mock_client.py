import re
import json
import time

class _ChoiceMessage:
    def __init__(self, content):
        self.content = content

class _Choice:
    def __init__(self, content):
        self.message = _ChoiceMessage(content)
        self.delta = type('D', (), {'content': content})

class _Response:
    def __init__(self, content):
        self.choices = [_Choice(content)]

class MockCompletions:
    def create(self, model, messages, temperature=0.3, max_tokens=500, stream=False, **kwargs):
        # Determine intent by inspecting system prompt or messages
        user_content = None
        for m in messages[::-1]:
            if m.get('role') == 'user':
                user_content = m.get('content')
                break

        # Extraction-like behavior: try to pull simple patterns from user_content
        if user_content and 'extract' not in user_content.lower() and 'ALREADY KNOWN' in messages[0].get('content', ''):
            extracted = {}
            # year
            m = re.search(r"\b(20\d{2})\b", user_content)
            if m:
                extracted['year'] = {"value": int(m.group(1)), "source": "CEO", "confidence": 100}
            # employees
            m = re.search(r"(\d{1,6})\s*(employees|people|staff)", user_content)
            if m:
                extracted['employee_count'] = {"value": int(m.group(1)), "source": "CEO", "confidence": 100}
            # dollars / million
            m = re.search(r"(\$?\s*[\d,.]+)\s*(million|billion)?\s*(dollars)?", user_content, re.IGNORECASE)
            if m:
                num = m.group(1)
                num = num.replace('$','').replace(',','').strip()
                try:
                    val = float(num)
                    mult = 1
                    if m.group(2):
                        if m.group(2).lower().startswith('million'):
                            mult = 1_000_000
                        elif m.group(2).lower().startswith('billion'):
                            mult = 1_000_000_000
                    extracted['ai_investment_usd'] = {"value": int(val*mult), "source": "CEO", "confidence": 100}
                except Exception:
                    pass
            # percentages
            m = re.search(r"(\d{1,3})\s*%", user_content)
            if m:
                pct = int(m.group(1))/100.0
                extracted['automation_rate'] = {"value": pct, "source": "CEO", "confidence": 100}
            # simple text fields
            if 'loan' in user_content.lower():
                extracted['pain_points'] = {"value": ["manual loan approval"], "source":"CEO", "confidence":100}

            return _Response(json.dumps(extracted))

        # Followup question generation fallback
        if user_content and 'You are a senior AI strategy consultant' in messages[0].get('content','') and 'Ask ONE natural' in user_content:
            return _Response("Can you tell me your company's annual revenue and typical transaction volume?")

        # Business need assessment
        if user_content and 'You are a senior AI strategy consultant evaluating' in user_content:
            obj = {
                "ai_justified": True,
                "justification": "AI addresses the main pain points by automating document processing and reducing manual approvals.",
                "alternative_if_not": "Improve process automation and staffing",
                "highest_impact_use_case": "document intelligence",
                "recommended_starting_point": "Run a focused pilot on document processing"
            }
            return _Response(json.dumps(obj))

        # Vendor alignment
        if user_content and 'You are evaluating whether a vendor' in user_content:
            res = {
                "alignment_score": 60,
                "verdict": "Proceed with Caution",
                "reasoning": "Vendor's solution partly addresses core pain points but may require integration work.",
                "risks": ["integration cost", "data quality"],
                "better_alternative": "Select vendor with strong data pipeline support"
            }
            return _Response(json.dumps(res))

        # Roadmap
        if user_content and 'You are a senior AI strategy consultant creating a' in user_content:
            roadmap = {
                "phase_1": {"title":"Foundation","duration":"0-3 months","focus":"Data and infra","actions":["Assess data quality","Set up pipeline","Train team"],"success_metric":"Data readiness >80"},
                "phase_2": {"title":"Pilot","duration":"3-9 months","focus":"Deploy use case","actions":["Launch document intelligence","Monitor","Iterate"],"success_metric":"30% reduction in processing time"},
                "phase_3": {"title":"Scale","duration":"9-18 months","focus":"Expand","actions":["Roll out","Automate","Measure ROI"],"success_metric":"Positive ROI"},
                "critical_dependencies": ["Data quality","Leadership support"],
                "quick_win": "Conduct an AI readiness audit across all departments"
            }
            return _Response(json.dumps(roadmap))

        # Report generation / narrative
        if user_content and 'Based on this complete analysis' in user_content:
            narrative = "EXECUTIVE SUMMARY:\nThe company should pilot document intelligence to reduce manual loan approvals. ML predicts productivity gains but ROI will depend on data quality and integration costs. Recommended starting point: 3-month pilot."
            return _Response(narrative)

        # Stream fallback: return incremental tokens via a generator factory
        if stream:
            def gen_stream():
                text = "This is a mocked streamed response from the report chatbot."
                for word in text.split():
                    time.sleep(0.01)
                    yield type('C', (), {'choices': [type('X', (), {'delta': type('D', (), {'content': word + ' '})})]})
                return
            return gen_stream()

        # Default empty
        return _Response('{}')

class MockClient:
    def __init__(self):
        self.chat = type('C', (), {'completions': MockCompletions()})


# convenience
def get_client():
    return MockClient()

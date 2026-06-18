# full_test.py
import urllib.request
import json
import time

BASE = "http://127.0.0.1:8001"

def post(endpoint, payload=None):
    data = json.dumps(payload).encode() if payload else None
    headers = {"Content-Type": "application/json"} if data else {}
    req = urllib.request.Request(
        f"{BASE}{endpoint}",
        data=data,
        headers=headers,
        method="POST"
    )
    res = urllib.request.urlopen(req)
    return json.loads(res.read())


def print_response(turn, response):
    print(f"\n{'='*60}")
    print(f"TURN {turn} — type: {response.get('type', 'unknown')}")
    print(f"{'='*60}")

    if response.get("type") == "question":
        print(f"Assistant: {response['message']}")
        p = response["progress"]
        print(f"\nProgress:")
        print(f"  ML fields:         {p['ml_fields']['confirmed']}/{p['ml_fields']['total']}")
        print(f"  Consulting fields: {p['consulting_fields']['confirmed']}/{p['consulting_fields']['total']}")
        print(f"  Ready for ML:      {p['ready_for_ml']}")
        print(f"  Ready for report:  {p['ready_for_report']}")

    elif response.get("type") == "report":
        report = response["report"]
        print("REPORT GENERATED")
        print(f"\nML Results:")
        ml = report["ml_results"]
        print(f"  Productivity Gain: {ml['productivity_gain']}")
        print(f"  Cost Savings:      ${ml['cost_savings']:,.2f}")
        print(f"  Revenue Impact:    ${ml['revenue_impact']:,.2f}")
        print(f"  ROI:               {ml['roi_percentage']}%")
        print(f"  Risk Level:        {ml['risk_level']}")
        print(f"\nReadiness Scores:")
        r = report["readiness"]
        print(f"  Overall:  {r['overall_readiness']}/100")
        print(f"  Data:     {r['data_readiness']['overall']}/100")
        print(f"  Org:      {r['org_readiness']['overall']}/100")
        print(f"  Tech:     {r['tech_readiness']['overall']}/100")
        print(f"\nBusiness Need:")
        b = report["business_need"]
        print(f"  AI Justified: {b['ai_justified']}")
        print(f"  {b['justification']}")
        print(f"\nVendor Alignment:")
        v = report["vendor_alignment"]
        if v["vendor_provided"]:
            print(f"  Score:   {v.get('alignment_score')}/100")
            print(f"  Verdict: {v.get('verdict')}")
        print(f"\nRoadmap Quick Win: {report['roadmap'].get('quick_win', 'N/A')}")
        print(f"\nNarrative Preview:")
        print(report["narrative"][:500] + "...")

        with open("full_test_output.json", "w") as f:
            json.dump(report, f, indent=2, default=str)
        print("\nFull report saved to full_test_output.json")


messages = [
    "We are a mid-sized bank headquartered in the United States.",
    "We are planning our AI strategy for the year 2026.",
    "We have around 500 employees. Our annual AI investment is about 5 million dollars.",
    "We currently have 8 AI deployments running across the organization.",
    "Our AI adoption level I would say is around 0.45 out of 1. About 38 percent of our workflows are automated.",
    "Our AI maturity score is around 0.5. Employees receive roughly 120 hours of AI training annually.",
    "Our change readiness is medium and our digital maturity is moderate. We have strong data governance and high data availability overall.",
    "Our main pain points are manual loan approval and slow document processing. We are looking at document intelligence and fraud detection as our main AI use cases.",
    "Our data is stored in SQL databases and a data warehouse. Data quality is medium and we have moderate governance policies.",
    "Leadership is strongly supportive of AI. We are planning an 18 month timeline with a budget of around 5 to 10 million dollars. A vendor has recommended a GenAI chatbot for customer support.",
]


def run():
    print("\n" + "="*60)
    print("FULL END-TO-END PIPELINE TEST")
    print("="*60)

    session = post("/session/new")
    session_id = session["session_id"]
    print(f"\nSession created: {session_id}")

    report_received = False

    for i, message in enumerate(messages):
        print(f"\n[Sending turn {i+1}]")
        print(f"CEO: {message[:80]}...")

        response = post("/chat", {
            "session_id": session_id,
            "message": message
        })

        print_response(i + 1, response)

        if response.get("type") == "report":
            report_received = True
            break

        time.sleep(1)

    if not report_received:
        print("\n⚠ Report not generated after all messages.")
        print("Check progress numbers above — which ML fields are still missing?")
        return                          # ← exit early, no followup to test

    print("\n" + "="*60)
    print("FULL PIPELINE TEST COMPLETE")
    print("="*60)

    # ── Followup chatbot test ──────────────────────────────
    print("\n[Testing follow-up chatbot]")
    followup_payload = json.dumps({
        "session_id": session_id,
        "question": "Why is my ROI negative and what should I do first?"
    }).encode()

    req = urllib.request.Request(
        f"{BASE}/followup",
        data=followup_payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    res = urllib.request.urlopen(req)
    print("Followup response:")
    for line in res:
        line = line.decode().strip()
        if line.startswith("data:") and "[DONE]" not in line:
            print(line[5:], end="", flush=True)
    print("\n\n[OK] Chatbot working")


if __name__ == "__main__":
    run()
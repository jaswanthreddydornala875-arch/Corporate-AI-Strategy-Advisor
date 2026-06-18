# backend/main.py
from dotenv import load_dotenv
import os
load_dotenv()
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from llm.session_state import (
    create_session, update_fields, get_confirmed_ml_values,
    get_progress_summary
)
from llm.extractor import extract_fields, generate_followup_question
from llm.consultant import run_consulting_pipeline
from llm.report import generate_report
from ml.predict import run_prediction
from ml.explainer import explain_all
from ml.preprocess import compute_engineered_features

app = FastAPI()

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "https://corporate-ai-strategy-advisor-seven.vercel.app",
]

# Render injects this automatically (see render.yaml) once the frontend
# static site exists, so the deployed frontend is always allowed.
frontend_url = os.environ.get("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    # Covers Vercel preview deployments and any Render *.onrender.com URL,
    # since allow_origins only does exact string matches.
    allow_origin_regex=r"https://.*\.(vercel\.app|onrender\.com)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sessions = {}


# ── Health check — Render needs this ──────────────
@app.get("/")
def root():
    return {"status": "Corporate AI Strategy Advisor API is running"}


class ChatRequest(BaseModel):
    session_id: str
    message: str


class FollowupRequest(BaseModel):
    session_id: str
    question: str


@app.post("/session/new")
def new_session():
    import uuid
    session_id = str(uuid.uuid4())
    sessions[session_id] = create_session()
    return {"session_id": session_id}


@app.post("/chat")
async def chat(req: ChatRequest):
    session = sessions.get(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session["conversation_history"].append({
        "role": "user", "content": req.message
    })

    extracted = extract_fields(req.message, session)
    session = update_fields(session, extracted)
    sessions[req.session_id] = session

    if session["ready_for_ml"] and session["ml_results"] is None:
        confirmed = get_confirmed_ml_values(session)
        engineered = compute_engineered_features(confirmed.copy())
        session["ml_results"]       = run_prediction(confirmed)
        session["shap_explanation"] = explain_all(confirmed, engineered)

    if session["ready_for_report"] and not session["report_generated"]:
        session["consulting_results"] = run_consulting_pipeline(session)
        report = generate_report(session)
        session["report_generated"] = True
        sessions[req.session_id] = session
        return {
            "type":     "report",
            "report":   report,
            "progress": get_progress_summary(session)
        }

    followup = generate_followup_question(session)
    session["conversation_history"].append({
        "role": "assistant", "content": followup
    })
    sessions[req.session_id] = session

    return {
        "type":     "question",
        "message":  followup,
        "progress": get_progress_summary(session)
    }


@app.post("/followup")
async def followup(req: FollowupRequest):
    session = sessions.get(req.session_id)
    if not session or not session["report_generated"]:
        raise HTTPException(status_code=400, detail="Report not yet generated")

    from llm.report import stream_followup
    return StreamingResponse(
        stream_followup(req.question, session),
        media_type="text/event-stream"
    )


@app.get("/progress/{session_id}")
def progress(session_id: str):
    session = sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return get_progress_summary(session)


# ── Render deployment ──────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8001))
    )
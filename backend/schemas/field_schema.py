# backend/schemas/field_schema.py

from pydantic import BaseModel, Field
from typing import Optional, Literal


# ─────────────────────────────────────────
# REQUEST SCHEMAS (Frontend → Backend)
# ─────────────────────────────────────────

class NewSessionResponse(BaseModel):
    session_id: str


class ChatRequest(BaseModel):
    session_id: str
    message: str


class FollowupRequest(BaseModel):
    session_id: str
    question: str


# ─────────────────────────────────────────
# FIELD-LEVEL SCHEMA (Inside Session State)
# ─────────────────────────────────────────

class FieldEntry(BaseModel):
    value:      Optional[str | int | float] = None
    source:     Optional[Literal["CEO", "LLM"]] = None
    confidence: int = Field(default=0, ge=0, le=100)
    status:     Literal["missing", "inferred", "confirmed"] = "missing"


# ─────────────────────────────────────────
# ML OUTPUT SCHEMA
# ─────────────────────────────────────────

class MLResults(BaseModel):
    productivity_gain: float
    cost_savings:      float
    revenue_impact:    float
    roi:               float
    roi_percentage:    float
    risk_level:        Literal["Low", "Medium", "High"]


# ─────────────────────────────────────────
# SHAP SCHEMA
# ─────────────────────────────────────────

class SHAPDriver(BaseModel):
    feature:    str
    label:      str
    shap_value: float
    direction:  Literal["positive", "negative"]


class SHAPExplanation(BaseModel):
    productivity_drivers: list[SHAPDriver]
    savings_drivers:      list[SHAPDriver]
    revenue_drivers:      list[SHAPDriver]


# ─────────────────────────────────────────
# READINESS SCHEMA
# ─────────────────────────────────────────

class ReadinessComponent(BaseModel):
    sub_scores: dict[str, int]
    overall:    int = Field(ge=0, le=100)


class ReadinessScores(BaseModel):
    data_readiness:    ReadinessComponent
    org_readiness:     ReadinessComponent
    tech_readiness:    ReadinessComponent
    overall_readiness: int = Field(ge=0, le=100)


# ─────────────────────────────────────────
# CONSULTING SCHEMAS
# ─────────────────────────────────────────

class BusinessNeedAssessment(BaseModel):
    ai_justified:              bool
    justification:             str
    highest_impact_use_case:   str
    recommended_starting_point:str
    alternative_if_not:        Optional[str] = None


class VendorAlignment(BaseModel):
    vendor_provided:   bool
    alignment_score:   Optional[int]   = Field(default=None, ge=0, le=100)
    verdict:           Optional[Literal["Recommended", "Not Recommended", "Proceed with Caution"]] = None
    reasoning:         Optional[str]   = None
    risks:             Optional[list[str]] = None
    better_alternative:Optional[str]   = None
    message:           Optional[str]   = None   # when vendor_provided=False


class RoadmapPhase(BaseModel):
    title:          str
    duration:       str
    focus:          str
    actions:        list[str]
    success_metric: str


class Roadmap(BaseModel):
    phase_1:                RoadmapPhase
    phase_2:                RoadmapPhase
    phase_3:                RoadmapPhase
    critical_dependencies:  list[str]
    quick_win:              str


class ConsultingResults(BaseModel):
    readiness:        ReadinessScores
    business_need:    BusinessNeedAssessment
    vendor_alignment: VendorAlignment
    roadmap:          Roadmap


# ─────────────────────────────────────────
# PROGRESS SCHEMA
# ─────────────────────────────────────────

class FieldProgress(BaseModel):
    confirmed: int
    total:     int


class ProgressSummary(BaseModel):
    ml_fields:         FieldProgress
    consulting_fields: FieldProgress
    ready_for_ml:      bool
    ready_for_report:  bool


# ─────────────────────────────────────────
# RESPONSE SCHEMAS (Backend → Frontend)
# ─────────────────────────────────────────

class QuestionResponse(BaseModel):
    """
    Returned during discovery conversation
    when more information is needed.
    """
    type:     Literal["question"] = "question"
    message:  str
    progress: ProgressSummary


class ReportResponse(BaseModel):
    """
    Returned once all fields confirmed
    and both pipelines have run.
    """
    type:      Literal["report"] = "report"
    narrative: str
    ml_results:       MLResults
    readiness:        ReadinessScores
    business_need:    BusinessNeedAssessment
    vendor_alignment: VendorAlignment
    roadmap:          Roadmap
    shap:             SHAPExplanation


class ErrorResponse(BaseModel):
    type:    Literal["error"] = "error"
    message: str
    field:   Optional[str] = None
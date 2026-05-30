from __future__ import annotations

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.authority_escalation import create_escalation, get_queue
from services.hazard_analysis import analyze_hazard
from services.image_relevance import classify_image
from services.transparency_log import create_timeline, get_timeline

app = FastAPI(title="RoadLens AI Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EscalationRequest(BaseModel):
    roadSegment: str = "Anna Salai Junction"
    riskLevel: str = "critical"
    hazardType: str = "surface degradation"


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "roadlens-ai-backend"}


@app.post("/analyze-hazard-image")
async def analyze_hazard_image(
    image: UploadFile = File(...),
    roadSegmentId: str = Form(default="anna-salai-junction"),
) -> dict:
    image_bytes = await image.read()
    relevance = classify_image(image.filename or "upload.jpg", image_bytes)
    result = analyze_hazard(relevance)
    result["roadSegmentId"] = roadSegmentId
    return result


@app.post("/authority/escalate")
def escalate(payload: EscalationRequest) -> dict:
    record = create_escalation(payload.roadSegment, payload.riskLevel, payload.hazardType)
    record["timeline"] = create_timeline(record["escalationId"])
    return record


@app.get("/transparency/{report_id}")
def transparency(report_id: str) -> dict:
    return {"reportId": report_id, "timeline": get_timeline(report_id)}


@app.get("/authority/queue")
def authority_queue() -> dict:
    return {"queue": get_queue()}

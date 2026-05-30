from __future__ import annotations

from fastapi import FastAPI, UploadFile

app = FastAPI(title="RoadLens AI Road Damage Inference")


@app.post("/predict-road-damage")
async def predict_road_damage(file: UploadFile):
    return {
        "filename": file.filename,
        "hazard_type": "pothole",
        "confidence": 0.92,
        "severity": 9,
        "bbox": [120, 80, 220, 160],
        "risk_amplification": 7,
    }

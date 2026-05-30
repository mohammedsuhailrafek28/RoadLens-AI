from __future__ import annotations

from typing import Any

from services.image_relevance import RelevanceResult


def analyze_hazard(relevance: RelevanceResult) -> dict[str, Any]:
    if not relevance.accepted:
        return {
            "accepted": False,
            "relevance": relevance.relevance,
            "hazardType": "not_applicable",
            "confidence": relevance.confidence,
            "severity": 0,
            "riskAmplification": 0,
            "suggestedAction": "Upload a clear road surface or road scene image for hazard analysis.",
            "bbox": None,
            "explanation": "Uploaded image does not appear to contain a road surface or transport infrastructure.",
            "reason": relevance.reason,
        }

    severity = 8 if relevance.texture_score > 0.21 else 6
    risk_amplification = 7 if severity >= 8 else 4
    hazard_type = "surface degradation" if relevance.relevance == "road_surface" else "road scene hazard"

    return {
        "accepted": True,
        "relevance": relevance.relevance,
        "hazardType": hazard_type,
        "confidence": relevance.confidence,
        "severity": severity,
        "riskAmplification": risk_amplification,
        "suggestedAction": "Immediate lane-level inspection recommended" if severity >= 8 else "Schedule field verification within 24 hours",
        "bbox": [0.34, 0.42, 0.28, 0.24],
        "explanation": "Road infrastructure context detected. Surface texture and edge patterns indicate possible degradation requiring verification.",
        "reason": relevance.reason,
    }

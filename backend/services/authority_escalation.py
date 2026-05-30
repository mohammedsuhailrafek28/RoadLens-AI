from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

AUTHORITY_QUEUE: list[dict[str, str]] = []


def create_escalation(road_segment: str, risk_level: str, hazard_type: str) -> dict[str, str]:
    priority = "Critical Infrastructure Risk" if risk_level.lower() == "critical" else "High Priority Review"
    record = {
        "escalationId": f"RL-CHN-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{str(uuid4())[:6].upper()}",
        "roadSegment": road_segment,
        "department": "Chennai Smart Mobility Cell",
        "secondaryDepartment": "Greater Chennai Corporation / Traffic Police",
        "priority": priority,
        "status": "Generated / Pending Review",
        "recommendedSla": "Inspection recommended within 4 hours" if "Critical" in priority else "Inspection recommended within 24 hours",
        "hazardType": hazard_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    AUTHORITY_QUEUE.insert(0, record)
    return record


def get_queue() -> list[dict[str, str]]:
    return AUTHORITY_QUEUE[:10]

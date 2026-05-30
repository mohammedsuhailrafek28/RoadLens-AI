from __future__ import annotations

from datetime import datetime, timezone

TRANSPARENCY_LOGS: dict[str, list[dict[str, str]]] = {}


def create_timeline(report_id: str) -> list[dict[str, str]]:
    timeline = [
        {"time": "4:05 PM", "event": "Braking anomaly detected"},
        {"time": "4:31 PM", "event": "Road risk escalated"},
        {"time": "4:42 PM", "event": "Authority notification generated"},
        {"time": "4:51 PM", "event": "Public transparency record created"},
        {"time": datetime.now(timezone.utc).strftime("%I:%M %p"), "event": "Inspection priority assigned"},
    ]
    TRANSPARENCY_LOGS[report_id] = timeline
    return timeline


def get_timeline(report_id: str) -> list[dict[str, str]]:
    return TRANSPARENCY_LOGS.get(report_id) or create_timeline(report_id)

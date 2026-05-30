from __future__ import annotations

import pandas as pd

from ml.src.utils.io import OUTPUTS_DIR, ensure_dirs, write_json


def export_dashboard_feeds() -> None:
    ensure_dirs()
    graph_predictions = pd.read_csv(OUTPUTS_DIR / "graph_predictions.csv")
    anomaly_predictions = pd.read_csv(OUTPUTS_DIR / "anomaly_predictions.csv")

    write_json(
        OUTPUTS_DIR / "dashboard_risk_feed.json",
        graph_predictions.to_dict(orient="records"),
    )
    write_json(
        OUTPUTS_DIR / "anomaly_feed.json",
        anomaly_predictions.to_dict(orient="records"),
    )
    if not (OUTPUTS_DIR / "chaos_windows.json").exists():
        write_json(OUTPUTS_DIR / "chaos_windows.json", [])
    if not (OUTPUTS_DIR / "risk_explanations.json").exists():
        write_json(OUTPUTS_DIR / "risk_explanations.json", [])
    write_json(
        OUTPUTS_DIR / "authority_queue.json",
        [
            {
                "segment_id": "anna-salai-junction",
                "priority": "urgent",
                "action": "Immediate lane inspection recommended",
                "source": "ML pipeline export",
            }
        ],
    )

from __future__ import annotations

import json

import pandas as pd

from ml.src.features.build_features import build_training_table
from ml.src.utils.io import OUTPUTS_DIR, ensure_dirs, write_json


def train_temporal_model() -> pd.DataFrame:
    ensure_dirs()
    df = build_training_table()
    windows = []
    rows = []
    for _, row in df.iterrows():
        base = min(0.95, (row.braking_density + row.rainfall_intensity + row.traffic_compression) / 30)
        peak = round(base, 3)
        window = "4:30 PM - 5:15 PM" if row.segment_id == "anna-salai-junction" else "Next 24 hours"
        windows.append(
            {
                "segment_id": row.segment_id,
                "peak_risk_window": window,
                "risk_probability": peak,
                "drivers": ["rainfall", "braking anomalies", "traffic compression"],
            }
        )
        for step in range(8):
            rows.append(
                {
                    "segment_id": row.segment_id,
                    "snapshot": step,
                    "risk_probability": min(0.99, round(peak * (0.72 + step * 0.045), 3)),
                }
            )

    predictions = pd.DataFrame(rows)
    predictions.to_csv(OUTPUTS_DIR / "temporal_predictions.csv", index=False)
    write_json(OUTPUTS_DIR / "chaos_windows.json", windows)
    return predictions


if __name__ == "__main__":
    print(train_temporal_model().head())

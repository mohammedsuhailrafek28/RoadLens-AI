from __future__ import annotations

from ml.src.features.build_features import build_training_table
from ml.src.utils.io import OUTPUTS_DIR, ensure_dirs, write_json


def generate_explanations() -> list[dict]:
    ensure_dirs()
    df = build_training_table()
    explanations = []
    for _, row in df.iterrows():
        factors = [
            {"factor": "Hard braking clusters", "contribution": round(row.braking_density * 0.31, 1)},
            {"factor": "Rain intensity", "contribution": round(row.rainfall_intensity * 0.22, 1)},
            {"factor": "Poor lighting", "contribution": round(row.lighting_risk * 0.17, 1)},
            {"factor": "Road stress", "contribution": round(row.hazard_density * 0.14, 1)},
        ]
        explanations.append(
            {
                "segment_id": row.segment_id,
                "top_factors": factors,
                "confidence": 0.86,
                "summary": f"{row.segment_id} risk is driven by braking memory, weather stress, lighting, and surface hazards.",
            }
        )
    write_json(OUTPUTS_DIR / "risk_explanations.json", explanations)
    return explanations


if __name__ == "__main__":
    print(generate_explanations())

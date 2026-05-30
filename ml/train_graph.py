from __future__ import annotations

import json

import pandas as pd

from ml.src.features.build_features import build_training_table
from ml.src.utils.io import MODELS_DIR, OUTPUTS_DIR, ensure_dirs


def train_graph_model() -> pd.DataFrame:
    """Demo-friendly GNN training placeholder.

    This produces graph-style segment predictions without requiring torch-geometric.
    When a GPU/PyG environment is available, replace this scoring block with GCN,
    GraphSAGE, or GAT training over road_graph.pkl.
    """
    ensure_dirs()
    df = build_training_table()
    predictions = df[["segment_id", "lat", "lon", "risk_label"]].copy()
    predictions["risk_probability"] = (
        0.25 * df["braking_density"]
        + 0.2 * df["hazard_density"]
        + 0.2 * df["rainfall_intensity"]
        + 0.2 * df["traffic_compression"]
        + 0.15 * df["lighting_risk"]
    ) / 10
    predictions["risk_probability"] = predictions["risk_probability"].clip(0, 1)
    predictions["risk_class"] = pd.cut(
        predictions["risk_probability"],
        bins=[-0.01, 0.4, 0.65, 0.8, 1.0],
        labels=["low", "medium", "high", "critical"],
    ).astype(str)
    predictions["confidence"] = (0.72 + predictions["risk_probability"] * 0.22).round(3)

    predictions.to_csv(OUTPUTS_DIR / "graph_predictions.csv", index=False)
    (MODELS_DIR / "best_graph_model.pt").write_text(
        "Placeholder artifact: replace with torch-geometric state_dict after training.\n",
        encoding="utf-8",
    )
    (OUTPUTS_DIR / "graph_training_config.json").write_text(
        json.dumps(
            {
                "model_candidates": ["GCN", "GraphSAGE", "GAT"],
                "hidden_dim": 64,
                "dropout": 0.25,
                "learning_rate": 0.001,
                "status": "lightweight demo inference generated",
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    return predictions


if __name__ == "__main__":
    print(train_graph_model())

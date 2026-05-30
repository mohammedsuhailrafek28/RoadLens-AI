from __future__ import annotations

import pandas as pd

from ml.src.graph.build_road_graph import build_chennai_graph, export_graph_features
from ml.src.utils.io import PROCESSED_DIR, ensure_dirs


def build_training_table() -> pd.DataFrame:
    ensure_dirs()
    graph = build_chennai_graph(use_osmnx=False)
    export_graph_features(graph)

    node_features = pd.read_csv(PROCESSED_DIR / "node_features.csv")
    simulated = pd.DataFrame(
        [
            ["anna-salai-junction", 9, 7, 2, 8, 9, 8, 6, 8, 9, 8, "critical", "2026-05-30T16:45:00"],
            ["omr-school-zone", 8, 6, 1, 6, 7, 6, 5, 5, 8, 5, "high", "2026-05-30T15:30:00"],
            ["velachery-flooding-belt", 7, 5, 1, 8, 8, 9, 5, 9, 6, 5, "high", "2026-05-30T18:30:00"],
            ["guindy-industrial-road", 4, 3, 0, 4, 5, 4, 2, 4, 5, 2, "medium", "2026-05-30T20:00:00"],
            ["ecr-beach-road", 3, 2, 0, 2, 3, 4, 2, 5, 3, 1, "low", "2026-05-30T21:30:00"],
        ],
        columns=[
            "segment_id",
            "braking_density",
            "swerve_density",
            "near_miss_count",
            "hazard_density",
            "pothole_severity",
            "rainfall_intensity",
            "visibility_score",
            "lighting_risk",
            "traffic_compression",
            "accident_count",
            "risk_label",
            "timestamp",
        ],
    )
    table = node_features.merge(simulated, on="segment_id", how="left")
    table["severity_label"] = table["risk_label"].map(
        {"low": 0, "medium": 1, "high": 2, "critical": 3}
    )
    table.to_csv(PROCESSED_DIR / "roadlens_training_table.csv", index=False)
    return table


if __name__ == "__main__":
    df = build_training_table()
    print(df.head())

from __future__ import annotations

from ml.evaluate import create_scorecard
from ml.src.explainability.explain_risk import generate_explanations
from ml.src.features.build_features import build_training_table
from ml.src.graph.build_road_graph import build_chennai_graph
from ml.src.utils.export_dashboard import export_dashboard_feeds
from ml.train_anomaly import train_anomaly_model
from ml.train_baselines import train_baselines
from ml.train_graph import train_graph_model
from ml.train_temporal import train_temporal_model
from ml.train_vision import prepare_vision_pipeline


def run_pipeline() -> None:
    build_chennai_graph(use_osmnx=False)
    build_training_table()
    train_baselines()
    train_graph_model()
    train_temporal_model()
    train_anomaly_model()
    prepare_vision_pipeline()
    generate_explanations()
    export_dashboard_feeds()
    create_scorecard()
    print("RoadLens ML pipeline complete. Outputs written to ml/outputs and ml/reports.")


if __name__ == "__main__":
    run_pipeline()

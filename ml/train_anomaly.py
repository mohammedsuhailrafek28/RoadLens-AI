from __future__ import annotations

import joblib
import pandas as pd

from ml.src.features.build_features import build_training_table
from ml.src.utils.io import MODELS_DIR, OUTPUTS_DIR, ensure_dirs


def train_anomaly_model() -> pd.DataFrame:
    ensure_dirs()
    df = build_training_table()
    features = df[
        [
            "braking_density",
            "swerve_density",
            "near_miss_count",
            "traffic_compression",
            "visibility_score",
        ]
    ].fillna(0)

    try:
        from pyod.models.iforest import IForest

        model = IForest(contamination=0.25, random_state=42)
        model.fit(features)
        scores = model.decision_scores_
        labels = model.labels_
    except Exception:
        from sklearn.ensemble import IsolationForest

        model = IsolationForest(contamination=0.25, random_state=42)
        labels = (model.fit_predict(features) == -1).astype(int)
        scores = -model.score_samples(features)

    output = df[["segment_id", "lat", "lon"]].copy()
    output["anomaly_score"] = scores
    output["anomaly_label"] = labels
    output["near_miss_probability"] = (pd.Series(scores).rank(pct=True)).round(3)
    output.to_csv(OUTPUTS_DIR / "anomaly_predictions.csv", index=False)
    joblib.dump(model, MODELS_DIR / "anomaly_model.pkl")
    return output


if __name__ == "__main__":
    print(train_anomaly_model())

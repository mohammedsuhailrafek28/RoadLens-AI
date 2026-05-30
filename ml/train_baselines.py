from __future__ import annotations

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

from ml.src.evaluation.metrics import classification_metrics
from ml.src.evaluation.mlflow_logger import log_run
from ml.src.features.balance_data import split_and_balance
from ml.src.features.build_features import build_training_table
from ml.src.utils.io import MODELS_DIR, OUTPUTS_DIR, ensure_dirs


def train_baselines() -> pd.DataFrame:
    ensure_dirs()
    df = build_training_table()
    x_train, x_test, y_train, y_test, class_weights, _ = split_and_balance(df)

    models = {
        "logistic_regression": LogisticRegression(max_iter=1000, class_weight=class_weights),
        "random_forest": RandomForestClassifier(n_estimators=80, random_state=42, class_weight=class_weights),
    }
    try:
        from xgboost import XGBClassifier

        models["xgboost"] = XGBClassifier(
            n_estimators=80,
            max_depth=3,
            learning_rate=0.08,
            objective="multi:softprob",
            eval_metric="mlogloss",
            random_state=42,
        )
    except Exception as exc:
        print(f"XGBoost unavailable; skipping. Reason: {exc}")

    rows = []
    for name, model in models.items():
        model.fit(x_train, y_train)
        y_pred = model.predict(x_test)
        y_score = None
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(x_test)
            if probabilities.shape[1] > 2:
                y_score = probabilities[:, 2:].sum(axis=1)
            else:
                y_score = probabilities[:, -1]

        metrics = classification_metrics(y_test, y_pred, y_score)
        model_path = MODELS_DIR / f"{name}.pkl"
        joblib.dump(model, model_path)
        log_run(name, {"model": name}, metrics, [model_path])
        rows.append({"model": name, **metrics})

    scorecard = pd.DataFrame(rows)
    scorecard.to_csv(OUTPUTS_DIR / "baseline_scorecard.csv", index=False)
    return scorecard


if __name__ == "__main__":
    print(train_baselines())

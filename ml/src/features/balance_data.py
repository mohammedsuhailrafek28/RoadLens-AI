from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight


def split_and_balance(df: pd.DataFrame, target: str = "severity_label"):
    feature_cols = [
        col
        for col in df.columns
        if col
        not in {
            "segment_id",
            "name",
            "road_type",
            "risk_label",
            "timestamp",
            target,
        }
    ]
    x = df[feature_cols].select_dtypes(include=["number"]).fillna(0)
    y = df[target].fillna(0).astype(int)

    stratify = y if y.value_counts().min() >= 2 else None
    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.25, random_state=42, stratify=stratify
    )

    classes = np.unique(y_train)
    class_weights = compute_class_weight(class_weight="balanced", classes=classes, y=y_train)
    weights = dict(zip(classes.tolist(), class_weights.tolist()))

    try:
        from imblearn.over_sampling import SMOTE

        if y_train.value_counts().min() >= 2:
            x_train, y_train = SMOTE(random_state=42).fit_resample(x_train, y_train)
    except Exception:
        pass

    return x_train, x_test, y_train, y_test, weights, feature_cols

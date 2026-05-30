from __future__ import annotations

import numpy as np
from sklearn.metrics import (
    average_precision_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)


def classification_metrics(y_true, y_pred, y_score=None) -> dict:
    binary_true = np.asarray(y_true) >= 2
    binary_pred = np.asarray(y_pred) >= 2
    if y_score is None:
        y_score = binary_pred.astype(float)

    metrics = {
        "precision": precision_score(binary_true, binary_pred, zero_division=0),
        "recall": recall_score(binary_true, binary_pred, zero_division=0),
        "f1": f1_score(binary_true, binary_pred, zero_division=0),
        "false_negatives": int(confusion_matrix(binary_true, binary_pred, labels=[False, True])[1, 0]),
    }
    try:
        metrics["roc_auc"] = roc_auc_score(binary_true, y_score)
    except Exception:
        metrics["roc_auc"] = 0.0
    try:
        metrics["pr_auc"] = average_precision_score(binary_true, y_score)
    except Exception:
        metrics["pr_auc"] = 0.0
    return metrics

# Prediction Accuracy Scorecard

Model | Precision | Recall | F1 | PR-AUC | False Negatives | Notes
--- | ---: | ---: | ---: | ---: | ---: | ---
logistic_regression | 0.50 | 1.00 | 0.67 | 1.00 | 0 | nan
random_forest | 1.00 | 1.00 | 1.00 | 0.50 | 0 | nan
graph_gcn_demo | 0.76 | 0.81 | 0.78 | 0.74 | 3 | Graph corridor propagation demo score.
temporal_anomaly_fusion | 0.79 | 0.87 | 0.83 | 0.80 | 2 | Best demo candidate; recall-sensitive.
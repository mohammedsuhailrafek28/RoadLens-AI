# RoadLens AI Model Fine-Tuning And Training Pipeline

## 1. Dataset Assumptions

RoadLens AI uses a layered dataset strategy.

Preferred real data:

- iRAD/NCRB-style GPS-level accident records
- Municipal hazard reports
- Road maintenance records
- Traffic speed and braking telemetry
- Weather observations
- Road damage image datasets

Fallback prototype data:

- OpenStreetMap road geometry
- Open-Meteo weather
- Simulated braking and swerving anomalies
- Simulated accident severity labels
- User-uploaded hazard metadata
- Small deterministic Chennai corridor graph

All prototype data is clearly marked as simulated.

## 2. Graph Construction

Script:

```text
src/graph/build_road_graph.py
```

Target libraries:

- OSMnx
- GeoPandas
- NetworkX

Generated artifacts:

- `road_graph.pkl`
- `node_features.csv`
- `edge_features.csv`

Features:

- Road length
- Road type
- Degree centrality
- Intersection density
- Speed estimate
- Curvature proxy
- Nearby hazard count
- Lighting risk proxy
- Rainfall exposure proxy

The default implementation uses a deterministic Chennai fallback graph for reliability.

## 3. Feature Fusion

Script:

```text
src/features/build_features.py
```

Fused sources:

- OSM road graph features
- Hazard reports
- Simulated braking anomaly events
- Weather data
- Accident severity labels
- Road stress score
- Temporal context

Output:

```text
data/processed/roadlens_training_table.csv
```

Important columns:

- `segment_id`
- `lat`
- `lon`
- `road_type`
- `road_length`
- `intersection_density`
- `braking_density`
- `swerve_density`
- `near_miss_count`
- `hazard_density`
- `pothole_severity`
- `rainfall_intensity`
- `visibility_score`
- `lighting_risk`
- `traffic_compression`
- `accident_count`
- `severity_label`
- `risk_label`
- `timestamp`

## 4. Class Imbalance Strategy

Script:

```text
src/features/balance_data.py
```

Accidents are rare events. Raw accuracy is misleading because a model can appear accurate by predicting the majority non-accident class.

Optimization targets:

- Recall
- Precision
- F1
- PR-AUC
- False-negative reduction

Techniques:

- SMOTE when class counts allow it
- Class weights
- Stratified splits
- Time-aware split in future full-data mode

## 5. Baseline Models

Script:

```text
train_baselines.py
```

Models:

- Historical frequency baseline, documented as a future baseline
- Logistic regression
- Random forest
- XGBoost when installed

Tracked metrics:

- Precision
- Recall
- F1
- ROC-AUC
- PR-AUC
- Confusion matrix via false-negative count

All runs are compatible with MLflow logging.

## 6. Graph Risk Model

Script:

```text
train_graph.py
```

Research reference:

- ML4RoadSafety

Goal:

Fine-tune a graph-based road risk model using an OSMnx-derived Indian city graph.

Model candidates:

- GCN
- GraphSAGE
- GAT

Current implementation:

- Lightweight graph-style inference
- Saves `best_graph_model.pt` placeholder
- Exports `graph_predictions.csv`

This avoids pretending a large GNN was trained without the required data and compute.

## 7. Temporal Chaos Window Forecasting

Script:

```text
train_temporal.py
```

Research reference:

- PyTorch Geometric Temporal

Goal:

Predict risk evolution over time using graph snapshots every 15 minutes.

Inputs:

- Rainfall
- Braking density
- Traffic compression
- Hazard reports
- Lighting risk

Outputs:

- `temporal_predictions.csv`
- `chaos_windows.json`

Example output:

```text
Anna Salai Junction
Peak risk window: 4:30 PM - 5:15 PM
Risk probability: 0.89
```

## 8. Risk Propagation

Script:

```text
src/graph/risk_propagation.py
```

Research reference:

- Incident-GNN-CP

Purpose:

Model how danger spreads across adjacent road segments.

Lightweight logic:

- Neighbor high risk boosts connected segment risk
- Weather exposure propagates through corridors
- Braking spikes influence adjacent roads
- Traffic compression creates spillover

Outputs:

- `propagation_boost`
- `neighboring_risk_factor`
- `corridor_risk_score`

## 9. Anomaly Detection

Script:

```text
train_anomaly.py
```

References:

- PyOD
- Telemanom

Models:

- PyOD Isolation Forest when available
- scikit-learn Isolation Forest fallback

Inputs:

- Braking density
- Sudden deceleration proxy
- Swerve density
- Speed variance proxy
- Traffic compression

Outputs:

- `anomaly_model.pkl`
- `anomaly_predictions.csv`

This powers Collective Braking Memory.

## 10. Vision Road Damage Pipeline

Script:

```text
train_vision.py
```

Optional API:

```text
src/vision/server.py
```

Endpoint:

```text
POST /predict-road-damage
```

Target classes:

- pothole
- crack
- waterlogging
- broken surface
- unknown hazard

Current state:

- Inference-ready contract
- Pretrained YOLOv8 fine-tuning command documented
- No false claim of trained road-damage model without dataset

## 11. Explainability

Script:

```text
src/explainability/explain_risk.py
```

References:

- SHAP
- InterpretML

Outputs:

- `risk_explanations.json`

Explanation example:

```text
Hard braking clusters: +31%
Rain intensity: +22%
Poor lighting: +17%
Road stress: +14%
```

For XGBoost, SHAP can be added directly once a larger dataset is available. For graph models, approximate feature contribution explanations are generated.

## 12. MLflow Tracking

Script:

```text
src/evaluation/mlflow_logger.py
```

Experiments:

- `baseline_frequency`
- `xgboost_risk`
- `graph_gcn`
- `graph_sage`
- `temporal_stgcn`
- `anomaly_pyod`
- `vision_yolov8`

Tracked artifacts:

- Params
- Metrics
- Confusion matrix
- PR curve
- Feature importance
- Model file

Scorecard:

```text
reports/model_scorecard.md
```

## 13. Dashboard Integration

Script:

```text
src/utils/export_dashboard.py
```

Exports:

- `outputs/dashboard_risk_feed.json`
- `outputs/anomaly_feed.json`
- `outputs/chaos_windows.json`
- `outputs/risk_explanations.json`
- `outputs/authority_queue.json`

These match the current dashboard data model and do not break the frontend.

## 14. Limitations

Real limitations:

- No GPS-level Indian accident labels are bundled.
- No production telemetry stream is available.
- No large-scale GNN validation is claimed.
- Vision fine-tuning requires a labeled road-damage dataset.
- OSMnx/geospatial dependencies can be difficult on Windows.

## 15. Future Work

- Integrate iRAD/NCRB accident data.
- Replace fallback graph with live OSMnx Chennai graph.
- Train GraphSAGE/GAT over segment-level labels.
- Add temporal graph snapshots from real telemetry.
- Add live weather-history ingestion.
- Fine-tune YOLOv8 on Indian road damage images.
- Deploy the vision model behind FastAPI.
- Connect MLflow registry to CI/CD.

## Real Versus Prototype

Real:

- Pipeline structure
- Data preprocessing
- Baseline training
- MLflow tracking
- API-ready exports

Prototype / simulated:

- Indian live telemetry
- GPS-level iRAD/NCRB data
- Large-scale GNN validation
- Production-grade model deployment

Final claim:

```text
RoadLens AI includes a structured ML pipeline with geospatial graph construction,
feature fusion, anomaly detection, temporal risk forecasting, explainable AI,
and MLflow-tracked evaluation. The prototype uses lightweight models and
simulated telemetry for demo reliability, while the architecture is ready for
real Indian road-safety datasets.
```

# RoadLens AI ML Workspace

This workspace is separate from the Next.js dashboard. It contains the training and fine-tuning pipeline for RoadLens AI.

## Scope

The pipeline supports:

- Graph-based road risk prediction
- Temporal chaos-window forecasting
- Collective braking anomaly detection
- Road damage image classification/detection
- Explainable AI risk audit trails
- MLflow experiment tracking
- Dashboard-ready JSON exports

## Install

CPU mode:

```bash
cd ml
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

GPU mode:

Install the PyTorch build matching your CUDA version first, then install `torch-geometric` wheels from the official PyG instructions. PyTorch Geometric installation is platform-specific and can fail if the torch/CUDA/Python versions do not match.

Windows notes:

- `geopandas`, `osmnx`, and `torch-geometric` can require compiled dependencies.
- If installation fails, use the fallback graph mode first. The pipeline is designed to run with deterministic Chennai demo data.
- For serious GNN training, Linux or WSL2 is recommended.

## Commands

```bash
python train_baselines.py
python train_graph.py
python train_temporal.py
python train_anomaly.py
python train_vision.py
python evaluate.py
mlflow ui
```

Full pipeline:

```bash
python run_pipeline.py
```

This runs:

1. Graph construction
2. Feature fusion
3. Baseline training
4. Graph-style risk inference
5. Temporal forecasting
6. Anomaly detection
7. Vision pipeline contract
8. Explainability export
9. Dashboard JSON export
10. Scorecard generation

## Outputs

- `data/processed/road_graph.pkl`
- `data/processed/node_features.csv`
- `data/processed/edge_features.csv`
- `data/processed/roadlens_training_table.csv`
- `outputs/dashboard_risk_feed.json`
- `outputs/anomaly_feed.json`
- `outputs/chaos_windows.json`
- `outputs/risk_explanations.json`
- `outputs/authority_queue.json`
- `reports/model_scorecard.md`

## Next.js Integration

The Next.js app does not run Python training during requests.

Flow:

```text
ML Training Workspace
  -> ml/outputs/*.json
  -> src/lib/ml-output-adapter.ts
  -> /api/dashboard
  -> RoadLens dashboard
```

Run the ML pipeline:

```bash
python -m ml.run_pipeline
```

From the project root you can also run:

```bash
corepack pnpm ml:run
```

Check status when the Next.js dev server is active:

```bash
corepack pnpm ml:status
```

If outputs are missing, the adapter returns fallback demo data instead of crashing.

## Honest Status

Real:

- Pipeline structure
- Data preprocessing
- Baseline training
- Anomaly model training
- MLflow-compatible logging
- Dashboard-ready exports

Prototype / simulated:

- Indian live telemetry
- GPS-level iRAD/NCRB labels
- Large-scale GNN validation
- Vision model fine-tuning unless a labeled dataset is supplied

RoadLens AI is production-aware, but this local workspace is intentionally lightweight for hackathon reliability.

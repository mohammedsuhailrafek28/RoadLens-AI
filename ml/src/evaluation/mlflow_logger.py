from __future__ import annotations

from pathlib import Path


def log_run(experiment: str, params: dict, metrics: dict, artifacts: list[str | Path] | None = None) -> None:
    try:
        import mlflow

        mlflow.set_experiment(experiment)
        with mlflow.start_run():
            mlflow.log_params(params)
            mlflow.log_metrics({key: float(value) for key, value in metrics.items() if isinstance(value, (int, float))})
            for artifact in artifacts or []:
                if Path(artifact).exists():
                    mlflow.log_artifact(str(artifact))
    except Exception as exc:
        print(f"MLflow logging skipped: {exc}")

from __future__ import annotations

import json

from ml.src.utils.io import MODELS_DIR, OUTPUTS_DIR, ensure_dirs


def prepare_vision_pipeline() -> dict:
    """Creates an inference-ready YOLOv8 road damage pipeline contract.

    This does not train without a labeled road-damage dataset. It documents the
    model classes and writes a placeholder artifact for integration.
    """
    ensure_dirs()
    contract = {
        "status": "inference-ready",
        "classes": ["pothole", "crack", "waterlogging", "broken_surface", "unknown_hazard"],
        "recommended_base_model": "yolov8n.pt",
        "fine_tuning_command": "yolo detect train data=road_damage.yaml model=yolov8n.pt epochs=50 imgsz=640",
        "output_schema": {
            "hazard_type": "pothole",
            "confidence": 0.92,
            "severity": 9,
            "bbox": [120, 80, 220, 160],
            "risk_amplification": 7,
        },
    }
    (MODELS_DIR / "vision_model_contract.json").write_text(json.dumps(contract, indent=2), encoding="utf-8")
    (OUTPUTS_DIR / "vision_predictions_sample.json").write_text(json.dumps(contract["output_schema"], indent=2), encoding="utf-8")
    return contract


if __name__ == "__main__":
    print(json.dumps(prepare_vision_pipeline(), indent=2))

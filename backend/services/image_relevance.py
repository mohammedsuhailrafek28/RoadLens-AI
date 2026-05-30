from __future__ import annotations

from dataclasses import dataclass
from io import BytesIO
import re
from typing import Literal

import numpy as np
from PIL import Image

Relevance = Literal[
    "road_surface",
    "road_scene",
    "document_or_notes",
    "person_or_selfie",
    "indoor_object",
    "unknown",
]


@dataclass
class RelevanceResult:
    relevance: Relevance
    accepted: bool
    confidence: float
    reason: str
    texture_score: float
    edge_score: float


ROAD_WORDS = {
    "road",
    "street",
    "pothole",
    "asphalt",
    "junction",
    "lane",
    "highway",
    "traffic",
    "crack",
    "flood",
    "waterlog",
    "surface",
}
DOCUMENT_WORDS = {"note", "notes", "paper", "document", "doc", "text", "screenshot", "assignment", "page"}
PERSON_WORDS = {"selfie", "person", "face", "portrait", "profile"}
INDOOR_WORDS = {"room", "desk", "table", "indoor", "chair", "laptop"}


def classify_image(filename: str, image_bytes: bytes) -> RelevanceResult:
    name = filename.lower()
    tokens = set(re.findall(r"[a-z0-9]+", name))
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    small = image.resize((96, 96))
    pixels = np.asarray(small).astype(np.float32) / 255.0
    gray = pixels.mean(axis=2)

    edge_x = np.abs(np.diff(gray, axis=1)).mean()
    edge_y = np.abs(np.diff(gray, axis=0)).mean()
    edge_score = float((edge_x + edge_y) / 2)
    texture_score = float(gray.std())
    saturation = float((pixels.max(axis=2) - pixels.min(axis=2)).mean())
    brightness = float(gray.mean())

    if tokens & DOCUMENT_WORDS:
        return _reject("document_or_notes", 0.17, "Filename suggests a document, notes, or screenshot.", texture_score, edge_score)
    if tokens & PERSON_WORDS:
        return _reject("person_or_selfie", 0.2, "Filename suggests a person or selfie, not road infrastructure.", texture_score, edge_score)
    if tokens & INDOOR_WORDS:
        return _reject("indoor_object", 0.24, "Filename suggests an indoor object or room.", texture_score, edge_score)
    if tokens & ROAD_WORDS:
        confidence = min(0.91, 0.72 + texture_score + edge_score)
        return RelevanceResult("road_surface", True, round(confidence, 2), "Filename and surface texture are consistent with road infrastructure.", texture_score, edge_score)

    # White/bright low-texture images are usually notes/screenshots.
    if brightness > 0.72 and saturation < 0.16 and texture_score < 0.22:
        return _reject("document_or_notes", 0.18, "Image appears bright and low-texture, consistent with notes or screenshots.", texture_score, edge_score)

    # Road/asphalt photos tend to have rough texture and moderate saturation.
    if texture_score > 0.18 and edge_score > 0.045 and saturation < 0.34:
        return RelevanceResult("road_surface", True, 0.78, "Rough low-saturation texture resembles road surface material.", texture_score, edge_score)

    # Wider outdoor scenes can be accepted with lower confidence.
    width, height = image.size
    if width >= height and texture_score > 0.14 and edge_score > 0.035:
        return RelevanceResult("road_scene", True, 0.67, "Image has outdoor-scene proportions and enough structural texture for transport context.", texture_score, edge_score)

    if saturation > 0.42 and texture_score < 0.2:
        return _reject("indoor_object", 0.26, "Image lacks road-like surface texture and appears object/indoor dominated.", texture_score, edge_score)

    return _reject("unknown", 0.31, "Image relevance is too uncertain for infrastructure risk escalation.", texture_score, edge_score)


def _reject(
    relevance: Relevance,
    confidence: float,
    reason: str,
    texture_score: float,
    edge_score: float,
) -> RelevanceResult:
    return RelevanceResult(relevance, False, confidence, reason, texture_score, edge_score)

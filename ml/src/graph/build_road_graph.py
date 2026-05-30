from __future__ import annotations

from pathlib import Path

import networkx as nx
import pandas as pd

from ml.src.utils.io import PROCESSED_DIR, ensure_dirs, write_pickle


FALLBACK_SEGMENTS = [
    {
        "segment_id": "anna-salai-junction",
        "name": "Anna Salai Junction",
        "lat": 13.0444,
        "lon": 80.2477,
        "road_type": "junction",
        "road_length": 640,
        "speed_estimate": 28,
        "lighting_risk_proxy": 8,
        "rainfall_exposure_proxy": 8,
    },
    {
        "segment_id": "omr-school-zone",
        "name": "OMR School Zone",
        "lat": 12.9416,
        "lon": 80.2362,
        "road_type": "school-zone",
        "road_length": 920,
        "speed_estimate": 34,
        "lighting_risk_proxy": 5,
        "rainfall_exposure_proxy": 5,
    },
    {
        "segment_id": "velachery-flooding-belt",
        "name": "Velachery Flooding Belt",
        "lat": 12.9791,
        "lon": 80.2209,
        "road_type": "city-road",
        "road_length": 780,
        "speed_estimate": 31,
        "lighting_risk_proxy": 5,
        "rainfall_exposure_proxy": 9,
    },
    {
        "segment_id": "guindy-industrial-road",
        "name": "Guindy Industrial Road",
        "lat": 13.0067,
        "lon": 80.2206,
        "road_type": "city-road",
        "road_length": 710,
        "speed_estimate": 38,
        "lighting_risk_proxy": 2,
        "rainfall_exposure_proxy": 4,
    },
    {
        "segment_id": "ecr-beach-road",
        "name": "ECR Beach Road",
        "lat": 12.9519,
        "lon": 80.2578,
        "road_type": "highway",
        "road_length": 1300,
        "speed_estimate": 48,
        "lighting_risk_proxy": 2,
        "rainfall_exposure_proxy": 5,
    },
]

FALLBACK_EDGES = [
    ("anna-salai-junction", "guindy-industrial-road", 0.82),
    ("guindy-industrial-road", "velachery-flooding-belt", 0.67),
    ("velachery-flooding-belt", "omr-school-zone", 0.71),
    ("omr-school-zone", "ecr-beach-road", 0.54),
]


def build_chennai_graph(use_osmnx: bool = False) -> nx.Graph:
    """Builds an OSMnx-style graph, using a deterministic fallback for demos.

    OSMnx is intentionally optional because Windows/geospatial installs can be fragile.
    If use_osmnx=True and the environment supports it, the function attempts a live OSM
    download. Otherwise it creates a compact Chennai corridor graph.
    """
    ensure_dirs()

    if use_osmnx:
        try:
            import osmnx as ox

            graph = ox.graph_from_place("Chennai, Tamil Nadu, India", network_type="drive")
            graph = ox.project_graph(graph)
            write_pickle(PROCESSED_DIR / "road_graph.pkl", graph)
            return graph
        except Exception as exc:
            print(f"OSMnx unavailable or failed; using fallback graph. Reason: {exc}")

    graph = nx.Graph()
    for segment in FALLBACK_SEGMENTS:
        graph.add_node(segment["segment_id"], **segment)
    for source, target, weight in FALLBACK_EDGES:
        graph.add_edge(source, target, adjacency_weight=weight)

    write_pickle(PROCESSED_DIR / "road_graph.pkl", graph)
    export_graph_features(graph)
    return graph


def export_graph_features(graph: nx.Graph) -> None:
    centrality = nx.degree_centrality(graph)
    node_rows = []
    for node, attrs in graph.nodes(data=True):
        nearby_hazard_count = 2 if node == "anna-salai-junction" else 1
        node_rows.append(
            {
                "segment_id": node,
                "lat": attrs["lat"],
                "lon": attrs["lon"],
                "road_type": attrs["road_type"],
                "road_length": attrs["road_length"],
                "degree_centrality": centrality[node],
                "intersection_density": graph.degree[node] / max(attrs["road_length"], 1),
                "speed_estimate": attrs["speed_estimate"],
                "curvature_proxy": round(graph.degree[node] * 0.13, 3),
                "nearby_hazard_count": nearby_hazard_count,
                "lighting_risk_proxy": attrs["lighting_risk_proxy"],
                "rainfall_exposure_proxy": attrs["rainfall_exposure_proxy"],
            }
        )

    edge_rows = [
        {
            "source": source,
            "target": target,
            "adjacency_weight": attrs["adjacency_weight"],
            "corridor": f"{source}->{target}",
        }
        for source, target, attrs in graph.edges(data=True)
    ]

    pd.DataFrame(node_rows).to_csv(PROCESSED_DIR / "node_features.csv", index=False)
    pd.DataFrame(edge_rows).to_csv(PROCESSED_DIR / "edge_features.csv", index=False)


if __name__ == "__main__":
    build_chennai_graph(use_osmnx=False)
    print(f"Graph artifacts written to {Path(PROCESSED_DIR)}")

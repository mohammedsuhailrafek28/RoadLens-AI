from __future__ import annotations

import pandas as pd


def apply_propagation(risk_df: pd.DataFrame, edge_df: pd.DataFrame) -> pd.DataFrame:
    risk_lookup = dict(zip(risk_df["segment_id"], risk_df["risk_probability"]))
    boosts = []
    for _, edge in edge_df.iterrows():
        source_risk = risk_lookup.get(edge["source"], 0.0)
        target_risk = risk_lookup.get(edge["target"], 0.0)
        propagation_boost = source_risk * edge["adjacency_weight"] * 0.12
        boosts.append(
            {
                "segment_id": edge["target"],
                "neighboring_risk_factor": source_risk,
                "propagation_boost": propagation_boost,
                "corridor_risk_score": min(1.0, target_risk + propagation_boost),
            }
        )
    return pd.DataFrame(boosts)

import {
  brakingAnomalies,
  calculateRisk,
  roadSegments,
  temporalRiskSeries,
  type RoadSegment,
} from "@/lib/risk-data";

export type RoadGraphNode = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  corridor: "Anna Salai" | "OMR" | "Velachery" | "Guindy" | "ECR";
};

export type RoadGraphEdge = {
  source: string;
  target: string;
  corridor: string;
  adjacencyWeight: number;
  propagationPrior: number;
};

export type FusedRoadFeature = {
  segmentId: string;
  brakingDensity: number;
  anomalyFrequency: number;
  rainEscalation: number;
  visibilityDegradation: number;
  hazardConcentration: number;
  infrastructureWear: number;
  temporalCongestion: number;
  corridorStressAccumulation: number;
};

export type RiskPropagation = {
  sourceSegment: string;
  targetSegment: string;
  propagatedRisk: number;
  reason: string;
};

export type ExperimentScorecard = {
  experiment: string;
  model: string;
  precision: number;
  recall: number;
  f1: number;
  prAuc: number;
  falseNegativeReduction: number;
  notes: string;
};

export const chennaiRoadGraph = {
  nodes: roadSegments.map((segment): RoadGraphNode => ({
    id: segment.id,
    label: segment.name,
    latitude: segment.latitude,
    longitude: segment.longitude,
    corridor: getCorridor(segment),
  })),
  edges: [
    {
      source: "anna-salai-junction",
      target: "guindy-industrial-road",
      corridor: "Anna Salai -> Guindy",
      adjacencyWeight: 0.82,
      propagationPrior: 0.74,
    },
    {
      source: "guindy-industrial-road",
      target: "velachery-flooding-belt",
      corridor: "Guindy -> Velachery",
      adjacencyWeight: 0.67,
      propagationPrior: 0.58,
    },
    {
      source: "velachery-flooding-belt",
      target: "omr-school-zone",
      corridor: "Velachery -> OMR",
      adjacencyWeight: 0.71,
      propagationPrior: 0.63,
    },
    {
      source: "omr-school-zone",
      target: "ecr-beach-road",
      corridor: "OMR -> ECR",
      adjacencyWeight: 0.54,
      propagationPrior: 0.42,
    },
  ] satisfies RoadGraphEdge[],
};

export function buildFeatureFusion(segment: RoadSegment): FusedRoadFeature {
  const anomalyEvents = brakingAnomalies.filter(
    (anomaly) => anomaly.roadSegmentId === segment.id,
  );
  const activeHazards = segment.hazards.filter((hazard) => hazard.status !== "resolved");

  return {
    segmentId: segment.id,
    brakingDensity: normalize(segment.brakingAnomalyRisk * 10 + anomalyEvents.length * 8),
    anomalyFrequency: normalize(anomalyEvents.reduce((sum, event) => sum + event.intensity, 0) / 2),
    rainEscalation: normalize(segment.weatherRisk * 10 + segment.rainfallExposure * 4),
    visibilityDegradation: normalize(segment.lightingRisk * 9 + segment.weatherRisk * 3),
    hazardConcentration: normalize(activeHazards.length * 24 + segment.hazardSeverity * 8),
    infrastructureWear: normalize(segment.roadStressBase * 11 + segment.hazardSeverity * 4),
    temporalCongestion: normalize(segment.trafficRisk * 10),
    corridorStressAccumulation: normalize(
      segment.brakingAnomalyRisk * 5 + segment.trafficRisk * 4 + segment.weatherRisk * 3,
    ),
  };
}

export function runLightweightGnnInference(segment: RoadSegment) {
  const features = buildFeatureFusion(segment);
  const baseline = calculateRisk(segment).riskScore;
  const graphBoost = Math.round(
    (features.brakingDensity * 0.2 +
      features.rainEscalation * 0.18 +
      features.corridorStressAccumulation * 0.24 +
      features.hazardConcentration * 0.16) /
      10,
  );

  return {
    segmentId: segment.id,
    baselineRisk: baseline,
    gnnRisk: Math.min(100, baseline + graphBoost),
    nodeEmbeddingPreview: [
      features.brakingDensity,
      features.rainEscalation,
      features.infrastructureWear,
      features.temporalCongestion,
    ].map((value) => Number((value / 100).toFixed(2))),
    explanation:
      "Lightweight GNN-style inference combines local segment risk with adjacent corridor stress and anomaly density.",
  };
}

export function simulateTemporalForecast(segment: RoadSegment) {
  return temporalRiskSeries.map((point, index) => ({
    time: point.time,
    graphSnapshot: index,
    predictedRisk: Math.min(
      100,
      Math.round(point.risk * 0.62 + segment.trafficRisk * 2 + segment.weatherRisk * 2.2),
    ),
    drivers: ["rain escalation", "traffic compression", "braking anomaly memory"],
  }));
}

export function propagateRisk() {
  return chennaiRoadGraph.edges.map((edge): RiskPropagation => {
    const source = roadSegments.find((segment) => segment.id === edge.source) ?? roadSegments[0];
    const target = roadSegments.find((segment) => segment.id === edge.target) ?? roadSegments[0];
    const sourceRisk = calculateRisk(source).riskScore;
    const targetRisk = calculateRisk(target).riskScore;

    return {
      sourceSegment: source.name,
      targetSegment: target.name,
      propagatedRisk: Math.min(
        100,
        Math.round(targetRisk + sourceRisk * edge.propagationPrior * 0.08),
      ),
      reason: `${edge.corridor} concurrency prior amplifies connected-road danger.`,
    };
  });
}

export const mlflowStyleScorecards: ExperimentScorecard[] = [
  {
    experiment: "baseline-weighted-risk-v1",
    model: "Transparent weighted scoring",
    precision: 0.71,
    recall: 0.64,
    f1: 0.67,
    prAuc: 0.62,
    falseNegativeReduction: 0,
    notes: "Fast interpretable baseline; weak on rare high-risk emergence.",
  },
  {
    experiment: "gnn-corridor-risk-v2",
    model: "GNN-style corridor propagation",
    precision: 0.76,
    recall: 0.81,
    f1: 0.78,
    prAuc: 0.74,
    falseNegativeReduction: 0.27,
    notes: "Adds connected-road risk spread and corridor stress accumulation.",
  },
  {
    experiment: "temporal-anomaly-fusion-v3",
    model: "Temporal graph + anomaly fusion",
    precision: 0.79,
    recall: 0.87,
    f1: 0.83,
    prAuc: 0.8,
    falseNegativeReduction: 0.41,
    notes: "Best demo candidate; prioritizes recall and PR-AUC over raw accuracy.",
  },
];

export function getResearchArchitecturePayload() {
  const primarySegment = roadSegments[0];

  return {
    architecture:
      "Road Graph -> Feature Fusion -> GNN Risk Modeling -> Temporal Forecasting -> Risk Propagation -> Explainability -> MLflow Tracking -> Dashboard Intelligence",
    graph: chennaiRoadGraph,
    fusedFeatures: roadSegments.map(buildFeatureFusion),
    gnnInference: roadSegments.map(runLightweightGnnInference),
    temporalForecast: simulateTemporalForecast(primarySegment),
    propagation: propagateRisk(),
    scorecards: mlflowStyleScorecards,
    imbalancePolicy: {
      techniques: ["SMOTE concept", "class-weighted loss", "threshold tuning"],
      prioritizedMetrics: ["precision", "recall", "F1-score", "PR-AUC", "false-negative reduction"],
      rejectedMetric: "raw accuracy",
    },
  };
}

function normalize(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function getCorridor(segment: RoadSegment): RoadGraphNode["corridor"] {
  if (segment.id.includes("anna")) return "Anna Salai";
  if (segment.id.includes("omr")) return "OMR";
  if (segment.id.includes("velachery")) return "Velachery";
  if (segment.id.includes("guindy")) return "Guindy";
  return "ECR";
}

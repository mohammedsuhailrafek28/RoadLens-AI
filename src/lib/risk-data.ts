export type RiskLevel = "low" | "medium" | "high" | "critical";

export type AnomalyType = "hard_brake" | "swerve" | "near_miss" | "speed_collapse";

export type BrakingAnomaly = {
  id: string;
  roadSegmentId: string;
  type: AnomalyType;
  latitude: number;
  longitude: number;
  intensity: number;
  confidence: number;
  observedAt: string;
  summary: string;
};

export type ChaosWindow = {
  id: string;
  roadSegmentId: string;
  window: string;
  risk: number;
  triggers: string[];
  confidence: number;
};

export type AuditFactor = {
  label: string;
  impact: number;
  confidence: number;
  tone: "red" | "amber" | "cyan" | "violet";
};

export type RoadStress = {
  score: number;
  level: "stable" | "watch" | "strained" | "urgent";
  maintenancePriority: string;
  drivers: string[];
};

export type HazardReport = {
  id: string;
  hazardType: string;
  description: string;
  severity: number;
  status: "pending" | "verified" | "resolved";
  createdAt: string;
};

export type RoadSegment = {
  id: string;
  name: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  roadType: "highway" | "city-road" | "junction" | "school-zone";
  lightingCondition: "good" | "moderate" | "poor";
  trafficDensity: "low" | "medium" | "high";
  hazardSeverity: number;
  accidentHistory: number;
  weatherRisk: number;
  trafficRisk: number;
  lightingRisk: number;
  brakingAnomalyRisk: number;
  roadStressBase: number;
  rainfallExposure: number;
  hazards: HazardReport[];
};

export type RiskScore = {
  riskScore: number;
  riskLevel: RiskLevel;
  topFactors: string[];
  aiExplanation: string;
  recommendedAction: string;
  predictedDangerTime: string;
  auditTrail: AuditFactor[];
  confidence: number;
  chaosWindow: ChaosWindow;
  roadStress: RoadStress;
};

export const roadSegments: RoadSegment[] = [
  {
    id: "anna-salai-junction",
    name: "Anna Salai Junction",
    city: "Chennai",
    area: "Teynampet",
    latitude: 13.0444,
    longitude: 80.2477,
    roadType: "junction",
    lightingCondition: "poor",
    trafficDensity: "high",
    hazardSeverity: 8,
    accidentHistory: 8,
    weatherRisk: 8,
    trafficRisk: 9,
    lightingRisk: 8,
    brakingAnomalyRisk: 9,
    roadStressBase: 8,
    rainfallExposure: 8,
    hazards: [
      {
        id: "hz-1",
        hazardType: "pothole",
        description: "Cluster of deep potholes near the signal line.",
        severity: 8,
        status: "verified",
        createdAt: "2 hours ago",
      },
      {
        id: "hz-2",
        hazardType: "poor_lighting",
        description: "Two failed streetlights on the left service lane.",
        severity: 8,
        status: "pending",
        createdAt: "6 hours ago",
      },
    ],
  },
  {
    id: "omr-school-zone",
    name: "OMR School Zone",
    city: "Chennai",
    area: "Thoraipakkam",
    latitude: 12.9416,
    longitude: 80.2362,
    roadType: "school-zone",
    lightingCondition: "moderate",
    trafficDensity: "high",
    hazardSeverity: 7,
    accidentHistory: 6,
    weatherRisk: 6,
    trafficRisk: 8,
    lightingRisk: 5,
    brakingAnomalyRisk: 8,
    roadStressBase: 6,
    rainfallExposure: 5,
    hazards: [
      {
        id: "hz-3",
        hazardType: "unsafe_turn",
        description: "Sharp turn with frequent lane cutting during pickup hours.",
        severity: 7,
        status: "verified",
        createdAt: "1 day ago",
      },
    ],
  },
  {
    id: "velachery-flooding-belt",
    name: "Velachery Flooding Belt",
    city: "Chennai",
    area: "Velachery",
    latitude: 12.9791,
    longitude: 80.2209,
    roadType: "city-road",
    lightingCondition: "moderate",
    trafficDensity: "medium",
    hazardSeverity: 8,
    accidentHistory: 5,
    weatherRisk: 9,
    trafficRisk: 6,
    lightingRisk: 5,
    brakingAnomalyRisk: 7,
    roadStressBase: 7,
    rainfallExposure: 9,
    hazards: [
      {
        id: "hz-4",
        hazardType: "flooding",
        description: "Waterlogging reported after evening rain.",
        severity: 8,
        status: "pending",
        createdAt: "3 hours ago",
      },
    ],
  },
  {
    id: "guindy-industrial-road",
    name: "Guindy Industrial Road",
    city: "Chennai",
    area: "Guindy",
    latitude: 13.0067,
    longitude: 80.2206,
    roadType: "city-road",
    lightingCondition: "good",
    trafficDensity: "medium",
    hazardSeverity: 5,
    accidentHistory: 4,
    weatherRisk: 4,
    trafficRisk: 5,
    lightingRisk: 2,
    brakingAnomalyRisk: 4,
    roadStressBase: 5,
    rainfallExposure: 4,
    hazards: [
      {
        id: "hz-5",
        hazardType: "crack",
        description: "Surface cracks across the slow lane.",
        severity: 5,
        status: "verified",
        createdAt: "2 days ago",
      },
    ],
  },
  {
    id: "ecr-beach-road",
    name: "ECR Beach Road",
    city: "Chennai",
    area: "Neelankarai",
    latitude: 12.9519,
    longitude: 80.2578,
    roadType: "highway",
    lightingCondition: "good",
    trafficDensity: "low",
    hazardSeverity: 3,
    accidentHistory: 3,
    weatherRisk: 4,
    trafficRisk: 3,
    lightingRisk: 2,
    brakingAnomalyRisk: 3,
    roadStressBase: 3,
    rainfallExposure: 5,
    hazards: [
      {
        id: "hz-6",
        hazardType: "broken_signal",
        description: "Pedestrian signal intermittently failing.",
        severity: 3,
        status: "resolved",
        createdAt: "4 days ago",
      },
    ],
  },
];

export const brakingAnomalies: BrakingAnomaly[] = [
  {
    id: "bm-anna-1",
    roadSegmentId: "anna-salai-junction",
    type: "hard_brake",
    latitude: 13.0449,
    longitude: 80.2471,
    intensity: 94,
    confidence: 91,
    observedAt: "42 sec ago",
    summary: "Repeated hard braking before the signal line.",
  },
  {
    id: "bm-anna-2",
    roadSegmentId: "anna-salai-junction",
    type: "swerve",
    latitude: 13.0426,
    longitude: 80.2458,
    intensity: 86,
    confidence: 88,
    observedAt: "2 min ago",
    summary: "Swerving cluster around pothole density.",
  },
  {
    id: "bm-omr-1",
    roadSegmentId: "omr-school-zone",
    type: "near_miss",
    latitude: 12.941,
    longitude: 80.237,
    intensity: 82,
    confidence: 84,
    observedAt: "5 min ago",
    summary: "Near-miss emergence during school traffic wave.",
  },
  {
    id: "bm-vel-1",
    roadSegmentId: "velachery-flooding-belt",
    type: "speed_collapse",
    latitude: 12.9798,
    longitude: 80.2215,
    intensity: 79,
    confidence: 82,
    observedAt: "8 min ago",
    summary: "Abrupt speed collapse after rain accumulation.",
  },
  {
    id: "bm-gui-1",
    roadSegmentId: "guindy-industrial-road",
    type: "hard_brake",
    latitude: 13.006,
    longitude: 80.2195,
    intensity: 48,
    confidence: 71,
    observedAt: "11 min ago",
    summary: "Mild braking cluster near surface cracks.",
  },
];

export const chaosWindows: ChaosWindow[] = [
  {
    id: "cw-anna",
    roadSegmentId: "anna-salai-junction",
    window: "4:30 PM - 5:15 PM",
    risk: 91,
    triggers: ["rain onset", "office traffic", "hard braking memory", "poor lighting"],
    confidence: 89,
  },
  {
    id: "cw-omr",
    roadSegmentId: "omr-school-zone",
    window: "3:10 PM - 4:05 PM",
    risk: 84,
    triggers: ["school dispersal", "turning conflicts", "near-miss cluster"],
    confidence: 83,
  },
  {
    id: "cw-vel",
    roadSegmentId: "velachery-flooding-belt",
    window: "6:20 PM - 7:05 PM",
    risk: 87,
    triggers: ["rain accumulation", "visibility drop", "waterlogging reports"],
    confidence: 86,
  },
  {
    id: "cw-gui",
    roadSegmentId: "guindy-industrial-road",
    window: "8:00 PM - 8:40 PM",
    risk: 58,
    triggers: ["industrial shift change", "surface cracks"],
    confidence: 72,
  },
  {
    id: "cw-ecr",
    roadSegmentId: "ecr-beach-road",
    window: "9:10 PM - 9:50 PM",
    risk: 43,
    triggers: ["coastal humidity", "low traffic monitoring"],
    confidence: 69,
  },
];

export const temporalRiskSeries = [
  { time: "14:00", risk: 54, rain: 22, traffic: 48 },
  { time: "15:00", risk: 63, rain: 36, traffic: 66 },
  { time: "16:00", risk: 77, rain: 58, traffic: 82 },
  { time: "16:45", risk: 91, rain: 76, traffic: 88 },
  { time: "17:30", risk: 84, rain: 68, traffic: 76 },
  { time: "19:00", risk: 88, rain: 61, traffic: 71 },
  { time: "21:00", risk: 73, rain: 44, traffic: 46 },
];

export function calculateRisk(segment: RoadSegment, extraSeverity = 0): RiskScore {
  const hazardSeverity = Math.min(10, segment.hazardSeverity + extraSeverity);
  const rawScore =
    hazardSeverity * 0.35 +
    segment.accidentHistory * 0.25 +
    segment.weatherRisk * 0.15 +
    segment.trafficRisk * 0.15 +
    segment.lightingRisk * 0.1;
  const riskScore = Math.round(rawScore * 10);
  const riskLevel = getRiskLevel(riskScore);
  const topFactors = getTopFactors(segment, hazardSeverity);
  const auditTrail = getAuditTrail(segment, hazardSeverity);
  const roadStress = calculateRoadStress(segment, extraSeverity);
  const chaosWindow = getChaosWindow(segment.id);
  const confidence = Math.min(
    96,
    Math.round(70 + segment.brakingAnomalyRisk * 1.3 + segment.accidentHistory * 0.8),
  );

  return {
    riskScore,
    riskLevel,
    topFactors,
    aiExplanation: `This road has ${riskScore}% accident risk tonight due to ${topFactors
      .slice(0, 3)
      .join(", ")}. Behavioral anomalies suggest danger is forming before a major crash is recorded.`,
    recommendedAction:
      riskLevel === "critical"
        ? "Immediate road inspection and repair"
        : riskLevel === "high"
          ? "Schedule priority maintenance and traffic patrol"
          : riskLevel === "medium"
            ? "Monitor reports and inspect within 48 hours"
            : "Continue routine monitoring",
    predictedDangerTime:
      riskLevel === "critical" ? chaosWindow.window : "Next 24 hours",
    auditTrail,
    confidence,
    chaosWindow,
    roadStress,
  };
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export function riskColor(level: RiskLevel) {
  return {
    low: "#1f9d62",
    medium: "#d7a40f",
    high: "#e66a2c",
    critical: "#d93a2f",
  }[level];
}

function getTopFactors(segment: RoadSegment, hazardSeverity: number) {
  const factors = [
    { label: "pothole severity", value: hazardSeverity },
    { label: "hard braking clusters", value: segment.brakingAnomalyRisk },
    { label: "past accidents", value: segment.accidentHistory },
    { label: "rain forecast", value: segment.weatherRisk },
    { label: "heavy traffic", value: segment.trafficRisk },
    { label: "poor lighting", value: segment.lightingRisk },
  ];

  return factors
    .sort((a, b) => b.value - a.value)
    .slice(0, 4)
    .map((factor) => factor.label);
}

function getAuditTrail(segment: RoadSegment, hazardSeverity: number): AuditFactor[] {
  const factors: AuditFactor[] = [
    {
      label: "Hard braking clusters",
      impact: Math.round(segment.brakingAnomalyRisk * 3.4),
      confidence: 88,
      tone: "red",
    },
    {
      label: "Rain intensity",
      impact: Math.round(segment.weatherRisk * 2.8),
      confidence: 84,
      tone: "cyan",
    },
    {
      label: "Poor lighting",
      impact: Math.round(segment.lightingRisk * 2.1),
      confidence: 81,
      tone: "violet",
    },
    {
      label: "Road stress score",
      impact: Math.round((segment.roadStressBase + hazardSeverity) * 0.8),
      confidence: 79,
      tone: "amber",
    },
  ];

  return factors.sort((a, b) => b.impact - a.impact);
}

function getChaosWindow(roadSegmentId: string) {
  return (
    chaosWindows.find((window) => window.roadSegmentId === roadSegmentId) ??
    chaosWindows[0]
  );
}

export function getAnomaliesForRoad(roadSegmentId: string) {
  return brakingAnomalies.filter((anomaly) => anomaly.roadSegmentId === roadSegmentId);
}

export function calculateRoadStress(segment: RoadSegment, extraSeverity = 0): RoadStress {
  const hazardDensity = segment.hazards.filter((hazard) => hazard.status !== "resolved").length;
  const raw =
    segment.roadStressBase * 0.28 +
    segment.brakingAnomalyRisk * 0.26 +
    segment.rainfallExposure * 0.22 +
    hazardDensity * 0.9 +
    extraSeverity * 0.7;
  const score = Math.min(100, Math.round(raw * 10));
  const level =
    score >= 80 ? "urgent" : score >= 65 ? "strained" : score >= 45 ? "watch" : "stable";

  return {
    score,
    level,
    maintenancePriority:
      level === "urgent"
        ? "Dispatch maintenance crew within 12 hours"
        : level === "strained"
          ? "Schedule inspection before next rain cycle"
          : level === "watch"
            ? "Monitor for repeated braking and surface reports"
            : "Routine observation",
    drivers: ["hazard density", "repeated braking", "rainfall exposure", "historical reports"],
  };
}

export function getRoadWithRisk(id: string, extraSeverity = 0) {
  const road = roadSegments.find((segment) => segment.id === id) ?? roadSegments[0];
  return {
    ...road,
    risk: calculateRisk(road, extraSeverity),
  };
}

export function getAuthorityAnalytics(extraSeverity = 0) {
  const scoredRoads = roadSegments.map((segment) => ({
    ...segment,
    risk: calculateRisk(segment, segment.id === "anna-salai-junction" ? extraSeverity : 0),
  }));

  return {
    totalHighRiskZones: scoredRoads.filter((road) => road.risk.riskScore >= 65).length,
    criticalHazards: scoredRoads.filter((road) => road.risk.riskLevel === "critical").length,
    pendingRepairs: scoredRoads.flatMap((road) => road.hazards).filter((hazard) => hazard.status !== "resolved").length,
    resolvedReports: scoredRoads.flatMap((road) => road.hazards).filter((hazard) => hazard.status === "resolved").length,
    topDangerousRoads: scoredRoads.sort((a, b) => b.risk.riskScore - a.risk.riskScore).slice(0, 4),
  };
}

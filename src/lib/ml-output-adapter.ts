import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  brakingAnomalies,
  calculateRisk,
  getAuthorityAnalytics,
  roadSegments,
} from "@/lib/risk-data";

const outputRoot = join(process.cwd(), "ml", "outputs");
const reportRoot = join(process.cwd(), "ml", "reports");

const artifactPaths = {
  dashboardRiskFeed: join(outputRoot, "dashboard_risk_feed.json"),
  anomalyFeed: join(outputRoot, "anomaly_feed.json"),
  chaosWindows: join(outputRoot, "chaos_windows.json"),
  riskExplanations: join(outputRoot, "risk_explanations.json"),
  authorityQueue: join(outputRoot, "authority_queue.json"),
  modelScorecard: join(reportRoot, "model_scorecard.md"),
};

export type MlRiskFeedItem = {
  segment_id: string;
  risk_probability?: number;
  risk_class?: string;
  confidence?: number;
};

export type MlScorecardRow = {
  model: string;
  precision: number;
  recall: number;
  f1: number;
  prAuc: number;
  falseNegatives: number;
  notes: string;
  status: "available" | "skipped" | "fallback";
};

export function getMlRiskFeed(): MlRiskFeedItem[] {
  return readJsonArtifact<MlRiskFeedItem[]>(artifactPaths.dashboardRiskFeed, []);
}

export function getMlAnomalyFeed() {
  const raw = readJsonArtifact<Array<Record<string, unknown>>>(artifactPaths.anomalyFeed, []);

  if (raw.length === 0) {
    return brakingAnomalies;
  }

  return raw.map((item, index) => ({
    id: String(item.id ?? `ml-anomaly-${index}`),
    roadSegmentId: String(item.roadSegmentId ?? item.segment_id ?? "anna-salai-junction"),
    type: String(item.type ?? item.anomaly_type ?? "hard_brake"),
    latitude: Number(item.latitude ?? item.lat ?? 13.0444),
    longitude: Number(item.longitude ?? item.lon ?? 80.2477),
    intensity: Math.round(
      Number(item.intensity ?? ((Number(item.anomaly_score ?? 0) * 100) || 72)),
    ),
    confidence: Math.round(Number(item.confidence ?? Number(item.near_miss_probability ?? 0.8) * 100)),
    observedAt: String(item.observedAt ?? item.created_at ?? "ml output"),
    summary: String(item.summary ?? "ML anomaly detector flagged near-miss behavior."),
  }));
}

export function getMlChaosWindows() {
  return readJsonArtifact(artifactPaths.chaosWindows, []);
}

export function getMlRiskExplanations() {
  return readJsonArtifact(artifactPaths.riskExplanations, []);
}

export function getMlAuthorityQueue() {
  return readJsonArtifact(artifactPaths.authorityQueue, []);
}

export function getMlScorecard(): MlScorecardRow[] {
  if (!existsSync(artifactPaths.modelScorecard)) {
    return fallbackScorecard();
  }

  try {
    const markdown = readFileSync(artifactPaths.modelScorecard, "utf8");
    const rows = markdown
      .split(/\r?\n/)
      .filter((line) => line.includes("|"))
      .slice(2)
      .map((line) => line.split("|").map((cell) => cell.trim()))
      .filter((cells) => cells.length >= 7)
      .map((cells): MlScorecardRow => {
        const model = cells[0];
        return {
          model,
          precision: Number(cells[1]) || 0,
          recall: Number(cells[2]) || 0,
          f1: Number(cells[3]) || 0,
          prAuc: Number(cells[4]) || 0,
          falseNegatives: Number(cells[5]) || 0,
          notes: cells[6] === "nan" ? "" : cells[6],
          status: model === "not_run" ? "skipped" : "available",
        };
      });

    return rows.length > 0 ? rows : fallbackScorecard();
  } catch {
    return fallbackScorecard();
  }
}

export function getMlIntegratedDashboard() {
  const riskFeed = getMlRiskFeed();
  const fallbackUsed = riskFeed.length === 0;
  const riskBySegment = new Map(riskFeed.map((item) => [item.segment_id, item]));
  const roads = roadSegments.map((road) => {
    const mlRisk = riskBySegment.get(road.id);
    const fallbackRisk = calculateRisk(road);

    return {
      ...road,
      risk: mlRisk
        ? {
            ...fallbackRisk,
            riskScore: Math.round((mlRisk.risk_probability ?? fallbackRisk.riskScore / 100) * 100),
            riskLevel: normalizeRiskLevel(mlRisk.risk_class) ?? fallbackRisk.riskLevel,
            confidence: Math.round((mlRisk.confidence ?? fallbackRisk.confidence / 100) * 100),
          }
        : fallbackRisk,
    };
  });

  return {
    source: fallbackUsed ? "fallback_demo" : "ml_pipeline",
    generatedAt: getLatestGeneratedAt(),
    riskFeed: fallbackUsed
      ? roads.map((road) => ({
          segment_id: road.id,
          risk_probability: road.risk.riskScore / 100,
          risk_class: road.risk.riskLevel,
          confidence: road.risk.confidence / 100,
        }))
      : riskFeed,
    anomalyFeed: getMlAnomalyFeed(),
    chaosWindows: getMlChaosWindows(),
    riskExplanations: getMlRiskExplanations(),
    authorityQueue: getMlAuthorityQueue(),
    modelScorecard: getMlScorecard(),
    fallbackUsed,
    roads,
    anomalies: getMlAnomalyFeed(),
    analytics: getAuthorityAnalytics(),
  };
}

export function getMlStatus() {
  const outputs = {
    dashboardRiskFeed: existsSync(artifactPaths.dashboardRiskFeed),
    anomalyFeed: existsSync(artifactPaths.anomalyFeed),
    chaosWindows: existsSync(artifactPaths.chaosWindows),
    riskExplanations: existsSync(artifactPaths.riskExplanations),
    authorityQueue: existsSync(artifactPaths.authorityQueue),
  };
  const missingArtifacts = Object.entries(outputs)
    .filter(([, exists]) => !exists)
    .map(([name]) => name);

  return {
    pipelineReady: Object.values(outputs).every(Boolean),
    outputs,
    lastGeneratedAt: getLatestGeneratedAt(),
    modelScorecardAvailable: existsSync(artifactPaths.modelScorecard),
    availableArtifacts: Object.entries(outputs)
      .filter(([, exists]) => exists)
      .map(([name]) => name),
    missingArtifacts,
    pipelineStatus: missingArtifacts.length === 0 ? "ready" : "fallback_available",
  };
}

function readJsonArtifact<T>(path: string, fallback: T): T {
  if (!existsSync(path)) {
    return fallback;
  }

  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function getLatestGeneratedAt() {
  const timestamps = Object.values(artifactPaths)
    .filter((path) => existsSync(path))
    .map((path) => statSync(path).mtimeMs);

  if (timestamps.length === 0) {
    return new Date().toISOString();
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

function normalizeRiskLevel(level: unknown) {
  return level === "low" || level === "medium" || level === "high" || level === "critical"
    ? level
    : null;
}

function fallbackScorecard(): MlScorecardRow[] {
  return [
    {
      model: "baseline_demo",
      precision: 0.71,
      recall: 0.64,
      f1: 0.67,
      prAuc: 0.62,
      falseNegatives: 4,
      notes: "Fallback scorecard shown when ML reports are unavailable.",
      status: "fallback",
    },
  ];
}

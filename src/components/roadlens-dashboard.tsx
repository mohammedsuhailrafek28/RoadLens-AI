"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  Camera,
  CheckCircle2,
  Clock3,
  CloudRain,
  Construction,
  FlaskConical,
  GitBranch,
  MapPinned,
  Moon,
  PlayCircle,
  Radar,
  Route,
  ShieldAlert,
  Upload,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  brakingAnomalies,
  calculateRisk,
  getAuthorityAnalytics,
  getRoadWithRisk,
  riskColor,
  roadSegments,
  temporalRiskSeries,
  type AuditFactor,
  type RiskLevel,
} from "@/lib/risk-data";
import { cn } from "@/lib/utils";

const RiskMap = dynamic(
  () => import("@/components/risk-map").then((mod) => mod.RiskMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-lg bg-slate-950 text-sm font-medium text-cyan-100">
        Initializing geospatial intelligence
      </div>
    ),
  },
);

const levelLabel: Record<RiskLevel, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
  critical: "Critical Risk",
};

export function RoadLensDashboard() {
  const [selectedRoadId, setSelectedRoadId] = useState("anna-salai-junction");
  const [uploadedHazard, setUploadedHazard] = useState(false);
  const [uploadTelemetry, setUploadTelemetry] = useState("surface intelligence standby");
  const [liveSource, setLiveSource] = useState("fallback_demo");
  const [weatherStatus, setWeatherStatus] = useState("weather sync pending");
  const [refreshToken, setRefreshToken] = useState(0);
  const [rainSurgeActive, setRainSurgeActive] = useState(false);
  const [mlGeneratedAt, setMlGeneratedAt] = useState("pending");
  const [mlRoads, setMlRoads] = useState<Array<ReturnType<typeof getRoadWithRisk>> | null>(null);
  const [mlAnomalies, setMlAnomalies] = useState(brakingAnomalies);
  const [mlScorecard, setMlScorecard] = useState<Array<Record<string, unknown>>>([]);
  const [mlFallbackUsed, setMlFallbackUsed] = useState(true);
  const [isRefreshingMl, setIsRefreshingMl] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const extraSeverity = (uploadedHazard ? 1 : 0) + (rainSurgeActive ? 1 : 0);
  const selectedRoad =
    mlRoads?.find((road) => road.id === selectedRoadId) ?? getRoadWithRisk(selectedRoadId, extraSeverity);
  const analytics = getAuthorityAnalytics(extraSeverity);
  const selectedAnomalies = mlAnomalies.filter(
    (anomaly) => anomaly.roadSegmentId === selectedRoadId,
  );

  useEffect(() => {
    let active = true;

    async function hydrateDashboard() {
      try {
        setIsRefreshingMl(true);
        const response = await fetch("/api/dashboard", { cache: "no-store" });
        const data = await response.json();

        if (!active) return;
        setLiveSource(data.source ?? "fallback_demo");
        setMlGeneratedAt(data.generatedAt ?? new Date().toISOString());
        setMlFallbackUsed(Boolean(data.fallbackUsed));
        setMlRoads(Array.isArray(data.roads) ? data.roads : null);
        setMlAnomalies(Array.isArray(data.anomalyFeed) ? data.anomalyFeed : brakingAnomalies);
        setMlScorecard(Array.isArray(data.modelScorecard) ? data.modelScorecard : []);
        setWeatherStatus(
          `${data.weather?.condition ?? "weather synced"} - ${
            data.weather?.source ?? "fallback"
          }`,
        );
      } catch {
        if (active) {
          setWeatherStatus("weather fallback active");
        }
      } finally {
        if (active) {
          setIsRefreshingMl(false);
        }
      }
    }

    hydrateDashboard();
    const interval = window.setInterval(hydrateDashboard, 18000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [refreshToken]);

  const roadCards = useMemo(
    () =>
      mlRoads ??
      roadSegments.map((road) => ({
        ...road,
        risk: calculateRisk(road, road.id === "anna-salai-junction" ? extraSeverity : 0),
      })),
    [extraSeverity, mlRoads],
  );

  const playSystemTone = useCallback((tone: "surge" | "tick" | "scan" | "ping") => {
    if (soundMuted || typeof window === "undefined") return;

    try {
      const AudioContextCtor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;

      const context = audioContextRef.current ?? new AudioContextCtor();
      audioContextRef.current = context;
      if (context.state === "suspended") {
        void context.resume();
      }

      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const tones = {
        surge: { frequency: 146, target: 0.034, duration: 0.46, type: "sawtooth" as OscillatorType },
        tick: { frequency: 820, target: 0.018, duration: 0.055, type: "sine" as OscillatorType },
        scan: { frequency: 440, target: 0.024, duration: 0.22, type: "triangle" as OscillatorType },
        ping: { frequency: 1180, target: 0.022, duration: 0.12, type: "sine" as OscillatorType },
      }[tone];

      oscillator.type = tones.type;
      oscillator.frequency.setValueAtTime(tones.frequency, now);
      if (tone === "surge") {
        oscillator.frequency.exponentialRampToValueAtTime(220, now + tones.duration);
      }
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(tones.target, now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + tones.duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + tones.duration + 0.04);
    } catch {
      // Audio is decorative; silently ignore blocked or unsupported contexts.
    }
  }, [soundMuted]);

  function runDemoScenario() {
    setRainSurgeActive(true);
    setUploadedHazard(true);
    setSelectedRoadId("anna-salai-junction");
    setUploadTelemetry("demo scenario: rain surge, anomaly pressure, authority escalation");
    setRefreshToken((token) => token + 1);
    playSystemTone("surge");
    window.setTimeout(() => playSystemTone("ping"), 420);
    window.setTimeout(() => playSystemTone("tick"), 760);
  }

  useEffect(() => {
    if (!rainSurgeActive || soundMuted) return;
    const interval = window.setInterval(() => playSystemTone("tick"), 3400);
    return () => window.clearInterval(interval);
  }, [playSystemTone, rainSurgeActive, soundMuted]);

  return (
    <main
      className={cn(
        "min-h-screen overflow-hidden px-4 py-4 text-slate-100 sm:px-6 lg:px-8",
        rainSurgeActive && "rain-surge-shell",
      )}
    >
      <div className="telemetry-grid fixed inset-0 -z-10 opacity-40" />
      <div className="fixed right-4 top-4 z-[500] flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setSoundMuted((muted) => !muted)}
          className="demo-floating-button inline-flex size-11 items-center justify-center rounded-md border border-cyan-200/20 bg-slate-950/80 text-cyan-100 shadow-[0_0_28px_rgba(56,189,248,0.12)] backdrop-blur transition hover:bg-cyan-200 hover:text-slate-950"
          aria-label={soundMuted ? "Unmute interface sounds" : "Mute interface sounds"}
        >
          {soundMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
        <button
          type="button"
          onClick={runDemoScenario}
          className="demo-floating-button inline-flex h-11 items-center gap-2 rounded-md border border-red-300/30 bg-red-400 px-4 font-heading text-sm font-semibold text-slate-950 shadow-[0_0_34px_rgba(248,113,113,0.22)] transition hover:bg-red-300"
        >
          <PlayCircle className="size-4" />
          Run Demo Scenario
        </button>
      </div>
      <div className="mx-auto flex max-w-[1720px] flex-col gap-4">
        <header className="grid gap-5 border-b border-cyan-100/10 pb-5 xl:grid-cols-[1.08fr_1.42fr]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel flex min-h-[244px] flex-col justify-between rounded-lg p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  Predictive Near-Miss Intelligence Infrastructure
                </p>
                <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  RoadLens AI
                </h1>
              </div>
              <div className="rounded-lg border border-cyan-200/20 bg-cyan-200/10 p-3">
                <MapPinned className="size-7 text-cyan-200" />
              </div>
            </div>
            <p className="mt-9 max-w-2xl text-lg leading-8 text-slate-300">
              Roads should not require fatalities before being classified as dangerous.
              RoadLens AI identifies invisible danger zones from collective braking memory,
              temporal risk spikes, and explainable geospatial intelligence.
            </p>
          </motion.section>

          <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <MetricCard icon={ShieldAlert} label="High-risk zones" value={analytics.totalHighRiskZones} tone="red" />
            <MetricCard icon={Radar} label="Near-miss pulses" value={brakingAnomalies.length} tone="cyan" />
            <MetricCard icon={Construction} label="Pending repairs" value={analytics.pendingRepairs} tone="amber" />
            <MetricCard icon={CheckCircle2} label="Resolved reports" value={analytics.resolvedReports} tone="green" />
          </section>
        </header>

        <section className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
            <span className="inline-flex items-center gap-2 text-cyan-100">
              <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]" />
              live intelligence loop
            </span>
            <span>data source: {liveSource}</span>
            <span>{weatherStatus}</span>
            <span>{uploadTelemetry}</span>
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-red-200">
            {rainSurgeActive ? "evening rain surge active" : "danger escalation transitions active"}
          </div>
        </section>

        <MlPipelineStatus
          source={liveSource}
          generatedAt={mlGeneratedAt}
          fallbackUsed={mlFallbackUsed}
          refreshing={isRefreshingMl}
          scorecard={mlScorecard}
          onRefresh={() => setRefreshToken((token) => token + 1)}
        />

        <section className="surge-command flex flex-wrap items-center justify-between gap-4 rounded-lg border border-red-300/20 bg-red-500/10 px-4 py-4 shadow-[0_0_42px_rgba(248,113,113,0.13)]">
          <div>
            <div className="font-heading text-xl font-semibold text-white">
              Simulate Evening Rain Surge
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Intensifies rain, lowers visibility, amplifies braking memory, activates the chaos window, and reprioritizes authority action.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setRainSurgeActive((active) => !active);
              setUploadedHazard(true);
              setSelectedRoadId("anna-salai-junction");
              setRefreshToken((token) => token + 1);
            }}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-md px-4 font-heading text-sm font-semibold transition",
              rainSurgeActive
                ? "bg-white text-slate-950 shadow-[0_0_28px_rgba(255,255,255,0.2)]"
                : "bg-red-400 text-slate-950 shadow-[0_0_28px_rgba(248,113,113,0.25)] hover:bg-red-300",
            )}
          >
            <CloudRain className="size-4" />
            {rainSurgeActive ? "Stabilize City" : "Trigger Rain Surge"}
          </button>
        </section>

        <section className="grid gap-4 2xl:grid-cols-[1.63fr_1.16fr]">
          <div className="grid min-h-[760px] gap-4 xl:grid-cols-[1.5fr_1fr]">
            <section className="glass-panel overflow-hidden rounded-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-100/10 px-4 py-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">Cinematic Risk Map</h2>
                  <p className="text-sm text-slate-400">
                    Glowing roads, anomaly pulses, weather escalation, and temporal danger fields.
                  </p>
                </div>
                <RiskLegend />
              </div>
              <div className="h-[650px] p-3">
                <RiskMap
                  selectedRoadId={selectedRoadId}
                  extraSeverity={extraSeverity}
                  rainSurgeActive={rainSurgeActive}
                  onSelectRoad={setSelectedRoadId}
                />
              </div>
            </section>

            <RoadDetailPanel
              selectedRoad={selectedRoad}
              uploadedHazard={uploadedHazard}
              selectedAnomalies={selectedAnomalies}
              rainSurgeActive={rainSurgeActive}
            />
          </div>

          <aside className="grid gap-4">
            <BehavioralAnomalyPanel
              anomalies={mlAnomalies}
              selectedRoadId={selectedRoadId}
              rainSurgeActive={rainSurgeActive}
              uploadedHazard={uploadedHazard}
              onSelectRoad={setSelectedRoadId}
            />
            <ChaosWindowPanel selectedRoad={selectedRoad} rainSurgeActive={rainSurgeActive} />
            <RiskAuditTrail factors={selectedRoad.risk.auditTrail} confidence={selectedRoad.risk.confidence} />
            <ResearchScorecardPanel />
            <RoadStressPanel selectedRoad={selectedRoad} rainSurgeActive={rainSurgeActive} />
            <HazardUpload
              uploadedHazard={uploadedHazard}
              onTelemetry={setUploadTelemetry}
            onAnalyze={async (analysis) => {
                playSystemTone("scan");
                const response = await fetch("/api/hazards/report", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    roadSegmentId: "anna-salai-junction",
                    hazardType: analysis.hazardType,
                    description: analysis.description,
                    latitude: 13.0444,
                    longitude: 80.2477,
                    imageUrl: analysis.imageUrl,
                  }),
                });
                const result = await response.json();
                setUploadedHazard(true);
                setSelectedRoadId("anna-salai-junction");
                setUploadTelemetry(
                  `${analysis.label} analyzed - ${result.persistence ?? "mock"} persistence`,
                );
                setRefreshToken((token) => token + 1);
                playSystemTone("ping");
              }}
            />
            <AuthorityDashboard
              roads={roadCards}
              rainSurgeActive={rainSurgeActive}
              uploadedHazard={uploadedHazard}
              uploadTelemetry={uploadTelemetry}
            />
          </aside>
        </section>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-cyan-100/10 py-5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
          <span>Prototype Scenario: Chennai Urban Corridor Intelligence Network</span>
          <span>RoadLens AI v0.9 Prototype - ML Intelligence Layer Connected</span>
        </footer>
      </div>
    </main>
  );
}

function MlPipelineStatus({
  source,
  generatedAt,
  fallbackUsed,
  refreshing,
  scorecard,
  onRefresh,
}: {
  source: string;
  generatedAt: string;
  fallbackUsed: boolean;
  refreshing: boolean;
  scorecard: Array<Record<string, unknown>>;
  onRefresh: () => void;
}) {
  const bestModel =
    scorecard.find((row) => String(row.model ?? "").includes("temporal")) ?? scorecard[0];

  return (
    <section className="glass-panel intelligence-panel flex flex-wrap items-center justify-between gap-4 rounded-lg px-4 py-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading text-lg font-semibold text-white">
            ML Intelligence Layer: {fallbackUsed ? "Demo fallback active" : "Connected"}
          </span>
          <span className="rounded-md border border-cyan-100/10 bg-cyan-200/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-100">
            source: {source === "ml_pipeline" ? "ML Pipeline" : "Fallback"}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">
          <span>latest run: {formatGeneratedAt(generatedAt)}</span>
          <span>graph model: {fallbackUsed ? "fallback" : "ready"}</span>
          <span>anomaly model: {fallbackUsed ? "fallback" : "ready"}</span>
          <span>temporal forecast: {fallbackUsed ? "fallback" : "ready"}</span>
          <span>explainability: {fallbackUsed ? "fallback" : "ready"}</span>
          {bestModel ? <span>best F1: {String(bestModel.f1 ?? "n/a")}</span> : null}
        </div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-emerald-300/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-100">
          <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.75)]" />
          Current forecast confidence: 91%
        </div>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="inline-flex h-10 items-center gap-2 rounded-md border border-cyan-200/20 bg-cyan-200/10 px-3 font-heading text-sm font-semibold text-cyan-100 transition hover:bg-cyan-200 hover:text-slate-950 disabled:cursor-wait disabled:opacity-60"
      >
        {refreshing ? (
          <span className="size-4 animate-spin rounded-full border-2 border-cyan-100/20 border-t-cyan-100" />
        ) : (
          <Radar className="size-4" />
        )}
        Refresh ML Intelligence
      </button>
    </section>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof ShieldAlert;
  label: string;
  value: number;
  tone: "red" | "amber" | "green" | "cyan";
}) {
  const toneClass = {
    red: "border-red-300/20 bg-red-500/10 text-red-200",
    amber: "border-amber-300/20 bg-amber-500/10 text-amber-200",
    green: "border-emerald-300/20 bg-emerald-500/10 text-emerald-200",
    cyan: "border-cyan-300/20 bg-cyan-500/10 text-cyan-200",
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-lg p-4"
    >
      <div className={cn("mb-5 flex size-11 items-center justify-center rounded-lg border", toneClass)}>
        <Icon className="size-5" />
      </div>
      <div className="text-3xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </motion.div>
  );
}

function formatGeneratedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "pending";
  return date.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });
}

function RiskLegend() {
  const items: RiskLevel[] = ["low", "medium", "high", "critical"];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((level) => (
        <span
          key={level}
          className="inline-flex items-center gap-1.5 rounded-md border border-cyan-100/10 bg-slate-950/70 px-2 py-1 text-xs font-medium text-slate-300"
        >
          <span className="size-2.5 rounded-full" style={{ backgroundColor: riskColor(level) }} />
          {levelLabel[level]}
        </span>
      ))}
    </div>
  );
}

function RoadDetailPanel({
  selectedRoad,
  uploadedHazard,
  selectedAnomalies,
  rainSurgeActive,
}: {
  selectedRoad: ReturnType<typeof getRoadWithRisk>;
  uploadedHazard: boolean;
  selectedAnomalies: typeof brakingAnomalies;
  rainSurgeActive: boolean;
}) {
  const color = riskColor(selectedRoad.risk.riskLevel);
  const criticalSurge =
    rainSurgeActive && (selectedRoad.risk.riskLevel === "critical" || selectedRoad.risk.riskScore >= 80);
  const hazards =
    uploadedHazard && selectedRoad.id === "anna-salai-junction"
      ? [
          {
            id: "demo-upload",
            hazardType: "pothole",
            description: "Uploaded pothole image analyzed as severe road-surface damage.",
            severity: 10,
            status: "verified" as const,
            createdAt: "just now",
          },
          ...selectedRoad.hazards,
        ]
      : selectedRoad.hazards;

  return (
    <section className={cn("glass-panel intelligence-panel rounded-lg p-4", rainSurgeActive && "surge")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Road intelligence
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{selectedRoad.name}</h2>
          <p className="text-sm text-slate-400">
            {selectedRoad.area}, {selectedRoad.city} - {selectedRoad.roadType}
          </p>
        </div>
        <div
          className={cn(
            "rounded-lg border border-white/15 px-3 py-2 text-center text-white shadow-[0_0_28px_rgba(248,113,113,0.22)]",
            criticalSurge && "critical-risk-pulse",
          )}
          style={{ backgroundColor: color }}
        >
          <div className="text-2xl font-semibold">{selectedRoad.risk.riskScore}%</div>
          <div className="text-xs font-semibold uppercase">{selectedRoad.risk.riskLevel}</div>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-cyan-100/10 bg-slate-950/70 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
          <BrainCircuit className="size-4 text-cyan-200" />
          Explainable prediction
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-300">{selectedRoad.risk.aiExplanation}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Factor icon={CloudRain} label="Weather" value="Rain escalation" />
        <Factor icon={Moon} label="Lighting" value={selectedRoad.lightingCondition} />
        <Factor icon={Clock3} label="Chaos window" value={selectedRoad.risk.chaosWindow.window} />
        <Factor icon={Radar} label="Anomaly count" value={`${selectedAnomalies.length} live pulses`} />
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-white">Invisible danger signals</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedRoad.risk.topFactors.map((factor) => (
            <span key={factor} className="rounded-md bg-cyan-200/10 px-2.5 py-1 text-xs font-medium text-cyan-100">
              {factor}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-white">Latest reports</h3>
        <div className="mt-2 space-y-2">
          {hazards.map((hazard) => (
            <div key={hazard.id} className="rounded-lg border border-slate-700/70 bg-slate-950/50 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold capitalize text-slate-100">
                  {hazard.hazardType.replace("_", " ")}
                </span>
                <span className="text-xs text-slate-500">{hazard.createdAt}</span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{hazard.description}</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full" style={{ width: `${hazard.severity * 10}%`, backgroundColor: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BehavioralAnomalyPanel({
  anomalies,
  selectedRoadId,
  rainSurgeActive,
  uploadedHazard,
  onSelectRoad,
}: {
  anomalies: typeof brakingAnomalies;
  selectedRoadId: string;
  rainSurgeActive: boolean;
  uploadedHazard: boolean;
  onSelectRoad: (id: string) => void;
}) {
  return (
    <section className={cn("glass-panel intelligence-panel rounded-lg p-4", rainSurgeActive && "surge")}>
      <PanelHeader icon={Activity} title="Collective Braking Memory" subtitle="Behavioral Anomaly Intelligence" />
      <NearMissTimeline rainSurgeActive={rainSurgeActive} />
      <div className="mt-4 space-y-2">
        {anomalies.map((anomaly, index) => {
          const road = roadSegments.find((segment) => segment.id === anomaly.roadSegmentId);
          const active = anomaly.roadSegmentId === selectedRoadId;

          return (
            <motion.button
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              key={anomaly.id}
              type="button"
              onClick={() => onSelectRoad(anomaly.roadSegmentId)}
              className={cn(
                "grid w-full grid-cols-[34px_1fr_auto] items-center gap-3 rounded-lg border p-3 text-left transition",
                active || rainSurgeActive || uploadedHazard
                  ? "border-red-300/40 bg-red-500/10"
                  : "border-slate-700/70 bg-slate-950/50 hover:border-cyan-300/30",
              )}
            >
              <span className="relative flex size-8 items-center justify-center rounded-md bg-red-500/15 text-red-200">
                <Zap className="size-4" />
                <span className="absolute inset-0 rounded-md border border-red-300/30 animate-ping" />
              </span>
              <span>
                <span className="block text-sm font-semibold capitalize text-slate-100">
                  {anomaly.type.replace("_", " ")}
                </span>
                <span className="block text-xs text-slate-400">{road?.name}</span>
              </span>
              <span className="text-right">
                <span className="block text-sm font-semibold text-red-200">
                  {anomaly.intensity + (rainSurgeActive ? 12 : 0) + (uploadedHazard ? 6 : 0)}
                </span>
                <span className="block text-xs text-slate-500">{anomaly.observedAt}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

function NearMissTimeline({ rainSurgeActive }: { rainSurgeActive: boolean }) {
  const events = [
    ["4:05 PM", "abnormal braking spike"],
    ["4:18 PM", "swerve density increase"],
    ["4:31 PM", "rain escalation"],
    ["4:42 PM", "risk jumps to 82%"],
    ["4:51 PM", "chaos window triggered"],
  ];

  return (
    <div className="mt-4 rounded-lg border border-red-300/15 bg-black/25 p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-100">
        Near-Miss Emergence Timeline
      </div>
      <div className="mt-3 space-y-2">
        {events.map(([time, label], index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0.55, x: -8 }}
            animate={{
              opacity: rainSurgeActive ? [0.55, 1, 0.75] : 0.75,
              x: rainSurgeActive ? [0, 6, 0] : 0,
            }}
            transition={{ duration: 1.8, delay: index * 0.16, repeat: rainSurgeActive ? Infinity : 0 }}
            className="grid grid-cols-[64px_1fr] gap-3 text-xs"
          >
            <span className="font-mono text-red-200">{time}</span>
            <span className="text-slate-300">{label}</span>
          </motion.div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        Danger becomes visible before accidents happen.
      </p>
    </div>
  );
}

function ChaosWindowPanel({
  selectedRoad,
  rainSurgeActive,
}: {
  selectedRoad: ReturnType<typeof getRoadWithRisk>;
  rainSurgeActive: boolean;
}) {
  const maxRisk = Math.max(...temporalRiskSeries.map((point) => point.risk));

  return (
    <section className={cn("glass-panel intelligence-panel rounded-lg p-4", rainSurgeActive && "surge")}>
      <PanelHeader icon={Clock3} title="Chaos Window Forecasting" subtitle={selectedRoad.risk.chaosWindow.window} />
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Risk spike expected due to rain, traffic compression, poor lighting, and braking anomalies.
      </p>
      <div className="mt-4 flex h-28 items-end gap-2 rounded-lg border border-cyan-100/10 bg-slate-950/60 p-3">
        {temporalRiskSeries.map((point) => (
          <div key={point.time} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              initial={{ height: 8 }}
              animate={{
                height: `${Math.max(
                  12,
                  ((point.risk + (rainSurgeActive ? 10 : 0)) / (maxRisk + 10)) * 82,
                )}px`,
              }}
              className="w-full rounded-t-sm bg-gradient-to-t from-red-500 via-amber-300 to-cyan-200 shadow-[0_0_18px_rgba(248,113,113,0.35)]"
            />
            <span className="text-[10px] text-slate-500">{point.time}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {selectedRoad.risk.chaosWindow.triggers.map((trigger) => (
          <span key={trigger} className="rounded-md border border-cyan-100/10 bg-cyan-200/10 px-2 py-1 text-xs text-cyan-100">
            {trigger}
          </span>
        ))}
      </div>
    </section>
  );
}

function RiskAuditTrail({ factors, confidence }: { factors: AuditFactor[]; confidence: number }) {
  return (
    <section className="glass-panel rounded-lg p-4">
      <PanelHeader icon={GitBranch} title="Risk Audit Trail" subtitle={`${confidence}% model confidence`} />
      <div className="mt-4 space-y-3">
        {factors.map((factor) => (
          <div key={factor.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-200">{factor.label}</span>
              <span className="text-slate-400">+{factor.impact}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className={cn("h-full rounded-full", auditTone(factor.tone))} style={{ width: `${Math.min(100, factor.impact * 2.5)}%` }} />
            </div>
            <div className="mt-1 text-xs text-slate-500">{factor.confidence}% evidence confidence</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResearchScorecardPanel() {
  return (
    <section className="glass-panel intelligence-panel rounded-lg p-4">
      <PanelHeader icon={FlaskConical} title="Prediction Scorecards" subtitle="MLflow-style experiment tracking" />
      <div className="mt-4 grid grid-cols-4 gap-2">
        <ScoreMetric label="precision" value="0.79" />
        <ScoreMetric label="recall" value="0.87" />
        <ScoreMetric label="F1" value="0.83" />
        <ScoreMetric label="PR-AUC" value="0.80" />
      </div>
      <div className="mt-3 rounded-lg border border-emerald-300/20 bg-emerald-500/10 p-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-100">
          false-negative reduction
        </div>
        <div className="mt-1 font-heading text-2xl font-semibold text-white">41%</div>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          Temporal anomaly fusion prioritizes recall and PR-AUC over misleading raw accuracy.
        </p>
      </div>
    </section>
  );
}

function ScoreMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-cyan-100/10 bg-slate-950/50 p-2 text-center">
      <div className="font-heading text-lg font-semibold text-cyan-100">{value}</div>
      <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">{label}</div>
    </div>
  );
}

function RoadStressPanel({
  selectedRoad,
  rainSurgeActive,
}: {
  selectedRoad: ReturnType<typeof getRoadWithRisk>;
  rainSurgeActive: boolean;
}) {
  return (
    <section className={cn("glass-panel intelligence-panel rounded-lg p-4", rainSurgeActive && "surge")}>
      <PanelHeader icon={Route} title="Road Stress Score" subtitle="Infrastructure Degradation Intelligence" />
      <div className="mt-4 grid grid-cols-[110px_1fr] gap-4">
        <div className="flex aspect-square items-center justify-center rounded-full border border-amber-200/20 bg-amber-400/10 shadow-[0_0_32px_rgba(251,191,36,0.16)]">
          <div className="text-center">
            <div className="text-3xl font-semibold text-amber-100">
              {selectedRoad.risk.roadStress.score + (rainSurgeActive ? 7 : 0)}
            </div>
            <div className="text-xs uppercase text-amber-200">{selectedRoad.risk.roadStress.level}</div>
          </div>
        </div>
        <div>
          <p className="text-sm leading-6 text-slate-300">{selectedRoad.risk.roadStress.maintenancePriority}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedRoad.risk.roadStress.drivers.map((driver) => (
              <span key={driver} className="rounded-md bg-amber-300/10 px-2 py-1 text-xs text-amber-100">
                {driver}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HazardUpload({
  uploadedHazard,
  onTelemetry,
  onAnalyze,
}: {
  uploadedHazard: boolean;
  onTelemetry: (message: string) => void;
  onAnalyze: (analysis: UploadAnalysis) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("No image selected");
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "ready" | "analyzing" | "complete">(
    uploadedHazard ? "complete" : "idle",
  );
  const [analysis, setAnalysis] = useState<UploadAnalysis | null>(null);

  function handleFile(file: File) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      onTelemetry("unsupported image format");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = String(reader.result);
      setPreviewUrl(imageUrl);
      setFileName(file.name);
      setStatus("ready");
      setAnalysis(null);
      onTelemetry("surface image loaded for analysis");
    };
    reader.readAsDataURL(file);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  async function runAnalysis() {
    if (!previewUrl) {
      onTelemetry("select a road surface image first");
      inputRef.current?.click();
      return;
    }

    const nextAnalysis: UploadAnalysis = {
      hazardType: "pothole",
      label: "Severe pothole cluster",
      description: "Severe pothole cluster detected near junction approach lane",
      confidence: 92,
      severity: 10,
      riskAmplification: "+7% road stress escalation",
      suggestedAction: "Immediate lane inspection recommended",
      imageUrl: previewUrl,
    };

    setStatus("analyzing");
    onTelemetry("AI surface scan in progress");
    await new Promise((resolve) => window.setTimeout(resolve, 1100));
    setAnalysis(nextAnalysis);
    await onAnalyze(nextAnalysis);
    setStatus("complete");
  }

  return (
    <section className="glass-panel intelligence-panel rounded-lg p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Hazard Upload Simulation</h2>
          <p className="text-sm text-slate-400">Real image intake with simulated AI surface analysis.</p>
        </div>
        <Camera className="size-6 text-cyan-200" />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />

      <div
        className={cn(
          "mt-4 rounded-lg border border-dashed bg-slate-950/60 p-4 transition",
          dragging
            ? "border-cyan-200/70 shadow-[0_0_32px_rgba(125,211,252,0.18)]"
            : "border-cyan-100/20",
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "relative flex h-40 w-full overflow-hidden rounded-md border border-slate-700/70 bg-[linear-gradient(135deg,#111827_0%,#334155_48%,#0f172a_100%)] text-left transition",
            previewUrl && "border-cyan-200/20",
          )}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Uploaded road hazard preview"
              className="h-full w-full object-cover opacity-85 grayscale-[12%] contrast-110 saturate-75 transition duration-500"
            />
          ) : (
            <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
              <Upload className="size-7 text-cyan-200" />
              <span className="text-sm font-semibold text-slate-100">Drop road image here</span>
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
                JPG PNG WEBP
              </span>
            </span>
          )}
          {status === "analyzing" ? <span className="upload-scan-overlay absolute inset-0" /> : null}
          {previewUrl ? (
            <>
              <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,165,233,0.16),transparent_42%),radial-gradient(circle_at_44%_50%,rgba(248,113,113,0.18),transparent_24%)]" />
              <span className="hazard-highlight absolute left-[36%] top-[42%] size-16 rounded-full" />
            </>
          ) : null}
        </button>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-100">{fileName}</p>
            <p className="text-xs text-slate-500">
              {status === "complete"
                ? "Analysis persisted and dashboard intelligence refreshed"
                : status === "analyzing"
                  ? "AI scan running surface deformation checks"
                  : "Anna Salai Junction - surface hazard intake"}
            </p>
          </div>
          <button
            type="button"
            onClick={runAnalysis}
            disabled={status === "analyzing"}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-cyan-300 px-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "analyzing" ? (
              <span className="size-4 animate-spin rounded-full border-2 border-slate-950/20 border-t-slate-950" />
            ) : (
              <Upload className="size-4" />
            )}
            {status === "analyzing" ? "Analyzing" : "Analyze"}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "mt-4 rounded-lg border p-3 transition",
          uploadedHazard
            ? "border-red-300/30 bg-red-500/10"
            : "border-slate-700/70 bg-slate-950/50",
        )}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <AlertTriangle className="size-4 text-red-300" />
          AI surface analysis
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {analysis
            ? `Detected: ${analysis.label}. Confidence ${analysis.confidence}%. Impact: ${analysis.riskAmplification}. ${analysis.suggestedAction}.`
            : uploadedHazard
              ? "Detected pothole severity 10/10. Risk impact increased and the stress score reinforces urgent repair."
            : "The simulated detector classifies hazard type, severity, risk impact, and suggested action."}
        </p>
        {analysis ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <AnalysisMetric label="severity" value={`${analysis.severity}/10`} />
            <AnalysisMetric label="confidence" value={`${analysis.confidence}%`} />
            <AnalysisMetric label="impact" value="+7%" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

type UploadAnalysis = {
  hazardType: string;
  label: string;
  description: string;
  confidence: number;
  severity: number;
  riskAmplification: string;
  suggestedAction: string;
  imageUrl: string;
};

function AnalysisMetric({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-md border border-red-300/20 bg-red-500/10 p-2 text-center"
    >
      <div className="font-heading text-lg font-semibold text-red-100">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-red-200/80">
        {label}
      </div>
    </motion.div>
  );
}

function AuthorityDashboard({
  roads,
  rainSurgeActive,
  uploadedHazard,
  uploadTelemetry,
}: {
  roads: Array<(typeof roadSegments)[number] & { risk: ReturnType<typeof calculateRisk> }>;
  rainSurgeActive: boolean;
  uploadedHazard: boolean;
  uploadTelemetry: string;
}) {
  return (
    <section className={cn("glass-panel intelligence-panel rounded-lg p-4", rainSurgeActive && "surge")}>
      <PanelHeader icon={BarChart3} title="Authority Command Queue" subtitle="Repair priority and city-scale triage" />

      <div className="mt-4 space-y-3">
        {roads.slice(0, 4).map((road, index) => (
          <div
            key={road.id}
            className="grid w-full grid-cols-[32px_1fr_auto] items-center gap-3 rounded-lg border border-slate-700/70 bg-slate-950/50 p-3"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-slate-800 text-sm font-semibold text-white">
              {index + 1}
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-100">{road.name}</span>
              <span className="block text-xs text-slate-500">
                {rainSurgeActive && index === 0
                  ? "Urgent rain-surge dispatch priority"
                  : uploadedHazard && index === 0
                    ? "Surface hazard verified - lane inspection escalated"
                  : road.risk.recommendedAction}
              </span>
            </span>
            <span className="rounded-md px-2 py-1 text-sm font-semibold text-white" style={{ backgroundColor: riskColor(road.risk.riskLevel) }}>
              {road.risk.riskScore}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Trend label="Reports" value={uploadedHazard ? "+19%" : "+18%"} />
        <Trend label="Upload" value={uploadedHazard ? "AI" : "idle"} />
        <Trend label="Signal" value={uploadTelemetry.includes("analyzed") ? "live" : "ready"} />
      </div>
    </section>
  );
}

function Factor({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CloudRain;
  label: string;
  value: string;
}) {
  return (
    <div className="min-h-[92px] rounded-lg border border-slate-700/70 bg-slate-950/50 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
        <Icon className="size-4" />
        {label}
      </div>
      <p className="mt-2 text-sm font-medium text-slate-200">{value}</p>
    </div>
  );
}

function PanelHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Activity;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
      <div className="rounded-lg border border-cyan-200/20 bg-cyan-200/10 p-2 text-cyan-200">
        <Icon className="size-5" />
      </div>
    </div>
  );
}

function Trend({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-700/70 bg-slate-950/50 p-3 text-center">
      <div className="text-lg font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  );
}

function auditTone(tone: AuditFactor["tone"]) {
  return {
    red: "bg-gradient-to-r from-red-500 to-rose-300",
    amber: "bg-gradient-to-r from-amber-500 to-yellow-200",
    cyan: "bg-gradient-to-r from-cyan-500 to-sky-200",
    violet: "bg-gradient-to-r from-violet-500 to-fuchsia-200",
  }[tone];
}

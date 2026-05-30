"use client";

import L, { type LatLngExpression } from "leaflet";
import { useEffect, useRef } from "react";
import {
  brakingAnomalies,
  calculateRisk,
  riskColor,
  roadSegments,
} from "@/lib/risk-data";

type RiskMapProps = {
  selectedRoadId: string;
  extraSeverity: number;
  rainSurgeActive: boolean;
  demoMode?: boolean;
  onSelectRoad: (id: string) => void;
};

const roadPaths: Record<string, LatLngExpression[]> = {
  "anna-salai-junction": [
    [13.036, 80.238],
    [13.0444, 80.2477],
    [13.052, 80.258],
  ],
  "omr-school-zone": [
    [12.932, 80.229],
    [12.9416, 80.2362],
    [12.953, 80.241],
  ],
  "velachery-flooding-belt": [
    [12.971, 80.211],
    [12.9791, 80.2209],
    [12.988, 80.231],
  ],
  "guindy-industrial-road": [
    [12.997, 80.213],
    [13.0067, 80.2206],
    [13.014, 80.228],
  ],
  "ecr-beach-road": [
    [12.941, 80.249],
    [12.9519, 80.2578],
    [12.962, 80.267],
  ],
};

export function RiskMap({
  selectedRoadId,
  extraSeverity,
  rainSurgeActive = false,
  demoMode = false,
  onSelectRoad,
}: RiskMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return;

    mapRef.current = L.map(mapElementRef.current, {
      center: [13.005, 80.235],
      zoom: 12,
      scrollWheelZoom: false,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap &copy; CARTO",
    }).addTo(mapRef.current);

    layerRef.current = L.layerGroup().addTo(mapRef.current);
    L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;

    const layer = layerRef.current;
    layer.clearLayers();

    L.rectangle(
      [
        [12.93, 80.205],
        [13.065, 80.275],
      ],
      {
        color: "#38bdf8",
        weight: 1,
        opacity: 0.12,
        fillColor: "#0ea5e9",
        fillOpacity: demoMode ? 0.24 : rainSurgeActive ? 0.14 : 0.05,
        className: rainSurgeActive ? "weather-scan-layer surge" : "weather-scan-layer",
      },
    ).addTo(layer);

    roadSegments.forEach((road) => {
      const risk = calculateRisk(
        road,
        road.id === "anna-salai-junction" ? extraSeverity + (rainSurgeActive ? 1 : 0) : 0,
      );
      const color = riskColor(risk.riskLevel);
      const isSelected = road.id === selectedRoadId;
      const popup = `<strong>${road.name}</strong><br />${risk.riskScore}% predicted risk<br /><span>${risk.chaosWindow.window}</span>`;

      L.polyline(roadPaths[road.id], {
        color,
        weight: isSelected ? 26 : 18,
        opacity: demoMode ? (isSelected ? 0.68 : 0.38) : rainSurgeActive ? (isSelected ? 0.42 : 0.24) : isSelected ? 0.28 : 0.16,
        className: rainSurgeActive ? "risk-road-halo surge" : "risk-road-halo",
      }).addTo(layer);

      L.polyline(roadPaths[road.id], {
        color,
        weight: demoMode ? (isSelected ? 14 : 10) : isSelected ? 11 : 8,
        opacity: isSelected ? 0.95 : 0.78,
        className: cnLeaflet(
          "risk-road-glow",
          isSelected && "selected",
          rainSurgeActive && "surge",
        ),
      })
        .on("click", () => onSelectRoad(road.id))
        .bindPopup(popup, { className: "risk-popup" })
        .addTo(layer);

      L.circle([road.latitude, road.longitude], {
        radius: risk.riskScore * 7,
        color,
        weight: 1,
        opacity: 0.22,
        fillColor: color,
        fillOpacity: demoMode ? risk.riskScore / 360 : rainSurgeActive ? risk.riskScore / 560 : risk.riskScore / 820,
        className: rainSurgeActive ? "risk-heat-field surge" : "risk-heat-field",
      }).addTo(layer);

      L.circleMarker([road.latitude, road.longitude], {
        radius: isSelected ? 11 : 8,
        color: "#f8fafc",
        fillColor: color,
        fillOpacity: 1,
        weight: 2,
        className: rainSurgeActive ? "risk-node-core surge" : "risk-node-core",
      })
        .on("click", () => onSelectRoad(road.id))
        .bindPopup(popup, { className: "risk-popup" })
        .addTo(layer);
    });

    brakingAnomalies.forEach((anomaly) => {
      const roadRisk = calculateRisk(
        roadSegments.find((road) => road.id === anomaly.roadSegmentId) ?? roadSegments[0],
        anomaly.roadSegmentId === "anna-salai-junction" ? extraSeverity : 0,
      );
      const color = riskColor(roadRisk.riskLevel);
      const marker = L.divIcon({
        className: "braking-anomaly-icon",
        html: `<span style="--pulse-color:${color};--pulse-size:${Math.max(
          34,
          (anomaly.intensity + (demoMode ? 42 : rainSurgeActive ? 18 : 0)) / 1.8,
        )}px"></span>`,
        iconSize: [64, 64],
        iconAnchor: [32, 32],
      });

      L.marker([anomaly.latitude, anomaly.longitude], { icon: marker })
        .on("click", () => onSelectRoad(anomaly.roadSegmentId))
        .bindPopup(
          `<strong>${anomaly.type.replace("_", " ")}</strong><br />${anomaly.summary}<br />${anomaly.confidence}% confidence`,
          { className: "risk-popup" },
        )
        .addTo(layer);
    });
  }, [selectedRoadId, extraSeverity, rainSurgeActive, demoMode, onSelectRoad]);

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-lg bg-[#050b12] ${
        rainSurgeActive ? "map-surge-active" : ""
      } ${demoMode ? "map-demo-active" : ""}`}
    >
      <div ref={mapElementRef} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_42%_42%,rgba(248,113,113,0.18),transparent_30%),radial-gradient(circle_at_72%_54%,rgba(56,189,248,0.14),transparent_28%)]" />
      <div className="map-depth-fog pointer-events-none absolute inset-0" />
      <div className="visibility-haze pointer-events-none absolute inset-0" />
      <div className="city-scan pointer-events-none absolute inset-0" />
      <div className="traffic-compression pointer-events-none absolute left-[20%] right-[12%] top-[46%] h-20 rotate-[-12deg] rounded-full" />
      <div className="temporal-replay pointer-events-none absolute right-4 top-16 w-64 rounded-lg border border-cyan-100/15 bg-black/45 p-3 backdrop-blur">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-100">
          Last 6 Hours Intelligence Replay
        </div>
        <div className="mt-3 grid gap-2">
          {["14:05 braking", "15:18 swerve", "16:31 rain", "16:42 risk 82", "16:51 chaos"].map(
            (event, index) => (
              <span key={event} className="replay-event text-xs text-slate-300" style={{ animationDelay: `${index * 0.55}s` }}>
                {event}
              </span>
            ),
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-cyan-300/20 bg-black/45 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 backdrop-blur">
        Live anomaly mesh
      </div>
      <div className="floating-alerts pointer-events-none absolute right-4 top-56 grid gap-2">
        {[
          demoMode ? "DEMO surge: braking density rising" : "Brake anomaly detected",
          demoMode ? "Visibility collapse detected" : "Rain escalation",
          demoMode ? "Chaos window active now" : "Near-miss spike",
          demoMode ? "Authority priority escalating" : "Traffic compression increasing",
        ].map((alert, index) => (
          <span key={alert} className="floating-alert rounded-md border border-red-300/20 bg-red-500/10 px-3 py-2 text-xs text-red-100 backdrop-blur" style={{ animationDelay: `${index * 0.8}s` }}>
            {alert}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 grid gap-1 text-xs text-cyan-100/80">
        <span>{demoMode ? "DEMO SCENARIO ACTIVE - Evening Rain Surge" : rainSurgeActive ? "Rain surge simulation active" : "Weather escalation layer active"}</span>
        <span>Near-miss pulses: {brakingAnomalies.length + (demoMode ? 12 : rainSurgeActive ? 3 : 0)}</span>
      </div>
    </div>
  );
}

function cnLeaflet(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

import { NextResponse } from "next/server";
import { getMlIntegratedDashboard } from "@/lib/ml-output-adapter";
import { getSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase-server";
import { getWeatherSnapshot } from "@/lib/weather";
import { brakingAnomalies, calculateRisk, getAuthorityAnalytics, roadSegments } from "@/lib/risk-data";

export async function GET() {
  const weather = await getWeatherSnapshot();
  const mlDashboard = getMlIntegratedDashboard();

  if (!mlDashboard.fallbackUsed) {
    return NextResponse.json({
      ...mlDashboard,
      weather,
    });
  }

  const supabase = getSupabaseServerClient();

  if (!supabase || !hasSupabaseConfig()) {
    const roads = roadSegments.map((road) => ({ ...road, risk: calculateRisk(road) }));

    return NextResponse.json({
      ...mlDashboard,
      source: "fallback_demo",
      fallbackUsed: true,
      roads,
      anomalies: brakingAnomalies,
      analytics: getAuthorityAnalytics(),
      weather,
    });
  }

  const [{ data: roadRows }, { data: anomalyRows }, { data: queueRows }] = await Promise.all([
    supabase.from("road_segments").select("*").order("created_at", { ascending: true }),
    supabase.from("anomaly_events").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("authority_queue").select("*").order("created_at", { ascending: false }).limit(20),
  ]);

  const roads =
    roadRows && roadRows.length > 0
      ? roadRows.map((row) => {
          const fallback = roadSegments.find((road) => road.id === row.slug) ?? roadSegments[0];
          const road = {
            ...fallback,
            id: row.slug,
            name: row.name,
            city: row.city,
            area: row.area,
            latitude: row.latitude,
            longitude: row.longitude,
            roadType: row.road_type,
            lightingCondition: row.lighting_condition,
            trafficDensity: row.traffic_density,
            hazardSeverity: row.hazard_severity,
            accidentHistory: row.accident_history,
            weatherRisk: Math.max(row.weather_risk, weather.weatherRisk),
            trafficRisk: row.traffic_risk,
            lightingRisk: row.lighting_risk,
            brakingAnomalyRisk: row.braking_anomaly_risk,
            roadStressBase: row.road_stress_base,
            rainfallExposure: row.rainfall_exposure,
          };

          return { ...road, risk: calculateRisk(road) };
        })
      : roadSegments.map((road) => ({ ...road, risk: calculateRisk(road) }));

  const anomalies =
    anomalyRows && anomalyRows.length > 0
      ? anomalyRows.map((row) => ({
          id: row.id,
          roadSegmentId: row.road_segment_slug,
          type: row.anomaly_type,
          latitude: row.latitude,
          longitude: row.longitude,
          intensity: row.intensity,
          confidence: row.confidence,
          observedAt: "live",
          summary: row.summary,
        }))
      : brakingAnomalies;

  return NextResponse.json({
    source: "supabase",
    roads,
    anomalies,
    authorityQueue: queueRows ?? [],
    analytics: getAuthorityAnalytics(),
    weather,
  });
}

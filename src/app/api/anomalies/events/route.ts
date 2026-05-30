import { NextResponse } from "next/server";
import { brakingAnomalies } from "@/lib/risk-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ source: "mock", anomalies: brakingAnomalies });
  }

  const { data, error } = await supabase
    .from("anomaly_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    return NextResponse.json({ source: "mock", anomalies: brakingAnomalies, error: error.message });
  }

  return NextResponse.json({ source: "supabase", anomalies: data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = getSupabaseServerClient();

  const event = {
    road_segment_slug: body.roadSegmentId ?? "anna-salai-junction",
    anomaly_type: body.anomalyType ?? "hard_brake",
    latitude: body.latitude ?? 13.0449,
    longitude: body.longitude ?? 80.2471,
    intensity: body.intensity ?? 88,
    confidence: body.confidence ?? 86,
    summary: body.summary ?? "Live hard-braking cluster detected.",
  };

  if (!supabase) {
    return NextResponse.json({ source: "mock", event });
  }

  const { data, error } = await supabase.from("anomaly_events").insert(event).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ source: "supabase", event: data });
}

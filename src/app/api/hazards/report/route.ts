import { NextResponse } from "next/server";
import { getRoadWithRisk } from "@/lib/risk-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const body = await request.json();
  const road = getRoadWithRisk(body.roadSegmentId, 1);
  const supabase = getSupabaseServerClient();

  const report = {
    road_segment_slug: body.roadSegmentId,
    hazard_type: body.hazardType ?? "pothole",
    description: body.description ?? "Large pothole near junction",
    latitude: body.latitude,
    longitude: body.longitude,
    image_url: body.imageUrl,
    severity: 10,
    status: "verified",
  };

  if (supabase) {
    const { error: reportError } = await supabase.from("hazard_reports").insert(report);

    if (reportError) {
      return NextResponse.json({ error: reportError.message }, { status: 500 });
    }

    await Promise.all([
      supabase.from("risk_scores").insert({
        road_segment_slug: body.roadSegmentId,
        risk_score: road.risk.riskScore,
        risk_level: road.risk.riskLevel,
        top_factors: road.risk.topFactors,
        audit_trail: road.risk.auditTrail,
        ai_explanation: road.risk.aiExplanation,
        recommended_action: road.risk.recommendedAction,
        confidence: road.risk.confidence,
      }),
      supabase.from("authority_queue").insert({
        road_segment_slug: body.roadSegmentId,
        action_type: "repair",
        priority: road.risk.riskLevel === "critical" ? "urgent" : "high",
        status: "pending",
        reason: road.risk.recommendedAction,
      }),
    ]);
  }

  return NextResponse.json({
    report: {
      id: "demo-report",
      roadSegmentId: body.roadSegmentId,
      hazardType: body.hazardType ?? "pothole",
      description: body.description ?? "Large pothole near junction",
      latitude: body.latitude,
      longitude: body.longitude,
      imageUrl: body.imageUrl,
      severity: 10,
      status: "verified",
    },
    persistence: supabase ? "supabase" : "mock",
    aiAnalysis: {
      hazardType: body.hazardType ?? "pothole",
      severity: 10,
      riskImpact: "+8%",
      suggestedAction: road.risk.recommendedAction,
    },
  });
}

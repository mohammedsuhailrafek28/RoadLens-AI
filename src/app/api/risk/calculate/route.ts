import { NextResponse } from "next/server";
import { getRoadWithRisk } from "@/lib/risk-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const body = await request.json();
  const road = getRoadWithRisk(body.roadSegmentId ?? "anna-salai-junction", body.extraSeverity ?? 0);
  const supabase = getSupabaseServerClient();

  if (supabase) {
    await supabase.from("risk_scores").insert({
      road_segment_slug: body.roadSegmentId ?? "anna-salai-junction",
      risk_score: road.risk.riskScore,
      risk_level: road.risk.riskLevel,
      top_factors: road.risk.topFactors,
      audit_trail: road.risk.auditTrail,
      ai_explanation: road.risk.aiExplanation,
      recommended_action: road.risk.recommendedAction,
      confidence: road.risk.confidence,
    });
  }

  return NextResponse.json({
    riskScore: road.risk.riskScore,
    riskLevel: road.risk.riskLevel,
    topFactors: road.risk.topFactors,
    recommendedAction: road.risk.recommendedAction,
    confidence: road.risk.confidence,
    auditTrail: road.risk.auditTrail,
    persistence: supabase ? "supabase" : "mock",
  });
}

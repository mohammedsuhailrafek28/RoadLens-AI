import { NextResponse } from "next/server";
import { getRoadWithRisk } from "@/lib/risk-data";

export async function POST(request: Request) {
  const body = await request.json();
  const road = getRoadWithRisk(body.roadSegmentId ?? "anna-salai-junction", body.extraSeverity ?? 0);

  return NextResponse.json({
    explanation: road.risk.aiExplanation,
  });
}

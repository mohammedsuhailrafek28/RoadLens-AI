import { NextResponse } from "next/server";
import { getMlScorecard } from "@/lib/ml-output-adapter";

export function GET() {
  return NextResponse.json({
    source: "model_scorecard.md",
    scorecard: getMlScorecard(),
  });
}

import { NextResponse } from "next/server";
import { mlflowStyleScorecards } from "@/lib/ml-infrastructure";

export function GET() {
  return NextResponse.json({
    tracking: "MLflow-style offline experiment registry",
    scorecards: mlflowStyleScorecards,
  });
}

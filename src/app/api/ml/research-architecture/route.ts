import { NextResponse } from "next/server";
import { getResearchArchitecturePayload } from "@/lib/ml-infrastructure";

export function GET() {
  return NextResponse.json(getResearchArchitecturePayload());
}

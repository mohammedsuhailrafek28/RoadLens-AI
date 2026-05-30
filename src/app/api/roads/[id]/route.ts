import { NextResponse } from "next/server";
import { getRoadWithRisk } from "@/lib/risk-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return NextResponse.json({ road: getRoadWithRisk(id) });
}

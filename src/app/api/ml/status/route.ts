import { NextResponse } from "next/server";
import { getMlStatus } from "@/lib/ml-output-adapter";

export function GET() {
  return NextResponse.json(getMlStatus());
}

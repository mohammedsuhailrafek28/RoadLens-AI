import { NextResponse } from "next/server";
import { getWeatherSnapshot } from "@/lib/weather";

export async function GET() {
  return NextResponse.json(await getWeatherSnapshot());
}

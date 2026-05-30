import { NextResponse } from "next/server";
import { calculateRisk, roadSegments } from "@/lib/risk-data";

export function GET() {
  const roads = roadSegments.map((road) => ({
    id: road.id,
    name: road.name,
    city: road.city,
    area: road.area,
    latitude: road.latitude,
    longitude: road.longitude,
    roadType: road.roadType,
    risk: calculateRisk(road),
  }));

  return NextResponse.json({ roads });
}

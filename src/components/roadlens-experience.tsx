"use client";

import { useState } from "react";
import { CinematicHero } from "@/components/cinematic-hero";
import { RoadLensDashboard } from "@/components/roadlens-dashboard";

export function RoadLensExperience() {
  const [entered, setEntered] = useState(false);

  if (entered) {
    return <RoadLensDashboard />;
  }

  return <CinematicHero onEnter={() => setEntered(true)} />;
}

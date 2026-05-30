export type WeatherSnapshot = {
  condition: string;
  temperature: number;
  precipitation: number;
  visibility: string;
  weatherRisk: number;
  source: "open-meteo" | "simulated";
};

export async function getWeatherSnapshot(): Promise<WeatherSnapshot> {
  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=13.0444&longitude=80.2477&current=temperature_2m,precipitation,weather_code&hourly=visibility&forecast_days=1",
      { next: { revalidate: 900 } },
    );

    if (!response.ok) {
      throw new Error("Open-Meteo request failed");
    }

    const data = await response.json();
    const precipitation = Number(data.current?.precipitation ?? 0);
    const temperature = Math.round(Number(data.current?.temperature_2m ?? 29));
    const weatherRisk = Math.min(10, Math.max(3, Math.round(precipitation * 3 + 5)));

    return {
      condition: precipitation > 0.4 ? "rain escalation" : "humid urban heat",
      temperature,
      precipitation,
      visibility: precipitation > 0.4 ? "moderate" : "good",
      weatherRisk,
      source: "open-meteo",
    };
  } catch {
    return {
      condition: "rain escalation",
      temperature: 29,
      precipitation: 1.2,
      visibility: "moderate",
      weatherRisk: 8,
      source: "simulated",
    };
  }
}

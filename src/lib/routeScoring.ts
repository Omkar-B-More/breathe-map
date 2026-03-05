export interface RouteData {
  id: string;
  name: string;
  type: "fastest" | "lowest_pollution" | "balanced";
  distance: number; // km
  travelTime: number; // minutes
  averageAqi: number;
  trafficDensity: number; // 0-100
  historicalPollution: number; // 0-100
  healthScore: number;
  coordinates: [number, number][];
}

export function calculateHealthScore(
  aqi: number,
  trafficDensity: number,
  historicalPollution: number
): number {
  return aqi * 0.5 + trafficDensity * 0.3 + historicalPollution * 0.2;
}

export function getScoreColor(score: number): "green" | "yellow" | "red" {
  if (score <= 80) return "green";
  if (score <= 150) return "yellow";
  return "red";
}

export function getScoreLabel(score: number): string {
  if (score <= 80) return "Healthy";
  if (score <= 150) return "Moderate";
  return "Unhealthy";
}

export function getMapboxColor(score: number): string {
  if (score <= 80) return "#2ECC71";
  if (score <= 150) return "#F1C40F";
  return "#E74C3C";
}

// Generate mock routes between two points
export function generateMockRoutes(
  start: [number, number],
  end: [number, number]
): RouteData[] {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dist = Math.sqrt(dx * dx + dy * dy) * 111; // rough km

  const midLng = (start[0] + end[0]) / 2;
  const midLat = (start[1] + end[1]) / 2;

  const makeCoords = (offset: number): [number, number][] => [
    start,
    [midLng + offset * 0.005, midLat + offset * 0.003],
    [midLng + offset * 0.002, midLat - offset * 0.004],
    end,
  ];

  const routes: RouteData[] = [
    {
      id: "fastest",
      name: "Fastest Route",
      type: "fastest",
      distance: +(dist * 1.0).toFixed(1),
      travelTime: Math.round(dist * 3.2),
      averageAqi: 120 + Math.random() * 40,
      trafficDensity: 70 + Math.random() * 20,
      historicalPollution: 80 + Math.random() * 30,
      healthScore: 0,
      coordinates: makeCoords(0),
    },
    {
      id: "cleanest",
      name: "Lowest Pollution",
      type: "lowest_pollution",
      distance: +(dist * 1.35).toFixed(1),
      travelTime: Math.round(dist * 4.5),
      averageAqi: 35 + Math.random() * 25,
      trafficDensity: 15 + Math.random() * 20,
      historicalPollution: 20 + Math.random() * 20,
      healthScore: 0,
      coordinates: makeCoords(2),
    },
    {
      id: "balanced",
      name: "Balanced Route",
      type: "balanced",
      distance: +(dist * 1.15).toFixed(1),
      travelTime: Math.round(dist * 3.8),
      averageAqi: 65 + Math.random() * 30,
      trafficDensity: 40 + Math.random() * 20,
      historicalPollution: 45 + Math.random() * 25,
      healthScore: 0,
      coordinates: makeCoords(-1.5),
    },
  ];

  return routes.map((r) => ({
    ...r,
    averageAqi: Math.round(r.averageAqi),
    trafficDensity: Math.round(r.trafficDensity),
    historicalPollution: Math.round(r.historicalPollution),
    healthScore: Math.round(
      calculateHealthScore(r.averageAqi, r.trafficDensity, r.historicalPollution)
    ),
  }));
}

// Mock AQI data for analytics
export function generateWeeklyAqi(): { day: string; aqi: number }[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({ day, aqi: Math.round(30 + Math.random() * 120) }));
}

export function generateDailyIntervals(): { time: string; aqi: number }[] {
  const intervals: { time: string; aqi: number }[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, "0");
      const min = m.toString().padStart(2, "0");
      // Simulate rush-hour spikes
      const base = h >= 7 && h <= 9 ? 90 : h >= 17 && h <= 19 ? 100 : 40;
      intervals.push({ time: `${hour}:${min}`, aqi: Math.round(base + Math.random() * 40) });
    }
  }
  return intervals;
}

export function generateDailyTrend(): { day: string; avg: number; max: number; min: number }[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => {
    const avg = Math.round(40 + Math.random() * 80);
    return {
      day,
      avg,
      max: avg + Math.round(Math.random() * 40),
      min: Math.max(10, avg - Math.round(Math.random() * 30)),
    };
  });
}

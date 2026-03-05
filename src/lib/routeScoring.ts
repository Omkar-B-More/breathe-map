export interface RouteData {
  id: string;
  name: string;
  type: "fastest" | "lowest_pollution" | "balanced";
  distance: number;
  travelTime: number;
  averageAqi: number;
  trafficDensity: number;
  historicalPollution: number;
  healthScore: number;
  coordinates: [number, number][]; // [lat, lng]
}

export function calculateHealthScore(aqi: number, trafficDensity: number, historicalPollution: number): number {
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

// Mumbai landmarks for search
export const MUMBAI_PLACES: Record<string, { lat: number; lng: number; name: string }> = {
  "gateway of india": { lat: 18.9220, lng: 72.8347, name: "Gateway of India" },
  "gateway": { lat: 18.9220, lng: 72.8347, name: "Gateway of India" },
  "marine drive": { lat: 18.9432, lng: 72.8235, name: "Marine Drive" },
  "bandra": { lat: 19.0544, lng: 72.8402, name: "Bandra" },
  "bandra worli sea link": { lat: 19.0378, lng: 72.8168, name: "Bandra-Worli Sea Link" },
  "juhu beach": { lat: 19.0948, lng: 72.8267, name: "Juhu Beach" },
  "juhu": { lat: 19.0948, lng: 72.8267, name: "Juhu Beach" },
  "andheri": { lat: 19.1136, lng: 72.8697, name: "Andheri" },
  "dadar": { lat: 19.0178, lng: 72.8478, name: "Dadar" },
  "churchgate": { lat: 18.9322, lng: 72.8264, name: "Churchgate" },
  "cst": { lat: 18.9398, lng: 72.8355, name: "CST (Chhatrapati Shivaji Terminus)" },
  "chhatrapati shivaji terminus": { lat: 18.9398, lng: 72.8355, name: "CST" },
  "worli": { lat: 19.0176, lng: 72.8152, name: "Worli" },
  "powai": { lat: 19.1176, lng: 72.9060, name: "Powai" },
  "malad": { lat: 19.1860, lng: 72.8485, name: "Malad" },
  "goregaon": { lat: 19.1555, lng: 72.8494, name: "Goregaon" },
  "kandivali": { lat: 19.2047, lng: 72.8527, name: "Kandivali" },
  "thane": { lat: 19.2183, lng: 72.9781, name: "Thane" },
  "colaba": { lat: 18.9067, lng: 72.8147, name: "Colaba" },
  "sion": { lat: 19.0408, lng: 72.8617, name: "Sion" },
  "lower parel": { lat: 18.9930, lng: 72.8302, name: "Lower Parel" },
  "mumbai central": { lat: 18.9712, lng: 72.8194, name: "Mumbai Central" },
  "haji ali": { lat: 18.9827, lng: 72.8090, name: "Haji Ali Dargah" },
  "siddhivinayak": { lat: 19.0169, lng: 72.8306, name: "Siddhivinayak Temple" },
  "versova": { lat: 19.1312, lng: 72.8127, name: "Versova" },
  "lokhandwala": { lat: 19.1387, lng: 72.8296, name: "Lokhandwala" },
  "dharavi": { lat: 19.0426, lng: 72.8535, name: "Dharavi" },
  "santacruz": { lat: 19.0816, lng: 72.8417, name: "Santacruz" },
  "vile parle": { lat: 19.0988, lng: 72.8451, name: "Vile Parle" },
  "mumbai airport": { lat: 19.0896, lng: 72.8656, name: "Mumbai Airport" },
  "airport": { lat: 19.0896, lng: 72.8656, name: "Mumbai Airport" },
  "nariman point": { lat: 18.9256, lng: 72.8242, name: "Nariman Point" },
  "mahalaxmi": { lat: 18.9826, lng: 72.8120, name: "Mahalaxmi" },
};

// Borivali coordinates (starting point)
export const BORIVALI: [number, number] = [19.2307, 72.8567];

// Generate realistic-looking routes from Borivali to destination
export function generateMockRoutes(start: [number, number], end: [number, number]): RouteData[] {
  const latDiff = end[0] - start[0];
  const lngDiff = end[1] - start[1];
  const dist = Math.sqrt(latDiff ** 2 + lngDiff ** 2) * 111;

  // Create waypoints for 3 different routes
  const makeWaypoints = (offsets: { latOff: number; lngOff: number }[]): [number, number][] => {
    const points: [number, number][] = [start];
    const steps = offsets.length + 1;
    for (let i = 0; i < offsets.length; i++) {
      const t = (i + 1) / steps;
      points.push([
        start[0] + latDiff * t + offsets[i].latOff,
        start[1] + lngDiff * t + offsets[i].lngOff,
      ]);
    }
    points.push(end);
    return points;
  };

  const routes: RouteData[] = [
    {
      id: "fastest",
      name: "Fastest Route",
      type: "fastest",
      distance: +(dist * 1.0).toFixed(1),
      travelTime: Math.round(dist * 2.8),
      averageAqi: 110 + Math.round(Math.random() * 40),
      trafficDensity: 65 + Math.round(Math.random() * 25),
      historicalPollution: 75 + Math.round(Math.random() * 30),
      healthScore: 0,
      coordinates: makeWaypoints([
        { latOff: 0.005, lngOff: 0.003 },
        { latOff: -0.003, lngOff: 0.005 },
        { latOff: 0.002, lngOff: -0.002 },
      ]),
    },
    {
      id: "cleanest",
      name: "Lowest Pollution",
      type: "lowest_pollution",
      distance: +(dist * 1.4).toFixed(1),
      travelTime: Math.round(dist * 4.2),
      averageAqi: 30 + Math.round(Math.random() * 25),
      trafficDensity: 12 + Math.round(Math.random() * 18),
      historicalPollution: 18 + Math.round(Math.random() * 20),
      healthScore: 0,
      coordinates: makeWaypoints([
        { latOff: -0.015, lngOff: -0.01 },
        { latOff: -0.008, lngOff: -0.015 },
        { latOff: 0.005, lngOff: -0.008 },
      ]),
    },
    {
      id: "balanced",
      name: "Balanced Route",
      type: "balanced",
      distance: +(dist * 1.18).toFixed(1),
      travelTime: Math.round(dist * 3.5),
      averageAqi: 60 + Math.round(Math.random() * 30),
      trafficDensity: 35 + Math.round(Math.random() * 20),
      historicalPollution: 40 + Math.round(Math.random() * 25),
      healthScore: 0,
      coordinates: makeWaypoints([
        { latOff: 0.012, lngOff: -0.006 },
        { latOff: 0.008, lngOff: 0.01 },
        { latOff: -0.004, lngOff: 0.006 },
      ]),
    },
  ];

  return routes.map((r) => ({
    ...r,
    healthScore: Math.round(calculateHealthScore(r.averageAqi, r.trafficDensity, r.historicalPollution)),
  }));
}

export function generateWeeklyAqi(): { day: string; aqi: number }[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({ day, aqi: Math.round(30 + Math.random() * 120) }));
}

export function generateDailyIntervals(): { time: string; aqi: number }[] {
  const intervals: { time: string; aqi: number }[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const base = h >= 7 && h <= 9 ? 90 : h >= 17 && h <= 19 ? 100 : 40;
      intervals.push({
        time: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
        aqi: Math.round(base + Math.random() * 40),
      });
    }
  }
  return intervals;
}

export function generateDailyTrend(): { day: string; avg: number; max: number; min: number }[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => {
    const avg = Math.round(40 + Math.random() * 80);
    return { day, avg, max: avg + Math.round(Math.random() * 40), min: Math.max(10, avg - Math.round(Math.random() * 30)) };
  });
}

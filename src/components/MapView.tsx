import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { RouteData, getMapboxColor } from "@/lib/routeScoring";

// Free public token for demo - users should replace with their own
mapboxgl.accessToken = "pk.eyJ1IjoibG92YWJsZWRlbW8iLCJhIjoiY2x0N3F2OXE0MDFtNTJrcGR5ZDFpYXl1aCJ9.ZoFBRKJCpCMjMXHCdfFv2w";

interface MapViewProps {
  routes: RouteData[];
  selectedRoute: string | null;
  onSelectRoute: (id: string) => void;
  showHeatmap: boolean;
  userLocation: [number, number];
}

const MapView = ({ routes, selectedRoute, onSelectRoute, showHeatmap, userLocation }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: userLocation,
      zoom: 13,
      pitch: 45,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // User location marker
    const el = document.createElement("div");
    el.className = "w-4 h-4 rounded-full bg-[#2ECC71] border-2 border-white shadow-lg animate-pulse";
    new mapboxgl.Marker(el).setLngLat(userLocation).addTo(map.current);

    map.current.on("load", () => setMapLoaded(true));

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [userLocation]);

  // Draw routes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing route layers
    routes.forEach((r) => {
      if (map.current!.getLayer(`route-${r.id}`)) map.current!.removeLayer(`route-${r.id}`);
      if (map.current!.getSource(`route-${r.id}`)) map.current!.removeSource(`route-${r.id}`);
    });

    routes.forEach((route) => {
      const color = getMapboxColor(route.healthScore);
      const isSelected = route.id === selectedRoute;

      map.current!.addSource(`route-${route.id}`, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route.coordinates,
          },
        },
      });

      map.current!.addLayer({
        id: `route-${route.id}`,
        type: "line",
        source: `route-${route.id}`,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": color,
          "line-width": isSelected ? 6 : 3,
          "line-opacity": isSelected ? 1 : 0.5,
        },
      });

      map.current!.on("click", `route-${route.id}`, () => onSelectRoute(route.id));
      map.current!.on("mouseenter", `route-${route.id}`, () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });
      map.current!.on("mouseleave", `route-${route.id}`, () => {
        map.current!.getCanvas().style.cursor = "";
      });
    });
  }, [routes, selectedRoute, mapLoaded, onSelectRoute]);

  // Heatmap layer
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (map.current.getLayer("pollution-heat")) map.current.removeLayer("pollution-heat");
    if (map.current.getSource("pollution-data")) map.current.removeSource("pollution-data");

    if (showHeatmap) {
      // Generate random pollution points around user location
      const points = Array.from({ length: 80 }, () => ({
        type: "Feature" as const,
        properties: { intensity: Math.random() },
        geometry: {
          type: "Point" as const,
          coordinates: [
            userLocation[0] + (Math.random() - 0.5) * 0.04,
            userLocation[1] + (Math.random() - 0.5) * 0.04,
          ],
        },
      }));

      map.current.addSource("pollution-data", {
        type: "geojson",
        data: { type: "FeatureCollection", features: points },
      });

      map.current.addLayer({
        id: "pollution-heat",
        type: "heatmap",
        source: "pollution-data",
        paint: {
          "heatmap-weight": ["get", "intensity"],
          "heatmap-radius": 30,
          "heatmap-color": [
            "interpolate", ["linear"], ["heatmap-density"],
            0, "rgba(0,0,0,0)",
            0.3, "rgba(46,204,113,0.4)",
            0.6, "rgba(241,196,15,0.6)",
            1, "rgba(231,76,60,0.8)",
          ],
          "heatmap-opacity": 0.7,
        },
      });
    }
  }, [showHeatmap, mapLoaded, userLocation]);

  return (
    <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
  );
};

export default MapView;

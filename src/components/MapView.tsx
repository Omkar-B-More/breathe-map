import { useEffect, useRef, useState, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RouteData, getMapboxColor } from "@/lib/routeScoring";

// Fix default marker icon
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const userIcon = new L.DivIcon({
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#2ECC71;border:3px solid white;box-shadow:0 0 10px rgba(46,204,113,0.5);"></div>',
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const destIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapViewProps {
  routes: RouteData[];
  selectedRoute: string | null;
  onSelectRoute: (id: string) => void;
  showHeatmap: boolean;
  userLocation: [number, number]; // [lat, lng]
  destination: [number, number] | null;
  destinationName: string;
}

// Component to re-center map when location changes
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Heatmap circles
function HeatmapLayer({ center, show }: { center: [number, number]; show: boolean }) {
  const points = useMemo(() => {
    if (!show) return [];
    return Array.from({ length: 60 }, () => {
      const intensity = Math.random();
      const color = intensity < 0.33 ? "#2ECC71" : intensity < 0.66 ? "#F1C40F" : "#E74C3C";
      return {
        lat: center[0] + (Math.random() - 0.5) * 0.06,
        lng: center[1] + (Math.random() - 0.5) * 0.06,
        radius: 150 + Math.random() * 300,
        color,
        opacity: 0.25 + intensity * 0.3,
      };
    });
  }, [center, show]);

  if (!show) return null;
  return (
    <>
      {points.map((p, i) => (
        <Circle
          key={i}
          center={[p.lat, p.lng]}
          radius={p.radius}
          pathOptions={{ color: p.color, fillColor: p.color, fillOpacity: p.opacity, weight: 0 }}
        />
      ))}
    </>
  );
}

const MapView = ({ routes, selectedRoute, onSelectRoute, showHeatmap, userLocation, destination, destinationName }: MapViewProps) => {
  return (
    <MapContainer
      center={userLocation}
      zoom={13}
      className="absolute inset-0 w-full h-full z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap center={userLocation} />

      {/* User location marker */}
      <Marker position={userLocation} icon={userIcon}>
        <Popup>📍 Borivali, Mumbai</Popup>
      </Marker>

      {/* Destination marker */}
      {destination && (
        <Marker position={destination} icon={destIcon}>
          <Popup>🎯 {destinationName}</Popup>
        </Marker>
      )}

      {/* Route lines */}
      {routes.map((route) => {
        const color = getMapboxColor(route.healthScore);
        const isSelected = route.id === selectedRoute;
        return (
          <Polyline
            key={route.id}
            positions={route.coordinates.map(([lat, lng]): [number, number] => [lat, lng])}
            pathOptions={{
              color,
              weight: isSelected ? 6 : 3,
              opacity: isSelected ? 1 : 0.5,
            }}
            eventHandlers={{ click: () => onSelectRoute(route.id) }}
          />
        );
      })}

      {/* Heatmap */}
      <HeatmapLayer center={userLocation} show={showHeatmap} />
    </MapContainer>
  );
};

export default MapView;

import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "@/components/MapView";
import SearchBar from "@/components/SearchBar";
import RouteCard from "@/components/RouteCard";
import ModeToggle, { TravelMode } from "@/components/ModeToggle";
import AqiBadge from "@/components/AqiBadge";
import { generateMockRoutes, RouteData } from "@/lib/routeScoring";
import { Layers, BarChart3, Leaf } from "lucide-react";

const DEFAULT_LOCATION: [number, number] = [-73.985, 40.748]; // NYC

const Index = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<TravelMode>("drive");
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);

  const currentAqi = useMemo(() => Math.round(40 + Math.random() * 60), []);

  const handleSearch = useCallback((query: string) => {
    // Simulate destination offset
    const dest: [number, number] = [
      DEFAULT_LOCATION[0] + (Math.random() - 0.5) * 0.03,
      DEFAULT_LOCATION[1] + (Math.random() - 0.5) * 0.03,
    ];
    const newRoutes = generateMockRoutes(DEFAULT_LOCATION, dest);
    setRoutes(newRoutes);
    setSelectedRoute("cleanest");
    setShowRoutes(true);
  }, []);

  const handleFindHealthiest = useCallback(() => {
    const dest: [number, number] = [
      DEFAULT_LOCATION[0] + 0.012,
      DEFAULT_LOCATION[1] + 0.008,
    ];
    const newRoutes = generateMockRoutes(DEFAULT_LOCATION, dest);
    setRoutes(newRoutes);
    setSelectedRoute("cleanest");
    setShowRoutes(true);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Map */}
      <MapView
        routes={routes}
        selectedRoute={selectedRoute}
        onSelectRoute={setSelectedRoute}
        showHeatmap={showHeatmap}
        userLocation={DEFAULT_LOCATION}
      />

      {/* Top overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Leaf className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-foreground text-lg">BreatheMap</span>
        </div>
        <SearchBar onSearch={handleSearch} />
        <div className="flex items-center justify-between">
          <ModeToggle mode={mode} onChange={setMode} />
          <div className="flex gap-2">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`glass rounded-xl p-2.5 transition-all ${showHeatmap ? "ring-2 ring-primary" : ""}`}
              title="Toggle pollution heatmap"
            >
              <Layers className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="glass rounded-xl p-2.5 hover:shadow-float transition-shadow"
              title="Analytics"
            >
              <BarChart3 className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 space-y-3 animate-slide-up">
        {!showRoutes && (
          <>
            <AqiBadge aqi={currentAqi} />
            <button
              onClick={handleFindHealthiest}
              className="w-full bg-primary text-primary-foreground font-display font-semibold py-4 rounded-2xl shadow-glow hover:opacity-90 transition-opacity animate-pulse-green text-sm"
            >
              🌿 Find Healthiest Route
            </button>
          </>
        )}

        {showRoutes && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground font-body">
                {mode === "jog" ? "🏃 Jogger Mode – Parks prioritized" : mode === "cycle" ? "🚴 Cyclist Mode – Bike lanes prioritized" : "🚗 Driving Mode"}
              </p>
              <button
                onClick={() => { setShowRoutes(false); setRoutes([]); }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            </div>
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                isSelected={selectedRoute === route.id}
                onSelect={() => setSelectedRoute(route.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

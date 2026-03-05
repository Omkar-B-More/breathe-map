import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "@/components/MapView";
import SearchBar from "@/components/SearchBar";
import RouteCard from "@/components/RouteCard";
import ModeToggle, { TravelMode } from "@/components/ModeToggle";
import AqiBadge from "@/components/AqiBadge";
import { generateMockRoutes, RouteData, BORIVALI, MUMBAI_PLACES } from "@/lib/routeScoring";
import { Layers, BarChart3, Leaf } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<TravelMode>("drive");
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [destinationName, setDestinationName] = useState("");

  const currentAqi = useMemo(() => Math.round(40 + Math.random() * 60), []);

  const handleSearch = useCallback((query: string) => {
    const key = query.toLowerCase().trim();
    const place = Object.entries(MUMBAI_PLACES).find(([k]) => key.includes(k) || k.includes(key));

    if (place) {
      const [, info] = place;
      const dest: [number, number] = [info.lat, info.lng];
      setDestination(dest);
      setDestinationName(info.name);
      const newRoutes = generateMockRoutes(BORIVALI, dest);
      setRoutes(newRoutes);
      setSelectedRoute("cleanest");
      setShowRoutes(true);
      toast.success(`Route from Borivali → ${info.name}`);
    } else {
      toast.error(`"${query}" not found in Mumbai. Try: Gateway of India, Marine Drive, Bandra, Juhu, Andheri...`);
    }
  }, []);

  const handleFindHealthiest = useCallback(() => {
    // Default: route to Marine Drive
    const dest: [number, number] = [18.9432, 72.8235];
    setDestination(dest);
    setDestinationName("Marine Drive");
    const newRoutes = generateMockRoutes(BORIVALI, dest);
    setRoutes(newRoutes);
    setSelectedRoute("cleanest");
    setShowRoutes(true);
    toast.success("Healthiest route from Borivali → Marine Drive");
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <MapView
        routes={routes}
        selectedRoute={selectedRoute}
        onSelectRoute={setSelectedRoute}
        showHeatmap={showHeatmap}
        userLocation={BORIVALI}
        destination={destination}
        destinationName={destinationName}
      />

      {/* Top overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Leaf className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-foreground text-lg">BreatheMap</span>
          <span className="text-[10px] text-muted-foreground ml-1">Mumbai</span>
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
      <div className="absolute bottom-0 left-0 right-0 z-[1000] p-4 space-y-3 animate-slide-up">
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
                {mode === "jog" ? "🏃 Jogger – Parks prioritized" : mode === "cycle" ? "🚴 Cyclist – Bike lanes" : "🚗 Driving"}
                {destinationName && <span className="ml-1 font-medium text-foreground">· Borivali → {destinationName}</span>}
              </p>
              <button
                onClick={() => { setShowRoutes(false); setRoutes([]); setDestination(null); }}
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

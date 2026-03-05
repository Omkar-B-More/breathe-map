import { RouteData, getScoreColor, getScoreLabel } from "@/lib/routeScoring";
import { Clock, Navigation, Wind, Heart } from "lucide-react";

interface RouteCardProps {
  route: RouteData;
  isSelected: boolean;
  onSelect: () => void;
}

const colorMap = {
  green: "bg-aqi-green",
  yellow: "bg-aqi-yellow",
  red: "bg-aqi-red",
};

const textColorMap = {
  green: "aqi-green",
  yellow: "aqi-yellow",
  red: "aqi-red",
};

const RouteCard = ({ route, isSelected, onSelect }: RouteCardProps) => {
  const color = getScoreColor(route.healthScore);
  const label = getScoreLabel(route.healthScore);

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left glass rounded-xl p-4 transition-all duration-200 ${
        isSelected ? "ring-2 ring-primary shadow-glow" : "hover:shadow-float"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-sm text-foreground">{route.name}</h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorMap[color]} text-primary-foreground`}>
          {label}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="flex flex-col items-center gap-1">
          <Navigation className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{route.distance} km</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{route.travelTime} min</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Wind className="w-3.5 h-3.5 text-muted-foreground" />
          <span className={textColorMap[color]}>AQI {route.averageAqi}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-muted-foreground" />
          <span className={textColorMap[color]}>{route.healthScore}</span>
        </div>
      </div>
    </button>
  );
};

export default RouteCard;

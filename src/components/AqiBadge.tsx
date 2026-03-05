import { Wind } from "lucide-react";
import { getScoreColor, getScoreLabel } from "@/lib/routeScoring";

interface AqiBadgeProps {
  aqi: number;
}

const bgMap = {
  green: "bg-aqi-green/15 border-aqi-green/30",
  yellow: "bg-aqi-yellow/15 border-aqi-yellow/30",
  red: "bg-aqi-red/15 border-aqi-red/30",
};

const textMap = {
  green: "aqi-green",
  yellow: "aqi-yellow",
  red: "aqi-red",
};

const AqiBadge = ({ aqi }: AqiBadgeProps) => {
  const color = getScoreColor(aqi);
  return (
    <div className={`glass rounded-2xl p-4 border ${bgMap[color]} flex items-center gap-3`}>
      <div className={`p-2 rounded-xl ${color === "green" ? "bg-aqi-green" : color === "yellow" ? "bg-aqi-yellow" : "bg-aqi-red"}`}>
        <Wind className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-body">Current AQI</p>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-display font-bold ${textMap[color]}`}>{aqi}</span>
          <span className={`text-xs font-medium ${textMap[color]}`}>{getScoreLabel(aqi)}</span>
        </div>
      </div>
    </div>
  );
};

export default AqiBadge;

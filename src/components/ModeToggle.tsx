import { Bike, Footprints, Car } from "lucide-react";

export type TravelMode = "drive" | "jog" | "cycle";

interface ModeToggleProps {
  mode: TravelMode;
  onChange: (mode: TravelMode) => void;
}

const modes: { key: TravelMode; label: string; icon: typeof Car }[] = [
  { key: "drive", label: "Drive", icon: Car },
  { key: "jog", label: "Jog", icon: Footprints },
  { key: "cycle", label: "Cycle", icon: Bike },
];

const ModeToggle = ({ mode, onChange }: ModeToggleProps) => (
  <div className="glass rounded-xl p-1 flex gap-1">
    {modes.map(({ key, label, icon: Icon }) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
          mode === key
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon className="w-3.5 h-3.5" />
        {label}
      </button>
    ))}
  </div>
);

export default ModeToggle;
